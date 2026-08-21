export default function EmployerVerificationQueue({ requests = [] }) {
  return (
    <div className="w-full">
      {requests.length === 0 ? (
        <div className="rounded-2xl border border-slate-150 bg-white p-12 text-center shadow-2xs max-w-3xl mx-auto my-8">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-800">No verification requests yet</h3>
            <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
              Employer verification requests will appear here after employers register and submit their company information.
            </p>
            <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto pt-2">
              Document requirements and verification rules will be configured before backend integration.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((r) => (
            <div key={r.id} className="p-4 bg-white border border-slate-150 rounded-xl hover:shadow-md cursor-pointer transition-shadow">
              <h4 className="text-base font-bold text-slate-800">{r.company_name}</h4>
              <p className="text-xs text-slate-400 mt-1">Submitted: {r.submitted_at}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
