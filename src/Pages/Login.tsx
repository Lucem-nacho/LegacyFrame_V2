import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:8082/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      const decoded = parseJwt(token);

      console.log("Decoded Token:", decoded);

      // --- Validar ROLE_ADMIN ---
      const userData = {
        email: decoded.sub,
        nombre: decoded.nombre,
        isAdmin: decoded.rol === "ROLE_ADMIN" || decoded.rol === "ADMIN"
      };

      login(token, userData);

      if (userData.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/perfil");
      }
      
    } catch (error) {
      console.error("Error en login:", error);
      alert("Credenciales incorrectas o error en el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100 py-5">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-primary text-white text-center py-4 border-0">
                <h2 className="mb-1">
                  <i className="fas fa-user-circle me-2"></i>
                  Iniciar Sesión
                </h2>
                <p className="mb-0 opacity-75">Accede a tu cuenta Legacy Frames</p>
              </div>

              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-envelope me-2 text-primary"></i>
                      Correo Electrónico
                    </label>
                    <input 
                      type="email" 
                      className="form-control form-control-lg rounded-3 shadow-sm"
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-lock me-2 text-primary"></i>
                      Contraseña
                    </label>
                    <div className="input-group shadow-sm">
                      <input 
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg rounded-start-3"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        disabled={loading}
                      />
                      <button 
                        className="btn btn-outline-secondary rounded-end-3" 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 rounded-3 shadow-sm mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Ingresando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Ingresar
                      </>
                    )}
                  </button>

                  <div className="text-center my-4">
                    <hr className="my-3" />
                    <span className="text-muted small">¿No tienes una cuenta?</span>
                  </div>

                  <Link 
                    to="/registro" 
                    className="btn btn-outline-primary btn-lg w-100 rounded-3 shadow-sm"
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Crear Cuenta Nueva
                  </Link>
                </form>
              </div>

              <div className="card-footer bg-light text-center py-3 border-0">
                <small className="text-muted">
                  <i className="fas fa-shield-alt me-1"></i>
                  Tus datos están protegidos
                </small>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-muted">
                <i className="fas fa-phone me-2"></i>
                ¿Problemas para ingresar? 
                <Link to="/contacto" className="ms-1 text-decoration-none">Contáctanos</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;