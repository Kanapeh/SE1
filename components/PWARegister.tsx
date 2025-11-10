"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Check if we're on HTTPS or localhost
      const isLocalhost = window.location.hostname === "localhost" || 
                          window.location.hostname === "127.0.0.1" ||
                          window.location.hostname === "[::1]";
      const isHttps = window.location.protocol === "https:";
      
      if (!isLocalhost && !isHttps) {
        console.warn("Service Worker requires HTTPS or localhost");
        return;
      }

      // Register service worker
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("✅ Service Worker registered successfully:", registration);
          console.log("Scope:", registration.scope);
          
          // Check for updates every hour
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);

          // Check for updates on page load
          registration.update();
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
          console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            url: error.filename,
            line: error.lineno,
          });
        });

      // Handle service worker updates
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("Service Worker updated, reloading page...");
        window.location.reload();
      });

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("Service Worker message:", event.data);
      });
    } else {
      console.warn("Service Worker not supported in this browser");
    }
  }, []);

  return null;
}

