import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Briefcase, Calendar, MessageSquare } from 'lucide-react';

export default function EmployerFab() {
  const [fabExpanded, setFabExpanded] = useState(false);
  const fabRef = useRef(null);

  // Future Django integration:
  // totalFabNotifications = unread_message_count + pending_interview_response_count
  const unreadMessageCount = 0;
  const pendingInterviewResponseCount = 0;
  
  const totalNotifications = unreadMessageCount + pendingInterviewResponseCount;

  // Handle outside click to close FAB
  useEffect(() => {
    function handleClickOutside(event) {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setFabExpanded(false);
      }
    }
    
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setFabExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={fabRef} className="lg:hidden fixed bottom-20 right-4 z-40 h-16 w-16 md:h-18 md:w-18">
      
      {/* Floating Action Cards Aligned Vertically */}
      {fabExpanded && (
        <div className="absolute bottom-20 right-0 flex flex-col items-end gap-3.5 mb-2 animate-slideUp">
          
          {/* Quick actions label */}
          <div className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs whitespace-nowrap">
            Quick actions
          </div>

          {/* Action: Post a Job */}
          <div className="flex items-center gap-3">
            <span className="bg-white border border-slate-150 text-slate-800 text-sm font-extrabold px-3 py-1.5 rounded-xl shadow-xs whitespace-nowrap">
              Post a job
            </span>
            <button 
              disabled
              className="h-13 w-13 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center shadow-md cursor-not-allowed"
              aria-label="Post a job (disabled until verification)"
            >
              <Briefcase className="h-5.5 w-5.5" />
            </button>
          </div>

          {/* Action: Interviews */}
          <div className="flex items-center gap-3">
            <span className="bg-white border border-slate-150 text-slate-800 text-sm font-extrabold px-3 py-1.5 rounded-xl shadow-xs whitespace-nowrap">
              Interviews
            </span>
            <Link 
              to="/employer/interviews"
              onClick={() => setFabExpanded(false)}
              className="relative h-13 w-13 rounded-full bg-white border border-slate-200 text-blue-600 flex items-center justify-center shadow-md hover:bg-slate-50 transition-colors"
              aria-label="Navigate to Interviews"
            >
              <Calendar className="h-5.5 w-5.5" />
              {pendingInterviewResponseCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {pendingInterviewResponseCount > 9 ? '9+' : pendingInterviewResponseCount}
                </span>
              )}
            </Link>
          </div>

          {/* Action: Messages */}
          <div className="flex items-center gap-3">
            <span className="bg-white border border-slate-150 text-slate-800 text-sm font-extrabold px-3 py-1.5 rounded-xl shadow-xs whitespace-nowrap">
              Messages
            </span>
            <Link 
              to="/employer/messages"
              onClick={() => setFabExpanded(false)}
              className="relative h-13 w-13 rounded-full bg-white border border-slate-200 text-blue-600 flex items-center justify-center shadow-md hover:bg-slate-50 transition-colors"
              aria-label="Navigate to Messages"
            >
              <MessageSquare className="h-5.5 w-5.5" />
              {unreadMessageCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                </span>
              )}
            </Link>
          </div>

        </div>
      )}

      {/* Main Royal Blue FAB Button */}
      <button 
        onClick={() => setFabExpanded(!fabExpanded)}
        className="absolute bottom-0 right-0 h-16 w-16 md:h-18 md:w-18 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Expanded actions menu"
        aria-expanded={fabExpanded}
      >
        <span className="flex items-center justify-center transition-transform duration-200" style={{ transform: fabExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          {fabExpanded ? <X className="h-7 w-7" /> : <Plus className="h-7 w-7" />}
        </span>
        
        {/* Outer overall notification badge */}
        {!fabExpanded && totalNotifications > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white border-2 border-slate-50">
            {totalNotifications > 9 ? '9+' : totalNotifications}
          </span>
        )}
      </button>

    </div>
  );
}
