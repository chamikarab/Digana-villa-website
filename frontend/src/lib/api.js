const API_BASE = import.meta.env.VITE_API_URL || '';

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || data.message || 'Request failed.';
    throw new Error(message);
  }
  return data;
}

export async function apiRequest(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseResponse(response);
}

export function loginRequest(email, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function getMeRequest(token) {
  return apiRequest('/api/auth/me', { token });
}

export function logoutRequest(token) {
  return apiRequest('/api/auth/logout', { method: 'POST', token });
}
