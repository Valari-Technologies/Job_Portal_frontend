import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Download, AlertCircle, RefreshCw } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';
import { getActivities } from '../../components/superadmin/activity/activityData';

export default function ActivityLogsPage() {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters toggle
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRole, setSelectedRole] = useState('All Role');
  const [selectedModule, setSelectedModule] = useState('All Module');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load on mount
  useEffect(() => {
    setActivities(getActivities());
  }, []);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('All Role');
    setSelectedModule('All Module');
    setCurrentPage(1);
  };

  // Export currently filtered activity data as CSV
  const handleExportCSV = () => {
    if (filteredActivities.length === 0) {
      alert('No activity log records available to export.');
      return;
    }
    const headers = ['User', 'Role', 'Action', 'Module', 'Date & Time', 'IP Address', 'Result'];
    const rows = filteredActivities.map(a => [
      a.user,
      a.role,
      a.action,
      a.module,
      a.dateTime,
      a.ipAddress,
      a.result
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredActivities = activities.filter(a => {
    const matchesSearch = a.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.module.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'All Role' || a.role === selectedRole;
    const matchesModule = selectedModule === 'All Module' || a.module === selectedModule;

    return matchesSearch && matchesRole && matchesModule;
  });

  const totalItems = filteredActivities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Activity & Roles</h2>
      </div>

      {/* Main glass wrapper matching Organizations style */}
      <div className="bg-white/[0.05] backdrop-blur-[2px] rounded-3xl border border-white/20 shadow-none p-6 flex flex-col gap-6">
        
        {/* Search & Actions Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search activity..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden focus:border-[#8CC63F] transition-colors"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={(e) => { e.stopPropagation(); setShowFilters(!showFilters); }}
              className={`flex items-center justify-center gap-2 border px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                showFilters 
                  ? 'bg-slate-100 border-slate-300 text-slate-800' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
            </button>
            
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Bar */}
        {showFilters && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50 flex flex-wrap items-center gap-3 animate-fadeIn">
            <CustomSelect
              value={selectedRole}
              onChange={(val) => { setSelectedRole(val); setCurrentPage(1); }}
              options={['All Role', 'Super Admin', 'HR', 'Candidate']}
              placeholder="All Role"
              buttonClassName="w-36 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto"
              accentColor="#8CC63F"
            />

            <CustomSelect
              value={selectedModule}
              onChange={(val) => { setSelectedModule(val); setCurrentPage(1); }}
              options={['All Module', 'Organizations', 'Jobs', 'Applications', 'Users']}
              placeholder="All Module"
              buttonClassName="w-36 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto"
              accentColor="#8CC63F"
            />

            {(searchTerm || selectedRole !== 'All Role' || selectedModule !== 'All Module') && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-black text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer ml-auto"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        )}

        {/* Activity Table */}
        {paginatedActivities.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100/50">
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Module</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/30 text-sm font-bold text-slate-700">
                {paginatedActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* User */}
                    <td className="px-6 py-6 text-slate-800 font-extrabold">{act.user}</td>

                    {/* Role */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{act.role}</td>

                    {/* Action */}
                    <td className="px-6 py-6 font-semibold text-slate-600">{act.action}</td>

                    {/* Module */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{act.module}</td>

                    {/* Date & Time */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{act.dateTime}</td>

                    {/* IP Address */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{act.ipAddress}</td>

                    {/* Result */}
                    <td className="px-6 py-6 text-center">
                      <span className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider bg-emerald-50 text-emerald-600">
                        {act.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center gap-3">
            <AlertCircle className="w-12 h-12 text-slate-300" />
            <h4 className="text-base font-black text-slate-700">No activity logs found</h4>
            <p className="text-xs font-bold text-slate-400 max-w-xs">
              Try adjusting your search or filters to locate specific workspace records.
            </p>
          </div>
        )}

        {/* Custom Pagination Footer with count: Showing 1 to 5 of 50 entries */}
        {filteredActivities.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-100/50">
            <span className="text-xs font-bold text-slate-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of 50 entries
            </span>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 text-xs font-bold cursor-pointer"
              >
                &lt;
              </button>
              
              <button 
                onClick={() => setCurrentPage(1)}
                className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === 1 
                    ? 'bg-[#8CC63F] text-white shadow-xs' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                1
              </button>
              <button 
                onClick={() => setCurrentPage(2)}
                className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === 2 
                    ? 'bg-[#8CC63F] text-white shadow-xs' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                2
              </button>
              <button 
                onClick={() => setCurrentPage(3)}
                className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === 3 
                    ? 'bg-[#8CC63F] text-white shadow-xs' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                3
              </button>
              <span className="text-xs font-bold text-slate-400 select-none">...</span>
              <button 
                onClick={() => setCurrentPage(9)}
                className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === 9 
                    ? 'bg-[#8CC63F] text-white shadow-xs' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                9
              </button>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, 9))}
                disabled={currentPage === 9}
                className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 text-xs font-bold cursor-pointer"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
