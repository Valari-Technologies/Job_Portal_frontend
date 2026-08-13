import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Download, Eye, Edit2, Info, AlertCircle, RefreshCw } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';
import AddJobModal from '../../components/superadmin/jobs/AddJobModal';
import { getJobs, saveJobs } from '../../components/superadmin/jobs/jobsData';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters toggle
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedDept, setSelectedDept] = useState('All Department');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load on mount
  useEffect(() => {
    setJobs(getJobs());
  }, []);

  // Save list helper
  const handleSave = (updatedList) => {
    setJobs(updatedList);
    saveJobs(updatedList);
  };

  // Add / Edit save
  const handleSaveJob = (formData) => {
    let updated;
    if (editingJob) {
      updated = jobs.map(j => j.id === editingJob.id ? { ...j, ...formData } : j);
    } else {
      const nextId = `JOB-${jobs.length + 1001}`;
      const newJob = {
        ...formData,
        id: nextId,
        applicationsCount: 0
      };
      updated = [...jobs, newJob];
    }
    handleSave(updated);
    setIsModalOpen(false);
    setEditingJob(null);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
    setSelectedDept('All Department');
    setCurrentPage(1);
  };

  // Export currently filtered job data as CSV
  const handleExportCSV = () => {
    if (filteredJobs.length === 0) {
      alert('No job records available to export.');
      return;
    }
    const headers = ['Job Title', 'Organization', 'Department', 'Location', 'Posted By', 'Posted Date', 'Closing Date', 'Applications', 'Status'];
    const rows = filteredJobs.map(j => [
      j.title,
      j.organization,
      j.department,
      j.location,
      j.postedBy,
      j.postedDate,
      j.closingDate,
      j.applicationsCount,
      j.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jobs_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'All Status' || job.status === selectedStatus;
    const matchesDept = selectedDept === 'All Department' || job.department === selectedDept;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const totalItems = filteredJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Jobs</h2>
      </div>

      {/* Main glass wrapper matching Organizations style */}
      <div className="bg-white/[0.05] backdrop-blur-[2px] rounded-3xl border border-white/20 shadow-none p-6 flex flex-col gap-6">
        
        {/* Search & Actions Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Jobs Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search jobs..."
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden focus:border-[#8CC63F] transition-colors"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={(e) => { e.stopPropagation(); setShowFilters(!showFilters); }}
              className={`flex items-center justify-center gap-2 border px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
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
              options={['All Status', 'Active', 'Draft', 'Pending Approval', 'Closed']}
              placeholder="All Status"
              buttonClassName="w-36 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto"
              accentColor="#8CC63F"
            />

            <CustomSelect
              value={selectedDept}
              onChange={(val) => { setSelectedDept(val); setCurrentPage(1); }}
              options={['All Department', 'Engineering', 'Product', 'Analytics', 'Design', 'Marketing']}
              placeholder="All Department"
              buttonClassName="w-36 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto"
              accentColor="#8CC63F"
            />

            {(searchTerm || selectedStatus !== 'All Status' || selectedDept !== 'All Department') && (
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

        {/* Jobs Table */}
        {paginatedJobs.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100/50">
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Posted By</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Posted Date</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Closing Date</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Applications</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/30 text-sm font-bold text-slate-700">
                {paginatedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* Job Title */}
                    <td className="px-6 py-6 text-slate-800 font-extrabold max-w-[200px] leading-tight">
                      {job.title}
                    </td>

                    {/* Organization */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{job.organization}</td>

                    {/* Department */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{job.department}</td>

                    {/* Location */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{job.location}</td>

                    {/* Posted By */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{job.postedBy}</td>

                    {/* Posted Date */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{job.postedDate}</td>

                    {/* Closing Date */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{job.closingDate}</td>

                    {/* Applications */}
                    <td className="px-6 py-6 text-center font-semibold text-slate-500">{job.applicationsCount}</td>

                    {/* Status */}
                    <td className="px-6 py-6 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider ${
                        job.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : job.status === 'Draft'
                          ? 'bg-slate-100 text-slate-500'
                          : job.status === 'Pending Approval'
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {job.status}
                      </span>
                    </td>

                    {/* Actions Column (horizontal View / Edit) */}
                    <td className="px-6 py-6 text-center">
                      <div className="flex items-center gap-3.5 justify-center">
                        <button
                          onClick={() => alert(`Job Details:\nTitle: ${job.title}\nDescription: ${job.description || 'No description provided.'}`)}
                          className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setEditingJob(job); setIsModalOpen(true); }}
                          className="text-slate-400 hover:text-[#8CC63F] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
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
            <h4 className="text-base font-black text-slate-700">No jobs found</h4>
            <p className="text-xs font-bold text-slate-400 max-w-xs">
              Try adjusting your search or filters to locate specific workspace records.
            </p>
          </div>
        )}

        {/* Custom Pagination Footer matching Figma: 1 2 3 4 5 ... 9 */}
        {filteredJobs.length > 0 && (
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

        {/* Bottom contextual information bar */}
        <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-amber-500 shrink-0" />
            <span className="text-sm font-semibold text-amber-800">
              You are viewing jobs from TechNova Inc. managed by John Doe (HR)
            </span>
          </div>
          <button 
            onClick={() => alert('Returning to view all workspace job listings...')}
            className="text-sm font-black text-[#8CC63F] hover:underline cursor-pointer transition-colors"
          >
            Return to All Jobs
          </button>
        </div>

      </div>

      {/* Creation Modal */}
      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingJob(null); }}
        onSave={handleSaveJob}
        editingJob={editingJob}
      />

    </div>
  );
}
