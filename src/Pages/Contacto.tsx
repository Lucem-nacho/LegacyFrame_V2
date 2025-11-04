import React, { useState } from "react";

const Contacto: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  // --- Estados para errores de nombre y email ---
  const [nombreError, setNombreError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Limpiar todos los errores previos
    setMensajeError(null);
    setNombreError(null);
    setEmailError(null);

    let isValid = true; // Flag para controlar si todo es válido

    // ---Validar Nombre ---
    if (!nombre.trim()) {
      setNombreError("El nombre es obligatorio.");
      isValid = false;
    }

    // ---Validar Email ---
    if (!email.trim()) {
      setEmailError("El email es obligatorio.");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) { // Validación básica de formato de email
      setEmailError("El formato del email no es válido.");
      isValid = false;
    }

    // Validar Mensaje 
    const charCount = mensaje.length;
    if (charCount < 10) {
      setMensajeError("El mensaje debe tener al menos 10 caracteres.");
      isValid = false;
    } else if (charCount > 300) {
      setMensajeError("El mensaje no puede exceder los 300 caracteres.");
      isValid = false;
    }

    // Si alguna validación falló, detenemos el envío
    if (!isValid) {
      return;
    }

    // Si todas las validaciones pasan
    alert(`Gracias ${nombre}, tu mensaje ha sido enviado!`);
    setNombre("");
    setEmail("");
    setMensaje("");
    setSubmitted(false);
    // Limpiamos errores al enviar con éxito (aunque ya se limpian al inicio)
    setNombreError(null);
    setEmailError(null);
    setMensajeError(null);
  };

  return (
    <div className="contact-page-container">
      <div className="text-center">
        <h1 className="fw-bold display-5 mb-3">Contacto 📬</h1>
        <p className="lead mb-4">
          Completa el formulario y nos pondremos en contacto contigo.
        </p>
        <form onSubmit={handleSubmit} className="w-100 form-max-500 text-start" noValidate>
          {/* Campo Nombre */}
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              // --- Si hay error ---
              className={`form-control ${submitted && nombreError ? 'is-invalid' : ''}`}
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                // Limpia el error al escribir
                if (submitted) setNombreError(null);
              }}
              required
            />
            {/* ---Muestra el error de nombre --- */}
            {submitted && nombreError && (
              <div className="invalid-feedback d-block">{nombreError}</div>
            )}
          </div>
          {/* Campo Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              // --- Si hay error ---
              className={`form-control ${submitted && emailError ? 'is-invalid' : ''}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                 // Limpia el error al escribir
                if (submitted) setEmailError(null);
              }}
              required
            />
            {/* --- Muestra el error de email --- */}
            {submitted && emailError && (
              <div className="invalid-feedback d-block">{emailError}</div>
            )}
          </div>
          {/* Campo Mensaje */}
          <div className="mb-3">
            <label htmlFor="mensaje" className="form-label">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              className={`form-control ${submitted && mensajeError ? 'is-invalid' : ''}`}
              value={mensaje}
              onChange={(e) => {
                const currentMessage = e.target.value;
                setMensaje(currentMessage);
                if (submitted) {
                    const count = currentMessage.length;
                    if (count < 10) setMensajeError("Mínimo 10 caracteres.");
                    else if (count > 300) setMensajeError("Máximo 300 caracteres.");
                    else setMensajeError(null);
                }
              }}
              required
              rows={4}
            ></textarea>
            {submitted && mensajeError && (
              <div className="invalid-feedback d-block">{mensajeError}</div>
            )}
            <div className="form-text text-end mt-1">
              {mensaje.length} / 300 caracteres
            </div>
          </div>
          <button type="submit" className="btn btn-light w-100">
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  );
};
export default Contacto;

