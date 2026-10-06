import { useEffect, useMemo, useState } from 'react';
import { Search, Edit2, Eye, MapPin, Users, Bed, Save, X } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { formatLkr } from '../utils/listHelpers';

const STATUS_OPTIONS = ['All', 'Available', 'Booked', 'Maintenance'];

const ManageVillas = () => {
  const { villa, saveVilla, isLoading } = useAdminData();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [draft, setDraft] = useState(villa);

  useEffect(() => {
    if (villa) setDraft(villa);
  }, [villa]);

  const matchesListing = useMemo(() => {
    if (!villa) return false;
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      villa.name.toLowerCase().includes(query) ||
      villa.location.toLowerCase().includes(query) ||
      villa.description.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'All' || villa.status === statusFilter;
    return matchesSearch && matchesStatus;
  }, [villa, searchTerm, statusFilter]);

  if (isLoading || !villa) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-slate-500 font-medium">
        Loading villa...
      </div>
    );
  }

  const startEdit = () => {
    setDraft({ ...villa });
    setIsEditing(true);
    setShowDetails(false);
  };

  const viewDetails = () => setShowDetails(true);

  const cancelEdit = () => {
    setDraft({ ...villa });
    setIsEditing(false);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    const price = Number(draft.price);
    const capacity = Number(draft.capacity);
    const rooms = Number(draft.rooms);
    if (!draft.name.trim() || !draft.location.trim()) {
      showToast('Name and location are required.', 'error');
      return;
    }
    if (Number.isNaN(price) || price <= 0) {
      showToast('Enter a valid nightly price.', 'error');
      return;
    }
    if (Number.isNaN(capacity) || capacity < 1 || Number.isNaN(rooms) || rooms < 1) {
      showToast('Capacity and rooms must be at least 1.', 'error');
      return;
    }
    try {
      await saveVilla({
        ...draft,
        name: draft.name.trim(),
        location: draft.location.trim(),
        price,
        capacity,
        rooms,
      });
      setIsEditing(false);
      showToast('Villa listing updated.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manage Villa</h2>
          <p className="text-slate-500">Update your single property listing for Digana Villa.</p>
        </div>
        {!isEditing ? (
          <button
            type="button"
            onClick={startEdit}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary-200"
          >
            <Edit2 size={20} aria-hidden />
            Edit Listing
          </button>
        ) : null}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} aria-hidden />
          </span>
          <input
            type="search"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Search name, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search villa listing"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-sm font-medium text-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-auto"
            aria-label="Filter by availability status"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All status' : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!matchesListing ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500">
          <p className="font-medium">No listing matches your search or status filter.</p>
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
      ) : isEditing ? (
        <form
          onSubmit={saveEdit}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl space-y-4"
        >
          <h3 className="font-bold text-lg text-slate-800">Edit listing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="villa-name">
                Name
              </label>
              <input
                id="villa-name"
                type="text"
                required
                value={draft.name}
                onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="villa-location">
                Location
              </label>
              <input
                id="villa-location"
                type="text"
                required
                value={draft.location}
                onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="villa-price">
                Price per night (LKR)
              </label>
              <input
                id="villa-price"
                type="number"
                min="1"
                required
                value={draft.price}
                onChange={(e) => setDraft((p) => ({ ...p, price: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="villa-status">
                Status
              </label>
              <select
                id="villa-status"
                value={draft.status}
                onChange={(e) => setDraft((p) => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium"
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="villa-capacity">
                Max guests
              </label>
              <input
                id="villa-capacity"
                type="number"
                min="1"
                required
                value={draft.capacity}
                onChange={(e) => setDraft((p) => ({ ...p, capacity: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="villa-rooms">
                Bedrooms
              </label>
              <input
                id="villa-rooms"
                type="number"
                min="1"
                required
                value={draft.rooms}
                onChange={(e) => setDraft((p) => ({ ...p, rooms: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="villa-desc">
                Description
              </label>
              <textarea
                id="villa-desc"
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700"
            >
              <Save size={18} aria-hidden />
              Save changes
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
            >
              <X size={18} aria-hidden />
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group max-w-2xl">
            <div className="relative h-48 overflow-hidden">
              <img
                src={villa.image}
                alt={villa.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                    villa.status === 'Available'
                      ? 'bg-green-500 text-white'
                      : villa.status === 'Booked'
                        ? 'bg-amber-500 text-white'
                        : 'bg-red-500 text-white'
                  }`}
                >
                  {villa.status}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  type="button"
                  onClick={startEdit}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-slate-700 hover:bg-white transition-colors"
                  aria-label="Edit villa listing"
                >
                  <Edit2 size={16} aria-hidden />
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary-600 transition-colors flex-1">
                  {villa.name}
                </h3>
                <span className="text-primary-600 font-bold whitespace-nowrap">
                  {formatLkr(villa.price)}
                  <span className="text-slate-400 text-xs font-medium">/night</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                <MapPin size={14} aria-hidden />
                {villa.location}
              </div>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">{villa.description}</p>
              <div className="flex items-center justify-between py-3 border-t border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Users size={16} className="text-slate-400" aria-hidden />
                    <span className="text-sm font-semibold">{villa.capacity} guests</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Bed size={16} className="text-slate-400" aria-hidden />
                    <span className="text-sm font-semibold">{villa.rooms} rooms</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={viewDetails}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label="View villa details"
                >
                  <Eye size={18} aria-hidden />
                </button>
              </div>
            </div>
          </article>
        </div>
      )}

      {showDetails ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-md">
            <h3 className="font-bold text-lg text-slate-800 mb-2">{villa.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{villa.location}</p>
            <dl className="text-sm space-y-2 text-slate-700">
              <div className="flex justify-between">
                <dt className="font-medium">Price</dt>
                <dd>{formatLkr(villa.price)} / night</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Capacity</dt>
                <dd>{villa.capacity} guests</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Bedrooms</dt>
                <dd>{villa.rooms}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Status</dt>
                <dd>{villa.status}</dd>
              </div>
            </dl>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">{villa.description}</p>
            <button
              type="button"
              onClick={() => setShowDetails(false)}
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

export default ManageVillas;
