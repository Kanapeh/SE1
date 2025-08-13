# راهنمای رفع مشکل Login Redirect

## مشکل چیست؟

وقتی کاربر ادمین وارد سیستم می‌شود، پیام "خوش آمدید ادمین!" نمایش داده می‌شود اما کاربر در همان صفحه login باقی می‌ماند و به صفحه ادمین redirect نمی‌شود.

## علت مشکل

1. **عدم بررسی session موجود**: صفحه login فاقد useEffect برای بررسی session موجود بود
2. **عدم پشتیبانی از redirectTo**: پارامتر `redirectTo` در URL پردازش نمی‌شد
3. **کد تکراری**: منطق redirect در چندین جا تکرار شده بود

## راه‌حل‌های اعمال شده

### 1. اضافه کردن useEffect برای بررسی session موجود

```typescript
// Check for existing session and redirect if user is already logged in
useEffect(() => {
  const checkExistingSession = async () => {
    try {
      console.log('🔍 Checking for existing session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check user role and redirect accordingly
        // ...
      }
    } catch (error) {
      console.error('💥 Error checking existing session:', error);
    }
  };

  checkExistingSession();
}, [router, searchParams]);
```

### 2. ایجاد تابع کمکی برای مدیریت redirect

```typescript
// Helper function to handle redirects
const handleRedirect = (defaultPath: string, message: string) => {
  toast.success(message);
  
  // Check if there's a redirectTo parameter
  const redirectTo = searchParams.get('redirectTo');
  if (redirectTo && redirectTo.startsWith('/')) {
    console.log(`🔄 Redirecting to: ${redirectTo}`);
    router.push(redirectTo);
  } else {
    console.log(`🔄 Redirecting to default: ${defaultPath}`);
    router.push(defaultPath);
  }
};
```

### 3. پشتیبانی از پارامتر redirectTo

حالا صفحه login از پارامتر `redirectTo` در URL پشتیبانی می‌کند:

- `/login?redirectTo=%2Fadmin` → redirect به `/admin`
- `/login?redirectTo=%2Fdashboard` → redirect به `/dashboard`
- `/login?redirectTo=%2Fcomplete-profile` → redirect به `/complete-profile`

## نحوه کارکرد

### 1. بررسی session موجود

وقتی صفحه login بارگذاری می‌شود:
1. بررسی می‌شود که آیا session فعال وجود دارد
2. اگر وجود دارد، نقش کاربر بررسی می‌شود
3. کاربر به صفحه مناسب redirect می‌شود

### 2. پردازش redirectTo

پس از ورود موفقیت‌آمیز:
1. پارامتر `redirectTo` از URL خوانده می‌شود
2. اگر معتبر باشد، کاربر به آن صفحه redirect می‌شود
3. در غیر این صورت، به صفحه پیش‌فرض می‌رود

### 3. مدیریت نقش‌های مختلف

- **Admin**: redirect به `/admin`
- **Teacher**: redirect به `/admin`
- **Student**: redirect به `/dashboard`
- **بدون پروفایل**: redirect به `/complete-profile`

## تست کردن

### 1. صفحه تست

به `/test-login-redirect` بروید تا بتوانید:
- سناریوهای مختلف redirect را تست کنید
- نتایج را مشاهده کنید
- عملکرد را بررسی کنید

### 2. تست دستی

1. به `/login?redirectTo=%2Fadmin` بروید
2. با حساب ادمین وارد شوید
3. باید به `/admin` redirect شوید

### 3. بررسی console

در Developer Tools مرورگر، به دنبال پیام‌های زیر باشید:
- `🔍 Checking for existing session...`
- `✅ Existing session found for user: ...`
- `🔄 Redirecting to: /admin`

## نکات مهم

1. **Session persistence**: session باید در localStorage حفظ شود
2. **Role checking**: نقش کاربر باید در database تعریف شده باشد
3. **URL validation**: پارامتر redirectTo باید با `/` شروع شود
4. **Error handling**: خطاها باید به درستی مدیریت شوند

## عیب‌یابی

### اگر redirect کار نمی‌کند:

1. **Console را بررسی کنید**: به دنبال خطاها باشید
2. **Session را بررسی کنید**: آیا session فعال است؟
3. **Database را بررسی کنید**: آیا نقش کاربر درست تعریف شده؟
4. **URL را بررسی کنید**: آیا redirectTo درست است؟

### اگر پیام "خوش آمدید ادمین!" نمایش داده می‌شود اما redirect نمی‌شود:

1. **Router را بررسی کنید**: آیا Next.js router درست کار می‌کند؟
2. **Navigation را بررسی کنید**: آیا صفحه admin وجود دارد؟
3. **Middleware را بررسی کنید**: آیا middleware مانع redirect می‌شود؟

## فایل‌های تغییر یافته

1. **`app/login/page.tsx`** - اضافه کردن useEffect و تابع handleRedirect
2. **`app/test-login-redirect/page.tsx`** - صفحه تست جدید
3. **`LOGIN_REDIRECT_FIX.md`** - این راهنما

## نتیجه

حالا صفحه login باید:
- ✅ session موجود را تشخیص دهد
- ✅ کاربران را به صفحه مناسب redirect کند
- ✅ از پارامتر redirectTo پشتیبانی کند
- ✅ پیام‌های مناسب نمایش دهد
- ✅ خطاها را مدیریت کند

## تست نهایی

پس از اعمال تغییرات:

1. به `/test-login-redirect` بروید
2. سناریوهای مختلف را تست کنید
3. با حساب ادمین وارد شوید
4. بررسی کنید که redirect درست کار می‌کند
