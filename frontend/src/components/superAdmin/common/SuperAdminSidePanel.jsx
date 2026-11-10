import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitQueueDecision } from '../../../pages/superAdmin/superAdminOverview/superAdminOverviewService';

const QUEUE_ROUTES = {
  employerVerifications: '/super-admin/employer-verification',
  jobsPendingReview: '/super-admin/job-review',
  reportedJobs: '/super-admin/reports',
  lowQualityProfiles: '/super-admin/candidates'
};

// Priority Colors Mapper helper
const getThemeColors = (type) => {
  const mapping = {
    employerVerifications: {
      primary: 'text-orange-600 bg-orange-50 border-orange-100',
      badge: 'bg-orange-500/10 text-orange-700',
      gradient: 'from-orange-50/45 to-transparent',
      accent: 'orange'
    },
    jobsPendingReview: {
      primary: 'text-amber-600 bg-amber-50 border-amber-100',
      badge: 'bg-amber-500/10 text-amber-700',
      gradient: 'from-amber-50/45 to-transparent',
      accent: 'amber'
    },
    reportedJobs: {
      primary: 'text-red-600 bg-red-50 border-red-100',
      badge: 'bg-red-500/10 text-red-700',
      gradient: 'from-red-50/45 to-transparent',
      accent: 'red'
    },
    lowQualityProfiles: {
      primary: 'text-purple-600 bg-purple-50 border-purple-100',
      badge: 'bg-purple-500/10 text-purple-700',
      gradient: 'from-purple-50/45 to-transparent',
      accent: 'purple'
    },
    success: {
      primary: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      badge: 'bg-emerald-500/10 text-emerald-700',
      gradient: 'from-emerald-50/45 to-transparent',
      accent: 'emerald'
    },
    info: {
      primary: 'text-blue-600 bg-blue-50 border-blue-100',
      badge: 'bg-blue-500/10 text-blue-700',
      gradient: 'from-blue-50/45 to-transparent',
      accent: 'blue'
    }
  };
  return mapping[type] || mapping.info;
};

export default function AdminSidePanel({
  isOpen,
  onClose,
  panelType,        // 'employerVerifications' | 'jobsPendingReview' | 'reportedJobs' | 'lowQualityProfiles' | 'recentActivity'
  panelTitle,
  items = [],
  queueCounts = {}, // live total per queue (the list itself only carries the newest rows)
  queueStats = {},  // live per-queue statistics from the backend
  onActionSubmit,   // callback to handle status changes
  onToast
}) {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingId, setSubmittingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChips, setFilterChips] = useState('All');
  
  // Clean reason dialog for REJECT / DISMISS / HIDE actions
  const [reasonModal, setReasonModal] = useState({
    isOpen: false,
    recordId: null,
    actionLabel: '',
    title: '',
    reason: '',
    suggestions: []
  });
  
  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClosePanel = () => {
    setSelectedRecord(null);
    setSearchQuery('');
    setFilterChips('All');
    onClose();
  };

  // Escape key close handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedRecord(null);
        setSearchQuery('');
        setFilterChips('All');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Decide colors based on item status
  const currentThemeType = 
    panelType === 'employerVerifications' ? 'employerVerifications' :
    panelType === 'jobsPendingReview' ? 'jobsPendingReview' :
    panelType === 'reportedJobs' ? 'reportedJobs' :
    panelType === 'lowQualityProfiles' ? 'lowQualityProfiles' :
    selectedRecord?.type === 'JOB_APPROVED' || selectedRecord?.type === 'PROFILE_COMPLETED' ? 'success' : 'info';
  
  const theme = getThemeColors(currentThemeType);

  // Filter list
  const getFilteredItems = () => {
    let list = [...items];
    
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) || 
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
      );
    }

    // Filter Chips (driven by the real created_at / priority values from the backend)
    if (filterChips === 'High priority') {
      list = list.filter(item => item.priority === 'HIGH');
    } else if (filterChips === 'Today') {
      const todayStr = new Date().toDateString();
      list = list.filter(item => item.created_at && new Date(item.created_at).toDateString() === todayStr);
    } else if (filterChips === 'Oldest first') {
      list.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    }
    
    return list;
  };

  const filteredItems = getFilteredItems();

  // Metric Insights Row Generator (all values come from the live backend queue data)
  const renderInsightStrip = () => {
    const total = queueCounts[panelType] ?? items.length;
    const stats = queueStats[panelType] || {};
    const high = stats.high ?? items.filter(i => i.priority === 'HIGH').length;
    const todayStr = new Date().toDateString();
    const newToday = stats.today ?? items.filter(i => i.created_at && new Date(i.created_at).toDateString() === todayStr).length;

    let cells = null;
    if (panelType === 'employerVerifications') {
      const avgWait = stats.avg_wait_days ?? 0;
      cells = [
        ['Pending', `${total} Items`],
        ['Priority', `${high} High`],
        ['Avg Wait', total > 0 ? `${avgWait} Days` : '0 Days']
      ];
    } else if (panelType === 'jobsPendingReview') {
      cells = [
        ['Review', `${total} Jobs`],
        ['Today', `${newToday} New`],
        ['Attention', `${high} High`]
      ];
    } else if (panelType === 'reportedJobs') {
      cells = [
        ['Reports', `${total} Open`],
        ['Severity', `${high} High`],
        ['Decision', `${total} Open`]
      ];
    } else if (panelType === 'lowQualityProfiles') {
      cells = [
        ['Low Profiles', `${total} Items`],
        ['No Resume', `${stats.no_resume ?? 0} Candidates`],
        ['No Skills', `${stats.no_skills ?? 0} Candidates`]
      ];
    }
    if (!cells) return null;

    return (
      <div className="grid grid-cols-3 gap-3">
        {cells.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-150 bg-slate-50/50 p-3 text-center">
            <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">{label}</span>
            <span className="text-sm font-black text-slate-800 mt-1 block">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Real moderation action: calls the backend, then refreshes the dashboard
  const executeAction = async (recordId, label, message, reason = '') => {
    if (isSubmitting || submittingId) return;
    const backendQueues = ['employerVerifications', 'jobsPendingReview', 'reportedJobs', 'lowQualityProfiles'];

    // Queues backed by a real decision endpoint
    if (backendQueues.includes(panelType)) {
      setIsSubmitting(true);
      setSubmittingId(recordId);
      const result = await submitQueueDecision(panelType, recordId, label, reason);
      setIsSubmitting(false);
      setSubmittingId(null);
      if (!result.success) {
        onToast(result.message || 'Action failed. Please try again.');
        return;
      }
      onToast(`${message} successfully.`);
      onActionSubmit && onActionSubmit(recordId, label);
      if (selectedRecord?.id === recordId) {
        setSelectedRecord(null);
      }
      // If no items left in list after this removal, auto-close panel
      if (items.length <= 1) {
        onClose();
      }
      return;
    }

    // Low-quality profiles / activity rows have no moderation endpoint: acknowledge locally
    onActionSubmit && onActionSubmit(recordId, label);
    onToast(`${message}.`);
    if (selectedRecord?.id === recordId) {
      setSelectedRecord(null);
    }
    if (items.length <= 1) {
      onClose();
    }
  };

  const openReasonModal = (recordId, actionLabel, title, defaultSuggestions = []) => {
    setReasonModal({
      isOpen: true,
      recordId,
      actionLabel,
      title,
      reason: defaultSuggestions[0] || '',
      suggestions: defaultSuggestions
    });
  };

  const handleConfirmReasonModal = async () => {
    const { recordId, actionLabel, reason } = reasonModal;
    if (!reason.trim()) {
      onToast('A reason is required for this action.');
      return;
    }
    setReasonModal(prev => ({ ...prev, isOpen: false }));
    const actionDesc = 
      actionLabel === 'REJECT' ? 'Record rejected' :
      actionLabel === 'DISMISS' ? 'Report dismissed' :
      actionLabel === 'HIDE' ? 'Job hidden' : 'Action completed';
    await executeAction(recordId, actionLabel, actionDesc, reason.trim());
  };

  const handleAction = async (label, message) => {
    const recordId = selectedRecord?.id;
    if (!recordId) return;

    if (panelType === 'employerVerifications' && label === 'REJECT') {
      openReasonModal(recordId, 'REJECT', 'Reject Employer Verification', [
        'Incomplete company registration details',
        'Unverifiable company phone or domain',
        'Invalid business tax/registration proof',
        'Duplicate or fraudulent account'
      ]);
      return;
    }

    if (panelType === 'jobsPendingReview' && label === 'REJECT') {
      openReasonModal(recordId, 'REJECT', 'Reject Job Listing', [
        'Job description violates community guidelines',
        'Unrealistic compensation or fees requested',
        'Incomplete role requirements or qualifications',
        'Duplicate job posting'
      ]);
      return;
    }

    if (panelType === 'reportedJobs' && label === 'DISMISS') {
      openReasonModal(recordId, 'DISMISS', 'Dismiss Job Report', [
        'Job listing fully adheres to guidelines',
        'Insufficient evidence of violation',
        'Duplicate / resolved user report',
        'Resolved directly with employer'
      ]);
      return;
    }

    if (panelType === 'reportedJobs' && label === 'HIDE') {
      openReasonModal(recordId, 'HIDE', 'Hide Reported Job Listing', [
        'Confirmed violation of job posting standards',
        'Misleading job description or suspicious scam',
        'Discriminatory or non-compliant content',
        'Employer company unverified'
      ]);
      return;
    }

    await executeAction(recordId, label, message);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Soft Dark transparent backdrop blur */}
      <div 
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleClosePanel}
      />
      
      {/* Drawer Panel content */}
      <div className="relative z-10 flex h-full w-full sm:w-[520px] flex-col bg-white shadow-3xl animate-slideRight overflow-hidden">
        
        {/* PREMIUM HEADER */}
        <div className={`relative bg-gradient-to-b ${theme.gradient} px-6 pt-7 pb-5 border-b border-slate-100 shrink-0`}>
          <button 
            onClick={handleClosePanel}
            className="absolute top-4 right-4 rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all focus:outline-none"
            aria-label="Close panel"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${theme.primary}`}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            </div>
            
            <div className="space-y-1">
              <span className={`text-xs font-black uppercase tracking-widest ${theme.badge} px-2.5 py-1 rounded-md`}>
                {panelType === 'recentActivity' ? 'ACTIVITY DETAILS' : 'MODERATION QUEUE'}
              </span>
              <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mt-2">
                {selectedRecord ? selectedRecord.title : panelTitle}
              </h2>
              <p className="text-sm font-bold text-slate-500 mt-1">
                {selectedRecord 
                  ? 'Detailed workspace values showing system configuration audits'
                  : 'Manage and review submissions pending verification'
                }
              </p>
              {QUEUE_ROUTES[panelType] && (
                <button
                  type="button"
                  onClick={() => {
                    handleClosePanel();
                    navigate(QUEUE_ROUTES[panelType]);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs mt-2"
                >
                  <span>Open {panelTitle || 'queue'} page</span>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic sub content container scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {selectedRecord ? (
            /* RECORD DETAILS SHEET */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="flex items-center gap-1.5 text-sm font-black text-teal-650 hover:text-teal-700 focus:outline-none"
                >
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back to list</span>
                </button>
                {QUEUE_ROUTES[panelType] && (
                  <button
                    type="button"
                    onClick={() => {
                      handleClosePanel();
                      navigate(QUEUE_ROUTES[panelType]);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700 hover:text-teal-850 hover:underline focus:outline-none"
                  >
                    <span>Open full page</span>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-slate-150 bg-slate-50/30 p-5 space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-teal-600 font-bold text-white uppercase text-base">
                    {selectedRecord.title ? selectedRecord.title.slice(0, 2) : 'RE'}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 leading-snug">{selectedRecord.title}</h3>
                    <span className="text-xs text-slate-500 font-bold">ID: {selectedRecord.id || 'rec_unknown'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-150 pt-4.5 text-sm">
                  {Object.entries(selectedRecord.details || {}).map(([key, val]) => {
                    if (val === null || typeof val === 'object') return null;
                    return (
                      <div key={key} className="space-y-1.5">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">{key.replace('_', ' ')}</span>
                        <span className="font-bold text-slate-800">{typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Small Activity Timeline */}
              <div className="space-y-3.5">
                <h4 className="text-sm font-black text-slate-550 uppercase tracking-wider">Queue Timeline</h4>
                <div className="relative border-l border-slate-150 pl-5 ml-2.5 space-y-4.5 text-sm">
                  <div className="relative">
                    <span className="absolute -left-[25.5px] top-1.5 h-2.5 w-2.5 rounded-full bg-teal-500 ring-4 ring-white" />
                    <span className="font-black text-slate-800">Pending Super Admin Action</span>
                    <p className="text-xs font-bold text-slate-500 mt-1">Awaiting verification in moderation queue</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[25.5px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                    <span className="font-extrabold text-slate-700">Record Submitted</span>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      {selectedRecord.created_at ? new Date(selectedRecord.created_at).toLocaleString() : 'Original submission'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* LIST AND FILTERS AREA */
            <div className="space-y-6">
              {renderInsightStrip()}

              {panelType !== 'recentActivity' && (
                <div className="space-y-4">
                  {/* Filters chips */}
                  <div className="flex flex-wrap items-center gap-2">
                    {['All', 'High priority', 'Today', 'Oldest first'].map(chip => (
                      <button
                        key={chip}
                        onClick={() => setFilterChips(chip)}
                        className={`rounded-xl px-3.5 py-2 text-sm font-bold transition-colors ${
                          filterChips === chip
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-50 text-slate-650 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Search query input */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="h-4.5 w-4.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search items in queue..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-250 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Rich clickable queue cards */}
              <div className="space-y-3.5">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (panelType === 'employerVerifications') {
                          handleClosePanel();
                          navigate(`/super-admin/employer-verification?employerId=${item.id}`, { state: { employerId: item.id } });
                          return;
                        }
                        if (panelType === 'jobsPendingReview') {
                          handleClosePanel();
                          navigate(`/super-admin/job-review?jobId=${item.id}`, { state: { jobId: item.id } });
                          return;
                        }
                        if (panelType === 'reportedJobs') {
                          handleClosePanel();
                          navigate(`/super-admin/reports?reportId=${item.id}`, { state: { reportId: item.id } });
                          return;
                        }
                        if (panelType === 'lowQualityProfiles') {
                          handleClosePanel();
                          navigate(`/super-admin/candidates?candidateId=${item.id}`, { state: { candidateId: item.id } });
                          return;
                        }
                        if (panelType === 'recentActivity') {
                          // Switch to detailing entity directly
                          setSelectedRecord({
                            id: item.id,
                            title: item.message,
                            type: item.type,
                            details: item.details
                          });
                        } else {
                          setSelectedRecord(item);
                        }
                      }}
                      className="group flex items-start justify-between rounded-xl border border-slate-150 bg-white p-4.5 transition-all duration-150 cursor-pointer hover:border-teal-500/40 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="h-10 w-10 flex shrink-0 items-center justify-center rounded-lg bg-slate-100 border border-slate-205 font-black text-slate-600 uppercase text-sm">
                          {item.title ? item.title.slice(0, 2) : 'QU'}
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-base font-extrabold text-slate-800 leading-snug group-hover:text-teal-600 transition-colors">
                            {item.title || item.message}
                          </h4>
                          <p className="text-sm font-bold text-slate-500">{item.subtitle || item.time}</p>
                          {item.date && (
                            <span className="text-xs font-bold text-slate-450 block">Logged: {item.date}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {panelType === 'employerVerifications' && (
                          <button
                            type="button"
                            title="Quick Approve"
                            disabled={submittingId === item.id || isSubmitting}
                            onClick={(e) => {
                              e.stopPropagation();
                              executeAction(item.id, 'APPROVE', 'Employer verification approved');
                            }}
                            className="rounded-lg bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-200 px-2.5 py-1 text-xs font-black transition-all"
                          >
                            {submittingId === item.id ? '...' : 'Approve'}
                          </button>
                        )}
                        {panelType === 'jobsPendingReview' && (
                          <button
                            type="button"
                            title="Quick Approve Job"
                            disabled={submittingId === item.id || isSubmitting}
                            onClick={(e) => {
                              e.stopPropagation();
                              executeAction(item.id, 'APPROVE', 'Job approved');
                            }}
                            className="rounded-lg bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-200 px-2.5 py-1 text-xs font-black transition-all"
                          >
                            {submittingId === item.id ? '...' : 'Approve'}
                          </button>
                        )}
                        {panelType === 'lowQualityProfiles' && (
                          <button
                            type="button"
                            title="Send Profile Reminder"
                            disabled={submittingId === item.id || isSubmitting}
                            onClick={(e) => {
                              e.stopPropagation();
                              executeAction(item.id, 'REMINDER', 'Profile completion reminder sent');
                            }}
                            className="rounded-lg bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200 px-2.5 py-1 text-xs font-black transition-all"
                          >
                            {submittingId === item.id ? '...' : 'Remind'}
                          </button>
                        )}
                        {item.badge && (
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase ${theme.badge}`}>
                            {item.badge.replace('_', ' ')}
                          </span>
                        )}
                        <svg className="h-4.5 w-4.5 text-slate-400 group-hover:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-sm text-slate-500">
                    No results match selection filters.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* STICKY BOTTOM ACTIONS SECTION */}
        {selectedRecord && (
          <div className="border-t border-slate-150 bg-slate-50 p-5 flex items-center gap-3.5 shrink-0">
            {panelType === 'employerVerifications' && (
              <>
                <button 
                  disabled={isSubmitting}
                  onClick={() => handleAction('REJECT', 'Employer verification rejected')}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-base font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Reject
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={() => handleAction('APPROVE', 'Employer verification approved')}
                  className="flex-1 rounded-xl bg-teal-600 py-3 text-base font-extrabold text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {isSubmitting && submittingId === selectedRecord.id ? 'Approving...' : 'Approve'}
                </button>
              </>
            )}
            
            {panelType === 'jobsPendingReview' && (
              <>
                <button 
                  disabled={isSubmitting}
                  onClick={() => handleAction('REJECT', 'Job rejected')}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-base font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Reject
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={() => handleAction('APPROVE', 'Job approved')}
                  className="flex-1 rounded-xl bg-teal-600 py-3 text-base font-extrabold text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {isSubmitting && submittingId === selectedRecord.id ? 'Approving...' : 'Approve Job'}
                </button>
              </>
            )}

            {panelType === 'reportedJobs' && (
              <>
                <button 
                  disabled={isSubmitting}
                  onClick={() => handleAction('DISMISS', 'Report dismissed')}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-base font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Dismiss Report
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={() => handleAction('HIDE', 'Job temporarily hidden')}
                  className="flex-1 rounded-xl bg-red-600 py-3 text-base font-extrabold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting && submittingId === selectedRecord.id ? 'Hiding...' : 'Hide Job'}
                </button>
              </>
            )}

            {panelType === 'lowQualityProfiles' && (
              <>
                <button 
                  disabled={isSubmitting}
                  onClick={() => handleAction('REMINDER', 'Profile completion reminder sent')}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-base font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {isSubmitting && submittingId === selectedRecord.id ? 'Sending...' : 'Send Reminder'}
                </button>
                <button 
                  disabled={isSubmitting}
                  onClick={() => handleAction('MARK_REVIEWED', 'Profile marked as reviewed')}
                  className="flex-1 rounded-xl bg-teal-600 py-3 text-base font-extrabold text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  Mark Reviewed
                </button>
              </>
            )}

            {panelType === 'recentActivity' && (
              <button 
                disabled={isSubmitting}
                onClick={() => handleAction('MARK_REVIEWED', 'Activity marked as reviewed')}
                className="w-full rounded-xl bg-teal-600 py-3.5 text-base font-extrabold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                Mark Activity Reviewed
              </button>
            )}
          </div>
        )}

        {/* MODAL: Inline Reason Input for Moderation Decisions */}
        {reasonModal.isOpen && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-800">{reasonModal.title}</h3>
                <button
                  type="button"
                  onClick={() => setReasonModal({ isOpen: false, recordId: null, actionLabel: '', title: '', reason: '', suggestions: [] })}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-650"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Select or enter reason:
                </label>
                {reasonModal.suggestions?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {reasonModal.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReasonModal(prev => ({ ...prev, reason: s }))}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors text-left ${
                          reasonModal.reason === s
                            ? 'border-teal-500 bg-teal-50 text-teal-800 font-bold'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <textarea
                  rows={3}
                  value={reasonModal.reason}
                  onChange={(e) => setReasonModal(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter reason or notes for this moderation action..."
                  className="w-full rounded-xl border border-slate-250 bg-slate-50 p-3 text-sm text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="mt-5 flex gap-2.5">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setReasonModal({ isOpen: false, recordId: null, actionLabel: '', title: '', reason: '', suggestions: [] })}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!reasonModal.reason.trim() || isSubmitting}
                  onClick={handleConfirmReasonModal}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Action'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
