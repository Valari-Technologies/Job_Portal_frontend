import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getOrganizations } from '../organization/orgData';
import CustomSelect from '../../CustomSelect';

export default function AddJobModal({ isOpen, onClose, onSave, editingJob }) {
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('');
  const [postedBy, setPostedBy] = useState('');
  const [postedDate, setPostedDate] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [status, setStatus] = useState('Active');

  const [orgOptions, setOrgOptions] = useState([]);

  useEffect(() => {
    const list = getOrganizations();
    setOrgOptions(list);
    if (list.length > 0 && !editingJob) {
      setOrganization(list[0].name);
    }
  }, [isOpen, editingJob]);

  useEffect(() => {
    if (editingJob) {
      setTitle(editingJob.title);
      setOrganization(editingJob.organization);
      setDepartment(editingJob.department);
      setLocation(editingJob.location);
      setPostedBy(editingJob.postedBy);
      setPostedDate(editingJob.postedDate);
      setClosingDate(editingJob.closingDate);
      setStatus(editingJob.status);
    } else {
      setTitle('');
      setDepartment('Engineering');
      setLocation('');
      setPostedBy('');
      setPostedDate(new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
      setClosingDate('');
      setStatus('Active');
    }
  }, [editingJob, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !organization || !location || !postedBy || !closingDate) {
      alert('Please fill out all required fields.');
      return;
    }
    onSave({
      title,
      organization,
      department,
      location,
      postedBy,
      postedDate,
      closingDate,
      status
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-left animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md border border-slate-100 shadow-xl overflow-visible">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            {editingJob ? 'Edit Job' : 'Create Job'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-sm font-bold text-slate-700">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Job Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Developer"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Department *</label>
              <CustomSelect
                value={department}
                onChange={setDepartment}
                options={['Engineering', 'Product', 'Analytics', 'Design', 'Marketing']}
                placeholder="Engineering"
                buttonClassName="w-full bg-slate-50 border border-slate-100 hover:bg-slate-100/50 text-slate-800 text-sm font-bold px-4 py-2.5 rounded-xl h-[44px] flex items-center justify-between"
                accentColor="#8CC63F"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
              <CustomSelect
                value={status}
                onChange={setStatus}
                options={['Active', 'Draft', 'Pending Approval', 'Closed']}
                placeholder="Active"
                buttonClassName="w-full bg-slate-50 border border-slate-100 hover:bg-slate-100/50 text-slate-800 text-sm font-bold px-4 py-2.5 rounded-xl h-[44px] flex items-center justify-between"
                accentColor="#8CC63F"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Location *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangalore"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Posted By *</label>
              <input
                type="text"
                required
                value={postedBy}
                onChange={(e) => setPostedBy(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Posted Date</label>
              <input
                type="text"
                disabled
                value={postedDate}
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-100 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Closing Date *</label>
              <input
                type="text"
                required
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                placeholder="e.g. Jun 20, 2025"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Organization *</label>
            <CustomSelect
              value={organization}
              onChange={setOrganization}
              options={orgOptions.map(o => o.name)}
              placeholder="Select Organization"
              buttonClassName="w-full bg-slate-50 border border-slate-100 hover:bg-slate-100/50 text-slate-800 text-sm font-bold px-4 py-2.5 rounded-xl h-[44px] flex items-center justify-between"
              accentColor="#8CC63F"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-3 justify-end mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#8CC63F] hover:bg-[#7ab533] text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Job
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
