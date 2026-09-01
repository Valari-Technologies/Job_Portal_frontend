export default function EmployerTable() {
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
              <th className="px-6 py-4 text-center">Active jobs</th>
              <th className="px-6 py-4">Compliance</th>
              <th className="px-6 py-4">Last activity</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="8" className="px-6 py-16 text-center">
                <div className="flex flex-col items-center justify-center space-y-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10" />
                    </svg>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-slate-800">No employers yet</h3>
                    <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
                      Employer records will appear here after employers register, complete verification and begin using the platform.
                    </p>
                    <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">
                      Connect the Django Admin Employers API after the Employer Registration module is ready.
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
