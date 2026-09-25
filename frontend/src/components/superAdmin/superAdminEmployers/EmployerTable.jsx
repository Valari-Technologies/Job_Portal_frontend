export default function EmployerTable({ employers = [], onSelectEmployer }) {
  if (!employers || employers.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs">
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
    <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs">
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
          <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-800">
            {employers.map((emp) => {
              const locationPath = emp.location?.full_path || emp.company_address || 'Tamil Nadu';
              return (
                <tr 
                  key={emp.id} 
                  onClick={() => onSelectEmployer && onSelectEmployer(emp)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-extrabold text-base shrink-0">
                        {emp.company_name ? emp.company_name.charAt(0).toUpperCase() : (emp.full_name ? emp.full_name.charAt(0).toUpperCase() : 'E')}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 leading-snug">{emp.company_name || emp.full_name}</p>
                        <p className="text-xs text-slate-500 font-medium">{emp.company_email || emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-600 max-w-[200px] truncate">
                    {locationPath}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-amber-700 text-[10px] font-extrabold uppercase">
                      {emp.verification_status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-slate-600 text-[10px] font-extrabold uppercase">
                      {emp.trust_level || 'NEW'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                    {emp.designation || 'HR Manager'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-extrabold text-teal-600 hover:text-teal-800">
                      View
                    </span>
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
