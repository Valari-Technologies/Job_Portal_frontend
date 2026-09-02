import { Mail, Phone, Globe } from 'lucide-react';

export default function CompanyContactCard({ companyProfile }) {
  const email = companyProfile?.company_email;
  const phone = companyProfile?.company_phone;
  const website = companyProfile?.website;
  const socialLinks = companyProfile?.social_links;

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-xs flex flex-col justify-between">
      <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wider border-b border-slate-100 pb-3">
        Contact Information
      </h3>

      <div className="space-y-3 text-xs font-semibold text-slate-700">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
          {email ? (
            <a href={`mailto:${email}`} className="text-indigo-600 hover:underline truncate">
              {email}
            </a>
          ) : (
            <span className="text-slate-400 italic">Not provided</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-slate-400 shrink-0" />
          {phone ? (
            <a href={`tel:${phone}`} className="text-indigo-600 hover:underline">
              {phone}
            </a>
          ) : (
            <span className="text-slate-400 italic">Not provided</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-slate-400 shrink-0" />
          {website ? (
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate">
              {website}
            </a>
          ) : (
            <span className="text-slate-400 italic">Not provided</span>
          )}
        </div>
      </div>

      {socialLinks && (
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              LinkedIn
            </a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              Twitter / X
            </a>
          )}
        </div>
      )}
    </div>
  );
}
