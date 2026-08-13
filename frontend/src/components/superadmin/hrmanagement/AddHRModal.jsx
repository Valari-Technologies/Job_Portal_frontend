import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getOrganizations } from '../organization/orgData';
import CustomSelect from '../../CustomSelect';

export default function AddHRModal({ isOpen, onClose, onSave, editingUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('HR');
  const [organization, setOrganization] = useState('');
  const [status, setStatus] = useState('Active');

  const [orgOptions, setOrgOptions] = useState([]);

  // Load organizations for dropdown selection
  useEffect(() => {
    const orgsList = getOrganizations();
    setOrgOptions(orgsList);
    if (orgsList.length > 0 && !editingUser) {
      setOrganization(orgsList[0].name);
    }
  }, [isOpen, editingUser]);

  // Load editing user data
  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setRole(editingUser.role);
      setOrganization(editingUser.organization);
      setStatus(editingUser.status);
    } else {
      setName('');
      setEmail('');
      setRole('HR');
      setStatus('Active');
    }
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !organization) {
      alert('Please fill out all required fields.');
      return;
    }
    onSave({
      name,
      email,
      role,
      organization,
      status
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-left animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md border border-slate-100 shadow-xl overflow-visible">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            {editingUser ? 'Edit HR User' : 'Add HR User'}
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
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john.doe@company.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#8CC63F] text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Role *</label>
              <CustomSelect
                value={role}
                onChange={setRole}
                options={['HR', 'Org Admin']}
                placeholder="HR"
                buttonClassName="w-full bg-slate-50 border border-slate-100 hover:bg-slate-100/50 text-slate-800 text-sm font-bold px-4 py-2.5 rounded-xl h-[44px] flex items-center justify-between"
                accentColor="#8CC63F"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
              <CustomSelect
                value={status}
                onChange={setStatus}
                options={['Active', 'Inactive']}
                placeholder="Active"
                buttonClassName="w-full bg-slate-50 border border-slate-100 hover:bg-slate-100/50 text-slate-800 text-sm font-bold px-4 py-2.5 rounded-xl h-[44px] flex items-center justify-between"
                accentColor="#8CC63F"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">Organization Assignment *</label>
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
              Save User
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
