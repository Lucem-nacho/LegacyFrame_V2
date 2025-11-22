import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  email: string;
  isAdmin: boolean;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};

const STORAGE_KEY = 'legacyframe_auth_v1';
const ADMIN_EMAIL = 'admin@legacyframes.cl';
const ADMIN_PASSWORD = 'Admin123#';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, [user]);

  const login = (email: string, password: string): boolean => {
    // Verificar si es admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser({ email, isAdmin: true });
      return true;
    }
    // Usuario normal (a@a.cl / Pass123#)
    if (email === 'a@a.cl' && password === 'Pass123#') {
      setUser({ email, isAdmin: false });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
