import { MessageSquare, ArrowLeft, Plus } from 'lucide-react';

export default function MessagesChatThread({
  selectedConv,
  setSelectedConv,
}) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white shadow-2xs p-5 flex flex-col justify-between">
      {!selectedConv ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-3.5 font-sans">
          <div className="h-11 w-11 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400">
            <MessageSquare className="h-5.5 w-5.5" />
          </div>
          <div className="space-y-1 px-4">
            <h4 className="text-sm font-extrabold text-slate-800">Select a conversation</h4>
            <p className="text-xs font-bold text-slate-455 max-w-xs mx-auto leading-relaxed">
              Choose an application message to view and reply to the candidate.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 font-sans">
          {/* Mobile back trigger */}
          <button onClick={() => setSelectedConv(null)} className="lg:hidden flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to inbox</span>
          </button>

          {/* Conversation message bubbles container (Future maps) */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            {/* Messages bubble mappings will go here */}
          </div>

          {/* Input composer footer */}
          <div className="flex gap-2 items-center border-t border-slate-100 pt-3">
            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors">
              <Plus className="h-5 w-5" />
            </button>
            <input
              type="text"
              placeholder="Write a message about this application..."
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled
            />
            <button disabled className="rounded-xl bg-slate-100 text-slate-400 font-extrabold px-4 py-2.5 text-sm cursor-not-allowed">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
