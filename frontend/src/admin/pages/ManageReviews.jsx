import { useEffect, useMemo, useState } from 'react';
import {
  Star,
  Search,
  MessageSquare,
  ThumbsUp,
  Trash2,
  CheckCircle,
  Download,
} from 'lucide-react';
import ListPagination from '../components/ListPagination';
import { useAdminData } from '../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { VILLA_NAME } from '../data/defaults';
import { exportToCsv, formatDate, paginate } from '../utils/listHelpers';

const STATUS_FILTERS = ['All', 'Approved', 'Pending', 'Flagged'];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? 'currentColor' : 'none'}
          className={i < rating ? '' : 'text-slate-200'}
          aria-hidden
        />
      ))}
    </div>
  );
}

const ManageReviews = () => {
  const { reviews, patchReview, removeReview } = useAdminData();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  const filteredReviews = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return reviews
      .filter((r) => {
        const matchesSearch =
          !query ||
          r.guest.toLowerCase().includes(query) ||
          r.comment.toLowerCase().includes(query) ||
          String(r.rating).includes(query);
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [reviews, searchTerm, statusFilter]);

  const { items: paginatedReviews, totalPages, page: safePage, rangeStart, rangeEnd } = paginate(
    filteredReviews,
    page,
  );

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleApprove = async (review) => {
    try {
      await patchReview(review.id, { status: 'Approved' });
      showToast(`Review from ${review.guest} approved.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (review) => {
    if (!window.confirm(`Remove review from ${review.guest}?`)) return;
    try {
      await removeReview(review.id);
      showToast('Review removed.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const toggleFeatured = async (review) => {
    try {
      await patchReview(review.id, { featured: !review.featured });
      showToast(review.featured ? 'Removed from featured.' : 'Marked as featured.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const submitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyTo) return;
    showToast(`Reply saved for ${replyTo.guest} (demo — connect email API later).`, 'success');
    setReplyTo(null);
    setReplyText('');
  };

  const handleExport = () => {
    exportToCsv(
      `digana-reviews-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Guest', 'Villa', 'Rating', 'Comment', 'Date', 'Status', 'Featured'],
      filteredReviews.map((r) => [
        r.guest,
        r.villa,
        r.rating,
        r.comment,
        r.date,
        r.status,
        r.featured ? 'Yes' : 'No',
      ]),
    );
    showToast('Reviews exported.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Guest Reviews</h2>
          <p className="text-slate-500">Monitor and moderate feedback for {VILLA_NAME}.</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={filteredReviews.length === 0}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm"
          aria-label="Export filtered reviews as CSV"
        >
          <Download size={20} aria-hidden />
          Export
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative max-w-md w-full flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} aria-hidden />
            </span>
            <input
              type="search"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Search by guest, comment, or rating..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search reviews"
            />
          </div>
          <div
            className="flex items-center bg-slate-50 rounded-lg p-1 flex-wrap"
            role="tablist"
            aria-label="Filter by review status"
          >
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={statusFilter === status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors ${
                  statusFilter === status
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="font-medium">No reviews match your search or filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
              }}
              className="mt-2 text-sm text-primary-600 font-semibold hover:underline"
            >
              Clear search and filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paginatedReviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold"
                          aria-hidden
                        >
                          {review.guest.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{review.guest}</h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {review.villa} • {formatDate(review.date)}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 italic">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          review.status === 'Approved'
                            ? 'bg-green-100 text-green-700'
                            : review.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {review.status}
                      </span>
                      {review.featured ? (
                        <span className="text-[10px] font-bold uppercase text-blue-600">Featured</span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          setReplyTo(review);
                          setReplyText('');
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors"
                        aria-label={`Reply to ${review.guest}`}
                      >
                        <MessageSquare size={14} aria-hidden />
                        Reply
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFeatured(review)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                          review.featured ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'
                        }`}
                        aria-label={review.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <ThumbsUp size={14} aria-hidden />
                        {review.featured ? 'Featured' : 'Feature'}
                      </button>
                    </div>
                  </div>
                  <div className="flex md:flex-col justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(review)}
                      disabled={review.status === 'Approved'}
                      className="flex-1 md:flex-none p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      aria-label={`Approve review from ${review.guest}`}
                    >
                      <CheckCircle size={16} aria-hidden />
                      <span className="md:hidden text-xs font-bold">Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(review)}
                      className="flex-1 md:flex-none p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      aria-label={`Delete review from ${review.guest}`}
                    >
                      <Trash2 size={16} aria-hidden />
                      <span className="md:hidden text-xs font-bold">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <ListPagination
          page={safePage}
          totalPages={totalPages}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          total={filteredReviews.length}
          onPageChange={setPage}
        />
      </div>

      {replyTo ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <form
            onSubmit={submitReply}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-md"
          >
            <h3 className="font-bold text-slate-800 mb-1">Reply to {replyTo.guest}</h3>
            <p className="text-xs text-slate-500 mb-4">Demo reply — not sent until email is integrated.</p>
            <textarea
              rows={4}
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500 mb-4"
              placeholder="Your message..."
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-medium text-slate-600"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold">
                Save reply
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default ManageReviews;
