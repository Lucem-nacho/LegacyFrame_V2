import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // --- FUNCIÓN PARA DECODIFICAR EL JWT MANUALMENTE ---
  // (Esto extrae los datos que vienen ocultos en el token)
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8082/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      
      // 1. Decodificamos el token para leer el rol y el email
      const decoded = parseJwt(token);
      
      console.log("Datos del token:", decoded); // Para verificar en consola

      // 2. Preparamos el objeto Usuario según lo que espera el Contexto
      // (Aquí convertimos el rol de texto a un booleano isAdmin)
      const userData = {
        email: decoded.sub, // 'sub' suele ser el email en JWT estándar
        nombre: decoded.nombre,
        isAdmin: decoded.rol === "ADMIN" || decoded.rol === "ROLE_ADMIN" // Verificamos si es admin
      };

      // 3. ¡Ahora sí! Llamamos al login con los DOS argumentos
      login(token, userData);

      // 4. Redirección inteligente
      if (userData.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/perfil"); // O al Home "/"
      }
      
    } catch (error) {
      console.error("Error en login:", error);
      alert("Credenciales incorrectas o error en el servidor.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">Iniciar Sesión</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Ingresar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;