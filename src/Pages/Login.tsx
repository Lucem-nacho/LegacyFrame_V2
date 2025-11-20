import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // <--- IMPORTANTE

interface LoginProps {
  onLoginSuccess?: () => void;
}

type FormErrors = {
  email?: string;
  password?: string;
  login?: string;
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth(); // Mantenemos esto por si usas el contexto para otras cosas
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string) => {
    if (!email) return 'El correo es obligatorio.';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? '' : 'Formato de correo inválido.';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'La contraseña es obligatoria.';
    return '';
  };

  // --- AQUÍ ESTÁ LA LÓGICA CONECTADA AL MICROSERVICIO ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones locales
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) return;

    try {
      // 1. Llamada a tu API Spring Boot
      const response = await axios.post('http://localhost:8082/auth/login', {
        email: email,
        password: password
      });

      // 2. Si funciona, obtenemos el token
      const token = response.data.token;
      
      // 3. Guardamos el token en el navegador
      localStorage.setItem('token', token);
      console.log("Login exitoso, Token:", token);

      // 4. Limpiamos errores
      setErrors({});

      // 5. Redirección
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // Si tu AuthContext tiene una función login, podrías llamarla aquí también si quieres
        // login(token); 
        navigate('/'); // Te lleva a la página principal
      }

    } catch (error: any) {
      console.error("Error login:", error);
      // Si falla (403 Forbidden o 401 Unauthorized)
      setErrors({ login: 'Correo electrónico o contraseña incorrectos.' });
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card login-card shadow-lg border-0 rounded-4">
              <div className="card-body login-card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="login-title fw-bold text-primary">Bienvenido</h2>
                  <p className="text-muted">Ingresa a tu cuenta para continuar</p>
                </div>

                {/* Mensaje de error general del login (del backend) */}
                {errors.login && (
                  <div className="alert alert-danger text-center" role="alert">
                    {errors.login}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Campo Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">Correo Electrónico</label>
                    <input
                      type="email"
                      className={`form-control form-control-lg ${emailError ? 'is-invalid' : ''}`}
                      id="email"
                      placeholder="nombre@ejemplo.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(validateEmail(e.target.value));
                      }}
                      onBlur={() => setEmailError(validateEmail(email))}
                      required
                    />
                    {emailError && <div className="form-text text-danger">{emailError}</div>}
                  </div>

                  {/* Campo Contraseña */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
                    <input
                      type="password"
                      className={`form-control form-control-lg ${passwordError ? 'is-invalid' : ''}`}
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError(validatePassword(e.target.value));
                      }}
                      onBlur={() => setPasswordError(validatePassword(password))}
                      required
                    />
                    {passwordError && <div className="form-text text-danger">{passwordError}</div>}
                  </div>

                  {/* Botón de envío */}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary fw-bold py-2" disabled={!!validateEmail(email) || !!validatePassword(password)}>
                      Ingresar
                    </button>
                  </div>

                  {/* Enlace a registro */}
                  <div className="text-center mt-4">
                    <small>¿No tienes una cuenta? <Link to="/registro" className="text-decoration-none fw-bold">Regístrate aquí</Link></small>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;