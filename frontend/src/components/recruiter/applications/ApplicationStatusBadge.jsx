export default function ApplicationStatusBadge({ status }) {
  const getBadgeStyle = (st) => {
    switch (st) {
      case 'APPLIED':
      case 'Applied':
        return { label: 'Applied', style: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'VIEWED':
      case 'Under Review':
        return { label: 'Under Review', style: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'SHORTLISTED':
      case 'Shortlisted':
        return { label: 'Shortlisted', style: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'EMPLOYER_CONTACTED':
      case 'Employer Contacted':
        return { label: 'Employer Contacted', style: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'INTERVIEW':
      case 'Interview':
        return { label: 'Interview', style: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'SELECTED':
      case 'Selected':
        return { label: 'Selected', style: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'REJECTED':
      case 'Rejected':
        return { label: 'Rejected', style: 'bg-red-50 text-red-800 border-red-200' };
      case 'WITHDRAWN':
      case 'Withdrawn':
        return { label: 'Withdrawn', style: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { label: st || 'Applied', style: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const { label, style } = getBadgeStyle(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
      <span>{label}</span>
    </span>
  );
}
