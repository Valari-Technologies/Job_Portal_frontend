import React, { useState, useEffect } from 'react';
import CustomSelect from '../../CustomSelect';

export default function AddOrganizationModal({ isOpen, onClose, onSave, editingOrg }) {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    companySize: '1-10 employees',
    status: 'Active',
    email: '',
    phone: '',
    website: '',
    location: '',
    description: '',
    logo: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingOrg) {
      setFormData({ ...editingOrg });
    } else {
      setFormData({
        name: '',
        industry: '',
        companySize: '1-10 employees',
        status: 'Active',
        email: '',
        phone: '',
        website: '',
        location: '',
        description: '',
        logo: ''
      });
    }
    setErrors({});
  }, [editingOrg, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Organization name is required';
    if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-scaleUp text-left flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            {editingOrg ? 'Edit Organization' : 'Add New Organization'}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-xl font-bold cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow flex flex-col gap-4">
          {/* Org Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Organization Name *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden transition-colors ${
                errors.name ? 'border-rose-400 focus:border-rose-400' : 'border-slate-100 focus:border-[#8CC63F]'
              }`}
              placeholder="e.g. Acme Corp"
            />
            {errors.name && <span className="text-[11px] font-bold text-rose-500">{errors.name}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Industry */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Industry *</label>
              <input 
                type="text" 
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden transition-colors ${
                  errors.industry ? 'border-rose-400 focus:border-rose-400' : 'border-slate-100 focus:border-[#8CC63F]'
                }`}
                placeholder="e.g. Technology"
              />
              {errors.industry && <span className="text-[11px] font-bold text-rose-500">{errors.industry}</span>}
            </div>

            {/* Company Size */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Company Size</label>
              <CustomSelect
                value={formData.companySize}
                onChange={(val) => setFormData({ ...formData, companySize: val })}
                options={['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '501+ employees']}
                placeholder="Select Size"
                buttonClassName="w-full bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl h-auto"
                accentColor="#8CC63F"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Email Address *</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden transition-colors ${
                  errors.email ? 'border-rose-400 focus:border-rose-400' : 'border-slate-100 focus:border-[#8CC63F]'
                }`}
                placeholder="e.g. contact@acme.com"
              />
              {errors.email && <span className="text-[11px] font-bold text-rose-500">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Phone Number</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden focus:border-[#8CC63F] transition-colors"
                placeholder="e.g. +1 555-019-2834"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Website */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Website URL</label>
              <input 
                type="text" 
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden focus:border-[#8CC63F] transition-colors"
                placeholder="e.g. https://acme.com"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Location *</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden transition-colors ${
                  errors.location ? 'border-rose-400 focus:border-rose-400' : 'border-slate-100 focus:border-[#8CC63F]'
                }`}
                placeholder="e.g. San Francisco, CA"
              />
              {errors.location && <span className="text-[11px] font-bold text-rose-500">{errors.location}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Status</label>
              <CustomSelect
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
                options={['Active', 'Inactive']}
                placeholder="Select Status"
                buttonClassName="w-full bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl h-auto"
                accentColor="#8CC63F"
              />
            </div>

            {/* Logo Image URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Logo Image URL</label>
              <input 
                type="text" 
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden focus:border-[#8CC63F] transition-colors"
                placeholder="e.g. https://domain.com/logo.png"
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Company Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden focus:border-[#8CC63F] transition-colors h-24 resize-none"
              placeholder="Provide a brief summary of the organization..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-xl bg-[#8CC63F] hover:bg-[#7ab533] text-white text-sm font-black shadow-md shadow-[#8CC63F]/20 transition-all cursor-pointer"
            >
              {editingOrg ? 'Save Changes' : 'Create Organization'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
