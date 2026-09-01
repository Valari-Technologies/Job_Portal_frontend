import { useState, useEffect } from 'react';
import AdminMetricCard from '../../components/admin/adminDashboard/AdminMetricCard';
import AdminRecentActivity from '../../components/admin/adminDashboard/AdminRecentActivity';
import AdminQuickActions from '../../components/admin/adminDashboard/AdminQuickActions';
import { getAdminDashboardData } from '../../services/admin/adminDashboardService';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    getAdminDashboardData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const handleQuickAction = (actionId) => {
    // Keep it safe UI actions only, no fake mock success state overrides.
    console.log(`Action trigger initiated: ${actionId}`);
  };

  if (loading || !data) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center bg-slate-50 font-sans text-xs text-slate-500">
        Loading Admin Dashboard...
      </div>
    );
  }

  const { recruiter_metrics, recent_activity } = data;

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn font-sans pb-8">
      
      {/* Dashboard Title Heading */}
      <div>
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Dashboard</h1>
      </div>

      {/* 4 Metric cards Grid rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <AdminMetricCard 
          title="Total Recruiters" 
          value={recruiter_metrics.total_recruiters.toLocaleString()} 
          changeText={recruiter_metrics.total_change_percent} 
          isNegative={false}
        />
        <AdminMetricCard 
          title="Pending Activations" 
          value={recruiter_metrics.pending_activations.toLocaleString()} 
          changeText={recruiter_metrics.pending_change_percent} 
          isNegative={false}
        />
        <AdminMetricCard 
          title="Active Recruiters" 
          value={recruiter_metrics.active_recruiters.toLocaleString()} 
          changeText={recruiter_metrics.active_change_percent} 
          isNegative={false}
        />
        <AdminMetricCard 
          title="Suspended" 
          value={recruiter_metrics.suspended_recruiters.toLocaleString()} 
          changeText={recruiter_metrics.suspended_change_percent} 
          isNegative={true}
        />
      </div>

      {/* Recent Activity & Quick Actions layout details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 flex flex-col">
          <AdminRecentActivity activities={recent_activity} />
        </div>
        <div className="flex flex-col">
          <AdminQuickActions onActionClick={handleQuickAction} />
        </div>
      </div>

    </div>
  );
}
