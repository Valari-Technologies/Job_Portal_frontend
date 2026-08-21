export default function CategoryDetailsPanel({ selectedCategory }) {
  return (
    <div className="space-y-6">
      {/* Detail card */}
      <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs">
        <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 mb-6">Category details</h3>
        
        {selectedCategory ? (
          <div className="space-y-5 text-sm">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-600 shrink-0">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-800 leading-snug">{selectedCategory.name}</h4>
                <span className="text-xs font-bold text-slate-450 uppercase">Active</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4.5">
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-450 uppercase block">Parent Category</span>
                <span className="font-bold text-slate-800">{selectedCategory.parent_id || 'None'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-450 uppercase block">Linked Jobs</span>
                <span className="font-bold text-slate-800">0 active</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-extrabold text-slate-800">No category selected</h4>
              <p className="text-sm font-bold text-slate-500 max-w-xs mx-auto leading-normal">
                Select a category from the hierarchy to view its parent, subcategories, linked jobs and visibility details.
              </p>
            </div>
            <button 
              disabled 
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed mt-4"
            >
              Edit category
            </button>
          </div>
        )}
      </div>

      {/* Category health */}
      <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-850 border-b border-slate-100 pb-3">Category health</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-slate-700">Uncategorized jobs</span>
            <span className="font-extrabold text-slate-800">0</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-slate-700">Review needed</span>
            <span className="font-extrabold text-slate-800">0</span>
          </div>
          <p className="text-xs font-bold text-slate-450 leading-normal pt-2">
            Category health insights will appear after jobs and categories are available.
          </p>
        </div>
      </div>
    </div>
  );
}
