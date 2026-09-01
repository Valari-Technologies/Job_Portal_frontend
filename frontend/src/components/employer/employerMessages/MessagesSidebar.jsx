import { Search, ChevronDown, MessageSquare } from 'lucide-react';

export default function MessagesSidebar({
  conversationsList = [],
  searchQuery,
  setSearchQuery,
  jobFilter,
  setJobFilter,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="rounded-2xl border border-slate-150 bg-white shadow-2xs p-5 flex flex-col space-y-4">
      <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 block font-sans">Application messages</h3>
      
      {/* Search Input bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search className="h-4.5 w-4.5" />
        </span>
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Sub Filter selectors (UI only) */}
      <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 font-sans">
        <div className="relative">
          <select 
            value={jobFilter} 
            onChange={(e) => setJobFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
          >
            <option value="all">All jobs</option>
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-400">
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="relative">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
          >
            <option value="all">All status</option>
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-400">
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Conversation Rows Box */}
      {conversationsList.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center py-16 text-center space-y-4 font-sans">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-400">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div className="space-y-1 px-4">
            <h4 className="text-sm font-extrabold text-slate-850">No application messages yet</h4>
            <p className="text-xs font-bold text-slate-455 max-w-[200px] mx-auto leading-normal">
              Messages from candidates will appear here when they reply to an application or interview update.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Conversations rows list will go here in the future */}
        </div>
      )}
    </div>
  );
}
