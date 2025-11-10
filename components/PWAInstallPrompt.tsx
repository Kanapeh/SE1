"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isInStandaloneMode = (window.navigator as any).standalone === true;
      return isStandalone || isInStandaloneMode;
    };

    if (checkInstalled()) {
      setIsInstalled(true);
      return;
    }

    // Check if Android
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAndroidDevice = /android/.test(userAgent);
    setIsAndroid(isAndroidDevice);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("✅ beforeinstallprompt event received");
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 2 seconds
      setTimeout(() => {
        const dismissed = sessionStorage.getItem("pwa-prompt-dismissed");
        const expiry = sessionStorage.getItem("pwa-prompt-dismissed-expiry");
        const isExpired = expiry && Date.now() > parseInt(expiry);
        
        if (!dismissed || isExpired) {
          setShowPrompt(true);
        }
      }, 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For Android, also show prompt after delay even if event doesn't fire
    // This handles cases where the event might not trigger immediately
    let androidTimer: NodeJS.Timeout | null = null;
    if (isAndroidDevice) {
      androidTimer = setTimeout(() => {
        const dismissed = sessionStorage.getItem("pwa-prompt-dismissed");
        const expiry = sessionStorage.getItem("pwa-prompt-dismissed-expiry");
        const isExpired = expiry && Date.now() > parseInt(expiry);
        const alreadyShown = sessionStorage.getItem("pwa-prompt-shown");
        
        // Show prompt if:
        // 1. Not dismissed OR expired
        // 2. Not already shown in this session
        // 3. We don't have deferredPrompt yet (event hasn't fired)
        if ((!dismissed || isExpired) && !alreadyShown) {
          setShowPrompt(true);
          sessionStorage.setItem("pwa-prompt-shown", "true");
        }
      }, 5000);
    }

    // Check if app was just installed
    const handleAppInstalled = () => {
      console.log("✅ App installed");
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      sessionStorage.removeItem("pwa-prompt-dismissed");
      sessionStorage.removeItem("pwa-prompt-dismissed-expiry");
      sessionStorage.removeItem("pwa-prompt-shown");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (androidTimer) {
        clearTimeout(androidTimer);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Use the native prompt if available
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === "accepted") {
          console.log("✅ User accepted install");
          setShowPrompt(false);
          setDeferredPrompt(null);
        } else {
          console.log("❌ User dismissed install");
        }
      } catch (error) {
        console.error("Error showing install prompt:", error);
        // Fallback to manual instructions
        showManualInstructions();
      }
    } else {
      // Show manual instructions if prompt is not available
      showManualInstructions();
    }
  };

  const showManualInstructions = () => {
    if (isAndroid) {
      alert(
        "برای نصب اپلیکیشن:\n\n" +
        "1. منوی مرورگر (سه نقطه) را باز کنید\n" +
        "2. گزینه 'Add to Home screen' یا 'Install app' را انتخاب کنید\n" +
        "3. دکمه 'Install' یا 'Add' را بزنید\n\n" +
        "یا می‌توانید از آیکون نصب در address bar استفاده کنید."
      );
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 24 hours
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    sessionStorage.setItem("pwa-prompt-dismissed-expiry", expiry.toString());
  };

  // Check if dismissal has expired
  useEffect(() => {
    const dismissed = sessionStorage.getItem("pwa-prompt-dismissed");
    const expiry = sessionStorage.getItem("pwa-prompt-dismissed-expiry");
    
    if (dismissed && expiry) {
      if (Date.now() > parseInt(expiry)) {
        sessionStorage.removeItem("pwa-prompt-dismissed");
        sessionStorage.removeItem("pwa-prompt-dismissed-expiry");
      }
    }
  }, []);

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show if dismissed (and not expired)
  const dismissed = sessionStorage.getItem("pwa-prompt-dismissed");
  const expiry = sessionStorage.getItem("pwa-prompt-dismissed-expiry");
  if (dismissed && expiry && Date.now() < parseInt(expiry)) {
    return null;
  }

  // Show prompt if:
  // 1. showPrompt is true (set by timer or event)
  // 2. OR we have deferredPrompt (event fired)
  // 3. OR it's Android and we want to show manual instructions
  if (!showPrompt && !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-4" dir="rtl">
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 flex items-center gap-4">
        <div className="flex-1 text-right">
          <h3 className="font-semibold text-sm mb-1">نصب اپلیکیشن سِ وان</h3>
          <p className="text-xs text-muted-foreground">
            برای دسترسی سریع‌تر، اپلیکیشن را نصب کنید
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleInstallClick}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          >
            <Download className="h-4 w-4" />
            نصب
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

