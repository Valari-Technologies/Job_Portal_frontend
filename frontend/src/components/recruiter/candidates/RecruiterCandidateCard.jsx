import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, ArrowRight, MoreVertical } from 'lucide-react';
import ApplicationStatusBadge from '../applications/ApplicationStatusBadge';

export default function RecruiterCandidateCard({ candidateItem }) {
  const navigate = useNavigate();

  const candidate = candidateItem?.candidate || {};
  const job = candidateItem?.job || {};
  const applicationId = candidateItem?.application_id;
  const candidateId = candidate.id || '1';

  const visibleSkills = candidate.top_skills ? candidate.top_skills.slice(0, 3) : [];
  const extraSkillsCount = candidate.top_skills && candidate.top_skills.length > 3 ? candidate.top_skills.length - 3 : 0;

  const handleCardClick = () => {
    if (candidateId && applicationId) {
      navigate(`/recruiter/candidates/${candidateId}/application/${applicationId}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-slate-150 p-5 space-y-4 shadow-xs hover:border-indigo-200 transition-colors cursor-pointer flex flex-col justify-between group"
    >
      <div className="space-y-3">
        {/* Top Header: Avatar & Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {candidate.profile_photo ? (
              <img 
                src={candidate.profile_photo} 
                alt={candidate.full_name} 
                className="h-11 w-11 rounded-full object-cover border border-slate-200 shrink-0" 
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs shrink-0">
                {candidate.initials || candidate.full_name?.charAt(0) || 'C'}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                {candidate.full_name || 'Candidate Name'}
              </h3>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">
                {candidate.current_title || 'Professional'}
              </p>
            </div>
          </div>

          <button 
            type="button" 
            aria-label="Candidate menu"
            onClick={(e) => { e.stopPropagation(); }} 
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        {/* Applied For Role Info */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-150">
          <span className="text-xs font-bold uppercase text-indigo-700 tracking-wider block">Applied for</span>
          <span className="text-sm font-bold text-slate-900 truncate block mt-0.5">{job.title || 'Role Position'}</span>
        </div>

        {/* Top Skills */}
        {visibleSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {visibleSkills.map((skill, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-100">
                {skill}
              </span>
            ))}
            {extraSkillsCount > 0 && (
              <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                +{extraSkillsCount} more
              </span>
            )}
          </div>
        )}

        {/* Experience & Location */}
        <div className="space-y-1 pt-1 text-sm font-medium text-slate-700">
          {candidate.total_experience_years !== undefined && candidate.total_experience_years !== null && (
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-slate-500 shrink-0" />
              <span>{candidate.total_experience_years} yrs experience</span>
            </div>
          )}
          {candidate.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
              <span>{candidate.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Pipeline Status & View Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <ApplicationStatusBadge status={candidateItem.application_status} />
        
        <span className="text-sm font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>View Profile</span>
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>

    </div>
  );
}
