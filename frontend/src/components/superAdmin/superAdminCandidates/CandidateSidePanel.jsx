import { useState } from 'react';
import Avatar from '../../shared/Avatar';

export default function CandidateSidePanel({ 
  isOpen, 
  onClose, 
  panelType, 
  panelTitle, 
  candidate, 
  onActionSubmit, 
  onToast 
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [formName, setFormName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDistrict, setFormDistrict] = useState('Chennai District');
  const [formCity, setFormCity] = useState('');
  const [formJobType, setFormJobType] = useState('Full-time');
  const [formCompletion, setFormCompletion] = useState(80);

  if (!isOpen) return null;

  const handleSaveAddCandidate = (e) => {
    e.preventDefault();
    if (!formName || !formMobile || !formEmail) {
      onToast('Please fill out all required fields.');
      return;
    }
    const newCand = {
      id: `usr_${Date.now()}`,
      full_name: formName,
      candidate_id: `CND-${Math.floor(100000 + Math.random() * 900000)}`,
      mobile_number: formMobile,
      email: formEmail,
      status: 'Active',
      last_active: 'Today, 10:45 AM',
      applications: 0,
      profile_completion: Number(formCompletion),
      location: {
        state: 'Tamil Nadu',
        district: formDistrict,
        city: formCity || 'Chennai'
      },
      preferred_job_type: formJobType,
      skills: [],
      created_at: new Date().toISOString()
    };
    onActionSubmit('ADD_SAVE', newCand);
    onToast('Candidate added successfully.');
    // reset form
    setFormName('');
    setFormMobile('');
    setFormEmail('');
    setFormCity('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop blur */}
      <div 
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Body container */}
      <div className="relative z-10 flex h-full w-full sm:w-[520px] flex-col bg-white shadow-3xl animate-slideRight overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-teal-50/20 to-white px-6 pt-7 pb-5 border-b border-slate-150 shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all focus:outline-none"
            aria-label="Close details"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <Avatar
              src={candidate?.profile_photo || candidate?.profile_picture}
              alt={candidate?.full_name || 'Candidate'}
              imgClassName="h-16 w-16 shrink-0 rounded-2xl object-cover object-top border-2 border-teal-200 bg-white shadow-sm"
              fallbackNode={
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-50 border-2 border-teal-100 text-teal-600">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              }
            />

            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-xs font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                {panelType === 'ADD_CANDIDATE' ? 'Create profile' : 'Candidate Workspace'}
              </span>
              <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mt-2 truncate">
                {panelType === 'ADD_CANDIDATE' ? 'Add new candidate' : (candidate?.full_name || panelTitle)}
              </h2>
              {candidate?.headline && (
                <p className="text-xs font-bold text-teal-700 tracking-tight truncate mt-1">
                  {candidate.headline}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable details view content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {panelType === 'ADD_CANDIDATE' ? (
            /* Creation Form */
            <form onSubmit={handleSaveAddCandidate} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Full name *</label>
                <input
                  type="text"
                  required
                  placeholder="Arun Kumar"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base text-slate-800 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Mobile number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base text-slate-800 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Email address *</label>
                <input
                  type="email"
                  required
                  placeholder="arunkumar@email.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base text-slate-800 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">District</label>
                  <select
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base text-slate-800 focus:border-teal-500 focus:outline-none bg-white"
                  >
                    <option value="Chennai District">Chennai District</option>
                    <option value="Tiruvallur">Tiruvallur</option>
                    <option value="Chengalpattu">Chengalpattu</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">City/Town</label>
                  <input
                    type="text"
                    placeholder="Chennai"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base text-slate-800 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Preferred job type</label>
                  <select
                    value={formJobType}
                    onChange={(e) => setFormJobType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base text-slate-800 focus:border-teal-500 focus:outline-none bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Profile completion (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={formCompletion}
                    onChange={(e) => setFormCompletion(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base text-slate-800 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-teal-600 py-3 text-base font-extrabold text-white hover:bg-teal-700 mt-6 shadow-md shadow-teal-600/10 transition-colors"
              >
                Save Candidate
              </button>
            </form>
          ) : (
            /* Details view / Context Queue lists */
            <div className="space-y-6">
              {candidate ? (
                <>
                  {/* Tabs */}
                  <div className="flex border-b border-slate-150">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${
                        activeTab === 'profile'
                          ? 'border-teal-600 text-teal-600 font-extrabold'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Profile Details
                    </button>
                    <button
                      onClick={() => setActiveTab('applications')}
                      className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${
                        activeTab === 'applications'
                          ? 'border-teal-600 text-teal-600 font-extrabold'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Applications
                    </button>
                    <button
                      onClick={() => setActiveTab('activity')}
                      className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${
                        activeTab === 'activity'
                          ? 'border-teal-600 text-teal-600 font-extrabold'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Activity History
                    </button>
                  </div>

                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      {/* Completion Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                          <span>Profile completion</span>
                          <span>{candidate.profile_completion}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal-600 rounded-full transition-all duration-300"
                            style={{ width: `${candidate.profile_completion}%` }}
                          />
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-4.5 rounded-2xl border border-slate-150 p-5 bg-slate-50/20 text-sm">
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Candidate ID</span>
                          <span className="font-bold text-slate-800">{candidate.candidate_id || `CND-${candidate.id || 'N/A'}`}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Account status</span>
                          <span className="font-bold text-teal-650">{candidate.status || (candidate.is_active !== false ? 'Active' : 'Suspended')}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Phone number</span>
                          <span className="font-bold text-slate-800">{candidate.mobile_number || candidate.phone_number || 'N/A'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Email address</span>
                          <span className="font-bold text-slate-800 break-all">{candidate.email || 'N/A'}</span>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Location</span>
                          <span className="font-bold text-slate-800">
                            {candidate.location?.full_path || candidate.location?.name || [candidate.location?.city || candidate.city, candidate.location?.district || candidate.district, candidate.location?.state || candidate.state].filter(Boolean).join(', ') || 'Not specified'}
                          </span>
                        </div>
                        <div className="space-y-1 col-span-2 sm:col-span-1">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Job Preference</span>
                          <span className="font-bold text-slate-800">{candidate.job_preference || candidate.preferred_job_type || 'Not specified'}</span>
                        </div>
                        <div className="space-y-1 col-span-2 sm:col-span-1">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Registered on</span>
                          <span className="font-bold text-slate-800">{candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : (candidate.date_joined ? new Date(candidate.date_joined).toLocaleDateString() : 'Recent')}</span>
                        </div>
                        {(candidate.links?.expectedSalary || candidate.expected_salary_min || candidate.expected_salary_max) && (
                          <div className="space-y-1 col-span-2">
                            <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Expected Salary</span>
                            <span className="font-bold text-slate-800">
                              {candidate.links?.expectedSalary || `₹${candidate.expected_salary_min || 0} - ₹${candidate.expected_salary_max || 0}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bio / Summary */}
                      {candidate.bio && (
                        <div className="rounded-2xl border border-slate-150 p-4.5 bg-slate-50/20 text-sm space-y-1">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">About / Summary</span>
                          <p className="text-sm font-medium text-slate-700 leading-relaxed">{candidate.bio}</p>
                        </div>
                      )}

                      {/* Portfolio & Social Links */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Links & Portfolio</h4>
                        {candidate.links && (candidate.links.github || candidate.links.linkedin || candidate.links.portfolio) ? (
                          <div className="flex flex-wrap gap-2.5">
                            {candidate.links.github && (
                              <a
                                href={candidate.links.github.startsWith('http') ? candidate.links.github : `https://${candidate.links.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-teal-500 hover:text-teal-700 transition-colors shadow-2xs"
                              >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                                <span>GitHub</span>
                                <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                            {candidate.links.linkedin && (
                              <a
                                href={candidate.links.linkedin.startsWith('http') ? candidate.links.linkedin : `https://${candidate.links.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-teal-500 hover:text-teal-700 transition-colors shadow-2xs"
                              >
                                <svg className="h-4 w-4 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74V9.96H5.06v8.54z" />
                                </svg>
                                <span>LinkedIn</span>
                                <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                            {candidate.links.portfolio && (
                              <a
                                href={candidate.links.portfolio.startsWith('http') ? candidate.links.portfolio : `https://${candidate.links.portfolio}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-teal-500 hover:text-teal-700 transition-colors shadow-2xs"
                              >
                                <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                <span>Portfolio</span>
                                <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs font-semibold text-slate-400 italic">No links added yet</p>
                        )}
                      </div>

                      {/* Resume / CV */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Resume / CV</h4>
                        {Array.isArray(candidate.resumes) && candidate.resumes.length > 0 ? (
                          <div className="space-y-2">
                            {candidate.resumes.map((res, idx) => (
                              <div key={res.id || idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-teal-300 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="h-9 w-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-black text-slate-800 truncate max-w-[200px]">{res.file_name}</span>
                                      {res.is_default && (
                                        <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">Default</span>
                                      )}
                                    </div>
                                    {res.uploaded_at && (
                                      <span className="text-[11px] font-semibold text-slate-400">Uploaded {res.uploaded_at}</span>
                                    )}
                                  </div>
                                </div>
                                {res.file_url ? (
                                  <a
                                    href={res.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-extrabold text-xs px-3 py-1.5 transition-colors shrink-0"
                                  >
                                    <span>View</span>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                ) : (
                                  <span className="text-xs font-semibold text-slate-400">Attached</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs font-semibold text-slate-400 italic">No resume uploaded yet</p>
                        )}
                      </div>

                      {/* Work Experience */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Work Experience</h4>
                        </div>
                        {Array.isArray(candidate.experiences) && candidate.experiences.length > 0 ? (
                          <div className="space-y-3">
                            {candidate.experiences.map((exp, idx) => (
                              <div key={exp.id || idx} className="rounded-2xl border border-slate-150 p-4 bg-white space-y-1.5 shadow-2xs">
                                <div className="flex items-start justify-between gap-2">
                                  <h5 className="text-sm font-black text-slate-900 leading-tight">
                                    {exp.roleTitle || exp.designation || exp.job_title || 'Software Engineer'}
                                  </h5>
                                  {(exp.period || exp.duration) && (
                                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md shrink-0">
                                      {exp.period || exp.duration}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs font-bold text-slate-600">
                                  {exp.companyName || exp.company || 'Company'}
                                  {exp.location ? ` • ${exp.location}` : ''}
                                </div>
                                {exp.description && (
                                  <p className="text-xs font-medium text-slate-600 pt-1 leading-relaxed border-t border-slate-100 mt-2">
                                    {exp.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs font-semibold text-slate-400 italic">No work experience added yet</p>
                        )}
                      </div>

                      {/* Education */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                          </svg>
                          <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Education</h4>
                        </div>
                        {Array.isArray(candidate.educations) && candidate.educations.length > 0 ? (
                          <div className="space-y-2.5">
                            {candidate.educations.map((edu, idx) => (
                              <div key={edu.id || idx} className="rounded-2xl border border-slate-150 p-4 bg-white space-y-1 shadow-2xs">
                                <h5 className="text-sm font-black text-slate-900 leading-tight">
                                  {edu.degree || 'Degree'}
                                </h5>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                  <span>{edu.institution || edu.college || 'Institution'}</span>
                                  {(edu.period || edu.graduation_year) && (
                                    <span className="text-slate-400 font-semibold">{edu.period || edu.graduation_year}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs font-semibold text-slate-400 italic">No education records added yet</p>
                        )}
                      </div>

                      {/* Certifications */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Certifications</h4>
                        </div>
                        {Array.isArray(candidate.certifications) && candidate.certifications.length > 0 ? (
                          <div className="space-y-2">
                            {candidate.certifications.map((cert, idx) => {
                              const certName = typeof cert === 'string' ? cert : (cert.name || cert.title || '');
                              const certYear = typeof cert === 'object' ? (cert.year || cert.date || '') : '';
                              return (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-teal-100 bg-teal-50/40 text-xs">
                                  <span className="font-extrabold text-teal-900">{certName}</span>
                                  {certYear && <span className="font-bold text-teal-700">{certYear}</span>}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs font-semibold text-slate-400 italic">No certifications added yet</p>
                        )}
                      </div>

                      {/* Skills */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Skills & Tech Stack</h4>
                        {Array.isArray(candidate.skills) && candidate.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.map(skill => (
                              <span key={skill} className="rounded-xl border border-slate-150 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs font-semibold text-slate-400 italic">No skills added yet</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'applications' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Applications breakdown</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-slate-150 p-4 bg-slate-50/50">
                          <span className="text-xs font-black text-slate-500 block uppercase">Applied</span>
                          <span className="text-lg font-black text-slate-850 mt-1 block">{candidate.applications}</span>
                        </div>
                        <div className="rounded-xl border border-slate-150 p-4 bg-slate-50/50">
                          <span className="text-xs font-black text-slate-500 block uppercase">Shortlisted</span>
                          <span className="text-lg font-black text-slate-850 mt-1 block">0</span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-500 text-center py-6">
                        No detailed application flow logs found.
                      </p>
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Recent activity logs</h4>
                      <div className="relative border-l border-slate-150 pl-5 ml-2.5 space-y-4.5 text-sm">
                        <div className="relative">
                          <span className="absolute -left-[25.5px] top-1.5 h-2.5 w-2.5 rounded-full bg-teal-500 ring-4 ring-white" />
                          <span className="font-black text-slate-800">Account status modified</span>
                          <p className="text-xs font-bold text-slate-500 mt-1">{candidate.last_active || 'Today, Just now'}</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-[25.5px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-350 ring-4 ring-white" />
                          <span className="font-extrabold text-slate-700">Created initial record</span>
                          <p className="text-xs font-bold text-slate-500 mt-1">12 Jan 2024</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Drawer bottom actions */}
                  <div className="border-t border-slate-150 bg-slate-50 p-5 flex items-center gap-3.5 mt-6">
                    <button 
                      onClick={() => {
                        onActionSubmit('MESSAGE', candidate);
                        onClose();
                      }}
                      className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-base font-extrabold text-slate-700 hover:bg-slate-50"
                    >
                      Send Message
                    </button>
                    <button 
                      onClick={() => {
                        onActionSubmit(String(candidate.status || '').toUpperCase() === 'SUSPENDED' ? 'ACTIVATE' : 'SUSPEND', candidate);
                        onClose();
                      }}
                      className={`flex-1 rounded-xl py-3 text-base font-extrabold text-white transition-colors ${
                        String(candidate.status || '').toUpperCase() === 'SUSPENDED' 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'bg-red-650 hover:bg-red-700'
                      }`}
                    >
                      {String(candidate.status || '').toUpperCase() === 'SUSPENDED' ? 'Activate Account' : 'Suspend Account'}
                    </button>
                  </div>
                </>
              ) : (
                /* Needs Attention Queues list view */
                <div className="space-y-4">
                  <p className="text-sm font-bold text-slate-500 text-center py-12">
                    No active items require attention at this time.
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
