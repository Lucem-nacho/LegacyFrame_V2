import { useMemo, useState, useEffect } from "react";
import axios from "axios"; 
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductDetailModal from "../components/ProductDetailModal";

// --- CORRECCIÓN AQUÍ ---
// Ya no usamos 'import'. Definimos la ruta directa a la carpeta public/assets
const placeholder = "/assets/moldura3.jpg"; 
// -----------------------

// Tipos de categorías para los filtros
type Category = "grecas" | "rusticas" | "naturales" | "nativas" | "finger-joint" | "all";

// Interfaz para el producto en el Frontend (React)
interface Product {
  id: number;        
  name: string;
  priceFrom: number;
  priceTo: number;
  image: string;
  description: string;
  category: Category;
  badge: string;
  badgeColor: string;
  whatsappText: string;
}

// Interfaz para lo que recibimos del Backend (Java)
interface BackendProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoriaId: number; 
}

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

const Molduras = () => {
  const { addItem } = useCart();
  const { user } = useAuth();
  
  // Estados
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [modalProducto, setModalProducto] = useState<Product | null>(null);

  // --- 1. CARGAR PRODUCTOS DESDE LA API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Asegúrate de que tu backend (ms_productos) esté corriendo en el puerto 8083
        const response = await axios.get<BackendProduct[]>("http://localhost:8083/api/catalog/productos");
        
        const mappedProducts: Product[] = response.data.map((p) => ({
          id: p.id,
          name: p.nombre,
          priceFrom: p.precio,
          priceTo: p.precio,
          // Si hay URL úsala, si no, usa el placeholder
          image: p.imagenUrl ? p.imagenUrl : placeholder, 
          description: p.descripcion || "Sin descripción disponible.",
          category: "all", // Ajusta esto si implementas lógica de categorías en el futuro
          badge: p.stock > 0 ? "Disponible" : "Agotado",
          badgeColor: p.stock > 0 ? "bg-success" : "bg-danger",
          whatsappText: `Hola, me interesa la moldura ${p.nombre}`
        }));

        setProducts(mappedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando molduras:", error);
        // Si falla la API, dejamos la lista vacía y quitamos el loading
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- Filtrado ---
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, products]);

  // --- 2. AGREGAR AL CARRITO ---
  const agregarAlCarrito = (product: Product) => {
    addItem({
      id: product.id.toString(), 
      name: product.name,
      price: product.priceFrom,
      image: product.image
    });
    setModalProducto(null); 
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <h2 className="mt-3">Cargando catálogo...</h2>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">Nuestras Molduras</h1>
        <p className="lead text-muted">
          Colección exclusiva conectada al inventario en tiempo real.
        </p>
      </div>

      {/* Filtros */}
      <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
        {(["all", "grecas", "rusticas", "naturales", "nativas", "finger-joint"] as Category[]).map((cat) => (
          <button
            key={cat}
            className={`btn ${selectedCategory === cat ? "btn-primary" : "btn-outline-secondary"} text-capitalize rounded-pill px-4`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === "all" ? "Todas" : cat.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Grilla de Productos */}
      <div className="row g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-4 col-xl-3">
              <div className="card h-100 shadow-sm border-0 product-card">
                <span className={`badge ${product.badgeColor} position-absolute top-0 start-0 m-3 shadow-sm`}>
                  {product.badge}
                </span>
                
                <div 
                  style={{ cursor: 'pointer', height: '250px', overflow: 'hidden' }}
                  onClick={() => setModalProducto(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img-top w-100 h-100 object-fit-cover"
                    // Si la imagen falla, usa el placeholder definido arriba
                    onError={(e) => { e.currentTarget.src = placeholder; }} 
                  />
                </div>

                <div className="card-body text-center d-flex flex-column">
                  <h5 className="card-title fw-bold text-dark mb-1">{product.name}</h5>
                  <p className="text-muted small mb-3 text-truncate">{product.description}</p>
                  
                  <div className="mt-auto">
                    <div className="mb-3">
                      <span className="fs-5 fw-bold text-primary">
                        {CLP.format(product.priceFrom)}
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
                        disabled={product.badge === "Agotado"}
                      >
                        <i className="fas fa-shopping-cart me-2"></i>
                        {product.badge === "Agotado" ? "Sin Stock" : "Agregar"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="alert alert-warning d-inline-block">
              <i className="fas fa-exclamation-triangle me-2"></i>
              No se encontraron productos en esta categoría o la base de datos está vacía.
            </div>
          </div>
        )}
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
            price: modalProducto.priceFrom,
            whatsappHref: `https://wa.me/56912345678?text=${encodeURIComponent(modalProducto.whatsappText)}`
          }}
          onAddToCart={() => agregarAlCarrito(modalProducto)}
        />
      )}
    </div>
  );
};

export default Molduras;