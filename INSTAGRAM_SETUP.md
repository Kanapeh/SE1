# راهنمای تنظیم Instagram API

## مراحل دریافت Access Token اینستاگرام:

### 1. ایجاد اپلیکیشن Facebook
1. به [Facebook Developers](https://developers.facebook.com/apps) بروید
2. روی "Create App" کلیک کنید
3. نوع اپلیکیشن را "Consumer" انتخاب کنید
4. نام اپلیکیشن را وارد کنید

### 2. اضافه کردن محصول Instagram Basic Display
1. در داشبورد اپلیکیشن، روی "Add Product" کلیک کنید
2. "Instagram Basic Display" را پیدا و اضافه کنید

### 3. تنظیم OAuth Redirect URIs
1. در بخش "Instagram Basic Display" > "Basic Display"
2. در قسمت "Client OAuth Settings" > "Valid OAuth Redirect URIs" این آدرس را اضافه کنید:
   ```
   https://yourdomain.com/api/instagram-callback
   ```

### 4. دریافت Access Token
1. به بخش "Basic Display" > "User Token Generator" بروید
2. روی "Generate Token" کلیک کنید
3. دسترسی‌های مورد نیاز را انتخاب کنید:
   - `user_profile`
   - `user_media`
4. Access Token را کپی کنید

### 5. دریافت User ID
1. با استفاده از Access Token، این درخواست را بزنید:
   ```
   GET https://graph.instagram.com/me?fields=id&access_token=YOUR_ACCESS_TOKEN
   ```

### 6. تنظیم متغیرهای محیطی
در فایل `.env.local` این مقادیر را قرار دهید:
```env
INSTAGRAM_ACCESS_TOKEN=your_access_token_here
INSTAGRAM_USER_ID=your_user_id_here
```

## نکات مهم:
- Access Token ها معمولاً 60 روز اعتبار دارند
- برای تولید مجدد، دوباره از مرحله 4 شروع کنید
- در محیط توسعه، از Mock Data استفاده می‌شود
- برای تولید، حتماً Access Token معتبر تنظیم کنید

## تست API:
پس از تنظیم، می‌توانید API را تست کنید:
```
GET /api/instagram-posts
```

## ویژگی‌های کامپوننت:
- نمایش پست‌های اینستاگرام به صورت استوری
- پشتیبانی از تصاویر و ویدیوها
- نمایش تعداد لایک و کامنت
- لینک مستقیم به پست در اینستاگرام
- طراحی ریسپانسیو
- انیمیشن‌های زیبا 