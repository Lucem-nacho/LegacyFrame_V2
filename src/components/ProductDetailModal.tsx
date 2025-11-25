import React from 'react';

// Actualizamos la interfaz
interface ProductData {
  name: string;
  image: string;
  description: string;
  price: number;
  whatsappHref: string;
  stock?: number; // <--- NUEVO OPCIONAL
}

interface Props {
  show: boolean;
  onClose: () => void;
  product: ProductData;
  onAddToCart: () => void;
}

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

const ProductDetailModal: React.FC<Props> = ({ show, onClose, product, onAddToCart }) => {
  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content rounded-4 shadow border-0 overflow-hidden">
          
          <div className="position-absolute top-0 end-0 m-3 z-3">
            <button type="button" className="btn-close bg-white p-2 rounded-circle shadow-sm" onClick={onClose}></button>
          </div>

          <div className="row g-0">
            <div className="col-md-6 bg-light d-flex align-items-center justify-content-center">
              <img src={product.image} alt={product.name} className="img-fluid" style={{ maxHeight: '400px', objectFit: 'contain' }} />
            </div>

            <div className="col-md-6">
              <div className="modal-body p-4 d-flex flex-column h-100 justify-content-center">
                <h3 className="fw-bold mb-2">{product.name}</h3>
                <h4 className="text-primary fw-bold mb-2">{CLP.format(product.price)}</h4>
                
                {/* --- STOCK EN MODAL --- */}
                {product.stock !== undefined && (
                   <p className={`fw-bold mb-3 ${product.stock < 5 ? 'text-danger' : 'text-success'}`}>
                     <i className="fas fa-cubes me-2"></i>
                     {product.stock > 0 ? `Stock disponible: ${product.stock} un.` : "Producto Agotado"}
                   </p>
                )}
                {/* ---------------------- */}
                
                <p className="text-muted mb-4">{product.description}</p>

                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-lg rounded-pill" onClick={onAddToCart} disabled={product.stock === 0}>
                    <i className="fas fa-cart-plus me-2"></i> {product.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
                  </button>
                  
                  <a href={product.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-success btn-lg rounded-pill">
                    <i className="fab fa-whatsapp me-2"></i> Consultar por WhatsApp
                  </a>
                </div>
                
                <div className="mt-3 text-center">
                    <button className="btn btn-link text-decoration-none text-secondary" onClick={onClose}>Volver al catálogo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;