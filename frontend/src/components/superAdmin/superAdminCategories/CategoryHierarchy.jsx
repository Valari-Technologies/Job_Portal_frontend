export default function CategoryHierarchy({ 
  categories = [], 
  selectedCategory, 
  onSelectCategory 
}) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Linked jobs</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-800">No job categories yet</h3>
                      <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
                        Category groups and subcategories will appear here after the Admin configures the job taxonomy.
                      </p>
                      <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">
                        Categories support parent and child relationships for job discovery and matching.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr 
                  key={c.id} 
                  onClick={() => onSelectCategory && onSelectCategory(c)}
                  className={`cursor-pointer hover:bg-slate-50/50 ${selectedCategory?.id === c.id ? 'bg-teal-50/20' : ''}`}
                >
                  <td className="px-6 py-4 font-bold text-slate-850">{c.name}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold border border-slate-200 bg-slate-50 text-slate-600">
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-extrabold text-slate-800">0</td>
                  <td className="px-6 py-4 text-right">...</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
