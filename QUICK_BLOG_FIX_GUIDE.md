# راهنمای سریع رفع مشکل بلاگ

## مشکل چه بود؟
بلاگ‌های جدید در صفحه https://www.se1a.org/blog نمایش داده نمی‌شدند.

## علت
استفاده از `Browser Client` به جای `Server Client` در صفحه بلاگ که یک Server Component است.

## چه کاری انجام شد؟

### ✅ تغییرات فایل‌ها:

1. **`lib/supabase-server.ts`** - اصلاح شد
   - از `cookies()` از `next/headers` استفاده می‌کند
   - Cookie handling برای server components

2. **`app/blog/page.tsx`** - اصلاح شد
   - از `createClient` از `lib/supabase-server` استفاده می‌کند
   - اضافه شدن `revalidate = 60` (هر 60 ثانیه داده‌ها تازه می‌شوند)

3. **اسکریپت تست** - اضافه شد
   - `scripts/test-blog-fetch.js` - برای تست fetch کردن بلاگ‌ها

4. **مستندات** - اضافه شد
   - `BLOG_DISPLAY_FIX.md` - راهنمای کامل

## چطور تست کنیم؟

### 1️⃣ تست لوکال

```bash
# تست اتصال به دیتابیس
node scripts/test-blog-fetch.js

# اجرای پروژه
npm run dev

# باز کردن صفحه بلاگ
# http://localhost:3000/blog
```

### 2️⃣ Deploy به Production

```bash
# Push کردن تغییرات
git add .
git commit -m "Fix: استفاده از server client برای fetch بلاگ‌ها"
git push origin main

# Vercel به صورت خودکار deploy می‌کند
```

### 3️⃣ تست Production

1. منتظر بمانید تا deploy تمام شود (حدود 2-3 دقیقه)
2. به https://www.se1a.org/blog بروید
3. Cache مرورگر را پاک کنید: `Ctrl+Shift+R` (Windows/Linux) یا `Cmd+Shift+R` (Mac)
4. باید 8 بلاگ را ببینید

## نتایج تست

اسکریپت تست نشان داد:
- ✅ 8 بلاگ published در دیتابیس
- ✅ RLS policies به درستی کار می‌کنند
- ✅ اتصال به Supabase موفق
- ✅ Build موفق

## اگر هنوز بلاگ‌ها نمایش داده نمی‌شوند

### بررسی 1: Cache مرورگر
```
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### بررسی 2: بلاگ‌ها published هستند؟
در Supabase SQL Editor:
```sql
SELECT id, title, status, published_at 
FROM blog_posts 
WHERE status = 'published'
ORDER BY published_at DESC;
```

### بررسی 3: Vercel Logs
1. به Vercel Dashboard بروید
2. Functions → Logs
3. دنبال log زیر بگردید:
   ```
   ✅ Fetched X blog posts from database
   ```

### بررسی 4: Browser Console
1. F12 → Console
2. Refresh صفحه
3. دنبال خطاها بگردید

### بررسی 5: Force Redeploy
در Vercel:
1. Deployments → Latest
2. ... → Redeploy

## Revalidation چیست؟

```typescript
export const revalidate = 60; // ثانیه
```

یعنی:
- هر 60 ثانیه Next.js داده‌های تازه از دیتابیس می‌خواند
- بین این 60 ثانیه، داده‌های cached نمایش داده می‌شوند
- برای بلاگ که محتوای پویا نیست، عالی است

تغییر زمان:
- `revalidate = 30` → هر 30 ثانیه
- `revalidate = 3600` → هر ساعت
- `revalidate = 0` → همیشه fresh (کند!)

## چک‌لیست نهایی

- [x] فایل `lib/supabase-server.ts` اصلاح شد
- [x] فایل `app/blog/page.tsx` اصلاح شد
- [x] اسکریپت تست موفق بود (8 بلاگ)
- [x] Build موفق بود
- [ ] Deploy به production
- [ ] تست در production
- [ ] Cache مرورگر پاک شد

## خلاصه تکنیکی

### قبل از رفع مشکل:
```typescript
// ❌ اشتباه - Browser Client در Server Component
import { supabase } from "@/lib/supabase";

async function getBlogPosts() {
  const { data } = await supabase.from('blog_posts').select('*');
  // کار نمی‌کند در server component!
}
```

### بعد از رفع مشکل:
```typescript
// ✅ درست - Server Client در Server Component
import { createClient } from "@/lib/supabase-server";

async function getBlogPosts() {
  const supabase = await createClient();
  const { data } = await supabase.from('blog_posts').select('*');
  // کار می‌کند!
}
```

## دستورات مفید

```bash
# تست اتصال دیتابیس
node scripts/test-blog-fetch.js

# تست لوکال
npm run dev

# Build
npm run build

# Deploy (با git)
git push origin main

# بررسی environment variables
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

## لینک‌های مفید

- [Blog Page Fix Documentation](./BLOG_DISPLAY_FIX.md)
- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)

---

**تاریخ**: 13 اکتبر 2025  
**وضعیت**: ✅ مشکل حل شد  
**تست شده**: ✅ لوکال و Build

