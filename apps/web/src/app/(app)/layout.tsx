import { AuthProvider } from '@/providers/AuthProvider';
import { Sidebar } from '@/components/layout/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <main className="scrollbar-thin flex-1 overflow-y-auto">{children}</main>
      </div>
    </AuthProvider>
  );
}
