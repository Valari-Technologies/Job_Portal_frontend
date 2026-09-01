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
      <div className="flex h-[300px] w-full items-center justify-center bg-slate-50 font-sans text-xs text-slate-500">
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
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Recruiters</h1>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4.5 py-2.5 bg-white text-[14px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
            <Filter className="h-4 w-4 text-slate-500" />
            <span>Filters</span>
          </button>
          <button 
            onClick={() => navigate('/admin/recruiters/create')}
            className="flex items-center gap-2 rounded-lg bg-[#4A1DDF] hover:bg-[#3B15CA] px-4.5 py-2.5 text-[14px] font-semibold text-white transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Recruiter</span>
          </button>
        </div>
      </div>

      {/* Table Panel Card container */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        
        {/* Status Tabs if backend has data */}
        {status_counts && hasData && (
          <div className="border-b border-slate-100 flex items-center overflow-x-auto px-6 py-2.5 gap-6">
            {['all', 'pending_activation', 'active', 'inactive', 'suspended'].map((tab) => {
              const label = tab === 'all' ? 'All' : tab.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
              const count = status_counts[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 py-2 text-[14px] font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'border-[#4A1DDF] text-slate-900 font-semibold' 
                      : 'border-transparent text-slate-500 hover:text-slate-750'
                  }`}
                >
                  <span>{label}</span>
                  {count !== undefined && (
                    <span className="h-4.5 px-1.5 min-w-4.5 flex items-center justify-center rounded-full bg-slate-100 text-[10px] font-black text-slate-500 leading-none">
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
                <th className="px-6 py-3.5 text-[12px] font-semibold text-slate-500 tracking-wider">NAME</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-slate-500 tracking-wider">COMPANY</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-slate-500 tracking-wider">EMAIL</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-slate-500 tracking-wider">PHONE</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-slate-500 tracking-wider">INDUSTRY</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-slate-500 tracking-wider">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!hasData ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="max-w-md mx-auto space-y-2 px-6">
                      <h4 className="text-[16px] font-semibold text-slate-800">No recruiters yet</h4>
                      <p className="text-[13px] font-normal text-slate-500 leading-normal">
                        Employer accounts created by you will appear here after backend data is available.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                results.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4.5 text-[14px] font-medium text-slate-805">{rec.full_name}</td>
                    <td className="px-6 py-4.5 text-[14px] font-normal text-slate-550">{rec.company_name}</td>
                    <td className="px-6 py-4.5 text-[14px] font-normal text-slate-550">{rec.email}</td>
                    <td className="px-6 py-4.5 text-[14px] font-normal text-slate-550 whitespace-nowrap">{rec.phone}</td>
                    <td className="px-6 py-4.5 text-[14px] font-normal text-slate-550">{rec.industry}</td>
                    <td className="px-6 py-4.5 text-[14px] font-normal text-slate-550">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold tracking-wide ${
                        rec.account_status === 'Active' 
                          ? 'bg-green-50 text-green-700'
                          : rec.account_status === 'Pending Activation'
                          ? 'bg-amber-50 text-amber-700'
                          : rec.account_status === 'Suspended'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-slate-100 text-slate-600'
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
          <div className="px-6 py-4.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[13px] font-medium text-slate-500">
              Showing {((pagination.page - 1) * pagination.page_size) + 1} to {Math.min(pagination.page * pagination.page_size, pagination.total_count)} of {pagination.total_count} entries
            </span>

            <div className="flex items-center gap-1">
              {/* Pagination lists layout renders */}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
