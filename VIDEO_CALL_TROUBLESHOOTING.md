# راهنمای عیب‌یابی تماس تصویری

## 🚨 مشکل: اطلاعات اشتباه در صفحه تماس تصویری

### مشکل فعلی:
وقتی روی "شروع کلاس" کلیک می‌کنید، به آدرس زیر می‌روید:
```
http://localhost:3000/students/6963b8c4-5394-43aa-8330-def5307db091/video-call?booking=4dd2eeae-4c26-437b-8108-4fedda6088d6
```

اما اطلاعات نمایش داده شده اشتباه و فیک است.

## 🔧 راه‌حل‌های اعمال شده:

### 1. حذف داده‌های Mock
- **قبل**: صفحه از داده‌های ثابت استفاده می‌کرد
- **حالا**: داده‌ها از Supabase خوانده می‌شوند

### 2. خواندن اطلاعات واقعی Booking
```typescript
// Fetch booking data from Supabase
const { data: bookingData, error: bookingError } = await supabase
  .from('bookings')
  .select('*')
  .eq('id', bookingParam)
  .single();
```

### 3. خواندن اطلاعات دانشجو
```typescript
// Fetch student data
const { data: studentData, error: studentError } = await supabase
  .from('students')
  .select('*')
  .eq('id', studentId)
  .single();
```

### 4. خواندن اطلاعات معلم
```typescript
// Fetch teacher data
const { data: teacherData, error: teacherError } = await supabase
  .from('teachers')
  .select('*')
  .eq('id', bookingData.teacher_id)
  .single();
```

## 🧪 تست عملکرد:

### مرحله 1: بررسی Console
1. صفحه را باز کنید
2. F12 را فشار دهید
3. Console tab را انتخاب کنید
4. پیام‌های زیر را بررسی کنید:
   ```
   Fetching data for booking ID: 4dd2eeae-4c26-437b-8108-4fedda6088d6
   Booking data: { ... }
   Data loaded successfully: { studentInfo, classSession }
   ```

### مرحله 2: بررسی Network Tab
1. Network tab را انتخاب کنید
2. صفحه را refresh کنید
3. درخواست‌های Supabase را بررسی کنید:
   - `/rest/v1/bookings?id=eq.4dd2eeae-4c26-437b-8108-4fedda6088d6`
   - `/rest/v1/students?id=eq.6963b8c4-5394-43aa-8330-def5307db091`
   - `/rest/v1/teachers?id=eq.[teacher_id]`

### مرحله 3: بررسی داده‌های واقعی
اطلاعات نمایش داده شده باید با داده‌های Supabase مطابقت داشته باشد.

## 🚨 مشکلات احتمالی:

### مشکل 1: خطای "شناسه کلاس یافت نشد"
**علت**: پارامتر `booking` در URL وجود ندارد
**راه‌حل**: از داشبورد دانشجو استفاده کنید

### مشکل 2: خطای "کلاس یافت نشد"
**علت**: Booking ID در دیتابیس وجود ندارد
**راه‌حل**: Booking را در Supabase بررسی کنید

### مشکل 3: خطای "خطا در دریافت اطلاعات دانشجو"
**علت**: Student ID در دیتابیس وجود ندارد
**راه‌حل**: Student را در Supabase بررسی کنید

### مشکل 4: خطای "خطا در دریافت اطلاعات معلم"
**علت**: Teacher ID در دیتابیس وجود ندارد
**راه‌حل**: Teacher را در Supabase بررسی کنید

## 🔍 بررسی دیتابیس:

### 1. بررسی جدول Bookings:
```sql
SELECT * FROM bookings WHERE id = '4dd2eeae-4c26-437b-8108-4fedda6088d6';
```

### 2. بررسی جدول Students:
```sql
SELECT * FROM students WHERE id = '6963b8c4-5394-43aa-8330-def5307db091';
```

### 3. بررسی جدول Teachers:
```sql
SELECT * FROM teachers WHERE id = '[teacher_id_from_booking]';
```

## 🛠️ عیب‌یابی بیشتر:

### 1. بررسی Environment Variables:
```bash
# در .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. بررسی Supabase Connection:
```typescript
// در console
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

### 3. بررسی RLS Policies:
مطمئن شوید که RLS policies اجازه خواندن داده‌ها را می‌دهند.

## 📱 تست در مرورگرهای مختلف:

### Chrome:
- Developer Tools > Console
- Network tab برای بررسی API calls

### Firefox:
- Web Developer > Console
- Network tab برای بررسی API calls

### Safari:
- Develop > Show Web Inspector
- Network tab برای بررسی API calls

## 🔄 راه‌حل‌های سریع:

### 1. Refresh صفحه:
- F5 یا Ctrl+R را فشار دهید
- Console errors را بررسی کنید

### 2. Clear Cache:
- Ctrl+Shift+R (Hard Refresh)
- یا Clear Browser Data

### 3. بررسی URL:
مطمئن شوید که URL درست است:
```
http://localhost:3000/students/[student-id]/video-call?booking=[booking-id]
```

## 📞 پشتیبانی:

اگر مشکل حل نشد:
1. Console errors را کپی کنید
2. Network tab screenshots بگیرید
3. URL کامل را کپی کنید
4. با تیم پشتیبانی تماس بگیرید

---

**نکته مهم**: پس از اعمال تغییرات، صفحه را refresh کنید و console را بررسی کنید.
