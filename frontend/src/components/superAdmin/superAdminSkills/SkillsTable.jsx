import { Edit2, Power, Trash2, Wrench } from 'lucide-react';

export default function SkillsTable({ 
  skills = [], 
  selectedSkill, 
  onSelectSkill,
  onEditSkill,
  onToggleStatus,
  onDeleteSkill,
  loading = false,
  error = null,
  onRetry = null,
  isFiltered = false
}) {
  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-150 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-600 border-t-transparent mb-3"></div>
        <p className="text-sm font-bold text-slate-500">Loading skills catalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-2xl border border-rose-150 p-8 text-center space-y-4">
        <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-rose-50 text-rose-500">
          <Wrench className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-800">Failed to load skills</h3>
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
              <th className="px-6 py-4">Skill</th>
              <th className="px-6 py-4">Job Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <Wrench className="h-6 w-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-800">
                        {isFiltered ? 'No matching skills found' : 'No skills configured yet'}
                      </h3>
                      <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
                        {isFiltered 
                          ? 'Try adjusting your search query, status filter, or category filter.'
                          : 'Skills will appear here after you add skills connected to job categories.'}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              skills.map((s) => (
                <tr 
                  key={s.id} 
                  onClick={() => onSelectSkill && onSelectSkill(s)}
                  className={`cursor-pointer transition-colors border-b border-slate-100/80 hover:bg-slate-50/60 ${selectedSkill?.id === s.id ? 'bg-teal-50/30' : ''}`}
                >
                  <td className="px-6 py-4 font-extrabold text-slate-850 text-sm">{s.name}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600">
                    {s.category_name ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 font-bold">
                        {s.category_name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-amber-700 font-semibold border border-amber-100">
                        Uncategorized
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                      s.is_active 
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onEditSkill && onEditSkill(s)}
                        title="Edit skill"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onToggleStatus && onToggleStatus(s)}
                        title={s.is_active ? "Deactivate skill" : "Activate skill"}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          s.is_active 
                            ? 'text-emerald-600 hover:text-amber-600 hover:bg-amber-50' 
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSkill && onDeleteSkill(s)}
                        title="Delete skill"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

