import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, CheckCircle } from 'lucide-react';
import { updateCompanyProfileService } from '../../../services/recruiter/recruiterCompanyService';

export default function CompanyProfileEditForm({ initialData = {} }) {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState(initialData.company_name || '');
  const [description, setDescription] = useState(initialData.company_description || '');
  const [website, setWebsite] = useState(initialData.website || '');
  const [email, setEmail] = useState(initialData.company_email || '');
  const [phone, setPhone] = useState(initialData.company_phone || '');
  const [state, setState] = useState(initialData.location?.state || '');
  const [district, setDistrict] = useState(initialData.location?.district || '');
  const [city, setCity] = useState(initialData.location?.city || '');
  const [locality, setLocality] = useState(initialData.location?.locality || '');
  const [logoPreview, setLogoPreview] = useState(initialData.company_logo || null);

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const validate = () => {
    const errs = {};
    if (!companyName.trim()) errs.companyName = 'Company name is required.';
    if (!email.trim()) errs.email = 'Company email is required.';
    if (!phone.trim()) errs.phone = 'Company phone is required.';
    if (!state.trim()) errs.state = 'State is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateCompanyProfileService({
        company_name: companyName,
        company_description: description,
        website,
        company_email: email,
        company_phone: phone,
        company_logo: logoPreview,
        location: { state, district, city, locality }
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  if (saved) {
    return (
      <div className="bg-white rounded-2xl border border-slate-150 p-8 text-center space-y-4 max-w-md mx-auto shadow-xs">
        <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Profile Updated</h2>
        <p className="text-xs font-medium text-slate-500">
          Your company profile details have been saved. Integration with Django backend object storage is pending.
        </p>
        <button
          type="button"
          onClick={() => navigate('/recruiter/company-profile')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
        >
          Return to Profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-150 pb-4">
        <button
          type="button"
          onClick={() => navigate('/recruiter/company-profile')}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-indigo-950 tracking-tight">Edit Company Profile</h1>
          <p className="text-xs font-bold text-slate-450 mt-0.5">Update your public company details and contact information.</p>
        </div>
      </div>

      {/* Section 1: Logo & Company Name */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Company Identity</h3>
        
        {/* Logo Upload Box */}
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center relative overflow-hidden shrink-0">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain p-1" />
            ) : (
              <Upload className="h-6 w-6 text-slate-400" />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
              <Upload className="h-3.5 w-3.5" />
              <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
            </label>
            {logoPreview && (
              <button
                type="button"
                onClick={() => setLogoPreview(null)}
                className="block text-xs font-bold text-red-500 hover:underline"
              >
                Remove Logo
              </button>
            )}
          </div>
        </div>

        {/* Company Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Company Name *</label>
          <input
            type="text"
            placeholder="e.g. TechCorp Solutions"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
          />
          {errors.companyName && <p className="text-xs font-bold text-red-500 mt-1">{errors.companyName}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Company Description</label>
          <textarea
            rows={4}
            placeholder="Brief overview of your company, mission, and culture..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Website */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Website URL</label>
          <input
            type="url"
            placeholder="https://www.example.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Section 2: Contact Information */}
      <div className="space-y-4 pt-2 border-t border-slate-150">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Contact Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Company Email *</label>
            <input
              type="email"
              placeholder="contact@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            />
            {errors.email && <p className="text-xs font-bold text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Company Phone *</label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            />
            {errors.phone && <p className="text-xs font-bold text-red-500 mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Section 3: Location */}
      <div className="space-y-4 pt-2 border-t border-slate-150">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Location</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">State *</label>
            <input
              type="text"
              placeholder="e.g. Tamil Nadu"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            />
            {errors.state && <p className="text-xs font-bold text-red-500 mt-1">{errors.state}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">District</label>
            <input
              type="text"
              placeholder="e.g. Chennai"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">City / Town</label>
            <input
              type="text"
              placeholder="e.g. Adyar"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Locality</label>
            <input
              type="text"
              placeholder="e.g. MG Road"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Read-only verification info */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Security & Trust</span>
        <p className="text-xs font-semibold text-slate-600">
          Verification Status: <span className="font-extrabold text-slate-800">{initialData.verification_status || 'PENDING'}</span> • Trust Level: <span className="font-extrabold text-slate-800">{initialData.trust_level || 'BASIC'}</span>
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-150">
        <button
          type="button"
          onClick={() => navigate('/recruiter/company-profile')}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Save Changes
        </button>
      </div>

    </form>
  );
}
