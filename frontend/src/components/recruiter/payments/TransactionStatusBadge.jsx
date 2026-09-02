export default function TransactionStatusBadge({ status }) {
  const getBadgeStyle = (st) => {
    switch (st) {
      case 'PAID':
      case 'Paid':
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
      case 'Pending':
      case 'PROCESSING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'FAILED':
      case 'Failed':
      case 'CANCELLED':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'REFUNDED':
      case 'Refunded':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${getBadgeStyle(status)}`}>
      <span>{status || 'Paid'}</span>
    </span>
  );
}
