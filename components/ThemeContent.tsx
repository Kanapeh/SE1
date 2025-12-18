'use client';

import { useState, useEffect } from 'react';
import ToasterWrapper from './ToasterWrapper';
import CacheCleaner from './CacheCleaner';

export default function ThemeContent({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <CacheCleaner />
      <ToasterWrapper />
    </>
  );
}

