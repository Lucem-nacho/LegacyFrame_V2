import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <div className="container">
        <div className="row">
          {/* Información de la Empresa */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-title">Legacy Frames</h5>
            <p className="footer-text">
              Especialistas en marcos y cuadros de calidad. Más de 25 años transformando tus recuerdos en obras de arte.
            </p>
            <div className="footer-location">
              <i className="fas fa-map-marker-alt"></i>
              <span>Departamental 623, Santiago</span>
            </div>
          </div>

          {/* Navegación */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-title">Navegación</h5>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/cuadros">Cuadros</Link></li>
              <li><Link to="/molduras">Molduras</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
              <li><Link to="/login">Iniciar Sesión</Link></li>
            </ul>
          </div>

          {/* Información de Contacto */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-title">Contacto</h5>
            <div className="footer-contact">
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>227 916 878</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>227 237 949</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>info@legacyframes.cl</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <span>Lun-Vie: 9:00-18:00</span>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-title">Síguenos</h5>
            <div className="footer-social">
              <a href="#" className="social-link">
                <i className="fab fa-facebook-f"></i>
                <span>Facebook</span>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
                <span>Instagram</span>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-whatsapp"></i>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Línea separadora y copyright */}
        <hr className="footer-divider" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="footer-copyright">
              © 2025 Legacy Frames. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;