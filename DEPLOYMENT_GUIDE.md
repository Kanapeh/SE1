# راهنمای Deployment برای SSR

## مشکل: "سایت سرور ساید رندر نیست"

### علت‌های احتمالی:

1. **فایل `server.js` تداخل داشت** ✅ (حل شد)
2. **تنظیمات deployment نادرست**
3. **Environment Variables تنظیم نشده**
4. **Platform deployment مناسب نیست**

## راه‌حل‌های انجام شده:

### ✅ 1. حذف فایل server.js
فایل `server.js` که با Next.js تداخل داشت حذف شد.

### ✅ 2. ایجاد vercel.json
فایل `vercel.json` برای تنظیمات deployment ایجاد شد.

### ✅ 3. بهبود next.config.js
تنظیمات SSR و security اضافه شد.

## مراحل Deployment:

### مرحله 1: Vercel (توصیه شده)

1. **نصب Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **تنظیم Environment Variables در Vercel Dashboard:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### مرحله 2: Netlify

1. **ایجاد فایل `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **تنظیم Environment Variables در Netlify Dashboard**

### مرحله 3: Railway

1. **ایجاد فایل `railway.json`:**
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/",
       "healthcheckTimeout": 100,
       "restartPolicyType": "ON_FAILURE"
     }
   }
   ```

### مرحله 4: Docker

1. **ایجاد Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app

   # Install dependencies based on the preferred package manager
   COPY package.json package-lock.json* ./
   RUN npm ci

   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .

   # Next.js collects completely anonymous telemetry data about general usage.
   # Learn more here: https://nextjs.org/telemetry
   # Uncomment the following line in case you want to disable telemetry during the build.
   ENV NEXT_TELEMETRY_DISABLED 1

   RUN npm run build

   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app

   ENV NODE_ENV production
   ENV NEXT_TELEMETRY_DISABLED 1

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public

   # Set the correct permission for prerender cache
   RUN mkdir .next
   RUN chown nextjs:nodejs .next

   # Automatically leverage output traces to reduce image size
   # https://nextjs.org/docs/advanced-features/output-file-tracing
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs

   EXPOSE 3000

   ENV PORT 3000
   ENV HOSTNAME "0.0.0.0"

   CMD ["node", "server.js"]
   ```

## بررسی SSR:

### تست 1: View Page Source
1. روی صفحه راست کلیک کنید
2. "View Page Source" را انتخاب کنید
3. باید HTML کامل ببینید (نه فقط `<div id="root">`)

### تست 2: Disable JavaScript
1. JavaScript را در مرورگر غیرفعال کنید
2. صفحه باید محتوا را نمایش دهد

### تست 3: curl یا wget
```bash
curl https://your-domain.com
```
باید HTML کامل دریافت کنید.

## مشکلات رایج:

### مشکل: "Cannot find module"
**راه‌حل:**
```bash
npm install
npm run build
```

### مشکل: "Environment variables not found"
**راه‌حل:**
Environment Variables را در platform dashboard تنظیم کنید.

### مشکل: "Build failed"
**راه‌حل:**
```bash
npm run build
```
خطاها را بررسی کنید.

## تنظیمات Environment Variables:

### Vercel:
1. Project Settings > Environment Variables
2. اضافه کردن:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Netlify:
1. Site Settings > Environment Variables
2. اضافه کردن متغیرهای بالا

### Railway:
1. Variables tab
2. اضافه کردن متغیرهای بالا

## نکات مهم:

1. **همیشه `npm run build` را قبل از deployment اجرا کنید**
2. **Environment Variables را درست تنظیم کنید**
3. **از platform های مناسب SSR استفاده کنید**
4. **لاگ‌های deployment را بررسی کنید**

## پلتفرم‌های توصیه شده برای SSR:

1. **Vercel** - بهترین برای Next.js
2. **Netlify** - خوب برای SSR
3. **Railway** - مناسب برای full-stack
4. **DigitalOcean App Platform** - مناسب
5. **AWS Amplify** - مناسب

## تست نهایی:

پس از deployment:
1. صفحه اصلی را باز کنید
2. View Page Source کنید
3. باید HTML کامل ببینید
4. JavaScript را غیرفعال کنید
5. محتوا باید نمایش داده شود

اگر این مراحل را انجام دادید و همچنان مشکل داشتید، لاگ‌های deployment را بررسی کنید.