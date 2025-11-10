# راهنمای عیب‌یابی PWA

## مشکل: Manifest و Service Worker در DevTools نمایش داده نمی‌شوند

### ✅ راه‌حل‌های مرحله به مرحله:

### 1. Restart Dev Server
```bash
# توقف سرور (Ctrl+C)
# سپس دوباره اجرا کنید:
npm run dev
```

### 2. Hard Refresh مرورگر
- **Windows/Linux**: `Ctrl + Shift + R` یا `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### 3. Clear Cache و Service Workers
1. DevTools را باز کنید (F12)
2. به تب **Application** بروید
3. در سمت چپ:
   - **Storage** > **Clear site data** (همه را انتخاب کنید)
   - **Service Workers** > **Unregister** (اگر وجود دارد)
   - **Cache Storage** > همه cache ها را Delete کنید

### 4. بررسی Console برای خطاها
1. DevTools > **Console** را باز کنید
2. صفحه را Refresh کنید
3. به دنبال این پیام‌ها بگردید:
   - ✅ `Service Worker registered successfully` (موفق)
   - ❌ `Service Worker registration failed` (خطا)

### 5. بررسی Manifest
1. در مرورگر به این آدرس بروید:
   ```
   http://localhost:3000/site.webmanifest
   ```
2. باید JSON manifest را ببینید

### 6. بررسی Service Worker
1. در مرورگر به این آدرس بروید:
   ```
   http://localhost:3000/sw.js
   ```
2. باید کد JavaScript Service Worker را ببینید

### 7. بررسی در DevTools > Application

#### Manifest:
1. DevTools > **Application** > **Manifest**
2. باید اطلاعات زیر را ببینید:
   - Name: سِ وان - مرکز تخصصی آموزش زبان انگلیسی
   - Start URL: /
   - Icons: 5 آیکون

#### Service Workers:
1. DevTools > **Application** > **Service Workers**
2. باید یک Service Worker با status **activated and is running** ببینید

### 8. اگر هنوز کار نمی‌کند:

#### بررسی Network Tab:
1. DevTools > **Network**
2. صفحه را Refresh کنید
3. به دنبال این فایل‌ها بگردید:
   - `site.webmanifest` (Status: 200)
   - `sw.js` (Status: 200)

#### بررسی Headers:
1. DevTools > **Network**
2. روی `site.webmanifest` کلیک کنید
3. تب **Headers** را بررسی کنید
4. باید `Content-Type: application/manifest+json` باشد

### 9. مشکلات رایج:

#### مشکل: Service Worker ثبت نمی‌شود
**راه‌حل:**
- مطمئن شوید در `localhost` یا `https` هستید
- Service Worker فقط در HTTPS یا localhost کار می‌کند

#### مشکل: Manifest نمایش داده نمی‌شود
**راه‌حل:**
- مطمئن شوید `<link rel="manifest" href="/site.webmanifest" />` در `<head>` وجود دارد
- فایل `public/site.webmanifest` باید موجود باشد

#### مشکل: آیکون‌ها نمایش داده نمی‌شوند
**راه‌حل:**
- مطمئن شوید فایل‌های آیکون در `public/` موجود هستند:
  - `apple-touch-icon.png`
  - `android-chrome-192x192.png`
  - `android-chrome-512x512.png`

### 10. تست نهایی:

1. **Manifest Test:**
   ```
   http://localhost:3000/site.webmanifest
   ```
   باید JSON معتبر ببینید

2. **Service Worker Test:**
   - Console باید پیام `✅ Service Worker registered successfully` را نشان دهد

3. **Install Prompt:**
   - بعد از چند ثانیه باید پیام "نصب اپلیکیشن" نمایش داده شود

### 11. اگر همه چیز درست است اما هنوز نمایش داده نمی‌شود:

ممکن است نیاز به **Production Build** باشد:

```bash
npm run build
npm start
```

سپس به `http://localhost:3000` بروید و دوباره تست کنید.

---

## نکات مهم:

- Service Worker فقط در **HTTPS** یا **localhost** کار می‌کند
- در **Incognito Mode** ممکن است محدودیت‌هایی وجود داشته باشد
- بعضی مرورگرها (مثل Safari) محدودیت‌های بیشتری دارند
- برای تست کامل، از **Chrome** یا **Edge** استفاده کنید

