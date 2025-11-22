import React from 'react';

type ProductData = {
  name: string;
  image: string;
  description?: string;
  price?: number; // numérico CLP
  priceText?: string; // formateado cuando es rango
  whatsappHref?: string;
};

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

interface Props {
  id: string; // id único del modal
  product: ProductData | null;
  onAddToCart?: () => void;
  showAddButton?: boolean;
}

const ProductDetailModal: React.FC<Props> = ({ id, product, onAddToCart, showAddButton = true }) => {
  const priceLabel = product?.priceText ?? (product?.price != null ? CLP.format(product.price) : undefined);
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
                {priceLabel && <p className="fs-5 text-primary fw-bold">{priceLabel}</p>}
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
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={onAddToCart}>
                <i className="fas fa-cart-plus me-1"></i> Agregar al carrito
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
