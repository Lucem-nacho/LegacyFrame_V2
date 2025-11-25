import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';

// Definimos tipos
type Featured = { id: string; name: string; image: string; price: number; description: string };

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
const FEATURED_PRICE = 20000;

const Home = () => {
  const { addItem } = useCart();
  const [modalProducto, setModalProducto] = useState<Featured | null>(null);

  const agregarAlCarrito = (product: Featured) => {
    addItem({
      id: product.id,
      name: product.name, 
      price: product.price,
      image: product.image,
      stockMax: 10 
    });
    setModalProducto(null);
  };

  // Datos de ejemplo
  const featuredProducts: Featured[] = [
    { 
      id: 'destacado-1', 
      name: 'Moldura Clásica Dorada', 
      image: '/assets/moldura3.jpg', 
      price: FEATURED_PRICE, 
      description: 'Elegancia atemporal para tus recuerdos más preciados.' 
    },
    { 
      id: 'destacado-2', 
      name: 'Marco Negro Moderno', 
      image: '/assets/moldura4.jpg', 
      price: FEATURED_PRICE, 
      description: 'Diseño minimalista que combina con cualquier decoración.' 
    },
    { 
      id: 'destacado-3', 
      name: 'Madera Rústica Natural', 
      image: '/assets/rustica1.jpg', 
      price: FEATURED_PRICE, 
      description: 'Calidez y textura para ambientes acogedores.' 
    }
  ];

  return (
    <div className="home-container">
      
      {/* --- HERO SECTION (BANNER GIGANTE) --- */}
      <div className="position-relative w-100" style={{ height: '85vh', overflow: 'hidden' }}>
        
        {/* 1. IMAGEN DE FONDO */}
        <img 
          src="/assets/Frame Picture.png" 
          alt="Banner Principal" 
          className="w-100 h-100"
          style={{ objectFit: 'cover', objectPosition: 'center' }} 
        />

        {/* 2. CAPA DE SOMBRA SUAVE (Overlay) - Más sutil ahora */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0) 50%)' }}
        ></div>
        
        {/* 3. CONTENEDOR DE BOTONES (TEXTO ELIMINADO) */}
        {/* Usamos top-80 para bajarlos y dejar ver la foto */}
        <div className="position-absolute top-50 start-50 translate-middle w-100 px-3 text-center" style={{ marginTop: '15vh' }}>
          
          <div className="d-flex justify-content-center gap-4">
            <Link to="/molduras" className="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow hover-scale">
              Ver Molduras
            </Link>
            <Link to="/contacto" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 shadow hover-scale backdrop-blur">
              Contáctanos
            </Link>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DE DESTACADOS --- */}
      <section className="container my-5 py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary">Productos Destacados</h2>
          <p className="text-muted fs-5">Nuestras selecciones favoritas para ti</p>
          <hr className="w-25 mx-auto text-primary" style={{ opacity: 1, height: '3px' }} />
        </div>

        <div className="row g-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="col-md-4">
              <div className="card h-100 shadow border-0 product-card-hover overflow-hidden">
                <div 
                  className="position-relative overflow-hidden" 
                  style={{ height: '350px', cursor: 'pointer' }}
                  onClick={() => setModalProducto(product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="card-img-top w-100 h-100 object-fit-cover transition-transform"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen'; }}
                  />
                  <div className="card-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-0 bg-dark bg-opacity-50 transition-opacity">
                    <span className="text-white border border-white px-4 py-2 rounded-pill">Ver Detalle</span>
                  </div>
                </div>
                
                <div className="card-body text-center p-4">
                  <h4 className="card-title fw-bold mb-2">{product.name}</h4>
                  <p className="text-primary fw-bold fs-4 mb-3">{CLP.format(product.price)}</p>
                  <button 
                    className="btn btn-outline-primary rounded-pill w-100 py-2"
                    onClick={() => agregarAlCarrito(product)}
                  >
                    <i className="fas fa-cart-plus me-2"></i> Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECCIÓN DE INFORMACIÓN (Iconos) --- */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row text-center g-5">
            <div className="col-md-4">
              <div className="p-3 h-100">
                <div className="mb-3 text-primary">
                    <i className="fas fa-medal fa-4x"></i>
                </div>
                <h3 className="fw-bold">Calidad Garantizada</h3>
                <p className="text-muted">Materiales de primera selección y acabados perfectos para durar toda la vida.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 h-100">
                <div className="mb-3 text-primary">
                    <i className="fas fa-truck fa-4x"></i>
                </div>
                <h3 className="fw-bold">Envíos a todo Chile</h3>
                <p className="text-muted">Recibe tus marcos protegidos y seguros en la puerta de tu casa.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 h-100">
                <div className="mb-3 text-primary">
                    <i className="fas fa-hand-holding-heart fa-4x"></i>
                </div>
                <h3 className="fw-bold">Hecho a Mano</h3>
                <p className="text-muted">Cada marco es fabricado con dedicación, detalle y pasión por el arte.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE DETALLE */}
      {modalProducto && (
        <ProductDetailModal
          show={!!modalProducto}
          onClose={() => setModalProducto(null)}
          product={{
            name: modalProducto.name,
            image: modalProducto.image,
            description: modalProducto.description,
            price: modalProducto.price,
            whatsappHref: 'https://wa.me/56912345678?text=' + encodeURIComponent(`Hola, me interesa ${modalProducto.name}`),
            stock: 10
          }}
          onAddToCart={() => agregarAlCarrito(modalProducto)}
        />
      )}
    </div>
  );
};

export default Home;