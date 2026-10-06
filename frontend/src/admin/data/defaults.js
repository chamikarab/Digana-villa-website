export const VILLA_NAME = 'Digana Villa';

export const DEFAULT_VILLA = {
  id: 1,
  name: VILLA_NAME,
  location: 'Digana, Kandy, Sri Lanka',
  price: 37500,
  capacity: 6,
  rooms: 3,
  status: 'Available',
  image:
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
  description:
    'A private hillside retreat with pool, garden, and views over the Digana valley—ideal for families and small groups.',
};

export const DEFAULT_BOOKINGS = [
  { id: 'BK-2401', guest: 'Alice Johnson', email: 'alice@example.com', villa: VILLA_NAME, checkIn: '2026-06-10', checkOut: '2026-06-15', amount: 187500, status: 'Confirmed', payment: 'Paid' },
  { id: 'BK-2402', guest: 'Bob Smith', email: 'bob@example.com', villa: VILLA_NAME, checkIn: '2026-06-12', checkOut: '2026-06-14', amount: 75000, status: 'Pending', payment: 'Partial' },
  { id: 'BK-2403', guest: 'Charlie Brown', email: 'charlie@example.com', villa: VILLA_NAME, checkIn: '2026-06-20', checkOut: '2026-06-25', amount: 225000, status: 'Cancelled', payment: 'Refunded' },
  { id: 'BK-2404', guest: 'Diana Prince', email: 'diana@example.com', villa: VILLA_NAME, checkIn: '2026-07-01', checkOut: '2026-07-07', amount: 262500, status: 'Confirmed', payment: 'Paid' },
  { id: 'BK-2405', guest: 'Elena Perera', email: 'elena@example.com', villa: VILLA_NAME, checkIn: '2026-07-15', checkOut: '2026-07-18', amount: 112500, status: 'Pending', payment: 'Partial' },
  { id: 'BK-2406', guest: 'Frank Mendis', email: 'frank@example.com', villa: VILLA_NAME, checkIn: '2026-08-02', checkOut: '2026-08-09', amount: 306250, status: 'Confirmed', payment: 'Paid' },
  { id: 'BK-2407', guest: 'Grace Silva', email: 'grace@example.com', villa: VILLA_NAME, checkIn: '2026-08-20', checkOut: '2026-08-22', amount: 75000, status: 'Cancelled', payment: 'Refunded' },
  { id: 'BK-2408', guest: 'Henry Wick', email: 'henry@example.com', villa: VILLA_NAME, checkIn: '2026-09-05', checkOut: '2026-09-10', amount: 187500, status: 'Pending', payment: 'Partial' },
];

export const DEFAULT_USERS = [
  { id: 1, name: 'Digana Admin', email: 'admin@diganavilla.com', role: 'Admin', joined: '2025-01-10' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Guest', joined: '2026-02-20' },
  { id: 3, name: 'Robert Wilson', email: 'robert@example.com', role: 'Guest', joined: '2026-03-05' },
  { id: 4, name: 'Sarah Parker', email: 'sarah@example.com', role: 'Guest', joined: '2026-03-12' },
  { id: 5, name: 'Kamal Fernando', email: 'kamal@example.com', role: 'Guest', joined: '2026-04-01' },
  { id: 6, name: 'Nimali Jayawardena', email: 'nimali@example.com', role: 'Guest', joined: '2026-04-18' },
  { id: 7, name: 'Oliver Reed', email: 'oliver@example.com', role: 'Guest', joined: '2026-05-02' },
];

export const DEFAULT_REVIEWS = [
  { id: 1, guest: 'Alice Johnson', villa: VILLA_NAME, rating: 5, comment: 'Absolutely stunning villa! The view was incredible and the service was top-notch.', date: '2026-04-10', status: 'Approved', featured: true },
  { id: 2, guest: 'Bob Smith', villa: VILLA_NAME, rating: 4, comment: 'Great place for a quick getaway. The mountain air is refreshing.', date: '2026-04-12', status: 'Pending', featured: false },
  { id: 3, guest: 'Charlie Brown', villa: VILLA_NAME, rating: 2, comment: 'Good location but cleanliness on arrival could improve.', date: '2026-04-15', status: 'Flagged', featured: false },
  { id: 4, guest: 'Diana Prince', villa: VILLA_NAME, rating: 5, comment: 'Peaceful stay near Kandy. Pool and garden were perfect.', date: '2026-05-02', status: 'Approved', featured: false },
  { id: 5, guest: 'Elena Perera', villa: VILLA_NAME, rating: 3, comment: 'Decent value. Check-in smooth but Wi‑Fi could be stronger.', date: '2026-05-18', status: 'Pending', featured: false },
  { id: 6, guest: 'Frank Mendis', villa: VILLA_NAME, rating: 5, comment: 'We will definitely return. Villa was spotless.', date: '2026-06-01', status: 'Approved', featured: true },
  { id: 7, guest: 'Grace Silva', villa: VILLA_NAME, rating: 1, comment: 'Noise from nearby construction affected sleep.', date: '2026-06-08', status: 'Flagged', featured: false },
];

export const CHART_DATA_6M = [
  { name: 'Jan', bookings: 4, revenue: 750000 },
  { name: 'Feb', bookings: 3, revenue: 562500 },
  { name: 'Mar', bookings: 5, revenue: 937500 },
  { name: 'Apr', bookings: 6, revenue: 1125000 },
  { name: 'May', bookings: 8, revenue: 1500000 },
  { name: 'Jun', bookings: 7, revenue: 1312500 },
];

export const CHART_DATA_12M = [
  ...CHART_DATA_6M,
  { name: 'Jul', bookings: 9, revenue: 1687500 },
  { name: 'Aug', bookings: 10, revenue: 1875000 },
  { name: 'Sep', bookings: 8, revenue: 1500000 },
  { name: 'Oct', bookings: 11, revenue: 2062500 },
  { name: 'Nov', bookings: 12, revenue: 2250000 },
  { name: 'Dec', bookings: 14, revenue: 2625000 },
];
