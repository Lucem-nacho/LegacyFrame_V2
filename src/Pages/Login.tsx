import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpia errores previos

    // --- SIMULACIÓN DE LOGIN ---
    // En una aplicación real, aquí validarías los datos con tu backend
    if (email === "a@a.cl" && password === "Pass123#") {
      alert('¡Inicio de sesión exitoso!');
      navigate('/'); // Redirige al inicio después del login
    } else {
      setError('Correo electrónico o contraseña incorrectos.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="login-card">
              <div className="login-card-header text-center">
                <h2 className="fw-bold">Iniciar Sesión</h2>
                <p className="text-muted">
                  Bienvenido de nuevo a Legacy Frames.
                </p>
              </div>
              <div className="login-card-body">
                <form onSubmit={handleSubmit} noValidate>
                  {/* Mensaje de error */}
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Contraseña */}
                  <div className="mb-4">
                    <label htmlFor="password">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Botón de envío */}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary fw-bold">
                      Ingresar
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <small>¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></small>
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