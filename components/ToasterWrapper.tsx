'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

export default function ToasterWrapper() {
  const [mounted, setMounted] = useState(false);
  const themeContext = useTheme();
  const theme = themeContext?.theme || 'system';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Sonner
      theme={theme as 'light' | 'dark' | 'system'}
      position="top-center"
      richColors
      expand={true}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-900 dark:group-[.toaster]:text-gray-100 dark:group-[.toaster]:border-gray-700',
          description: 'group-[.toast]:text-gray-600 dark:group-[.toast]:text-gray-300',
          success: 'group-[.toast]:bg-green-50 group-[.toast]:text-green-900 group-[.toast]:border-green-200 dark:group-[.toast]:bg-green-900/20 dark:group-[.toast]:text-green-100 dark:group-[.toast]:border-green-800',
          error: 'group-[.toast]:bg-red-50 group-[.toast]:text-red-900 group-[.toast]:border-red-200 dark:group-[.toast]:bg-red-900/20 dark:group-[.toast]:text-red-100 dark:group-[.toast]:border-red-800',
          warning: 'group-[.toast]:bg-yellow-50 group-[.toast]:text-yellow-900 group-[.toast]:border-yellow-200 dark:group-[.toast]:bg-yellow-900/20 dark:group-[.toast]:text-yellow-100 dark:group-[.toast]:border-yellow-800',
          info: 'group-[.toast]:bg-blue-50 group-[.toast]:text-blue-900 group-[.toast]:border-blue-200 dark:group-[.toast]:bg-blue-900/20 dark:group-[.toast]:text-blue-100 dark:group-[.toast]:border-blue-800',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground hover:group-[.toast]:bg-primary/90',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground hover:group-[.toast]:bg-muted/80',
        },
      }}
    />
  );
}

