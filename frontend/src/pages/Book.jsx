import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Home, MapPin, Users, ArrowLeft, Loader2 } from 'lucide-react';
import { createPublicBooking, fetchPublicVilla } from '../lib/adminApi';
import { useToast } from '../context/ToastContext';
import { formatLkr } from '../admin/utils/listHelpers';

const Book = () => {
  const { showToast } = useToast();
  const [villa, setVilla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [form, setForm] = useState({
    guest: '',
    email: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
  });

  useEffect(() => {
    fetchPublicVilla()
      .then((res) => setVilla(res.data.villa))
      .catch(() => showToast('Could not load villa details.', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessId(null);
    try {
      const res = await createPublicBooking(form);
      setSuccessId(res.data.booking.id);
      showToast('Booking request submitted! We will confirm by email.', 'success');
      setForm({ guest: '', email: '', checkIn: '', checkOut: '', guests: '2' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary-600" size={32} aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm">
          <ArrowLeft size={18} aria-hidden />
          Back to home
        </Link>
        <Link to="/login" className="text-sm font-bold text-primary-600 hover:text-primary-700">
          Admin
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-16">
        {villa ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
            <div className="h-48 md:h-56 overflow-hidden">
              <img src={villa.image} alt={villa.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-slate-800">{villa.name}</h1>
              <p className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                <MapPin size={14} aria-hidden />
                {villa.location}
              </p>
              <p className="text-slate-600 mt-3 text-sm leading-relaxed">{villa.description}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm font-semibold text-slate-700">
                <span>{formatLkr(villa.price)} / night</span>
                <span className="flex items-center gap-1">
                  <Users size={14} aria-hidden /> Up to {villa.capacity} guests
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    villa.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {villa.status}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
            <Calendar size={22} className="text-primary-600" aria-hidden />
            Request a booking
          </h2>
          <p className="text-slate-500 text-sm mb-6">Submit your dates—we will confirm availability by email.</p>

          {successId ? (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800 text-sm">
              Reference <strong>#{successId}</strong> — pending confirmation.
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="guest">
                  Full name
                </label>
                <input
                  id="guest"
                  name="guest"
                  required
                  value={form.guest}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="checkIn">
                  Check-in
                </label>
                <input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  required
                  value={form.checkIn}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="checkOut">
                  Check-out
                </label>
                <input
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  required
                  value={form.checkOut}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="guests">
                  Number of guests
                </label>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max={villa?.capacity ?? 10}
                  required
                  value={form.guests}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting || villa?.status !== 'Available'}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
            >
              {submitting ? 'Submitting...' : villa?.status === 'Available' ? 'Submit booking request' : 'Not available'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Book;
