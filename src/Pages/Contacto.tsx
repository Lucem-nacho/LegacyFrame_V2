import React, { useState } from "react";
import axios from "axios";

const Contacto: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState(""); // Esto coincide con tu backend
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Errores de validación visual
  const [nombreError, setNombreError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setNombreError(null);
    setEmailError(null);
    setMensajeError(null);

    // Validaciones simples
    let valid = true;
    if (!nombre.trim()) { setNombreError("Nombre obligatorio"); valid = false; }
    if (!email.trim()) { setEmailError("Email obligatorio"); valid = false; }
    if (!mensaje.trim()) { setMensajeError("Mensaje obligatorio"); valid = false; }

    if (!valid) return;

    setLoading(true);

    try {
      // --- CONEXIÓN AL MS_CONTACTO (Puerto 8081) ---
      // Endpoint: http://localhost:8081/api/contactos
      await axios.post("http://localhost:8081/api/contactos", {
        nombre: nombre,
        email: email,
        mensaje: mensaje // En Java se llama 'mensaje'
      });
      
      setSuccessMsg("¡Mensaje enviado con éxito! Te responderemos pronto.");
      setNombre("");
      setEmail("");
      setMensaje("");
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setErrorMsg("Hubo un error al conectar con el servidor de contacto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">Contáctanos</h1>
          <p className="lead text-muted">Estamos aquí para resolver tus dudas.</p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-4">
            <div className="card-body">
              {successMsg && <div className="alert alert-success">{successMsg}</div>}
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    className={`form-control ${nombreError ? "is-invalid" : ""}`}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                  />
                  {nombreError && <div className="invalid-feedback">{nombreError}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@ejemplo.com"
                  />
                  {emailError && <div className="invalid-feedback">{emailError}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Tu Mensaje</label>
                  <textarea
                    className={`form-control ${mensajeError ? "is-invalid" : ""}`}
                    rows={5}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Cuéntanos qué necesitas..."
                  />
                  {mensajeError && <div className="invalid-feedback">{mensajeError}</div>}
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Mensaje"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mt-5 mt-lg-0">
          <div className="p-4 bg-light rounded shadow-sm">
            <h4 className="mb-4 text-primary">Información</h4>
            <p className="mb-3"><i className="fas fa-map-marker-alt me-2 text-primary"></i> Departamental 623, Santiago</p>
            <p className="mb-3"><i className="fas fa-phone me-2 text-primary"></i> +56 9 1234 5678</p>
            <p className="mb-3"><i className="fas fa-envelope me-2 text-primary"></i> info@legacyframes.cl</p>
            <hr />
            <h5 className="mt-4">Horario</h5>
            <p className="mb-1">Lunes a Viernes: 9:00 - 18:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;