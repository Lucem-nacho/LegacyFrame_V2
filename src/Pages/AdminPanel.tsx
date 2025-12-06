import { useEffect, useState } from "react";
import axios from "axios";

// --- INTERFACES ---
interface Pedido {
  id: number;
  usuarioEmail: string;
  fechaCreacion: string;
  estado: string;
  total: number;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoria: {
    id: number;
    nombre: string;
  };
}

interface Mensaje {
  id: number;
  nombre: string;
  email: string;
  mensaje: string;
  fechaEnvio: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

// URL BASE DEL BACKEND DE PRODUCTOS (Para servir imágenes)
const API_PRODUCTOS_URL = "http://localhost:8083";

const AdminPanel = () => {
  // Datos del Dashboard
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]); 
  const [categorias, setCategorias] = useState<Categoria[]>([]); 
  
  const [loading, setLoading] = useState(true);

  // Estados para el Formulario (Crear/Editar)
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Estado para el archivo seleccionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagenUrl: "",
    categoriaId: "" 
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      const [resPed, resProd, resMsg, resCat] = await Promise.all([
        axios.get("http://localhost:8084/api/orders/admin/all"),
        axios.get("http://localhost:8083/api/catalog/productos"),
        axios.get("http://localhost:8081/api/contactos"), 
        axios.get("http://localhost:8083/api/catalog/categorias")
      ]);

      setPedidos(resPed.data);
      setProductos(resProd.data);
      setMensajes(resMsg.data);
      setCategorias(resCat.data);

      try {
          const token = localStorage.getItem("token");
          if (token) {
              const resUsers = await axios.get("http://localhost:8082/auth/list", {
                  headers: { Authorization: `Bearer ${token}` }
              });
              setUsuarios(resUsers.data);
          }
      } catch (authError) {
          console.warn("No se pudo cargar la lista de usuarios. Verifica permisos de ADMIN.");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error cargando datos generales:", error);
      setLoading(false);
    }
  };

  // --- FUNCIÓN HELPER MEJORADA PARA IMÁGENES ---
  const getImageUrl = (url: string) => {
    if (!url) return "https://placehold.co/400x400?text=Sin+Foto";
    
    // 1. Si es externa, se deja igual
    if (url.startsWith("http")) return url;

    // 2. CORRECCIÓN AUTOMÁTICA: Si viene con ruta antigua (/assets/), la cambiamos a /images/
    let cleanUrl = url.replace("/assets/", "/images/");

    // 3. Aseguramos que empiece con /
    if (!cleanUrl.startsWith("/")) cleanUrl = "/" + cleanUrl;

    // 4. Concatenamos con el servidor backend
    return `${API_PRODUCTOS_URL}${cleanUrl}`;
  };

  // --- FUNCIÓN PARA SUBIR IMAGEN ---
  const uploadImage = async (): Promise<string> => {
    if (!selectedFile) return formData.imagenUrl; // Si no hay archivo nuevo, devuelve la URL actual

    const data = new FormData();
    data.append("file", selectedFile);

    try {
      // Subimos al backend en el puerto 8083
      const res = await axios.post(`${API_PRODUCTOS_URL}/api/catalog/productos/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data; // Retorna la ruta ej: /images/uuid_foto.jpg
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      alert("Error al subir la imagen al servidor");
      return "";
    }
  };

  // --- FUNCIÓN ELIMINAR PRODUCTO ---
  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8083/api/catalog/productos/${id}`);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      alert("Producto eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Hubo un error al intentar eliminar el producto.");
    }
  };

  // --- ABRIR MODAL PARA CREAR ---
  const abrirModalCrear = () => {
    setEditingId(null); 
    setSelectedFile(null); // Limpiar archivo seleccionado
    setFormData({ nombre: "", descripcion: "", precio: "", stock: "", imagenUrl: "", categoriaId: "" });
    setShowModal(true);
  };

  // --- ABRIR MODAL PARA EDITAR ---
  const abrirModalEditar = (producto: Producto) => {
    setEditingId(producto.id);
    setSelectedFile(null); // Limpiar archivo seleccionado
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      imagenUrl: producto.imagenUrl,
      categoriaId: producto.categoria ? producto.categoria.id.toString() : ""
    });
    setShowModal(true);
  };

  // --- GUARDAR (CREAR O EDITAR) ---
  const handleGuardar = async () => {
    if (!formData.nombre || !formData.precio || !formData.categoriaId) {
      alert("Por favor completa nombre, precio y categoría.");
      return;
    }

    // 1. Subir imagen (si se seleccionó una)
    const urlFinal = await uploadImage();

    // Si falló la subida y era un archivo nuevo, detenemos
    if (selectedFile && !urlFinal) return;

    // Si no hay imagen, ponemos un placeholder
    const imagenParaGuardar = urlFinal.trim() !== "" 
        ? urlFinal 
        : "https://placehold.co/400x400?text=Sin+Foto";

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock) || 0,
      imagenUrl: imagenParaGuardar,
      categoria: {
          id: parseInt(formData.categoriaId)
      }
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:8083/api/catalog/productos/${editingId}`, payload);
        alert("¡Producto actualizado correctamente!");
      } else {
        await axios.post("http://localhost:8083/api/catalog/productos", payload);
        alert("¡Producto creado con éxito!");
      }

      setShowModal(false);
      cargarDatos(); 
      
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("Hubo un error al guardar.");
    }
  };

  const ventasTotales = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);
  const productosBajoStock = productos.filter(p => p.stock < 10);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-primary fw-bold">Panel de Control</h1>
          <span className="badge bg-dark p-2">Administrador</span>
        </div>
        <button className="btn btn-success btn-lg shadow" onClick={abrirModalCrear}>
          <i className="fas fa-plus-circle me-2"></i> Nuevo Producto
        </button>
      </div>

      {/* TARJETAS RESUMEN */}
      <div className="row mb-5">
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3 shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Ventas</h5>
              <p className="card-text fs-4 fw-bold">{CLP.format(ventasTotales)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-dark bg-warning mb-3 shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Pedidos</h5>
              <p className="card-text fs-4 fw-bold">{pedidos.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3 shadow h-100" style={{backgroundColor: '#17a2b8'}}>
            <div className="card-body">
              <h5 className="card-title">Clientes</h5>
              <p className="card-text fs-4 fw-bold"><i className="fas fa-users me-2"></i>{usuarios.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3 shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Stock Crítico</h5>
              <p className="card-text fs-4 fw-bold">{productosBajoStock.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* TABLA DE PRODUCTOS */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
              <span><i className="fas fa-box-open me-2"></i> Inventario de Productos</span>
              <span className="badge bg-primary">{productos.length} Total</span>
            </div>
            <div className="table-responsive" style={{maxHeight: "400px", overflowY: "auto"}}>
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((prod) => (
                    <tr key={prod.id}>
                      <td>#{prod.id}</td>
                      <td>
                        {/* USAMOS EL HELPER PARA MOSTRAR LA IMAGEN LOCAL O EXTERNA */}
                        <img 
                          src={getImageUrl(prod.imagenUrl)} 
                          alt={prod.nombre} 
                          width="40" 
                          height="40" 
                          className="rounded object-fit-cover d-block" 
                          onError={(e) => {
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = "https://placehold.co/400x400?text=Sin+Foto";
                          }}
                        />
                      </td>
                      <td className="fw-bold">{prod.nombre}</td>
                      <td>
                        <span className={`badge ${prod.stock < 5 ? 'bg-danger' : 'bg-success'}`}>
                          {prod.stock}
                        </span>
                      </td>
                      <td>{CLP.format(prod.precio)}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-warning text-dark fw-bold me-2"
                          onClick={() => abrirModalEditar(prod)}
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        
                        <button 
                          className="btn btn-sm btn-danger text-white"
                          onClick={() => handleEliminar(prod.id)}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ALERTA DE STOCK */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white fw-bold text-danger">
              <i className="fas fa-exclamation-triangle me-2"></i> Alerta de Stock
            </div>
            <ul className="list-group list-group-flush">
              {productosBajoStock.slice(0, 6).map(prod => (
                <li key={prod.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <small>{prod.nombre}</small>
                  <span className="badge bg-danger rounded-pill">{prod.stock}</span>
                </li>
              ))}
              {productosBajoStock.length === 0 && <li className="list-group-item text-success">Todo en orden.</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* SECCIÓN MENSAJES Y USUARIOS */}
      <div className="row mt-4">
        
        {/* MENSAJES */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white fw-bold text-primary">
              <i className="fas fa-envelope me-2"></i> Mensajes Recientes
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Fecha</th>
                      <th>Nombre</th>
                      <th>Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mensajes.slice(0, 5).map((msg) => (
                      <tr key={msg.id}>
                        <td>{new Date(msg.fechaEnvio).toLocaleDateString()}</td>
                        <td className="fw-bold">{msg.nombre}</td>
                        <td className="text-truncate" style={{maxWidth: '150px'}}>{msg.mensaje}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* LISTA DE USUARIOS */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white fw-bold text-info">
              <i className="fas fa-users me-2"></i> Usuarios Registrados
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{maxHeight: '300px', overflowY: 'auto'}}>
                <table className="table table-hover mb-0">
                  <thead className="table-info sticky-top">
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usr, idx) => (
                      <tr key={idx}>
                        <td>{usr.nombre} {usr.apellido}</td>
                        <td>{usr.email}</td>
                        <td>{usr.telefono || "-"}</td>
                      </tr>
                    ))}
                    {usuarios.length === 0 && (
                      <tr><td colSpan={3} className="text-center p-3 text-muted">
                        No se pudo cargar la lista o no hay usuarios. <br/>
                        <small>(Debes ser ADMIN para ver esto)</small>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- MODAL DINÁMICO (CREAR / EDITAR) --- */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className={`modal-header text-white ${editingId ? 'bg-warning' : 'bg-success'}`}>
                <h5 className="modal-title">
                  {editingId ? <><i className="fas fa-edit me-2"></i>Editar Producto</> : <><i className="fas fa-plus me-2"></i>Nuevo Producto</>}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input 
                      type="text" className="form-control" 
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label">Precio</label>
                      <input 
                        type="number" className="form-control" 
                        value={formData.precio}
                        onChange={(e) => setFormData({...formData, precio: e.target.value})}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Stock</label>
                      <input 
                        type="number" className="form-control" 
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Categoría</label>
                    <select 
                      className="form-select"
                      value={formData.categoriaId}
                      onChange={(e) => setFormData({...formData, categoriaId: e.target.value})}
                    >
                      <option value="">Selecciona...</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* INPUT DE IMAGEN CON PREVISUALIZACIÓN */}
                  <div className="mb-3">
                    <label className="form-label">Imagen del Producto</label>
                    <input 
                      type="file" 
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="form-text">Sube una imagen desde tu PC.</div>
                    
                    {/* Previsualización de imagen actual si existe */}
                    {formData.imagenUrl && !selectedFile && (
                        <div className="mt-2">
                            <small className="text-muted d-block">Imagen actual:</small>
                            {/* AQUÍ TAMBIÉN USAMOS EL HELPER PARA VER LA FOTO EN EL MODAL */}
                            <img src={getImageUrl(formData.imagenUrl)} alt="Actual" width="80" className="img-thumbnail" />
                        </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea 
                      className="form-control" rows={3}
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="button" className={`btn ${editingId ? 'btn-warning text-dark' : 'btn-success'}`} onClick={handleGuardar}>
                  {editingId ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;