# راهنمای رفع مشکل نمایش بلاگ‌های جدید

## مشکل
بلاگ‌های جدیدی که در Supabase اضافه می‌شوند در صفحه https://www.se1a.org/blog نمایش داده نمی‌شدند.

## علت مشکل
1. **استفاده از Browser Client در Server Component**: صفحه بلاگ یک Server Component بود اما از `createBrowserClient` استفاده می‌کرد که فقط برای Client Components مناسب است.
2. **Implementation اشتباه Server Client**: فایل `lib/supabase-server.ts` از `document.cookie` استفاده می‌کرد که در سرور کار نمی‌کند.
3. **کش شدن داده‌ها**: Next.js داده‌ها را کش می‌کرد و بلاگ‌های جدید را نشان نمی‌داد.

## راه حل‌های اعمال شده

### 1. اصلاح Server Client (`lib/supabase-server.ts`)
- از `cookies()` از `next/headers` استفاده شد به جای `document.cookie`
- Cookie handling برای Server Components به درستی پیاده‌سازی شد

```typescript
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // ... proper server-side cookie handling
      },
    }
  );
}
```

### 2. اصلاح صفحه بلاگ (`app/blog/page.tsx`)
- از `createClient` از `lib/supabase-server` استفاده شد
- `revalidate = 60` اضافه شد تا هر 60 ثانیه داده‌ها از دیتابیس خوانده شوند
- Logging بهبود یافت برای دیباگ راحت‌تر

```typescript
// Revalidate every 60 seconds to show new blog posts
export const revalidate = 60;

async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  
  console.log(`✅ Fetched ${data?.length || 0} blog posts from database`);
  // ...
}
```

## بررسی RLS Policies در Supabase

اطمینان حاصل کنید که RLS policies به درستی تنظیم شده‌اند:

```sql
-- بررسی policies فعلی
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'blog_posts'
ORDER BY policyname;
```

### Policies ضروری:
1. ✅ کاربران بدون احراز هویت می‌توانند مقالات published را ببینند
2. ✅ کاربران با احراز هویت می‌توانند مقالات published و مقالات خود را ببینند
3. ✅ نویسندگان می‌توانند مقالات خود را ویرایش/حذف کنند

## چک‌لیست بررسی

در Supabase، مطمئن شوید:

### ساختار داده
- [ ] جدول `blog_posts` وجود دارد
- [ ] ستون `status` وجود دارد (values: 'draft', 'published')
- [ ] ستون `published_at` وجود دارد و مقادیر معتبر دارد
- [ ] مقالات جدید `status = 'published'` دارند

### RLS Policies
- [ ] RLS روی جدول `blog_posts` فعال است
- [ ] Policy برای دسترسی عمومی به مقالات published وجود دارد
- [ ] Policies تداخلی ندارند

### بررسی مقالات
```sql
-- لیست تمام مقالات published
SELECT id, title, slug, status, published_at, created_at
FROM blog_posts
WHERE status = 'published'
ORDER BY published_at DESC;
```

## تست کردن

### 1. لوکال (Development)
```bash
npm run dev
```

سپس به http://localhost:3000/blog بروید

### 2. Production
بعد از deploy:
1. به https://www.se1a.org/blog بروید
2. اگر بلاگ‌های جدید نمایش داده نشدند، Cache را پاک کنید:
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

### 3. بررسی Logs
در Vercel:
- به قسمت Functions → Logs بروید
- باید log زیر را ببینید: `✅ Fetched X blog posts from database`

## نکات مهم

### تفاوت Browser Client vs Server Client

| Feature | Browser Client | Server Client |
|---------|---------------|---------------|
| محیط اجرا | Client (Browser) | Server (Node.js) |
| دسترسی به Cookies | localStorage | next/headers cookies |
| استفاده در | "use client" components | Server Components |
| Authentication | Session-based | Request-based |

### کدام یک استفاده کنیم?

- **Server Components** (صفحات بدون "use client"): 
  ```typescript
  import { createClient } from "@/lib/supabase-server";
  const supabase = await createClient();
  ```

- **Client Components** (با "use client"):
  ```typescript
  import { supabase } from "@/lib/supabase";
  // استفاده مستقیم از supabase
  ```

## Revalidation Strategy

صفحه بلاگ هر 60 ثانیه یک بار revalidate می‌شود:
- در Production: Next.js هر 60 ثانیه یک بار داده‌های جدید از دیتابیس می‌خواند
- در Development: همیشه fresh data نمایش داده می‌شود

برای تغییر این زمان:
```typescript
export const revalidate = 30; // 30 ثانیه
export const revalidate = 0; // همیشه fresh (خیلی کند)
export const revalidate = false; // همیشه cache (توصیه نمی‌شود)
```

## Force Cache Clear

اگر نیاز به پاک کردن فوری cache دارید:

### در Vercel:
1. به Deployment → Domains بروید
2. روی "Redeploy" کلیک کنید

### در کد:
```typescript
// Force dynamic rendering (no cache)
export const dynamic = 'force-dynamic';
```

## در صورت ادامه مشکل

1. **بررسی Environment Variables در Vercel**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **بررسی Network در Browser DevTools**:
   - F12 → Network tab
   - Refresh صفحه
   - دنبال request به `/blog` بگردید
   - بررسی کنید Response چیست

3. **بررسی Supabase Logs**:
   - به Supabase Dashboard بروید
   - Logs → Query Performance
   - دنبال query های `blog_posts` بگردید

4. **بررسی Console Logs**:
   - F12 → Console
   - باید log زیر را ببینید: `✅ Fetched X blog posts from database`

## تاریخچه تغییرات
- **13 اکتبر 2025**: رفع مشکل استفاده از Browser Client در Server Component
- اضافه شدن `revalidate = 60` برای به‌روزرسانی خودکار
- بهبود logging برای دیباگ راحت‌تر

