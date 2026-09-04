import { useEffect, useRef } from 'react';
import { useCandidateUser } from '../../../context/CandidateUserContext';
import { useSignOut } from '../../../context/SignOutContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';

export default function CandidateProfileMenu({ isOpen, onClose }) {
  const { profile } = useCandidateUser();
  const { requestSignOut } = useSignOut();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div 
      ref={menuRef}
      className="absolute right-0 top-12 z-50 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 font-sans select-none animate-fadeIn"
    >
      {/* Profile Header */}
      <div className="p-3 border-b border-slate-150 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-black text-[#3B00FF]">{getInitials(profile?.fullName)}</span>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-xs font-black text-slate-900 truncate">{profile?.fullName || 'Candidate'}</h4>
          <span className="text-[11px] font-semibold text-slate-500 truncate">{profile?.email}</span>
        </div>
      </div>

      {/* Menu Actions */}
      <div className="py-1.5 space-y-0.5">
        <Link
          to="/candidate/profile"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <User className="h-4 w-4 text-slate-500" />
          <span>My Profile</span>
        </Link>

        <Link
          to="/candidate/settings"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Settings className="h-4 w-4 text-slate-500" />
          <span>Settings</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            onClose();
            requestSignOut(() => navigate('/login'));
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-extrabold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
        >
          <LogOut className="h-4 w-4 text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
