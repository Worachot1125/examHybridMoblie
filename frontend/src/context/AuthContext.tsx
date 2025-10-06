import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api, setAuthToken } from '../api/client';

type User = { _id: string; name: string; email: string; role?: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await SecureStore.getItemAsync('token');
      if (saved) {
        setToken(saved);
        setAuthToken(saved);
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    const t = res.data.token as string;
    setToken(t);
    setAuthToken(t);
    await SecureStore.setItemAsync('token', t);
    setUser(res.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post('/api/auth/register', { name, email, password });
    await login(email, password);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setAuthToken(undefined);
    await SecureStore.deleteItemAsync('token');
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};