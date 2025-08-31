"use client";

import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminAccessGuard from './AdminAccessGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't apply AdminAccessGuard to login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminAccessGuard>
      {children}
    </AdminAccessGuard>
  );
} 