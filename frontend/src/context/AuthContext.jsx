import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeRequest, loginRequest, logoutRequest } from '../lib/api';
import { clearSession, getSession, SESSION_KEY, setSession } from '../lib/session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((session) => {
    if (!session) {
      setUser(null);
      setToken(null);
      return;
    }
    setUser(session.user);
    setToken(session.token);
  }, []);

  const endSession = useCallback(() => {
    clearSession();
    applySession(null);
  }, [applySession]);

  const restoreSession = useCallback(async () => {
    const stored = getSession();
    if (!stored) {
      applySession(null);
      return;
    }

    try {
      const response = await getMeRequest(stored.token);
      const session = { token: stored.token, user: response.data.user };
      setSession(session);
      applySession(session);
    } catch {
      endSession();
    }
  }, [applySession, endSession]);

  useEffect(() => {
    localStorage.removeItem('adminAuth');
    restoreSession().finally(() => setIsLoading(false));
  }, [restoreSession]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== SESSION_KEY) return;

      if (!event.newValue) {
        applySession(null);
        navigate('/login', { replace: true });
        return;
      }

      try {
        const session = JSON.parse(event.newValue);
        applySession(session);
      } catch {
        endSession();
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [applySession, endSession, navigate]);

  const login = useCallback(
    async (email, password) => {
      const response = await loginRequest(email, password);
      const session = {
        token: response.data.token,
        user: response.data.user,
      };
      setSession(session);
      applySession(session);
      navigate('/admin', { replace: true });
    },
    [applySession, navigate],
  );

  const logout = useCallback(async () => {
    const stored = getSession();
    if (stored?.token) {
      try {
        await logoutRequest(stored.token);
      } catch {
        // Clear local session even if the server call fails.
      }
    }
    endSession();
    navigate('/login', { replace: true });
  }, [endSession, navigate]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
