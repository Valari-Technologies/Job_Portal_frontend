import { Bell, ChevronDown } from 'lucide-react';
import logoJobz from '../../../assets/logo-jobz.png';

export default function EmployerMobileHeader({ onToggleMenu }) {
  const companyName = 'New Employer';
  return (
    <header className="flex lg:hidden items-center justify-between h-14 bg-white border-b border-slate-150 px-4 sticky top-0 z-30 w-full">
      <div className="flex items-center gap-2">
        <img src={logoJobz} alt="TN Jobz Logo" className="h-7 w-auto object-contain" />
        <span className="text-base font-black text-slate-800 tracking-tight">State <span className="text-teal-600">Jobz</span></span>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-400 hover:text-slate-605" aria-label="Notifications">
          <Bell className="h-5.5 w-5.5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-extrabold text-slate-500 text-xs">
          {companyName.slice(0, 2).toUpperCase()}
        </div>
        <button onClick={onToggleMenu} className="p-1.5 text-slate-400 hover:text-slate-605" aria-label="Toggle navigation menu">
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
