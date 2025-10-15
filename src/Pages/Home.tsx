import { Link } from 'react-router-dom';
import moldura3 from '../assets/moldura3.jpg';
import moldura4 from '../assets/moldura4.jpg';
import rustica1 from '../assets/rustica1.jpg';
import framePicture from '../assets/Frame Picture.png';

const Home = () => {
  return (
    <div>
      {/* Banner Principal */}
      <div className="container-fluid p-0">
        <img className="banner-img" src={framePicture} alt="Banner Cuadros" />
      </div>

      <div className="container">
        <div className="empresa-container">
          <div className="empresa-header">
            <h1>Legacy Frames</h1>
            <p className="lead">Tradición y calidad en enmarcación desde 1998</p>
          </div>

          {/* Productos Más Vendidos */}
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="text-center mb-4 section-title">Nuestros Productos Más Populares</h2>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="caracteristica text-center">
                    <img className="product-thumb" src={moldura3} alt="I 09 greca zo" />
                    <h5>I 09 Greca ZO</h5>
                    <p className="mb-2">Moldura greca clásica con diseño tradicional ZO, perfecta para fotografías familiares y documentos importantes.</p>
                    <p className="precio-destacado">$10.000 - $65.000</p>
                    <span className="badge bg-success">Más Vendido</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="caracteristica text-center">
                    <img className="product-thumb" src={moldura4} alt="I 09 greca corazón" />
                    <h5>I 09 Greca Corazón</h5>
                    <p className="mb-2">Elegante moldura greca con motivo de corazón, ideal para fotografías románticas y recuerdos especiales.</p>
                    <p className="precio-destacado">$10.000 - $70.000</p>
                    <span className="badge bg-info">Tendencia</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="caracteristica text-center">
                    <img className="product-thumb" src={rustica1} alt="H 20 albayalde azul" />
                    <h5>H 20 Albayalde Azul</h5>
                    <p className="mb-2">Moldura rústica premium con acabado albayalde azul, perfecta para obras de arte y fotografías especiales.</p>
                    <p className="precio-destacado">$10.000 - $130.000</p>
                    <span className="badge bg-warning">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historia */}
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

          {/* Estadísticas */}
          <div className="row mb-5 text-center">
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

          {/* Características */}
          <div className="row mb-5">
            <div className="col-12">
              <h3 className="text-center mb-4 section-title">¿Por qué elegirnos?</h3>
              
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

          {/* Equipo */}
          <div className="row mb-5">
            <div className="col-12">
              <h3 className="text-center mb-4 section-title">Nuestro Equipo</h3>
              <div className="row">
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
                <div className="col-md-6 text-center">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h5>�‍🔧 Ignacio</h5>
                      <p className="text-muted">Jefe de Producción</p>
                      <p>📱 997 658 131</p>
                      <p className="small">Experto en fabricación de molduras y técnicas avanzadas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <section className="cta-section py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h3 className="mb-2">¿Listo para Enmarcar tu Historia?</h3>
              <p className="mb-0">Transformamos tus recuerdos en obras de arte que durarán para siempre</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/contacto" className="btn btn-light btn-lg me-2">
                <i className="fas fa-phone me-2"></i>Contactar
              </Link>
              <Link to="/registro" className="btn btn-outline-light btn-lg">
                <i className="fas fa-user-plus me-2"></i>Únete
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;