import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid"> 
        <Link className="navbar-brand" to="/">
          {/* CORRECCIÓN: Usamos la ruta de texto directa a la carpeta public */}
          <img className="logo-brand" src="/assets/logo.png" alt="Legacy Frames" />
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
              {/* Puedes agregar más items aquí si es necesario */}
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            {/* Botón del Carrito */}
            <button 
              className="btn btn-outline-light position-relative me-3" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#carritoOffcanvas" 
              aria-controls="carritoOffcanvas"
            >
              <i className="fas fa-shopping-cart"></i>
              {count > 0 && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                >
                  {count}
                </span>
              )}
            </button>
            
            <span id="navbarAuthArea" className="d-flex align-items-center">
              {user ? (
                <>
                  {/* Mostrar email y rol si el usuario está autenticado */}
                  <span className="text-light me-3">
                    {user.email}
                    {user.isAdmin && (
                      <span className="badge bg-warning text-dark ms-2">
                        <i className="fas fa-crown"></i> ADMIN
                      </span>
                    )}
                  </span>

                  {/* --- BOTÓN SOLO PARA ADMIN --- */}
                  {user.isAdmin && (
                    <Link className="btn btn-warning btn-sm me-2 fw-bold" to="/admin">
                      <i className="fas fa-cogs me-1"></i> Panel
                    </Link>
                  )}
                  {/* ----------------------------- */}

                  <button className="btn btn-outline-light btn-sm" onClick={logout}>
                    <i className="fas fa-sign-out-alt me-1"></i>Salir
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn btn-outline-dark me-2" to="/registro">
                    <i className="fas fa-user-plus me-1"></i>Registro
                  </Link>
                  <Link className="btn btn-dark" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i>Ingresar
                  </Link>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;