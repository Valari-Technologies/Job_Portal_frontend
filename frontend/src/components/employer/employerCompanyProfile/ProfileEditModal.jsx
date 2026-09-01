import { X, Globe, Mail, Phone, User, MapPin } from 'lucide-react';

export default function ProfileEditModal({
  isEditing,
  setIsEditing,
  handleSave,
  formName,
  setFormName,
  formCategory,
  setFormCategory,
  formSize,
  setFormSize,
  formWebsite,
  setFormWebsite,
  formEmail,
  setFormEmail,
  formPhone,
  setFormPhone,
  formContactPerson,
  setFormContactPerson,
  formAddress,
  setFormAddress,
  formState,
  setFormState,
  formDistrict,
  setFormDistrict,
  formCity,
  setFormCity,
  formLocality,
  setFormLocality,
  formDesc,
  setFormDesc,
  formErrors,
}) {
  if (!isEditing) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-black text-slate-900 font-sans">Complete Company Profile</h3>
          <button onClick={() => setIsEditing(false)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 font-sans">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Company name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-455 uppercase">Company name</label>
              <input 
                type="text" 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter company name"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-805 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {formErrors.name && (
                <p className="text-xs font-bold text-red-500 mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Business category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-455 uppercase">Business category</label>
              <input 
                type="text" 
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g. IT services, Health"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-805 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Company size */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-455 uppercase">Company size</label>
              <input 
                type="text" 
                value={formSize}
                onChange={(e) => setFormSize(e.target.value)}
                placeholder="e.g. 10 - 50 employees"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-805 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Website */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-455 uppercase flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-slate-400" />
                <span>Website URL</span>
              </label>
              <input 
                type="url" 
                value={formWebsite}
                onChange={(e) => setFormWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-805 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-455 uppercase flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>Company email</span>
              </label>
              <input 
                type="email" 
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="hr@example.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-805 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {formErrors.email && (
                <p className="text-xs font-bold text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-455 uppercase flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>Company phone</span>
              </label>
              <input 
                type="tel" 
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="e.g. +91 44 4203 8200"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-805 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Contact person */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-455 uppercase flex items-center gap-1.5">
                <User className="h-4 w-4 text-slate-400" />
                <span>Contact person</span>
              </label>
              <input 
                type="text" 
                value={formContactPerson}
                onChange={(e) => setFormContactPerson(e.target.value)}
                placeholder="Enter contact person name"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-805 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-black text-slate-455 uppercase flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>Registered address</span>
              </label>
              <input 
                type="text" 
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="Enter full company address"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-805 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* State, District, City, Locality */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-455 uppercase">State</label>
              <input 
                type="text" 
                value={formState}
                onChange={(e) => setFormState(e.target.value)}
                placeholder="e.g. Tamil Nadu"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-805 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-455 uppercase">District</label>
              <input 
                type="text" 
                value={formDistrict}
                onChange={(e) => setFormDistrict(e.target.value)}
                placeholder="e.g. Chennai"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-805 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-455 uppercase">City</label>
              <input 
                type="text" 
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="e.g. Chennai"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-850 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-455 uppercase">Locality</label>
              <input 
                type="text" 
                value={formLocality}
                onChange={(e) => setFormLocality(e.target.value)}
                placeholder="e.g. T. Nagar"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-805 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-455 uppercase">Company description</label>
            <textarea 
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Tell candidates about your company culture, mission, and achievements..."
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-805 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-sm font-extrabold text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2.5 text-sm transition-colors shadow-md shadow-blue-600/10"
            >
              Save profile
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
