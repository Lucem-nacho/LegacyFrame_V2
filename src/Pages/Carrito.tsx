import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Carrito = () => {
  const { items, total, removeItem, clear } = useCart();

  // Estado: Carrito Vacío
  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-3">Tu carrito está vacío</h2>
        <p className="text-muted mb-4">¡Agrega productos para comenzar!</p>
        <Link to="/" className="btn btn-primary btn-lg">Ir a comprar</Link>
      </div>
    );
  }

  // Estado: Con Productos
  return (
    <div className="container py-5">
      <h1 className="mb-4"><i className="fas fa-shopping-cart me-2"></i>Tu Carrito</h1>
      
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">Producto</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Cant</th>
                  <th scope="col">Total</th>
                  <th scope="col" className="text-end pe-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="rounded me-3"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }} 
                          />
                        ) : (
                          <div className="bg-secondary rounded me-3 d-flex align-items-center justify-content-center text-white" style={{ width: "50px", height: "50px" }}>
                            <i className="fas fa-image"></i>
                          </div>
                        )}
                        <span className="fw-semibold">{item.name}</span>
                      </div>
                    </td>
                    <td>${item.price?.toLocaleString()}</td>
                    <td>{item.quantity}</td>
                    <td>${((item.price || 0) * item.quantity).toLocaleString()}</td>
                    <td className="text-end pe-4">
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeItem(item.id)}
                        aria-label="eliminar"
                        title="Eliminar producto"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="row justify-content-end">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-4">
                <span className="h4 mb-0">Total:</span>
                <span className="h4 mb-0 fw-bold text-primary">${total.toLocaleString()}</span>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-success btn-lg" onClick={() => alert("Procesando pago...")}>
                  <i className="fas fa-credit-card me-2"></i> Pagar Ahora
                </button>
                <button className="btn btn-outline-secondary" onClick={clear}>
                  Vaciar Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;