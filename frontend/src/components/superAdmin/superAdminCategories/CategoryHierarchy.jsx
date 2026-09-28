import { Edit2, Power, Trash2, ChevronRight, FolderTree } from 'lucide-react';

export default function CategoryHierarchy({ 
  categories = [], 
  selectedCategory, 
  onSelectCategory,
  onEditCategory,
  onToggleStatus,
  onDeleteCategory,
  loading = false,
  error = null,
  onRetry = null,
  isFiltered = false
}) {
  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-150 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-600 border-t-transparent mb-3"></div>
        <p className="text-sm font-bold text-slate-500">Loading job categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-2xl border border-rose-150 p-8 text-center space-y-4">
        <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-rose-50 text-rose-500">
          <FolderTree className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-800">Failed to load categories</h3>
          <p className="text-sm font-bold text-slate-500">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Hierarchy</th>
              <th className="px-6 py-4">Sort order</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <FolderTree className="h-6 w-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-800">
                        {isFiltered ? 'No matching categories found' : 'No job categories yet'}
                      </h3>
                      <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
                        {isFiltered
                          ? 'Try adjusting your search query or status filter.'
                          : 'Create your first top-level or sub-category to organize job taxonomy.'}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((c) => {
                const isChild = !!c.parent_name || !!c.parent;
                return (
                  <tr 
                    key={c.id} 
                    onClick={() => onSelectCategory && onSelectCategory(c)}
                    className={`cursor-pointer transition-colors border-b border-slate-100/80 hover:bg-slate-50/60 ${selectedCategory?.id === c.id ? 'bg-teal-50/30' : ''}`}
                  >
                    {/* Category Name with indent icon if child */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isChild && <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-3" />}
                        <span className={`font-bold ${isChild ? 'text-slate-700 text-sm' : 'text-slate-850 text-sm font-extrabold'}`}>
                          {c.name}
                        </span>
                      </div>
                    </td>

                    {/* Hierarchy / Parent */}
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      {c.parent_name ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600 font-semibold">
                          <span>{c.parent_name}</span>
                          <span className="text-slate-400">→</span>
                          <span className="text-slate-800">{c.name}</span>
                        </span>
                      ) : (
                        <span className="rounded-lg bg-teal-50 px-2.5 py-1 text-teal-700 font-extrabold border border-teal-100">
                          Top Level
                        </span>
                      )}
                    </td>

                    {/* Sort Order */}
                    <td className="px-6 py-4 text-sm font-extrabold text-slate-700">
                      {c.sort_order !== undefined ? c.sort_order : 0}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        c.is_active 
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
                          : 'border-slate-200 bg-slate-100 text-slate-600'
                      }`}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onEditCategory && onEditCategory(c)}
                          title="Edit category"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onToggleStatus && onToggleStatus(c)}
                          title={c.is_active ? "Deactivate category" : "Activate category"}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            c.is_active 
                              ? 'text-emerald-600 hover:text-amber-600 hover:bg-amber-50' 
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteCategory && onDeleteCategory(c)}
                          title="Delete category"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

