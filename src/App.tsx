import { Routes, Route, useNavigate } from "react-router-dom";
import axios from 'axios';
import Home from "./Pages/Home";
import Contacto from "./Pages/Contacto";
import Registro from "./Pages/Registro";
import Login from "./Pages/Login";
import Molduras from "./Pages/Molduras";
import Cuadros from "./Pages/Cuadros";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useCart } from "./context/CartContext";
import Terminos from "./Pages/Terminos";
import PagoExitoso from "./Pages/PagoExitoso";
import AdminRoute from "./components/AdminRoute";
import AdminPanel from "./Pages/AdminPanel";
import { useAuth } from "./context/AuthContext";

function App() {
  const { items, total, clear, removeItem, increaseItem, decreaseItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const procederPago = async () => {
    if (!user) {
      alert("Debes iniciar sesión para realizar una compra.");
      navigate("/login");
      return;
    }

    try {
      const itemsParaBackend = items.map(item => ({
        productoId: Number(item.id),
        nombreProducto: item.name,
        cantidad: item.quantity,
        precioUnitario: item.price || 0
      }));

      const payload = { items: itemsParaBackend };

      await axios.post(`http://localhost:8084/api/orders?email=${user.email}`, payload);
      
      clear();
      navigate("/pago-exitoso");
      
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Hubo un error al procesar tu compra. Revisa el stock o inténtalo nuevamente.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/molduras" element={<Molduras />} />
          <Route path="/cuadros" element={<Cuadros />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
        </Routes>
      </div>

      <Footer />

      {/* --- CARRITO OFFCANVAS --- */}
      <div className="offcanvas offcanvas-end" tabIndex={-1} id="carritoOffcanvas" aria-labelledby="carritoOffcanvasLabel">
        <div className="offcanvas-header bg-primary text-white">
          <h5 className="offcanvas-title" id="carritoOffcanvasLabel">
            <i className="fas fa-shopping-cart me-2"></i>Tu Carrito
          </h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          
          {items.length === 0 ? (
            <div className="text-center my-auto">
              <i className="fas fa-shopping-basket fa-4x text-muted mb-3"></i>
              <p className="lead">Tu carrito está vacío.</p>
              <button className="btn btn-outline-primary rounded-pill" data-bs-dismiss="offcanvas">
                Ir a comprar
              </button>
            </div>
          ) : (
            <>
              <div className="flex-grow-1 overflow-auto px-2 pt-2">
                {items.map((it) => (
                  <div key={it.id} className="card mb-3 border-0 shadow-sm">
                    <div className="row g-0 align-items-center">
                      <div className="col-3 p-2">
                        {/* Imagen del producto */}
                        <img 
                          src={it.image} 
                          alt={it.name} 
                          className="img-fluid rounded" 
                          style={{ width: '100%', height: '70px', objectFit: 'cover' }}
                          onError={(e) => e.currentTarget.src = "https://via.placeholder.com/70"}
                        />
                      </div>
                      <div className="col-9">
                        <div className="card-body p-2">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 className="card-title mb-1 fw-bold text-dark text-truncate" style={{ maxWidth: '140px' }}>{it.name}</h6>
                                <p className="text-primary fw-bold small mb-0">
                                    {it.price ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(it.price) : ''}
                                </p>
                            </div>
                            <button className="btn btn-sm text-muted p-1 hover-danger" onClick={() => removeItem(it.id)} title="Eliminar">
                              <i className="fas fa-trash-alt fa-sm"></i>
                            </button>
                          </div>
                          
                          {/* --- NUEVOS CONTROLES DE CANTIDAD ELEGANTES --- */}
                          <div className="d-flex align-items-center border rounded-pill px-2 py-1 shadow-sm bg-white mt-2" style={{ width: 'fit-content' }}>
                            {/* Botón Menos */}
                            <button 
                              className={`btn btn-sm border-0 p-0 d-flex align-items-center justify-content-center ${it.quantity <= 1 ? 'text-muted' : 'text-dark'}`}
                              style={{ width: '24px', height: '24px' }}
                              onClick={() => decreaseItem(it.id)}
                              disabled={it.quantity <= 1}
                            >
                              <i className="fas fa-minus fa-xs"></i>
                            </button>
                            
                            {/* Cantidad */}
                            <span className="mx-3 fw-bold text-dark small user-select-none" style={{minWidth: '20px', textAlign: 'center'}}>
                                {it.quantity}
                            </span>
                            
                            {/* Botón Más (Color Primario) */}
                            <button 
                              className="btn btn-sm border-0 p-0 text-primary d-flex align-items-center justify-content-center"
                              style={{ width: '24px', height: '24px' }}
                              onClick={() => increaseItem(it.id)}
                            >
                              <i className="fas fa-plus fa-xs"></i>
                            </button>
                          </div>
                          {/* ------------------------------------------- */}

                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-top pt-3 mt-2 bg-light px-3 pb-3 rounded-top">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="h5 mb-0 text-muted">Total a Pagar</span>
                  <span className="h3 mb-0 fw-bold text-primary">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total)}
                  </span>
                </div>

                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-lg rounded-pill shadow" onClick={procederPago}>
                    Pagar Ahora <i className="fas fa-credit-card ms-2"></i>
                  </button>
                  <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={clear}>
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;