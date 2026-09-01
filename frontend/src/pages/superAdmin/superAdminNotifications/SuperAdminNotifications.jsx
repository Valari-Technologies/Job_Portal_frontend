import { useState } from 'react';
import NotificationsTable from '../../../components/superAdmin/superAdminNotifications/NotificationsTable';
import NotificationDetailsPanel from '../../../components/superAdmin/superAdminNotifications/NotificationDetailsPanel';

// TODO: Connect Django API:
// GET /api/admin/notifications/
// Response should return paginated notification records from the notifications table,
// joined safely with the user role/name where permitted.

export default function SuperAdminNotifications() {
  const [selectedNotification, setSelectedNotification] = useState(null);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title Header */}
      <div className="border-b border-slate-150 pb-5">
        <h1 className="text-3xl font-black text-slate-805 tracking-tight">Notifications</h1>
        <p className="text-base font-bold text-slate-500 mt-1.5">
          View important updates delivered to candidates and employers.
        </p>
      </div>

      {/* Toolbar Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4.5 w-4.5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search notifications by title or message…"
            className="rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none"
            disabled
          />
        </div>

        <select
          disabled
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-450 cursor-not-allowed"
        >
          <option>Notification type</option>
        </select>

        <select
          disabled
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-450 cursor-not-allowed"
        >
          <option>All recipients</option>
        </select>

        <select
          disabled
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-450 cursor-not-allowed"
        >
          <option>All status</option>
        </select>
      </div>

      {/* Grid container layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side Table */}
        <div className="lg:col-span-2 space-y-6">
          <NotificationsTable 
            notifications={[]}
            selectedNotification={selectedNotification}
            onSelectNotification={setSelectedNotification}
          />
          <div className="text-sm font-bold text-slate-500">
            Showing 0 of 0 notifications
          </div>
        </div>

        {/* Right Side details */}
        <div className="space-y-6">
          <NotificationDetailsPanel 
            selectedNotification={selectedNotification}
          />
        </div>
      </div>
    </div>
  );
}
