// CAMBIO AQUÍ: Agregamos "type" delante de ReactNode
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";

// Definimos la forma del usuario
interface User {
  email: string;
  isAdmin: boolean;
  nombre?: string;
}

interface AuthContextValue {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean; 
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 1. Inicialización Lazy
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false); 
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/login"; 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};