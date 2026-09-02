import { Bell, User } from 'lucide-react';

export default function RecruiterMobileHeader() {
  return (
    <header className="lg:hidden h-14 flex items-center justify-between px-4 bg-white border-b border-slate-150 shrink-0 sticky top-0 z-30">
      {/* Left: Avatar & Brand Title */}
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 overflow-hidden">
          <User className="h-5 w-5" />
        </div>
        <span className="text-base font-black text-indigo-600 tracking-tight">JobPortal</span>
      </div>

      {/* Right: Notification Bell */}
      <button 
        type="button" 
        aria-label="View notifications"
        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
      >
        <Bell className="h-5 w-5" />
      </button>
    </header>
  );
}
