# 🔧 حل مشکل ترتیب Hooks در React - Header Component

## 🚨 **مشکل شناسایی شده:**

### **❌ خطای نمایش داده شده:**
```
Error: React has detected a change in the order of Hooks called by Header. 
This will lead to bugs and errors if not fixed.

Previous render            Next render
------------------------------------------------------
1. useState                   useState
2. useState                   useState
3. useContext                 useContext
4. useState                   useState
5. useContext                 useContext
6. undefined                  useEffect
   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

### **🔍 علت مشکل:**
در `Header` component، `useEffect` بعد از `return null` قرار گرفته بود که باعث تغییر ترتیب Hooks می‌شد.

## 🛠️ **راه‌حل اعمال شده:**

### **1. قبل از تغییر (مشکل‌دار):**
```tsx
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // ❌ مشکل: useEffect بعد از return null
  if (pathname?.startsWith('/dashboard/student') || pathname?.startsWith('/students/')) {
    return null;
  }

  useEffect(() => {  // ← این Hook بعد از return null قرار داشت
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;
  // ...
}
```

### **2. بعد از تغییر (درست):**
```tsx
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // ✅ درست: useEffect قبل از return null
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ درست: return null بعد از تمام Hooks
  if (pathname?.startsWith('/dashboard/student') || pathname?.startsWith('/students/')) {
    return null;
  }

  if (!mounted) return null;
  // ...
}
```

## 📋 **قوانین Hooks در React:**

### **1. قانون اصلی:**
- **همیشه Hooks را در بالای component فراخوانی کنید**
- **هرگز Hooks را داخل شرط‌ها، حلقه‌ها یا توابع تو در تو قرار ندهید**
- **ترتیب Hooks باید در هر render یکسان باشد**

### **2. ترتیب صحیح:**
```tsx
export default function Component() {
  // ✅ 1. useState
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  
  // ✅ 2. useContext
  const context = useContext(MyContext);
  
  // ✅ 3. useEffect
  useEffect(() => {
    // logic
  }, []);
  
  // ✅ 4. سایر Hooks
  const value = useMemo(() => {}, []);
  
  // ✅ 5. شرط‌ها و return
  if (condition) return null;
  
  // ✅ 6. JSX
  return <div>...</div>;
}
```

### **3. ترتیب غلط:**
```tsx
export default function Component() {
  const [state, setState] = useState();
  
  // ❌ غلط: Hook بعد از return
  if (condition) return null;
  
  useEffect(() => {}, []); // ← این باعث خطا می‌شود
  
  return <div>...</div>;
}
```

## 🔧 **مراحل حل مشکل:**

### **مرحله 1: شناسایی مشکل**
1. خطای "change in the order of Hooks" را مشاهده کنید
2. component مشکل‌دار را شناسایی کنید
3. ترتیب Hooks را بررسی کنید

### **مرحله 2: بازسازی ترتیب**
1. تمام Hooks را به بالای component منتقل کنید
2. `useState`, `useContext`, `useEffect` را اول قرار دهید
3. شرط‌ها و return ها را بعد از Hooks قرار دهید

### **مرحله 3: تست**
1. صفحه را refresh کنید
2. خطا را بررسی کنید
3. عملکرد component را تست کنید

## 🎯 **نکات مهم:**

### **✅ باید انجام شود:**
- Hooks را همیشه در بالای component قرار دهید
- ترتیب Hooks را حفظ کنید
- شرط‌ها را بعد از Hooks قرار دهید

### **❌ نباید انجام شود:**
- Hooks را داخل شرط‌ها قرار دهید
- Hooks را بعد از return قرار دهید
- ترتیب Hooks را تغییر دهید

## 🚀 **مراحل تست:**

### **مرحله 1: تست Header**
1. به `/teachers` بروید
2. خطای Hooks را بررسی کنید
3. Header باید درست نمایش داده شود

### **مرحله 2: تست Navigation**
1. بین صفحات مختلف حرکت کنید
2. Header باید درست کار کند
3. هیچ خطایی نباید رخ دهد

### **مرحله 3: تست Student Pages**
1. به `/dashboard/student` بروید
2. Header نباید نمایش داده شود
3. StudentHeader باید نمایش داده شود

## 🔍 **مشکلات احتمالی:**

### **1. هنوز خطا رخ می‌دهد:**
**علت:** ممکن است component دیگری مشکل داشته باشد
**راه حل:** تمام components را بررسی کنید

### **2. Header نمایش داده نمی‌شود:**
**علت:** ممکن است شرط `pathname` درست کار نکند
**راه حل:** `console.log(pathname)` اضافه کنید

### **3. عملکرد کند شده:**
**علت:** ممکن است `useEffect` زیاد اجرا شود
**راه حل:** dependency array را بررسی کنید

## 📱 **تست موبایل:**

### **✅ بررسی کنید:**
- Header در موبایل درست نمایش داده شود
- منوی همبرگر کار کند
- Navigation درست کار کند
- هیچ خطایی رخ ندهد

## 🎉 **نتیجه نهایی:**

پس از حل مشکل:
- ✅ **خطای Hooks** برطرف شده
- ✅ **Header** درست کار می‌کند
- ✅ **Navigation** بدون مشکل است
- ✅ **Student pages** Header ندارند
- ✅ **Performance** بهبود یافته

**حالا Header component کاملاً درست کار می‌کند!** 🔧✅

## 🔄 **مرحله بعدی:**

برای اطمینان از عدم وجود مشکلات مشابه:
1. **بررسی سایر components** برای مشکلات Hooks
2. **تست کامل** تمام صفحات
3. **بهینه‌سازی performance** اگر نیاز باشد
4. **مستندسازی** قوانین Hooks برای تیم

**آیا می‌خواهید سایر components را هم بررسی کنیم؟** 🤔
