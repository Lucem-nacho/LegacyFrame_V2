import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (val: string) => {
    if (!val) return 'El correo es obligatorio.';
    if (!/^\S+@\S+\.\S+$/.test(val)) return 'El formato del correo no es válido.';
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val) return 'La contraseña es obligatoria.';
    if (val.length < 6) return 'Mínimo 6 caracteres.';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpia errores previos

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(validateEmail(e.target.value));
                      }}
                      onBlur={() => setEmailError(validateEmail(email))}
                      required
                    />
                    {emailError && <div className="form-text text-danger">{emailError}</div>}
                  </div>

                  {/* Contraseña */}
                  <div className="mb-4">
                    <label htmlFor="password">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
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
                    <button type="submit" className="btn btn-primary fw-bold" disabled={!!validateEmail(email) || !!validatePassword(password)}>
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