# 🔍 مقایسه ساختار جدول دانش‌آموزان

## ❌ **مشکل: عدم تطبیق فرم و دیتابیس**

### **آنچه در فرم دانش‌آموز انتظار می‌رود:**
```typescript
interface StudentProfile {
  id: string;
  email: string;
  first_name: string;        // ✅ اجباری
  last_name: string;         // ✅ اجباری
  phone: string;             // ✅ اجباری
  gender: string;            // ❌ اختیاری
  birthdate: string;         // ❌ اختیاری
  address: string;           // ❌ اختیاری
  education_level: string;   // ❌ اختیاری
  learning_goals: string;    // ❌ اختیاری
  preferred_languages: string[];  // ❌ اختیاری
  preferred_learning_style: string;  // ❌ اختیاری
  availability: string[];    // ❌ اختیاری
  notes: string;             // ❌ اختیاری
  avatar: string;            // ❌ اختیاری
}
```

### **آنچه در دیتابیس فعلی وجود دارد:**
```sql
CREATE TABLE public.students (
  id uuid not null default gen_random_uuid (),
  first_name text not null,           -- ✅ مطابقت دارد
  last_name text not null,            -- ✅ مطابقت دارد
  email text not null,                -- ✅ مطابقت دارد
  phone text null,                    -- ❌ باید NOT NULL باشد
  gender text null,                   -- ✅ مطابقت دارد
  birthdate date null,                -- ✅ مطابقت دارد
  national_id text null,              -- ❌ در فرم وجود ندارد
  address text null,                  -- ✅ مطابقت دارد
  parent_name text null,              -- ❌ در فرم وجود ندارد
  parent_phone text null,             -- ❌ در فرم وجود ندارد
  language text null default 'English', -- ❌ در فرم وجود ندارد
  level text null,                    -- ❌ در فرم وجود ندارد
  class_type text not null,           -- ❌ در فرم وجود ندارد
  preferred_time text null,           -- ❌ در فرم وجود ندارد
  education_level text null,          -- ✅ مطابقت دارد
  learning_goals text null,           -- ✅ مطابقت دارد
  preferred_languages text null,      -- ❌ باید TEXT[] باشد
  availability text[] null,           -- ✅ مطابقت دارد
  notes text null,                    -- ✅ مطابقت دارد
  -- فیلدهای گم‌شده:
  -- preferred_learning_style: TEXT
  -- avatar: TEXT
);
```

## ✅ **راه‌حل: جدول جدید مطابق با فرم**

### **فایل `database/create_students_table.sql` ایجاد شد:**
```sql
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,           -- ✅ اجباری
  last_name TEXT NOT NULL,            -- ✅ اجباری
  phone TEXT NOT NULL,                -- ✅ اجباری
  gender TEXT,                        -- ✅ اختیاری
  birthdate DATE,                     -- ✅ اختیاری
  address TEXT,                       -- ✅ اختیاری
  education_level TEXT,               -- ✅ اختیاری
  learning_goals TEXT,                -- ✅ اختیاری
  preferred_languages TEXT[],         -- ✅ آرایه
  preferred_learning_style TEXT,      -- ✅ اختیاری
  availability TEXT[],                -- ✅ آرایه
  notes TEXT,                         -- ✅ اختیاری
  avatar TEXT,                        -- ✅ اختیاری
  status TEXT DEFAULT 'active',       -- ✅ وضعیت
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 **مراحل اجرا:**

### **مرحله 1: حذف جدول قدیمی (اختیاری)**
```sql
DROP TABLE IF EXISTS public.students;
```

### **مرحله 2: ایجاد جدول جدید**
فایل `database/create_students_table.sql` را در Supabase اجرا کنید

### **مرحله 3: تست فرم**
1. سرور را restart کنید
2. به `/complete-profile?type=student` بروید
3. فرم را تکمیل کنید

## 🎯 **نتیجه نهایی:**

پس از اجرای این فایل:
- ✅ ساختار جدول دقیقاً مطابق با فرم است
- ✅ تمام فیلدهای مورد نیاز وجود دارند
- ✅ فرم دانش‌آموز بدون خطا کار می‌کند
- ✅ داده‌ها به درستی ذخیره می‌شوند

## 📋 **فیلدهای اجباری در فرم:**
- `first_name` - نام
- `last_name` - نام خانوادگی  
- `phone` - شماره تلفن

## 📋 **فیلدهای اختیاری در فرم:**
- `gender` - جنسیت
- `birthdate` - تاریخ تولد
- `address` - آدرس
- `education_level` - سطح تحصیلی
- `learning_goals` - اهداف یادگیری
- `preferred_languages` - زبان‌های مورد علاقه
- `preferred_learning_style` - سبک یادگیری
- `availability` - زمان‌های در دسترس
- `notes` - یادداشت‌ها
- `avatar` - تصویر پروفایل
