export default function CandidateSkillsCard({ skills = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-3 shadow-xs">
      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">TOP SKILLS</h4>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs border border-indigo-100">
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs font-medium text-slate-450 italic">No skills listed.</p>
      )}
    </div>
  );
}
