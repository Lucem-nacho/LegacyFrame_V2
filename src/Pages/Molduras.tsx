import { useMemo, useState, useEffect } from "react";
import axios from "axios"; 
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductDetailModal from "../components/ProductDetailModal";

const placeholder = "/assets/moldura3.jpg"; 

type Category = "grecas" | "rusticas" | "naturales" | "nativas" | "finger-joint" | "all";

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

// --- CORRECCIÓN CLAVE EN LA INTERFAZ ---
// Java envía la categoría como un OBJETO dentro del producto, no como un número suelto.
interface BackendProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoria: {   // <--- AQUÍ ESTABA EL DETALLE
      id: number;
      nombre: string;
  }; 
}

interface BackendCategory {
  id: number;
  nombre: string;
}

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

const Molduras = () => {
  const { addItem } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [modalProducto, setModalProducto] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProductos, resCategorias] = await Promise.all([
          axios.get<BackendProduct[]>("http://localhost:8083/api/catalog/productos"),
          axios.get<BackendCategory[]>("http://localhost:8083/api/catalog/categorias")
        ]);

        const todosLosProductos = resProductos.data;
        const todasLasCategorias = resCategorias.data;

        // 1. Detectar ID de Cuadros
        const catCuadros = todasLasCategorias.find(c => c.nombre.toLowerCase() === "cuadros");
        const idCuadros = catCuadros ? catCuadros.id : -999; 

        // 2. FILTRO CORREGIDO: Usamos p.categoria.id
        const soloMolduras = todosLosProductos.filter(p => p.categoria.id !== idCuadros);

        // 3. Mapeo
        const mappedProducts: Product[] = soloMolduras.map((p) => {
          // Obtenemos el nombre directamente del objeto categoría que viene dentro del producto
          let catName = p.categoria.nombre.toLowerCase();

          // Ajustes de nombres para coincidir con botones
          if (catName.includes("finger")) catName = "finger-joint";
          
          const validCategories = ["grecas", "rusticas", "naturales", "nativas", "finger-joint"];
          if (!validCategories.includes(catName)) {
             catName = "all";
          }

          return {
            id: p.id,
            name: p.nombre,
            priceFrom: p.precio,
            priceTo: p.precio,
            image: p.imagenUrl ? p.imagenUrl : placeholder, 
            description: p.descripcion || "Sin descripción",
            category: catName as Category,
            badge: p.stock > 0 ? "Disponible" : "Agotado",
            badgeColor: p.stock > 0 ? "bg-success" : "bg-danger",
            whatsappText: `Hola, me interesa la moldura ${p.nombre}`
          };
        });

        setProducts(mappedProducts);
        setLoading(false);

      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, products]);

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
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">Nuestras Molduras</h1>
        <p className="lead text-muted">Colección exclusiva conectada al inventario.</p>
      </div>

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

      <div className="row g-4">
        {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-4 col-xl-3">
              <div className="card h-100 shadow-sm border-0 product-card">
                <span className={`badge ${product.badgeColor} position-absolute top-0 start-0 m-3 shadow-sm`}>{product.badge}</span>
                <div style={{ cursor: 'pointer', height: '250px', overflow: 'hidden' }} onClick={() => setModalProducto(product)}>
                  <img src={product.image} alt={product.name} className="card-img-top w-100 h-100 object-fit-cover" onError={(e) => { e.currentTarget.src = placeholder; }} />
                </div>
                <div className="card-body text-center d-flex flex-column">
                  <h5 className="card-title fw-bold text-dark mb-1">{product.name}</h5>
                  <div className="mt-auto">
                    <div className="mb-3"><span className="fs-5 fw-bold text-primary">{CLP.format(product.priceFrom)}</span></div>
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-primary rounded-pill" onClick={() => setModalProducto(product)}>Ver Detalles</button>
                      <button className="btn btn-primary rounded-pill shadow-sm" onClick={() => agregarAlCarrito(product)} disabled={product.badge === "Agotado"}>
                        <i className="fas fa-shopping-cart me-2"></i>Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

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