export default function NotificationsTable({ 
  notifications = [], 
  selectedNotification, 
  onSelectNotification 
}) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Notification</th>
              <th className="px-6 py-4">Recipient type</th>
              <th className="px-6 py-4">Related record</th>
              <th className="px-6 py-4">Read status</th>
              <th className="px-6 py-4">Created at</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-800">No notifications yet</h3>
                      <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
                        Notification activity will appear here when candidates and employers receive updates from the platform.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              notifications.map((n) => (
                <tr 
                  key={n.id} 
                  onClick={() => onSelectNotification && onSelectNotification(n)}
                  className={`cursor-pointer hover:bg-slate-50/50 ${selectedNotification?.id === n.id ? 'bg-teal-50/20' : ''}`}
                >
                  <td className="px-6 py-4 font-bold text-slate-850">
                    <div>{n.title}</div>
                    <div className="text-xs font-normal text-slate-500 truncate max-w-xs">{n.message}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-705">{n.recipient_type || 'User'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {n.reference_type ? `${n.reference_type} #${n.reference_id}` : 'None'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold border ${
                      n.is_read 
                        ? 'border-slate-200 bg-slate-50 text-slate-600' 
                        : 'border-teal-200 bg-teal-50 text-teal-700'
                    }`}>
                      {n.is_read ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">{n.created_at}</td>
                  <td className="px-6 py-4 text-right">...</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
