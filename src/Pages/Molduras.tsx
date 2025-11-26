import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

type Category = "all" | "grecas" | "rusticas" | "naturales" | "nativas" | "finger-joint";

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
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await axios.get("http://localhost:8083/api/catalog/productos");
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

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => 
      p.categoria?.nombre.toLowerCase().includes(selectedCategory)
    );
  }, [selectedCategory, products]);

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
    <div className="container my-4">
      {/* Header Principal */}
      <div className="container-fluid bg-light py-4 rounded shadow-sm mb-4">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-5 mb-2 section-title">MOLDURAS PARA MARCOS</h1>
              <p className="lead text-muted">Descubre nuestra amplia colección de molduras profesionales</p>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                  <li className="breadcrumb-item active">Molduras</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filter-section bg-white p-4 shadow-sm rounded mb-4">
        <h5 className="mb-3">Filtrar por Categoría:</h5>
        <div className="btn-group-toggle d-flex flex-wrap" role="group">
          {(
            [
              { key: "all", label: "Todas", icon: "fa-th", btn: "btn-outline-primary" },
              { key: "grecas", label: "Grecas", icon: "fa-border-style", btn: "btn-outline-info" },
              { key: "rusticas", label: "Rústicas", icon: "fa-tree", btn: "btn-outline-success" },
              { key: "naturales", label: "Naturales", icon: "fa-leaf", btn: "btn-outline-warning" },
              { key: "nativas", label: "Nativas", icon: "fa-mountain", btn: "btn-outline-secondary" },
              { key: "finger-joint", label: "Finger Joint", icon: "fa-link", btn: "btn-outline-dark" },
            ] as const
          ).map((c) => (
            <button
              key={c.key}
              className={`btn ${c.btn} me-2 mb-2 ${selectedCategory === (c.key as Category) ? "active" : ""}`}
              onClick={() => setSelectedCategory(c.key as Category)}
            >
              <i className={`fas ${c.icon}`}></i> {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Galería */}
      <div className="row g-4" id="products-container">
        {filteredProducts.map((p) => (
          <div key={p.id} className="col-xl-3 col-lg-4 col-md-6 product-item">
            <div className="product-card h-100">
              <div className="product-image-container">
                <img 
                  src={p.imagenUrl} 
                  className="product-image" 
                  alt={p.nombre} 
                  onError={(e) => { 
                    e.currentTarget.src = "https://placehold.co/400x400?text=Sin+Foto"; 
                  }} 
                />
              </div>
              <div className="product-info">
                <h6 className="product-title">{p.nombre}</h6>
                <p className="product-price">{CLP.format(p.precio)}</p>
                <span className={`badge ${p.stock === 0 ? 'bg-danger' : (p.stock < 10 ? 'bg-warning text-dark' : 'bg-success')}`}>
                  {p.stock === 0 ? 'Agotado' : (p.stock < 10 ? '¡Pocas unidades!' : 'Disponible')}
                </span>
                <small className={`d-block mt-1 fw-bold ${p.stock < 5 ? 'text-danger' : 'text-success'}`}>
                  <i className="fas fa-box-open me-1"></i>
                  {p.stock > 0 ? `Stock: ${p.stock}` : "Agotado"}
                </small>
                <div className="product-actions mt-2 d-flex flex-wrap gap-2">
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setModalProducto(p)}>
                    <i className="fas fa-eye"></i> Ver detalles
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?phone=56227916878&text=${encodeURIComponent(`Hola, me interesa la moldura '${p.nombre}'`)}`}
                    className="btn btn-success btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-whatsapp"></i> Consultar
                  </a>
                  <button className="btn btn-primary btn-sm agregar-carrito" onClick={() => agregarAlCarrito(p)} disabled={p.stock === 0}>
                    <i className="fas fa-cart-plus me-1"></i> Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Información adicional */}
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <div className="info-section bg-light p-4 rounded">
              <div className="row">
                <div className="col-md-8">
                  <h4>¿Por qué elegir nuestras molduras?</h4>
                  <ul className="list-unstyled mt-3">
                    <li><i className="fas fa-check-circle text-success me-2"></i> Más de 25 años de experiencia</li>
                    <li><i className="fas fa-check-circle text-success me-2"></i> Materiales de primera calidad</li>
                    <li><i className="fas fa-check-circle text-success me-2"></i> Amplia variedad de estilos y acabados</li>
                    <li><i className="fas fa-check-circle text-success me-2"></i> Precios competitivos</li>
                    <li><i className="fas fa-check-circle text-success me-2"></i> Asesoramiento personalizado</li>
                  </ul>
                </div>
                <div className="col-md-4 text-center">
                  <h5>¿Necesitas ayuda?</h5>
                  <p>Nuestro equipo está listo para asesorarte</p>
                  <a href="/contacto" className="btn btn-primary">Contáctanos</a>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            whatsappHref: `https://api.whatsapp.com/send?phone=56227916878&text=${encodeURIComponent(`Hola, me interesa la moldura '${modalProducto.nombre}'`)}`,
            stock: modalProducto.stock
          }}
          onAddToCart={() => agregarAlCarrito(modalProducto)}
        />
      )}
    </div>
  );
};

export default Molduras;