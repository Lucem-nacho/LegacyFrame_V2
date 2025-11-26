import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';

const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

// Interfaz para los productos que vienen de la API
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
  const [modalProducto, setModalProducto] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // --- CARGAMOS PRODUCTOS REALES DE LA API ---
  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const res = await axios.get("http://localhost:8083/api/catalog/productos");
        // Tomamos los primeros 3 productos de la base de datos
        // O si quieres aleatorios: res.data.sort(() => 0.5 - Math.random()).slice(0, 3)
        setFeaturedProducts(res.data.slice(0, 3)); 
        setLoading(false);
      } catch (error) {
        console.error("Error cargando destacados:", error);
        setLoading(false);
      }
    };
    fetchDestacados();
  }, []);

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

  return (
    <div className="home-container">
      
      {/* HERO SECTION (Banner) */}
      <div className="position-relative w-100" style={{ height: '85vh', overflow: 'hidden' }}>
        <img src="/assets/Frame Picture.png" alt="Banner" className="w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'center' }} />
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0) 50%)' }}></div>
        <div className="position-absolute top-50 start-50 translate-middle w-100 px-3 text-center" style={{ marginTop: '15vh' }}>
          <div className="d-flex justify-content-center gap-4">
            <Link to="/molduras" className="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow hover-scale">Ver Molduras</Link>
            <Link to="/contacto" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 shadow hover-scale backdrop-blur">Contáctanos</Link>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE DESTACADOS (AHORA DINÁMICA) */}
      <section className="container my-5 py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-primary">Nuevos Ingresos</h2>
          <p className="text-muted fs-5">Descubre lo último que hemos cargado al catálogo</p>
          <hr className="w-25 mx-auto text-primary" style={{ opacity: 1, height: '3px' }} />
        </div>

        {loading ? (
           <div className="text-center"><div className="spinner-border text-primary"></div></div>
        ) : (
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-md-4">
                <div className="card h-100 shadow border-0 product-card-hover overflow-hidden">
                  <div className="position-relative overflow-hidden" style={{ height: '350px', cursor: 'pointer' }} onClick={() => setModalProducto(product)}>
                    <img 
                      src={product.imagenUrl} 
                      alt={product.nombre} 
                      className="card-img-top w-100 h-100 object-fit-cover transition-transform"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen'; }}
                    />
                  </div>
                  <div className="card-body text-center p-4">
                    <h5 className="card-title fw-bold mb-2 text-truncate">{product.nombre}</h5>
                    <p className="text-primary fw-bold fs-4 mb-3">{CLP.format(product.precio)}</p>
                    <button className="btn btn-outline-primary rounded-pill w-100 py-2" onClick={() => agregarAlCarrito(product)}>
                      <i className="fas fa-cart-plus me-2"></i> Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ICONOS */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row text-center g-5">
            <div className="col-md-4">
              <div className="p-3"><i className="fas fa-medal fa-4x text-primary mb-3"></i><h3 className="fw-bold">Calidad</h3><p className="text-muted">Materiales premium.</p></div>
            </div>
            <div className="col-md-4">
              <div className="p-3"><i className="fas fa-truck fa-4x text-primary mb-3"></i><h3 className="fw-bold">Envíos</h3><p className="text-muted">A todo Chile.</p></div>
            </div>
            <div className="col-md-4">
              <div className="p-3"><i className="fas fa-hand-holding-heart fa-4x text-primary mb-3"></i><h3 className="fw-bold">Artesanal</h3><p className="text-muted">Hecho con amor.</p></div>
            </div>
          </div>
        </div>
      </section>

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
            whatsappHref: `https://wa.me/56912345678?text=Hola, me interesa ${modalProducto.nombre}`,
            stock: modalProducto.stock
          }}
          onAddToCart={() => agregarAlCarrito(modalProducto)}
        />
      )}
    </div>
  );
};

export default Home;