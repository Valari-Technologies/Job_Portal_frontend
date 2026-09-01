export default function LocationDetailsPanel({ selectedLocation }) {
  return (
    <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs">
      <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 mb-6">Location details</h3>

      {selectedLocation ? (
        <div className="space-y-5 text-sm">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-600 shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-800 leading-snug">{selectedLocation.name}</h4>
              <span className="text-xs font-bold text-slate-450 uppercase">{selectedLocation.location_type}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4.5">
            <div className="space-y-1">
              <span className="text-xs font-black text-slate-450 uppercase block">Parent ID</span>
              <span className="font-bold text-slate-805">{selectedLocation.parent_id || 'None'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black text-slate-450 uppercase block">Jobs / Candidates</span>
              <span className="font-bold text-slate-805">0 active</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center space-y-4">
          <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-base font-extrabold text-slate-800">No location selected</h4>
            <p className="text-sm font-bold text-slate-500 max-w-xs mx-auto leading-normal">
              Select a location from the hierarchy to view its parent path, status and future job/candidate activity.
            </p>
          </div>
          <button 
            disabled 
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed mt-4"
          >
            Edit location
          </button>
        </div>
      )}
    </div>
  );
}
