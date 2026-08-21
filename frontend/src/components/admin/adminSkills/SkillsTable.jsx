export default function SkillsTable({ 
  skills = [], 
  selectedSkill, 
  onSelectSkill 
}) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Skill</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Used by candidates</th>
              <th className="px-6 py-4">Required by jobs</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Updated</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-800">No skills configured yet</h3>
                      <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
                        Skills will appear here after the Admin configures the skills catalogue and connects it to job categories.
                      </p>
                      <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">
                        Skills are used in candidate profiles, job requirements and job recommendations.
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
                  className={`cursor-pointer hover:bg-slate-50/50 ${selectedSkill?.id === s.id ? 'bg-teal-50/20' : ''}`}
                >
                  <td className="px-6 py-4 font-bold text-slate-850">{s.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{s.category_id || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-sm font-extrabold text-slate-800">0</td>
                  <td className="px-6 py-4 text-sm font-extrabold text-slate-800">0</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold border border-slate-200 bg-slate-50 text-slate-600">
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">N/A</td>
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
