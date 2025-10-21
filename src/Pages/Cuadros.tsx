import { useState } from 'react';
import { useCart } from '../context/CartContext';
import framePicture from '../assets/Frame Picture.png';
import fameProxima from '../assets/fameproxima.png';
import marcoDoradoClasico from '../assets/marcoDoradoClasico.png';
import marcoMinimalista from '../assets/marco-minimalista-ambiente-moderno_23-2149301885.jpg';
import marcoRustico from '../assets/marcoRustico.png';
import marcoDiploma from '../assets/marco.diplomaa.png';
import marcoAntigo from '../assets/marcoantigo.png';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  badge: string;
  badgeColor: string;
}

const Cuadros = () => {
  const { addItem } = useCart();
  const [modalProducto, setModalProducto] = useState<Product | null>(null);

  const products: Product[] = [
    {
      id: 'cuadro-1',
      name: 'Marco Clásico Dorado',
      price: 25000,
      image: marcoDoradoClasico,
      description: 'Marco elegante con acabado dorado, ideal para obras de arte y fotografías especiales.',
      badge: 'PREMIUM',
      badgeColor: 'bg-warning'
    },
    {
      id: 'cuadro-2', 
      name: 'Marco Moderno Minimalista',
      price: 18000,
      image: marcoMinimalista,
      description: 'Diseño contemporáneo y limpio, perfecto para espacios modernos y fotografías actuales.',
      badge: 'MODERNO',
      badgeColor: 'bg-info'
    },
    {
      id: 'cuadro-3',
      name: 'Marco Rústico de Madera',
      price: 22000,
      image: marcoRustico,
      description: 'Acabado rústico natural, ideal para ambientes campestres y fotografías de naturaleza.',
      badge: 'NATURAL', 
      badgeColor: 'bg-success'
    },
    {
      id: 'cuadro-4',
      name: 'Marco para Diplomas',
      price: 15000,
      image: marcoDiploma,
      description: 'Especializado en enmarcación de diplomas y certificados importantes con protección UV.',
      badge: 'PROFESIONAL',
      badgeColor: 'bg-primary'
    },
    {
      id: 'cuadro-5',
      name: 'Marco Vintage Antiguo',
      price: 28000,
      image: marcoAntigo,
      description: 'Estilo vintage con detalles ornamentales, perfecto para fotografías familiares clásicas.',
      badge: 'VINTAGE',
      badgeColor: 'bg-secondary'
    },
    
  ];

  

  const agregarAlCarrito = (producto: Product) => {
    addItem({ id: producto.id, name: producto.name, image: producto.image, price: producto.price }, 1);
    abrirOffcanvas();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP' 
    }).format(price);
  };

  const getWhatsAppUrl = (productName: string) => {
    return `https://api.whatsapp.com/send?phone=56945621740&text=Hola, me interesa el '${productName}'`;
  };

  const abrirOffcanvas = () => {
    const offEl = document.getElementById('carritoOffcanvas');
    if (offEl) {
      // @ts-expect-error - Bootstrap JS global
      const off = new window.bootstrap.Offcanvas(offEl);
      off.show();
    }
  };

  return (
    <div>
      {/* Galería de Cuadros */}
      <div className="container my-5">
        <div className="cuadros-galeria">
          <h2 className="text-center mb-4 section-title">Galería de Cuadros y Marcos</h2>
          
          {/* Carousel de Cuadros Destacados */}
          <div id="carouselCuadros" className="carousel slide mb-5" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={framePicture} className="d-block w-100 carousel-img" alt="Cuadro 1" />
              </div>
              <div className="carousel-item">
                <img src={fameProxima} className="d-block w-100 carousel-img" alt="Cuadro 2" />
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselCuadros" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselCuadros" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>

          {/* Descripción */}
          <div className="text-center mb-5">
            <p className="lead">Explora nuestra colección de cuadros enmarcados y servicios de enmarcación profesional.</p>
            <p>Ofrecemos enmarcación personalizada para tus obras de arte, fotografías, diplomas y documentos importantes.</p>
          </div>
          
          {/* Cuadros */}
          <div className="row g-4">
            {products.map((product) => (
              <div key={product.id} className="col-lg-4 col-md-6">
                <div className="card cuadro-card h-100">
                  <img src={product.image} className="card-img-top card-img-cover" alt={product.name} />
                  <div className="card-body text-center">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="precio-destacado">Desde {formatPrice(product.price)}</p>
                    <span className={`badge ${product.badgeColor}`}>{product.badge}</span>
                    <div className="d-flex flex-wrap gap-2 mt-3 product-actions">
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          setModalProducto(product);
                          const el = document.getElementById('cuadroModal');
                          if (el) {
                            // @ts-expect-error - Bootstrap JS global
                            const modal = new window.bootstrap.Modal(el);
                            modal.show();
                          }
                        }}
                      >
                        <i className="fas fa-eye me-1"></i> Ver detalles
                      </button>
                      <a 
                        href={getWhatsAppUrl(product.name)} 
                        className="btn btn-success btn-sm me-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-whatsapp"></i> Consultar
                      </a>
                      <button 
                        className="btn btn-sm btn-primary agregar-carrito"
                        onClick={() => agregarAlCarrito(product)}
                      >
                        <i className="fas fa-cart-plus me-1"></i> Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Servicios Adicionales */}
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="text-center mb-4 section-title">Nuestros Servicios</h3>
              <div className="row g-3">
                <div className="col-md-4 text-center">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body">
                      <h5>🖼️ Enmarcación Personalizada</h5>
                      <p>Creamos marcos a medida para cualquier tipo de obra o documento.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body">
                      <h5>🚚 Despacho a Domicilio</h5>
                      <p>Entregamos tus cuadros enmarcados directamente en tu hogar.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body">
                      <h5>⚡ Servicio Express</h5>
                      <p>Enmarcación rápida en 24-48 horas para casos urgentes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de producto (Bootstrap) */}
      <div className="modal fade" id="cuadroModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalProducto?.name || ''}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body text-center">
              {modalProducto && (
                <>
                  <img src={modalProducto.image} className="img-fluid mb-3 modal-img" alt={modalProducto.name} />
                  <h4>{modalProducto.name}</h4>
                  <p className="fs-5 text-primary fw-bold">{formatPrice(modalProducto.price)}</p>
                  <p className="text-muted">{modalProducto.description}</p>
                </>
              )}
            </div>
            <div className="modal-footer">
              {modalProducto && (
                <>
                  <a 
                    href={getWhatsAppUrl(modalProducto.name)} 
                    className="btn btn-success" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-whatsapp"></i> Consultar por WhatsApp
                  </a>
                  <button
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={() => { addItem({ id: modalProducto.id, name: modalProducto.name, image: modalProducto.image, price: modalProducto.price }, 1); abrirOffcanvas(); }}
                  >
                    <i className="fas fa-cart-plus me-1"></i> Agregar al carrito
                  </button>
                </>
              )}
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cuadros;