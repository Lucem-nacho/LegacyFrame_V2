// Página simple de confirmación de pago exitoso.
// Se muestra después de presionar "Proceder al Pago" en el offcanvas del carrito.
// Desde App.tsx se vacía el carrito y se navega aquí.
import { Link } from 'react-router-dom';

const PagoExitoso = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          {/* Tarjeta con mensaje de éxito y acciones recomendadas */}
          <div className="card shadow-sm text-center p-4">
            <div className="mb-3">
              {/* Ícono visual de éxito */}
              <i className="fas fa-check-circle text-success" style={{ fontSize: 56 }}></i>
            </div>
            {/* Mensaje principal */}
            <h2 className="mb-2">¡Productos pagados con éxito!</h2>
            <p className="text-muted mb-4">Gracias por tu compra. Te enviaremos la confirmación a tu correo.</p>
            <div className="d-flex justify-content-center gap-2">
              {/* CTA para volver a la portada */}
              <Link className="btn btn-primary" to="/">Volver al inicio</Link>
              {/* CTA para seguir navegando en una sección popular */}
              <Link className="btn btn-outline-secondary" to="/molduras">Seguir comprando</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoExitoso;
