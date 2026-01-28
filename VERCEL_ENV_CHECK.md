# بررسی Environment Variables در Vercel

## وضعیت فعلی
در Vercel، `NEXT_PUBLIC_SITE_URL` به `https://se1a.org` تنظیم شده است (بدون www).

## نکات مهم

### 1. مطابقت با Supabase Dashboard
مطمئن شوید که در **Supabase Dashboard** > **Authentication** > **URL Configuration**:

**Site URL:**
```
https://se1a.org
```
یا
```
https://www.se1a.org
```

**Redirect URLs باید شامل باشد:**
```
http://localhost:3000/auth/callback
https://se1a.org/auth/callback
https://www.se1a.org/auth/callback
```

### 2. مطابقت با Google Cloud Console
در **Google Cloud Console** > **OAuth 2.0 Client ID**:

**Authorized JavaScript origins باید شامل باشد:**
```
http://localhost:3000
https://se1a.org
https://www.se1a.org
```

**Authorized redirect URIs باید فقط شامل باشد:**
```
https://your-project.supabase.co/auth/v1/callback
```

### 3. تغییرات کد
کد به‌روزرسانی شده است تا از `NEXT_PUBLIC_SITE_URL` استفاده کند:
- Fallback URLs حالا از environment variable استفاده می‌کنند
- با هر دو نسخه (با www و بدون www) کار می‌کند
- Logging بهبود یافته است

## تست

بعد از Redeploy در Vercel:

1. به `https://se1a.org/login` بروید
2. Console را باز کنید
3. روی "ورود با گوگل" کلیک کنید
4. بررسی کنید که redirect URL درست است:
   ```
   🌐 Production domain detected - using current origin: https://se1a.org/auth/callback
   ```

## اگر هنوز مشکل دارید

1. مطمئن شوید که در Supabase Dashboard، Redirect URLs شامل `https://se1a.org/auth/callback` است
2. مطمئن شوید که در Google Cloud Console، Authorized JavaScript origins شامل `https://se1a.org` است
3. بعد از تغییرات، Vercel را Redeploy کنید
4. Cache مرورگر را پاک کنید

