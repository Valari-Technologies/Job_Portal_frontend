import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Building2, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useRecruiterUser } from '../../../context/RecruiterUserContext';
import { useSignOut } from '../../../context/SignOutContext';

export default function RecruiterAccountMenu({ onClose, isMobile = false }) {
  const { profile } = useRecruiterUser();
  const { requestSignOut } = useSignOut();
  const menuRef = useRef(null);

  const { fullName, email, role } = profile.identity || {};
  const { profilePhotoUrl } = profile.recruiterProfile || {};
  const { name: companyName } = profile.companySummary || {};

  // Close menu on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
    onClose?.();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    onClose?.();
    requestSignOut('recruiter');
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Recruiter account menu"
      className={`bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden font-sans z-50 animate-fadeIn ${
        isMobile
          ? 'fixed inset-x-3 top-16 shadow-slate-900/20'
          : 'absolute right-0 top-12 w-72'
      }`}
    >
      {/* Account Info Header */}
      <Link
        to="/recruiter/profile"
        onClick={handleLinkClick}
        className="p-4 bg-slate-50/80 border-b border-slate-150 flex items-center gap-3 hover:bg-indigo-50/50 transition-colors block cursor-pointer group"
      >
        <div className="h-10 w-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center border border-indigo-200 shadow-xs shrink-0 overflow-hidden">
          {profilePhotoUrl ? (
            <img src={profilePhotoUrl} alt={fullName || "Recruiter"} className="h-full w-full object-cover" />
          ) : (
            <span>{fullName ? fullName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0, 2) : 'RD'}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 truncate transition-colors">
            {fullName || "Recruiter"}
          </h4>
          <p className="text-xs text-slate-500 font-medium truncate">
            {email || "recruiter@company.com"}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700">
              {role || "RECRUITER"}
            </span>
            {companyName && (
              <span className="text-[10px] font-medium text-slate-400 truncate">
                • {companyName}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Menu Actions List */}
      <div className="p-1.5 space-y-0.5">
        <Link
          to="/recruiter/profile"
          role="menuitem"
          onClick={handleLinkClick}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-indigo-600" />
            <span>My Profile</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </Link>

        <Link
          to="/recruiter/company-profile"
          role="menuitem"
          onClick={handleLinkClick}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Building2 className="h-4 w-4 text-indigo-600" />
            <span>Company Profile</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </Link>

        <Link
          to="/recruiter/settings"
          role="menuitem"
          onClick={handleLinkClick}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="h-4 w-4 text-indigo-600" />
            <span>Settings</span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </Link>
      </div>

      {/* Logout Action Footer */}
      <div className="p-1.5 border-t border-slate-100">
        <button
          type="button"
          role="menuitem"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-red-600" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
