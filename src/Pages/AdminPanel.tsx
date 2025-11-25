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

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

const AdminPanel = () => {
  // Datos del Dashboard
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]); 
  
  const [loading, setLoading] = useState(true);

  // Estados para el Formulario (Crear/Editar)
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null); // NULL = Creando, NÚMERO = Editando

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
      
      setLoading(false);
    } catch (error) {
      console.error("Error cargando admin:", error);
      setLoading(false);
    }
  };

  // --- ABRIR MODAL PARA CREAR ---
  const abrirModalCrear = () => {
    setEditingId(null); // Modo Crear
    setFormData({ nombre: "", descripcion: "", precio: "", stock: "", imagenUrl: "", categoriaId: "" });
    setShowModal(true);
  };

  // --- ABRIR MODAL PARA EDITAR ---
  const abrirModalEditar = (producto: Producto) => {
    setEditingId(producto.id); // Modo Editar (Guardamos el ID)
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

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock) || 0,
      // Si no hay imagen, ponemos el placeholder gris
      imagenUrl: formData.imagenUrl || "https://via.placeholder.com/300x300/cccccc/000000?text=Sin+Imagen",
      categoria: {
          id: parseInt(formData.categoriaId)
      }
    };

    try {
      if (editingId) {
        // --- MODO EDITAR (PUT) ---
        await axios.put(`http://localhost:8083/api/catalog/productos/${editingId}`, payload);
        alert("¡Producto actualizado correctamente!");
      } else {
        // --- MODO CREAR (POST) ---
        await axios.post("http://localhost:8083/api/catalog/productos", payload);
        alert("¡Producto creado con éxito!");
      }

      setShowModal(false);
      cargarDatos(); // Recargar la lista
      
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
          <div className="card text-white bg-primary mb-3 shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Mensajes</h5>
              <p className="card-text fs-4 fw-bold">{mensajes.length}</p>
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
        {/* TABLA DE PRODUCTOS (CORREGIDA PARA EVITAR TEMBLOR) */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
              <span><i className="fas fa-box-open me-2"></i> Inventario de Productos</span>
              <span className="badge bg-primary">{productos.length} Total</span>
            </div>
            {/* FIX 1: overflowY: "auto" para estabilizar el scroll */}
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
                        {/* FIX 2: Clase d-block para que la imagen no cree espacio extra */}
                        <img 
                          src={prod.imagenUrl} 
                          alt={prod.nombre} 
                          width="40" 
                          height="40" 
                          className="rounded object-fit-cover d-block" 
                          onError={(e) => e.currentTarget.src = "https://via.placeholder.com/40"}
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
                          className="btn btn-sm btn-warning text-dark fw-bold"
                          onClick={() => abrirModalEditar(prod)}
                        >
                          <i className="fas fa-edit"></i> Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ALERTA DE STOCK (Lateral) */}
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

      {/* SECCIÓN MENSAJES */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm">
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
                      <th>Email</th>
                      <th>Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mensajes.slice(0, 5).map((msg) => (
                      <tr key={msg.id}>
                        <td>{new Date(msg.fechaEnvio).toLocaleDateString()}</td>
                        <td className="fw-bold">{msg.nombre}</td>
                        <td>{msg.email}</td>
                        <td>{msg.mensaje}</td>
                      </tr>
                    ))}
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

                  <div className="mb-3">
                    <label className="form-label">URL Imagen</label>
                    <input 
                      type="text" className="form-control"
                      value={formData.imagenUrl}
                      onChange={(e) => setFormData({...formData, imagenUrl: e.target.value})}
                    />
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