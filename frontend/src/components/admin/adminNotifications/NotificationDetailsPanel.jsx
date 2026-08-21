export default function NotificationDetailsPanel({ selectedNotification }) {
  return (
    <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs">
      <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 mb-6">Notification details</h3>

      {selectedNotification ? (
        <div className="space-y-5 text-sm">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-teal-50 border border-teal-100 text-teal-600 shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-800 leading-snug">{selectedNotification.title}</h4>
              <span className="text-xs font-bold text-slate-455 uppercase">
                {selectedNotification.is_read ? 'Read' : 'Unread'}
              </span>
            </div>
          </div>

          <div className="space-y-3.5 border-t border-slate-100 pt-4.5">
            <div className="space-y-1">
              <span className="text-xs font-black text-slate-450 uppercase block">Message</span>
              <p className="font-bold text-slate-700 leading-relaxed">{selectedNotification.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-450 uppercase block">Recipient Type</span>
                <span className="font-bold text-slate-800">{selectedNotification.recipient_type}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-450 uppercase block">Notification Type</span>
                <span className="font-bold text-slate-800">{selectedNotification.notification_type}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-450 uppercase block">Reference Type</span>
                <span className="font-bold text-slate-800">{selectedNotification.reference_type || 'None'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-450 uppercase block">Reference ID</span>
                <span className="font-bold text-slate-800">{selectedNotification.reference_id || 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center space-y-4">
          <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-base font-extrabold text-slate-800">Select a notification</h4>
            <p className="text-sm font-bold text-slate-500 max-w-xs mx-auto leading-normal">
              Choose a notification from the activity list to view its message and related record.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
