import React, { useState } from "react";
import axios from "axios";

const Contacto: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [nombreError, setNombreError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensajeError(null);
    setNombreError(null);
    setEmailError(null);
    setServerError(null);
    setSuccessMsg(null);

    let isValid = true;

    if (!nombre.trim()) {
      setNombreError("El nombre es obligatorio.");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("El email es obligatorio.");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("El formato del email no es válido.");
      isValid = false;
    }

    const charCount = mensaje.length;
    if (charCount < 10) {
      setMensajeError("El mensaje debe tener al menos 10 caracteres.");
      isValid = false;
    } else if (charCount > 300) {
      setMensajeError("El mensaje no puede exceder los 300 caracteres.");
      isValid = false;
    }

    if (!isValid) return;

    try {
      setLoading(true);
      const resp = await axios.post(`http://localhost:8081/api/contactos`, {
        nombre,
        email,
        mensaje,
      });

      if (resp.status === 200 || resp.status === 201) {
        setSuccessMsg("Mensaje enviado correctamente. Gracias.");
        setNombre("");
        setEmail("");
        setMensaje("");
      } else {
        setServerError("No fue posible enviar el mensaje. Intenta nuevamente.");
      }
    } catch (err: any) {
      // Si no hay respuesta del servidor (network/CORS/timeouts) mostramos mensaje personalizado
      if (!err?.response) {
        setServerError("No fue posible enviar el mensaje. Intenta nuevamente.");
      } else {
        // Si el servidor respondió, preferimos el mensaje que venga en la respuesta
        const msg = err.response?.data?.message || err.message || "Error de conexión con el servidor.";
        setServerError(msg);
      }
    } finally {
      setLoading(false);
    }
  }; // <-- cierre de handleSubmit agregado

  return (
    <div className="contact-page-container">
      <div className="text-center">
        <h1 className="fw-bold display-5 mb-3">Contacto 📬</h1>
        <p className="lead mb-4">
          Completa el formulario y nos pondremos en contacto contigo.
        </p>

        {serverError && <div className="alert alert-danger">{serverError}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="w-100 form-max-500 text-start" noValidate>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className={`form-control ${nombreError ? "is-invalid" : ""}`}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {nombreError && <div className="invalid-feedback">{nombreError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className="invalid-feedback">{emailError}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Mensaje</label>
            <textarea
              className={`form-control ${mensajeError ? "is-invalid" : ""}`}
              rows={5}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />
            {mensajeError && <div className="invalid-feedback">{mensajeError}</div>}
            <div className="form-text text-end">{mensaje.length}/300</div>
          </div>

          <button type="submit" className="btn btn-light w-100" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Mensaje"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contacto;