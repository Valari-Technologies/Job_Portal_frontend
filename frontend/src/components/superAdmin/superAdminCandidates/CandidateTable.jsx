import React, { useState } from 'react';

export default function CandidateTable({ 
  candidates, 
  selectedCandidate, 
  onSelectCandidate, 
  onTriggerAction 
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);

  const handleMenuToggle = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleAction = (e, actionType, candidate) => {
    e.stopPropagation();
    setActiveMenuId(null);
    onTriggerAction(actionType, candidate);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Inactive':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'Suspended':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Flagged review':
      case 'Needs review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getProgressColor = (pct) => {
    if (pct >= 80) return 'text-teal-600';
    if (pct >= 60) return 'text-blue-500';
    return 'text-amber-500';
  };

  // Close actions menu when clicking outside
  React.useEffect(() => {
    const closeMenu = () => setActiveMenuId(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Candidate</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-center">Profile completion</th>
              <th className="px-6 py-4 text-center">Applications</th>
              <th className="px-6 py-4">Account status</th>
              <th className="px-6 py-4">Last active</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.length > 0 ? (
              candidates.map((c) => {
                const isSelected = selectedCandidate && selectedCandidate.id === c.id;
                const initials = c.full_name ? c.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'CN';
                
                return (
                  <tr 
                    key={c.id} 
                    onClick={() => onSelectCandidate(c)}
                    className={`group cursor-pointer transition-colors duration-150 hover:bg-slate-50/50 ${
                      isSelected ? 'bg-teal-50/20 border-l-4 border-teal-600' : ''
                    }`}
                  >
                    {/* Candidate Identity Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                          {c.profile_photo ? (
                            <img src={c.profile_photo} alt={c.full_name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm font-extrabold text-slate-650">{initials}</span>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-base font-bold text-slate-800 group-hover:text-teal-650 transition-colors leading-tight">
                            {c.full_name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <span>{c.candidate_id}</span>
                            <span>•</span>
                            <span>{c.mobile_number}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location Column */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5 text-sm text-slate-700 font-semibold">
                        <p className="font-bold text-slate-800">{c.location?.state || 'Tamil Nadu'}</p>
                        <p className="text-xs text-slate-450">{c.location?.district} / {c.location?.city}</p>
                      </div>
                    </td>

                    {/* Profile Completion Column */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center relative">
                        <svg className="w-10 h-10 transform -rotate-90">
                          <circle cx="20" cy="20" r="16" stroke="#f1f5f9" strokeWidth="3" fill="transparent" />
                          <circle 
                            cx="20" 
                            cy="20" 
                            r="16" 
                            stroke="currentColor" 
                            strokeWidth="3" 
                            fill="transparent" 
                            strokeDasharray={2 * Math.PI * 16}
                            strokeDashoffset={2 * Math.PI * 16 * (1 - c.profile_completion / 100)}
                            className={getProgressColor(c.profile_completion)}
                          />
                        </svg>
                        <span className="absolute text-[10px] font-black text-slate-700">{c.profile_completion}%</span>
                      </div>
                    </td>

                    {/* Applications Column */}
                    <td className="px-6 py-4 text-center text-sm font-extrabold text-slate-800">
                      {c.applications}
                    </td>

                    {/* Account Status Column */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${getStatusBadgeClass(c.status)}`}>
                        {c.status}
                      </span>
                    </td>

                    {/* Last Active Column */}
                    <td className="px-6 py-4 text-sm font-bold text-slate-550">
                      {c.last_active}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={(e) => handleMenuToggle(e, c.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none"
                        aria-label="Toggle candidate actions"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {activeMenuId === c.id && (
                        <div className="absolute right-6 z-10 mt-1 w-44 rounded-xl border border-slate-100 bg-white p-1 shadow-xl text-left">
                          <button
                            onClick={(e) => handleAction(e, 'VIEW', c)}
                            className="flex w-full items-center px-3 py-2 text-left text-xs font-bold text-slate-650 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            View profile
                          </button>
                          <button
                            onClick={(e) => handleAction(e, 'MESSAGE', c)}
                            className="flex w-full items-center px-3 py-2 text-left text-xs font-bold text-slate-650 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            Send message
                          </button>
                          <button
                            onClick={(e) => handleAction(e, 'REVIEW', c)}
                            className="flex w-full items-center px-3 py-2 text-left text-xs font-bold text-amber-650 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            Mark for review
                          </button>
                          <button
                            onClick={(e) => handleAction(e, c.status === 'Suspended' ? 'ACTIVATE' : 'SUSPEND', c)}
                            className={`flex w-full items-center px-3 py-2 text-left text-xs font-bold rounded-lg transition-colors ${
                              c.status === 'Suspended' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-red-650 hover:bg-red-50'
                            }`}
                          >
                            {c.status === 'Suspended' ? 'Activate account' : 'Suspend account'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg className="h-10 w-10 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-base font-bold text-slate-800">No candidates yet</h3>
                    <p className="text-sm font-bold text-slate-500 max-w-sm">
                      Candidate records will appear here after candidates register and complete their profile.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
