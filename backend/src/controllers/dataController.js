import { readDb, updateDb, nightsBetween } from '../db/fileStore.js';
import { VILLA_NAME } from '../db/seed.js';
import { sanitizeAdminPayload } from '../utils/payloadSanitizer.js';

const VILLA_ALLOWED_FIELDS = ['name', 'location', 'price', 'capacity', 'rooms', 'status', 'image', 'description'];
const BOOKING_ALLOWED_FIELDS = ['guest', 'email', 'villa', 'checkIn', 'checkOut', 'amount', 'status', 'payment', 'guests'];
const USER_ALLOWED_FIELDS = ['name', 'email', 'role'];
const REVIEW_ALLOWED_FIELDS = ['guest', 'villa', 'rating', 'comment', 'date', 'status', 'featured'];

function ok(res, data) {
  return res.json({ success: true, data });
}

export const getAllAdminData = async (req, res, next) => {
  try {
    const db = await readDb();
    return ok(res, {
      villa: db.villa,
      bookings: db.bookings,
      users: db.users,
      reviews: db.reviews,
    });
  } catch (e) {
    next(e);
  }
};

export const getVilla = async (req, res, next) => {
  try {
    const db = await readDb();
    return ok(res, { villa: db.villa });
  } catch (e) {
    next(e);
  }
};

export const updateVilla = async (req, res, next) => {
  try {
    const updates = sanitizeAdminPayload(req.body, VILLA_ALLOWED_FIELDS);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid villa fields supplied.' });
    }

    const db = await updateDb((data) => {
      data.villa = { ...data.villa, ...updates, id: data.villa.id };
      return data;
    });
    return ok(res, { villa: db.villa });
  } catch (e) {
    next(e);
  }
};

export const listBookings = async (req, res, next) => {
  try {
    const db = await readDb();
    return ok(res, { bookings: db.bookings });
  } catch (e) {
    next(e);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = sanitizeAdminPayload(req.body, BOOKING_ALLOWED_FIELDS);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid booking fields supplied.' });
    }

    const db = await updateDb((data) => {
      const idx = data.bookings.findIndex((b) => b.id === id);
      if (idx === -1) throw Object.assign(new Error('Booking not found.'), { status: 404 });
      data.bookings[idx] = { ...data.bookings[idx], ...updates, id };
      return data;
    });
    const booking = db.bookings.find((b) => b.id === id);
    return ok(res, { booking });
  } catch (e) {
    next(e);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    await updateDb((data) => {
      const before = data.bookings.length;
      data.bookings = data.bookings.filter((b) => b.id !== id);
      if (data.bookings.length === before) throw Object.assign(new Error('Booking not found.'), { status: 404 });
      return data;
    });
    return ok(res, { message: 'Booking deleted.' });
  } catch (e) {
    next(e);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const db = await readDb();
    return ok(res, { users: db.users });
  } catch (e) {
    next(e);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    const db = await updateDb((data) => {
      if (data.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
        throw Object.assign(new Error('Email already exists.'), { status: 400 });
      }
      const user = {
        id: data.nextIds.user++,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        role: role === 'Admin' ? 'Admin' : 'Guest',
        joined: new Date().toISOString().slice(0, 10),
      };
      data.users.push(user);
      return data;
    });
    const user = db.users[db.users.length - 1];
    return res.status(201).json({ success: true, data: { user } });
  } catch (e) {
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updates = sanitizeAdminPayload(req.body, USER_ALLOWED_FIELDS);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid user fields supplied.' });
    }

    const db = await updateDb((data) => {
      const idx = data.users.findIndex((u) => u.id === id);
      if (idx === -1) throw Object.assign(new Error('User not found.'), { status: 404 });
      if (data.users[idx].email === 'admin@diganavilla.com') {
        throw Object.assign(new Error('Cannot modify primary admin.'), { status: 403 });
      }
      data.users[idx] = { ...data.users[idx], ...updates, id };
      return data;
    });
    const user = db.users.find((u) => u.id === id);
    return ok(res, { user });
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await updateDb((data) => {
      const user = data.users.find((u) => u.id === id);
      if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });
      if (user.email === 'admin@diganavilla.com') {
        throw Object.assign(new Error('Cannot delete primary admin.'), { status: 403 });
      }
      const admins = data.users.filter((u) => u.role === 'Admin');
      if (user.role === 'Admin' && admins.length <= 1) {
        throw Object.assign(new Error('Must keep at least one admin.'), { status: 400 });
      }
      data.users = data.users.filter((u) => u.id !== id);
      return data;
    });
    return ok(res, { message: 'User deleted.' });
  } catch (e) {
    next(e);
  }
};

export const listReviews = async (req, res, next) => {
  try {
    const db = await readDb();
    return ok(res, { reviews: db.reviews });
  } catch (e) {
    next(e);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updates = sanitizeAdminPayload(req.body, REVIEW_ALLOWED_FIELDS);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid review fields supplied.' });
    }

    const db = await updateDb((data) => {
      const idx = data.reviews.findIndex((r) => r.id === id);
      if (idx === -1) throw Object.assign(new Error('Review not found.'), { status: 404 });
      data.reviews[idx] = { ...data.reviews[idx], ...updates, id };
      return data;
    });
    const review = db.reviews.find((r) => r.id === id);
    return ok(res, { review });
  } catch (e) {
    next(e);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await updateDb((data) => {
      const before = data.reviews.length;
      data.reviews = data.reviews.filter((r) => r.id !== id);
      if (data.reviews.length === before) throw Object.assign(new Error('Review not found.'), { status: 404 });
      return data;
    });
    return ok(res, { message: 'Review deleted.' });
  } catch (e) {
    next(e);
  }
};

export const getPublicVilla = async (req, res, next) => {
  try {
    const db = await readDb();
    const { villa } = db;
    return ok(res, {
      villa: {
        name: villa.name,
        location: villa.location,
        price: villa.price,
        capacity: villa.capacity,
        rooms: villa.rooms,
        status: villa.status,
        image: villa.image,
        description: villa.description,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const createPublicBooking = async (req, res, next) => {
  try {
    const { guest, email, checkIn, checkOut, guests } = req.body;
    if (!guest?.trim() || !email?.trim() || !checkIn || !checkOut) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    const nights = nightsBetween(checkIn, checkOut);
    if (nights < 1) {
      return res.status(400).json({ success: false, error: 'Check-out must be after check-in.' });
    }

    const db = await readDb();
    if (db.villa.status !== 'Available') {
      return res.status(400).json({ success: false, error: 'Villa is not available for booking right now.' });
    }
    if (Number(guests) > db.villa.capacity) {
      return res.status(400).json({ success: false, error: `Maximum ${db.villa.capacity} guests allowed.` });
    }

    const amount = nights * db.villa.price;
    const id = `BK-${db.nextIds.booking++}`;

    const updated = await updateDb((data) => {
      const booking = {
        id,
        guest: String(guest).trim(),
        email: String(email).trim().toLowerCase(),
        villa: VILLA_NAME,
        checkIn,
        checkOut,
        amount,
        status: 'Pending',
        payment: 'Partial',
        guests: Number(guests) || 1,
      };
      data.bookings.push(booking);
      const emailLower = booking.email;
      if (!data.users.some((u) => u.email === emailLower)) {
        data.users.push({
          id: data.nextIds.user++,
          name: booking.guest,
          email: emailLower,
          role: 'Guest',
          joined: new Date().toISOString().slice(0, 10),
        });
      }
      return data;
    });

    const booking = updated.bookings.find((b) => b.id === id);
    return res.status(201).json({
      success: true,
      data: {
        booking: {
          id: booking.id,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          amount: booking.amount,
          status: booking.status,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

export const createPublicReview = async (req, res, next) => {
  try {
    const { guest, rating, comment } = req.body;
    if (!guest?.trim() || !comment?.trim() || rating == null) {
      return res.status(400).json({ success: false, error: 'Name, rating, and comment are required.' });
    }
    const r = Number(rating);
    if (r < 1 || r > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5.' });
    }

    const db = await updateDb((data) => {
      const review = {
        id: data.nextIds.review++,
        guest: String(guest).trim(),
        villa: VILLA_NAME,
        rating: r,
        comment: String(comment).trim(),
        date: new Date().toISOString().slice(0, 10),
        status: 'Pending',
        featured: false,
      };
      data.reviews.push(review);
      return data;
    });

    const review = db.reviews[db.reviews.length - 1];
    return res.status(201).json({ success: true, data: { review: { id: review.id, status: review.status } } });
  } catch (e) {
    next(e);
  }
};
