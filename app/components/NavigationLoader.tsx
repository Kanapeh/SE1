"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset when pathname changes (navigation completed)
    setProgress(100);
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 300);
  }, [pathname]);

  useEffect(() => {
    // Simulate progress when loading
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90; // Keep at 90% until navigation completes
          return prev + Math.random() * 10;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [loading]);

  // Listen for link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href && !link.href.startsWith('#') && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:')) {
        const url = new URL(link.href);
        // Only show loader for internal navigation
        if (url.origin === window.location.origin) {
          setLoading(true);
          setProgress(10);
        }
      }
    };

    document.addEventListener('click', handleLinkClick, true);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-2 bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div 
        className="h-full bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 transition-all duration-300 ease-out relative overflow-hidden shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        style={{
          width: `${progress}%`,
        }}
      >
        {/* Shimmer effect for better visibility */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{
            animation: 'shimmer 1.5s infinite',
          }}
        />
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/50 via-blue-400/50 to-cyan-300/50 blur-sm" />
      </div>
    </div>
  );
}

