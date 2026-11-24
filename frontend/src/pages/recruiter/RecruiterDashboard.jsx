import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Bookmark,
  Calendar,
  UserPlus,
  Star,
  Wallet,
  Building2,
  Clock,
  UserCheck,
  CheckCircle,
  Sparkles,
  Eye
} from 'lucide-react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import RecruiterMetricCard from '../../components/recruiter/dashboard/RecruiterMetricCard';
import ApplicationDetailsDrawer from '../../components/recruiter/applications/ApplicationDetailsDrawer';
import { getRecruiterDashboardData, fetchRecruiterDashboardFromApi } from '../../services/recruiter/recruiterDashboardService';
import { getRecruiterCommerceSummary } from '../../services/recruiter/recruiterCommerceService';
import { updateApplicationStatusService, getRecruiterApplicationsData } from '../../services/recruiter/recruiterApplicationsService';
import { useRecruiterUser } from '../../context/RecruiterUserContext';

export default function RecruiterDashboard() {
  const { profile } = useRecruiterUser();
  const [data, setData] = useState(() => getRecruiterDashboardData());
  const [commerceSummary] = useState(() => getRecruiterCommerceSummary());
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetchRecruiterDashboardFromApi().then(freshData => {
      if (isMounted && freshData) {
        setData(freshData);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleReviewApplicant = (item) => {
    if (item.raw_app) {
      setSelectedApplication(item.raw_app);
    } else {
      const appsData = getRecruiterApplicationsData();
      const found = (appsData.applications || []).find(a => String(a.id) === String(item.id));
      setSelectedApplication(found || item);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await updateApplicationStatusService(appId, newStatus);
      setData(getRecruiterDashboardData());
      if (selectedApplication && String(selectedApplication.id) === String(appId)) {
        setSelectedApplication(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const metrics = data?.metrics || {
    active_jobs: 0,
    total_applications: 0,
    shortlisted: 0,
    pending: 0,
    interviews: 0,
    hired: 0,
    job_credits: 0
  };

  const walletBalanceFormatted = commerceSummary?.wallet?.formatted_balance || "₹0.00";
  const companyName = profile?.companySummary?.name || data?.company?.company_name || "State Jobz Technologies";

  return (
    <RecruiterLayout activeTab="dashboard">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Header Block */}
        <div>
          <h1 className="text-3xl font-bold text-indigo-950 tracking-tight">Overview</h1>
          <p className="text-sm font-semibold text-slate-600 mt-1">Here's what's happening with your hiring pipeline today.</p>
        </div>

        {/* Welcome, Company Badge & Wallet Balance Banner (Responsive for both Mobile & Desktop) */}
        <div className="bg-white rounded-2xl border border-slate-150 p-4 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Welcome back! <span className="text-lg sm:text-xl">👋</span>
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
                Here's an overview of your hiring activities and performance.
              </p>
            </div>
            
            <Link
              to="/recruiter/company-profile"
              className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl px-3.5 py-2.5 w-fit transition-colors group cursor-pointer"
            >
              <div className="h-8 w-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-indigo-950 truncate group-hover:text-indigo-600 transition-colors">{companyName}</p>
                <p className="text-[11px] font-semibold text-slate-500">Recruiter</p>
              </div>
            </Link>
          </div>

          {/* Wallet Balance Card */}
          <Link
            to="/recruiter/payments"
            className="w-full lg:w-72 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 p-4 sm:p-5 text-white flex items-center justify-between shadow-lg shadow-indigo-600/15 cursor-pointer hover:opacity-95 transition-all group active:scale-98"
          >
            <div className="space-y-1">
              <span className="text-[11px] sm:text-xs font-bold text-white/90 uppercase tracking-wider block">Wallet Balance</span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white block">
                {walletBalanceFormatted}
              </span>
            </div>
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 shrink-0 group-hover:scale-105 transition-transform">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </Link>
        </div>

        {/* Metric Cards (Unified Responsive: 2 cols on mobile, 3 cols on tablet, 6 cols on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <RecruiterMetricCard 
            title="ACTIVE JOBS" 
            value={metrics.active_jobs} 
            icon={Briefcase} 
            iconBgClass="bg-indigo-50"
            colorClass="text-indigo-600"
          />
          <RecruiterMetricCard 
            title="TOTAL APPS" 
            value={metrics.total_applications} 
            icon={FileText} 
            iconBgClass="bg-blue-50"
            colorClass="text-blue-600"
          />
          <RecruiterMetricCard 
            title="SHORTLISTED" 
            value={metrics.shortlisted} 
            icon={Bookmark} 
            iconBgClass="bg-amber-50"
            colorClass="text-amber-600"
            valueColorClass="text-indigo-600"
          />
          <RecruiterMetricCard 
            title="INTERVIEWS" 
            value={metrics.interviews} 
            icon={Calendar} 
            iconBgClass="bg-emerald-50"
            colorClass="text-emerald-600"
          />
          <RecruiterMetricCard 
            title="HIRED (MO)" 
            value={metrics.hired} 
            icon={UserPlus} 
            iconBgClass="bg-teal-50"
            colorClass="text-teal-600"
            valueColorClass="text-emerald-600"
          />
          <RecruiterMetricCard 
            title="JOB CREDITS" 
            value={metrics.job_credits} 
            icon={Star} 
            iconBgClass="bg-purple-50"
            colorClass="text-purple-600"
            valueColorClass="text-indigo-600"
          />
        </div>

        {/* Two-Column Section: Interviews Today & Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Interviews Today */}
          <div className="bg-white rounded-2xl border border-slate-150 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-805">Interviews Today</h3>
              <Link to="/recruiter/interviews" className="text-xs font-extrabold text-indigo-600 hover:underline">
                View All
              </Link>
            </div>

            {(!data?.interviews_today || data.interviews_today.length === 0) ? (
              <div className="flex flex-col items-center justify-center text-center py-10 px-4">
                <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Calendar className="h-6 w-6" />
                </div>
                <h4 className="text-xs font-black text-slate-800">No interviews scheduled today</h4>
                <p className="text-[11px] font-medium text-slate-450 mt-1 max-w-xs">
                  Interviews scheduled with candidates for your company jobs will appear here.
                </p>
                <Link
                  to="/recruiter/interviews/schedule"
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                >
                  + Schedule Interview
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 space-y-3 pt-1">
                {data.interviews_today.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-805">{item.candidate_name}</p>
                        <p className="text-[11px] font-bold text-slate-450">{item.job_title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-800">{item.time}</p>
                      <p className="text-[10px] font-bold text-slate-400">{item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 2: Recent Applications */}
          <div className="bg-white rounded-2xl border border-slate-150 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-805">Recent Applications</h3>
              <Link to="/recruiter/applications" className="text-xs font-extrabold text-indigo-600 hover:underline">
                View All
              </Link>
            </div>

            {(!data?.recent_applications || data.recent_applications.length === 0) ? (
              <div className="flex flex-col items-center justify-center text-center py-10 px-4">
                <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <FileText className="h-6 w-6" />
                </div>
                <h4 className="text-xs font-black text-slate-800">No applications received yet</h4>
                <p className="text-[11px] font-medium text-slate-450 mt-1 max-w-xs">
                  Applications submitted to your active job postings will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 space-y-2 pt-1">
                {data.recent_applications.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleReviewApplicant(item)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                        {item.candidate_initials || "C"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-805 truncate group-hover:text-indigo-600 transition-colors">
                          {item.candidate_name}
                        </p>
                        <p className="text-[11px] font-bold text-slate-450 truncate">
                          Applied for <span className="text-indigo-600 font-bold">{item.job_title}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* ATS / Match Score Badge */}
                      {item.match_score !== undefined && item.match_score !== null && (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          item.match_score >= 85 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : item.match_score >= 70 
                              ? 'bg-blue-50 text-blue-700 border-blue-200' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>{item.match_score}% Match</span>
                        </span>
                      )}

                      {/* Status Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        item.status === 'SHORTLISTED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        item.status === 'INTERVIEW' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        item.status === 'SELECTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        item.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {item.status || 'APPLIED'}
                      </span>

                      {/* Review Action Button */}
                      <button 
                        type="button" 
                        title="Review application"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReviewApplicant(item);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200/80 hover:border-indigo-600 text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs group/btn"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Review</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Application Details Drawer */}
        {selectedApplication && (
          <ApplicationDetailsDrawer
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

      </main>
    </RecruiterLayout>
  );
}
