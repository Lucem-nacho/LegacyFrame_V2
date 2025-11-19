import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductDetailModal from "../components/ProductDetailModal";
// Sustituimos imágenes faltantes por equivalentes existentes
import moldura3 from "../assets/moldura3.jpg";
import moldura4 from "../assets/moldura4.jpg";
// moldura3 y moldura4 ya importadas arriba
import rustica1 from "../assets/rustica1.jpg";
import naturales1 from "../assets/naturales1.jpg";
import nativas1 from "../assets/nativas1.jpg";
import fingerJoint1 from "../assets/finger_joint1.jpg";

type Category = "grecas" | "rusticas" | "naturales" | "nativas" | "finger-joint" | "all";

interface Product {
  id: string;
  name: string;
  priceFrom: number; // para formateo
  priceTo: number;   // para formateo
  image: string;
  description: string;
  category: Exclude<Category, "all">;
  badge: string;
  badgeColor: string; // bootstrap bg-*
  whatsappText: string;
}

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });
// Precio único para todas las molduras (ajústalo si quieres otro valor)
const SINGLE_PRICE = 20000;

const Molduras = () => {
  const { addItem } = useCart();
  const { user } = useAuth(); // Obtener usuario autenticado para verificar si es admin
  const [category, setCategory] = useState<Category>("all");
  const [modalData, setModalData] = useState<null | {
    name: string;
    image: string;
    price: string;
    description: string;
    whatsappHref: string;
  }>(null);
  const [selectedProduct, setSelectedProduct] = useState<null | Product>(null);
  const [editingProduct, setEditingProduct] = useState<null | Product>(null); // Producto siendo editado

  // Estado para lista de productos (convertido de const a useState para permitir edición/eliminación)
  const [products, setProducts] = useState<Product[]>([
    {
      id: "greca-zo",
      name: "I 09 greca zo",
      priceFrom: SINGLE_PRICE,
      priceTo: SINGLE_PRICE,
image: moldura3,
      description:
        "Elegante greca decorativa con diseño tradicional ZO. Ideal para marcos clásicos.",
      category: "grecas",
      badge: "GRECAS",
      badgeColor: "bg-primary",
      whatsappText: "Consulta por moldura I 09 greca zo",
      },
      {
        id: "greca-corazon",
        name: "I 09 greca corazón",
        priceFrom: SINGLE_PRICE,
        priceTo: SINGLE_PRICE,
  image: moldura4,
        description:
          "Hermosa greca con motivo de corazón, perfecta para marcos románticos.",
        category: "grecas",
        badge: "GRECAS",
        badgeColor: "bg-primary",
        whatsappText: "Consulta por moldura I 09 greca corazón",
      },
      {
        id: "greca-oro",
        name: "P 15 greca LA oro",
        priceFrom: SINGLE_PRICE,
        priceTo: SINGLE_PRICE,
        image: moldura3,
        description: "Greca con acabado dorado, elegante y sofisticada.",
        category: "grecas",
        badge: "GRECAS",
        badgeColor: "bg-primary",
        whatsappText: "Consulta por moldura P 15 greca LA oro",
      },
      {
        id: "greca-plata",
        name: "P 15 greca LA plata",
        priceFrom: SINGLE_PRICE,
        priceTo: SINGLE_PRICE,
        image: moldura4,
        description: "Greca con acabado plateado, moderna y elegante.",
        category: "grecas",
        badge: "GRECAS",
        badgeColor: "bg-primary",
        whatsappText: "Consulta por moldura P 15 greca LA plata",
      },
      {
        id: "rustica-azul",
        name: "H 20 albayalde azul",
        priceFrom: SINGLE_PRICE,
        priceTo: SINGLE_PRICE,
        image: rustica1,
        description:
          "Moldura rústica con acabado albayalde azul, ideal para ambientes campestres.",
        category: "rusticas",
        badge: "RÚSTICAS",
        badgeColor: "bg-info",
        whatsappText: "Consulta por moldura H 20 albayalde azul",
      },
      {
        id: "natural-alerce",
        name: "B-10 t/alerce",
        priceFrom: SINGLE_PRICE,
        priceTo: SINGLE_PRICE,
        image: naturales1,
        description:
          "Moldura natural de alerce con textura original de la madera.",
        category: "naturales",
        badge: "NATURALES",
        badgeColor: "bg-success",
        whatsappText: "Consulta por moldura B-10 t/alerce",
      },
      {
        id: "nativa-j16",
        name: "J-16",
        priceFrom: SINGLE_PRICE,
        priceTo: SINGLE_PRICE,
        image: nativas1,
        description:
          "Moldura de madera nativa chilena, resistente y de gran calidad.",
        category: "nativas",
        badge: "NATIVAS",
        badgeColor: "bg-secondary",
        whatsappText: "Consulta por moldura J-16",
      },
      {
        id: "finger-p12",
        name: "P-12 Finger Joint",
        priceFrom: SINGLE_PRICE,
        priceTo: SINGLE_PRICE,
        image: fingerJoint1,
        description:
          "Moldura finger joint de alta calidad con unión invisible.",
        category: "finger-joint",
        badge: "FINGER JOINT",
        badgeColor: "bg-warning",
      whatsappText: "Consulta por moldura P-12 Finger Joint",
    },
  ]);  const filtered = useMemo(
    () =>
      products.filter((p) => (category === "all" ? true : p.category === category)),
    [category, products]
  );

  const formatPriceLabel = (from: number, to: number) =>
    from === to ? CLP.format(from) : `${CLP.format(from)} - ${CLP.format(to)}`;

  const openCart = () => {
    const offEl = document.getElementById("carritoOffcanvas");
    if (offEl) {
      const off = (window as any).bootstrap ? new (window as any).bootstrap.Offcanvas(offEl) : null;
      off?.show();
    }
  };

  const addToCart = (p: Product) => {
    addItem(
      {
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.priceFrom, // precio único numérico para totales
        priceText: formatPriceLabel(p.priceFrom, p.priceTo),
      },
      1
    );
    openCart();
  };

  const openModal = (p: Product) => {
  const price = formatPriceLabel(p.priceFrom, p.priceTo);
    const whatsappMsg = `Hola, me interesa la moldura ${p.name}. ¿Podrían darme más información?`;
    setSelectedProduct(p);
    setModalData({
      name: p.name,
      image: p.image,
      price,
      description: p.description,
      whatsappHref: `https://api.whatsapp.com/send?phone=56227916878&text=${encodeURIComponent(
        whatsappMsg
      )}`,
    });
    // Mostrar modal con Bootstrap
    const modalEl = document.getElementById("productModal");
    const modal = (window as any).bootstrap && modalEl ? new (window as any).bootstrap.Modal(modalEl) : null;
    modal?.show();
  };

  // ==================== FUNCIONES DE ADMINISTRADOR ====================
  
  // Abre modal de edición para un producto (solo admin)
  const openEditModal = (p: Product) => {
    setEditingProduct({ ...p });
    const modalEl = document.getElementById("editModal");
    const modal = (window as any).bootstrap && modalEl ? new (window as any).bootstrap.Modal(modalEl) : null;
    modal?.show();
  };

  // Guarda cambios del producto editado
  const saveEdit = () => {
    if (!editingProduct) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    // Cerrar modal
    const modalEl = document.getElementById("editModal");
    const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modalEl);
    modalInstance?.hide();
    setEditingProduct(null);
  };

  // Elimina un producto (con confirmación)
  const deleteProduct = (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="container my-4">
      {/* Header Principal */}
      <div className="container-fluid bg-light py-4 rounded shadow-sm mb-4">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-5 mb-2 section-title">MOLDURAS PARA MARCOS</h1>
              <p className="lead text-muted">Descubre nuestra amplia colección de molduras profesionales</p>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item"><a href="/">Inicio</a></li>
                  <li className="breadcrumb-item active">Molduras</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filter-section bg-white p-4 shadow-sm rounded mb-4">
        <h5 className="mb-3">Filtrar por Categoría:</h5>
        <div className="btn-group-toggle d-flex flex-wrap" role="group">
          {(
            [
              { key: "all", label: "Todas", icon: "fa-th", btn: "btn-outline-primary" },
              { key: "grecas", label: "Grecas", icon: "fa-border-style", btn: "btn-outline-info" },
              { key: "rusticas", label: "Rústicas", icon: "fa-tree", btn: "btn-outline-success" },
              { key: "naturales", label: "Naturales", icon: "fa-leaf", btn: "btn-outline-warning" },
              { key: "nativas", label: "Nativas", icon: "fa-mountain", btn: "btn-outline-secondary" },
              { key: "finger-joint", label: "Finger Joint", icon: "fa-link", btn: "btn-outline-dark" },
            ] as const
          ).map((c) => (
            <button
              key={c.key}
              className={`btn ${c.btn} me-2 mb-2 ${category === (c.key as Category) ? "active" : ""}`}
              onClick={() => setCategory(c.key as Category)}
            >
              <i className={`fas ${c.icon}`}></i> {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Galería */}
      <div className="row g-4" id="products-container">
        {filtered.map((p) => (
          <div key={p.id} className="col-xl-3 col-lg-4 col-md-6 product-item" data-category={p.category}>
            <div className="product-card h-100">
              <div className="product-image-container">
                <img src={p.image} className="product-image" alt={p.name} />
              </div>
              <div className="product-info">
                <h6 className="product-title">{p.name}</h6>
                <p className="product-price">{formatPriceLabel(p.priceFrom, p.priceTo)}</p>
                <span className={`badge ${p.badgeColor}`}>{p.badge}</span>
                <div className="product-actions mt-2 d-flex flex-wrap gap-2">
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => openModal(p)}>
                    <i className="fas fa-eye"></i> Ver detalles
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?phone=56227916878&text=${encodeURIComponent(p.whatsappText)}`}
                    className="btn btn-success btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-whatsapp"></i> Consultar
                  </a>
                  <button className="btn btn-primary btn-sm agregar-carrito" onClick={() => addToCart(p)}>
                    <i className="fas fa-cart-plus me-1"></i> Agregar
                  </button>
                  
                  {/* Botones de administrador (solo visibles si el usuario es admin) */}
                  {user?.isAdmin && (
                    <>
                      <button className="btn btn-warning btn-sm" onClick={() => openEditModal(p)}>
                        <i className="fas fa-edit"></i> Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p.id)}>
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

      {/* Información adicional */}
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <div className="info-section bg-light p-4 rounded">
              <div className="row">
                <div className="col-md-8">
                  <h4>¿Por qué elegir nuestras molduras?</h4>
                  <ul className="list-unstyled mt-3">
                    <li><i className="fas fa-check-circle text-success me-2"></i> Más de 25 años de experiencia</li>
                    <li><i className="fas fa-check-circle text-success me-2"></i> Materiales de primera calidad</li>
                    <li><i className="fas fa-check-circle text-success me-2"></i> Amplia variedad de estilos y acabados</li>
                    <li><i className="fas fa-check-circle text-success me-2"></i> Precios competitivos</li>
                    <li><i className="fas fa-check-circle text-success me-2"></i> Asesoramiento personalizado</li>
                  </ul>
                </div>
                <div className="col-md-4 text-center">
                  <h5>¿Necesitas ayuda?</h5>
                  <p>Nuestro equipo está listo para asesorarte</p>
                  <a href="/contacto" className="btn btn-primary">Contáctanos</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductDetailModal
        id="productModal"
        product={
          selectedProduct && {
            name: selectedProduct.name,
            image: selectedProduct.image,
            description: selectedProduct.description,
            priceText: formatPriceLabel(selectedProduct.priceFrom, selectedProduct.priceTo),
            whatsappHref: modalData?.whatsappHref,
          }
        }
        onAddToCart={() => {
          if (selectedProduct) addToCart(selectedProduct);
        }}
      />

      {/* Modal de edición de producto (solo para admin) */}
      {user?.isAdmin && editingProduct && (
        <div className="modal fade" id="editModal" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Moldura</h5>
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
                    value={editingProduct.priceFrom}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        priceFrom: Number(e.target.value),
                        priceTo: Number(e.target.value),
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
                    Puedes pegar una URL o usar rutas locales como: moldura3, moldura4, etc.
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

export default Molduras;