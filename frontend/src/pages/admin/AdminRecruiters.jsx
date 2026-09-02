import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus } from 'lucide-react';
import { getAdminRecruiters } from '../../services/admin/adminRecruitersService';

export default function AdminRecruiters() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    getAdminRecruiters().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center bg-slate-50 font-sans text-sm font-medium text-slate-600">
        Loading Recruiters...
      </div>
    );
  }

  const { status_counts, results, pagination } = data;

  // Determine if backend data exists dynamically
  const hasData = results && results.length > 0;

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn font-sans pb-8">
      
      {/* Page title header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recruiters</h1>
          <p className="text-sm font-medium text-slate-600 mt-1">Manage recruiter accounts and organization permissions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4.5 py-2.5 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]">
            <Filter className="h-4 w-4 text-slate-600" />
            <span>Filters</span>
          </button>
          <button 
            onClick={() => navigate('/admin/recruiters/create')}
            className="flex items-center gap-2 rounded-xl bg-[#4A1DDF] hover:bg-[#3B15CA] px-4.5 py-2.5 text-sm font-bold text-white transition-colors cursor-pointer min-h-[44px] shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create Recruiter</span>
          </button>
        </div>
      </div>

      {/* Table Panel Card container */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        
        {/* Status Tabs if backend has data */}
        {status_counts && hasData && (
          <div className="border-b border-slate-150 flex items-center overflow-x-auto px-6 py-2.5 gap-6">
            {['all', 'pending_activation', 'active', 'inactive', 'suspended'].map((tab) => {
              const label = tab === 'all' ? 'All' : tab.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
              const count = status_counts[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'border-[#4A1DDF] text-slate-900 font-bold' 
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{label}</span>
                  {count !== undefined && (
                    <span className="h-5 px-2 min-w-5 flex items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Table Element */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">NAME</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">COMPANY</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">EMAIL</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">PHONE</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">INDUSTRY</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!hasData ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="max-w-md mx-auto space-y-2 px-6">
                      <h4 className="text-lg font-bold text-slate-900">No recruiters yet</h4>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        Employer accounts created by you will appear here after backend data is available.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                results.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{rec.full_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{rec.company_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{rec.email}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 whitespace-nowrap">{rec.phone}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{rec.industry}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        rec.account_status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : rec.account_status === 'Pending Activation'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : rec.account_status === 'Suspended'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {rec.account_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination section if backend has data */}
        {pagination && hasData && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Showing {((pagination.page - 1) * pagination.page_size) + 1} to {Math.min(pagination.page * pagination.page_size, pagination.total_count)} of {pagination.total_count} entries
            </span>

            <div className="flex items-center gap-1">
              {/* Pagination controls */}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
