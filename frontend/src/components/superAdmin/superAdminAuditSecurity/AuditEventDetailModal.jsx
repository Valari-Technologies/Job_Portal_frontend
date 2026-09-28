import React from 'react';
import { X, ShieldCheck, ShieldAlert, Clock, User, Target, Info, Globe } from 'lucide-react';

export default function AuditEventDetailModal({ event, onClose }) {
  if (!event) return null;

  const isSuccess = event.outcome === 'SUCCESS' || event.outcome === 'APPROVED';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-slate-150 space-y-5 relative max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl ${isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {isSuccess ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Audit Event Details</h3>
              <p className="text-xs font-semibold text-slate-400">ID: #{event.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 text-sm">
          {/* Action & Outcome */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Action</span>
              <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">{event.action}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Outcome</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold mt-1 ${
                isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {event.outcome}
              </span>
            </div>
          </div>

          {/* Actor & Timestamp */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start space-x-3">
              <User className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-400 block">Actor</span>
                <span className="font-bold text-slate-700">{event.actor_name}</span>
                {event.actor_email && event.actor_name !== event.actor_email && (
                  <span className="text-xs text-slate-450 block">{event.actor_email}</span>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-400 block">Timestamp</span>
                <span className="font-bold text-slate-700">{formatDate(event.timestamp)}</span>
              </div>
            </div>

            {event.target_type && (
              <div className="flex items-start space-x-3">
                <Target className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-400 block">Target</span>
                  <span className="font-bold text-slate-700">
                    {event.target_type} {event.target_id ? `(ID: ${event.target_id})` : ''}
                  </span>
                  {event.target_repr && (
                    <span className="text-xs text-slate-500 block font-medium">{event.target_repr}</span>
                  )}
                </div>
              </div>
            )}

            {event.ip_address && (
              <div className="flex items-start space-x-3">
                <Globe className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-400 block">IP Address</span>
                  <span className="font-mono text-xs font-semibold text-slate-700">{event.ip_address}</span>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <Info className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-400 block">Description</span>
                <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
                  {event.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-extrabold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
