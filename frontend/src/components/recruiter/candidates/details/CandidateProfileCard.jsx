import { Mail, Phone, Download, Globe } from 'lucide-react';

export default function CandidateProfileCard({ candidate, resumeUrl }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-5 shadow-xs">
      {/* Avatar & Basic Info */}
      <div className="flex flex-col items-center text-center space-y-3">
        {candidate.profile_photo ? (
          <img 
            src={candidate.profile_photo} 
            alt={candidate.full_name} 
            className="h-24 w-24 rounded-full object-cover border-2 border-slate-200" 
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-slate-100 text-slate-400 border-2 border-slate-200 flex items-center justify-center font-bold text-2xl">
            {candidate.initials || candidate.full_name?.charAt(0) || 'C'}
          </div>
        )}

        <div>
          <h3 className="text-lg font-black text-slate-900">{candidate.full_name || 'Candidate Name'}</h3>
          <p className="text-xs font-bold text-slate-500 mt-0.5">
            {candidate.location || 'Location Not Specified'}
            {candidate.willing_to_relocate && ' • Willing to relocate'}
          </p>
        </div>
      </div>

      {/* Resume Download Action */}
      <div>
        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-indigo-600 bg-white text-indigo-600 font-extrabold text-xs hover:bg-indigo-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Resume</span>
          </a>
        ) : (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs font-medium text-slate-500">
            No resume was required for this application.
          </div>
        )}
      </div>

      {/* Contact Details & Links */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-650">
        {candidate.email && (
          <div className="flex items-center gap-2.5 truncate">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">{candidate.email}</span>
          </div>
        )}
        {candidate.phone && (
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
            <span>{candidate.phone}</span>
          </div>
        )}
        {candidate.linkedin_url && (
          <div className="flex items-center gap-2.5 truncate">
            <Globe className="h-4 w-4 text-indigo-600 shrink-0" />
            <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate">
              {candidate.linkedin_url}
            </a>
          </div>
        )}
        {candidate.github_url && (
          <div className="flex items-center gap-2.5 truncate">
            <Globe className="h-4 w-4 text-indigo-600 shrink-0" />
            <a href={candidate.github_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate">
              {candidate.github_url}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
