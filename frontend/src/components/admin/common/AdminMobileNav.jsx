import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, User, Bell } from 'lucide-react';

export default function AdminMobileNav({ activeTab }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-45 font-sans" aria-label="Mobile Navigation">
      <Link to="/admin/dashboard" className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <LayoutDashboard className="h-5 w-5" />
        <span className={`text-[11px] ${activeTab === 'dashboard' ? 'font-extrabold' : 'font-bold'}`}>Dashboard</span>
      </Link>
      <Link to="/admin/recruiters" className={`flex flex-col items-center gap-1 ${activeTab === 'recruiters' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <Users className="h-5 w-5" />
        <span className={`text-[11px] ${activeTab === 'recruiters' ? 'font-extrabold' : 'font-bold'}`}>Recruiters</span>
      </Link>
      <Link to="/admin/notifications" className={`flex flex-col items-center gap-1 ${activeTab === 'notifications' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <Bell className="h-5 w-5" />
        <span className={`text-[11px] ${activeTab === 'notifications' ? 'font-extrabold' : 'font-bold'}`}>Alerts</span>
      </Link>
      <Link to="/admin/profile" className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <User className="h-5 w-5" />
        <span className={`text-[11px] ${activeTab === 'profile' ? 'font-extrabold' : 'font-bold'}`}>Profile</span>
      </Link>
    </nav>
  );
}
