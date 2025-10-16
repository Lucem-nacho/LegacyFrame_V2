import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid"> 
        <Link className="navbar-brand" to="/">
          <img className="logo-brand" src={logo} alt="Legacy Frames" />
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/molduras">Molduras</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cuadros">Cuadros</Link>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Más
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/contacto">Contacta</Link></li>
                <li><Link className="dropdown-item" to="/">Empresa</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/registro">Registro</Link></li>
              </ul>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {/* Carrito */}
            <button 
              className="btn btn-outline-dark me-2 position-relative btn-carrito" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#carritoOffcanvas" 
              aria-controls="carritoOffcanvas"
            >
              <i className="fas fa-shopping-cart"></i>
              <span 
                id="contadorCarrito" 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none"
              >
                0
              </span>
            </button>
            <span id="navbarAuthArea" className="d-flex align-items-center">
              <Link className="btn btn-outline-dark me-2" to="/registro">
                <i className="fas fa-user-plus me-1"></i>Registro
              </Link>
              <Link className="btn btn-dark" to="/login">
                <i className="fas fa-sign-in-alt me-1"></i>Ingresar
              </Link>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;