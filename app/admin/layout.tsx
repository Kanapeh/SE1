import AdminSidebar from './AdminSidebar';
import { checkAdminAccess } from '@/lib/auth-utils';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check admin access - this will redirect if user is not admin
  await checkAdminAccess();

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:mr-64 p-6">
        {children}
      </main>
    </div>
  );
} 