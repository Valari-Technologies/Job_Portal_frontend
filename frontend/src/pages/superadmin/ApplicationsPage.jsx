import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Download, Eye, ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';
import { getApplications, saveApplications } from '../../components/superadmin/applications/appsData';

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters toggle
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedStage, setSelectedStage] = useState('All Stage');

  // Active dropdown actions menu
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load on mount
  useEffect(() => {
    setApps(getApplications());
  }, []);

  // Save list helper
  const handleSave = (updatedList) => {
    setApps(updatedList);
    saveApplications(updatedList);
  };

  // Change stage action
  const handleChangeStage = (id, newStage) => {
    const updated = apps.map(a => {
      if (a.id === id) {
        return { ...a, currentStage: newStage };
      }
      return a;
    });
    handleSave(updated);
    setActiveMenuId(null);
  };

  // Reject action
  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      const updated = apps.map(a => {
        if (a.id === id) {
          return { ...a, currentStage: 'Rejected', status: 'Inactive' };
        }
        return a;
      });
      handleSave(updated);
      setActiveMenuId(null);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
    setSelectedStage('All Stage');
    setCurrentPage(1);
  };

  // Export currently filtered applications as CSV
  const handleExportCSV = () => {
    if (filteredApps.length === 0) {
      alert('No application records available to export.');
      return;
    }
    const headers = ['Application ID', 'Candidate', 'Job', 'Organization', 'Applied Date', 'Current Stage', 'Status', 'HR Recruiter'];
    const rows = filteredApps.map(a => [
      a.id,
      a.candidate,
      a.job,
      a.organization,
      a.appliedDate,
      a.currentStage,
      a.status,
      a.hrRecruiter
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `applications_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredApps = apps.filter(a => {
    const matchesSearch = a.candidate.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.job.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'All Status' || a.status === selectedStatus;
    const matchesStage = selectedStage === 'All Stage' || a.currentStage === selectedStage;

    return matchesSearch && matchesStatus && matchesStage;
  });

  const totalItems = filteredApps.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = filteredApps.slice(startIndex, startIndex + itemsPerPage);

  // Close menus on clicking outside
  useEffect(() => {
    const handleClose = () => setActiveMenuId(null);
    document.addEventListener('click', handleClose);
    return () => document.removeEventListener('click', handleClose);
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Applications</h2>
      </div>

      {/* Main glass wrapper matching Organizations style */}
      <div className="bg-white/[0.05] backdrop-blur-[2px] rounded-3xl border border-white/20 shadow-none p-6 flex flex-col gap-6">
        
        {/* Search & Actions Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Applications Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search application..."
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden focus:border-[#8CC63F] transition-colors"
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
              className="flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer"
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
              value={selectedStatus}
              onChange={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
              options={['All Status', 'Active', 'Inactive']}
              placeholder="All Status"
              buttonClassName="w-36 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto"
              accentColor="#8CC63F"
            />

            <CustomSelect
              value={selectedStage}
              onChange={(val) => { setSelectedStage(val); setCurrentPage(1); }}
              options={['All Stage', 'New', 'Under Review', 'Shortlisted', 'Assessment', 'Interview', 'Selected', 'Rejected']}
              placeholder="All Stage"
              buttonClassName="w-36 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto"
              accentColor="#8CC63F"
            />

            {(searchTerm || selectedStatus !== 'All Status' || selectedStage !== 'All Stage') && (
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

        {/* Applications Table */}
        {paginatedApps.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100/50">
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Application ID</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Job</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Applied Date</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Current Stage</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">HR / Recruiter</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/30 text-sm font-bold text-slate-700">
                {paginatedApps.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* ID */}
                    <td className="px-6 py-6 text-slate-800 font-extrabold">{a.id}</td>

                    {/* Candidate */}
                    <td className="px-6 py-6 font-semibold text-slate-600">{a.candidate}</td>

                    {/* Job */}
                    <td className="px-6 py-6 font-semibold text-slate-500 max-w-[200px] leading-tight">{a.job}</td>

                    {/* Organization */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{a.organization}</td>

                    {/* Applied Date */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{a.appliedDate}</td>

                    {/* Current Stage */}
                    <td className="px-6 py-6">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-black uppercase ${
                        a.currentStage === 'New' 
                          ? 'bg-blue-50 text-blue-600'
                          : a.currentStage === 'Under Review'
                          ? 'bg-amber-50 text-amber-600'
                          : a.currentStage === 'Shortlisted'
                          ? 'bg-emerald-50 text-emerald-600'
                          : a.currentStage === 'Rejected'
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {a.currentStage}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-6 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider ${
                        a.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-rose-50 text-rose-600'
                      }`}>
                        {a.status}
                      </span>
                    </td>

                    {/* HR Recruiter */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{a.hrRecruiter}</td>

                    {/* Actions Column (Figma [ Eye | v ] Pill dropdown style) */}
                    <td className="px-6 py-6 text-center relative">
                      <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs divide-x divide-slate-200">
                        <button
                          onClick={() => navigate(`/superadmin-dashboard/candidates`)}
                          className="px-2.5 py-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title="View Application Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setActiveMenuId(activeMenuId === a.id ? null : a.id); 
                            }}
                            className="px-2 py-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer block"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>

                          {/* Menu Popup */}
                          {activeMenuId === a.id && (
                            <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-30 text-left">
                              <button
                                onClick={() => handleChangeStage(a.id, 'Under Review')}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 font-bold block"
                              >
                                Stage: Review
                              </button>
                              <button
                                onClick={() => handleChangeStage(a.id, 'Shortlisted')}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 font-bold block"
                              >
                                Stage: Shortlist
                              </button>
                              <button
                                onClick={() => handleChangeStage(a.id, 'Interview')}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 font-bold block"
                              >
                                Stage: Interview
                              </button>
                              <button
                                onClick={() => handleReject(a.id)}
                                className="w-full text-left px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-50 font-bold block"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center gap-3">
            <AlertCircle className="w-12 h-12 text-slate-300" />
            <h4 className="text-base font-black text-slate-700">No applications found</h4>
            <p className="text-xs font-bold text-slate-400 max-w-xs">
              Try adjusting your search or filters to locate specific workspace records.
            </p>
          </div>
        )}

        {/* Custom Pagination Footer matching Figma: 1 2 3 4 5 ... 9 */}
        {filteredApps.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-100/50">
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
            <button 
              onClick={() => setCurrentPage(4)}
              className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                currentPage === 4 
                  ? 'bg-[#8CC63F] text-white shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              4
            </button>
            <button 
              onClick={() => setCurrentPage(5)}
              className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                currentPage === 5 
                  ? 'bg-[#8CC63F] text-white shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              5
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
        )}
      </div>

    </div>
  );
}
