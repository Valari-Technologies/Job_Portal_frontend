import { useState, useEffect } from 'react';
import { getAdminNotifications } from '../../services/admin/adminNotificationsService';

export default function AdminNotifications() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    getAdminNotifications().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center bg-slate-50 font-sans text-xs text-slate-500">
        Loading Notifications...
      </div>
    );
  }

  const { results, pagination } = data;
  const hasData = results && results.length > 0;

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn font-sans pb-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Notifications</h1>
        <p className="text-[13px] font-normal text-slate-500 mt-1">
          Stay updated on recruiter accounts and important Admin activity.
        </p>
      </div>

      {/* Main card box panel */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden max-w-4xl">
        
        {/* Toggle navigation categories tabs if backend has data */}
        {hasData && (
          <div className="border-b border-slate-100 flex items-center px-6 py-2.5 gap-6">
            <button 
              onClick={() => setActiveTab('all')}
              className={`py-2 text-[14px] font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'all' ? 'border-[#4A1DDF] text-slate-900 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-750'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab('unread')}
              className={`py-2 text-[14px] font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'unread' ? 'border-[#4A1DDF] text-slate-900 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-750'
              }`}
            >
              Unread
            </button>
          </div>
        )}

        {/* Notifications list element */}
        <div className="divide-y divide-slate-100">
          {!hasData ? (
            <div className="py-20 text-center">
              <div className="max-w-md mx-auto space-y-2 px-6">
                <h4 className="text-[16px] font-semibold text-slate-800">No notifications yet</h4>
                <p className="text-[13px] font-normal text-slate-500 leading-normal">
                  New recruiter and account updates will appear here.
                </p>
              </div>
            </div>
          ) : (
            results.map((notif) => (
              <div key={notif.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-start justify-between gap-4">
                {/* Details logic */}
              </div>
            ))
          )}
        </div>

        {/* Pagination element */}
        {pagination && hasData && (
          <div className="px-6 py-4.5 border-t border-slate-100 flex items-center justify-between">
            {/* Renders lists */}
          </div>
        )}

      </div>

    </div>
  );
}
