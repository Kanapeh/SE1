import AdminSidebar from './AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:mr-64 p-6">
        {children}
      </main>
    </div>
  );
} 