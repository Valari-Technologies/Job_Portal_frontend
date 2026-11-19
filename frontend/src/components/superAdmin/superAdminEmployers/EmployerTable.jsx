import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Eye } from 'lucide-react';

function EmployerActionMenu({ employer, onSelectEmployer }) {
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
              if (onSelectEmployer) onSelectEmployer(employer);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-teal-600 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            <span>View details</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function EmployerTable({ employers = [], onSelectEmployer, selectedEmployer }) {
  if (!employers || employers.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Employer</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4">Trust level</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10" />
                      </svg>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-800">No employers found</h3>
                      <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
                        No employer records match your selected criteria or search.
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
              <th className="px-4 sm:px-5 py-3">Employer</th>
              <th className="px-3 sm:px-4 py-3">Location</th>
              <th className="px-3 sm:px-4 py-3">Verification</th>
              <th className="px-3 sm:px-4 py-3">Trust level</th>
              <th className="px-3 sm:px-4 py-3">Designation</th>
              <th className="px-4 sm:px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-800">
            {employers.map((emp) => {
              const isSelected = selectedEmployer && String(selectedEmployer.id) === String(emp.id);
              const locationState = emp.location?.state || 
                                    (emp.location?.full_path ? emp.location.full_path.split('->')[0].trim() : null) || 
                                    (emp.company_address ? emp.company_address.split('->')[0].trim() : null) || 
                                    emp.location?.name || 
                                    'All Locations';
              const companyInitial = emp.company_name ? emp.company_name.charAt(0).toUpperCase() : (emp.full_name ? emp.full_name.charAt(0).toUpperCase() : 'E');
              
              return (
                <tr 
                  key={emp.id} 
                  onClick={() => onSelectEmployer && onSelectEmployer(emp)}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    isSelected ? 'bg-teal-50/30' : ''
                  }`}
                >
                  <td className="px-4 sm:px-5 py-2.5 sm:py-3">
                    <div className="flex items-center gap-3">
                      {emp.company_logo || emp.profile_photo ? (
                        <img 
                          src={emp.company_logo || emp.profile_photo} 
                          alt={emp.company_name || 'Logo'} 
                          className="h-9 w-9 rounded-full object-cover border border-black bg-white shrink-0" 
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-white border border-black flex items-center justify-center text-slate-900 font-extrabold text-sm shrink-0">
                          {companyInitial}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 leading-snug truncate text-xs sm:text-sm">{emp.company_name || emp.full_name}</p>
                        <p className="text-[11px] text-slate-500 font-medium truncate">{emp.company_email || emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold text-slate-600 max-w-[160px] truncate">
                    {locationState}
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                      emp.verification_status === 'APPROVED' 
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                        : emp.verification_status === 'REJECTED' 
                        ? 'bg-rose-50 border border-rose-200 text-rose-700' 
                        : 'bg-amber-50 border border-amber-200 text-amber-700'
                    }`}>
                      {emp.verification_status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                    <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-600 text-[9px] font-extrabold uppercase">
                      {emp.trust_level || 'NEW'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-medium text-slate-600">
                    {emp.designation || 'HR Manager'}
                  </td>
                  <td className="px-4 py-2.5 sm:py-3 text-right whitespace-nowrap w-16">
                    <EmployerActionMenu 
                      employer={emp}
                      onSelectEmployer={onSelectEmployer}
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
