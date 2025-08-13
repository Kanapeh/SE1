# راهنمای حل مشکل جدول auth-users

## مشکل
وقتی کاربران با Google OAuth ثبت‌نام می‌کنند، فقط در جدول `auth.users` (جدول داخلی Supabase) ثبت می‌شوند، اما در جدول `auth-users` (جدول سفارشی شما) ثبت نمی‌شوند.

## دلیل مشکل
- جدول `auth.users` به طور خودکار توسط Supabase مدیریت می‌شود
- جدول `auth-users` جدول سفارشی شماست که نیاز به trigger دارد
- هیچ مکانیزمی برای همگام‌سازی خودکار بین این دو جدول وجود ندارد

## راه حل

### مرحله 1: اجرای اسکریپت SQL
به **Supabase Dashboard** بروید و در **SQL Editor** این کد را اجرا کنید:

```sql
-- Quick fix for auth-users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."auth-users" (
    id, email, full_name, avatar_url, role, created_at, updated_at, is_admin, first_name, last_name
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    'student',
    NEW.created_at,
    NEW.updated_at,
    false,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = EXCLUDED.updated_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Migrate existing users
INSERT INTO public."auth-users" (
  id, email, full_name, avatar_url, role, created_at, updated_at, is_admin, first_name, last_name
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name'),
  au.raw_user_meta_data->>'avatar_url',
  'student',
  au.created_at,
  au.updated_at,
  false,
  au.raw_user_meta_data->>'first_name',
  au.raw_user_meta_data->>'last_name'
FROM auth.users au
LEFT JOIN public."auth-users" aup ON au.id = aup.id
WHERE aup.id IS NULL
ON CONFLICT (id) DO NOTHING;
```

### مرحله 2: بررسی عملکرد
بعد از اجرای اسکریپت، این کوئری را اجرا کنید تا مطمئن شوید trigger ایجاد شده:

```sql
-- Check if trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check user counts
SELECT 
  'auth.users' as table_name,
  COUNT(*) as user_count
FROM auth.users
UNION ALL
SELECT 
  'auth-users' as table_name,
  COUNT(*) as user_count
FROM public."auth-users";
```

### مرحله 3: تست
1. **کاربر جدیدی با Google OAuth ثبت‌نام کنید**
2. **بررسی کنید که در هر دو جدول ثبت شده باشد**
3. **Console را چک کنید تا ببینید trigger کار می‌کند**

## فایل‌های آماده شده

### 1. `database/quick_fix_auth_users.sql`
اسکریپت سریع برای حل مشکل

### 2. `database/fix_auth_users_trigger.sql`
اسکریپت کامل با جزئیات بیشتر

## نحوه کارکرد Trigger

```mermaid
graph TD
    A[User signs up with Google OAuth] --> B[Supabase creates record in auth.users]
    B --> C[Trigger fires automatically]
    C --> D[Function handle_new_user() executes]
    D --> E[Insert record into auth-users table]
    E --> F[User appears in both tables]
```

## فیلدهای پر شده

| فیلد | منبع | توضیح |
|------|-------|-------|
| `id` | `auth.users.id` | UUID کاربر |
| `email` | `auth.users.email` | ایمیل کاربر |
| `full_name` | `raw_user_meta_data.full_name` یا `raw_user_meta_data.name` | نام کامل |
| `avatar_url` | `raw_user_meta_data.avatar_url` | آواتار گوگل |
| `role` | پیش‌فرض | `'student'` |
| `is_admin` | پیش‌فرض | `false` |
| `first_name` | `raw_user_meta_data.first_name` | نام |
| `last_name` | `raw_user_meta_data.last_name` | نام خانوادگی |

## عیب‌یابی

### مشکل: Trigger ایجاد نمی‌شود
```sql
-- Check permissions
SELECT has_function_privilege('anon', 'public.handle_new_user()', 'EXECUTE');
SELECT has_function_privilege('authenticated', 'public.handle_new_user()', 'EXECUTE');
```

### مشکل: کاربران موجود منتقل نمی‌شوند
```sql
-- Manual migration
INSERT INTO public."auth-users" (id, email, full_name, role, created_at, updated_at, is_admin)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'), 'student', created_at, updated_at, false
FROM auth.users
WHERE id NOT IN (SELECT id FROM public."auth-users");
```

### مشکل: خطای permission
```sql
-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public."auth-users" TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;
```

## نکات مهم

1. **Trigger فقط برای کاربران جدید کار می‌کند**
2. **کاربران موجود باید به صورت دستی منتقل شوند**
3. **بعد از ایجاد trigger، همه کاربران جدید به طور خودکار در هر دو جدول ثبت می‌شوند**
4. **اگر جدول `auth-users` تغییر کند، trigger باید به‌روزرسانی شود**

## بعد از حل مشکل

1. **PKCE flow باید به درستی کار کند**
2. **کاربران در جدول `auth-users` ظاهر شوند**
3. **Authentication flow کامل شود**
4. **User role checking کار کند**

## تست نهایی

```sql
-- Test with a new user registration
-- 1. Sign up with Google OAuth
-- 2. Check both tables
SELECT 
  au.id,
  au.email,
  aup.role,
  aup.full_name
FROM auth.users au
LEFT JOIN public."auth-users" aup ON au.id = aup.id
WHERE au.email = 'test@example.com';
```
