import React, { useState } from 'react'; // 'React' es necesario si usas <React.FormEvent>
import { Link, useNavigate } from 'react-router-dom';

// --- (Del Profe) Definimos el tipo de props que el componente puede recibir ---
interface LoginProps {
  onLoginSuccess?: () => void; // Una función opcional que se llamará si el login es exitoso
}

// --- (Del Profe) Definimos el tipo de objeto para los errores ---
// Esto nos permite tener errores específicos para 'email', 'password' o 'login' general
type FormErrors = {
  email?: string;
  password?: string;
  login?: string;
};

// --- (Del Profe) Usamos React.FC (Functional Component) y le pasamos las props ---
const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- (Del Profe) Cambiamos el estado de 'error' de un string a un objeto ---
  const [errors, setErrors] = useState<FormErrors>({});

  // --- (Del Profe) Función de validación separada ---
  // Esta función revisa SÓLO si el formulario es válido (campos vacíos, formato, etc.)
  const validate = (): boolean => {
    const newErrors: FormErrors = {}; // Objeto temporal para guardar errores

    // 1. Validar Email
    if (!email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) { // Expresión regular para formato de email
      newErrors.email = 'El formato del correo no es válido';
    }

    // 2. Validar Contraseña
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    }
    
    setErrors(newErrors); // Actualiza el estado con los errores encontrados

    // Devuelve 'true' si el objeto newErrors está vacío (no hay errores)
    return Object.keys(newErrors).length === 0; 
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Primero, validamos el formulario
    // Si la función validate() devuelve 'false', detenemos el envío
    if (!validate()) {
      return; 
    }

    // 2. Si la validación pasa, SIMULAMOS EL LOGIN (Tu lógica)
    if (email === "a@a.cl" && password === "Pass123#") {
      
      // --- (Del Profe) Notificamos al padre que el login fue exitoso ---
      if (onLoginSuccess) {
        onLoginSuccess(); // Llama a la función que nos pasaron
      } else {
        // Si no nos pasaron 'onLoginSuccess', hacemos la acción por defecto
        alert('¡Inicio de sesión exitoso!');
        navigate('/'); 
      }

    } else {
      // --- (Del Profe) Error de credenciales incorrectas ---
      // Usamos el error 'login' para un mensaje general
      setErrors({ login: 'Correo electrónico o contraseña incorrectos.' });
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
                <form onSubmit={handleSubmit} noValidate> {/* 'noValidate' evita la validación de HTML5 */}
                  
                  {/* (Del Profe) Mostramos el error de login general */}
                  {errors.login && (
                    <div className="alert alert-danger text-center">
                      {errors.login}
                    </div>
                  )}

                  {/* Campo Email */}
                  <div className="mb-3"> {/* (Cambiado de mb-4 a mb-3 por consistencia) */}
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input
                      type="email"
                      // --- (Del Profe) Añadimos 'is-invalid' si hay error de email ---
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {/* --- (Del Profe) Mostramos el error específico del email --- */}
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Contraseña */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Contraseña</label> {/* (Añadido 'form-label') */}
                    <input
                      type="password"
                      // --- (Del Profe) Añadimos 'is-invalid' si hay error de contraseña ---
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {/* --- (Del Profe) Mostramos el error específico de la contraseña --- */}
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
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