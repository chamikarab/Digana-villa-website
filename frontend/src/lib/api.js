const API_BASE = import.meta.env.VITE_API_URL || '';

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || data.message || 'Request failed.';
    throw new Error(message);
  }
  return data;
}

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
    signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(20000) : undefined,
  });

  return parseResponse(response);
}

export function loginRequest(email, password, remember = true) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password, remember },
  });
}

export function getMeRequest() {
  return apiRequest('/api/auth/me');
}

export function logoutRequest() {
  return apiRequest('/api/auth/logout', { method: 'POST' });
}
