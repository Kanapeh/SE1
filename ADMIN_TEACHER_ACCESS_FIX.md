# رفع مشکل عدم نمایش مدیریت معلمان در داشبورد ادمین

## 🎯 مشکل فعلی
بخش "مدیریت معلمان" در داشبورد ادمین نمایش داده نمی‌شود.

## 🔍 تشخیص مشکل
کد مدیریت معلمان وجود دارد، اما احتمالاً به دلیل یکی از موارد زیر نمایش داده نمی‌شود:

1. **مشکل دسترسی ادمین** - کاربر دسترسی ادمین ندارد
2. **مشکل API** - درخواست `/api/admin/simple-stats` با خطا مواجه می‌شود
3. **مشکل دیتابیس** - جداول مورد نیاز وجود ندارند

## 🚀 راه‌حل فوری

### مرحله 1: بررسی دسترسی ادمین
1. به آدرس https://www.se1a.org/admin/test-admin بروید
2. وضعیت دسترسی ادمین خود را بررسی کنید
3. اگر دسترسی ندارید، به مرحله 2 بروید

### مرحله 2: تنظیم دسترسی ادمین
1. به [Supabase Dashboard](https://supabase.com/dashboard) بروید
2. پروژه خود را انتخاب کنید
3. به SQL Editor بروید
4. اسکریپت زیر را اجرا کنید:

```sql
-- 1. ایجاد جدول admins
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    permissions TEXT[] DEFAULT ARRAY['all'],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. اضافه کردن خودتان به عنوان ادمین (ایمیل خود را جایگزین کنید)
INSERT INTO public.admins (user_id, role, permissions, is_active)
SELECT id, 'admin', ARRAY['all'], true
FROM auth.users 
WHERE email = 'your-email@example.com'  -- ایمیل خود را اینجا بنویسید
ON CONFLICT (user_id) DO UPDATE SET
    is_active = true,
    role = 'admin',
    permissions = ARRAY['all'];

-- 3. بررسی نتیجه
SELECT 
    a.user_id,
    u.email,
    a.role,
    a.is_active,
    a.permissions
FROM public.admins a
JOIN auth.users u ON a.user_id = u.id;
```

### مرحله 3: تنظیم جدول معلمان
اسکریپت کامل database/setup_admin_teacher_access.sql را اجرا کنید:

```sql
-- کل محتوای فایل database/setup_admin_teacher_access.sql را کپی و اجرا کنید
```

### مرحله 4: بررسی RLS Policies
```sql
-- بررسی policies موجود
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('admins', 'teachers');

-- اگر policies وجود ندارند، این را اجرا کنید:
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Policy برای admins
CREATE POLICY "Admins can view all admins" ON public.admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );

-- Policy برای teachers
CREATE POLICY "Admins can manage all teachers" ON public.teachers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid() 
            AND is_active = true
        )
    );
```

## 🔧 تست و بررسی

### تست 1: بررسی دسترسی API
در کنسول مرورگر (F12) این کد را اجرا کنید:

```javascript
fetch('/api/admin/simple-stats')
  .then(response => response.json())
  .then(data => {
    console.log('API Response:', data);
    if (data.sections) {
      const teacherSection = data.sections.find(s => s.title === 'مدیریت معلمان');
      console.log('Teacher section found:', teacherSection);
    }
  })
  .catch(error => console.error('API Error:', error));
```

### تست 2: بررسی دسترسی مستقیم
به آدرس https://www.se1a.org/admin/teachers بروید مستقیماً

### تست 3: بررسی کنسول مرورگر
1. F12 را فشار دهید
2. به تب Console بروید
3. به دنبال خطاهای مربوط به admin یا API بگردید

## 🎯 علائم موفقیت

پس از انجام مراحل فوق، باید موارد زیر را ببینید:

✅ بخش "مدیریت معلمان" در داشبورد ادمین  
✅ لینک به /admin/teachers کار می‌کند  
✅ صفحه مدیریت معلمان بارگذاری می‌شود  
✅ لیست معلمان (حتی اگر خالی باشد) نمایش داده می‌شود  

## 🚨 اگر هنوز مشکل دارید

### گزینه 1: ایجاد معلم تست
```sql
-- ایجاد یک معلم تست برای اطمینان از کارکرد سیستم
INSERT INTO public.teachers (
    id, email, first_name, last_name, phone, languages, 
    levels, experience_years, bio, status, created_at
) VALUES (
    gen_random_uuid(), 
    'test-teacher@example.com', 
    'معلم', 
    'تست', 
    '09123456789', 
    ARRAY['انگلیسی'], 
    ARRAY['مبتدی'], 
    2, 
    'این یک معلم تست است', 
    'pending', 
    now()
);
```

### گزینه 2: بررسی environment variables
در Vercel Dashboard:
1. به Settings > Environment Variables بروید
2. مطمئن شوید که SUPABASE_SERVICE_ROLE_KEY تنظیم شده است

### گزینه 3: پاک کردن cache
```javascript
// در کنسول مرورگر اجرا کنید
localStorage.clear();
sessionStorage.clear();
window.location.reload(true);
```

## 📞 تماس با پشتیبانی
اگر پس از انجام تمام مراحل فوق هنوز مشکل دارید:

1. اسکرین‌شات از کنسول مرورگر (F12 > Console) بگیرید
2. اسکرین‌شات از نتیجه SQL queries بگیرید  
3. اسکرین‌شات از داشبورد ادمین بگیرید

---

**نکته مهم**: حتماً ایمیل خود را در بخش SQL جایگزین کنید تا دسترسی ادمین داشته باشید.
