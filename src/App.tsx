import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Contacto from "./Pages/Contacto";
import Registro from "./Pages/Registro";
import Login from "./Pages/Login";
import Molduras from "./Pages/Molduras";
import Cuadros from "./Pages/Cuadros";
import Carrito from "./Pages/Carrito";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
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
          <Route path="/login" element={<Login />} />
          <Route path="/molduras" element={<Molduras />} />
          <Route path="/cuadros" element={<Cuadros />} />
          <Route path="/carrito" element={<Carrito />} />
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
          <div id="carritoVacio" className="text-center py-5">
            <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
            <h6 className="text-muted">Tu carrito está vacío</h6>
            <p className="text-muted small">Agrega productos para comenzar tu compra</p>
          </div>
          
          <div id="carritoContenido" className="d-none">
            <div id="itemsCarrito"></div>
            
            <hr />
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <strong>Total: $<span id="totalCarrito">0</span></strong>
              <button id="vaciarCarrito" className="btn btn-outline-danger btn-sm">
                <i className="fas fa-trash me-1"></i>Vaciar
              </button>
            </div>
            
            <div className="d-grid gap-2">
              <button id="procederCompra" className="btn btn-success">
                <i className="fas fa-credit-card me-2"></i>Proceder al Pago
              </button>
              <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
                Seguir Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;