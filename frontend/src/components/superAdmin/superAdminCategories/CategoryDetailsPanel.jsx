export default function CategoryDetailsPanel({ selectedCategory, onEditCategory, onToggleStatus }) {
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
                <span className={`text-xs font-bold uppercase ${selectedCategory.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {selectedCategory.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 border-t border-slate-100 pt-4.5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-450 uppercase block">Parent category</span>
                  <span className="font-bold text-slate-800">{selectedCategory.parent_name || 'None (Top Level)'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-450 uppercase block">Sort order</span>
                  <span className="font-bold text-slate-800">{selectedCategory.sort_order !== undefined ? selectedCategory.sort_order : 0}</span>
                </div>
              </div>

              {selectedCategory.description && (
                <div className="space-y-1 pt-2">
                  <span className="text-xs font-black text-slate-450 uppercase block">Description</span>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedCategory.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button 
                onClick={() => onEditCategory && onEditCategory(selectedCategory)}
                className="flex-1 rounded-xl bg-teal-600 hover:bg-teal-700 py-2.5 text-xs font-extrabold text-white transition-colors cursor-pointer shadow-xs"
              >
                Edit category
              </button>
              <button 
                onClick={() => onToggleStatus && onToggleStatus(selectedCategory)}
                className={`flex-1 rounded-xl border py-2.5 text-xs font-extrabold transition-colors cursor-pointer ${
                  selectedCategory.is_active 
                    ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' 
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {selectedCategory.is_active ? 'Deactivate' : 'Activate'}
              </button>
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
                Select a category from the list to view its details, description, hierarchy and actions.
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
        <h3 className="text-base font-extrabold text-slate-855 border-b border-slate-100 pb-3">Category taxonomy principles</h3>
        <ul className="text-xs font-semibold text-slate-500 space-y-2.5">
          <li className="flex items-start gap-2">
            <span className="text-teal-600 font-bold">•</span>
            <span>Categories structure job discovery, filters, and employer job posting.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 font-bold">•</span>
            <span>Sub-categories belong to top-level parent categories without circular references.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-600 font-bold">•</span>
            <span>Categories with referenced jobs or active sub-categories cannot be hard-deleted.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

