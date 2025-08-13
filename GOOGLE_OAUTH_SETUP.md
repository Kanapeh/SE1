# راهنمای تنظیم Google OAuth در Supabase

## 🎯 هدف
اضافه کردن قابلیت ورود و ثبت‌نام با گوگل به سایت

## 🚨 مشکل فعلی: "Unsupported provider: provider is not enabled"

اگر این خطا را می‌بینید، یعنی Google OAuth در Supabase فعال نشده است.

### راه‌حل سریع:

1. **ورود به Supabase Dashboard**
   - به [supabase.com](https://supabase.com) بروید
   - پروژه خود را انتخاب کنید

2. **فعال‌سازی Google Provider**
   - از منوی سمت چپ "Authentication" را کلیک کنید
   - روی "Providers" کلیک کنید
   - "Google" را پیدا کنید
   - روی toggle switch کلیک کنید تا فعال شود (سبز شود)

3. **تنظیم Google Credentials**
   - Client ID و Client Secret را وارد کنید
   - "Save" را کلیک کنید

## 📋 مراحل کامل تنظیم

### 1. ایجاد پروژه در Google Cloud Console

1. **ورود به Google Cloud Console**
   - به [console.cloud.google.com](https://console.cloud.google.com) بروید
   - با حساب گوگل خود وارد شوید

2. **ایجاد پروژه جدید**
   - روی "Select a project" کلیک کنید
   - "New Project" را انتخاب کنید
   - نام پروژه را وارد کنید (مثل: `se1a-oauth`)
   - "Create" را کلیک کنید

3. **فعال‌سازی Google+ API**
   - از منوی سمت چپ "APIs & Services" > "Library" را انتخاب کنید
   - "Google+ API" را جستجو کنید
   - روی آن کلیک کرده و "Enable" را بزنید

### 2. ایجاد OAuth 2.0 Credentials

1. **ورود به Credentials**
   - از منوی سمت چپ "APIs & Services" > "Credentials" را انتخاب کنید
   - "Create Credentials" > "OAuth client ID" را کلیک کنید

2. **تنظیم OAuth consent screen**
   - اگر قبلاً تنظیم نکرده‌اید، ابتدا این مرحله را انجام دهید
   - "User Type" را "External" انتخاب کنید
   - اطلاعات اپلیکیشن را پر کنید:
     - App name: `SE1A Academy`
     - User support email: ایمیل خودتان
     - Developer contact information: ایمیل خودتان
   - "Save and Continue" را کلیک کنید

3. **ایجاد OAuth Client ID**
   - Application type: "Web application" را انتخاب کنید
   - Name: `SE1A Web Client`
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     http://localhost:3001
     http://localhost:3002
     https://your-domain.com
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/auth/callback
     https://your-domain.com/auth/callback
     ```
   - "Create" را کلیک کنید

4. **ذخیره اطلاعات**
   - Client ID و Client Secret را کپی کنید
   - این اطلاعات را در جای امنی ذخیره کنید

### 3. تنظیم در Supabase

1. **ورود به Supabase Dashboard**
   - به [supabase.com](https://supabase.com) بروید
   - پروژه خود را انتخاب کنید

2. **تنظیم Authentication**
   - از منوی سمت چپ "Authentication" > "Providers" را انتخاب کنید
   - "Google" را پیدا کرده و روی آن کلیک کنید
   - **"Enable" را فعال کنید** (این مرحله مهم است!)

3. **وارد کردن اطلاعات**
   - Client ID: همان ID که از Google گرفتید
   - Client Secret: همان Secret که از Google گرفتید
   - Redirect URL: `https://your-project.supabase.co/auth/v1/callback`
   - "Save" را کلیک کنید

### 4. تنظیم Environment Variables

1. **فایل .env.local**
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # Google OAuth (اختیاری - برای تنظیمات اضافی)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

### 5. تست عملکرد

1. **تست محلی**
   ```bash
   npm run dev
   ```

2. **تست OAuth**
   - به `/register` یا `/login` بروید
   - دکمه "ادامه با گوگل" را کلیک کنید
   - باید به صفحه گوگل منتقل شوید
   - پس از تایید، به سایت برگردید

## 🔧 عیب‌یابی

### مشکلات رایج

1. **خطای "Unsupported provider: provider is not enabled"**
   - ✅ **راه‌حل**: Google provider را در Supabase فعال کنید
   - Authentication > Providers > Google > Enable

2. **خطای "redirect_uri_mismatch"**
   - مطمئن شوید که redirect URI در Google Console درست تنظیم شده
   - آدرس باید دقیقاً مطابق باشد

3. **خطای "invalid_client"**
   - Client ID و Secret را دوباره چک کنید
   - مطمئن شوید که در Supabase درست وارد شده‌اند

4. **خطای "access_denied"**
   - OAuth consent screen را بررسی کنید
   - مطمئن شوید که API فعال شده

5. **کاربران OAuth پروفایل ندارند**
   - سیستم به طور خودکار کاربران جدید را به `/complete-profile` هدایت می‌کند
   - مطمئن شوید که این صفحه درست کار می‌کند

### لاگ‌ها

برای دیباگ، console را چک کنید:
```javascript
// در browser console
console.log('OAuth initiated');
console.log('User data:', user);
```

## 🚀 نکات مهم

1. **امنیت**
   - Client Secret را هرگز در کد frontend قرار ندهید
   - فقط در Supabase Dashboard استفاده کنید

2. **Production**
   - برای production، domain اصلی را به Authorized origins اضافه کنید
   - HTTPS ضروری است

3. **Rate Limits**
   - Google OAuth محدودیت‌های خاصی دارد
   - برای تست، از حساب‌های مختلف استفاده کنید

4. **User Data**
   - اطلاعات کاربر از گوگل شامل: email, name, picture
   - این اطلاعات در `user.user_metadata` ذخیره می‌شود

## 📞 پشتیبانی

در صورت مشکل:
1. Console errors را چک کنید
2. Supabase logs را بررسی کنید
3. Google Cloud Console logs را چک کنید
4. با تیم پشتیبانی تماس بگیرید

---

**نکته**: این راهنما برای تنظیم اولیه است. برای production، تنظیمات امنیتی بیشتری نیاز است.
