import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Download, Eye, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';
import { getCandidates, saveCandidates } from '../../components/superadmin/candidates/candidatesData';

export default function CandidatesPage() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters toggle
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedExp, setSelectedExp] = useState('All Experience');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load on mount
  useEffect(() => {
    setCandidates(getCandidates());
  }, []);

  // Save list helper
  const handleSave = (updatedList) => {
    setCandidates(updatedList);
    saveCandidates(updatedList);
  };

  // Delete candidate
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete candidate "${name}"?`)) {
      const updated = candidates.filter(c => c.id !== id);
      handleSave(updated);
    }
  };

  // Toggle status
  const toggleStatus = (id) => {
    const updated = candidates.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return c;
    });
    handleSave(updated);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
    setSelectedExp('All Experience');
    setCurrentPage(1);
  };

  // Export currently filtered candidates as CSV
  const handleExportCSV = () => {
    if (filteredCandidates.length === 0) {
      alert('No candidate records available to export.');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Experience', 'Skills', 'Applications', 'Status', 'Registered Date'];
    const rows = filteredCandidates.map(c => [
      c.name,
      c.email,
      c.phone,
      c.location,
      c.experience,
      c.skills,
      c.applicationsCount,
      c.status,
      c.registeredDate
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.skills.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'All Status' || c.status === selectedStatus;
    const matchesExp = selectedExp === 'All Experience' || c.experience.includes(selectedExp.split(' ')[0]);

    return matchesSearch && matchesStatus && matchesExp;
  });

  const totalItems = filteredCandidates.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Candidates</h2>
      </div>

      {/* Main glass wrapper matching Organizations style */}
      <div className="bg-white/[0.05] backdrop-blur-[2px] rounded-3xl border border-white/20 shadow-none p-6 flex flex-col gap-6">
        
        {/* Search & Actions Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Candidates Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search candidate..."
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
              options={['All Status', 'Active', 'Inactive']}
              placeholder="All Status"
              buttonClassName="w-36 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto"
              accentColor="#8CC63F"
            />

            <CustomSelect
              value={selectedExp}
              onChange={(val) => { setSelectedExp(val); setCurrentPage(1); }}
              options={['All Experience', '2 Yrs', '3 Yrs', '4 Yrs', '5 Yrs', '6 Yrs']}
              placeholder="All Experience"
              buttonClassName="w-36 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto"
              accentColor="#8CC63F"
            />

            {(searchTerm || selectedStatus !== 'All Status' || selectedExp !== 'All Experience') && (
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

        {/* Candidates Table */}
        {paginatedCandidates.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100/50">
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Skills</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Applications</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Registered Date</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/30 text-sm font-bold text-slate-700">
                {paginatedCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-6 text-slate-800 font-extrabold">{c.name}</td>

                    {/* Email */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{c.email}</td>

                    {/* Phone */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{c.phone}</td>

                    {/* Location */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{c.location}</td>

                    {/* Experience */}
                    <td className="px-6 py-6 font-semibold text-slate-500 text-center sm:text-left">{c.experience}</td>

                    {/* Skills */}
                    <td className="px-6 py-6 font-semibold text-slate-500 max-w-[200px] truncate">{c.skills}</td>

                    {/* Applications */}
                    <td className="px-6 py-6 text-center font-semibold text-slate-500">{c.applicationsCount}</td>

                    {/* Status */}
                    <td className="px-6 py-6 text-center">
                      <button
                        onClick={() => toggleStatus(c.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                          c.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100/60' 
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100/60'
                        }`}
                      >
                        {c.status}
                      </button>
                    </td>

                    {/* Registered Date */}
                    <td className="px-6 py-6 font-semibold text-slate-500">{c.registeredDate}</td>

                    {/* Actions Column (horizontal View / Delete) */}
                    <td className="px-6 py-6 text-center">
                      <div className="flex items-center gap-3.5 justify-center">
                        <button
                          onClick={() => navigate(`/superadmin-dashboard/candidates/${c.id}`)}
                          className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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
            <h4 className="text-base font-black text-slate-700">No candidates found</h4>
            <p className="text-xs font-bold text-slate-400 max-w-xs">
              Try adjusting your search or filters to locate specific workspace records.
            </p>
          </div>
        )}

        {/* Custom Pagination Footer matching Figma: 1 2 3 4 5 ... 9 */}
        {filteredCandidates.length > 0 && (
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
