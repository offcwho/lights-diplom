'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, tokenStore } from '../lib/api';
import type { AuthResponse } from '../lib/types';
import { useRouter } from 'next/navigation';

type SessionUser = AuthResponse['user'];

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string,) => Promise<void>;
  refreshUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((me) => setUser({ id: me.id, email: me.email, name: me.name, role: me.role, address: me.address, avatarUrl: me.avatarUrl, phone: me.phone }))
      .catch((e) => {
        // токен сбрасываем ТОЛЬКО если он реально невалиден (401),
        // сетевые/временные ошибки сессию не убивают
        if (e?.response?.status === 401) tokenStore.clear();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const refreshUser = async () => {
    try {
      // Проверяем, есть ли вообще токен в localStorage перед запросом
      if (authApi.isAuthenticated()) {
        const freshUserData = await authApi.me(); // Твой метод '/auth/me'
        setUser(freshUserData); // Обновляем глобальный стейт
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Не удалось обновить данные пользователя:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    setUser(res.user);
  };
  const register = async (name: string, email: string, password: string) => {
    const res = await authApi.register({ email, password, name });
    setUser(res.user);
  };
  const logout = () => {
    route.refresh();
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}