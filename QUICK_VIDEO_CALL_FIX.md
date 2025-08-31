# راهنمای سریع حل مشکل Loading بی‌نهایت

## 🚨 مشکل فعلی:
صفحه در حالت "در حال بارگذاری اطلاعات کلاس" گیر کرده و دور خودش می‌چرخد.

## 🔧 راه‌حل‌های سریع:

### 1. بررسی Console (F12)
1. F12 را فشار دهید
2. Console tab را انتخاب کنید
3. پیام‌های زیر را بررسی کنید:
   ```
   Fetching data for booking ID: 4dd2eeae-4c26-437b-8108-4fedda6088d6
   Fetching booking data...
   Fetching student data...
   Fetching teacher data...
   ```

### 2. بررسی Network Tab
1. Network tab را انتخاب کنید
2. صفحه را refresh کنید
3. درخواست‌های Supabase را بررسی کنید

### 3. تست اتصال
در صفحه خطا، روی دکمه "تست اتصال" کلیک کنید تا ببینیم آیا اتصال به Supabase برقرار است.

## 🚨 مشکلات احتمالی:

### مشکل 1: اتصال به Supabase
**علت**: Environment variables درست تنظیم نشده
**راه‌حل**: فایل `.env.local` را بررسی کنید:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### مشکل 2: داده در دیتابیس وجود ندارد
**علت**: Booking ID در جدول `bookings` وجود ندارد
**راه‌حل**: در Supabase Dashboard بررسی کنید

### مشکل 3: RLS Policies
**علت**: Row Level Security اجازه خواندن نمی‌دهد
**راه‌حل**: RLS policies را بررسی کنید

## 🛠️ راه‌حل‌های اضافی:

### 1. Hard Refresh
- Ctrl+Shift+R (Windows/Linux)
- Cmd+Shift+R (Mac)

### 2. Clear Browser Data
- Settings > Privacy > Clear browsing data
- Cache و Cookies را پاک کنید

### 3. بررسی URL
مطمئن شوید که URL درست است:
```
http://localhost:3000/students/[student-id]/video-call?booking=[booking-id]
```

## 🔍 بررسی دیتابیس:

### در Supabase Dashboard:
1. **Table Editor** > **bookings**
2. جستجو کنید: `id = 4dd2eeae-4c26-437b-8108-4fedda6088d6`

### در Supabase Dashboard:
1. **Table Editor** > **students**  
2. جستجو کنید: `id = 6963b8c4-5394-43aa-8330-def5307db091`

## 📱 تست در مرورگرهای مختلف:

### Chrome:
- Developer Tools > Console
- Network tab

### Firefox:
- Web Developer > Console
- Network tab

### Safari:
- Develop > Show Web Inspector
- Network tab

## 🚀 راه‌حل نهایی:

اگر هیچ کدام از راه‌حل‌ها کار نکرد:

1. **Console errors را کپی کنید**
2. **Network tab screenshots بگیرید**
3. **URL کامل را کپی کنید**
4. **با تیم پشتیبانی تماس بگیرید**

## ⏰ Timeout:

صفحه حالا دارای timeout 10 ثانیه‌ای است. اگر بعد از 10 ثانیه اطلاعات بارگذاری نشود، پیام خطا نمایش داده می‌شود.

---

**نکته مهم**: ابتدا Console را بررسی کنید تا ببینید دقیقاً کجا گیر کرده است.
