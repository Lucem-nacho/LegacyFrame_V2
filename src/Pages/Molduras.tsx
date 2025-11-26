import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  descripcion: string;
  stock: number;
  categoria: {
    nombre: string;
  };
}

const Molduras = () => {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalProducto, setModalProducto] = useState<Product | null>(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await axios.get("http://localhost:8083/api/catalog/productos");
      // Filtramos cualquier cosa que NO sea cuadros (asumiendo que el resto son molduras/grecas/etc)
      // O puedes filtrar específicamente por: grecas, rusticas, nativas, etc.
      const soloMolduras = res.data.filter((p: Product) => 
        !p.categoria?.nombre.toLowerCase().includes("cuadros")
      );
      setProducts(soloMolduras);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando molduras:", error);
      setLoading(false);
    }
  };

  const agregarAlCarrito = (product: Product) => {
    addItem({
      id: product.id.toString(),
      name: product.nombre,
      price: product.precio,
      image: product.imagenUrl,
      stockMax: product.stock
    });
    setModalProducto(null);
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Catálogo de Molduras</h1>
        <p className="lead text-muted">Variedad de estilos para tus enmarcaciones</p>
        <hr className="w-25 mx-auto text-primary" />
      </div>

      <div className="row g-4">
        {products.map((prod) => (
          <div key={prod.id} className="col-md-4 col-sm-6">
            <div className="card h-100 shadow-sm border-0 product-card-hover">
              <div 
                className="position-relative overflow-hidden bg-light" 
                style={{ height: '300px', cursor: 'pointer' }}
                onClick={() => setModalProducto(prod)}
              >
                {/* IMAGEN BLINDADA ANTI-ERROR */}
                <img 
                  src={prod.imagenUrl} 
                  alt={prod.nombre} 
                  className="w-100 h-100 object-fit-cover transition-transform"
                  onError={(e) => {
                    e.currentTarget.onerror = null; // Detiene el bucle
                    e.currentTarget.src = "https://placehold.co/400x400?text=Sin+Foto"; // URL Segura
                  }}
                />
                 {/* Badge de Stock */}
                 {prod.stock < 10 && prod.stock > 0 && (
                  <span className="position-absolute top-0 end-0 bg-warning text-dark badge m-2 shadow">
                    Poco Stock
                  </span>
                )}
              </div>

              <div className="card-body text-center d-flex flex-column">
                <div className="mb-2">
                    <span className="badge bg-secondary opacity-75">{prod.categoria?.nombre}</span>
                </div>
                <h5 className="card-title fw-bold text-truncate">{prod.nombre}</h5>
                <p className="text-muted small text-truncate">{prod.descripcion}</p>
                <div className="mt-auto">
                  <p className="fs-4 fw-bold text-primary mb-3">{CLP.format(prod.precio)}</p>
                  <button 
                    className="btn btn-outline-primary rounded-pill w-100 shadow-sm"
                    onClick={() => agregarAlCarrito(prod)}
                    disabled={prod.stock === 0}
                  >
                    {prod.stock === 0 ? "Agotado" : <><i className="fas fa-plus me-2"></i>Agregar</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-12 text-center py-5">
            <p className="text-muted fs-5">No hay molduras disponibles.</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalProducto && (
        <ProductDetailModal
          show={!!modalProducto}
          onClose={() => setModalProducto(null)}
          product={{
            name: modalProducto.nombre,
            image: modalProducto.imagenUrl,
            description: modalProducto.descripcion,
            price: modalProducto.precio,
            whatsappHref: `https://wa.me/56912345678?text=Consulta por moldura: ${modalProducto.nombre}`,
            stock: modalProducto.stock
          }}
          onAddToCart={() => agregarAlCarrito(modalProducto)}
        />
      )}
    </div>
  );
};

export default Molduras;