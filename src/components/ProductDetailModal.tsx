import React from 'react';

// Definimos la estructura del producto que recibe el modal
interface ProductData {
  name: string;
  image: string;
  description: string;
  price: number;
  whatsappHref: string;
}

// Definimos las propiedades (Props) que acepta el componente
interface Props {
  show: boolean;          // <--- AQUÍ AGREGAMOS LA PROPIEDAD QUE FALTABA
  onClose: () => void;    // Función para cerrar
  product: ProductData;   // Datos del producto
  onAddToCart: () => void;// Función al agregar al carrito
}

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

const ProductDetailModal: React.FC<Props> = ({ show, onClose, product, onAddToCart }) => {
  
  // Si 'show' es falso, no renderizamos nada (el modal desaparece)
  if (!show) return null;

  return (
    // Clases de Bootstrap para mostrar el modal manualmente
    // "show" y "d-block" hacen que sea visible. El backgroundColor es para el fondo oscuro.
    <div 
      className="modal fade show" 
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} 
      tabIndex={-1}
      onClick={onClose} // Cerrar si clicamos fuera del modal (en el fondo oscuro)
    >
      <div 
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => e.stopPropagation()} // Evitar cerrar si clicamos DENTRO del modal
      >
        <div className="modal-content rounded-4 shadow border-0 overflow-hidden">
          
          {/* Botón cerrar (X) */}
          <div className="position-absolute top-0 end-0 m-3 z-3">
            <button 
              type="button" 
              className="btn-close bg-white p-2 rounded-circle shadow-sm" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="row g-0">
            {/* Columna Imagen */}
            <div className="col-md-6 bg-light d-flex align-items-center justify-content-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="img-fluid" 
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>

            {/* Columna Info */}
            <div className="col-md-6">
              <div className="modal-body p-4 d-flex flex-column h-100 justify-content-center">
                <h3 className="fw-bold mb-2">{product.name}</h3>
                <h4 className="text-primary fw-bold mb-3">{CLP.format(product.price)}</h4>
                
                <p className="text-muted mb-4">{product.description}</p>

                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary btn-lg rounded-pill"
                    onClick={onAddToCart}
                  >
                    <i className="fas fa-cart-plus me-2"></i> Agregar al Carrito
                  </button>
                  
                  <a 
                    href={product.whatsappHref} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-success btn-lg rounded-pill"
                  >
                    <i className="fab fa-whatsapp me-2"></i> Consultar por WhatsApp
                  </a>
                </div>
                
                <div className="mt-3 text-center">
                    <button 
                        className="btn btn-link text-decoration-none text-secondary" 
                        onClick={onClose}
                    >
                        Volver al catálogo
                    </button>
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