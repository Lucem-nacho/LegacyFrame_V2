import { useState, useEffect } from 'react'; // Importa hooks de React para manejar estado y efectos secundarios.
import { Link, useNavigate } from 'react-router-dom'; // Importa componentes de React Router para navegación y enlaces.

// Define el componente funcional Registro.
const Registro = () => {
  // Inicializa el hook useNavigate para poder redirigir al usuario programáticamente.
  const navigate = useNavigate();

  // Define el estado inicial para los datos del formulario.
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '', // Campo opcional
    direccion: '', // Campo opcional
    password: '',
    confirmPassword: '',
    newsletter: false, // Checkbox para suscribirse a noticias
    terms: false, // Checkbox para aceptar términos y condiciones
  });

  // Define un tipo 'Errors' para el objeto que contendrá los mensajes de error de validación.
  // Partial<Record<...>> significa que todas las propiedades son opcionales.
  type Errors = Partial<Record<keyof typeof formData | 'password' | 'confirmPassword' | 'terms' | 'email', string>>;
  // Define el estado para almacenar los errores de validación del formulario. Inicialmente vacío.
  const [errors, setErrors] = useState<Errors>({});
  // Define un estado para saber si el formulario ha sido enviado al menos una vez. Se usa para mostrar errores.
  const [submitted, setSubmitted] = useState(false);

  // Define un estado para almacenar el resultado de las validaciones de la contraseña en tiempo real.
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false, // ¿Tiene al menos 8 caracteres?
    hasUpper: false, // ¿Tiene al menos una mayúscula?
    hasNumber: false, // ¿Tiene al menos un número?
    hasSpecial: false, // ¿Tiene al menos un carácter especial?
  });

  // Hook useEffect que se ejecuta cada vez que cambia el valor de 'formData.password'.
  // Se usa para validar la fortaleza de la contraseña en tiempo real mientras el usuario escribe.
  useEffect(() => {
    const password = formData.password; // Obtiene la contraseña actual del estado.
    // Actualiza el estado 'passwordValidations' basado en si la contraseña cumple cada requisito.
    setPasswordValidations({
      minLength: password.length >= 8, // Verifica longitud mínima.
      hasUpper: /[A-Z]/.test(password), // Verifica si contiene al menos una letra mayúscula.
      hasNumber: /[0-9]/.test(password), // Verifica si contiene al menos un número.
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password), // Verifica si contiene al menos un carácter especial.
    });
  }, [formData.password]); // El array de dependencias asegura que el efecto solo se ejecute cuando 'formData.password' cambie.

  // Función manejadora para actualizar el estado 'formData' cuando cambia cualquier input del formulario.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extrae las propiedades relevantes del evento del input.
    const { name, value, type, checked } = e.target;
    // Actualiza el estado 'formData'.
    setFormData({
      ...formData, // Mantiene los valores anteriores del estado.
      // Actualiza la propiedad correspondiente ('name' del input).
      // Si es un checkbox, usa 'checked'; si no, usa 'value'.
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Función para validar todos los campos del formulario. Se llama al intentar enviar.
  const validateForm = (): boolean => {
    // Crea un objeto temporal para almacenar los nuevos errores encontrados.
    const newErrors: Errors = {};
    // Valida campo Nombre: no debe estar vacío.
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    // Valida campo Apellido: no debe estar vacío.
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio.';
    // Valida campo Email: no debe estar vacío.
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio.';
    // Valida formato de Email usando una expresión regular simple.
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'El formato del email no es válido.';

    // Valida Contraseña: verifica si alguna de las validaciones en tiempo real (guardadas en 'passwordValidations') es falsa.
    if (Object.values(passwordValidations).some(v => !v)) {
        newErrors.password = 'La contraseña no cumple con todos los requisitos.';
    }

    // Valida Confirmar Contraseña: debe ser igual a la contraseña.
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }
    // Valida Términos y Condiciones: el checkbox debe estar marcado.
    if (!formData.terms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones.';
    }

    // Actualiza el estado 'errors' con los errores encontrados.
    setErrors(newErrors);
    // Devuelve 'true' si el objeto 'newErrors' está vacío (no hubo errores), 'false' si hubo algún error.
    return Object.keys(newErrors).length === 0;
  };

  // Función manejadora para el evento 'submit' del formulario.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página).
    setSubmitted(true); // Marca el formulario como enviado para empezar a mostrar errores.
    // Llama a la función de validación. Si devuelve 'true' (formulario válido)...
    if (validateForm()) {
      // Muestra una alerta de éxito personalizada.
      alert(`¡Registro exitoso para ${formData.nombre}! Serás redirigido al login.`);
      // Redirige al usuario a la página de login.
      navigate('/login');
    }
    // Si 'validateForm()' devuelve 'false', no hace nada más, los errores ya se mostraron.
  };

  // Retorna la estructura JSX del componente de registro.
  return (
    <div className="register-page-container"> {/* Contenedor principal de la página */}
      <div className="container py-5"> {/* Contenedor de Bootstrap con padding vertical */}
        <div className="row justify-content-center"> {/* Fila de Bootstrap para centrar el contenido */}
          <div className="col-lg-8"> {/* Columna que ocupa 8/12 en pantallas grandes */}
            <div className="register-card"> {/* Tarjeta visual para el formulario */}
              <div className="register-card-header text-center"> {/* Cabecera de la tarjeta */}
                <h2 className="fw-bold">Crear una Cuenta</h2>
                <p className="text-muted">Únete a Legacy Frames para una experiencia de compra única.</p>
              </div>
              <div className="register-card-body"> {/* Cuerpo de la tarjeta */}
                {/* Formulario con evento onSubmit y 'noValidate' para deshabilitar validación HTML5 */}
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row"> {/* Fila para Nombre y Apellido */}
                    {/* Campo Nombre */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre</label>
                      {/* Input para el nombre. Aplica clase 'is-invalid' si hay error y el form fue enviado */}
                      <input type="text" className={`form-control ${submitted && errors.nombre ? 'is-invalid' : ''}`} id="nombre" name="nombre" value={formData.nombre} onChange={handleChange}/>
                      {/* Muestra el mensaje de error si existe y el form fue enviado */}
                      {submitted && errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                    </div>
                    {/* Campo Apellido */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="apellido" className="form-label">Apellido</label>
                      <input type="text" className={`form-control ${submitted && errors.apellido ? 'is-invalid' : ''}`} id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} />
                      {submitted && errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                    </div>
                  </div>
                  {/* Campo Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input type="email" className={`form-control ${submitted && errors.email ? 'is-invalid' : ''}`} id="email" name="email" value={formData.email} onChange={handleChange}/>
                    {submitted && errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="row"> {/* Fila para Teléfono y Dirección */}
                    {/* Campo Teléfono (Opcional) */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="telefono" className="form-label">Teléfono (Opcional)</label>
                      {/* No tiene validación de error porque es opcional */}
                      <input type="tel" className="form-control" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange}/>
                    </div>
                    {/* Campo Dirección (Opcional) */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="direccion" className="form-label">Dirección (Opcional)</label>
                      {/* No tiene validación de error porque es opcional */}
                      <input type="text" className="form-control" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange}/>
                    </div>
                  </div>
                  <div className="row"> {/* Fila para Contraseña y Confirmar Contraseña */}
                    {/* Campo Contraseña */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password">Contraseña</label>
                      <input type="password" className={`form-control ${submitted && errors.password ? 'is-invalid' : ''}`} id="password" name="password" value={formData.password} onChange={handleChange}/>
                      {/* Indicador de fortaleza de contraseña en tiempo real */}
                      <div className="password-strength-indicator mt-2">
                        <ul>
                          {/* Cada 'li' muestra un requisito y cambia de color/icono según 'passwordValidations' */}
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
                      {/* Muestra el error general de contraseña si existe y el form fue enviado */}
                      {submitted && errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    </div>
                    {/* Campo Confirmar Contraseña */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                      <input type="password" className={`form-control ${submitted && errors.confirmPassword ? 'is-invalid' : ''}`} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}/>
                      {/* Muestra el error si las contraseñas no coinciden */}
                      {submitted && errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                  </div>
                  {/* Checkbox Newsletter (Opcional) */}
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="newsletter" name="newsletter" checked={formData.newsletter} onChange={handleChange}/>
                    <label className="form-check-label" htmlFor="newsletter">
                      Deseo recibir noticias y ofertas especiales.
                    </label>
                  </div>
                  {/* Checkbox de Términos y Condiciones (Obligatorio) */}
                  <div className="form-check mb-4">
                    <input className={`form-check-input ${submitted && errors.terms ? 'is-invalid' : ''}`} type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange}/>
                    <label className="form-check-label" htmlFor="terms">
                      {/* Enlace a la página de Términos y Condiciones */}
                      Acepto los <Link to="/terminos" target="_blank">Términos y Condiciones</Link>
                    </label>
                    {/* Muestra el error si no se aceptaron los términos */}
                    {submitted && errors.terms && (
                      <div className="invalid-feedback d-block">{errors.terms}</div>
                    )}
                  </div>
                  {/* Botón de envío del formulario */}
                  <div className="d-grid"> {/* Contenedor para que el botón ocupe todo el ancho */}
                    <button type="submit" className="btn btn-primary fw-bold">
                      Crear Cuenta
                    </button>
                  </div>
                  {/* Enlace para ir a la página de Login si ya se tiene cuenta */}
                  <div className="text-center mt-3">
                    <small>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></small>
                  </div>
                </form> {/* Cierre del formulario */}
              </div> {/* Cierre de 'register-card-body' */}
            </div> {/* Cierre de 'register-card' */}
          </div> {/* Cierre de 'col-lg-8' */}
        </div> {/* Cierre de 'row' */}
      </div> {/* Cierre de 'container' */}
    </div> // Cierre del div principal del componente
  );
};

// Exporta el componente Registro para poder usarlo en otras partes (ej. App.tsx).
export default Registro;