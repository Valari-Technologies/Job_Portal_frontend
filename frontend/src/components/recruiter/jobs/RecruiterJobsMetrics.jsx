import { Briefcase, FileText, Calendar } from 'lucide-react';
import RecruiterJobMetricCard from './RecruiterJobMetricCard';

export default function RecruiterJobsMetrics({ metrics }) {
  const activeJobs = metrics?.active_jobs || 0;
  const totalApps = metrics?.total_applications || 0;
  const interviews = metrics?.interviews_scheduled || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <RecruiterJobMetricCard 
        title="Active Jobs" 
        value={activeJobs} 
        icon={Briefcase}
        accentBorderClass="border-l-4 border-indigo-600"
        iconBgClass="bg-indigo-50"
        iconColorClass="text-indigo-600"
      />
      <RecruiterJobMetricCard 
        title="Total Applications" 
        value={totalApps} 
        icon={FileText}
        accentBorderClass="border-l-4 border-emerald-500"
        iconBgClass="bg-emerald-50"
        iconColorClass="text-emerald-600"
      />
      <RecruiterJobMetricCard 
        title="Interviews Scheduled" 
        value={interviews} 
        icon={Calendar}
        accentBorderClass="border-l-4 border-slate-700"
        iconBgClass="bg-slate-100"
        iconColorClass="text-slate-700"
      />
    </div>
  );
}
