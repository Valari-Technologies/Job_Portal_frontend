import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, CheckCircle } from 'lucide-react';
import { updateCompanyProfileService } from '../../../services/recruiter/recruiterCompanyService';

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (typeof file === 'string') return resolve(file);
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export default function CompanyProfileEditForm({ initialData = {} }) {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState(initialData.company_name || '');
  const [description, setDescription] = useState(initialData.company_description || '');
  const [website, setWebsite] = useState(initialData.website || initialData.company_website || '');
  const [email, setEmail] = useState(initialData.company_email || initialData.email || '');
  const [phone, setPhone] = useState(initialData.company_phone || initialData.phone_number || '');
  const [state, setState] = useState(initialData.location?.state || initialData.company_address || '');
  const [district, setDistrict] = useState(initialData.location?.district || '');
  const [city, setCity] = useState(initialData.location?.city || '');
  const [locality, setLocality] = useState(initialData.location?.locality || '');
  const [logoPreview, setLogoPreview] = useState(initialData.company_logo || null);

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setLogoPreview(dataUrl);
      } catch (err) {
        console.error("Error reading logo file:", err);
      }
    }
  };

  const validate = () => {
    const errs = {};
    if (!companyName.trim()) errs.companyName = 'Company name is required.';
    if (!email.trim()) errs.email = 'Company email is required.';
    if (!phone.trim()) errs.phone = 'Company phone is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const logoDataUrl = logoPreview ? await fileToDataUrl(logoPreview) : null;
      const res = await updateCompanyProfileService({
        company_name: companyName,
        company_description: description,
        website: website,
        company_email: email,
        company_phone: phone,
        state,
        district,
        city,
        locality,
        company_logo: logoDataUrl
      });
      if (res.success) {
        setSaved(true);
        setTimeout(() => {
          navigate('/recruiter/company-profile');
        }, 800);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-xs max-w-4xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-150 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/recruiter/company-profile')}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Company Profile</h2>
            <p className="text-xs font-semibold text-slate-450 mt-0.5">
              Update your public company details and contact information.
            </p>
          </div>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold animate-fadeIn">
            <CheckCircle className="h-4 w-4" /> Saved Successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section 1: Identity & Logo */}
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
              <label className="text-xs font-bold text-slate-700">State</label>
              <input
                type="text"
                placeholder="e.g. Tamil Nadu"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              />
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
            Verification Status: <span className="font-extrabold text-slate-800">{initialData.verification_status || 'PENDING'}</span> | Trust Level: <span className="font-extrabold text-slate-800">{initialData.trust_level || 'NEW'}</span>
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
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
