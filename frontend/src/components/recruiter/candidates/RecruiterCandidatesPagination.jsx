import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function RecruiterCandidatesPagination({ pagination, onPageChange }) {
  if (!pagination || pagination.total_items === 0) return null;

  const { current_page, total_pages, total_items, page_size } = pagination;
  const startItem = (current_page - 1) * page_size + 1;
  const endItem = Math.min(current_page * page_size, total_items);

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-150 shadow-xs text-xs font-semibold text-slate-500">
      <span>
        Showing {startItem}-{endItem} of {total_items} candidates
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={current_page <= 1}
          onClick={() => onPageChange(current_page - 1)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={current_page >= total_pages}
          onClick={() => onPageChange(current_page + 1)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
