import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductDetailModal from '../components/ProductDetailModal';
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
  const { user } = useAuth(); // Obtener usuario para verificar si es admin
  const [modalProducto, setModalProducto] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Producto siendo editado

  // Convertir a useState para permitir edición/eliminación
  const [products, setProducts] = useState<Product[]>([
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
    
  ]);

  

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
      const off = (window as any).bootstrap ? new (window as any).bootstrap.Offcanvas(offEl) : null;
      off?.show();
    }
  };

  // ==================== FUNCIONES DE ADMINISTRADOR ====================
  
  // Abre modal de edición para un cuadro (solo admin)
  const openEditModal = (p: Product) => {
    setEditingProduct({ ...p });
    const modalEl = document.getElementById("editCuadroModal");
    const modal = (window as any).bootstrap && modalEl ? new (window as any).bootstrap.Modal(modalEl) : null;
    modal?.show();
  };

  // Guarda cambios del cuadro editado
  const saveEdit = () => {
    if (!editingProduct) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    // Cerrar modal
    const modalEl = document.getElementById("editCuadroModal");
    const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modalEl);
    modalInstance?.hide();
    setEditingProduct(null);
  };

  // Elimina un cuadro (con confirmación)
  const deleteProduct = (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este cuadro?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
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
                            const modal = (window as any).bootstrap ? new (window as any).bootstrap.Modal(el) : null;
                            modal?.show();
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
                      
                      {/* Botones de administrador (solo visibles si el usuario es admin) */}
                      {user?.isAdmin && (
                        <>
                          <button className="btn btn-warning btn-sm" onClick={() => openEditModal(product)}>
                            <i className="fas fa-edit"></i> Editar
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product.id)}>
                            <i className="fas fa-trash"></i> Eliminar
                          </button>
                        </>
                      )}
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

      <ProductDetailModal
        id="cuadroModal"
        product={
          modalProducto && {
            name: modalProducto.name,
            image: modalProducto.image,
            description: modalProducto.description,
            price: modalProducto.price,
            whatsappHref: getWhatsAppUrl(modalProducto.name),
          }
        }
        onAddToCart={() => {
          if (modalProducto) {
            addItem(
              { id: modalProducto.id, name: modalProducto.name, image: modalProducto.image, price: modalProducto.price },
              1
            );
            abrirOffcanvas();
          }
        }}
      />

      {/* Modal de edición de cuadro (solo para admin) */}
      {user?.isAdmin && editingProduct && (
        <div className="modal fade" id="editCuadroModal" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Cuadro</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Precio (CLP)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">URL de Imagen</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingProduct.image}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image: e.target.value })
                    }
                  />
                  <small className="form-text text-muted">
                    Puedes pegar una URL o usar rutas locales de assets.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={saveEdit}>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cuadros;