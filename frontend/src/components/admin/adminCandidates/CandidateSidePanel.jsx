import { useState } from 'react';

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
      skills: ['HTML', 'CSS', 'JavaScript'],
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

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 border border-teal-100 text-teal-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                {panelType === 'ADD_CANDIDATE' ? 'Create profile' : 'Candidate Workspace'}
              </span>
              <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mt-2">
                {panelType === 'ADD_CANDIDATE' ? 'Add new candidate' : (candidate?.full_name || panelTitle)}
              </h2>
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
                          <span className="font-bold text-slate-800">{candidate.candidate_id}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Account status</span>
                          <span className="font-bold text-teal-650">{candidate.status}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Phone number</span>
                          <span className="font-bold text-slate-800">{candidate.mobile_number}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Email address</span>
                          <span className="font-bold text-slate-800">{candidate.email || 'N/A'}</span>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Location</span>
                          <span className="font-bold text-slate-800">
                            {candidate.location?.city}, {candidate.location?.district}, {candidate.location?.state}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Job Preference</span>
                          <span className="font-bold text-slate-800">{candidate.preferred_job_type || 'Full-time'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Registered on</span>
                          <span className="font-bold text-slate-800">{candidate.created_at || '12 Jan 2024'}</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {(candidate.skills || ['HTML', 'CSS', 'JavaScript', 'SQL']).map(skill => (
                            <span key={skill} className="rounded-xl border border-slate-150 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-700">
                              {skill}
                            </span>
                          ))}
                        </div>
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
                        onActionSubmit(candidate.status === 'Suspended' ? 'ACTIVATE' : 'SUSPEND', candidate);
                        onClose();
                      }}
                      className={`flex-1 rounded-xl py-3 text-base font-extrabold text-white transition-colors ${
                        candidate.status === 'Suspended' 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'bg-red-650 hover:bg-red-700'
                      }`}
                    >
                      {candidate.status === 'Suspended' ? 'Activate Account' : 'Suspend Account'}
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
