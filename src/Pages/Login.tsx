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

  // --- Define el estado para almacenar los errores de validación, usando el tipo FormErrors ---
  // Inicializado como un objeto vacío, indicando que no hay errores al principio.
  const [errors, setErrors] = useState<FormErrors>({});

  // --- Función separada para validar los campos del formulario ---
  // Revisa campos vacíos y formato de email. No verifica las credenciales.
  const validate = (): boolean => {
    // Crea un objeto temporal para acumular los errores encontrados en esta validación.
    const newErrors: FormErrors = {};

    // 1. Validar el campo Email
    // Verifica si el campo email está vacío
    if (!email.trim()) { // Se usa trim() para considerar inválido un email que solo contenga espacios.
      newErrors.email = 'El correo es obligatorio'; // Asigna mensaje de error si está vacío.
    }
    // Si no está vacío, verifica si cumple con el formato básico de email usando una expresión regular.
    else if (!/^\S+@\S+\.\S+$/.test(email)) { 
      newErrors.email = 'El formato del correo no es válido'; // Asigna mensaje de error si el formato es inválido.
    }

    // 2. Validar el campo Contraseña
    // Verifica si el campo password está vacío.
    if (!password) { 
      newErrors.password = 'La contraseña es obligatoria'; // Asigna mensaje de error si está vacío.
    }

    // Actualiza el estado 'errors' con los errores encontrados (o un objeto vacío si no hubo errores).
    // Esto provocará que el componente se re-renderice y muestre los mensajes de error.
    setErrors(newErrors);

    // Devuelve 'true' si el objeto 'newErrors' no tiene ninguna propiedad (es decir, está vacío, sin errores).
    // Devuelve 'false' si 'newErrors' contiene alguna propiedad (hubo al menos un error).
    return Object.keys(newErrors).length === 0;
  };


  // --- Función para el evento 'submit' del formulario ---
  // Se ejecuta cuando el usuario hace clic en el botón 'Ingresar'.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del navegador (recargar la página).

    // 1. Llama a la función 'validate()' para realizar las validaciones básicas.
    // Si 'validate()' devuelve 'false' (hubo errores de validación)...
    if (!validate()) {
      return; // Detiene la ejecución de handleSubmit, no intenta el login. Los errores ya se mostraron al llamar a setErrors dentro de validate().
    }

    // 2. Si las validaciones básicas pasaron ('validate()' devolvió 'true'), simula el proceso de login.
    // Verifica si las credenciales coinciden con las predefinidas
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
                      type="email" // Tipo de input para validación semántica y teclados móviles adecuados.
                      // Aplica dinámicamente la clase 'is-invalid' de Bootstrap si existe un error para 'email' en el estado 'errors'.
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email" // ID único para enlazar con el label (atributo htmlFor).
                      value={email} // Vincula el valor mostrado en el input al estado 'email' de React (controlled component).
                      // Función que se ejecuta cada vez que el valor del input cambia. Actualiza el estado 'email'.
                      onChange={(e) => setEmail(e.target.value)}
                      required // Atributo HTML5 que indica campo obligatorio (útil para accesibilidad y fallback).
                    />
                    {/* Renderizado condicional: Muestra el mensaje de error específico para 'email' si existe. */}
                    {errors.email && (
                      // Contenedor estándar de Bootstrap para mensajes de error de formulario, se muestra debajo del input.
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Grupo del campo Contraseña */}
                  <div className="mb-4"> {/* Margen inferior 4 */}
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                      type="password" // Oculta los caracteres escritos en el input.
                      // Aplica la clase 'is-invalid' si existe un error para 'password'.
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password" // ID para enlazar con el label.
                      value={password} // Vincula el valor al estado 'password'.
                      // Actualiza el estado 'password' al escribir.
                      onChange={(e) => setPassword(e.target.value)}
                      required // Atributo HTML5.
                    />
                    {/* Muestra el mensaje de error específico para 'password' si existe. */}
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  {/* Botón de envío del formulario */}
                  <div className="d-grid"> {/* Contenedor de Bootstrap para que el botón ocupe todo el ancho disponible */}
                    <button type="submit" className="btn btn-primary fw-bold"> {/* Botón primario con texto en negrita */}
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
      </div> {/* Fin del contenedor Bootstrap */}
    </div> // Fin del contenedor principal de la página
  );
};

// Exporta el componente Login para que pueda ser importado y usado en otras partes de la aplicación (ej. App.tsx).
export default Login;