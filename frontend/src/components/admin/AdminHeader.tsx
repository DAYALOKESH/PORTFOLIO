import { useAuthStore } from '@/lib/stores/auth-store';
import { usePathname } from 'next/navigation';

export default function AdminHeader() {
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();

  // Simple breadcrumb logic
  const pathSegments = pathname.split('/').filter(Boolean).slice(1); // remove 'admin'
  const title = pathSegments.length > 0 
    ? pathSegments.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ') 
    : 'Dashboard';

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-200">{user?.full_name || user?.email}</p>
          <p className="text-xs text-slate-400">{user?.is_superuser ? 'Super Admin' : 'Admin'}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
          {(user?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
        </div>
      </div>
    </header>
  );
}
