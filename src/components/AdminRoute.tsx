import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react"; // <--- SOLUCIÓN 1: Import type

interface AdminRouteProps {
  children: ReactNode; // <--- SOLUCIÓN 2: Usamos ReactNode en vez de JSX.Element
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user } = useAuth();

  // Si no hay usuario o NO es admin, lo mandamos a casa
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si es admin, le dejamos ver el contenido
  // Usamos fragmentos <>...</> para asegurar que devolvemos un nodo válido
  return <>{children}</>;
};

export default AdminRoute;