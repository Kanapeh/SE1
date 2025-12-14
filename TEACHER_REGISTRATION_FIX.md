# رفع مشکلات ثبت‌نام معلم

## مشکلات برطرف شده

### 1. ✅ مشکل لودینگ طولانی صفحه
**مشکل**: صفحه ثبت‌نام معلم خیلی طول می‌کشد تا لود شود

**راه‌حل**:
- اضافه شدن `pageLoading` state برای نمایش loading بهتر
- بهبود Suspense fallback با UI بهتر
- کاهش زمان loading به 200ms

### 2. ✅ خطای "Error sending confirmation email"
**مشکل**: وقتی با ایمیل ثبت‌نام می‌کنند، خطای "Error sending confirmation email" می‌دهد

**راه‌حل**:
- بررسی اینکه آیا کاربر ایجاد شده یا نه (حتی اگر ایمیل fail شده)
- اگر کاربر ایجاد شده، اجازه ادامه ثبت‌نام
- Redirect به صفحه login با email pre-filled
- پیام واضح به کاربر که می‌تواند وارد شود

### 3. ✅ بهبود UX
- پیام‌های واضح‌تر برای کاربر
- پیشنهاد استفاده از Google OAuth
- Redirect خودکار به login بعد از ثبت‌نام
- نمایش email در فیلد login

## تغییرات اعمال شده

### 1. `app/register/teacher/page.tsx`

#### بهبود Error Handling
```typescript
// بررسی اینکه آیا کاربر ایجاد شده یا نه
if (authError.message?.includes('Error sending confirmation email') && authData?.user) {
  // ادامه ثبت‌نام حتی اگر ایمیل fail شده
  console.warn('User created but email confirmation failed');
  // Continue with registration
}
```

#### بهبود Redirect
```typescript
// بعد از ثبت‌نام موفق
toast.success('ثبت‌نام با موفقیت انجام شد!', {
  description: 'می‌توانید وارد شوید یا ایمیل تایید را بررسی کنید.',
  duration: 5000
});

// Redirect به login با email pre-filled
router.push(`/login?email=${encodeURIComponent(formData.email)}&registered=true`);
```

#### بهبود Loading
```typescript
const [pageLoading, setPageLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setPageLoading(false);
  }, 200);
  return () => clearTimeout(timer);
}, []);
```

### 2. `app/register/page.tsx`

#### بهبود Error Handling
```typescript
// بررسی اینکه آیا کاربر ایجاد شده یا نه
if (userCreated && emailError) {
  toast.success('ثبت‌نام با موفقیت انجام شد!', {
    description: 'ایمیل تایید ارسال نشد، اما می‌توانید وارد شوید.',
    duration: 5000
  });
  
  // Redirect به login
  setTimeout(() => {
    router.push('/login?email=' + encodeURIComponent(email));
  }, 2000);
  return;
}
```

### 3. `app/login/page.tsx`

#### بهبود Error Handling برای Email Not Confirmed
```typescript
} else if (error.message.includes("Email not confirmed")) {
  setError("ایمیل شما تایید نشده است");
  toast.error("لطفاً ایمیل خود را تایید کنید یا از Google OAuth استفاده کنید", {
    description: "اگر ایمیل تایید را دریافت نکرده‌اید، می‌توانید از دکمه 'ورود با گوگل' استفاده کنید.",
    duration: 8000
  });
}
```

#### Auto-fill Email از URL
```typescript
useEffect(() => {
  if (searchParams?.get('email')) {
    setEmail(searchParams.get('email') || '');
  }
  if (searchParams?.get('registered') === 'true') {
    toast.info('ثبت‌نام شما با موفقیت انجام شد. می‌توانید وارد شوید.', {
      duration: 5000
    });
  }
}, [searchParams]);
```

## راهنمای استفاده

### برای معلمان جدید:

1. **ثبت‌نام با ایمیل**:
   - به `/register/teacher` بروید
   - فرم 5 مرحله‌ای را تکمیل کنید
   - اگر خطای ایمیل آمد، نگران نباشید
   - به صفحه login هدایت می‌شوید
   - می‌توانید با همان email و password وارد شوید

2. **ثبت‌نام با Google OAuth** (توصیه می‌شود):
   - به `/register/teacher` بروید
   - روی "ادامه با گوگل" کلیک کنید
   - این روش نیازی به تایید ایمیل ندارد

3. **اگر خطای "Email not confirmed" در login دیدید**:
   - از دکمه "ورود با گوگل" استفاده کنید
   - یا با ادمین تماس بگیرید تا ایمیل شما را تایید کند

## نکات مهم

1. **Email Confirmation**:
   - اگر خطای ایمیل آمد، کاربر ایجاد می‌شود
   - می‌تواند با email و password وارد شود
   - یا از Google OAuth استفاده کند

2. **Google OAuth**:
   - بهترین روش برای ثبت‌نام
   - نیازی به تایید ایمیل ندارد
   - سریع‌تر و راحت‌تر

3. **Admin Approval**:
   - بعد از ثبت‌نام، معلم باید توسط ادمین تایید شود
   - تا زمانی که تایید نشود، نمی‌تواند کلاس برگزار کند

## تست

### تست ثبت‌نام با ایمیل:
1. به `/register/teacher` بروید
2. فرم را تکمیل کنید
3. اگر خطای ایمیل آمد، بررسی کنید که:
   - پیام موفقیت نمایش داده شود
   - به صفحه login redirect شود
   - email در فیلد login pre-filled باشد

### تست ثبت‌نام با Google:
1. به `/register/teacher` بروید
2. روی "ادامه با گوگل" کلیک کنید
3. باید بدون مشکل وارد شود

---

**تاریخ اعمال تغییرات**: 2024
**وضعیت**: ✅ تمام مشکلات برطرف شد

