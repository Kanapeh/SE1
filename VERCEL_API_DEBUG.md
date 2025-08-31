# راهنمای دیباگ خطای 404 در API Teachers

## 🚨 مشکل فعلی
API `/api/teachers` در production خطای 404 می‌دهد

## 🔍 مراحل دیباگ

### مرحله 1: بررسی مستقیم API
مستقیماً این URL را در مرورگر تست کنید:
```
https://www.se1a.org/api/teachers
```

**نتایج انتظاری:**
- ✅ **Status 200**: API کار می‌کند
- ❌ **Status 404**: API deploy نشده
- ❌ **Status 500**: Environment variables مشکل دارد

### مرحله 2: بررسی Vercel Functions
1. به Vercel Dashboard بروید
2. پروژه se1a را انتخاب کنید
3. **Functions** tab را کلیک کنید
4. بررسی کنید که `api/teachers` در لیست هست

### مرحله 3: بررسی Build Logs
1. در Vercel Dashboard > **Deployments**
2. آخرین deployment را کلیک کنید
3. **View Function Logs** را بررسی کنید
4. به دنبال error های مربوط به `api/teachers` بگردید

### مرحله 4: بررسی Environment Variables
متغیرهای ضروری:
```bash
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY  
✅ SUPABASE_SERVICE_ROLE_KEY
✅ NEXT_PUBLIC_SITE_URL
```

### مرحله 5: تست Local vs Production
**Local:**
```bash
npm run dev
# تست: http://localhost:3000/api/teachers
```

**Production:**
```bash
# تست: https://www.se1a.org/api/teachers
```

## 🛠️ راه‌حل‌های احتمالی

### راه‌حل 1: Redeploy کردن
```bash
# در Vercel Dashboard
1. Deployments > آخرین deployment
2. دکمه "Redeploy" کلیک کنید
3. صبر کنید تا deploy کامل شود
```

### راه‌حل 2: بررسی File Structure
فایل باید دقیقاً در این مسیر باشد:
```
app/
  api/
    teachers/
      route.ts  ← این فایل
```

### راه‌حل 3: بررسی Export
فایل `app/api/teachers/route.ts` باید:
```typescript
export async function GET() {
  // ... کد API
}
```

### راه‌حل 4: اضافه کردن متغیر گمشده
اگر `SUPABASE_SERVICE_ROLE_KEY` نیست:
1. Vercel Dashboard > Settings > Environment Variables
2. اضافه کنید: `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`
3. Redeploy کنید

## 🧪 تست اضطراری

اگر همچنان کار نمی‌کند، این API ساده را تست کنید:

### فایل: `app/api/test-simple/route.ts`
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    success: true 
  });
}
```

سپس تست کنید: `https://www.se1a.org/api/test-simple`

## 📱 Console Debug
کنسول مرورگر را باز کنید (F12) و به دنبال این پیام‌ها بگردید:
```
🔍 Fetching teachers from API...
❌ API Error: 404 Not Found
⚠️ Teachers API not found, using fallback empty array
```

## 📞 Contact Debug Info
اگر همچنان مشکل دارید، این اطلاعات را ارسال کنید:
1. نتیجه `https://www.se1a.org/api/teachers`
2. لیست Functions در Vercel Dashboard
3. آخرین Build Logs
4. Environment Variables screenshot
