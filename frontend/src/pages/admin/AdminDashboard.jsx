import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMetricCard from '../../components/admin/adminDashboard/AdminMetricCard';
import AdminRecentActivity from '../../components/admin/adminDashboard/AdminRecentActivity';
import AdminQuickActions from '../../components/admin/adminDashboard/AdminQuickActions';
import { getAdminDashboardData } from '../../services/admin/adminDashboardService';
import { getAdminRecruiters } from '../../services/admin/adminRecruitersService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchDashboard = () => {
    getAdminDashboardData().then((res) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleExportReport = async () => {
    try {
      const recruitersData = await getAdminRecruiters();
      const list = recruitersData?.results || [];
      if (!list.length) {
        alert("No recruiters available to export yet.");
        return;
      }
      const headers = ["ID", "Full Name", "Company Name", "Email", "Phone", "Designation", "Industry", "Account Status"];
      const rows = list.map(r => [
        `"${r.id}"`,
        `"${(r.full_name || '').replace(/"/g, '""')}"`,
        `"${(r.company_name || '').replace(/"/g, '""')}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        `"${(r.designation || '').replace(/"/g, '""')}"`,
        `"${(r.industry || '').replace(/"/g, '""')}"`,
        `"${(r.account_status || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `recruiters_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export report error:", err);
      alert("Failed to export report.");
    }
  };

  const handleQuickAction = (actionId) => {
    if (actionId === 'create_recruiter') {
      navigate('/admin/create-recruiter');
    } else if (actionId === 'view_recruiters') {
      navigate('/admin/recruiters');
    } else if (actionId === 'export_report') {
      handleExportReport();
    }
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
      <div className="flex items-center justify-between">
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <button
          onClick={() => {
            setLoading(true);
            fetchDashboard();
          }}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          ↻ Refresh
        </button>
      </div>

      {/* 3 Metric cards Grid rows (Total, Active, Suspended) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <AdminMetricCard 
          title="Total Recruiters" 
          value={recruiter_metrics.total_recruiters.toLocaleString()} 
        />
        <AdminMetricCard 
          title="Active Recruiters" 
          value={recruiter_metrics.active_recruiters.toLocaleString()} 
        />
        <AdminMetricCard 
          title="Suspended" 
          value={recruiter_metrics.suspended_recruiters.toLocaleString()} 
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
