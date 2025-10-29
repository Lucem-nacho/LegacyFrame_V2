import { Link } from 'react-router-dom'; // Importa el componente Link para la navegación entre rutas.
import { useState } from 'react'; // Importa el hook useState para manejar el estado local del componente.
import { useCart } from '../context/CartContext'; // Importa el hook useCart para acceder al contexto del carrito.
import ProductDetailModal from '../components/ProductDetailModal'; // Importa el componente modal para mostrar detalles del producto.
import moldura3 from '../assets/moldura3.jpg'; // Importa imagen para producto destacado.
import moldura4 from '../assets/moldura4.jpg'; // Importa imagen para producto destacado.
import rustica1 from '../assets/rustica1.jpg'; // Importa imagen para producto destacado.
import framePicture from '../assets/Frame Picture.png'; // Importa imagen para el banner principal.

// Define el tipo de dato para los productos destacados en la página de inicio.
type Featured = { id: string; name: string; image: string; price: number; description: string };

// Crea un formateador de números para mostrar precios en pesos (CLP).
const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
// Define un precio constante para los productos destacados.
const FEATURED_PRICE = 20000;

// Define el componente funcional Home.
const Home = () => {
  // Obtiene la función addItem del contexto del carrito para añadir productos.
  const { addItem } = useCart();
  // Define un estado local para guardar el producto seleccionado que se mostrará en el modal. Inicialmente es null.
  const [modalProducto, setModalProducto] = useState<Featured | null>(null);

  // Define un array con los datos de los productos destacados que se mostrarán en la página.
  const featuredProducts: Featured[] = [
    {
      id: 'dest-1',
      name: 'I 09 Greca ZO',
      image: moldura3,
      price: FEATURED_PRICE,
      description:
        'Moldura greca clásica con diseño tradicional ZO, perfecta para fotografías familiares y documentos importantes.',
    },
    {
      id: 'dest-2',
      name: 'I 09 Greca Corazón',
      image: moldura4,
      price: FEATURED_PRICE,
      description:
        'Elegante moldura greca con motivo de corazón, ideal para fotografías románticas y recuerdos especiales.',
    },
    {
      id: 'dest-3',
      name: 'H 20 Albayalde Azul',
      image: rustica1,
      price: FEATURED_PRICE,
      description:
        'Moldura rústica premium con acabado albayalde azul, perfecta para obras de arte y fotografías especiales.',
    },
  ];

  // Función para abrir el panel lateral (offcanvas) del carrito.
  const abrirOffcanvas = () => {
    // Busca el elemento del offcanvas en el DOM por su ID.
    const offEl = document.getElementById('carritoOffcanvas');
    if (offEl) {
      // Si el elemento existe, crea una instancia del offcanvas de Bootstrap (si está disponible en window).
      // Se usa '(window as any)' para acceder a 'bootstrap' ya que no está tipado globalmente por defecto.
      const off = (window as any).bootstrap ? new (window as any).bootstrap.Offcanvas(offEl) : null;
      // Muestra el offcanvas.
      off?.show();
    }
  };

  // Función para establecer el producto seleccionado y abrir el modal de detalles.
  const verDetalles = (p: Featured) => {
    // Actualiza el estado 'modalProducto' con el producto clickeado.
    setModalProducto(p);
    // Busca el elemento del modal en el DOM por su ID.
    const el = document.getElementById('featuredModal');
    if (el) {
      // Si el elemento existe, crea una instancia del modal de Bootstrap.
      const modal = (window as any).bootstrap ? new (window as any).bootstrap.Modal(el) : null;
      // Muestra el modal.
      modal?.show();
    }
  };

  // Función para agregar un producto al carrito y luego abrir el offcanvas.
  const agregarAlCarrito = (p: Featured) => {
    // Llama a la función addItem del contexto del carrito, pasando los datos necesarios del producto y la cantidad (1).
    addItem({ id: p.id, name: p.name, image: p.image, price: p.price }, 1);
    // Abre el offcanvas del carrito para mostrar que se añadió el producto.
    abrirOffcanvas();
  };

  // Retorna la estructura JSX del componente Home.
  return (
    <div>
      {/* Sección del Banner Principal */}
      <div className="container-fluid p-0">
        {/* Muestra la imagen del banner */}
        <img className="banner-img" src={framePicture} alt="Banner Cuadros" />
      </div>

      {/* Contenedor principal para el resto del contenido */}
      <div className="container">
        {/* Sección de cabecera de la empresa */}
        <div className="empresa-container">
          <div className="empresa-header">
            <h1>Legacy Frames</h1>
            <p className="lead">Tradición y calidad en enmarcación desde 1998</p>
          </div>

          {/* Sección de Productos Más Vendidos/Populares */}
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="text-center mb-4 section-title">Nuestros Productos Más Populares</h2>
              <div className="row g-4">
                {/* Mapea el array 'featuredProducts' para renderizar una tarjeta por cada producto */}
                {featuredProducts.map((p, idx) => (
                  <div key={p.id} className="col-md-4"> {/* Usa el ID del producto como key */}
                    <div className="caracteristica text-center"> {/* Contenedor de la tarjeta del producto */}
                      <img className="product-thumb" src={p.image} alt={p.name} /> {/* Imagen del producto */}
                      <h5>{p.name}</h5> {/* Nombre del producto */}
                      <p className="mb-2">{p.description}</p> {/* Descripción */}
                      <p className="precio-destacado">{CLP.format(p.price)}</p> {/* Precio formateado */}
                      {/* Contenedor para los botones de acción */}
                      <div className="d-flex justify-content-center gap-2 mt-2">
                        {/* Botón para ver detalles, llama a 'verDetalles' al hacer clic */}
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => verDetalles(p)}>
                          <i className="fas fa-eye me-1"></i> Ver detalles
                        </button>
                        {/* Botón para agregar al carrito, llama a 'agregarAlCarrito' al hacer clic */}
                        <button className="btn btn-primary btn-sm" onClick={() => agregarAlCarrito(p)}>
                          <i className="fas fa-cart-plus me-1"></i> Agregar
                        </button>
                      </div>
                      {/* Muestra badges condicionalmente basados en el índice del producto */}
                      {idx === 0 && <span className="badge bg-success mt-2">Más Vendido</span>}
                      {idx === 1 && <span className="badge bg-info mt-2">Tendencia</span>}
                      {idx === 2 && <span className="badge bg-warning mt-2">Premium</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sección de Historia de la Empresa */}
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="text-center mb-4 section-title">Nuestra Historia</h2>
              <p className="text-justify">
                <strong>Legacy Frames</strong> nació en 1998 con la visión de preservar y realzar los momentos más importantes de nuestros clientes a través del arte de la enmarcación. Con más de <strong>25 años de experiencia</strong> en el rubro, nos hemos consolidado como una empresa líder en Santiago, especializándonos en la fabricación de molduras para cuadros y servicios de enmarcación de alta calidad.
              </p>
              <p className="text-justify">
                Ubicados en <strong>Departamental 623, Santiago</strong>, hemos atendido a miles de clientes, desde particulares que buscan enmarcar sus fotografías familiares más preciadas, hasta instituciones que requieren enmarcación profesional de diplomas y documentos importantes.
              </p>
            </div>
          </div>

          {/* Sección de Estadísticas */}
          <div className="row mb-5 text-center">
            {/* Cada columna representa una estadística */}
            <div className="col-md-3 mb-3">
              <div className="numero-destacado">25+</div>
              <p>Años de Experiencia</p>
            </div>
            <div className="col-md-3 mb-3">
              <div className="numero-destacado">10K+</div>
              <p>Cuadros Enmarcados</p>
            </div>
            <div className="col-md-3 mb-3">
              <div className="numero-destacado">5</div>
              <p>Tipos de Molduras</p>
            </div>
            <div className="col-md-3 mb-3">
              <div className="numero-destacado">100%</div>
              <p>Satisfacción</p>
            </div>
          </div>

          {/* Sección de Características o Propuesta de Valor */}
          <div className="row mb-5">
            <div className="col-12">
              <h3 className="text-center mb-4 section-title">¿Por qué elegirnos?</h3>
              {/* Cada div 'caracteristica' describe un punto fuerte */}
              <div className="caracteristica">
                <h5>🏆 Experiencia Comprobada</h5>
                <p className="mb-0">Más de 25 años perfeccionando técnicas de enmarcación y atendiendo las necesidades específicas de cada cliente.</p>
              </div>
              <div className="caracteristica">
                <h5>🎨 Especialistas en Molduras</h5>
                <p className="mb-0">Contamos con 5 tipos diferentes de molduras: grecas, rústicas, naturales, nativas y finger joint.</p>
              </div>
              <div className="caracteristica">
                <h5>🚚 Servicio Integral</h5>
                <p className="mb-0">Desde la fabricación hasta la entrega a domicilio en Santiago y despacho a provincia.</p>
              </div>
              <div className="caracteristica">
                <h5>⚡ Rapidez y Calidad</h5>
                <p className="mb-0">Servicio express de 24-48 horas para casos urgentes, sin comprometer la calidad.</p>
              </div>
              <div className="caracteristica">
                <h5>💼 Atención Profesional</h5>
                <p className="mb-0">Asesoramiento personalizado con nuestro equipo de especialistas en enmarcación.</p>
              </div>
            </div>
          </div>

          {/* Sección del Equipo */}
          <div className="row mb-5">
            <div className="col-12">
              <h3 className="text-center mb-4 section-title">Nuestro Equipo</h3>
              <div className="row">
                {/* Tarjeta para Sergio */}
                <div className="col-md-6 text-center">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h5>👨‍💼 Sergio</h5>
                      <p className="text-muted">Director General</p>
                      <p>📱 963 691 673</p>
                      <p className="small">Especialista en enmarcación tradicional y diseño personalizado</p>
                    </div>
                  </div>
                </div>
                {/* Tarjeta para Ignacio */}
                <div className="col-md-6 text-center">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h5>🧑‍🔧 Ignacio</h5>
                      <p className="text-muted">Jefe de Producción</p>
                      <p>📱 997 658 131</p>
                      <p className="small">Experto en fabricación de molduras y técnicas avanzadas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> {/* Cierre de 'empresa-container' */}
      </div> {/* Cierre de 'container' */}

      {/* Sección de Llamada a la Acción (Call to Action - CTA) */}
      <section className="cta-section py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h3 className="mb-2">¿Listo para Enmarcar tu Historia?</h3>
              <p className="mb-0">Transformamos tus recuerdos en obras de arte que durarán para siempre</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              {/* Enlace a la página de Contacto */}
              <Link to="/contacto" className="btn btn-light btn-lg me-2">
                <i className="fas fa-phone me-2"></i>Contactar
              </Link>
              {/* Enlace a la página de Registro */}
              <Link to="/registro" className="btn btn-outline-light btn-lg">
                <i className="fas fa-user-plus me-2"></i>Únete
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Renderiza el componente Modal para detalles de producto */}
      <ProductDetailModal
        id="featuredModal" // ID único para este modal
        // Pasa los datos del producto seleccionado (si existe) al modal
        product={
          modalProducto && { // Si 'modalProducto' no es null, crea el objeto
            name: modalProducto.name,
            image: modalProducto.image,
            description: modalProducto.description,
            price: modalProducto.price,
            // Construye la URL de WhatsApp con un mensaje predefinido
            whatsappHref:
              'https://wa.me/56912345678?text=' + // Reemplaza con el número real
              encodeURIComponent( // Codifica el mensaje para la URL
                `Hola, me interesa ${modalProducto.name} (${CLP.format(modalProducto.price)})`
              ),
          }
        }
        // Pasa la función que se ejecutará al hacer clic en "Agregar al carrito" dentro del modal
        onAddToCart={() => {
          // Asegura que 'modalProducto' no sea null antes de agregarlo
          if (modalProducto) agregarAlCarrito(modalProducto);
        }}
      />
    </div> // Cierre del div principal del componente
  );
};

// Exporta el componente Home para poder usarlo en otras partes de la aplicación (ej. App.tsx).
export default Home;

// Declara globalmente que 'window' puede tener una propiedad 'bootstrap'.
// Esto es útil si Bootstrap JS se carga globalmente y necesitas acceder a él,
// aunque idealmente se manejaría con importaciones si usas paquetes npm.
declare global { interface Window { bootstrap: any } }