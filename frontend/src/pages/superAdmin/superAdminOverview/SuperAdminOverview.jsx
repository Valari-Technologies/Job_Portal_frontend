import { useState, useEffect, useRef, useCallback } from 'react';
import { useSuperAdminUser } from '../../../context/SuperAdminUserContext';
import OverviewMetricCard from '../../../components/superAdmin/superAdminOverview/OverviewMetricCard';
import OverviewChart from '../../../components/superAdmin/superAdminOverview/OverviewChart';
import { 
  ActionRequiredCard, 
  JobActivityCard, 
  TopHiringDistrictsCard, 
  RecentActivityCard 
} from '../../../components/superAdmin/superAdminOverview/OverviewPanels';
import SuperAdminSidePanel from '../../../components/superAdmin/common/SuperAdminSidePanel';
import {
  getOverviewMetrics,
  getApplicationsRegistrationTrend,
  getActionQueues,
  getJobActivity,
  getHiringDistricts,
  getRecentActivity
} from './superAdminOverviewService';

// Dashboard data is re-fetched silently at this interval so the cards never go stale
const AUTO_REFRESH_MS = 30000;

export default function SuperAdminOverview({ globalDetailsRecord, setGlobalDetailsRecord, onToast }) {
  const { profile, isLoadingProfile } = useSuperAdminUser();
  const locationState = profile?.state || '';
  const locationDistrict = profile?.district || '';
  const hasLoadedRef = useRef(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [range, setRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for dynamic metric and trend chart details
  const [metrics, setMetrics] = useState(null);
  const [trends, setTrends] = useState([]);
  const [queues, setQueues] = useState({});
  const [jobActivity, setJobActivity] = useState({});
  const [districts, setDistricts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Refactored Side Panel Drawer states
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState('employerVerifications');
  const [panelTitle, setPanelTitle] = useState('');
  const [panelItems, setPanelItems] = useState([]);

  // Districts modal state
  const [districtsModalOpen, setDistrictsModalOpen] = useState(false);

  // Synchronize global details updates (e.g. from header search result clicks)
  useEffect(() => {
    if (globalDetailsRecord) {
      setTimeout(() => {
        setPanelType('recentActivity'); // Detailing activity row view directly
        setPanelTitle(globalDetailsRecord.title || 'Details View');
        setPanelItems([{
          id: globalDetailsRecord.details?.id || 'ref_1',
          title: globalDetailsRecord.title,
          message: globalDetailsRecord.title,
          badge: globalDetailsRecord.type,
          details: globalDetailsRecord.details
        }]);
        setPanelOpen(true);
        setGlobalDetailsRecord(null);
      }, 0);
    }
  }, [globalDetailsRecord, setGlobalDetailsRecord]);

  // Fetch live dashboard data (re-runs when range / location changes, on manual reload and on a timer)
  const fetchData = useCallback(async (silent = false) => {
    const location = { state: locationState, district: locationDistrict };
    try {
      if (!silent) setLoading(true);
      const [m, t, q, j, d, a] = await Promise.all([
        getOverviewMetrics(range, location),
        getApplicationsRegistrationTrend(range, location),
        getActionQueues(range, location),
        getJobActivity(range, location),
        getHiringDistricts(range, location),
        getRecentActivity(range, location)
      ]);
      setMetrics(m);
      setTrends(t);
      setQueues(q);
      setJobActivity(j);
      setDistricts(d);
      setActivities(a);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setError(null);
      hasLoadedRef.current = true;
    } catch (err) {
      console.error(err);
      // A failed background refresh keeps showing the last good data
      if (!hasLoadedRef.current) {
        setError('Failed to fetch dashboard data. Please try again.');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [range, locationState, locationDistrict]);

  useEffect(() => {
    // Wait for the saved location so the first load is already scoped correctly
    if (isLoadingProfile) return undefined;
    let active = true;
    const run = (silent) => {
      if (active) fetchData(silent);
    };
    run(false);
    const timer = setInterval(() => run(true), AUTO_REFRESH_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [fetchData, reloadKey, isLoadingProfile]);

  // Export report to CSV
  const handleExportCSV = () => {
    if (!metrics) return;
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Count,PctChange\n"
      + `Total Candidates,${metrics.candidates.value},${metrics.candidates.pctChange}\n`
      + `Active Employers,${metrics.employers.value},${metrics.employers.pctChange}\n`
      + `Live Jobs,${metrics.liveJobs.value},${metrics.liveJobs.pctChange}\n`
      + `Applications this month,${metrics.applications.value},${metrics.applications.pctChange}\n`;
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `platform_overview_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenQueue = (queueKey, title) => {
    let items = [];
    if (queueKey === 'employerVerifications') items = queues.employerVerifications?.list || [];
    else if (queueKey === 'jobsPendingReview') items = queues.jobsPendingReview?.list || [];
    else if (queueKey === 'reportedJobs') items = queues.reportedJobs?.list || [];
    else if (queueKey === 'lowQualityProfiles') items = queues.lowQualityProfiles?.list || [];

    setPanelType(queueKey);
    setPanelTitle(title);
    setPanelItems(items);
    setPanelOpen(true);
  };

  const handleOpenActivity = (record) => {
    setPanelType('recentActivity');
    setPanelTitle('Recent Activity Details');
    setPanelItems([{
      id: record.id,
      title: record.message,
      message: record.message,
      badge: record.type,
      details: record.details,
      time: record.time
    }]);
    setPanelOpen(true);
  };

  // After a real moderation decision succeeds: drop the record locally, then re-sync with the backend
  const handleActionSubmit = (recordId) => {
    // Action updates local metrics and triggers layout re-renders
    if (panelType === 'employerVerifications') {
      setQueues(prev => ({
        ...prev,
        employerVerifications: {
          ...prev.employerVerifications,
          count: Math.max(0, prev.employerVerifications.count - 1),
          list: prev.employerVerifications.list.filter(item => item.id !== recordId)
        }
      }));
    } else if (panelType === 'jobsPendingReview') {
      setQueues(prev => ({
        ...prev,
        jobsPendingReview: {
          ...prev.jobsPendingReview,
          count: Math.max(0, prev.jobsPendingReview.count - 1),
          list: prev.jobsPendingReview.list.filter(item => item.id !== recordId)
        }
      }));
    } else if (panelType === 'reportedJobs') {
      setQueues(prev => ({
        ...prev,
        reportedJobs: {
          ...prev.reportedJobs,
          count: Math.max(0, prev.reportedJobs.count - 1),
          list: prev.reportedJobs.list.filter(item => item.id !== recordId)
        }
      }));
    } else if (panelType === 'lowQualityProfiles') {
      setQueues(prev => ({
        ...prev,
        lowQualityProfiles: {
          ...prev.lowQualityProfiles,
          count: Math.max(0, prev.lowQualityProfiles.count - 1),
          list: prev.lowQualityProfiles.list.filter(item => item.id !== recordId)
        }
      }));
    }
    setReloadKey(k => k + 1);
  };

  if (loading && !metrics) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">Loading platform overview...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <h3 className="text-sm font-bold text-red-800">Error Loading Dashboard</h3>
        <p className="text-xs text-red-600 mt-1">{error}</p>
        <button 
          onClick={() => { setError(null); setReloadKey(k => k + 1); }}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & header meta actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Platform overview</h1>
          <p className="text-base font-bold text-slate-500 mt-1">Monitor marketplace health, moderation queues and activity across Tamil Nadu.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-650 bg-slate-100 rounded-lg px-3.5 py-1.5 border border-slate-200">
            Last updated: Today, {lastUpdated}
          </span>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2.5 rounded-xl bg-teal-600 px-4.5 py-2.5 text-base font-bold text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export report</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewMetricCard
          title="Total candidates"
          value={metrics.candidates.value}
          pctChange={metrics.candidates.pctChange}
          color="teal"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <OverviewMetricCard
          title="Active employers"
          value={metrics.employers.value}
          pctChange={metrics.employers.pctChange}
          color="blue"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <OverviewMetricCard
          title="Live jobs"
          value={metrics.liveJobs.value}
          pctChange={metrics.liveJobs.pctChange}
          color="indigo"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <OverviewMetricCard
          title="Applications this month"
          value={metrics.applications.value}
          pctChange={metrics.applications.pctChange}
          color="purple"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      </div>

      {/* Main Grid: Trend Chart and Action Required */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OverviewChart 
            data={trends} 
            range={range} 
            onRangeChange={setRange} 
          />
        </div>
        <div>
          <ActionRequiredCard 
            queues={queues} 
            onOpenQueue={handleOpenQueue} 
          />
        </div>
      </div>

      {/* Grid: Job Activity, Top Districts, Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <JobActivityCard 
          jobActivity={jobActivity} 
          onViewJobReview={() => handleOpenQueue('jobsPendingReview', 'Jobs pending review')}
        />
        
        <TopHiringDistrictsCard 
          districts={districts}
          onViewAllDistricts={() => setDistrictsModalOpen(true)}
        />
        
        <RecentActivityCard 
          activities={activities} 
          onOpenRecord={handleOpenActivity}
        />
      </div>

      {/* Unified Contextual Details Side Panel */}
      <SuperAdminSidePanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        panelType={panelType}
        panelTitle={panelTitle}
        items={panelItems}
        queueCounts={{
          employerVerifications: queues.employerVerifications?.count ?? 0,
          jobsPendingReview: queues.jobsPendingReview?.count ?? 0,
          reportedJobs: queues.reportedJobs?.count ?? 0,
          lowQualityProfiles: queues.lowQualityProfiles?.count ?? 0
        }}
        queueStats={{
          employerVerifications: queues.employerVerifications?.stats,
          jobsPendingReview: queues.jobsPendingReview?.stats,
          reportedJobs: queues.reportedJobs?.stats,
          lowQualityProfiles: queues.lowQualityProfiles?.stats
        }}
        onActionSubmit={handleActionSubmit}
        onToast={onToast}
      />

      {/* Districts Modal */}
      {districtsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setDistrictsModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-800">Tamil Nadu Hiring Districts</h3>
              <button 
                onClick={() => setDistrictsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {districts.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs border-b border-slate-50 pb-2">
                  <span className="font-semibold text-slate-700">{d.district}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-800">{d.count} Jobs</span>
                    <span className="text-[10px] font-bold text-slate-400">{d.share}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
