# سیستم کنترل دسترسی ادمین

## خلاصه

این سیستم تضمین می‌کند که تنها کاربرانی که در جدول `admins` ثبت شده‌اند بتوانند به صفحات و API های ادمین دسترسی داشته باشند.

## ساختار جداول

### جدول admins
```sql
CREATE TABLE public.admins (
  user_id uuid NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  full_name text NULL,
  role text NULL DEFAULT 'admin'::text,
  CONSTRAINT admins_pkey PRIMARY KEY (user_id),
  CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);
```

### جدول auth-users
```sql
CREATE TABLE public."auth-users" (
  id uuid NOT NULL,
  email text NULL,
  first_name text NULL,
  last_name text NULL,
  phone text NULL,
  -- سایر فیلدها...
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);
```

## منطق تشخیص ادمین

سیستم از جدول `admins` برای تشخیص ادمین استفاده می‌کند:

1. **بررسی وجود در جدول admins:** اگر کاربر در جدول `admins` وجود داشته باشد، ادمین است
2. **نقش‌های دیگر:** برای نقش‌های `teacher` و `student` از جدول `auth-users` استفاده می‌شود

```typescript
// بررسی دسترسی ادمین
const { data: adminProfile } = await supabase
  .from('admins')
  .select('*')
  .eq('user_id', user.id)
  .single();

if (adminProfile) {
  // کاربر ادمین است
}
```

## لایه‌های امنیتی

### 1. Middleware (لایه اول)
- **فایل:** `middleware.ts`
- **عملکرد:** بررسی دسترسی در سطح سرور قبل از بارگذاری صفحه
- **محافظت:** تمام مسیرهای `/admin/*`
- **اقدامات:**
  - اگر کاربر لاگین نباشد → انتقال به `/login`
  - اگر کاربر در جدول `admins` نباشد → انتقال به `/dashboard`

### 2. Layout Protection (لایه دوم)
- **فایل:** `app/admin/layout.tsx`
- **عملکرد:** بررسی دسترسی در سطح کامپوننت layout
- **محافظت:** تمام صفحات ادمین
- **اقدامات:** انتقال خودکار در صورت عدم دسترسی

### 3. Client-Side Protection (لایه سوم)
- **فایل:** `hooks/useAdminAccess.ts`
- **عملکرد:** بررسی دسترسی در سمت کلاینت
- **محافظت:** کامپوننت‌های client-side
- **اقدامات:** نمایش loading و انتقال خودکار

### 4. API Protection (لایه چهارم)
- **فایل:** `lib/api-utils.ts`
- **عملکرد:** بررسی دسترسی در API routes
- **محافظت:** تمام API های ادمین
- **اقدامات:** بازگشت خطای 401/403

## فایل‌های کلیدی

### `lib/auth-utils.ts`
```typescript
// توابع سرور-ساید برای بررسی دسترسی
export async function checkAdminAccess()
export async function getCurrentUser()
export async function getUserRole(userId: string)
export async function isUserAdmin(userId: string)
export async function getAdminProfile(userId: string)
```

### `lib/api-utils.ts`
```typescript
// توابع برای API routes
export async function checkAdminAccessAPI()
export async function checkUserAccessAPI()
```

### `hooks/useAdminAccess.ts`
```typescript
// Hook کلاینت-ساید
export function useAdminAccess()
```

## نحوه استفاده

### در Server Components:
```typescript
import { checkAdminAccess } from '@/lib/auth-utils';

export default async function AdminPage() {
  await checkAdminAccess(); // انتقال خودکار در صورت عدم دسترسی
  // محتوای صفحه
}
```

### در Client Components:
```typescript
import { useAdminAccess } from '@/hooks/useAdminAccess';

export default function AdminComponent() {
  const { isAdmin, loading } = useAdminAccess();
  
  if (loading) return <div>در حال بارگذاری...</div>;
  if (!isAdmin) return null; // انتقال خودکار
  
  return <div>محتوای ادمین</div>;
}
```

### در API Routes:
```typescript
import { checkAdminAccessAPI } from '@/lib/api-utils';

export async function POST(request: Request) {
  const { error: adminError, user } = await checkAdminAccessAPI();
  if (adminError) return adminError;
  
  // ادامه منطق API
}
```

## نقش‌های کاربری

- **admin:** ادمین (دسترسی کامل) - از جدول `admins`
- **teacher:** معلم (دسترسی متوسط) - از جدول `auth-users`
- **student:** دانشجو (دسترسی محدود) - از جدول `auth-users`

## مسیرهای محافظت شده

تمام مسیرهای زیر محافظت شده‌اند:
- `/admin`
- `/admin/requests`
- `/admin/courses`
- `/admin/pricing`
- `/admin/blog`
- `/admin/settings`
- `/admin/students`
- `/admin/messages`
- `/admin/comments`

## API های محافظت شده

تمام API های زیر محافظت شده‌اند:
- `/api/admin/*`
- `/api/courses` (عملیات write)
- `/api/requests` (عملیات write)
- `/api/settings` (عملیات write)

## پیام‌های خطا

### 401 Unauthorized
- کاربر لاگین نیست
- توکن منقضی شده

### 403 Forbidden
- کاربر ادمین نیست
- دسترسی کافی ندارد

### 404 Not Found
- پروفایل کاربر یافت نشد

## تست سیستم

### 1. تست کاربر غیرمجاز:
```bash
# با کاربر student وارد شوید
# سعی کنید به /admin بروید
# باید به /dashboard منتقل شوید
```

### 2. تست کاربر غیرلاگین:
```bash
# بدون لاگین سعی کنید به /admin بروید
# باید به /login منتقل شوید
```

### 3. تست API:
```bash
# با کاربر غیرادمین API ادمین را فراخوانی کنید
# باید خطای 403 دریافت کنید
```

## نکات امنیتی

1. **همیشه از HTTPS استفاده کنید**
2. **توکن‌ها را به صورت امن ذخیره کنید**
3. **لاگ تمام تلاش‌های دسترسی غیرمجاز**
4. **به‌روزرسانی منظم نقش‌های کاربری**
5. **استفاده از Rate Limiting**

## عیب‌یابی

### مشکل: کاربر ادمین نمی‌تواند وارد شود
**راه‌حل:**
1. بررسی وجود کاربر در جدول `admins`
2. بررسی صحت UUID کاربر
3. بررسی لاگ‌های سرور

```sql
-- بررسی ادمین‌ها
SELECT a.*, u.email 
FROM admins a 
LEFT JOIN auth.users u ON a.user_id = u.id;
```

### مشکل: انتقال بی‌نهایت
**راه‌حل:**
1. بررسی تنظیمات middleware
2. بررسی redirect loops
3. پاک کردن cache مرورگر

### مشکل: API خطای 500 می‌دهد
**راه‌حل:**
1. بررسی اتصال به Supabase
2. بررسی مجوزهای جدول
3. بررسی لاگ‌های سرور

## به‌روزرسانی‌های آینده

- [ ] اضافه کردن Role-Based Access Control (RBAC) پیشرفته
- [ ] لاگ کردن تمام فعالیت‌های ادمین
- [ ] اضافه کردن Two-Factor Authentication
- [ ] سیستم اعلان برای فعالیت‌های مشکوک
