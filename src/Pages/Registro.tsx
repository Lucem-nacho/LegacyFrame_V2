import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Registro = () => {
  const navigate = useNavigate();

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
  
  // Estado para la validación de la contraseña en tiempo real
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
  });

  // useEffect para validar la contraseña mientras el usuario escribe
  useEffect(() => {
    const password = formData.password;
    setPasswordValidations({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password]);

  // Maneja los cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Valida el formulario completo
  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.apellido) newErrors.apellido = 'El apellido es obligatorio.';
    if (!formData.email) newErrors.email = 'El email es obligatorio.';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'El formato del email no es válido.';
    
    // Comprueba todas las validaciones de contraseña
    if (Object.values(passwordValidations).some(v => !v)) {
        newErrors.password = 'La contraseña no cumple con todos los requisitos.';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }
    if (!formData.terms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (validateForm()) {
      alert(`¡Registro exitoso para ${formData.nombre}! Serás redirigido al login.`);
      navigate('/login');
    }
  };

  return (
    <div className="register-page-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="register-card">
              <div className="register-card-header text-center">
                <h2 className="fw-bold">Crear una Cuenta</h2>
                <p className="text-muted">Únete a Legacy Frames para una experiencia de compra única.</p>
              </div>
              <div className="register-card-body">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row">
                    {/* Nombre */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre</label>
                      <input type="text" className={`form-control ${submitted && errors.nombre ? 'is-invalid' : ''}`} id="nombre" name="nombre" value={formData.nombre} onChange={handleChange}/>
                      {submitted && errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                    </div>
                    {/* Apellido */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="apellido" className="form-label">Apellido</label>
                      <input type="text" className={`form-control ${submitted && errors.apellido ? 'is-invalid' : ''}`} id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} />
                      {submitted && errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                    </div>
                  </div>
                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input type="email" className={`form-control ${submitted && errors.email ? 'is-invalid' : ''}`} id="email" name="email" value={formData.email} onChange={handleChange}/>
                    {submitted && errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="row">
                    {/* Teléfono */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="telefono" className="form-label">Teléfono (Opcional)</label>
                      <input type="tel" className="form-control" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange}/>
                    </div>
                    {/* Dirección */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="direccion" className="form-label">Dirección (Opcional)</label>
                      <input type="text" className="form-control" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange}/>
                    </div>
                  </div>
                  <div className="row">
                    {/* Contraseña */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password">Contraseña</label>
                      <input type="password" className={`form-control ${submitted && errors.password ? 'is-invalid' : ''}`} id="password" name="password" value={formData.password} onChange={handleChange}/>
                      <div className="password-strength-indicator mt-2">
                        <ul>
                          <li className={passwordValidations.minLength ? 'text-success' : 'text-muted'}>
                            <i className={`fas ${passwordValidations.minLength ? 'fa-check-circle' : 'fa-times-circle'} me-2`}></i>
                            Al menos 8 caracteres
                          </li>
                          <li className={passwordValidations.hasUpper ? 'text-success' : 'text-muted'}>
                            <i className={`fas ${passwordValidations.hasUpper ? 'fa-check-circle' : 'fa-times-circle'} me-2`}></i>
                            Una letra mayúscula
                          </li>
                          <li className={passwordValidations.hasNumber ? 'text-success' : 'text-muted'}>
                            <i className={`fas ${passwordValidations.hasNumber ? 'fa-check-circle' : 'fa-times-circle'} me-2`}></i>
                            Un número
                          </li>
                          <li className={passwordValidations.hasSpecial ? 'text-success' : 'text-muted'}>
                            <i className={`fas ${passwordValidations.hasSpecial ? 'fa-check-circle' : 'fa-times-circle'} me-2`}></i>
                            Un carácter especial (!@#$...)
                          </li>
                        </ul>
                      </div>
                      {submitted && errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    </div>
                    {/* Confirmar Contraseña */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                      <input type="password" className={`form-control ${submitted && errors.confirmPassword ? 'is-invalid' : ''}`} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}/>
                      {submitted && errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                  </div>
                  {/* Checkbox Newsletter */}
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="newsletter" name="newsletter" checked={formData.newsletter} onChange={handleChange}/>
                    <label className="form-check-label" htmlFor="newsletter">
                      Deseo recibir noticias y ofertas especiales.
                    </label>
                  </div>
                  {/* Checkbox de Términos y Condiciones */}
                  <div className="form-check mb-4">
                    <input className={`form-check-input ${submitted && errors.terms ? 'is-invalid' : ''}`} type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange}/>
                    <label className="form-check-label" htmlFor="terms">
                      Acepto los <Link to="/terminos" target="_blank">Términos y Condiciones</Link>
                    </label>
                    {submitted && errors.terms && (
                      <div className="invalid-feedback d-block">{errors.terms}</div>
                    )}
                  </div>
                  {/* Botón de envío */}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary fw-bold">
                      Crear Cuenta
                    </button>
                  </div>
                  <div className="text-center mt-3">
                    <small>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></small>
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