import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductDetailModal from '../components/ProductDetailModal';

// YA NO HAY IMPORTS DE IMÁGENES AQUÍ.
// React las buscará directamente en la carpeta public/assets

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  badge: string;
  badgeColor: string;
  whatsappText: string;
}

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

const Cuadros = () => {
  const { addItem } = useCart();
  const { user } = useAuth(); 
  const [modalProducto, setModalProducto] = useState<Product | null>(null);

  // Lista de productos con RUTAS DE TEXTO (Strings)
  const [products] = useState<Product[]>([
    {
      id: 'cuadro-1',
      name: 'Set de Marcos Familiares',
      price: 45000,
      // CORREGIDO: Usamos comillas y la ruta directa
      image: '/assets/Frame Picture.png', 
      description: 'Conjunto de marcos negros ideales para collage de fotos familiares en sala de estar.',
      badge: 'Más Vendido',
      badgeColor: 'bg-warning text-dark',
      whatsappText: 'Hola, me interesa el Set de Marcos Familiares'
    },
    {
      id: 'cuadro-2',
      name: 'Marco Minimalista Moderno',
      price: 18990,
      image: '/assets/fameproxima.png',
      description: 'Marco delgado de aluminio negro, perfecto para láminas de arte moderno o títulos.',
      badge: 'Nuevo',
      badgeColor: 'bg-success',
      whatsappText: 'Hola, me interesa el Marco Minimalista Moderno'
    },
    {
      id: 'cuadro-3',
      name: 'Marco Dorado Clásico',
      price: 32500,
      image: '/assets/marcoDoradoClasico.png',
      description: 'Elegancia pura. Marco de madera con acabado dorado envejecido para óleos o retratos.',
      badge: 'Premium',
      badgeColor: 'bg-dark',
      whatsappText: 'Hola, me interesa el Marco Dorado Clásico'
    },
    {
      id: 'cuadro-4',
      name: 'Marco Madera Rústica',
      price: 24990,
      image: '/assets/marcoRustico.png',
      description: 'Madera natural sin tratar, ideal para decoraciones estilo campo o boho chic.',
      badge: 'Oferta',
      badgeColor: 'bg-danger',
      whatsappText: 'Hola, me interesa el Marco Madera Rústica'
    },
    {
      id: 'cuadro-5',
      name: 'Marco para Diploma',
      price: 15000,
      image: '/assets/marco.diplomaa.png',
      description: 'Diseño sobrio y formal para exhibir tus logros académicos con orgullo.',
      badge: 'Destacado',
      badgeColor: 'bg-info text-dark',
      whatsappText: 'Hola, me interesa el Marco para Diploma'
    },
    {
      id: 'cuadro-6',
      name: 'Marco Vintage Tallado',
      price: 55000,
      image: '/assets/marcoantigo.png',
      description: 'Marco ancho con detalles tallados a mano, acabado nogal oscuro.',
      badge: 'Exclusivo',
      badgeColor: 'bg-primary',
      whatsappText: 'Hola, me interesa el Marco Vintage Tallado'
    }
  ]);

  const agregarAlCarrito = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name, 
      price: product.price,
      image: product.image
    });
    setModalProducto(null);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">Nuestros Cuadros</h1>
        <p className="lead text-muted">
          Marcos listos para colgar con la mejor calidad del mercado.
        </p>
      </div>

      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-md-6 col-lg-4 col-xl-3">
            <div className="card h-100 shadow-sm border-0 product-card">
              <span className={`badge ${product.badgeColor} position-absolute top-0 start-0 m-3 shadow-sm`}>
                {product.badge}
              </span>
              
              {/* Botón Editar Falso (Solo visual para Admin) */}
              {user?.isAdmin && (
                 <button className="btn btn-sm btn-warning position-absolute top-0 end-0 m-3" 
                    onClick={(e) => { e.stopPropagation(); alert("Edición disponible próximamente en Panel Admin"); }}>
                    <i className="fas fa-edit"></i>
                 </button>
              )}

              <div 
                style={{ cursor: 'pointer', height: '250px', overflow: 'hidden' }}
                onClick={() => setModalProducto(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top w-100 h-100 object-fit-cover"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Sin+Foto'; }}
                />
              </div>

              <div className="card-body text-center d-flex flex-column">
                <h5 className="card-title fw-bold text-dark mb-1">{product.name}</h5>
                <p className="text-muted small mb-3 text-truncate">{product.description}</p>
                
                <div className="mt-auto">
                  <div className="mb-3">
                    <span className="fs-5 fw-bold text-primary">
                      {CLP.format(product.price)}
                    </span>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-primary rounded-pill"
                      onClick={() => setModalProducto(product)}
                    >
                      Ver Detalles
                    </button>
                    <button 
                      className="btn btn-primary rounded-pill shadow-sm"
                      onClick={() => agregarAlCarrito(product)}
                    >
                      <i className="fas fa-shopping-cart me-2"></i>
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalle */}
      {modalProducto && (
        <ProductDetailModal
          show={!!modalProducto}
          onClose={() => setModalProducto(null)}
          product={{
            name: modalProducto.name,
            image: modalProducto.image,
            description: modalProducto.description,
            price: modalProducto.price,
            whatsappHref: `https://wa.me/56912345678?text=${encodeURIComponent(modalProducto.whatsappText)}`
          }}
          onAddToCart={() => agregarAlCarrito(modalProducto)}
        />
      )}
    </div>
  );
};

export default Cuadros;