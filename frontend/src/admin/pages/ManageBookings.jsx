import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  Filter,
  MoreHorizontal,
  Download,
  ArrowUpDown,
  Check,
  X,
  Clock,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { VILLA_NAME } from '../data/defaults';
import ListPagination from '../components/ListPagination';
import { exportToCsv, formatDate, formatLkr } from '../utils/listHelpers';

const PAGE_SIZE = 5;
const STATUSES = ['All', 'Confirmed', 'Pending', 'Cancelled'];

const SORT_OPTIONS = [
  { value: 'checkIn-desc', label: 'Check-in (newest)' },
  { value: 'checkIn-asc', label: 'Check-in (oldest)' },
  { value: 'amount-desc', label: 'Amount (high to low)' },
  { value: 'amount-asc', label: 'Amount (low to high)' },
  { value: 'guest-asc', label: 'Guest name (A–Z)' },
];

function StatusBadge({ status }) {
  const styles =
    status === 'Confirmed'
      ? 'bg-green-50 text-green-700'
      : status === 'Pending'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-red-50 text-red-700';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${styles}`}>
      {status === 'Confirmed' && <Check size={12} aria-hidden />}
      {status === 'Pending' && <Clock size={12} aria-hidden />}
      {status === 'Cancelled' && <X size={12} aria-hidden />}
      {status}
    </span>
  );
}

function paymentClass(payment) {
  if (payment === 'Paid') return 'text-green-600';
  if (payment === 'Partial') return 'text-amber-600';
  return 'text-slate-500';
}

const ManageBookings = () => {
  const { bookings, patchBooking } = useAdminData();
  const { showToast } = useToast();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(location.state?.search ?? '');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('checkIn-desc');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [detailBooking, setDetailBooking] = useState(null);

  const filteredBookings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    let result = bookings.filter((b) => {
      const matchesSearch =
        !query ||
        b.id.toLowerCase().includes(query) ||
        b.guest.toLowerCase().includes(query) ||
        b.email.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'checkIn-asc':
          return a.checkIn.localeCompare(b.checkIn);
        case 'checkIn-desc':
          return b.checkIn.localeCompare(a.checkIn);
        case 'amount-asc':
          return a.amount - b.amount;
        case 'amount-desc':
          return b.amount - a.amount;
        case 'guest-asc':
          return a.guest.localeCompare(b.guest);
        default:
          return 0;
      }
    });

    return result;
  }, [bookings, searchTerm, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));

  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredBookings.slice(start, start + PAGE_SIZE);
  }, [filteredBookings, page]);

  useEffect(() => {
    if (location.state?.search) {
      setSearchTerm(location.state.search);
    }
  }, [location.state?.search]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const rangeStart = filteredBookings.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filteredBookings.length);

  const applyBookingUpdate = async (id, updates, message) => {
    try {
      await patchBooking(id, updates);
      setOpenMenuId(null);
      showToast(message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleConfirm = (booking) => {
    if (booking.status !== 'Pending') return;
    applyBookingUpdate(booking.id, { status: 'Confirmed', payment: 'Paid' }, `Booking ${booking.id} confirmed.`);
  };

  const handleCancel = (booking) => {
    if (booking.status === 'Cancelled') return;
    if (!window.confirm(`Cancel booking ${booking.id} for ${booking.guest}?`)) return;
    applyBookingUpdate(booking.id, { status: 'Cancelled', payment: 'Refunded' }, `Booking ${booking.id} cancelled.`);
  };

  const handleExport = () => {
    exportToCsv(
      `digana-bookings-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Booking ID', 'Guest', 'Email', 'Villa', 'Check In', 'Check Out', 'Amount (LKR)', 'Status', 'Payment'],
      filteredBookings.map((b) => [
        b.id,
        b.guest,
        b.email,
        b.villa,
        b.checkIn,
        b.checkOut,
        b.amount,
        b.status,
        b.payment,
      ]),
    );
    showToast('Bookings exported.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Booking Management</h2>
          <p className="text-slate-500">View and manage guest reservations for {VILLA_NAME}.</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={filteredBookings.length === 0}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm"
          aria-label="Export filtered bookings as CSV"
        >
          <Download size={20} aria-hidden />
          Export Report
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} aria-hidden />
            </span>
            <input
              type="search"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Search by guest, email, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search bookings"
            />
          </div>
          <div className="flex items-center gap-2 relative">
            <button
              type="button"
              onClick={() => {
                setShowFilters((v) => !v);
                setShowSortMenu(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-sm font-medium transition-colors ${
                showFilters || statusFilter !== 'All'
                  ? 'border-primary-300 bg-primary-50 text-primary-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              aria-expanded={showFilters}
              aria-controls="booking-filters"
            >
              <Filter size={16} aria-hidden />
              Filters
              {statusFilter !== 'All' ? ` (${statusFilter})` : ''}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSortMenu((v) => !v);
                  setShowFilters(false);
                }}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                aria-expanded={showSortMenu}
                aria-haspopup="listbox"
              >
                <ArrowUpDown size={16} aria-hidden />
                Sort
              </button>
              {showSortMenu ? (
                <ul
                  className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1"
                  role="listbox"
                  aria-label="Sort bookings"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={sortBy === opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                          sortBy === opt.value ? 'text-primary-700 font-semibold bg-primary-50' : 'text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>

        {showFilters ? (
          <div
            id="booking-filters"
            className="px-4 pb-4 flex flex-wrap items-center gap-3 border-b border-slate-50"
          >
            <span className="text-sm font-medium text-slate-600">Status:</span>
            {STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
            {statusFilter !== 'All' ? (
              <button
                type="button"
                onClick={() => setStatusFilter('All')}
                className="text-sm text-primary-600 font-medium hover:underline"
              >
                Clear filter
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <caption className="sr-only">
              Bookings for {VILLA_NAME} with guest, dates, amount, and status
            </caption>
            <thead className="bg-slate-50/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Guest
                </th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Villa
                </th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Dates
                </th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <p className="font-medium">No bookings match your search or filters.</p>
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
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-slate-900">#{booking.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold"
                          aria-hidden
                        >
                          {booking.guest.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{booking.guest}</div>
                          <div className="text-xs text-slate-500">{booking.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{booking.villa}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-700 font-medium">{formatDate(booking.checkIn)}</div>
                      <div className="text-xs text-slate-400">to {formatDate(booking.checkOut)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{formatLkr(booking.amount)}</div>
                      <div className={`text-[10px] font-bold uppercase ${paymentClass(booking.payment)}`}>
                        {booking.payment}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 md:opacity-100 opacity-100 group-focus-within:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleConfirm(booking)}
                          disabled={booking.status !== 'Pending'}
                          className="p-1.5 hover:bg-green-50 rounded-lg text-slate-600 hover:text-green-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label={`Confirm booking ${booking.id}`}
                          title="Confirm booking"
                        >
                          <Check size={16} aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancel(booking)}
                          disabled={booking.status === 'Cancelled'}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-slate-600 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label={`Cancel booking ${booking.id}`}
                          title="Cancel booking"
                        >
                          <X size={16} aria-hidden />
                        </button>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId((id) => (id === booking.id ? null : booking.id))
                            }
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            aria-label={`More actions for ${booking.id}`}
                            aria-expanded={openMenuId === booking.id}
                          >
                            <MoreHorizontal size={16} aria-hidden />
                          </button>
                          {openMenuId === booking.id ? (
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1">
                              <button
                                type="button"
                                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                onClick={() => {
                                  setDetailBooking(booking);
                                  setOpenMenuId(null);
                                }}
                              >
                                View details
                              </button>
                              {booking.status === 'Pending' ? (
                                <button
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-sm text-green-700 hover:bg-green-50"
                                  onClick={() => handleConfirm(booking)}
                                >
                                  Mark confirmed
                                </button>
                              ) : null}
                              {booking.status !== 'Cancelled' ? (
                                <button
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                                  onClick={() => handleCancel(booking)}
                                >
                                  Cancel booking
                                </button>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <ListPagination
          page={page}
          totalPages={totalPages}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          total={filteredBookings.length}
          onPageChange={setPage}
        />
      </div>

      {detailBooking ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-md">
            <h3 className="font-bold text-lg text-slate-800">#{detailBooking.id}</h3>
            <p className="text-sm text-slate-600 mt-2">
              {detailBooking.guest} ({detailBooking.email})
            </p>
            <p className="text-sm text-slate-600 mt-2">
              {formatDate(detailBooking.checkIn)} – {formatDate(detailBooking.checkOut)}
            </p>
            <p className="text-sm font-bold text-slate-800 mt-2">
              {formatLkr(detailBooking.amount)} · {detailBooking.status} · {detailBooking.payment}
            </p>
            <button
              type="button"
              onClick={() => setDetailBooking(null)}
              className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ManageBookings;
