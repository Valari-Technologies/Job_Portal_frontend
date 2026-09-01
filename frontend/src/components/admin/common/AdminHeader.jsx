import { Search, Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProfilePhotoFromStorage, subscribeProfilePhoto } from '../../../services/admin/profilePhotoSync';

export default function AdminHeader({ onMobileMenuToggle, searchPlaceholder = "Search anything..." }) {
  const [photo, setPhoto] = useState(() => getProfilePhotoFromStorage('current-admin'));

  useEffect(() => {
    return subscribeProfilePhoto(setPhoto);
  }, []);

  return (
    <header className="h-[78px] bg-white border-b border-slate-150 px-6 flex items-center justify-between shrink-0 font-sans">
      {/* Search inputs bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button 
          onClick={onMobileMenuToggle} 
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl focus:outline-none"
        >
          <Menu className="h-5.5 w-5.5" />
        </button>
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full md:w-[370px] rounded-full border border-slate-205 py-2 pl-9.5 pr-4 text-xs font-bold text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right panel profile selections */}
      <div className="flex items-center gap-5">
        <Link to="/admin/notifications" className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-full focus:outline-none flex items-center justify-center">
          <Bell className="h-5 w-5" />
        </Link>
        <Link to="/admin/profile" className="flex items-center gap-2.5 select-none text-left cursor-pointer hover:opacity-85 transition-opacity">
          {photo ? (
            <img src={photo} alt="Avatar" className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0" />
          ) : (
            <div className="h-9 w-9 rounded-full bg-indigo-50 border border-slate-200 flex items-center justify-center font-bold text-[#4A1DDF] text-sm shrink-0">
              AS
            </div>
          )}
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-extrabold text-slate-850 leading-none">Admin</span>
            <span className="text-[10px] font-bold text-slate-400 mt-1">Admin</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
