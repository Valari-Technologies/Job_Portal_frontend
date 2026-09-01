import { useState } from 'react';
import { X, Upload } from 'lucide-react';

export default function CandidateModal({ isOpen, onClose, onToast }) {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Active');

  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    // India mobile format: +91 xxxxx xxxxx or 10-digit number
    const trimmedMobile = mobileNumber.trim();
    if (!trimmedMobile) {
      newErrors.mobile_number = 'Mobile number is required';
    } else {
      const mobileRegex = /^(\+91[- \s]?)?[0-9]{10}$/;
      if (!mobileRegex.test(trimmedMobile.replace(/\s+/g, ''))) {
        newErrors.mobile_number = 'Enter a valid Indian mobile number';
      }
    }

    // Email format validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Enter a valid email address';
      }
    }

    // Salary validation
    if (salaryMin && salaryMax) {
      if (Number(salaryMax) < Number(salaryMin)) {
        newErrors.salary_max = 'Maximum salary must be greater than or equal to minimum salary';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Future Django integration:
    // POST /api/admin/candidates/
    // Backend should create users record, assign CANDIDATE role in user_roles,
    // and create the linked candidates profile in one transaction.

    onToast('Candidate creation will be connected to the Django backend.');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="relative border-b border-slate-100 px-6 py-5 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-black text-slate-900 leading-none">Add candidate</h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section A: Account Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2">Section A — Account details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="full-name" className="block text-xs font-black text-slate-450 uppercase">Full name *</label>
                <input 
                  id="full-name"
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className={`w-full border ${errors.full_name ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-teal-100'} rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all`}
                />
                {errors.full_name && (
                  <p className="text-xs font-bold text-red-500 mt-1">{errors.full_name}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label htmlFor="mobile-number" className="block text-xs font-black text-slate-450 uppercase">Mobile number *</label>
                <input 
                  id="mobile-number"
                  type="tel" 
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className={`w-full border ${errors.mobile_number ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-teal-100'} rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all`}
                />
                {errors.mobile_number && (
                  <p className="text-xs font-bold text-red-500 mt-1">{errors.mobile_number}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label htmlFor="email-address" className="block text-xs font-black text-slate-450 uppercase">Email address *</label>
                <input 
                  id="email-address"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className={`w-full border ${errors.email ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-teal-100'} rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all`}
                />
                {errors.email && (
                  <p className="text-xs font-bold text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Account Status */}
              <div className="space-y-1">
                <label htmlFor="account-status" className="block text-xs font-black text-slate-450 uppercase">Account status</label>
                <div className="relative">
                  <select 
                    id="account-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-teal-100 appearance-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
            
            <p className="text-[11px] font-bold text-slate-400 italic">
              The Candidate role will be assigned by the backend when this account is created.
            </p>
          </div>

          {/* Section B: Candidate Profile */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2">Section B — Candidate profile</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Profile Photo */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-xs font-black text-slate-450 uppercase">Profile photo</label>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                    <Upload className="h-5 w-5" />
                  </div>
                  <button type="button" className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition-colors shadow-2xs">
                    Choose file
                  </button>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <label htmlFor="dob" className="block text-xs font-black text-slate-450 uppercase">Date of birth</label>
                <input 
                  id="dob"
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label htmlFor="gender" className="block text-xs font-black text-slate-450 uppercase">Gender</label>
                <div className="relative">
                  <select 
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-teal-100 appearance-none cursor-pointer"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label htmlFor="location" className="block text-xs font-black text-slate-450 uppercase">Location</label>
                <div className="relative">
                  <select 
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-teal-100 appearance-none cursor-pointer"
                  >
                    <option value="">Select location</option>
                  </select>
                </div>
              </div>

              {/* Preferred Job Type */}
              <div className="space-y-1">
                <label htmlFor="job-type" className="block text-xs font-black text-slate-450 uppercase">Preferred job type</label>
                <div className="relative">
                  <select 
                    id="job-type"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-teal-100 appearance-none cursor-pointer"
                  >
                    <option value="">Select job type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                  </select>
                </div>
              </div>

              {/* Preferred Work Mode */}
              <div className="space-y-1">
                <label htmlFor="work-mode" className="block text-xs font-black text-slate-450 uppercase">Preferred work mode</label>
                <div className="relative">
                  <select 
                    id="work-mode"
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-teal-100 appearance-none cursor-pointer"
                  >
                    <option value="">Select work mode</option>
                    <option value="on-site">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="field-based">Field-based</option>
                  </select>
                </div>
              </div>

              {/* Salary Min */}
              <div className="space-y-1">
                <label htmlFor="salary-min" className="block text-xs font-black text-slate-450 uppercase">Expected minimum salary</label>
                <input 
                  id="salary-min"
                  type="number" 
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="e.g. 30000"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition-all"
                />
              </div>

              {/* Salary Max */}
              <div className="space-y-1">
                <label htmlFor="salary-max" className="block text-xs font-black text-slate-450 uppercase">Expected maximum salary</label>
                <input 
                  id="salary-max"
                  type="number" 
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="e.g. 50000"
                  className={`w-full border ${errors.salary_max ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-teal-100'} rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all`}
                />
                {errors.salary_max && (
                  <p className="text-xs font-bold text-red-500 mt-1">{errors.salary_max}</p>
                )}
              </div>

            </div>
          </div>

          {/* Actions Sticky Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-sm font-extrabold text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-2.5 text-sm transition-colors shadow-md shadow-teal-600/10"
            >
              Create candidate
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
