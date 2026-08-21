export default function JobReviewQueue({ jobs = [] }) {
  return (
    <div className="w-full">
      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-150 bg-white p-12 text-center shadow-2xs max-w-3xl mx-auto my-8">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-800">No jobs pending review</h3>
            <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
              Job submissions will appear here after verified employers create and submit a job post.
            </p>
            <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto pt-2">
              New employer jobs require Admin review before publication.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((j) => (
            <div key={j.id} className="p-4 bg-white border border-slate-155 rounded-xl hover:shadow-md cursor-pointer transition-shadow">
              <h4 className="text-base font-bold text-slate-850">{j.title}</h4>
              <p className="text-xs text-slate-450 mt-1">{j.company}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
