# معماری پیشنهادی برای ثبت‌نام معلم و دانش‌آموز

## مشکلات فعلی:
1. استفاده از `sessionStorage` که می‌تواند گم شود یا پاک شود
2. منطق پیچیده در چندین فایل
3. عدم اطمینان از حفظ `userType` در تمام مراحل

## راه‌حل پیشنهادی:

### 1. صفحه انتخاب نوع کاربر (`/register/select-type`)
- کاربر ابتدا نوع خود را انتخاب می‌کند (معلم یا دانش‌آموز)
- این انتخاب در URL و `sessionStorage` ذخیره می‌شود
- سپس به `/register?type=teacher` یا `/register?type=student` redirect می‌شود

### 2. ذخیره `userType` در `user_metadata` در Supabase
- هنگام ثبت‌نام، `user_type` در `user_metadata` ذخیره می‌شود
- این داده همیشه در دسترس است و گم نمی‌شود
- در تمام مراحل بعدی از `user.user_metadata.user_type` استفاده می‌شود

### 3. منطق Redirect:
- **بعد از ثبت‌نام**: بر اساس `user_metadata.user_type` به صفحه تکمیل پروفایل مناسب redirect
- **بعد از تایید ایمیل**: بر اساس `user_metadata.user_type` یا پروفایل موجود redirect
- **بعد از لاگین**: ابتدا پروفایل موجود را بررسی می‌کند، سپس بر اساس `user_metadata.user_type`

### 4. اولویت‌بندی برای تشخیص نوع کاربر:
1. پروفایل موجود در دیتابیس (teachers یا students table)
2. `user_metadata.user_type` در Supabase Auth
3. URL params
4. sessionStorage (فقط برای fallback)

## مزایا:
- ✅ قابل اعتمادتر: استفاده از `user_metadata` به جای `sessionStorage`
- ✅ ساده‌تر: منطق واضح و قابل پیگیری
- ✅ پایدارتر: داده‌ها در دیتابیس ذخیره می‌شوند
- ✅ قابل ردیابی: می‌توانیم ببینیم کاربر چه نوعی است

