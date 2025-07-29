# راهنمای راه‌اندازی سیستم کنترل دسترسی ادمین

## مراحل راه‌اندازی

### مرحله 1: اجرای اسکریپت SQL

1. به Supabase Dashboard بروید
2. به بخش SQL Editor بروید
3. فایل `database/update_auth_users_admin.sql` را کپی کنید
4. اسکریپت را اجرا کنید

این اسکریپت:
- فیلدهای `role` و `is_admin` را به جدول `auth-users` اضافه می‌کند (اگر وجود ندارند)
- RLS (Row Level Security) policies را تنظیم می‌کند
- توابع کمکی برای بررسی نقش‌ها ایجاد می‌کند

### مرحله 2: ایجاد کاربر ادمین

پس از اجرای اسکریپت SQL، یک کاربر ادمین ایجاد کنید:

#### روش 1: از طریق Supabase Auth + SQL
1. ابتدا کاربر را در Supabase Auth ایجاد کنید
2. UUID کاربر را کپی کنید
3. فایل `database/create_admin_user.sql` را اجرا کنید و UUID را جایگزین کنید

#### روش 2: به‌روزرسانی کاربر موجود
```sql
-- در SQL Editor اجرا کنید
UPDATE "auth-users" 
SET 
  role = 'admin',
  is_admin = true,
  updated_at = NOW()
WHERE email = 'admin@example.com';
```

### مرحله 3: بررسی فایل‌های ایجاد شده

سیستم شامل این فایل‌های جدید است:

```
lib/
├── auth-utils.ts          # توابع سرور-ساید
├── api-utils.ts           # توابع API
└── supabase-admin.ts      # کلاینت ادمین

hooks/
└── useAdminAccess.ts      # Hook کلاینت-ساید

components/
└── AdminAccessTest.tsx    # کامپوننت تست

database/
├── update_auth_users_admin.sql  # اسکریپت SQL
└── create_admin_user.sql        # اسکریپت ایجاد ادمین

docs/
├── ADMIN_ACCESS_CONTROL.md # مستندات کامل
└── README_ADMIN_SETUP.md   # این فایل
```

## تست سیستم

### تست 1: بررسی دسترسی ادمین

1. با کاربر ادمین وارد شوید
2. به `/admin` بروید
3. باید صفحه ادمین نمایش داده شود

### تست 2: بررسی عدم دسترسی

1. با کاربر غیرادمین وارد شوید
2. سعی کنید به `/admin` بروید
3. باید به `/dashboard` منتقل شوید

### تست 3: تست API

```bash
# با کاربر غیرادمین
curl -X POST /api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password","role":"student"}'

# باید خطای 403 دریافت کنید
```

## نحوه استفاده

### در Server Components

```typescript
import { checkAdminAccess } from '@/lib/auth-utils';

export default async function AdminPage() {
  await checkAdminAccess(); // انتقال خودکار در صورت عدم دسترسی
  
  return (
    <div>
      <h1>صفحه ادمین</h1>
      {/* محتوای صفحه */}
    </div>
  );
}
```

### در Client Components

```typescript
import { useAdminAccess } from '@/hooks/useAdminAccess';

export default function AdminComponent() {
  const { isAdmin, loading } = useAdminAccess();
  
  if (loading) return <div>در حال بارگذاری...</div>;
  if (!isAdmin) return null;
  
  return (
    <div>
      <h1>کامپوننت ادمین</h1>
      {/* محتوای کامپوننت */}
    </div>
  );
}
```

### در API Routes

```typescript
import { checkAdminAccessAPI } from '@/lib/api-utils';

export async function POST(request: Request) {
  const { error: adminError, user } = await checkAdminAccessAPI();
  if (adminError) return adminError;
  
  // ادامه منطق API
  const data = await request.json();
  // ...
}
```

## نقش‌های کاربری

### student (دانشجو)
- دسترسی به دوره‌ها
- دسترسی به پروفایل خود
- عدم دسترسی به صفحات ادمین

### teacher (معلم)
- دسترسی به دوره‌های خود
- دسترسی به دانشجویان خود
- عدم دسترسی به صفحات ادمین

### admin (ادمین)
- دسترسی کامل به تمام بخش‌ها
- مدیریت کاربران
- مدیریت دوره‌ها
- مدیریت سیستم

## روش‌های تشخیص ادمین

سیستم از دو روش برای تشخیص ادمین استفاده می‌کند:

1. **فیلد `role`:** اگر مقدار آن `'admin'` باشد
2. **فیلد `is_admin`:** اگر مقدار آن `true` باشد

```sql
-- بررسی کاربران ادمین
SELECT * FROM "auth-users" 
WHERE role = 'admin' OR is_admin = true;
```

## مسیرهای محافظت شده

تمام مسیرهای زیر محافظت شده‌اند:

```
/admin/*
├── /admin
├── /admin/requests
├── /admin/courses
├── /admin/pricing
├── /admin/blog
├── /admin/settings
├── /admin/students
├── /admin/messages
└── /admin/comments
```

## API های محافظت شده

تمام API های زیر محافظت شده‌اند:

```
/api/admin/*
├── /api/admin/create-user
├── /api/admin/comments
└── /api/admin/comments/[id]

/api/* (عملیات write)
├── /api/courses (POST, PUT, DELETE)
├── /api/requests (POST, PUT, DELETE)
└── /api/settings (POST, PUT, DELETE)
```

## عیب‌یابی

### مشکل: کاربر ادمین نمی‌تواند وارد شود

**راه‌حل:**
1. بررسی فیلد `role` در جدول `auth-users`
2. بررسی فیلد `is_admin` در جدول `auth-users`
3. بررسی صحت UUID کاربر
4. بررسی لاگ‌های سرور

```sql
-- بررسی نقش کاربر
SELECT id, email, role, is_admin FROM "auth-users" WHERE email = 'admin@example.com';
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

## نکات امنیتی

1. **همیشه از HTTPS استفاده کنید**
2. **توکن‌ها را به صورت امن ذخیره کنید**
3. **لاگ تمام تلاش‌های دسترسی غیرمجاز**
4. **به‌روزرسانی منظم نقش‌های کاربری**
5. **استفاده از Rate Limiting**

## به‌روزرسانی‌های آینده

- [ ] اضافه کردن Role-Based Access Control (RBAC) پیشرفته
- [ ] لاگ کردن تمام فعالیت‌های ادمین
- [ ] اضافه کردن Two-Factor Authentication
- [ ] سیستم اعلان برای فعالیت‌های مشکوک

## پشتیبانی

برای سوالات و مشکلات:
- مستندات کامل: `ADMIN_ACCESS_CONTROL.md`
- فایل‌های SQL: `database/update_auth_users_admin.sql`
- کامپوننت تست: `components/AdminAccessTest.tsx`