import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';
import framePicture from '/assets/Frame Picture.png';

// --- CONFIGURACIÓN ---
const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
const API_URL = "http://localhost:8083"; // URL de tu Backend

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  descripcion: string;
  stock: number;
}

const Home = () => {
  const { addItem } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalProducto, setModalProducto] = useState<Product | null>(null);

  useEffect(() => {
    cargarDestacados();
  }, []);

  const cargarDestacados = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/catalog/productos`);
      // Mostramos los primeros 3 productos (o podrías filtrar por precio > 50000, etc)
      setFeaturedProducts(res.data.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error("Error cargando destacados:", error);
      setLoading(false);
    }
  };

  // --- HELPER INTELIGENTE PARA IMÁGENES ---
  const getImageUrl = (url: string) => {
    if (!url) return "https://placehold.co/400x400?text=Sin+Foto";
    if (url.startsWith("http")) return url;

    // Corrección para productos antiguos que dicen "/assets/"
    let cleanUrl = url.replace("/assets/", "/images/");
    
    if (!cleanUrl.startsWith("/")) cleanUrl = "/" + cleanUrl;

    return `${API_URL}${cleanUrl}`;
  };

  const agregarAlCarrito = (p: Product) => {
    addItem({ 
      id: p.id.toString(), 
      name: p.nombre, 
      image: getImageUrl(p.imagenUrl), 
      price: p.precio,
      stockMax: p.stock 
    });
    setModalProducto(null);
    const offEl = document.getElementById('carritoOffcanvas');
    if (offEl) {
      const off = (window as any).bootstrap ? new (window as any).bootstrap.Offcanvas(offEl) : null;
      off?.show();
    }
  };

  return (
    <div>
      {/* Banner Principal (Imagen estática del frontend) */}
      <div className="container-fluid p-0">
        <img className="banner-img" src={framePicture} alt="Banner Cuadros" />
      </div>

      <div className="container">
        <div className="empresa-container">
          <div className="empresa-header">
            <h1>Legacy Frames</h1>
            <p className="lead">Tradición y calidad en enmarcación desde 1998</p>
          </div>

          {/* SECCIÓN DINÁMICA DE PRODUCTOS */}
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="text-center mb-4 section-title">Nuestros Productos Destacados</h2>
              
              {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                </div>
              ) : (
                <div className="row g-4">
                  {featuredProducts.map((p, idx) => (
                    <div key={p.id} className="col-md-4">
                      <div className="caracteristica text-center h-100">
                        {/* Usamos el helper para mostrar la imagen correcta */}
                        <img 
                            className="product-thumb" 
                            src={getImageUrl(p.imagenUrl)} 
                            alt={p.nombre} 
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://placehold.co/400x400?text=Sin+Foto";
                            }}
                        />
                        <h5>{p.nombre}</h5>
                        <p className="mb-2 text-muted small text-truncate">{p.descripcion}</p>
                        <p className="precio-destacado">{CLP.format(p.precio)}</p>
                        
                        {idx === 0 && <span className="badge bg-success mb-2">Más Vendido</span>}
                        {idx === 1 && <span className="badge bg-info mb-2">Tendencia</span>}
                        {idx === 2 && <span className="badge bg-warning text-dark mb-2">Premium</span>}

                        <div className="d-flex justify-content-center gap-2 mt-2">
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => setModalProducto(p)}>
                            <i className="fas fa-eye me-1"></i> Ver detalles
                          </button>
                          <button 
                            className="btn btn-primary btn-sm" 
                            onClick={() => agregarAlCarrito(p)}
                            disabled={p.stock === 0}
                          >
                            <i className="fas fa-cart-plus me-1"></i> Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sección de Texto Estático */}
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="text-center mb-4 section-title">Nuestra Historia</h2>
              <p className="text-justify">
                <strong>Legacy Frames</strong> nació en 1998 con la visión de preservar y realzar los momentos más importantes de nuestros clientes. Con más de 25 años de experiencia, nos hemos consolidado como líderes en Santiago.
              </p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="row mb-5 text-center">
            <div className="col-md-3 mb-3">
              <div className="numero-destacado">25+</div>
              <p>Años de Experiencia</p>
            </div>
            <div className="col-md-3 mb-3">
              <div className="numero-destacado">10K+</div>
              <p>Cuadros Enmarcados</p>
            </div>
            <div className="col-md-3 mb-3">
              <div className="numero-destacado">5</div>
              <p>Tipos de Molduras</p>
            </div>
            <div className="col-md-3 mb-3">
              <div className="numero-destacado">100%</div>
              <p>Satisfacción</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-section py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h3 className="mb-2">¿Listo para Enmarcar tu Historia?</h3>
              <p className="mb-0">Transformamos tus recuerdos en obras de arte</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/contacto" className="btn btn-light btn-lg me-2">Contactar</Link>
              <Link to="/registro" className="btn btn-outline-light btn-lg">Únete</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Detalle */}
      {modalProducto && (
        <ProductDetailModal
          show={!!modalProducto}
          onClose={() => setModalProducto(null)}
          product={{
            name: modalProducto.nombre,
            image: getImageUrl(modalProducto.imagenUrl),
            description: modalProducto.descripcion,
            price: modalProducto.precio,
            whatsappHref: `https://api.whatsapp.com/send?phone=56227916878&text=${encodeURIComponent(`Hola, me interesa '${modalProducto.nombre}'`)}`,
            stock: modalProducto.stock
          }}
          onAddToCart={() => agregarAlCarrito(modalProducto)}
        />
      )}
    </div>
  );
};

export default Home;