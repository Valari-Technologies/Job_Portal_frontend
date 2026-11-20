import { Building2, Mail, Phone, Globe, MapPin, Calendar, User, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function EmployerSidePanel({ 
  isOpen, 
  onClose, 
  panelType, 
  panelTitle,
  selectedEmployer,
  onUpdateTrustLevel 
}) {
  if (!isOpen) return null;

  const emp = selectedEmployer;
  const isTrusted = emp && (emp.trust_level === 'TRUSTED' || emp.trust_level === 'HIGH');

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide Drawer Content Container */}
      <div className="relative z-10 flex h-full w-full sm:w-[540px] flex-col bg-white shadow-3xl animate-slideRight overflow-hidden font-sans">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-teal-50/30 to-white px-6 pt-7 pb-5 border-b border-slate-150 shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all focus:outline-none cursor-pointer"
            aria-label="Close details"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-4">
            {emp && emp.company_logo ? (
              <img 
                src={emp.company_logo} 
                alt={emp.company_name || 'Logo'} 
                className="h-14 w-14 rounded-full object-cover border-2 border-black bg-white shadow-xs shrink-0" 
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white border-2 border-black text-slate-900 font-black text-xl shadow-xs">
                {emp ? (emp.company_name ? emp.company_name.charAt(0).toUpperCase() : (emp.full_name ? emp.full_name.charAt(0).toUpperCase() : 'E')) : <Building2 className="h-7 w-7" />}
              </div>
            )}

            <div className="space-y-1 min-w-0 pr-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100 inline-block">
                Employer Details
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug truncate mt-1">
                {emp ? (emp.company_name || emp.full_name) : panelTitle}
              </h2>
            </div>
          </div>
        </div>

        {/* Content view */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {panelType === 'EMPLOYER_DETAILS' && emp ? (
            <>
              {/* Status Badges Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-150 bg-slate-50/70 p-3 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Verification</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                    emp.verification_status === 'APPROVED' 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                      : emp.verification_status === 'REJECTED' 
                      ? 'bg-rose-50 border border-rose-200 text-rose-700' 
                      : 'bg-amber-50 border border-amber-200 text-amber-700'
                  }`}>
                    {emp.verification_status || 'PENDING'}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-150 bg-slate-50/70 p-3 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Trust Level</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                    isTrusted
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 font-black'
                      : emp.trust_level === 'BASIC'
                      ? 'bg-blue-50 border border-blue-200 text-blue-700'
                      : 'bg-slate-100 border border-slate-200 text-slate-600'
                  }`}>
                    {emp.trust_level || 'NEW'}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-150 bg-slate-50/70 p-3 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Account Status</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                    emp.status === 'ACTIVE' 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                      : 'bg-slate-100 border border-slate-200 text-slate-600'
                  }`}>
                    {emp.status || 'ACTIVE'}
                  </span>
                </div>
              </div>

              {/* Primary Contact Person Card */}
              <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-3.5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <User className="h-4 w-4 text-teal-600" />
                  Primary Contact Person
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Full Name</span>
                    <span className="font-extrabold text-slate-900 text-sm">{emp.full_name || emp.name || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Designation</span>
                    <span className="font-extrabold text-slate-900 text-sm">{emp.designation || 'HR Manager'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Personal Email</span>
                    <span className="font-medium text-slate-800">{emp.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Phone Number</span>
                    <span className="font-medium text-slate-800">{emp.phone_number || emp.company_phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Company Information Card */}
              <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-3.5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-teal-600" />
                  Company Details
                </h3>

                <div className="space-y-3 text-xs font-semibold text-slate-700">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">Company Email</span>
                      <span className="font-extrabold text-slate-900">{emp.company_email || emp.email || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">Company Phone</span>
                      <span className="font-extrabold text-slate-900">{emp.company_phone || emp.phone_number || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">Website</span>
                      {emp.company_website ? (
                        <a 
                          href={emp.company_website.startsWith('http') ? emp.company_website : `https://${emp.company_website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-extrabold text-teal-600 hover:underline break-all"
                        >
                          {emp.company_website}
                        </a>
                      ) : (
                        <span className="text-slate-500 font-medium">Not provided</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">Location / Address</span>
                      <span className="font-bold text-slate-800 leading-relaxed block">
                        {emp.location?.full_path || emp.location?.name || emp.company_address || 'All Locations'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs space-y-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Company Overview
                </h3>
                <p className="text-xs font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                  {emp.company_description || 'No detailed company overview provided yet.'}
                </p>
              </div>

              {/* Metadata */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-150 text-[11px] font-bold text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Registered on: {emp.created_at ? new Date(emp.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}
                </span>
                <span>User ID: #{emp.id}</span>
              </div>

              {/* Trust Status & Quick Action Card (At the bottom) */}
              <div className="rounded-2xl border border-slate-150 bg-gradient-to-br from-teal-50/40 via-white to-emerald-50/30 p-4.5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`h-4.5 w-4.5 ${isTrusted ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Trust Management</h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {isTrusted 
                          ? 'Trusted employer: jobs bypass manual review and auto-publish directly.'
                          : 'Standard employer: jobs require review before publishing.'}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                    isTrusted 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {emp.trust_level || 'NEW'}
                  </span>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  {isTrusted ? (
                    <button
                      type="button"
                      onClick={() => onUpdateTrustLevel && onUpdateTrustLevel(emp.id, 'BASIC')}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-extrabold text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-2xs cursor-pointer"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      <span>Revoke Trusted Status (Set to Basic)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onUpdateTrustLevel && onUpdateTrustLevel(emp.id, 'TRUSTED')}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-4 text-xs font-extrabold text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Mark as Trusted Employer</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto py-12">
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-150 text-slate-405">
                <Building2 className="h-7 w-7" />
              </div>
              
              {panelType === 'SIGNAL_PENDING' && (
                <div className="space-y-1.5">
                  <h4 className="text-base font-extrabold text-slate-800">No employer verifications pending</h4>
                  <p className="text-sm font-bold text-slate-500">
                    New submissions waiting for verification will appear here once employers register on the platform.
                  </p>
                </div>
              )}

              {panelType === 'SIGNAL_JOBS' && (
                <div className="space-y-1.5">
                  <h4 className="text-base font-extrabold text-slate-800">No jobs are waiting for approval</h4>
                  <p className="text-sm font-bold text-slate-500">
                    Moderation queue jobs pending administrator review will appear here.
                  </p>
                </div>
              )}

              {panelType === 'SIGNAL_TRUSTED' && (
                <div className="space-y-1.5">
                  <h4 className="text-base font-extrabold text-slate-800">No trusted employers yet</h4>
                  <p className="text-sm font-bold text-slate-500">
                    Progressive trust level criteria configurations will be finalized in subsequent design revisions.
                  </p>
                </div>
              )}

              {panelType === 'TRUST_INFO' && (
                <div className="space-y-2 text-left">
                  <h4 className="text-base font-extrabold text-slate-800 text-center mb-2">Progressive Trust Model Overview</h4>
                  <p className="text-sm font-bold text-slate-650 leading-relaxed">
                    Employer trust is built dynamically over time based on document verifications, quality compliance, and platform activity.
                  </p>
                </div>
              )}

              {panelType === 'EMPTY_PROFILE' && (
                <div className="space-y-1.5">
                  <h4 className="text-base font-extrabold text-slate-800">Profile preview disabled</h4>
                  <p className="text-sm font-bold text-slate-500">
                    Please select an active employer from the management table to preview details.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
