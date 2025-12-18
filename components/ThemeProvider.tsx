'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import ToasterWrapper from './ToasterWrapper';
import CacheCleaner from './CacheCleaner';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider {...props}>
      {children}
      {mounted && (
        <>
          <CacheCleaner />
          <ToasterWrapper />
        </>
      )}
    </NextThemesProvider>
  );
}