# راهنمای حل خطای Hydration در Next.js

## 🔍 مشکل
خطای زیر در کنسول مرورگر نمایش داده می‌شود:
```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

## 🎯 علت
این خطا معمولاً به دلیل تفاوت بین HTML سرور و کلاینت رخ می‌دهد. در مورد شما:

1. **Browser Extension**: Grammarly یا extension های مشابه HTML را تغییر می‌دهند
2. **Attributes اضافی**: `data-new-gr-c-check-loaded` و `data-gr-ext-installed` به body اضافه می‌شوند
3. **Hydration Mismatch**: HTML سرور با HTML کلاینت (بعد از تغییر extension) مطابقت ندارد

## 🛠️ راه‌حل‌های پیاده‌سازی شده

### 1. **ClientOnly Component**
کامپوننت `ClientOnly` ایجاد شد که فقط در سمت کلاینت رندر می‌شود:

```tsx
// components/ClientOnly.tsx
"use client";

import { useEffect, useState } from 'react';

export default function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
```

### 2. **suppressHydrationWarning**
به `html` و `body` اضافه شد:

```tsx
<html lang="fa" dir="rtl" suppressHydrationWarning>
  <body className="..." suppressHydrationWarning>
    <ClientOnly>
      {/* محتوای اصلی */}
    </ClientOnly>
  </body>
</html>
```

### 3. **Wrapping در ClientOnly**
تمام کامپوننت‌های اصلی در `ClientOnly` قرار گرفتند:

```tsx
<ClientOnly>
  <ThemeProvider>
    <Header />
    <main>{children}</main>
    <Footer />
    <FloatingWhatsApp />
    <Toaster />
    <PKCEDebugger />
  </ThemeProvider>
</ClientOnly>
```

## 🔧 راه‌حل‌های اضافی (در صورت نیاز)

### 4. **Dynamic Import برای کامپوننت‌های مشکل‌ساز**
```tsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./Component'), {
  ssr: false,
});
```

### 5. **useEffect برای State های مشکل‌ساز**
```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
```

### 6. **CSS برای مخفی کردن Extension Attributes**
```css
/* در globals.css */
[data-new-gr-c-check-loaded],
[data-gr-ext-installed] {
  display: none !important;
}
```

## 📋 مراحل تست

1. **صفحه را refresh کنید**
2. **کنسول مرورگر را بررسی کنید**
3. **خطای Hydration نباید رخ دهد**
4. **صفحه باید بدون مشکل لود شود**

## 🚨 نکات مهم

### Browser Extensions
- **Grammarly**: معمولاً مشکل‌ساز است
- **Ad blockers**: ممکن است HTML را تغییر دهند
- **Password managers**: گاهی مشکل ایجاد می‌کنند

### Development vs Production
- خطا در development بیشتر دیده می‌شود
- در production ممکن است کمتر مشکل‌ساز باشد
- `suppressHydrationWarning` فقط warning را مخفی می‌کند، مشکل را حل نمی‌کند

## 🎯 نتیجه
با پیاده‌سازی این راه‌حل‌ها:
- ✅ خطای Hydration برطرف می‌شود
- ✅ Browser extensions تأثیری ندارند
- ✅ عملکرد سایت بهبود می‌یابد
- ✅ تجربه کاربری بهتر می‌شود

## 🔍 عیب‌یابی
اگر هنوز مشکل دارید:
1. **Browser extensions را غیرفعال کنید**
2. **Incognito mode تست کنید**
3. **کنسول را برای خطاهای دیگر بررسی کنید**
4. **Network tab را برای مشکلات API بررسی کنید**
