import { Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CompanyProfileHeader({ isEditMode = false }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-150 pb-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight">Company Profile</h1>
        <p className="text-xs md:text-sm font-bold text-slate-450 mt-1">
          Manage your public brand identity and company details.
        </p>
      </div>

      {!isEditMode && (
        <button
          type="button"
          onClick={() => navigate('/recruiter/company-profile/edit')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-600 bg-white px-4 py-2.5 text-xs font-black text-indigo-600 shadow-xs hover:bg-indigo-50 transition-colors min-h-[44px] cursor-pointer"
        >
          <Edit3 className="h-4 w-4" />
          <span>Edit Profile</span>
        </button>
      )}
    </div>
  );
}
