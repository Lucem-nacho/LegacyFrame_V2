import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; // <--- SOLUCIÓN: Importación explícita de tipo
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  rol: string;
  exp: number;
}

interface User {
  email: string;
  isAdmin: boolean;
}

interface AuthContextValue {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({
            email: decoded.sub,
            isAdmin: decoded.rol === 'ADMIN'
          });
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode<DecodedToken>(token);
    
    setUser({
      email: decoded.sub,
      isAdmin: decoded.rol === 'ADMIN'
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};