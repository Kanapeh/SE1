# معماری صحیح ثبت‌نام معلم و دانش‌آموز

## اصول طراحی

### 1. منبع اصلی داده (Source of Truth)
**اولویت تشخیص نوع کاربر:**
1. **پروفایل موجود در دیتابیس** (جدول `teachers` یا `students`) - بالاترین اولویت
2. **`user_metadata.user_type` در Supabase Auth** - منبع اصلی برای کاربران جدید
3. **URL params** - فقط برای navigation
4. **sessionStorage** - فقط برای UX موقت (fallback)

### 2. Flow ثبت‌نام

```
کاربر → انتخاب نوع (معلم/دانش‌آموز) → ثبت‌نام → ذخیره user_type در metadata → تایید ایمیل → تکمیل پروفایل
```

### 3. Flow لاگین

```
کاربر → لاگین → بررسی پروفایل موجود → اگر پروفایل دارد → داشبورد مناسب
                                      → اگر ندارد → تکمیل پروفایل بر اساس metadata
```

## ساختار فایل‌ها

### `/register/select-type` - صفحه انتخاب نوع کاربر
- کاربر ابتدا نوع خود را انتخاب می‌کند
- این انتخاب در URL ذخیره می‌شود: `/register?type=teacher` یا `/register?type=student`
- UI ساده و واضح

### `/register` - صفحه ثبت‌نام
- دریافت `type` از URL
- ذخیره `user_type` در `user_metadata` هنگام ثبت‌نام
- بعد از ثبت‌نام موفق، redirect به `/verify-email?type={userType}`

### `/verify-email` - تایید ایمیل
- خواندن `user_type` از `user_metadata` (نه URL یا sessionStorage)
- بعد از تایید، redirect به `/complete-profile?type={userType}`

### `/complete-profile` - تکمیل پروفایل
- خواندن `type` از URL
- اگر `type` نبود، از `user_metadata.user_type` استفاده کند
- ذخیره پروفایل در جدول مناسب (`teachers` یا `students`)

### `/login` - ورود
- بعد از لاگین موفق:
  1. بررسی پروفایل موجود در `teachers` یا `students`
  2. اگر پروفایل دارد → redirect به داشبورد مناسب
  3. اگر ندارد → خواندن `user_metadata.user_type` → redirect به `/complete-profile?type={userType}`

## مزایا این معماری

✅ **قابل اعتماد**: استفاده از `user_metadata` که همیشه در دسترس است
✅ **ساده**: منطق واضح و قابل پیگیری
✅ **پایدار**: داده‌ها در دیتابیس ذخیره می‌شوند
✅ **قابل ردیابی**: می‌توانیم ببینیم کاربر چه نوعی است
✅ **بدون وابستگی به sessionStorage**: فقط برای UX موقت

## نکات مهم

1. **همیشه `user_type` را در `user_metadata` ذخیره کنید** هنگام ثبت‌نام
2. **از `user_metadata.user_type` به عنوان منبع اصلی استفاده کنید** نه sessionStorage
3. **پروفایل موجود در دیتابیس بالاترین اولویت را دارد**
4. **URL params فقط برای navigation است** نه برای ذخیره state

