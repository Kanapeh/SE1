# راه‌حل مشکل Email Rate Limit در Supabase

## 🚨 **مشکل: Email Rate Limit Exceeded**

```
Console AuthApiError: email rate limit exceeded
```

این خطا نشان می‌دهد که Supabase محدودیت ارسال ایمیل را اعمال کرده است.

## 📊 **محدودیت‌های Supabase:**

- **Free Plan**: 10 درخواست ایمیل در ساعت
- **Pro Plan**: 100 درخواست ایمیل در ساعت
- **Team Plan**: 1000 درخواست ایمیل در ساعت

## ✅ **راه‌حل‌های سریع:**

### **1. استفاده از Google OAuth (توصیه شده)**
Google OAuth نیازی به ارسال ایمیل تایید ندارد.

```typescript
// در فرم ثبت‌نام، از دکمه Google OAuth استفاده کنید
const handleGoogleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?user_type=teacher`,
    }
  });
};
```

### **2. تنظیم SMTP خود**
در Supabase، SMTP settings خود را اضافه کنید:

1. **به Supabase Dashboard بروید**
2. **Authentication > Settings > SMTP**
3. **تنظیمات SMTP خود را وارد کنید:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SENDER=your-email@gmail.com
```

### **3. استفاده از سرویس‌های خارجی**
- **SendGrid**
- **Mailgun**
- **Amazon SES**

## 🔧 **رفع مشکل در کد:**

### **بهبود Error Handling:**

```typescript
} catch (error: any) {
  console.error('Registration error:', error);
  let errorMessage = 'خطا در ثبت‌نام';
  let showRateLimitInfo = false;
  
  if (error.message) {
    if (error.message.includes('email rate limit exceeded')) {
      errorMessage = 'تعداد درخواست‌های ایمیل بیش از حد مجاز است';
      showRateLimitInfo = true;
    } else if (error.message.includes('User already registered')) {
      errorMessage = 'این ایمیل قبلاً ثبت شده است';
    } else {
      errorMessage = error.message;
    }
  }
  
  toast.error(errorMessage);
  
  if (showRateLimitInfo) {
    toast.error('لطفاً 60 دقیقه صبر کنید یا از Google OAuth استفاده کنید', {
      duration: 5000
    });
  }
}
```

### **تغییر Redirect URL:**

```typescript
const redirectUrl = `${window.location.origin}/auth/callback?user_type=teacher&email=${encodeURIComponent(formData.email)}`;

const { data: authData, error: authError } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    emailRedirectTo: redirectUrl,
    data: {
      full_name: `${formData.firstName} ${formData.lastName}`,
      user_type: 'teacher',
    }
  }
});
```

## 🚀 **راه‌حل‌های پیشرفته:**

### **1. Implement Retry Logic:**

```typescript
const signUpWithRetry = async (email: string, password: string, options: any) => {
  const maxRetries = 3;
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      });
      
      if (error) throw error;
      return { data, error: null };
      
    } catch (error: any) {
      lastError = error;
      
      if (error.message.includes('rate limit exceeded')) {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute
        continue;
      }
      
      // Other errors, don't retry
      break;
    }
  }
  
  return { data: null, error: lastError };
};
```

### **2. Queue System:**

```typescript
class EmailQueue {
  private queue: Array<{email: string, password: string, options: any}> = [];
  private processing = false;
  
  add(email: string, password: string, options: any) {
    this.queue.push({ email, password, options });
    this.process();
  }
  
  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) continue;
      
      try {
        await supabase.auth.signUp({
          email: item.email,
          password: item.password,
          options: item.options
        });
        
        // Wait between requests to avoid rate limit
        await new Promise(resolve => setTimeout(resolve, 6000)); // 6 seconds
        
      } catch (error) {
        console.error('Email queue error:', error);
        // Re-add to queue if it's a rate limit error
        if (error.message.includes('rate limit exceeded')) {
          this.queue.unshift(item);
          break;
        }
      }
    }
    
    this.processing = false;
  }
}

const emailQueue = new EmailQueue();
```

## 📋 **مراحل راه‌اندازی:**

### **مرحله 1: بررسی تنظیمات Supabase**
```sql
-- بررسی تنظیمات SMTP
SELECT * FROM auth.config;
```

### **مرحله 2: تنظیم SMTP**
1. **Gmail App Password ایجاد کنید**
2. **تنظیمات را در Supabase وارد کنید**
3. **تست کنید**

### **مرحله 3: تست سیستم**
```typescript
// تست ارسال ایمیل
const testEmail = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'testpassword123'
  });
  
  if (error) {
    console.error('Email test error:', error);
  } else {
    console.log('Email sent successfully');
  }
};
```

## 🎯 **بهترین روش‌ها:**

### **1. اولویت‌بندی:**
1. **Google OAuth** - سریع و بدون محدودیت
2. **SMTP خود** - کنترل کامل
3. **Supabase SMTP** - فقط برای تست

### **2. User Experience:**
- **راهنمای واضح** برای کاربران
- **گزینه‌های جایگزین** ارائه دهید
- **پیام‌های خطای مفید** نمایش دهید

### **3. Monitoring:**
- **Rate limit errors** را log کنید
- **SMTP delivery status** را بررسی کنید
- **User feedback** جمع‌آوری کنید

## 📞 **پشتیبانی:**

### **در صورت مشکل:**
1. **Supabase Status Page** را بررسی کنید
2. **Console logs** را چک کنید
3. **Network tab** را بررسی کنید
4. **Supabase Support** تماس بگیرید

### **اطلاعات مورد نیاز:**
- Error message کامل
- Supabase project ID
- Plan type (Free/Pro/Team)
- Steps to reproduce

## 🎉 **نتیجه:**

پس از اعمال این راه‌حل‌ها:
- ✅ مشکل rate limit حل می‌شود
- ✅ کاربران می‌توانند ثبت‌نام کنند
- ✅ سیستم پایدار می‌شود
- ✅ تجربه کاربری بهبود می‌یابد

**توصیه نهایی:** از Google OAuth استفاده کنید تا از مشکلات ایمیل جلوگیری کنید!