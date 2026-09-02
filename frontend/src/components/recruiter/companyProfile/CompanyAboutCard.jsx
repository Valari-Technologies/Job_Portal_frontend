export default function CompanyAboutCard({ description }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-3 shadow-xs">
      <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">About Us</h3>

      {description ? (
        <p className="text-xs md:text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      ) : (
        <p className="text-xs font-medium text-slate-400 italic py-2">
          No company description has been added yet. Click "Edit Profile" to provide your company description.
        </p>
      )}
    </div>
  );
}
