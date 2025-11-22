import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // <--- IMPORTANTE

const Registro = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    password: '',
    confirmPassword: '',
    newsletter: false,
    terms: false,
  });

  type Errors = Partial<Record<keyof typeof formData | 'password' | 'confirmPassword' | 'terms' | 'email', string>>;
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  // --- Validaciones (se mantienen igual) ---
  useEffect(() => {
    if (submitted) validateForm();
  }, [formData, submitted]);

  const validateForm = () => {
    const newErrors: Errors = {};
    let isValid = true;

    if (!formData.nombre.trim()) { newErrors.nombre = 'El nombre es obligatorio'; isValid = false; }
    if (!formData.apellido.trim()) { newErrors.apellido = 'El apellido es obligatorio'; isValid = false; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) { newErrors.email = 'El correo es obligatorio'; isValid = false; }
    else if (!emailRegex.test(formData.email)) { newErrors.email = 'Correo inválido'; isValid = false; }

    if (!formData.password) { newErrors.password = 'La contraseña es obligatoria'; isValid = false; }
    else if (formData.password.length < 6) { newErrors.password = 'Mínimo 6 caracteres'; isValid = false; }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    if (!formData.terms) { newErrors.terms = 'Debes aceptar los términos'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // --- AQUÍ ESTÁ LA LÓGICA CONECTADA AL MICROSERVICIO ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (validateForm()) {
      try {
        // 1. Preparamos los datos para Spring Boot
        const datosUsuario = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        };

        // 2. Enviamos al Backend
        await axios.post('http://localhost:8082/auth/register', datosUsuario);

        // 3. Éxito
        alert(`¡Registro exitoso para ${formData.nombre}! Ahora puedes iniciar sesión.`);
        navigate('/login');

      } catch (error: any) {
        console.error("Error en registro:", error);
        // Mensaje de error
        if (error.response && error.response.data) {
           // A veces el backend devuelve un objeto o un string
           const msg = typeof error.response.data === 'string' 
             ? error.response.data 
             : (error.response.data.message || JSON.stringify(error.response.data));
           alert("Error al registrarse: " + msg);
        } else {
           alert("Error de conexión con el servidor.");
        }
      }
    }
  };

  return (
    <div className="register-container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="card register-card shadow-lg border-0 rounded-4">
              <div className="card-body register-card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="register-title fw-bold text-primary">Crear una Cuenta</h2>
                  <p className="text-muted">Únete a nosotros completando tus datos</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Fila Nombre y Apellido */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Nombre</label>
                      <input type="text" className={`form-control ${submitted && errors.nombre ? 'is-invalid' : ''}`} name="nombre" value={formData.nombre} onChange={handleChange} />
                      {submitted && errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Apellido</label>
                      <input type="text" className={`form-control ${submitted && errors.apellido ? 'is-invalid' : ''}`} name="apellido" value={formData.apellido} onChange={handleChange} />
                      {submitted && errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Correo Electrónico</label>
                    <input type="email" className={`form-control ${submitted && errors.email ? 'is-invalid' : ''}`} name="email" value={formData.email} onChange={handleChange} />
                    {submitted && errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  {/* Fila Teléfono y Dirección */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Teléfono (Opcional)</label>
                      <input type="tel" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+569..." />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Dirección (Opcional)</label>
                      <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} />
                    </div>
                  </div>

                  {/* Fila Contraseñas */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Contraseña</label>
                      <input type="password" className={`form-control ${submitted && errors.password ? 'is-invalid' : ''}`} name="password" value={formData.password} onChange={handleChange} />
                      {submitted && errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Confirmar Contraseña</label>
                      <input type="password" className={`form-control ${submitted && errors.confirmPassword ? 'is-invalid' : ''}`} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                      {submitted && errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="newsletter" name="newsletter" checked={formData.newsletter} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="newsletter">Suscribirme a novedades</label>
                  </div>
                  <div className="mb-4 form-check">
                    <input type="checkbox" className={`form-check-input ${submitted && errors.terms ? 'is-invalid' : ''}`} id="terms" name="terms" checked={formData.terms} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="terms">
                      Acepto los <Link to="/terminos" target="_blank" className="text-decoration-none fw-bold">Términos y Condiciones</Link>
                    </label>
                    {submitted && errors.terms && <div className="invalid-feedback d-block">{errors.terms}</div>}
                  </div>

                  {/* Botón Crear Cuenta */}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary fw-bold py-2">Crear Cuenta</button>
                  </div>

                  {/* Enlace Login */}
                  <div className="text-center mt-3">
                    <small>¿Ya tienes una cuenta? <Link to="/login" className="text-decoration-none fw-bold">Inicia Sesión</Link></small>
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

export default Registro;