import { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductDetailModal from '../components/ProductDetailModal';

const placeholder = "https://via.placeholder.com/300x300?text=Sin+Foto";

interface Product {
  id: number; 
  name: string;
  price: number;
  image: string;
  description: string;
  badge: string;
  badgeColor: string;
  whatsappText: string;
}

// --- INTERFAZ CORREGIDA ---
interface BackendProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoria: {      // <--- CAMBIO AQUÍ
    id: number;
    nombre: string;
  }; 
}

interface BackendCategory {
    id: number;
    nombre: string;
}

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

const Cuadros = () => {
  const { addItem } = useCart();
  const { user } = useAuth(); 
  
  const [modalProducto, setModalProducto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCuadros = async () => {
      try {
        // Pedimos Productos y Categorías
        const [resProductos, resCategorias] = await Promise.all([
            axios.get<BackendProduct[]>("http://localhost:8083/api/catalog/productos"),
            axios.get<BackendCategory[]>("http://localhost:8083/api/catalog/categorias")
        ]);

        const todosLosProductos = resProductos.data;
        const todasLasCategorias = resCategorias.data;
        
        // 1. Detectar ID de Cuadros dinámicamente
        const catCuadros = todasLasCategorias.find(c => c.nombre.toLowerCase() === "cuadros");
        const idCuadros = catCuadros ? catCuadros.id : -999;

        // 2. FILTRAR: Solo dejamos pasar lo que tenga ID de cuadros
        // USAMOS p.categoria.id (Objeto anidado)
        const soloCuadros = todosLosProductos.filter(p => p.categoria.id === idCuadros);

        const mappedProducts: Product[] = soloCuadros.map((p) => ({
          id: p.id,
          name: p.nombre,
          price: p.precio,
          image: p.imagenUrl ? p.imagenUrl : placeholder,
          description: p.descripcion || "Sin descripción",
          badge: p.stock < 10 ? "Últimas Unidades" : "Disponible",
          badgeColor: p.stock < 10 ? "bg-warning text-dark" : "bg-success",
          whatsappText: `Hola, me interesa el cuadro ${p.nombre}`
        }));

        setProducts(mappedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando cuadros:", error);
        setLoading(false);
      }
    };

    fetchCuadros();
  }, []);

  const agregarAlCarrito = (product: Product) => {
    addItem({
      id: product.id.toString(), 
      name: product.name,
      price: product.price,
      image: product.image
    });
    setModalProducto(null);
  };

  if (loading) {
    return (
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div>
        </div>
      );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">Nuestros Cuadros</h1>
        <p className="lead text-muted">Marcos listos para colgar con la mejor calidad del mercado.</p>
      </div>

      <div className="row g-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-4 col-xl-3">
              <div className="card h-100 shadow-sm border-0 product-card">
                <span className={`badge ${product.badgeColor} position-absolute top-0 start-0 m-3 shadow-sm`}>{product.badge}</span>
                {user?.isAdmin && (
                   <button className="btn btn-sm btn-warning position-absolute top-0 end-0 m-3" onClick={(e) => { e.stopPropagation(); alert("Edición próximamente"); }}>
                      <i className="fas fa-edit"></i>
                   </button>
                )}
                <div style={{ cursor: 'pointer', height: '250px', overflow: 'hidden' }} onClick={() => setModalProducto(product)}>
                  <img src={product.image} alt={product.name} className="card-img-top w-100 h-100 object-fit-cover" onError={(e) => { e.currentTarget.src = placeholder; }} />
                </div>
                <div className="card-body text-center d-flex flex-column">
                  <h5 className="card-title fw-bold text-dark mb-1">{product.name}</h5>
                  <div className="mt-auto">
                    <div className="mb-3"><span className="fs-5 fw-bold text-primary">{CLP.format(product.price)}</span></div>
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-primary rounded-pill" onClick={() => setModalProducto(product)}>Ver Detalles</button>
                      <button className="btn btn-primary rounded-pill shadow-sm" onClick={() => agregarAlCarrito(product)}>
                        <i className="fas fa-shopping-cart me-2"></i>Agregar
                      </button>
                    </div>
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