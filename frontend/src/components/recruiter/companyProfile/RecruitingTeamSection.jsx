import { Mail } from 'lucide-react';

export default function RecruitingTeamSection({ team = [] }) {
  if (!team || team.length === 0) return null;

  return (
    <div className="space-y-4 font-sans">
      <h3 className="text-lg font-bold text-slate-900">Recruiting Team</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {team.map((member, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-150 p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              {member.photo ? (
                <img src={member.photo} alt={member.name} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                  {member.name?.charAt(0) || 'R'}
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{member.role || 'Recruiter'}</p>
              </div>
            </div>

            {member.email && (
              <a href={`mailto:${member.email}`} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer">
                <Mail className="h-4 w-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
