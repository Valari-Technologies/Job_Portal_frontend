import { Search, Bell, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecruiterHeader() {
  return (
    <header className="hidden lg:flex h-16 items-center justify-between px-6 bg-white border-b border-slate-150 shrink-0 sticky top-0 z-30 font-sans">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
        <input 
          type="text"
          placeholder="Search candidates, jobs..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button 
          type="button" 
          aria-label="View notifications"
          className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
        </button>

        {/* Settings Button */}
        <Link 
          to="/recruiter/settings" 
          aria-label="Go to settings"
          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          <Settings className="h-5 w-5" />
        </Link>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center border border-indigo-200 shadow-xs">
            <User className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
