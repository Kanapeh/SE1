# 🎥 راه‌حل مشکل Video-Call

## 🚨 مشکل فعلی
وقتی دانش‌آموز روی "کلاس آنلاین" کلیک می‌کند:
1. به آدرس اشتباه می‌رود
2. اطلاعات معلم و دانش‌آموز اشتباه نمایش داده می‌شود
3. داده‌ها به صورت mock (جعلی) هستند

## ✅ راه‌حل کامل

### مرحله 1: ایجاد جدول کلاس‌ها
فایل `database/create_classes_table.sql` را در Supabase اجرا کنید:

1. به Supabase Dashboard بروید
2. SQL Editor را باز کنید
3. محتوای `create_classes_table.sql` را کپی کنید
4. اجرا کنید

**نتیجه مورد انتظار:**
```
✅ Classes table created successfully!
```

### مرحله 2: بررسی جدول students
مطمئن شوید که جدول `students` وجود دارد. اگر وجود ندارد:

```sql
-- بررسی وجود جدول students
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'students'
);
```

### مرحله 3: اضافه کردن دانش‌آموز نمونه
اگر جدول `students` خالی است، یک دانش‌آموز نمونه اضافه کنید:

```sql
-- اضافه کردن دانش‌آموز نمونه
INSERT INTO public.students (id, email, first_name, last_name, phone, status)
VALUES (
    gen_random_uuid(),
    'student@example.com',
    'دانش‌آموز',
    'نمونه',
    '09123456789',
    'active'
);
```

### مرحله 4: اضافه کردن کلاس نمونه
یک کلاس نمونه برای معلم سپنتا علیزاده اضافه کنید:

```sql
-- اضافه کردن کلاس نمونه
INSERT INTO public.classes (teacher_id, student_id, scheduled_time, duration, subject, notes, status)
SELECT 
    t.id as teacher_id,
    s.id as student_id,
    now() + interval '1 hour' as scheduled_time,
    60 as duration,
    'کلاس آنلاین زبان انگلیسی' as subject,
    'تمرکز روی مکالمه و گرامر' as notes,
    'scheduled' as status
FROM public.teachers t, public.students s
WHERE t.first_name = 'سپنتا' AND t.last_name = 'علیزاده'
LIMIT 1;
```

## 🔍 آنچه اصلاح شده

### 1. **صفحه video-call معلم** (`app/teachers/[id]/video-call/page.tsx`):
- ✅ داده‌های mock حذف شده
- ✅ اطلاعات واقعی معلم از دیتابیس خوانده می‌شود
- ✅ اطلاعات واقعی کلاس از جدول `classes` خوانده می‌شود
- ✅ اطلاعات واقعی دانش‌آموز از جدول `students` خوانده می‌شود

### 2. **جدول classes**:
- ✅ مدیریت جلسات آنلاین
- ✅ ارتباط بین معلم و دانش‌آموز
- ✅ وضعیت کلاس (scheduled, in_progress, completed, cancelled)
- ✅ RLS policies برای امنیت

## 🧪 تست سیستم

### تست 1: بررسی جدول classes
```sql
SELECT 
    c.id,
    c.subject,
    c.status,
    c.scheduled_time,
    t.first_name || ' ' || t.last_name as teacher_name,
    s.first_name || ' ' || s.last_name as student_name
FROM public.classes c
JOIN public.teachers t ON c.teacher_id = t.id
JOIN public.students s ON c.student_id = s.id
ORDER BY c.scheduled_time DESC;
```

### تست 2: بررسی کلاس‌های معلم سپنتا
```sql
SELECT 
    c.*,
    t.first_name || ' ' || t.last_name as teacher_name,
    s.first_name || ' ' || s.last_name as student_name
FROM public.classes c
JOIN public.teachers t ON c.teacher_id = t.id
JOIN public.students s ON c.student_id = s.id
WHERE t.first_name = 'سپنتا' AND t.last_name = 'علیزاده';
```

## 🎯 نتیجه نهایی

پس از اجرای این مراحل:
- ✅ جدول `classes` ایجاد شده
- ✅ اطلاعات واقعی معلم نمایش داده می‌شود
- ✅ اطلاعات واقعی کلاس نمایش داده می‌شود
- ✅ اطلاعات واقعی دانش‌آموز نمایش داده می‌شود
- ✅ صفحه video-call درست کار می‌کند

## 📞 در صورت مشکل

### بررسی console مرورگر:
1. F12 → Console
2. صفحه video-call را refresh کنید
3. خطاها را بررسی کنید

### بررسی Supabase:
1. جدول `classes` را بررسی کنید
2. داده‌های موجود را چک کنید
3. RLS policies را بررسی کنید

### خطاهای رایج:
- **"relation classes does not exist"** → اسکریپت SQL را اجرا کنید
- **"relation students does not exist"** → جدول students را ایجاد کنید
- **"no rows returned"** → داده‌های نمونه اضافه کنید

## 🔧 نکات مهم

### 1. **مسیر صحیح video-call**:
```
/teachers/{teacher_id}/video-call
```

### 2. **داده‌های مورد نیاز**:
- معلم در جدول `teachers`
- دانش‌آموز در جدول `students`
- کلاس در جدول `classes`

### 3. **وضعیت کلاس**:
- `scheduled` - برنامه‌ریزی شده
- `in_progress` - در حال برگزاری
- `completed` - تکمیل شده
- `cancelled` - لغو شده
