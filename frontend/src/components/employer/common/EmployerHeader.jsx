import { 
  Bell, 
  Search, 
  ChevronDown 
} from 'lucide-react';

export default function EmployerHeader({ breadcrumbTitle }) {
  const companyName = 'New Employer';
  return (
    <header className="hidden lg:flex items-center justify-between h-16 bg-white border-b border-slate-150 px-8 sticky top-0 z-30 w-full">
      <nav className="text-sm font-bold text-slate-400" aria-label="Breadcrumb">
        <span>Employer portal</span> <span className="mx-1">/</span> <span className="text-slate-800 font-extrabold">{breadcrumbTitle}</span>
      </nav>
      
      <div className="flex items-center gap-6">
        {/* Search mock bar */}
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search candidates, applications, jobs..."
            className="w-full bg-slate-50 rounded-xl py-2 pl-9 pr-4 text-sm font-bold text-slate-855 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
            disabled
          />
        </div>
        
        {/* Action icons */}
        <button className="relative p-2 text-slate-400 hover:text-slate-605 transition-colors" aria-label="Notifications">
          <Bell className="h-5.5 w-5.5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </button>
        
        {/* Profile account widget */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-extrabold text-slate-500">
            {companyName.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-bold text-slate-700">{companyName}</span>
          <ChevronDown className="h-4.5 w-4.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
