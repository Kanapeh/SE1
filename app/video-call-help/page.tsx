'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Video,
  Camera,
  Mic,
  Monitor,
  Wifi,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  Globe,
  Smartphone,
  Laptop,
  Chrome,
  HelpCircle,
  Play,
  Volume2,
  Shield,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TroubleshootingStep {
  id: string;
  title: string;
  description: string;
  solutions: string[];
  severity: 'low' | 'medium' | 'high';
}

interface BrowserSupport {
  name: string;
  icon: any;
  supported: boolean;
  version: string;
  features: string[];
}

export default function VideoCallHelpPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('troubleshooting');

  const troubleshootingSteps: TroubleshootingStep[] = [
    {
      id: 'media-access',
      title: 'دسترسی به دوربین/میکروفن رد شده',
      description: 'مرورگر شما دسترسی به دوربین یا میکروفن را رد کرده است',
      solutions: [
        'روی آیکون قفل در نوار آدرس کلیک کنید',
        'دسترسی دوربین و میکروفن را فعال کنید',
        'صفحه را رفرش کنید',
        'تنظیمات مرورگر > حریم خصوصی > دوربین/میکروفن'
      ],
      severity: 'high'
    },
    {
      id: 'no-camera',
      title: 'دوربین یا میکروفن پیدا نشد',
      description: 'سیستم نمی‌تواند دوربین یا میکروفن شما را پیدا کند',
      solutions: [
        'اتصال دوربین/میکروفن را بررسی کنید',
        'درایور دستگاه‌ها را به‌روزرسانی کنید',
        'سایر برنامه‌هایی که از دوربین استفاده می‌کنند را ببندید',
        'کامپیوتر را ری‌استارت کنید'
      ],
      severity: 'medium'
    },
    {
      id: 'browser-not-supported',
      title: 'مرورگر پشتیبانی نمی‌شود',
      description: 'مرورگر شما از تماس تصویری پشتیبانی نمی‌کند',
      solutions: [
        'از Chrome، Firefox، Safari یا Edge استفاده کنید',
        'مرورگر خود را به‌روزرسانی کنید',
        'از آخرین نسخه مرورگر استفاده کنید',
        'JavaScript را فعال کنید'
      ],
      severity: 'high'
    },
    {
      id: 'connection-issues',
      title: 'مشکلات اتصال',
      description: 'کیفیت صدا یا تصویر ضعیف است',
      solutions: [
        'اتصال اینترنت خود را بررسی کنید',
        'سایر برنامه‌های مصرف‌کننده اینترنت را ببندید',
        'به شبکه WiFi پایدارتری متصل شوید',
        'از اتصال کابلی استفاده کنید'
      ],
      severity: 'medium'
    }
  ];

  const browserSupport: BrowserSupport[] = [
    {
      name: 'Chrome',
      icon: Chrome,
      supported: true,
      version: '60+',
      features: ['وب‌کم', 'میکروفن', 'اشتراک صفحه', 'چت']
    },
    {
      name: 'Firefox',
      icon: Globe,
      supported: true,
      version: '55+',
      features: ['وب‌کم', 'میکروفن', 'اشتراک صفحه', 'چت']
    },
    {
      name: 'Safari',
      icon: Monitor,
      supported: true,
      version: '11+',
      features: ['وب‌کم', 'میکروفن', 'چت']
    },
    {
      name: 'Edge',
      icon: Globe,
      supported: true,
      version: '80+',
      features: ['وب‌کم', 'میکروفن', 'اشتراک صفحه', 'چت']
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <HelpCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                بازگشت
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  راهنمای تماس تصویری
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  حل مشکلات و راهنمای استفاده از سیستم تماس تصویری
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                تست سریع سیستم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => router.push('/test-video')}
                  className="h-16 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  <Video className="w-6 h-6" />
                  <span>تست تماس تصویری</span>
                </Button>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">پیش از شروع:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      دوربین و میکروفن متصل باشد
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      اتصال اینترنت پایدار داشته باشید
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      از مرورگر مدرن استفاده کنید
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <TabsTrigger value="troubleshooting" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              رفع مشکل
            </TabsTrigger>
            <TabsTrigger value="browsers" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              مرورگرها
            </TabsTrigger>
            <TabsTrigger value="requirements" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              نیازمندی‌ها
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              نکات
            </TabsTrigger>
          </TabsList>

          {/* Troubleshooting Tab */}
          <TabsContent value="troubleshooting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {troubleshootingSteps.map((step) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0 h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {getSeverityIcon(step.severity)}
                          {step.title}
                        </CardTitle>
                        <Badge className={getSeverityColor(step.severity)}>
                          {step.severity === 'high' ? 'بحرانی' : 
                           step.severity === 'medium' ? 'متوسط' : 'کم'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">راه‌حل:</h4>
                        <ol className="space-y-2">
                          {step.solutions.map((solution, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                              {solution}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Browser Support Tab */}
          <TabsContent value="browsers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {browserSupport.map((browser) => (
                <motion.div
                  key={browser.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <browser.icon className="w-8 h-8" />
                        <div>
                          <h3 className="text-lg font-semibold">{browser.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            نسخه {browser.version}
                          </p>
                        </div>
                        <Badge className={browser.supported ? 
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }>
                          {browser.supported ? 'پشتیبانی' : 'عدم پشتیبانی'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">ویژگی‌های پشتیبانی شده:</h4>
                        <div className="flex flex-wrap gap-2">
                          {browser.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Requirements Tab */}
          <TabsContent value="requirements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Laptop className="w-5 h-5" />
                    سیستم مورد نیاز
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <p className="text-sm font-medium">دوربین</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">720p یا بالاتر</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Mic className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <p className="text-sm font-medium">میکروفن</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">استریو یا مونو</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Volume2 className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <p className="text-sm font-medium">بلندگو/هدفون</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">کیفیت صوت خوب</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <Wifi className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                      <p className="text-sm font-medium">اینترنت</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">2Mbps یا بیشتر</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    امنیت و حریم خصوصی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">اتصال امن</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">تمام تماس‌ها از طریق HTTPS رمزگذاری می‌شوند</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">عدم ذخیره‌سازی</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">ویدیوها و صداها ذخیره نمی‌شوند</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">کنترل دسترسی</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">شما کنترل کامل روی دوربین و میکروفن دارید</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Monitor className="w-5 h-5 text-blue-500" />
                    کیفیت تصویر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• نور کافی پشت دوربین داشته باشید</li>
                    <li>• از پس‌زمینه ساده استفاده کنید</li>
                    <li>• دوربین را در ارتفاع چشم قرار دهید</li>
                    <li>• از لرزش دوربین جلوگیری کنید</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Volume2 className="w-5 h-5 text-green-500" />
                    کیفیت صدا
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• از هدفون یا ایرفون استفاده کنید</li>
                    <li>• در محیط آرام صحبت کنید</li>
                    <li>• میکروفن را نزدیک دهان قرار دهید</li>
                    <li>• از صحبت همزمان خودداری کنید</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wifi className="w-5 h-5 text-purple-500" />
                    اتصال پایدار
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• از WiFi پایدار استفاده کنید</li>
                    <li>• سایر دانلودها را متوقف کنید</li>
                    <li>• نزدیک مودم باشید</li>
                    <li>• از اتصال کابلی استفاده کنید</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
