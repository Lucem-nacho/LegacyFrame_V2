import React from 'react';

// Actualizamos la interfaz
interface ProductData {
  name: string;
  image: string;
  description?: string;
  price?: number;
  whatsappHref?: string;
  stock?: number;
}

interface Props {
  id?: string; // ID para usar con Bootstrap
  show?: boolean; // Para control manual
  onClose?: () => void; // Para control manual
  product: ProductData | null;
  onAddToCart?: () => void;
  showAddButton?: boolean;
}

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

const ProductDetailModal: React.FC<Props> = ({ 
  id, 
  show, 
  onClose, 
  product, 
  onAddToCart, 
  showAddButton = true 
}) => {
  // Si se usa con id (Bootstrap tradicional)
  if (id) {
    return (
      <div className="modal fade" id={id} tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{product?.name ?? ''}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center">
              {product && (
                <>
                  <img src={product.image} className="img-fluid mb-3 modal-img" style={{ maxHeight: 360, objectFit: 'contain' }} alt={product.name} />
                  {product.price && <p className="fs-5 text-primary fw-bold">{CLP.format(product.price)}</p>}
                  {product.stock !== undefined && (
                    <p className={`fw-bold mb-3 ${product.stock < 5 ? 'text-danger' : 'text-success'}`}>
                      <i className="fas fa-cubes me-2"></i>
                      {product.stock > 0 ? `Stock disponible: ${product.stock} un.` : "Producto Agotado"}
                    </p>
                  )}
                  {product.description && <p className="text-muted">{product.description}</p>}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              {product?.whatsappHref && (
                <a href={product.whatsappHref} className="btn btn-success" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp"></i> Consultar por WhatsApp
                </a>
              )}
              {showAddButton && onAddToCart && (
                <button className="btn btn-primary" data-bs-dismiss="modal" onClick={onAddToCart} disabled={product?.stock === 0}>
                  <i className="fas fa-cart-plus me-1"></i> {product?.stock === 0 ? "Sin Stock" : "Agregar al carrito"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si se usa con show/onClose (control manual)
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
              <img src={product?.image} alt={product?.name} className="img-fluid" style={{ maxHeight: '400px', objectFit: 'contain' }} />
            </div>

            <div className="col-md-6">
              <div className="modal-body p-4 d-flex flex-column h-100 justify-content-center">
                <h3 className="fw-bold mb-2">{product?.name}</h3>
                {product?.price && <h4 className="text-primary fw-bold mb-2">{CLP.format(product.price)}</h4>}
                
                {product?.stock !== undefined && (
                   <p className={`fw-bold mb-3 ${product.stock < 5 ? 'text-danger' : 'text-success'}`}>
                     <i className="fas fa-cubes me-2"></i>
                     {product.stock > 0 ? `Stock disponible: ${product.stock} un.` : "Producto Agotado"}
                   </p>
                )}
                
                {product?.description && <p className="text-muted mb-4">{product.description}</p>}

                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-lg rounded-pill" onClick={onAddToCart} disabled={product?.stock === 0}>
                    <i className="fas fa-cart-plus me-2"></i> {product?.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
                  </button>
                  
                  {product?.whatsappHref && (
                    <a href={product.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-success btn-lg rounded-pill">
                      <i className="fab fa-whatsapp me-2"></i> Consultar por WhatsApp
                    </a>
                  )}
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