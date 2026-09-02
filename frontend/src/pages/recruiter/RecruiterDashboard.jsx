import { useState } from 'react';
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
  ThumbsUp,
  ThumbsDown,
  Clock,
  UserCheck,
  CheckCircle
} from 'lucide-react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import RecruiterMetricCard from '../../components/recruiter/dashboard/RecruiterMetricCard';
import RecruiterMobileHeroIllustration from '../../components/recruiter/dashboard/RecruiterMobileHeroIllustration';
import { getRecruiterDashboardData } from '../../services/recruiter/recruiterDashboardService';
import { getRecruiterCommerceSummary } from '../../services/recruiter/recruiterCommerceService';

export default function RecruiterDashboard() {
  const [data] = useState(() => getRecruiterDashboardData());
  const [commerceSummary] = useState(() => getRecruiterCommerceSummary());

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
  const companyName = data?.company?.company_name || "No company linked";

  return (
    <RecruiterLayout activeTab="dashboard">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        
        {/* Header Block */}
        <div>
          <h1 className="text-3xl font-bold text-indigo-950 tracking-tight">Overview</h1>
          <p className="text-sm font-semibold text-slate-600 mt-1">Here's what's happening with your hiring pipeline today.</p>
        </div>

        {/* Mobile View Button & Illustration */}
        <div className="lg:hidden space-y-3">
          <Link
            to="/recruiter/company-profile"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-xs hover:bg-indigo-700 transition-colors min-h-[44px]"
          >
            View Profile
          </Link>
          <RecruiterMobileHeroIllustration />
        </div>

        {/* Desktop Welcome & Wallet Banner */}
        <div className="hidden lg:flex items-center justify-between bg-white rounded-2xl border border-slate-150 p-6 shadow-xs">
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Welcome back! <span className="text-xl">👋</span>
              </h2>
              <p className="text-sm font-medium text-slate-600 mt-1">
                Here's an overview of your hiring activities and performance.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-150 rounded-xl px-3.5 py-2.5 w-fit">
              <div className="h-8 w-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-black text-indigo-950">{companyName}</p>
                <p className="text-xs font-semibold text-slate-500">Recruiter</p>
              </div>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="h-28 w-72 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 p-5 text-white flex items-center justify-between shadow-lg shadow-indigo-600/15">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white/90 uppercase tracking-wider block">Wallet Balance</span>
              <span className="text-2xl font-black tracking-tight text-white block">
                {walletBalanceFormatted}
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Desktop Metric Cards (6 columns) */}
        <div className="hidden lg:grid grid-cols-6 gap-4">
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

        {/* Mobile Metric Cards (2 columns) */}
        <div className="lg:hidden grid grid-cols-2 gap-3">
          <RecruiterMetricCard 
            title="ACTIVE JOBS" 
            value={metrics.active_jobs} 
            icon={Briefcase} 
            iconBgClass="bg-indigo-50"
            colorClass="text-indigo-600"
          />
          <RecruiterMetricCard 
            title="APPLICATIONS" 
            value={metrics.total_applications} 
            icon={FileText} 
            iconBgClass="bg-red-50"
            colorClass="text-red-500"
            valueColorClass="text-red-600"
          />
          <RecruiterMetricCard 
            title="SHORTLISTED" 
            value={metrics.shortlisted} 
            icon={UserCheck} 
            iconBgClass="bg-emerald-50"
            colorClass="text-emerald-600"
            valueColorClass="text-emerald-600"
          />
          <RecruiterMetricCard 
            title="PENDING" 
            value={metrics.pending} 
            icon={CheckCircle} 
            iconBgClass="bg-blue-50"
            colorClass="text-blue-500"
          />
          <RecruiterMetricCard 
            title="INTERVIEWS" 
            value={metrics.interviews} 
            icon={Calendar} 
            iconBgClass="bg-emerald-50"
            colorClass="text-emerald-600"
            valueColorClass="text-emerald-600"
          />
          <RecruiterMetricCard 
            title="HIRED" 
            value={metrics.hired} 
            icon={CheckCircle} 
            iconBgClass="bg-blue-50"
            colorClass="text-blue-500"
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
              <div className="divide-y divide-slate-100 space-y-3 pt-1">
                {data.recent_applications.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {item.candidate_initials || "C"}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-805">{item.candidate_name}</p>
                        <p className="text-[11px] font-bold text-slate-450">Applied for <span className="text-indigo-600">{item.job_title}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        title="Shortlist applicant"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button 
                        type="button" 
                        title="Reject applicant"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>
    </RecruiterLayout>
  );
}
