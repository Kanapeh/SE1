'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BrowserCompatibilityChecker from './BrowserCompatibilityChecker';
import { 
  Camera, 
  Shield, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Chrome,
  Globe,
  Monitor,
  Smartphone,
  RefreshCw,
  X,
  ExternalLink
} from 'lucide-react';

interface CameraPermissionGuideProps {
  isVisible: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export default function CameraPermissionGuide({ isVisible, onClose, onRetry }: CameraPermissionGuideProps) {
  const [activeStep, setActiveStep] = useState(0);

  const getBrowserInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome')) {
      return {
        name: 'Chrome',
        icon: Chrome,
        steps: [
          'روی آیکون دوربین در نوار آدرس کلیک کنید',
          'گزینه "Allow" یا "مجاز" را انتخاب کنید',
          'اگر آیکون نمایش نمی‌دهد، روی آیکون قفل کلیک کنید',
          'دسترسی دوربین و میکروفن را فعال کنید',
          'صفحه را رفرش کنید'
        ]
      };
    } else if (userAgent.includes('firefox')) {
      return {
        name: 'Firefox',
        icon: Globe,
        steps: [
          'روی آیکون دوربین در نوار آدرس کلیک کنید',
          'گزینه "Allow" را انتخاب کنید',
          'اگر دائمی می‌خواهید، "Remember this decision" را تیک بزنید',
          'صفحه را رفرش کنید'
        ]
      };
    } else if (userAgent.includes('safari')) {
      return {
        name: 'Safari',
        icon: Globe,
        steps: [
          'به Safari > Preferences بروید',
          'تب Websites را انتخاب کنید',
          'Camera و Microphone را پیدا کنید',
          'برای این سایت "Allow" انتخاب کنید',
          'صفحه را رفرش کنید'
        ]
      };
    } else {
      return {
        name: 'مرورگر شما',
        icon: Globe,
        steps: [
          'آیکون دوربین یا قفل در نوار آدرس را جستجو کنید',
          'دسترسی دوربین و میکروفن را فعال کنید',
          'صفحه را رفرش کنید',
          'از Chrome، Firefox یا Safari استفاده کنید'
        ]
      };
    }
  };

  const browserInfo = getBrowserInstructions();

  const troubleshootingSteps = [
    {
      icon: Shield,
      title: 'بررسی دسترسی‌ها',
      description: 'مطمئن شوید که دسترسی دوربین در مرورگر فعال است',
      action: 'بررسی Settings مرورگر'
    },
    {
      icon: Camera,
      title: 'تست دوربین',
      description: 'دوربین در سایر برنامه‌ها کار می‌کند؟',
      action: 'تست در برنامه دوربین سیستم'
    },
    {
      icon: RefreshCw,
      title: 'ری‌استارت',
      description: 'مرورگر را ببندید و دوباره باز کنید',
      action: 'Close و Open مرورگر'
    },
    {
      icon: Settings,
      title: 'تنظیمات سیستم',
      description: 'در تنظیمات سیستم، دسترسی دوربین را بررسی کنید',
      action: 'System Preferences > Privacy'
    }
  ];

  const protocols = [
    { name: 'HTTPS', required: true, current: location.protocol === 'https:' },
    { name: 'Localhost', required: false, current: location.hostname === 'localhost' },
    { name: 'IP Local', required: false, current: location.hostname.startsWith('192.168.') || location.hostname.startsWith('172.') }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    راهنمای فعال‌سازی دوربین
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    تشخیص و حل مشکلات تماس تصویری
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Browser Compatibility Check */}
              <BrowserCompatibilityChecker onRetry={onRetry} />
              
              {/* Protocol Check */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    بررسی امنیت اتصال
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {protocols.map((protocol) => (
                      <div key={protocol.name} className={`p-3 rounded-lg border ${
                        protocol.current 
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                          : protocol.required 
                            ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-700'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{protocol.name}</span>
                          {protocol.current ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : protocol.required ? (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-300" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {protocol.required ? 'ضروری' : 'اختیاری'}
                        </p>
                      </div>
                    ))}
                  </div>
                  {location.protocol !== 'https:' && location.hostname !== 'localhost' && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        ⚠️ تماس تصویری نیاز به اتصال HTTPS دارد. از localhost استفاده کنید یا SSL نصب کنید.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Browser Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <browserInfo.icon className="w-5 h-5" />
                    راهنمای {browserInfo.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {browserInfo.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Troubleshooting */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    رفع مشکل
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {troubleshootingSteps.map((step, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <step.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{step.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {step.action}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Test */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    تست سریع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={onRetry} className="flex-1">
                      <Camera className="w-4 h-4 mr-2" />
                      تست دوباره دوربین
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open('/video-call-help', '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      راهنمای کامل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  اگر مشکل ادامه دارد، از مرورگر مدرن‌تری استفاده کنید
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                    بستن
                  </Button>
                  <Button onClick={onRetry}>
                    تلاش مجدد
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
