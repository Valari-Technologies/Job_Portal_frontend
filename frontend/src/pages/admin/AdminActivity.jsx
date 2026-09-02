import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { getAdminActivities } from '../../services/admin/adminActivityService';

export default function AdminActivity() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    getAdminActivities().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center bg-slate-50 font-sans text-sm font-medium text-slate-600">
        Loading Activity Logs...
      </div>
    );
  }

  const { results, pagination } = data;
  const hasData = results && results.length > 0;

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn font-sans pb-8">
      
      {/* Title & Toolbar Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Activity</h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            View your administrative actions and audit history
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Search className="h-4 w-4" />
            </span>
            <input 
              type="text"
              placeholder="Search activity..."
              className="rounded-xl border border-slate-200 py-2.5 pl-9.5 pr-4 text-sm font-medium text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none placeholder-slate-400 w-full sm:w-[220px]"
            />
          </div>

          <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4.5 py-2.5 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]">
            <Filter className="h-4 w-4 text-slate-600" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Table panel card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        
        {/* Table content body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">DATE & TIME</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">ADMIN</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">ACTION</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">ENTITY</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">DETAILS</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-600 tracking-wider">IP ADDRESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!hasData ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="max-w-md mx-auto space-y-2 px-6">
                      <h4 className="text-lg font-bold text-slate-900">No activity yet</h4>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        Your administrative actions will appear here when activity data is available.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                results.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap font-mono">
                      {act.occurred_at}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{act.actor_display_name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-indigo-700">{act.action_label}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{act.entity_display_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{act.details}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500 font-mono">{act.ip_address || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination element */}
        {pagination && hasData && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Showing {((pagination.page - 1) * pagination.page_size) + 1} to {Math.min(pagination.page * pagination.page_size, pagination.total_count)} of {pagination.total_count} entries
            </span>
          </div>
        )}

      </div>

    </div>
  );
}
