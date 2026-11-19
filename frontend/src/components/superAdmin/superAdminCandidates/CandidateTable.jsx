import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';

function CandidateActionMenu({ candidate, onSelectCandidate, onTriggerAction }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Actions menu"
      >
        <MoreVertical className="h-4.5 w-4.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-slate-150 bg-white p-1.5 shadow-lg z-30 space-y-0.5 animate-fadeIn text-left">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              if (onSelectCandidate) onSelectCandidate(candidate);
              if (onTriggerAction) onTriggerAction('VIEW', candidate);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-teal-600 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            <span>View profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              if (onTriggerAction) onTriggerAction('DELETE', candidate);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function CandidateTable({ 
  candidates = [], 
  selectedCandidate, 
  onSelectCandidate, 
  onTriggerAction 
}) {
  const getStatusBadgeClass = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'ACTIVE') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'INACTIVE') return 'bg-slate-100 text-slate-600 border-slate-200';
    if (s === 'SUSPENDED') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const formatLocation = (c) => {
    if (!c) return 'Tamil Nadu';
    if (typeof c.location === 'string' && c.location) return c.location;
    if (c.location?.name) return c.location.name;
    if (c.location?.city && c.location?.state) return `${c.location.city}, ${c.location.state}`;
    if (c.location?.state) return c.location.state;
    if (c.city && c.state) return `${c.city}, ${c.state}`;
    if (c.state) return c.state;
    if (c.city) return c.city;
    return 'Tamil Nadu';
  };

  if (!candidates || candidates.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Profile completion</th>
                <th className="px-6 py-4">Applications</th>
                <th className="px-6 py-4">Account status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-800">No candidates found</h3>
                      <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
                        No candidate records match your selected criteria or search.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs font-sans">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-4 sm:px-5 py-3.5">Candidate</th>
              <th className="px-3 sm:px-4 py-3.5">Location</th>
              <th className="px-3 sm:px-4 py-3.5">Profile completion</th>
              <th className="px-3 sm:px-4 py-3.5">Applications</th>
              <th className="px-3 sm:px-4 py-3.5">Account status</th>
              <th className="px-4 sm:px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-800">
            {candidates.map((c) => {
              const isSelected = selectedCandidate && String(selectedCandidate.id) === String(c.id);
              const displayName = c.full_name || c.name || c.username || 'Candidate';
              const initial = displayName.charAt(0).toUpperCase();
              const photo = c.profile_photo || c.profile_picture;
              const locationStr = formatLocation(c);
              const completion = Number(c.profile_completion ?? 0);
              const appCount = c.applications ?? c.applications_count ?? 0;
              const statusStr = (c.status || 'ACTIVE').toUpperCase();

              return (
                <tr 
                  key={c.id} 
                  onClick={() => onSelectCandidate && onSelectCandidate(c)}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    isSelected ? 'bg-teal-50/30' : ''
                  }`}
                >
                  {/* Candidate Identity */}
                  <td className="px-4 sm:px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {photo ? (
                        <img 
                          src={photo} 
                          alt={displayName} 
                          className="h-9 w-9 rounded-full object-cover border border-black bg-white shrink-0" 
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-white border border-black flex items-center justify-center text-slate-900 font-extrabold text-sm shrink-0">
                          {initial}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 leading-snug truncate text-xs sm:text-sm">{displayName}</p>
                        <p className="text-[11px] text-slate-500 font-medium truncate">{c.email || c.phone_number || c.mobile_number || 'No email'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-3 sm:px-4 py-3.5 text-xs font-semibold text-slate-600 max-w-[140px] truncate">
                    {locationStr}
                  </td>

                  {/* Profile Completion */}
                  <td className="px-3 sm:px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden shrink-0">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            completion >= 80 ? 'bg-emerald-500' : completion >= 50 ? 'bg-teal-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.max(completion, 8)}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-slate-700">{completion}%</span>
                    </div>
                  </td>

                  {/* Applications Count */}
                  <td className="px-3 sm:px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 text-[10px] font-black">
                      {appCount} Applied
                    </span>
                  </td>

                  {/* Account Status */}
                  <td className="px-3 sm:px-4 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase border ${getStatusBadgeClass(statusStr)}`}>
                      {statusStr}
                    </span>
                  </td>

                  {/* Actions 3-dot Menu */}
                  <td className="px-4 py-2.5 text-right whitespace-nowrap w-16">
                    <CandidateActionMenu
                      candidate={c}
                      onSelectCandidate={onSelectCandidate}
                      onTriggerAction={onTriggerAction}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
