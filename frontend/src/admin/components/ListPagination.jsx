export default function ListPagination({ page, totalPages, rangeStart, rangeEnd, total, onPageChange }) {
  return (
    <div className="p-4 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-slate-500 font-medium">
        {total === 0
          ? 'No results'
          : `Showing ${rangeStart} to ${rangeEnd} of ${total} results`}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-slate-500 font-medium px-1">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
