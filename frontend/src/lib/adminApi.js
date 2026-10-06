import { apiRequest } from './api';

export function fetchAdminData() {
  return apiRequest('/api/admin/data');
}

export function updateVillaApi(villa) {
  return apiRequest('/api/admin/villa', { method: 'PUT', body: villa });
}

export function patchBookingApi(id, updates) {
  return apiRequest(`/api/admin/bookings/${id}`, { method: 'PATCH', body: updates });
}

export function deleteBookingApi(id) {
  return apiRequest(`/api/admin/bookings/${id}`, { method: 'DELETE' });
}

export function createUserApi(user) {
  return apiRequest('/api/admin/users', { method: 'POST', body: user });
}

export function patchUserApi(id, updates) {
  return apiRequest(`/api/admin/users/${id}`, { method: 'PATCH', body: updates });
}

export function deleteUserApi(id) {
  return apiRequest(`/api/admin/users/${id}`, { method: 'DELETE' });
}

export function patchReviewApi(id, updates) {
  return apiRequest(`/api/admin/reviews/${id}`, { method: 'PATCH', body: updates });
}

export function deleteReviewApi(id) {
  return apiRequest(`/api/admin/reviews/${id}`, { method: 'DELETE' });
}

export function fetchPublicVilla() {
  return apiRequest('/api/public/villa');
}

export function createPublicBooking(body) {
  return apiRequest('/api/public/bookings', { method: 'POST', body });
}

export function createPublicReview(body) {
  return apiRequest('/api/public/reviews', { method: 'POST', body });
}
