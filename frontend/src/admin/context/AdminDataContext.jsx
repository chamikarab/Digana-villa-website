import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CHART_DATA_12M, CHART_DATA_6M } from '../data/defaults';
import {
  createUserApi,
  deleteBookingApi,
  deleteReviewApi,
  deleteUserApi,
  fetchAdminData,
  patchBookingApi,
  patchReviewApi,
  patchUserApi,
  updateVillaApi,
} from '../../lib/adminApi';

const AdminDataContext = createContext(null);

function buildChartFromBookings(bookings, months) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const slice = months === 12 ? monthNames : monthNames.slice(0, 6);
  return slice.map((name, i) => {
    const monthBookings = bookings.filter((b) => {
      const d = new Date(`${b.checkIn}T00:00:00`);
      return d.getMonth() === i && b.status === 'Confirmed';
    });
    const revenue = monthBookings.reduce((s, b) => s + b.amount, 0);
    return { name, bookings: monthBookings.length, revenue: revenue || 0 };
  });
}

export function AdminDataProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [villa, setVilla] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const applyData = useCallback((data) => {
    setBookings(data.bookings ?? []);
    setUsers(data.users ?? []);
    setReviews(data.reviews ?? []);
    setVilla(data.villa ?? null);
  }, []);

  const refresh = useCallback(async () => {
    const res = await fetchAdminData();
    applyData(res.data);
    setError(null);
    return res.data;
  }, [applyData]);

  useEffect(() => {
    refresh()
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [refresh]);

  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === 'Confirmed');
    const revenue = confirmed.reduce((sum, b) => sum + b.amount, 0);
    return {
      villaStatus: villa?.status ?? '—',
      totalBookings: bookings.length,
      confirmedBookings: confirmed.length,
      pendingBookings: bookings.filter((b) => b.status === 'Pending').length,
      totalUsers: users.length,
      guestUsers: users.filter((u) => u.role === 'Guest').length,
      totalRevenue: revenue,
      pendingReviews: reviews.filter((r) => r.status === 'Pending').length,
    };
  }, [bookings, users, reviews, villa]);

  const recentBookings = useMemo(
    () => [...bookings].sort((a, b) => b.checkIn.localeCompare(a.checkIn)).slice(0, 5),
    [bookings],
  );

  const getChartData = useCallback(
    (period) => {
      const fromBookings = buildChartFromBookings(bookings, period === 'year' ? 12 : 6);
      const hasData = fromBookings.some((m) => m.revenue > 0);
      return hasData ? fromBookings : period === 'year' ? CHART_DATA_12M : CHART_DATA_6M;
    },
    [bookings],
  );

  const patchBooking = useCallback(
    async (id, updates) => {
      await patchBookingApi(id, updates);
      await refresh();
    },
    [refresh],
  );

  const removeBooking = useCallback(
    async (id) => {
      await deleteBookingApi(id);
      await refresh();
    },
    [refresh],
  );

  const addUser = useCallback(
    async (user) => {
      await createUserApi(user);
      await refresh();
    },
    [refresh],
  );

  const patchUser = useCallback(
    async (id, updates) => {
      await patchUserApi(id, updates);
      await refresh();
    },
    [refresh],
  );

  const removeUser = useCallback(
    async (id) => {
      await deleteUserApi(id);
      await refresh();
    },
    [refresh],
  );

  const patchReview = useCallback(
    async (id, updates) => {
      await patchReviewApi(id, updates);
      await refresh();
    },
    [refresh],
  );

  const removeReview = useCallback(
    async (id) => {
      await deleteReviewApi(id);
      await refresh();
    },
    [refresh],
  );

  const saveVilla = useCallback(
    async (villaData) => {
      await updateVillaApi(villaData);
      await refresh();
    },
    [refresh],
  );

  const value = useMemo(
    () => ({
      bookings,
      users,
      reviews,
      villa,
      isLoading,
      error,
      stats,
      recentBookings,
      getChartData,
      refresh,
      patchBooking,
      removeBooking,
      addUser,
      patchUser,
      removeUser,
      patchReview,
      removeReview,
      saveVilla,
      setBookings,
      setUsers,
      setReviews,
      setVilla,
    }),
    [
      bookings,
      users,
      reviews,
      villa,
      isLoading,
      error,
      stats,
      recentBookings,
      getChartData,
      refresh,
      patchBooking,
      removeBooking,
      addUser,
      patchUser,
      removeUser,
      patchReview,
      removeReview,
      saveVilla,
    ],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return ctx;
}
