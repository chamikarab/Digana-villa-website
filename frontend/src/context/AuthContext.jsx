import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeRequest, loginRequest, logoutRequest } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const endSession = useCallback(() => {
    setUser(null);
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      const response = await getMeRequest();
      setUser(response.data.user);
    } catch {
      endSession();
    }
  }, [endSession]);

  useEffect(() => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('digana_admin_session');
    restoreSession().finally(() => setIsLoading(false));
  }, [restoreSession]);

  const login = useCallback(
    async (email, password, remember = true) => {
      const response = await loginRequest(email, password, remember);
      setUser(response.data.user);
      navigate('/admin', { replace: true });
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Clear session even if server call fails.
    }
    endSession();
    navigate('/login', { replace: true });
  }, [endSession, navigate]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, isLoading, login, logout],
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
