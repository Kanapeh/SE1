# 🔍 عیب‌یابی مشکل دسترسی ادمین

## 🚨 مشکل فعلی
پس از اجرای اسکریپت SQL، هنوز خطای زیر رخ می‌دهد:
```
❌ Error counting teachers: {}
```

## 🔍 مراحل عیب‌یابی

### مرحله 1: بررسی وضعیت فعلی
فایل `database/check_current_status.sql` را در Supabase اجرا کنید:

1. به Supabase Dashboard بروید
2. SQL Editor را باز کنید
3. محتوای `check_current_status.sql` را کپی کنید
4. اجرا کنید و نتایج را بررسی کنید

### مرحله 2: بررسی نتایج

#### ✅ نتایج مورد انتظار:
- **Table exists**: `true`
- **RLS enabled**: `true`
- **Policies count**: حداقل 3
- **Admin users count**: حداقل 1
- **Direct access test**: تعداد معلمان

#### ❌ مشکلات احتمالی:

##### مشکل 1: RLS فعال نیست
```
RLS enabled: false
```
**راه‌حل**: 
```sql
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
```

##### مشکل 2: Policies وجود ندارند
```
Policies count: 0
```
**راه‌حل**: اسکریپت `fix_admin_access_to_existing_teachers.sql` را دوباره اجرا کنید

##### مشکل 3: کاربر ادمین نیست
```
Admin users count: 0
```
**راه‌حل**: اسکریپت `add_current_user_as_admin_simple.sql` را اجرا کنید

##### مشکل 4: جدول admins وجود ندارد
```
Admins table exists: false
```
**راه‌حل**: اسکریپت `fix_admin_access_to_existing_teachers.sql` را دوباره اجرا کنید

### مرحله 3: بررسی Policies

#### Policies مورد نیاز:
1. **"Admins can access all teachers"** - برای ادمین‌ها
2. **"Teachers can access own profile"** - برای معلمان
3. **"Public read access to teachers"** - برای خواندن عمومی

#### بررسی Policy ادمین:
```sql
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'teachers' 
AND policyname = 'Admins can access all teachers';
```

### مرحله 4: تست دسترسی

#### تست 1: دسترسی مستقیم
```sql
SELECT COUNT(*) FROM public.teachers;
```

#### تست 2: دسترسی با RLS
```sql
-- این query باید کار کند اگر ادمین باشید
SELECT COUNT(*) FROM public.teachers;
```

#### تست 3: بررسی کاربر فعلی
```sql
SELECT current_user, session_user;
```

### مرحله 5: راه‌حل‌های احتمالی

#### راه‌حل 1: غیرفعال کردن موقت RLS
```sql
-- فقط برای تست - در تولید استفاده نکنید
ALTER TABLE public.teachers DISABLE ROW LEVEL SECURITY;
```

#### راه‌حل 2: ایجاد Policy ساده
```sql
-- Policy ساده برای ادمین‌ها
CREATE POLICY "Simple admin access" ON public.teachers
    FOR ALL
    TO authenticated
    USING (true);
```

#### راه‌حل 3: بررسی authentication
```sql
-- بررسی کاربران احراز شده
SELECT * FROM auth.users WHERE email = 'your-email@example.com';
```

### مرحله 6: بررسی Console مرورگر

1. F12 را فشار دهید
2. به تب Console بروید
3. صفحه `/admin/teachers` را refresh کنید
4. تمام log ها را بررسی کنید

#### Log های مهم:
- `🔌 Testing Supabase connection...`
- `👤 Current user: ...`
- `🧪 Testing basic table access...`
- `📊 Count query result: ...`

### مرحله 7: بررسی Network

1. در Console، به تب Network بروید
2. صفحه را refresh کنید
3. درخواست‌های Supabase را بررسی کنید
4. خطاهای HTTP را چک کنید

## 🚨 خطاهای رایج

### خطای "permission denied" (42501)
- RLS فعال است اما policies درست تنظیم نشده‌اند
- کاربر ادمین نیست

### خطای "relation does not exist" (42P01)
- جدول وجود ندارد
- نام جدول اشتباه است

### خطای "column does not exist" (42703)
- ساختار جدول تغییر کرده
- نام فیلد اشتباه است

### خطای "{}" (خالی)
- خطای Supabase درست parse نشده
- مشکل در connection یا authentication

## 🔧 راه‌حل نهایی

اگر همه چیز درست است اما هنوز کار نمی‌کند:

1. **Supabase را restart کنید**
2. **Browser cache را پاک کنید**
3. **Supabase client را دوباره initialize کنید**
4. **از incognito mode استفاده کنید**

## 📞 در صورت مشکل

### اطلاعات مورد نیاز:
- نتایج `check_current_status.sql`
- Console logs کامل
- Network errors
- کد خطای دقیق

### تماس با پشتیبانی:
- تمام اطلاعات بالا را جمع‌آوری کنید
- تصویر از صفحه خطا بگیرید
- خطای دقیق را کپی کنید
