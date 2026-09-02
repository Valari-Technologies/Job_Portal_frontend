import { Briefcase } from 'lucide-react';

export default function CandidateExperienceCard({ experiences = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Briefcase className="h-4 w-4 text-indigo-600" />
        <h3 className="text-base font-black text-slate-900">Experience</h3>
      </div>

      {experiences.length > 0 ? (
        <div className="space-y-4 divide-y divide-slate-100">
          {experiences.map((exp, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-4 space-y-1' : 'space-y-1'}>
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-black text-slate-900">{exp.title}</h4>
                <span className="text-xs font-semibold text-slate-400">{exp.dates}</span>
              </div>
              <p className="text-xs font-bold text-slate-600">{exp.company}</p>
              {exp.description && (
                <p className="text-xs font-medium text-slate-500 mt-1.5 leading-relaxed">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs font-medium text-slate-450 italic py-2">No experience details available.</p>
      )}
    </div>
  );
}
