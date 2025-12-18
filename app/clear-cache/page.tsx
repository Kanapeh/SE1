'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearCachePage() {
  const [status, setStatus] = useState<string>('');
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  const clearCache = async () => {
    setIsClearing(true);
    setStatus('در حال پاک کردن...');

    try {
      // Unregister تمام Service Worker ها
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          setStatus(`Service Worker حذف شد: ${registration.scope}`);
        }
      }

      // پاک کردن تمام cache ها
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        setStatus(`${cacheNames.length} cache حذف شد`);
      }

      // پاک کردن localStorage و sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      setStatus('تمام storage پاک شد');

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      setStatus(`خطا: ${error.message}`);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          پاک کردن Cache و Service Worker
        </h1>
        
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-center">
            این صفحه تمام cache ها، Service Worker ها و storage را پاک می‌کند.
          </p>

          {status && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">{status}</p>
            </div>
          )}

          <button
            onClick={clearCache}
            disabled={isClearing}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {isClearing ? 'در حال پاک کردن...' : 'پاک کردن همه چیز'}
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            💡 نکته: بعد از پاک کردن، به صورت خودکار به صفحه اصلی منتقل می‌شوید.
          </p>
        </div>
      </div>
    </div>
  );
}

