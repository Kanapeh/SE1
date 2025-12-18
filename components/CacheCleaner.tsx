'use client';

import { useEffect, useState } from 'react';

/**
 * کامپوننت برای پاک کردن cache و Service Worker در صورت نیاز
 * این کامپوننت در development به صورت خودکار cache را پاک می‌کند
 */
export default function CacheCleaner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    // بررسی پارامتر URL برای force cleanup
    const urlParams = new URLSearchParams(window.location.search);
    const forceCleanup = urlParams.get('cleanup') === 'true';

    async function cleanupCache() {
      try {
        // Unregister تمام Service Worker ها
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log('🧹 Unregistered Service Worker:', registration.scope);
          }
        }

        // پاک کردن تمام cache ها
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => {
              console.log('🧹 Deleting cache:', cacheName);
              return caches.delete(cacheName);
            })
          );
        }

        // پاک کردن localStorage (اختیاری - فقط در صورت force cleanup)
        if (forceCleanup) {
          try {
            localStorage.clear();
            sessionStorage.clear();
            console.log('🧹 Cleared all storage');
          } catch (e) {
            console.warn('⚠️ Failed to clear storage:', e);
          }
        }

        console.log('✅ Cache cleanup completed');
      } catch (error) {
        console.warn('⚠️ Cache cleanup failed:', error);
      }
    }

    // فقط در صورت force cleanup یا اولین بار
    if (forceCleanup || !sessionStorage.getItem('cache-cleaned')) {
      cleanupCache().then(() => {
        sessionStorage.setItem('cache-cleaned', 'true');
        // اگر force cleanup بود، reload کنیم
        if (forceCleanup) {
          setTimeout(() => {
            window.location.href = window.location.pathname;
          }, 500);
        }
      });
    }
  }, [mounted]);

  return null;
}

