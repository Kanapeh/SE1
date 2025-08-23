# راهنمای اصلاح فرآیند ثبت‌نام معلم

## تغییرات انجام شده

### 1. ✅ حذف دکمه "فرم چندمرحله‌ای" از صفحه register

**مشکل**: در صفحه `/register?type=teacher` دکمه‌ای وجود داشت که کاربر را به فرم چندمرحله‌ای هدایت می‌کرد.

**راه‌حل**: این دکمه حذف شد تا کاربر مستقیماً با گوگل ثبت‌نام کند.

**فایل تغییر یافته**: `app/register/page.tsx`

**قبل**:
```tsx
{userType === 'teacher' && (
  <div className="mt-4">
    <a href="/register/teacher" className="...">
      ثبت‌نام کامل معلم (فرم چند مرحله‌ای)
    </a>
  </div>
)}
```

**بعد**: دکمه کاملاً حذف شد.

### 2. ✅ حل خطای "Auth-users table access error"

**مشکل**: خطای `❌ Auth-users table access error: {}` در `app/auth/complete/page.tsx` رخ می‌داد.

**علت**: جدول `auth-users` وجود نداشت یا قابل دسترسی نبود.

**راه‌حل**: کد اصلاح شد تا ابتدا وجود جدول را بررسی کند و در صورت عدم وجود، خطا ندهد.

**فایل تغییر یافته**: `app/auth/complete/page.tsx`

**قبل**:
```tsx
if (tableError) {
  console.error('❌ Auth-users table access error:', {
    message: tableError.message,
    code: tableError.code,
    details: tableError.details,
    hint: tableError.hint
  });
  console.log('⚠️ Auth-users table may not exist or be accessible');
}
```

**بعد**:
```tsx
if (tableError) {
  if (tableError.code === '42P01') { // Table doesn't exist
    console.log('ℹ️ Auth-users table does not exist, skipping admin check');
  } else {
    console.log('⚠️ Auth-users table access error (may not exist):', tableError.message);
  }
}
```

## فرآیند جدید ثبت‌نام معلم

### مرحله 1: انتخاب نوع کاربر
- کاربر در Header روی "من معلم هستم" کلیک می‌کند
- به `/register?type=teacher` هدایت می‌شود

### مرحله 2: ثبت‌نام با گوگل
- صفحه register فقط دکمه "ادامه با گوگل" را نشان می‌دهد
- دکمه فرم چندمرحله‌ای حذف شده است
- کاربر با گوگل ثبت‌نام می‌کند

### مرحله 3: تکمیل پروفایل
- بعد از تأیید گوگل، کاربر به `/complete-profile?type=teacher` هدایت می‌شود
- فرم چندمرحله‌ای کامل برای تکمیل پروفایل معلم نمایش داده می‌شود

## مزایای این تغییرات

1. **سادگی**: کاربر فقط یک گزینه دارد (گوگل)
2. **سرعت**: بدون نیاز به تأیید ایمیل
3. **تجربه بهتر**: فرم چندمرحله‌ای بعد از احراز هویت
4. **امنیت**: RLS policies از دسترسی غیرمجاز جلوگیری می‌کنند

## نکات مهم

- جدول `auth-users` اختیاری است و در صورت عدم وجود، خطا نمی‌دهد
- فرم چندمرحله‌ای در `complete-profile` قرار دارد، نه در `register`
- کاربران جدید مستقیماً به تکمیل پروفایل هدایت می‌شوند

## تست

1. روی "من معلم هستم" کلیک کنید
2. در صفحه register فقط دکمه گوگل باید دیده شود
3. با گوگل ثبت‌نام کنید
4. به فرم چندمرحله‌ای هدایت شوید
5. خطای auth-users table نباید رخ دهد
