'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Globe, Monitor, Smartphone } from 'lucide-react';

interface BrowserInfo {
  name: string;
  version: string;
  supported: boolean;
  features: {
    getUserMedia: boolean;
    mediaDevices: boolean;
    webRTC: boolean;
    https: boolean;
  };
}

interface BrowserCompatibilityCheckerProps {
  onRetry: () => void;
}

export default function BrowserCompatibilityChecker({ onRetry }: BrowserCompatibilityCheckerProps) {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);

  useEffect(() => {
    const checkBrowser = () => {
      const userAgent = navigator.userAgent;
      let name = 'Unknown';
      let version = 'Unknown';
      let supported = false;

      // Detect browser
      if (userAgent.includes('Chrome')) {
        name = 'Chrome';
        const match = userAgent.match(/Chrome\/([0-9.]+)/);
        version = match ? match[1] : 'Unknown';
        supported = true;
      } else if (userAgent.includes('Firefox')) {
        name = 'Firefox';
        const match = userAgent.match(/Firefox\/([0-9.]+)/);
        version = match ? match[1] : 'Unknown';
        supported = true;
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        name = 'Safari';
        const match = userAgent.match(/Version\/([0-9.]+)/);
        version = match ? match[1] : 'Unknown';
        supported = true;
      } else if (userAgent.includes('Edge')) {
        name = 'Edge';
        const match = userAgent.match(/Edg\/([0-9.]+)/);
        version = match ? match[1] : 'Unknown';
        supported = true;
      }

      // Check if using IP address (common issue)
      const isIPAddress = location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/) && location.hostname !== '127.0.0.1';
      
      // Check features
      const features = {
        getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && !isIPAddress,
        mediaDevices: !!navigator.mediaDevices,
        webRTC: !!(window as any).RTCPeerConnection,
        https: location.protocol === 'https:' || location.hostname === 'localhost' || (!isIPAddress && (location.hostname.startsWith('192.168.') || location.hostname.startsWith('172.')))
      };

      setBrowserInfo({
        name,
        version,
        supported,
        features
      });
    };

    checkBrowser();
  }, []);

  if (!browserInfo) {
    return <div>در حال بررسی مرورگر...</div>;
  }

  const getFeatureIcon = (supported: boolean) => {
    return supported ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getDeviceIcon = () => {
    const userAgent = navigator.userAgent;
    if (/Mobi|Android/i.test(userAgent)) {
      return <Smartphone className="w-6 h-6" />;
    }
    return <Monitor className="w-6 h-6" />;
  };

  return (
    <div className="space-y-6">
      {/* Browser Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            اطلاعات مرورگر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              {getDeviceIcon()}
              <div>
                <p className="font-medium">{browserInfo.name} {browserInfo.version}</p>
                <Badge 
                  className={browserInfo.supported ? 
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }
                >
                  {browserInfo.supported ? 'پشتیبانی می‌شود' : 'پشتیبانی نمی‌شود'}
                </Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">آدرس فعلی:</p>
              <p className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {location.href}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            پشتیبانی ویژگی‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span>getUserMedia API</span>
              {getFeatureIcon(browserInfo.features.getUserMedia)}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span>MediaDevices API</span>
              {getFeatureIcon(browserInfo.features.mediaDevices)}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span>WebRTC Support</span>
              {getFeatureIcon(browserInfo.features.webRTC)}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span>Secure Context</span>
              {getFeatureIcon(browserInfo.features.https)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            پیشنهادات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/) && location.hostname !== '127.0.0.1' && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 font-medium mb-2">
                🚨 مشکل اصلی: استفاده از آدرس IP
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                آدرس فعلی: <code className="bg-red-100 px-1 rounded">{location.hostname}</code>
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    const newUrl = `http://localhost:${location.port}${location.pathname}`;
                    window.location.href = newUrl;
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  🚀 رفتن به localhost (حل مشکل)
                </Button>
                <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                  <li>• آدرس IP برای getUserMedia مجاز نیست</li>
                  <li>• فقط localhost و HTTPS امن محسوب می‌شوند</li>
                  <li>• با کلیک دکمه بالا مشکل حل می‌شود</li>
                </ul>
              </div>
            </div>
          )}

          {!browserInfo.features.getUserMedia && !location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/) && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 font-medium mb-2">
                ❌ getUserMedia پشتیبانی نمی‌شود
              </p>
              <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                <li>• از Chrome 53+، Firefox 36+، Safari 11+ استفاده کنید</li>
                <li>• مرورگر خود را به‌روزرسانی کنید</li>
                <li>• JavaScript را فعال کنید</li>
              </ul>
            </div>
          )}

          {!browserInfo.features.https && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-700 dark:text-yellow-300 font-medium mb-2">
                ⚠️ اتصال امن مورد نیاز است
              </p>
              <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
                <li>• از localhost استفاده کنید</li>
                <li>• یا از HTTPS tunnel (ngrok، localtunnel)</li>
                <li>• یا SSL certificate نصب کنید</li>
              </ul>
            </div>
          )}

          {browserInfo.features.getUserMedia && browserInfo.features.https && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-300 font-medium">
                ✅ همه چیز آماده است! اگر دوربین کار نمی‌کند، ممکن است مسدود باشد.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={onRetry} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              تلاش مجدد
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              رفرش صفحه
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
