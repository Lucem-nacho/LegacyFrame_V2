import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { count } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container-fluid"> 
        {/* LOGO */}
        <Link className="navbar-brand" to="/">
          <img className="logo-brand" src="/assets/logo.png" alt="Legacy Frames" />
        </Link>
        
        {/* BOTÓN HAMBURGUESA (MÓVIL) */}
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
          {/* ENLACES PRINCIPALES (Izquierda) */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/molduras">Molduras</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cuadros">Cuadros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
          </ul>
          
          {/* ZONA DERECHA (Carrito + Usuario) */}
          <div className="d-flex align-items-center flex-wrap gap-2 mt-2 mt-lg-0">
            
            {/* BOTÓN DEL CARRITO */}
            <button 
              className="btn btn-outline-light position-relative border-0" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#carritoOffcanvas" 
              aria-controls="carritoOffcanvas"
            >
              <i className="fas fa-shopping-cart fa-lg"></i>
              {count > 0 && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                >
                  {count}
                </span>
              )}
            </button>
            
            {/* ZONA DE USUARIO */}
            {user ? (
              <>
                {/* --- NUEVO BOTÓN: MI PERFIL (Visible siempre) --- */}
                <Link 
                  to="/perfil" 
                  className="btn btn-outline-light btn-sm d-flex align-items-center"
                  title={`Sesión iniciada como ${user.email}`}
                >
                  <i className="fas fa-user-circle fa-lg me-2"></i>
                  <span className="fw-bold">Mi Perfil</span>
                </Link>
                {/* ----------------------------------------------- */}

                {/* BOTÓN ADMIN (SOLO SI ES ADMIN) */}
                {user.isAdmin && (
                  <Link className="btn btn-warning btn-sm fw-bold text-dark" to="/admin">
                    <i className="fas fa-cogs me-1"></i> Admin
                  </Link>
                )}
                
                {/* BOTÓN SALIR */}
                <button className="btn btn-danger btn-sm" onClick={logout}>
                  <i className="fas fa-sign-out-alt me-1"></i>
                </button>
              </>
            ) : (
              // SI NO HAY USUARIO
              <>
                <Link className="btn btn-outline-light me-2 btn-sm" to="/registro">
                  <i className="fas fa-user-plus me-1"></i> Registro
                </Link>
                <Link className="btn btn-light btn-sm" to="/login">
                  <i className="fas fa-sign-in-alt me-1"></i> Ingresar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;