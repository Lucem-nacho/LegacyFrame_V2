import { useMemo, useState, useEffect } from "react";
import axios from "axios"; 
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductDetailModal from "../components/ProductDetailModal";

const placeholder = "https://via.placeholder.com/300x300/cccccc/000000?text=Sin+Imagen";

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
  stock: number;
  categoriaIdOriginal: number; // Guardamos el ID real de la categoría para editar
}

interface BackendProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoria: {
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
  const [allCategories, setAllCategories] = useState<BackendCategory[]>([]); // Para el select del modal
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [modalProducto, setModalProducto] = useState<Product | null>(null);

  // --- ESTADOS PARA EDICIÓN ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id: 0,
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagenUrl: "",
    categoriaId: ""
  });

  const cargarDatos = async () => {
    try {
      const [resProductos, resCategorias] = await Promise.all([
        axios.get<BackendProduct[]>("http://localhost:8083/api/catalog/productos"),
        axios.get<BackendCategory[]>("http://localhost:8083/api/catalog/categorias")
      ]);

      const todosLosProductos = resProductos.data;
      const todasLasCategorias = resCategorias.data;
      setAllCategories(todasLasCategorias);

      const catCuadros = todasLasCategorias.find(c => c.nombre && c.nombre.trim().toLowerCase() === "cuadros");
      const idCuadros = catCuadros ? catCuadros.id : -999; 

      const soloMolduras = todosLosProductos.filter(p => p.categoria.id !== idCuadros);

      const mappedProducts: Product[] = soloMolduras.map((p) => {
        let catName = p.categoria.nombre ? p.categoria.nombre.trim().toLowerCase() : "all";
        if (catName.includes("finger")) catName = "finger-joint";
        
        const validCategories = ["grecas", "rusticas", "naturales", "nativas", "finger-joint"];
        if (!validCategories.includes(catName)) catName = "all";

        return {
          id: p.id,
          name: p.nombre,
          priceFrom: p.precio,
          priceTo: p.precio,
          image: p.imagenUrl ? p.imagenUrl : placeholder, 
          description: p.descripcion || "Sin descripción disponible.",
          category: catName as Category,
          badge: p.stock === 0 ? "Agotado" : (p.stock < 10 ? "¡Últimas Unidades!" : "Disponible"),
          badgeColor: p.stock === 0 ? "bg-danger" : (p.stock < 10 ? "bg-warning text-dark" : "bg-success"),
          whatsappText: `Hola, me interesa la moldura ${p.nombre}`,
          stock: p.stock,
          categoriaIdOriginal: p.categoria.id
        };
      });

      setProducts(mappedProducts);
      setLoading(false);

    } catch (error) {
      console.error("Error cargando datos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
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
      image: product.image,
      stockMax: product.stock
    });
    setModalProducto(null); 
  };

  // --- FUNCIONES DE EDICIÓN ---
  const handleEditClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se abra el modal de detalles
    setEditData({
      id: product.id,
      nombre: product.name,
      descripcion: product.description,
      precio: product.priceFrom.toString(),
      stock: product.stock.toString(),
      imagenUrl: product.image,
      categoriaId: product.categoriaIdOriginal.toString()
    });
    setShowEditModal(true);
  };

  const handleGuardarCambios = async () => {
    try {
      const payload = {
        nombre: editData.nombre,
        descripcion: editData.descripcion,
        precio: parseFloat(editData.precio),
        stock: parseInt(editData.stock),
        imagenUrl: editData.imagenUrl || placeholder,
        categoria: { id: parseInt(editData.categoriaId) }
      };

      await axios.put(`http://localhost:8083/api/catalog/productos/${editData.id}`, payload);
      alert("¡Producto actualizado!");
      setShowEditModal(false);
      cargarDatos(); // Recargar para ver cambios
    } catch (error) {
      console.error("Error actualizando:", error);
      alert("Error al guardar cambios.");
    }
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

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
                
                {/* BOTÓN EDITAR (SOLO ADMIN) */}
                {user?.isAdmin && (
                   <button 
                      className="btn btn-sm btn-warning position-absolute top-0 end-0 m-3 z-3 shadow" 
                      onClick={(e) => handleEditClick(product, e)}
                   >
                      <i className="fas fa-edit text-dark"></i>
                   </button>
                )}

                <div style={{ cursor: 'pointer', height: '250px', overflow: 'hidden' }} onClick={() => setModalProducto(product)}>
                  <img src={product.image} alt={product.name} className="card-img-top w-100 h-100 object-fit-cover" onError={(e) => { e.currentTarget.src = placeholder; }} />
                </div>
                <div className="card-body text-center d-flex flex-column">
                  <h5 className="card-title fw-bold text-dark mb-1">{product.name}</h5>
                  <p className="text-muted small mb-2 text-truncate">{product.description}</p>
                  
                  <div className="mb-3">
                    <span className="fs-5 fw-bold text-primary d-block">{CLP.format(product.priceFrom)}</span>
                    <small className={`fw-bold ${product.stock < 5 ? 'text-danger' : 'text-success'}`}>
                        <i className="fas fa-box-open me-1"></i>
                        {product.stock > 0 ? `Disponibles: ${product.stock}` : "Sin Stock"}
                    </small>
                  </div>

                  <div className="mt-auto d-grid gap-2">
                    <button className="btn btn-outline-primary rounded-pill" onClick={() => setModalProducto(product)}>Ver Detalles</button>
                    <button className="btn btn-primary rounded-pill shadow-sm" onClick={() => agregarAlCarrito(product)} disabled={product.stock === 0}>
                      <i className="fas fa-shopping-cart me-2"></i>{product.stock === 0 ? "Agotado" : "Agregar"}
                    </button>
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
            whatsappHref: `https://wa.me/56912345678?text=${encodeURIComponent(modalProducto.whatsappText)}`,
            stock: modalProducto.stock
          }}
          onAddToCart={() => agregarAlCarrito(modalProducto)}
        />
      )}

      {/* --- MODAL DE EDICIÓN --- */}
      {showEditModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title fw-bold text-dark"><i className="fas fa-edit me-2"></i>Editar Producto</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" value={editData.nombre} onChange={e => setEditData({...editData, nombre: e.target.value})} />
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label">Precio</label>
                      <input type="number" className="form-control" value={editData.precio} onChange={e => setEditData({...editData, precio: e.target.value})} />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Stock</label>
                      <input type="number" className="form-control" value={editData.stock} onChange={e => setEditData({...editData, stock: e.target.value})} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select className="form-select" value={editData.categoriaId} onChange={e => setEditData({...editData, categoriaId: e.target.value})}>
                      {allCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Imagen URL</label>
                    <input type="text" className="form-control" value={editData.imagenUrl} onChange={e => setEditData({...editData, imagenUrl: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" rows={3} value={editData.descripcion} onChange={e => setEditData({...editData, descripcion: e.target.value})}></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleGuardarCambios}>Guardar Cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Molduras;