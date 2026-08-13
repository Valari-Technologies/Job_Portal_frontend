import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { getOrganizations, saveOrganizations } from '../../components/superadmin/organization/orgData';
import AddOrganizationModal from '../../components/superadmin/organization/AddOrganizationModal';

export default function OrganizationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [allOrgs, setAllOrgs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const list = getOrganizations();
    setAllOrgs(list);
    const found = list.find(o => o.id === id);
    if (found) {
      setOrg(found);
    }
  }, [id]);

  if (!org) {
    return (
      <div className="py-16 text-center text-slate-500">
        <p className="text-base font-bold">Organization not found</p>
        <button 
          onClick={() => navigate('/superadmin-dashboard/organizations')}
          className="mt-4 text-sm font-black text-[#8CC63F] flex items-center gap-1.5 justify-center mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organizations</span>
        </button>
      </div>
    );
  }

  // Handle delete
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete organization "${org.name}"?`)) {
      const updated = allOrgs.filter(o => o.id !== org.id);
      saveOrganizations(updated);
      navigate('/superadmin-dashboard/organizations');
    }
  };

  // Toggle status
  const toggleStatus = () => {
    const nextStatus = org.status === 'Active' ? 'Inactive' : 'Active';
    const updatedOrg = { ...org, status: nextStatus };
    const updatedList = allOrgs.map(o => o.id === org.id ? updatedOrg : o);
    setOrg(updatedOrg);
    setAllOrgs(updatedList);
    saveOrganizations(updatedList);
  };

  // Handle edit save
  const handleSaveEdit = (formData) => {
    const updatedOrg = { ...org, ...formData };
    const updatedList = allOrgs.map(o => o.id === org.id ? updatedOrg : o);
    setOrg(updatedOrg);
    setAllOrgs(updatedList);
    saveOrganizations(updatedList);
    setIsModalOpen(false);
  };

  // Get initials for large avatar circle
  const getInitials = (name) => {
    if (!name) return 'TN';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const tabsList = [
    { id: 'Overview', label: 'Overview' },
    { id: 'HR Users', label: `HR Users (${org.hrCount || 0})` },
    { id: 'Admins', label: 'Admins (3)' },
    { id: 'Active Jobs', label: `Active Jobs (${org.jobsCount || 0})` },
    { id: 'Applications', label: `Applications (${(org.candidateCount || 0).toLocaleString()})` },
    { id: 'Shortlisted', label: 'Shortlisted (120)' },
    { id: 'Interviews', label: 'Interviews (45)' }
  ];

  // Helper to render tabular contents for other tabs
  const renderTabTable = () => {
    switch (activeTab) {
      case 'HR Users':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#8CC63F]/25">
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Name</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Email</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Role</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8CC63F]/10 text-sm font-bold text-slate-700">
              <tr className="hover:bg-slate-50/20">
                <td className="py-4 px-4">{org.hrManager || 'Ravi Kumar'}</td>
                <td className="py-4 px-4">{org.email || 'ravi.kumar@technova.com'}</td>
                <td className="py-4 px-4">HR Manager</td>
                <td className="py-4 px-4 text-center">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Active</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/20">
                <td className="py-4 px-4">Anjali Sharma</td>
                <td className="py-4 px-4">anjali.s@company.com</td>
                <td className="py-4 px-4">HR Recruiter</td>
                <td className="py-4 px-4 text-center">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Active</span>
                </td>
              </tr>
            </tbody>
          </table>
        );
      case 'Admins':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#8CC63F]/25">
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Name</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Email</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Role</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8CC63F]/10 text-sm font-bold text-slate-700">
              <tr className="hover:bg-slate-50/20">
                <td className="py-4 px-4">Suresh Raina</td>
                <td className="py-4 px-4">suresh.admin@company.com</td>
                <td className="py-4 px-4">Super Admin</td>
                <td className="py-4 px-4 text-center">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Active</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/20">
                <td className="py-4 px-4">Pankaj Tripathi</td>
                <td className="py-4 px-4">pankaj.t@company.com</td>
                <td className="py-4 px-4">System Administrator</td>
                <td className="py-4 px-4 text-center">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Active</span>
                </td>
              </tr>
            </tbody>
          </table>
        );
      case 'Active Jobs':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#8CC63F]/25">
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Job Title</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Department</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Type</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase text-center">Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8CC63F]/10 text-sm font-bold text-slate-700">
              <tr className="hover:bg-slate-50/20">
                <td className="py-4 px-4 text-[#8CC63F]">Senior React Developer</td>
                <td className="py-4 px-4">Engineering</td>
                <td className="py-4 px-4">Full-Time</td>
                <td className="py-4 px-4 text-center">142</td>
              </tr>
              <tr className="hover:bg-slate-50/20">
                <td className="py-4 px-4 text-[#8CC63F]">Product UI/UX Designer</td>
                <td className="py-4 px-4">Design</td>
                <td className="py-4 px-4">Contract</td>
                <td className="py-4 px-4 text-center">85</td>
              </tr>
            </tbody>
          </table>
        );
      case 'Applications':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#8CC63F]/25">
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Candidate Name</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Job Title</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Applied Date</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8CC63F]/10 text-sm font-bold text-slate-700">
              <tr className="hover:bg-slate-50/20">
                <td className="py-4 px-4">Rohan Dev</td>
                <td className="py-4 px-4">Senior React Developer</td>
                <td className="py-4 px-4">Aug 10, 2026</td>
                <td className="py-4 px-4 text-center">
                  <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Pending</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/20">
                <td className="py-4 px-4">Sneha Kapoor</td>
                <td className="py-4 px-4">Product UI/UX Designer</td>
                <td className="py-4 px-4">Aug 09, 2026</td>
                <td className="py-4 px-4 text-center">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Reviewed</span>
                </td>
              </tr>
            </tbody>
          </table>
        );
      case 'Shortlisted':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#8CC63F]/25">
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Candidate Name</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Job Title</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Shortlisted Date</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8CC63F]/10 text-sm font-bold text-slate-700">
              <tr className="hover:bg-slate-50/20">
                <td className="py-4 px-4">Aman Verma</td>
                <td className="py-4 px-4">Senior React Developer</td>
                <td className="py-4 px-4">Aug 11, 2026</td>
                <td className="py-4 px-4 text-center">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Shortlisted</span>
                </td>
              </tr>
            </tbody>
          </table>
        );
      case 'Interviews':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#8CC63F]/25">
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Candidate Name</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Job Title</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase">Interview Date</th>
                <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8CC63F]/10 text-sm font-bold text-slate-700">
              <tr className="hover:bg-slate-50/20">
                <td className="py-4 px-4">Aditya Roy</td>
                <td className="py-4 px-4">Senior React Developer</td>
                <td className="py-4 px-4">Aug 14, 2026 - 11:00 AM</td>
                <td className="py-4 px-4 text-center">
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Scheduled</span>
                </td>
              </tr>
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Back Link */}
      <div>
        <button
          onClick={() => navigate('/superadmin-dashboard/organizations')}
          className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organizations</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Organizations</h2>
      </div>

      {/* Main Layout Grid - Summary Left, Overview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-stretch">
        
        {/* Left Column: Organization Summary Card */}
        <div className="lg:col-span-1 bg-white/10 rounded-[32px] border border-[#8CC63F] p-6 flex flex-col gap-5">
          {/* Circular avatar and title info */}
          <div className="flex flex-col items-center text-center pt-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-black shadow-md shadow-indigo-200/20 mb-4">
              {getInitials(org.name)}
            </div>
            
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{org.name}</h3>
            <span className="text-sm font-semibold text-slate-400 block mt-1">{org.id}</span>
            
            <button
              onClick={toggleStatus}
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer mt-3 ${
                org.status === 'Active' 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}
            >
              {org.status}
            </button>
          </div>

          <hr className="border-[#8CC63F]/30" />

          {/* Details Metadata Rows - Enlarged Text Sizes */}
          <div className="flex flex-col gap-4 text-base font-semibold text-slate-600">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Location</span>
              <span className="text-base text-slate-800 block mt-0.5">{org.location || 'Not Specified'}</span>
            </div>

            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Industry</span>
              <span className="text-base text-slate-800 block mt-0.5">{org.industry || 'Not Specified'}</span>
            </div>

            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Contact Email</span>
              <span className="text-base text-slate-800 block mt-0.5">{org.email || 'Not Specified'}</span>
            </div>

            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Contact Phone</span>
              <span className="text-base text-slate-800 block mt-0.5">{org.phone || 'Not Specified'}</span>
            </div>

            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Website</span>
              <a 
                href={org.website} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#8CC63F] hover:underline text-base block mt-0.5 font-bold"
              >
                {org.website ? org.website.replace('https://', '').replace('http://', '') : 'Not Specified'}
              </a>
            </div>

            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Created Date</span>
              <span className="text-base text-slate-800 block mt-0.5">{org.dateCreated || 'Not Specified'}</span>
            </div>
          </div>

          {/* Edit/Delete Actions */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#8CC63F]/20">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-grow flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-black transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-black transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Right Column: Overview, Tabs & Information details */}
        <div className="lg:col-span-2 bg-white/10 rounded-[32px] border border-[#8CC63F] p-6 flex flex-col gap-6">
          
          {/* Horizontal Tabs Menu */}
          <div className="flex items-center gap-6 border-b border-[#8CC63F] overflow-x-auto whitespace-nowrap scrollbar-none pb-0">
            {tabsList.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-black transition-all border-b-4 cursor-pointer -mb-[2px] ${
                  activeTab === tab.id 
                    ? 'border-[#8CC63F] text-[#8CC63F]' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Workspace View */}
          {activeTab === 'Overview' ? (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              {/* About card */}
              <div className="bg-transparent border border-[#8CC63F] rounded-[24px] p-6 text-left">
                <h4 className="text-base font-black text-[#8CC63F] uppercase tracking-wider mb-2">About Organization</h4>
                <p className="text-base font-bold text-slate-600 leading-relaxed">
                  {org.description || `${org.name} is a global services provider specializing in consulting, operations, and development.`}
                </p>
              </div>

              {/* Statistics Cards Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'TOTAL HR USERS', val: org.hrCount || 25, color: 'text-blue-600' },
                  { label: 'TOTAL CANDIDATES', val: (org.candidateCount || 3456).toLocaleString(), color: 'text-slate-800' },
                  { label: 'ACTIVE JOBS', val: org.jobsCount || 18, color: 'text-blue-600' },
                  { label: 'TOTAL APPLICATIONS', val: (org.candidateCount || 1245).toLocaleString(), color: 'text-blue-600' }
                ].map((stat, i) => (
                  <div key={i} className="bg-transparent border border-[#8CC63F] rounded-[24px] p-5 flex flex-col justify-between min-h-[110px] text-left">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-tight">{stat.label}</span>
                    <span className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.val}</span>
                  </div>
                ))}
              </div>

              {/* Address card */}
              <div className="bg-transparent border border-[#8CC63F] rounded-[24px] p-6 text-left flex flex-col gap-4">
                <div>
                  <h4 className="text-base font-black text-[#8CC63F] uppercase tracking-wider mb-2">Address</h4>
                  <p className="text-base font-bold text-slate-600">
                    No. 123, Outer Ring Road, Bangalore, Karnataka - 560103
                  </p>
                </div>

                <hr className="border-[#8CC63F]" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Contact Person</span>
                    <span className="text-base font-bold text-slate-800 block mt-1">{org.hrManager || 'Ravi Kumar'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Contact Email</span>
                    <span className="text-base font-bold text-blue-600 block mt-1">{org.email || 'ravi.kumar@technova.com'}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Contact Phone</span>
                    <span className="text-base font-bold text-slate-800 block mt-1">{org.phone || '+91 99887 76655'}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="overflow-x-auto w-full animate-fadeIn border border-[#8CC63F] rounded-[24px] p-6 bg-transparent">
              {renderTabTable()}
            </div>
          )}

        </div>

      </div>

      {/* Editing Modal */}
      <AddOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEdit}
        editingOrg={org}
      />

    </div>
  );
}
