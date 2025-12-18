"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // در development، Service Worker را disable کنیم تا از مشکلات cache جلوگیری شود
    if (process.env.NODE_ENV === 'development') {
      // فقط unregister کنیم و register نکنیم
      (async () => {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log('🧹 Disabled Service Worker in development:', registration.scope);
          }
          
          // پاک کردن cache ها
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
          console.log('🧹 Cleared all caches in development');
        } catch (error) {
          console.debug('Cleanup error (OK):', error);
        }
      })();
      return; // در development، Service Worker را register نکنیم
    }

    // Check if we're on HTTPS or localhost
    const isLocalhost = window.location.hostname === "localhost" || 
                        window.location.hostname === "127.0.0.1" ||
                        window.location.hostname === "[::1]";
    const isHttps = window.location.protocol === "https:";
    
    if (!isLocalhost && !isHttps) {
      console.warn("Service Worker requires HTTPS or localhost");
      return;
    }

    async function registerServiceWorker() {
      try {
        // بررسی وجود فایل Service Worker قبل از register
        let swFileExists = false;
        try {
          const swResponse = await fetch("/sw.js", { 
            method: 'HEAD',
            cache: 'no-store' // همیشه از سرور بگیر
          });
          swFileExists = swResponse.ok;
        } catch (fetchError) {
          // اگر fetch خطا داد، احتمالاً فایل وجود ندارد
          console.debug("Service Worker file check failed:", fetchError);
          swFileExists = false;
        }

        if (!swFileExists) {
          // اگر فایل وجود ندارد، Service Worker های قدیمی را unregister کنیم
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              if (registration.scope === window.location.origin + '/' || 
                  registration.scope === window.location.origin + '/') {
                await registration.unregister();
                console.log('✅ Removed old Service Worker (file not found)');
              }
            }
          } catch (unregisterError) {
            console.debug('Failed to unregister old Service Workers:', unregisterError);
          }
          return; // بدون خطا return کنیم
        }

        // اگر Service Worker فعالی وجود دارد، بررسی کنیم که آیا نیاز به update دارد
        let existingRegistrations = await navigator.serviceWorker.getRegistrations();
        let existingRegistration = existingRegistrations.find(
          reg => reg.scope === window.location.origin + '/'
        );

        if (existingRegistration) {
          // اگر Service Worker وجود دارد، فقط update کنیم
          try {
            await existingRegistration.update();
            console.log("✅ Service Worker updated");
          } catch (updateError: any) {
            // اگر update خطا داد، ممکن است Service Worker corrupt شده باشد
            if (updateError.message?.includes('Not found') || 
                updateError.message?.includes('Failed to update')) {
              console.warn("⚠️ Service Worker update failed, unregistering...");
              try {
                await existingRegistration.unregister();
                // بعد از unregister، دوباره registration ها را بررسی کنیم
                await new Promise(resolve => setTimeout(resolve, 200));
                existingRegistrations = await navigator.serviceWorker.getRegistrations();
                existingRegistration = existingRegistrations.find(
                  reg => reg.scope === window.location.origin + '/'
                );
              } catch (unregisterError) {
                console.debug('Failed to unregister:', unregisterError);
                existingRegistration = null; // اگر unregister خطا داد، null کنیم
              }
            } else {
              throw updateError; // خطاهای دیگر را throw کنیم
            }
          }
        }

        // اگر Service Worker وجود ندارد یا unregister شد، register کنیم
        if (!existingRegistration || !existingRegistration.active) {
          const registration = await navigator.serviceWorker.register("/sw.js", { 
            scope: "/",
            updateViaCache: 'none' // همیشه از سرور بگیر
          });
          console.log("✅ Service Worker registered:", registration.scope);
          
          // بررسی وضعیت Service Worker
          if (registration.installing) {
            console.log("Service Worker installing...");
          } else if (registration.waiting) {
            console.log("Service Worker waiting...");
          } else if (registration.active) {
            console.log("Service Worker active");
          }

          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            console.log("Service Worker update found");
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log("New Service Worker installed, reloading...");
                  window.location.reload();
                }
              });
            }
          });
        } else {
          // اگر Service Worker فعال است، فقط event listener ها را اضافه کنیم
          const registration = existingRegistration;
          
          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            console.log("Service Worker update found");
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log("New Service Worker installed, reloading...");
                  window.location.reload();
                }
              });
            }
          });
        }

        // Listen for service worker messages (global listeners)
        navigator.serviceWorker.addEventListener("message", (event) => {
          console.log("Service Worker message:", event.data);
        });

        // Handle errors (global error handler)
        navigator.serviceWorker.addEventListener("error", (event) => {
          console.error("Service Worker error:", event);
        });

      } catch (error: any) {
        // خطا را log کنیم اما crash نکنیم
        console.error("❌ Service Worker registration failed:", error);
        
        // اگر خطا مربوط به فایل نبودن باشد، فقط warning بدهیم
        if (error.message?.includes('Not found') || error.message?.includes('404')) {
          console.warn("⚠️ Service Worker file not found. This is OK in development.");
        } else {
          console.error("Error details:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
          });
        }
      }
    }

    registerServiceWorker();
  }, []);

  return null;
}

