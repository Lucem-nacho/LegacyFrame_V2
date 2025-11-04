import React, { useState } from 'react'; // Importa React y el hook useState. 'React' es necesario para JSX y <React.FormEvent>.
import { Link, useNavigate } from 'react-router-dom'; // Importa Link para enlaces de navegación y useNavigate para redirección programática.

// --- Define la interfaz para las props que el componente Login puede recibir ---
interface LoginProps {
  onLoginSuccess?: () => void; // Declara una prop opcional 'onLoginSuccess' que es una función sin argumentos ni retorno. Se llama en caso de login exitoso.
}

// --- Define un tipo para el objeto que almacenará los errores de validación del formulario ---
type FormErrors = {
  email?: string; 
  password?: string; 
  login?: string; 
};

// --- Define el componente funcional Login usando React.FC (Functional Component) y especificando sus props ---
// Recibe 'onLoginSuccess' como prop (desestructurado).
const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  // Inicializa el hook useNavigate para obtener la función de navegación.
  const navigate = useNavigate();
  // Define el estado para el campo 'email', inicializado como string vacío.
  const [email, setEmail] = useState('');
  // Define el estado para el campo 'password', inicializado como string vacío.
  const [password, setPassword] = useState('');
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

  // --- Define el estado para almacenar los errores de validación, usando el tipo FormErrors ---
  // Inicializado como un objeto vacío, indicando que no hay errores al principio.
  const [errors, setErrors] = useState<FormErrors>({});

  // Manejo de errores generales (ej. credenciales inválidas) se mostrará en 'errors.login'.


  // --- Función para el evento 'submit' del formulario ---
  // Se ejecuta cuando el usuario hace clic en el botón 'Ingresar'.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del navegador (recargar la página).
    // Validación de campos
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;
    if (email === "a@a.cl" && password === "Pass123#") {

      // Verifica si se proporcionó la prop 'onLoginSuccess' desde el componente padre (ej. App.tsx).
      if (onLoginSuccess) {
        onLoginSuccess(); // Llama a la función pasada por el componente padre para notificar el éxito. El padre decide qué hacer (ej. guardar token, redirigir).
      } else {
        alert('¡Inicio de sesión exitoso!'); // Muestra una alerta simple de éxito.
        navigate('/'); // Redirige al usuario a la página de inicio ('/').
      }

    } else {
      // --- Credenciales incorrectas ---
      // Si las credenciales no coinciden (pero el formato era válido), actualiza el estado 'errors'.
      // Se establece un error general en la propiedad 'login'.
      setErrors({ login: 'Correo electrónico o contraseña incorrectos.' });
    }
  };

  // --- Retorna la estructura JSX (la interfaz de usuario) del componente ---
  return (
    <div className="login-page-container">
      {/* Contenedor de Bootstrap con padding vertical */}
      <div className="container py-5">
        {/* Fila de Bootstrap para centrar el contenido horizontalmente */}
        <div className="row justify-content-center">
          {/* Columna responsiva: ocupa 5/12 en pantallas grandes (lg), 8/12 en medianas (md) */}
          <div className="col-lg-5 col-md-8">
            {/* Tarjeta visual que contiene el formulario */}
            <div className="login-card">
              {/* Cabecera de la tarjeta, centrada */}
              <div className="login-card-header text-center">
                <h2 className="fw-bold">Iniciar Sesión</h2>
                <p className="text-muted"> {/* Texto secundario */}
                  Bienvenido de nuevo a Legacy Frames.
                </p>
              </div>
              {/* Cuerpo de la tarjeta */}
              <div className="login-card-body">
                {/* Formulario HTML. Llama a handleSubmit al enviarse. 'noValidate' deshabilita validación nativa del navegador para usar la nuestra. */}
                <form onSubmit={handleSubmit} noValidate>

                  {/* Renderizado condicional: Muestra este div solo si existe la propiedad 'login' en el estado 'errors'. */}
                  {errors.login && (
                    // Muestra el error general de login (credenciales incorrectas) usando una alerta de Bootstrap.
                    <div className="alert alert-danger text-center">
                      {errors.login}
                    </div>
                  )}

                  {/* Grupo del campo Email */}
                  <div className="mb-3"> {/* Margen inferior 3 */}
                    {/* Etiqueta asociada al input 'email' */}
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

                  {/* Grupo del campo Contraseña */}
                  <div className="mb-4"> {/* Margen inferior 4 */}
                    <label htmlFor="password" className="form-label">Contraseña</label>
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

                  {/* Enlace para ir a la página de registro */}
                  <div className="text-center mt-4"> {/* Centra el texto y añade margen superior 4 */}
                    <small>¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></small> {/* Componente Link para navegación interna sin recargar */}
                  </div>
                </form> {/* Fin del formulario */}
              </div> {/* Fin de 'login-card-body' */}
            </div> {/* Fin de 'login-card' */}
          </div> {/* Fin de la columna */}
        </div> {/* Fin de la fila */}
      </div>
    </div>
  );
};

// Exporta el componente Login para que pueda ser importado y usado en otras partes de la aplicación (ej. App.tsx).
export default Login;