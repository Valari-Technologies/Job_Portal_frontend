export default function SkillDetailsPanel({ selectedSkill, onEditSkill, onToggleStatus }) {
  return (
    <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs">
      <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 mb-6">Skill details</h3>

      {selectedSkill ? (
        <div className="space-y-5 text-sm">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-600 shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-800 leading-snug">{selectedSkill.name}</h4>
              <span className={`text-xs font-bold uppercase ${selectedSkill.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                {selectedSkill.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4.5">
            <div className="space-y-1">
              <span className="text-xs font-black text-slate-450 uppercase block">Job category</span>
              <span className="font-bold text-slate-800">{selectedSkill.category_name || 'Uncategorized'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black text-slate-450 uppercase block">Status</span>
              <span className="font-bold text-slate-800">{selectedSkill.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button 
              onClick={() => onEditSkill && onEditSkill(selectedSkill)}
              className="flex-1 rounded-xl bg-teal-600 hover:bg-teal-700 py-2.5 text-xs font-extrabold text-white transition-colors cursor-pointer shadow-xs"
            >
              Edit skill
            </button>
            <button 
              onClick={() => onToggleStatus && onToggleStatus(selectedSkill)}
              className={`flex-1 rounded-xl border py-2.5 text-xs font-extrabold transition-colors cursor-pointer ${
                selectedSkill.is_active 
                  ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' 
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {selectedSkill.is_active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center space-y-4">
          <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-base font-extrabold text-slate-800">No skill selected</h4>
            <p className="text-sm font-bold text-slate-500 max-w-xs mx-auto leading-normal">
              Select a skill from the list to view its category, status, and actions.
            </p>
          </div>
          <button 
            disabled 
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed mt-4"
          >
            Edit skill
          </button>
        </div>
      )}
    </div>
  );
}

