import { Bell, Menu, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminMobileHeader({ onToggleMenu }) {
  return (
    <header className="flex lg:hidden items-center justify-between h-14 bg-white border-b border-slate-150 px-4 sticky top-0 z-30 w-full font-sans">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-indigo-650 shrink-0">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-black text-slate-800 tracking-tight">Admin <span className="text-indigo-600">Portal</span></span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/admin/notifications" className="p-2 text-slate-400 hover:text-slate-655 flex items-center justify-center" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Link>
        <button onClick={onToggleMenu} className="p-1.5 text-slate-400 hover:text-slate-605" aria-label="Toggle navigation menu">
          <Menu className="h-5.5 w-5.5" />
        </button>
      </div>
    </header>
  );
}
