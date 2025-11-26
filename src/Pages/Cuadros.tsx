import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';
import framePicture from '/assets/Frame Picture.png';
import fameProxima from '/assets/fameproxima.png';

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

const Cuadros = () => {
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
      const soloCuadros = res.data.filter((p: Product) => 
        p.categoria?.nombre.toLowerCase().includes("cuadros")
      );
      setProducts(soloCuadros);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando cuadros:", error);
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
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="col-lg-4 col-md-6">
                  <div className="card cuadro-card h-100">
                    <img 
                      src={product.imagenUrl} 
                      className="card-img-top card-img-cover" 
                      alt={product.nombre}
                      onError={(e) => { 
                        e.currentTarget.src = "https://placehold.co/400x400?text=Sin+Foto"; 
                      }} 
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{product.nombre}</h5>
                      <p className="card-text">{product.descripcion}</p>
                      <p className="precio-destacado">{CLP.format(product.precio)}</p>
                      <small className={`d-block mt-2 fw-bold ${product.stock < 5 ? 'text-danger' : 'text-success'}`}>
                        <i className="fas fa-box-open me-1"></i>
                        {product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}
                      </small>
                      <div className="d-flex flex-wrap gap-2 mt-3 product-actions justify-content-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setModalProducto(product)}
                        >
                          <i className="fas fa-eye me-1"></i> Ver detalles
                        </button>
                        <a
                          href={`https://api.whatsapp.com/send?phone=56227916878&text=${encodeURIComponent(`Hola, me interesa '${product.nombre}'`)}`}
                          className="btn btn-success btn-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fab fa-whatsapp"></i> Consultar
                        </a>
                        <button
                          className="btn btn-sm btn-primary agregar-carrito"
                          onClick={() => agregarAlCarrito(product)}
                          disabled={product.stock === 0}
                        >
                          <i className="fas fa-cart-plus me-1"></i> Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="alert alert-info">No se encontraron cuadros en la base de datos.</div>
              </div>
            )}
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

      {/* Modal */}
      {modalProducto && (
        <ProductDetailModal
          show={!!modalProducto}
          onClose={() => setModalProducto(null)}
          product={{
            name: modalProducto.nombre,
            image: modalProducto.imagenUrl,
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

export default Cuadros;