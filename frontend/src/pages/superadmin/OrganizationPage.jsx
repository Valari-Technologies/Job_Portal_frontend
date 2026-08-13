import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Edit2, SlidersHorizontal, Plus, MoreHorizontal, AlertCircle, RefreshCw } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';
import AddOrganizationModal from '../../components/superadmin/organization/AddOrganizationModal';
import { getOrganizations, saveOrganizations } from '../../components/superadmin/organization/orgData';

export default function OrganizationPage() {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industry');
  const [selectedSize, setSelectedSize] = useState('All Sizes');

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  
  // Active Action Menu for dots
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load organizations on mount
  useEffect(() => {
    setOrgs(getOrganizations());
  }, []);

  // Save list helper
  const handleSave = (updatedOrgs) => {
    setOrgs(updatedOrgs);
    saveOrganizations(updatedOrgs);
  };

  // Add or Edit save handler
  const handleSaveOrg = (formData) => {
    let updated;
    if (editingOrg) {
      updated = orgs.map(o => o.id === editingOrg.id ? { ...o, ...formData } : o);
    } else {
      const nextIdNumber = orgs.length > 0 
        ? Math.max(...orgs.map(o => parseInt(o.id.replace('ORG-', '')))) + 1 
        : 1001;
      const newOrg = {
        ...formData,
        id: `ORG-${nextIdNumber}`,
        dateCreated: new Date().toISOString().split('T')[0],
        jobsCount: formData.jobsCount || 0,
        candidateCount: formData.candidateCount || 0,
        hrCount: formData.hrCount || 0,
        hrManager: formData.hrManager || 'Unassigned',
        logo: formData.logo || 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100'
      };
      updated = [...orgs, newOrg];
    }
    handleSave(updated);
    setIsModalOpen(false);
    setEditingOrg(null);
  };

  // Delete org
  const handleDeleteOrg = (id, name) => {
    if (window.confirm(`Are you sure you want to delete organization "${name}"?`)) {
      const updated = orgs.filter(o => o.id !== id);
      handleSave(updated);
      setActiveMenuId(null);
    }
  };

  // Toggle status
  const toggleStatus = (id) => {
    const updated = orgs.map(o => {
      if (o.id === id) {
        const nextStatus = o.status === 'Active' ? 'Inactive' : 'Active';
        return { ...o, status: nextStatus };
      }
      return o;
    });
    handleSave(updated);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
    setSelectedIndustry('All Industry');
    setSelectedSize('All Sizes');
    setCurrentPage(1);
  };

  // Filtered organizations
  const filteredOrgs = orgs.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          org.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All Status' || org.status === selectedStatus;
    
    const matchesIndustry = selectedIndustry === 'All Industry' || 
                            org.industry.toLowerCase() === selectedIndustry.toLowerCase();

    const matchesSize = selectedSize === 'All Sizes' || 
                        org.companySize.toLowerCase().includes(selectedSize.toLowerCase().split(' ')[0]);

    return matchesSearch && matchesStatus && matchesIndustry && matchesSize;
  });

  // Unique list of industries for filtering
  const industries = ['All Industry', ...new Set(orgs.map(o => o.industry))];

  // Pagination calculation
  const totalItems = filteredOrgs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrgs = filteredOrgs.slice(startIndex, startIndex + itemsPerPage);

  // Close menus on clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Organizations</h2>
      </div>

      {/* Main card wrapper containing search, filters, table, and pagination */}
      <div className="bg-white/[0.05] backdrop-blur-[2px] rounded-3xl border border-white/20 shadow-none p-6 flex flex-col gap-6">
        
        {/* Search & Actions Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search organization Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search organization..."
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
              onClick={() => { setEditingOrg(null); setIsModalOpen(true); }}
              className="flex items-center justify-center gap-2 bg-[#8CC63F] hover:bg-[#7ab533] text-white text-sm font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Organization</span>
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
              value={selectedIndustry}
              onChange={(val) => { setSelectedIndustry(val); setCurrentPage(1); }}
              options={industries}
              placeholder="All Industry"
              buttonClassName="w-40 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto"
              accentColor="#8CC63F"
            />

            <CustomSelect
              value={selectedSize}
              onChange={(val) => { setSelectedSize(val); setCurrentPage(1); }}
              options={['All Sizes', '1-10', '11-50', '51-200', '201-500', '501+']}
              placeholder="All Sizes"
              buttonClassName="w-36 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl h-auto"
              accentColor="#8CC63F"
            />

            {(searchTerm || selectedStatus !== 'All Status' || selectedIndustry !== 'All Industry' || selectedSize !== 'All Sizes') && (
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

        {/* Organizations Table */}
        {paginatedOrgs.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Organization Name</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Organization ID</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">HR Count</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Candidate Count</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Active Jobs</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedOrgs.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-7">
                      <span 
                        onClick={() => navigate(`/superadmin-dashboard/organizations/${org.id}`)}
                        className="text-sm font-bold text-slate-700 hover:text-[#8CC63F] cursor-pointer transition-colors block"
                      >
                        {org.name}
                      </span>
                    </td>

                    {/* ID */}
                    <td className="px-6 py-7 text-sm font-semibold text-slate-500">{org.id}</td>

                    {/* Location */}
                    <td className="px-6 py-7 text-sm font-semibold text-slate-500">{org.location}</td>

                    {/* HR Count */}
                    <td className="px-6 py-7 text-sm font-semibold text-slate-500 text-center">{org.hrCount || 0}</td>

                    {/* Candidate Count */}
                    <td className="px-6 py-7 text-sm font-semibold text-slate-500 text-center">
                      {(org.candidateCount || 0).toLocaleString()}
                    </td>

                    {/* Active Jobs */}
                    <td className="px-6 py-7 text-sm font-semibold text-slate-500 text-center">{org.jobsCount || 0}</td>

                    {/* Status */}
                    <td className="px-6 py-7 text-center">
                      <button
                        onClick={() => toggleStatus(org.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                          org.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100/60' 
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100/60'
                        }`}
                      >
                        {org.status}
                      </button>
                    </td>

                    {/* Actions Column with stacked View, Edit, More buttons */}
                    <td className="px-6 py-7 text-center relative">
                      <div className="flex items-center gap-3.5 justify-center">
                        <button
                          onClick={() => navigate(`/superadmin-dashboard/organizations/${org.id}`)}
                          className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setEditingOrg(org); setIsModalOpen(true); }}
                          className="text-slate-400 hover:text-[#8CC63F] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setActiveMenuId(activeMenuId === org.id ? null : org.id); 
                            }}
                            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer block leading-none font-bold"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {/* More dropdown actions popover menu */}
                          {activeMenuId === org.id && (
                            <div className="absolute right-0 mt-1 w-24 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-30 text-left">
                              <button
                                onClick={() => toggleStatus(org.id)}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 font-bold block"
                              >
                                Toggle Active
                              </button>
                              <button
                                onClick={() => handleDeleteOrg(org.id, org.name)}
                                className="w-full text-left px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-50 font-bold block"
                              >
                                Delete
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
            <h4 className="text-base font-black text-slate-700">No organizations found</h4>
            <p className="text-xs font-bold text-slate-400 max-w-xs">
              Try adjusting your search or filters to locate specific workspace records.
            </p>
          </div>
        )}

        {/* Custom Pagination Footer matching Figma screen specs exactly */}
        {filteredOrgs.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-100/50">
            {/* Prev arrow */}
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 text-xs font-bold cursor-pointer"
            >
              &lt;
            </button>
            
            {/* Pages matching Figma: 1 2 3 4 5 ... 12 */}
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
              onClick={() => setCurrentPage(12)}
              className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                currentPage === 12 
                  ? 'bg-[#8CC63F] text-white shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              12
            </button>

            {/* Next arrow */}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, 12))}
              disabled={currentPage === 12}
              className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 text-xs font-bold cursor-pointer"
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* Creation/Edit Modal */}
      <AddOrganizationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingOrg(null); }}
        onSave={handleSaveOrg}
        editingOrg={editingOrg}
      />

    </div>
  );
}
