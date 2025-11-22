import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirigir al login si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Mientras redirige
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <i className="fas fa-user-circle me-2"></i>
                Mi Perfil
              </h3>
            </div>
            <div className="card-body p-4">
              {/* Información del Usuario */}
              <div className="mb-4">
                <h5 className="border-bottom pb-2 mb-3">Información de Cuenta</h5>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Correo Electrónico:</strong>
                  </div>
                  <div className="col-md-8">
                    <span className="text-muted">{user.email}</span>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Tipo de Cuenta:</strong>
                  </div>
                  <div className="col-md-8">
                    {user.isAdmin ? (
                      <span className="badge bg-warning text-dark fs-6">
                        <i className="fas fa-crown me-1"></i>
                        Administrador
                      </span>
                    ) : (
                      <span className="badge bg-info fs-6">
                        <i className="fas fa-user me-1"></i>
                        Usuario
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Privilegios de Admin */}
              {user.isAdmin && (
                <div className="mb-4">
                  <h5 className="border-bottom pb-2 mb-3">
                    <i className="fas fa-shield-alt me-2"></i>
                    Privilegios de Administrador
                  </h5>
                  <div className="alert alert-warning">
                    <strong>Tienes acceso completo al sistema:</strong>
                    <ul className="mb-0 mt-2">
                      <li>Editar molduras y cuadros (nombre, precio, descripción, imagen)</li>
                      <li>Eliminar productos del catálogo</li>
                      <li>Gestión completa de inventario</li>
                    </ul>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    <a href="/molduras" className="btn btn-outline-primary btn-sm">
                      <i className="fas fa-border-style me-1"></i>
                      Gestionar Molduras
                    </a>
                    <a href="/cuadros" className="btn btn-outline-primary btn-sm">
                      <i className="fas fa-image me-1"></i>
                      Gestionar Cuadros
                    </a>
                  </div>
                </div>
              )}

              {/* Enlaces Rápidos */}
              <div className="mb-4">
                <h5 className="border-bottom pb-2 mb-3">Enlaces Rápidos</h5>
                <div className="d-flex gap-2 flex-wrap">
                  <a href="/molduras" className="btn btn-outline-secondary btn-sm">
                    <i className="fas fa-border-style me-1"></i>
                    Ver Molduras
                  </a>
                  <a href="/cuadros" className="btn btn-outline-secondary btn-sm">
                    <i className="fas fa-image me-1"></i>
                    Ver Cuadros
                  </a>
                  <a href="/contacto" className="btn btn-outline-secondary btn-sm">
                    <i className="fas fa-envelope me-1"></i>
                    Contacto
                  </a>
                </div>
              </div>

              {/* Acciones de Cuenta */}
              <div className="border-top pt-3 mt-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <a href="/" className="btn btn-outline-primary">
                    <i className="fas fa-home me-1"></i>
                    Volver al Inicio
                  </a>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Información Adicional para Usuarios Normales */}
          {!user.isAdmin && (
            <div className="card shadow mt-4">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-info-circle me-2"></i>
                  Acerca de Legacy Frames
                </h5>
                <p className="card-text">
                  Gracias por formar parte de Legacy Frames. Ofrecemos molduras y cuadros de la más alta calidad
                  con más de 25 años de experiencia en el mercado.
                </p>
                <p className="mb-0">
                  <strong>¿Necesitas ayuda?</strong> Visita nuestra sección de{' '}
                  <a href="/contacto">contacto</a> para comunicarte con nuestro equipo.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
