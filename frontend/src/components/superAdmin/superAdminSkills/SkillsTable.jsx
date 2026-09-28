import { useState, useEffect, useRef } from 'react';
import { Edit2, Power, Trash2, Wrench, MoreVertical } from 'lucide-react';

function ActionMenu({ item, onEdit, onToggleStatus, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Actions menu"
      >
        <MoreVertical className="h-4.5 w-4.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-slate-150 bg-white p-1.5 shadow-lg z-30 space-y-0.5 animate-fadeIn text-left">
          <button
            type="button"
            onClick={() => { setOpen(false); onEdit && onEdit(item); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-teal-600 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => { setOpen(false); onToggleStatus && onToggleStatus(item); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Power className={`h-3.5 w-3.5 ${item.is_active ? 'text-amber-500' : 'text-emerald-500'}`} />
            <span>{item.is_active ? 'Deactivate' : 'Activate'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setOpen(false); onDelete && onDelete(item); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

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
    <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-visible shadow-2xs">
      <div className="w-full">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-5 py-4 w-[40%]">Skill</th>
              <th className="px-4 py-4 w-[28%]">Job Category</th>
              <th className="px-4 py-4 w-[16%] text-center">Status</th>
              <th className="px-5 py-4 w-[16%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
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
                  className={`cursor-pointer transition-colors hover:bg-slate-50/60 ${selectedSkill?.id === s.id ? 'bg-teal-50/30' : ''}`}
                >
                  <td className="px-5 py-4 font-extrabold text-slate-850 text-sm truncate">{s.name}</td>
                  <td className="px-4 py-4 text-xs font-bold text-slate-600">
                    {s.category_name ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 font-bold max-w-full truncate">
                        <span className="truncate">{s.category_name}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-amber-700 font-semibold border border-amber-100">
                        Uncategorized
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                      s.is_active 
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ActionMenu 
                      item={s}
                      onEdit={onEditSkill}
                      onToggleStatus={onToggleStatus}
                      onDelete={onDeleteSkill}
                    />
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



