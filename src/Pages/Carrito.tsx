// Importa React, necesario para definir componentes de React y usar JSX.
import React from "react";

// Define el componente funcional Carrito usando React.FC (Functional Component).
// React.FC es un tipo genérico que indica que esta función es un componente funcional de React.
const Carrito: React.FC = () => {
  // Retorna la estructura JSX que representa la interfaz de usuario de esta página.
  return (
    // Contenedor principal de Bootstrap con padding vertical (py-5).
    <div className="container py-5">
      {/* Encabezado principal de la página (h1 con estilo h3 y margen inferior mb-3). */}
      <h1 className="h3 mb-3">
        {/* Icono de carrito de Font Awesome con margen derecho (me-2). */}
        <i className="fas fa-shopping-cart me-2"></i>
        {/* Texto del encabezado. */}
        Carrito
      </h1>
      {/* Una alerta informativa de Bootstrap que indica que esta sección está en desarrollo. */}
      <div className="alert alert-info">Próximamente: detalle del carrito global.</div>
    </div>
  );
};

// Exporta el componente Carrito como el export por defecto de este módulo,
// permitiendo que otros archivos lo importen (ej. App.tsx).
export default Carrito;