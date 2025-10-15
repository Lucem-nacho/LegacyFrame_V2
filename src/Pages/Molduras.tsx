import { useMemo, useState } from "react";
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

const Molduras = () => {
  const [category, setCategory] = useState<Category>("all");
  const [modalData, setModalData] = useState<null | {
    name: string;
    image: string;
    price: string;
    description: string;
    whatsappHref: string;
  }>(null);

  const products: Product[] = useMemo(
    () => [
      {
        id: "greca-zo",
        name: "I 09 greca zo",
        priceFrom: 10000,
        priceTo: 65000,
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
        priceFrom: 10000,
        priceTo: 70000,
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
        priceFrom: 10000,
        priceTo: 38000,
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
        priceFrom: 10000,
        priceTo: 105000,
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
        priceFrom: 10000,
        priceTo: 130000,
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
        priceFrom: 10000,
        priceTo: 65000,
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
        priceFrom: 10000,
        priceTo: 73000,
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
        priceFrom: 8500,
        priceTo: 47000,
        image: fingerJoint1,
        description:
          "Moldura finger joint de alta calidad con unión invisible.",
        category: "finger-joint",
        badge: "FINGER JOINT",
        badgeColor: "bg-warning",
        whatsappText: "Consulta por moldura P-12 Finger Joint",
      },
    ],
    []
  );

  const filtered = useMemo(
    () =>
      products.filter((p) => (category === "all" ? true : p.category === category)),
    [category, products]
  );

  const formatRange = (from: number, to: number) => `${CLP.format(from)} - ${CLP.format(to)}`;

  const openModal = (p: Product) => {
    const price = formatRange(p.priceFrom, p.priceTo);
    const whatsappMsg = `Hola, me interesa la moldura ${p.name}. ¿Podrían darme más información?`;
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
    // @ts-expect-error - window.bootstrap viene del bundle de Bootstrap agregado en index.html
    const modal = new window.bootstrap.Modal(modalEl);
    modal.show();
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
                <div className="product-overlay">
                  <button className="btn btn-light btn-sm" onClick={() => openModal(p)}>
                    <i className="fas fa-eye"></i> Ver Detalles
                  </button>
                </div>
              </div>
              <div className="product-info">
                <h6 className="product-title">{p.name}</h6>
                <p className="product-price">{formatRange(p.priceFrom, p.priceTo)}</p>
                <span className={`badge ${p.badgeColor}`}>{p.badge}</span>
                <div className="product-actions mt-2 d-flex justify-content-between align-items-center">
                  <a
                    href={`https://api.whatsapp.com/send?phone=56227916878&text=${encodeURIComponent(p.whatsappText)}`}
                    className="btn btn-success btn-sm me-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-whatsapp"></i> Consultar
                  </a>
                  <button className="btn btn-primary btn-sm agregar-carrito">
                    <i className="fas fa-cart-plus me-1"></i> Agregar
                  </button>
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

      {/* Modal de producto (Bootstrap) */}
      <div className="modal fade" id="productModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalData?.name || ""}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body text-center">
              {modalData && (
                <>
                  <img src={modalData.image} className="img-fluid mb-3 modal-img" alt={modalData.name} />
                  <h4>{modalData.name}</h4>
                  <p className="fs-4 text-primary fw-bold">{modalData.price}</p>
                  <p className="text-muted">{modalData.description}</p>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              {modalData && (
                <a href={modalData.whatsappHref} className="btn btn-success" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp"></i> Consultar por WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Molduras;