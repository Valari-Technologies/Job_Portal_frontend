import { GraduationCap } from 'lucide-react';

export default function CandidateEducationCard({ educations = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <GraduationCap className="h-4 w-4 text-indigo-600" />
        <h3 className="text-base font-black text-slate-900">Education</h3>
      </div>

      {educations.length > 0 ? (
        <div className="space-y-3 divide-y divide-slate-100">
          {educations.map((edu, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-3 space-y-1' : 'space-y-1'}>
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-black text-slate-900">{edu.degree}</h4>
                <span className="text-xs font-semibold text-slate-400">{edu.dates}</span>
              </div>
              <p className="text-xs font-bold text-slate-600">{edu.institution}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs font-medium text-slate-450 italic py-2">No education details available.</p>
      )}
    </div>
  );
}
