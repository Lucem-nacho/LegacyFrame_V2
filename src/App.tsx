import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import Contacto from "./Pages/Contacto";
import Registro from "./Pages/Registro";
import Login from "./Pages/Login";
import Molduras from "./Pages/Molduras";
import Cuadros from "./Pages/Cuadros";
import Carrito from "./Pages/Carrito";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useCart } from "./context/CartContext";
import Terminos from "./Pages/Terminos";
import PagoExitoso from "./Pages/PagoExitoso";

function App() {
  const { items, total, clear, removeItem } = useCart();
  const navigate = useNavigate();

  const procederPago = () => {
    const offEl = document.getElementById('carritoOffcanvas');
    if (offEl && (window as any).bootstrap) {
      const off = new (window as any).bootstrap.Offcanvas(offEl);
      off.hide();
    }
    clear();
    navigate('/pago-exitoso');
  };
  return (
    <div className="app-container">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/registro" element={<Registro />} />
          <Route 
  path="/login" 
  element={
    <Login onLoginSuccess={() => {
      alert('¡Bienvenido! Has iniciado sesión.');
      window.location.href = '/'; 
    }} />
  } 
/>
          <Route path="/molduras" element={<Molduras />} />
          <Route path="/cuadros" element={<Cuadros />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
        </Routes>
      </div>

      {/* FOOTER */}
      <Footer />

      {/* Carrito Offcanvas */}
      <div className="offcanvas offcanvas-end" tabIndex={-1} id="carritoOffcanvas" aria-labelledby="carritoOffcanvasLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="carritoOffcanvasLabel">
            <i className="fas fa-shopping-cart me-2"></i>Mi Carrito
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          {items.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
              <h6 className="text-muted">Tu carrito está vacío</h6>
              <p className="text-muted small">Agrega productos para comenzar tu compra</p>
            </div>
          ) : (
            <>
              <div className="list-group mb-3">
                {items.map((it) => (
                  <div key={it.id} className="list-group-item d-flex align-items-center">
                    {it.image && (
                      <img src={it.image} alt={it.name} style={{ width: 48, height: 48, objectFit: 'cover' }} className="me-3 rounded" />
                    )}
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{it.name}</div>
                      <div className="small text-muted">
                        {it.priceText ? it.priceText : (it.price ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(it.price) : '')}
                        {` · x${it.quantity}`}
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(it.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong>Total: {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total)}</strong>
                <button className="btn btn-outline-danger btn-sm" onClick={clear}>
                  <i className="fas fa-trash me-1"></i>Vaciar
                </button>
              </div>

              <div className="d-grid gap-2">
                <button className="btn btn-success" onClick={procederPago}>
                  <i className="fas fa-credit-card me-2"></i>Proceder al Pago
                </button>
                <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
                  Seguir Comprando
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;