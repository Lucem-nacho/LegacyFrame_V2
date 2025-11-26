import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}

// --- CORRECCIÓN AQUÍ: Adaptamos la interfaz a lo que devuelve Java ---
interface Detalle {
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
}

interface Pedido {
  id: number;
  fechaCreacion: string;
  estado: string;
  total: number;
  detalles: Detalle[]; // Antes se llamaba 'items', ahora es 'detalles'
}
// -------------------------------------------------------------------

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

const Perfil = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  const [perfil, setPerfil] = useState<UserProfile | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    nombre: "", apellido: "", email: "", telefono: "", direccion: ""
  });
  const [passwordData, setPasswordData] = useState({ password: "", confirmPassword: "" });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      cargarDatos();
    }
  }, [user, loading]);

  const cargarDatos = async () => {
    try {
      setDataLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        logout();
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 1. Cargar Perfil
      const resPerfil = await axios.get(`http://localhost:8082/auth/perfil?email=${user?.email}`, config);
      setPerfil(resPerfil.data);
      setFormData(resPerfil.data);

      // 2. Cargar Historial
      try {
        const resPedidos = await axios.get(`http://localhost:8084/api/orders/my-orders?email=${user?.email}`, config);
        console.log("Pedidos recibidos:", resPedidos.data); // Para depuración en consola
        setPedidos(resPedidos.data);
      } catch (errPedidos) {
        console.warn("No se encontraron pedidos o error en API", errPedidos);
        setPedidos([]);
      }

      setDataLoading(false);
    } catch (error) {
      console.error("Error cargando perfil:", error);
      setDataLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.password && passwordData.password !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        password: passwordData.password || "",
        confirmPassword: passwordData.confirmPassword || ""
      };

      await axios.put("http://localhost:8082/auth/profile", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Perfil actualizado correctamente.");
      setEditMode(false);
      setPasswordData({ password: "", confirmPassword: "" });
      cargarDatos();
    } catch (error) {
      console.error("Error actualizando:", error);
      alert("Error al actualizar perfil.");
    }
  };

  if (loading || dataLoading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary fw-bold"><i className="fas fa-user-circle me-2"></i>Mi Perfil</h1>

      <div className="row g-4">
        {/* DATOS PERSONALES */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white fw-bold text-primary">
              Mis Datos
              {!editMode && (
                <button className="btn btn-sm btn-outline-primary float-end" onClick={() => setEditMode(true)}>
                  <i className="fas fa-pencil-alt"></i> Editar
                </button>
              )}
            </div>
            <div className="card-body">
              {editMode ? (
                <form onSubmit={handleUpdate}>
                  <div className="mb-2">
                    <label className="small text-muted">Nombre</label>
                    <input type="text" className="form-control" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                  </div>
                  <div className="mb-2">
                    <label className="small text-muted">Apellido</label>
                    <input type="text" className="form-control" value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} />
                  </div>
                  <div className="mb-2">
                    <label className="small text-muted">Teléfono</label>
                    <input type="text" className="form-control" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                  </div>
                  <div className="mb-2">
                    <label className="small text-muted">Dirección</label>
                    <input type="text" className="form-control" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
                  </div>
                  <hr />
                  <div className="mb-2">
                    <input type="password" placeholder="Nueva contraseña" className="form-control mb-2" value={passwordData.password} onChange={e => setPasswordData({...passwordData, password: e.target.value})} />
                    <input type="password" placeholder="Confirmar" className="form-control" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                  </div>
                  <div className="d-grid gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">Guardar</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setEditMode(false)}>Cancelar</button>
                  </div>
                </form>
              ) : (
                <div className="lh-lg">
                  <p><strong>Nombre:</strong> {perfil?.nombre} {perfil?.apellido}</p>
                  <p><strong>Email:</strong> {perfil?.email}</p>
                  <p><strong>Teléfono:</strong> {perfil?.telefono || "No registrado"}</p>
                  <p><strong>Dirección:</strong> {perfil?.direccion || "No registrada"}</p>
                  <div className="d-grid mt-4">
                    <button className="btn btn-outline-danger btn-sm" onClick={logout}>Cerrar Sesión</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HISTORIAL DE PEDIDOS */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white fw-bold text-success">
              <i className="fas fa-shopping-bag me-2"></i>Historial de Pedidos
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Fecha</th>
                      <th>Detalle</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* AQUÍ ESTABA EL ERROR: Cambiamos 'items' por 'detalles' y agregamos '?' */}
                    {pedidos.map((ped) => (
                      <tr key={ped.id}>
                        <td className="fw-bold">#{ped.id}</td>
                        <td>{new Date(ped.fechaCreacion).toLocaleDateString()}</td>
                        <td>
                          <ul className="list-unstyled mb-0 small">
                            {/* PROTECCIÓN: Usamos 'detalles?' y '|| []' por seguridad */}
                            {(ped.detalles || []).map((det, idx) => (
                              <li key={idx}>• {det.cantidad}x {det.nombreProducto}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="fw-bold text-primary">{CLP.format(ped.total)}</td>
                        <td><span className="badge bg-success">{ped.estado}</span></td>
                      </tr>
                    ))}
                    {pedidos.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-5 text-muted">
                          <i className="fas fa-box-open fa-2x mb-3 d-block"></i>
                          No se encontraron pedidos para este usuario.<br/>
                          <small>Intenta realizar una compra primero.</small>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;