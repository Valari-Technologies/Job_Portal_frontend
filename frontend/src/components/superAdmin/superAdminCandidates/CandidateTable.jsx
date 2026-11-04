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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {photo ? (
                        <img 
                          src={photo} 
                          alt={displayName} 
                          className="h-10 w-10 rounded-full object-cover border border-black bg-white shrink-0" 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-white border border-black flex items-center justify-center text-slate-900 font-extrabold text-base shrink-0">
                          {initial}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 leading-snug truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 font-medium truncate">{c.email || c.phone_number || c.mobile_number || 'No email'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4 text-xs font-semibold text-slate-600 max-w-[180px] truncate">
                    {locationStr}
                  </td>

                  {/* Profile Completion */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden shrink-0">
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
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 text-[11px] font-black">
                      {appCount} {appCount === 1 ? 'Applied' : 'Applied'}
                    </span>
                  </td>

                  {/* Account Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border ${getStatusBadgeClass(statusStr)}`}>
                      {statusStr}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectCandidate) onSelectCandidate(c);
                        if (onTriggerAction) onTriggerAction('VIEW', c);
                      }}
                      className="text-xs font-extrabold text-teal-600 hover:text-teal-800 hover:underline cursor-pointer"
                    >
                      View profile
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTriggerAction) onTriggerAction('DELETE', c);
                      }}
                      className="ml-4 text-xs font-extrabold text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
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
