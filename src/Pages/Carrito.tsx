import React from "react";

const Carrito: React.FC = () => {
  return (
    <div className="container py-5">
      <h1 className="h3 mb-3">
        <i className="fas fa-shopping-cart me-2"></i>
        Carrito
      </h1>
      <div className="alert alert-info">Próximamente: detalle del carrito global.</div>
    </div>
  );
};

export default Carrito;