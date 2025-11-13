"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Menu, 
  X, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Star, 
  Calendar, 
  MessageCircle, 
  Award,
  Globe,
  Target,
  TrendingUp,
  Heart,
  Zap
} from "lucide-react";


export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navigating, setNavigating] = useState<string | null>(null);



  useEffect(() => {
    checkUser();
  }, []);

  // Reset navigating state when pathname changes
  useEffect(() => {
    setNavigating(null);
  }, [pathname]);

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking session:", error);
        return;
      }

      if (session?.user) {
        setIsLoggedIn(true);
        // دریافت اطلاعات کاربر
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("first_name, last_name")
          .eq("id", session.user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          return;
        }

        if (userData) {
          setUserName(`${userData.first_name} ${userData.last_name}`);
        }
      }
    } catch (error) {
      console.error("Error in checkUser:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartClick = () => {
    console.log("Start button clicked");
    window.location.href = "/register";
  };

  const navigationOptions = [
    {
      title: "معلم هستم",
      icon: GraduationCap,
      description: "ورود به پنل معلم و مدیریت کلاس‌ها",
      features: ["مدیریت کلاس‌ها", "برنامه‌ریزی زمانی", "پشتیبانی کامل"],
      color: "from-blue-500 to-purple-600",
      href: "/login",
      badge: "ورود سریع"
    },
    {
      title: "دانش‌آموز هستم",
      icon: BookOpen,
      description: "یادگیری زبان با بهترین معلمان",
      features: ["کلاس‌های خصوصی", "روش‌های نوین", "گواهینامه معتبر"],
      color: "from-green-500 to-teal-600",
      href: "/register?type=student",
      badge: "محبوب"
    },
    {
      title: "دوره‌های آنلاین",
      icon: Globe,
      description: "دوره‌های خودآموز با کیفیت بالا",
      features: ["دسترسی 24/7", "تمرین‌های تعاملی", "گواهینامه پایان دوره"],
      color: "from-orange-500 to-red-600",
      href: "/courses",
      badge: "جدید"
    },
    {
      title: "آزمون‌های بین‌المللی",
      icon: Target,
      description: "آمادگی برای آیلتس، تافل و...",
      features: ["شبیه‌سازی واقعی", "نمره‌دهی دقیق", "راهنمایی تخصصی"],
      color: "from-purple-500 to-pink-600",
      href: "/exam-preparation",
      badge: "تخصصی"
    }
  ];

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-100">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                آکادمی زبان سِ وان
              </Link>
              <div className="hidden lg:flex space-x-6">
                <Link 
                  href="/about" 
                  prefetch={true}
                  className={`text-gray-600 hover:text-primary transition-colors relative ${
                    navigating === '/about' ? 'opacity-50' : ''
                  }`}
                  onClick={() => setNavigating('/about')}
                >
                  درباره ما
                  {navigating === '/about' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </Link>
                <Link 
                  href="/courses" 
                  prefetch={true}
                  className={`text-gray-600 hover:text-primary transition-colors relative ${
                    navigating === '/courses' ? 'opacity-50' : ''
                  }`}
                  onClick={() => setNavigating('/courses')}
                >
                  دوره‌ها
                  {navigating === '/courses' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </Link>
                <Link 
                  href="/teachers" 
                  prefetch={true}
                  className={`text-gray-600 hover:text-primary transition-colors relative ${
                    navigating === '/teachers' ? 'opacity-50' : ''
                  }`}
                  onClick={() => setNavigating('/teachers')}
                >
                  معلمان
                  {navigating === '/teachers' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </Link>
                <Link 
                  href="/blog" 
                  prefetch={true}
                  className={`text-gray-600 hover:text-primary transition-colors relative ${
                    navigating === '/blog' ? 'opacity-50' : ''
                  }`}
                  onClick={() => setNavigating('/blog')}
                >
                  وبلاگ
                  {navigating === '/blog' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </Link>
                <Link 
                  href="/contact" 
                  prefetch={true}
                  className={`text-gray-600 hover:text-primary transition-colors relative ${
                    navigating === '/contact' ? 'opacity-50' : ''
                  }`}
                  onClick={() => setNavigating('/contact')}
                >
                  تماس با ما
                  {navigating === '/contact' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!loading && (
                <>
                  {isLoggedIn ? (
                                         <div className="flex items-center space-x-3">
                       <span className="text-gray-600 font-medium">{userName}</span>
                       <Link href="/dashboard">
                         <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
                           داشبورد
                         </button>
                       </Link>
                     </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                                             <button
                         onClick={() => setIsSidebarOpen(true)}
                         className="hidden md:flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                       >
                         <Menu className="w-4 h-4" />
                         <span>منو</span>
                       </button>
                                             <button
                         onClick={handleStartClick}
                         className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                       >
                         شروع کنید
                       </button>
                    </div>
                  )}
                </>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

            {/* Navigation Sidebar */}
      {isSidebarOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }} onClick={() => setIsSidebarOpen(false)}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            maxWidth: '400px',
            height: '100%',
            backgroundColor: 'white',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>منوی ناوبری</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    color: '#6b7280',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                <div style={{ marginBottom: '24px', textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    به آکادمی زبان سِ وان خوش آمدید! 🎉
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    مسیر یادگیری یا تدریس خود را انتخاب کنید
                  </p>
                </div>

                {/* Navigation Options */}
                <div style={{ marginBottom: '24px' }}>
                  {navigationOptions.map((option, index) => (
                    <Link
                      key={index}
                      href={option.href}
                      prefetch={true}
                      onClick={() => {
                        setNavigating(option.href);
                        setIsSidebarOpen(false);
                      }}
                      style={{ 
                        display: 'block', 
                        textDecoration: 'none', 
                        marginBottom: '16px',
                        opacity: navigating === option.href ? 0.7 : 1,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      <div style={{
                        position: 'relative',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '2px solid #f3f4f6',
                        backgroundColor: '#fafafa',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}>
                        {/* Badge */}
                        {option.badge && (
                          <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
                            color: 'white',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontWeight: '500'
                          }}>
                            {option.badge}
                          </span>
                        )}
                        
                        {/* Icon */}
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          background: `linear-gradient(to right, ${option.color.split(' ')[1]}, ${option.color.split(' ')[3]})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '16px'
                        }}>
                          <option.icon style={{ width: '24px', height: '24px', color: 'white' }} />
                        </div>
                        
                        {/* Content */}
                        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                          {option.title}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                          {option.description}
                        </p>
                        
                        {/* Features */}
                        <div>
                          {option.features.map((feature, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                              <div style={{
                                width: '6px',
                                height: '6px',
                                backgroundColor: '#3b82f6',
                                borderRadius: '50%',
                                marginLeft: '8px'
                              }}></div>
                              <span style={{ fontSize: '12px', color: '#6b7280' }}>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Quick Actions */}
                <div style={{ paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>دسترسی سریع</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { href: '/teachers', icon: Users, text: 'معلمان' },
                      { href: '/courses', icon: BookOpen, text: 'دوره‌ها' },
                      { href: '/blog', icon: BookOpen, text: 'وبلاگ' },
                      { href: '/contact', icon: MessageCircle, text: 'تماس' },
                      { href: '/about', icon: Award, text: 'درباره ما' }
                    ].map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.href}
                        prefetch={true}
                        onClick={() => {
                          setNavigating(item.href);
                          setIsSidebarOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          textDecoration: 'none',
                          color: 'inherit',
                          opacity: navigating === item.href ? 0.6 : 1,
                          transition: 'opacity 0.2s'
                        }}
                      >
                        <item.icon style={{ width: '16px', height: '16px', color: '#3b82f6', marginLeft: '8px' }} />
                        <span style={{ fontSize: '14px' }}>{item.text}</span>
                        {navigating === item.href && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#3b82f6',
                            borderRadius: '50%',
                            marginRight: '8px',
                            animation: 'pulse 1.5s ease-in-out infinite'
                          }}></span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ paddingTop: '24px', borderTop: '1px solid #e5e7eb', marginTop: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>500+</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>دانش‌آموز</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>50+</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>معلم</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>98%</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>رضایت</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '24px',
                borderTop: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  با بهترین کیفیت و قیمت مناسب
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap style={{ width: '16px', height: '16px', color: '#f59e0b', marginLeft: '8px' }} />
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>پشتیبانی 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 