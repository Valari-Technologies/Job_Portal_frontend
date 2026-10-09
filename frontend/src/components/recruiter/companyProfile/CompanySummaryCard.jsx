import { Building2, MapPin, Users, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function CompanySummaryCard({ companyProfile }) {
  const name = companyProfile?.company_name || 'No company name provided';
  const logo = companyProfile?.company_logo;
  const industry = companyProfile?.industry;
  const location = companyProfile?.location;
  const companySize = companyProfile?.company_size;
  const activeJobsCount = companyProfile?.active_jobs_count || 0;
  const verificationStatus = companyProfile?.verification_status || 'PENDING';
  const trustLevel = companyProfile?.trust_level || 'BASIC';

  const formatLocation = (loc) => {
    if (!loc) return null;
    if (typeof loc === 'string') return loc;
    const parts = [loc.city || loc.district, loc.state].filter(Boolean);
    return parts.join(', ');
  };

  const formattedLocation = formatLocation(location);

  const getVerificationBadge = (st) => {
    switch (st) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified Company
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200 text-xs font-bold">
            <AlertCircle className="h-3.5 w-3.5" />
            Verification Needs Attention
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
            Restricted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            Verification Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 rounded-2xl border border-slate-150 p-6 shadow-xs space-y-4 flex flex-col md:flex-row md:items-center gap-6">
      
      {/* Logo container */}
      <div className="h-28 w-28 rounded-full bg-white border-2 border-black p-2 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
        {logo ? (
          <img src={logo} alt={name} className="h-full w-full object-contain rounded-full" />
        ) : (
          <div className="h-full w-full rounded-full bg-slate-100 text-slate-900 font-black text-2xl flex items-center justify-center">
            {name.charAt(0) || 'C'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{name}</h2>
          {getVerificationBadge(verificationStatus)}
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-100 text-xs font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            {trustLevel} Trust
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-slate-700">
          {industry && (
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-slate-500" />
              <span>{industry}</span>
            </div>
          )}
          {formattedLocation && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-500" />
              <span>{formattedLocation}</span>
            </div>
          )}
          {companySize && (
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-slate-500" />
              <span>{companySize}</span>
            </div>
          )}
        </div>

        {activeJobsCount > 0 && (
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Actively Hiring ({activeJobsCount} Jobs)</span>
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
