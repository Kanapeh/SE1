# راهنمای حل مشکل RLS (Row Level Security)

## مشکل
بعد از ثبت‌نام با گوگل، وقتی کاربر می‌خواهد فرم تکمیل پروفایل معلم را پر کند، با خطای زیر مواجه می‌شود:
```
new row violates row-level security policy for table "teachers"
```

## علت
این خطا به دلیل عدم وجود RLS policies مناسب در جدول `teachers` رخ می‌دهد. کاربر احراز شده نمی‌تواند ردیف جدید در جدول ایجاد کند.

## راه‌حل

### مرحله 1: اجرای RLS Policies
فایل `database/rls_policies.sql` را در Supabase اجرا کنید:

```sql
-- Enable RLS on tables
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Teachers table policies
CREATE POLICY "Users can insert their own teacher profile" ON public.teachers
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own teacher profile" ON public.teachers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own teacher profile" ON public.teachers
    FOR UPDATE USING (auth.uid() = id);

-- و سایر policies...
```

### مرحله 2: بررسی ساختار جدول
اطمینان حاصل کنید که جدول `teachers` دارای ستون `id` با نوع `UUID` است و به عنوان Primary Key تعریف شده است.

**نکته مهم**: در این پروژه، ستون `id` در جدول `teachers` همان `auth.uid()` است (شناسه کاربر احراز شده).

### مرحله 3: تست
1. با گوگل ثبت‌نام کنید
2. به `/complete-profile?type=teacher` بروید
3. فرم چندمرحله‌ای را پر کنید
4. دکمه "تکمیل پروفایل معلم" را بزنید

## نکات مهم

### RLS Policy برای INSERT
```sql
CREATE POLICY "Users can insert their own teacher profile" ON public.teachers
    FOR INSERT WITH CHECK (auth.uid() = id);
```

این policy اجازه می‌دهد کاربر فقط ردیفی با `id` برابر با `auth.uid()` (شناسه کاربر احراز شده) ایجاد کند.

### ساختار جدول
```sql
CREATE TABLE teachers (
  id UUID PRIMARY KEY,  -- این همان auth.uid() است
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  -- سایر فیلدها...
);
```

### امنیت
- کاربران فقط می‌توانند پروفایل خودشان را ببینند و ویرایش کنند
- ادمین‌ها می‌توانند همه پروفایل‌ها را ببینند و ویرایش کنند
- معلمان تأیید شده می‌توانند پروفایل دانش‌آموزان را ببینند

## عیب‌یابی

### اگر هنوز خطا دارید:
1. **RLS فعال است؟** بررسی کنید که `ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;` اجرا شده باشد
2. **Policies وجود دارند؟** در Supabase Dashboard > Authentication > Policies بررسی کنید
3. **ستون id درست است؟** باید `UUID` باشد و با `auth.uid()` مطابقت داشته باشد
4. **ستون user_id وجود ندارد؟** در این پروژه از `id` استفاده می‌شود، نه `user_id`

### بررسی در Supabase Dashboard:
1. به بخش **Table Editor** بروید
2. جدول `teachers` را انتخاب کنید
3. به تب **RLS** بروید
4. مطمئن شوید که RLS فعال است و policies وجود دارند

### خطاهای رایج:
- `ERROR: 42703: column "user_id" does not exist` → از `id` استفاده کنید، نه `user_id`
- `ERROR: 42704: data type text has no default operator class for access method "gin"` → GIN indexes را حذف کنید
- `ERROR: 42703: column "rating" does not exist` → ستون‌های موجود را بررسی کنید

## نتیجه
بعد از اجرای این policies، کاربران احراز شده می‌توانند پروفایل معلم خودشان را ایجاد کنند و خطای RLS برطرف می‌شود.

## نکته مهم
در این پروژه، ستون `id` در جدول `teachers` همان شناسه کاربر احراز شده (`auth.uid()`) است. این طراحی باعث می‌شود که RLS policies ساده‌تر و امن‌تر باشند.
