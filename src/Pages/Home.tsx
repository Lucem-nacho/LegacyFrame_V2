import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';

// YA NO IMPORTAMOS IMÁGENES. USAMOS RUTAS DIRECTAS A LA CARPETA PUBLIC

// Define el tipo de dato para los productos destacados
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
      image: product.image
    });
    setModalProducto(null);
  };

  // Datos quemados (hardcoded) con RUTAS DE TEXTO a la carpeta public/assets
  const featuredProducts: Featured[] = [
    { 
      id: 'destacado-1', 
      name: 'Moldura Clásica Dorada', 
      image: '/assets/moldura3.jpg', // <--- RUTA DIRECTA
      price: FEATURED_PRICE, 
      description: 'Elegancia atemporal para tus recuerdos más preciados.' 
    },
    { 
      id: 'destacado-2', 
      name: 'Marco Negro Moderno', 
      image: '/assets/moldura4.jpg', // <--- RUTA DIRECTA
      price: FEATURED_PRICE, 
      description: 'Diseño minimalista que combina con cualquier decoración.' 
    },
    { 
      id: 'destacado-3', 
      name: 'Madera Rústica Natural', 
      image: '/assets/rustica1.jpg', // <--- RUTA DIRECTA
      price: FEATURED_PRICE, 
      description: 'Calidez y textura para ambientes acogedores.' 
    }
  ];

  return (
    <div className="home-container">
      
      {/* HERO SECTION (Banner Principal) */}
      <section className="hero-section position-relative text-white mb-5">
        <div className="container-fluid p-0">
          <div className="position-relative" style={{ height: '500px', overflow: 'hidden' }}>
            
            {/* Imagen de fondo del banner */}
            <img 
              src="/assets/Frame Picture.png" // <--- RUTA DIRECTA
              alt="Banner Principal" 
              className="w-100 h-100 object-fit-cover"
              style={{ filter: 'brightness(0.6)' }} // Oscurecer un poco para que se lea el texto
            />
            
            <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-3">
              <h1 className="display-3 fw-bold mb-3 text-shadow">Enmarca tus Recuerdos</h1>
              <p className="lead fs-4 mb-4 text-shadow">Calidad artesanal para tus momentos inolvidables</p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/molduras" className="btn btn-primary btn-lg rounded-pill px-4 py-2 shadow">
                  Ver Molduras
                </Link>
                <Link to="/contacto" className="btn btn-outline-light btn-lg rounded-pill px-4 py-2 shadow">
                  Contáctanos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE DESTACADOS */}
      <section className="container mb-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">Productos Destacados</h2>
          <p className="text-muted">Nuestras selecciones favoritas para ti</p>
        </div>

        <div className="row g-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="col-md-4">
              <div className="card h-100 shadow-sm border-0 product-card-hover">
                <div 
                  className="position-relative overflow-hidden" 
                  style={{ height: '300px', cursor: 'pointer' }}
                  onClick={() => setModalProducto(product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="card-img-top w-100 h-100 object-fit-cover transition-transform"
                    // Fallback por si la imagen no existe
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen'; }}
                  />
                  <div className="card-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-0 bg-dark bg-opacity-50 transition-opacity">
                    <button className="btn btn-light rounded-circle p-3">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
                
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{product.name}</h5>
                  <p className="text-primary fw-bold fs-5">{CLP.format(product.price)}</p>
                  <button 
                    className="btn btn-outline-primary rounded-pill w-100"
                    onClick={() => agregarAlCarrito(product)}
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN DE INFORMACIÓN (Iconos) */}
      <section className="bg-light py-5 mb-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="p-3">
                <i className="fas fa-medal text-primary fa-3x mb-3"></i>
                <h4>Calidad Garantizada</h4>
                <p className="text-muted">Materiales de primera selección y acabados perfectos.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <i className="fas fa-truck text-primary fa-3x mb-3"></i>
                <h4>Envíos a todo Chile</h4>
                <p className="text-muted">Recibe tus marcos donde quiera que estés.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <i className="fas fa-hand-holding-heart text-primary fa-3x mb-3"></i>
                <h4>Hecho a Mano</h4>
                <p className="text-muted">Cada marco es fabricado con dedicación y detalle.</p>
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
            whatsappHref: 'https://wa.me/56912345678?text=' + encodeURIComponent(`Hola, me interesa ${modalProducto.name}`)
          }}
          onAddToCart={() => agregarAlCarrito(modalProducto)}
        />
      )}
    </div>
  );
};

export default Home;