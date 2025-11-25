import { useEffect, useState } from "react";
import axios from "axios";

// Interfaces para Pedidos y Productos (se mantienen igual)
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
  stock: number;
}

// --- INTERFAZ CORREGIDA PARA TU MS_CONTACTO ---
// Debe coincidir con tu archivo Contacto.java
interface ContactoMensaje {
  id: number;
  nombre: string;
  email: string;
  mensaje: string;       // En tu Java se llama 'mensaje', no 'texto'
  fechaEnvio: string;    // En tu Java se llama 'fechaEnvio'
}

const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

const AdminPanel = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mensajes, setMensajes] = useState<ContactoMensaje[]>([]); // Estado corregido
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Pedidos (Puerto 8084)
        const resPedidos = await axios.get("http://localhost:8084/api/orders/admin/all");
        setPedidos(resPedidos.data);

        // 2. Productos (Puerto 8083)
        const resProductos = await axios.get("http://localhost:8083/api/catalog/productos");
        setProductos(resProductos.data);
        
        // 3. MENSAJES (TU MS_CONTACTO REAL EN PUERTO 8081)
        // Tu controlador tiene @GetMapping en "/api/contactos"
        const resMensajes = await axios.get("http://localhost:8081/api/contactos"); 
        setMensajes(resMensajes.data);

        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos del admin:", error);
        alert("Error al conectar. Revisa que ms_pedidos (8084), ms_productos (8083) y ms_contacto (8081) estén corriendo.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ventasTotales = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);
  const productosBajoStock = productos.filter(p => p.stock < 10);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary fw-bold">Panel de Control</h1>
        <span className="badge bg-dark p-2">Administrador</span>
      </div>

      {/* TARJETAS RESUMEN */}
      <div className="row mb-5">
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3 shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Ventas Totales</h5>
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
              <p className="card-text fs-4 fw-bold">{mensajes.length} nuevos</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3 shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Stock Crítico</h5>
              <p className="card-text fs-4 fw-bold">{productosBajoStock.length} prod.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* TABLA PEDIDOS */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white fw-bold">
              <i className="fas fa-shopping-bag me-2"></i> Últimos Pedidos
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.slice(0, 5).map((pedido) => (
                    <tr key={pedido.id}>
                      <td>#{pedido.id}</td>
                      <td>{pedido.usuarioEmail}</td>
                      <td>{CLP.format(pedido.total)}</td>
                      <td><span className="badge bg-success">{pedido.estado}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ALERTA STOCK */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white fw-bold text-danger">
              <i className="fas fa-exclamation-triangle me-2"></i> Alerta de Stock
            </div>
            <ul className="list-group list-group-flush">
              {productosBajoStock.slice(0, 5).map(prod => (
                <li key={prod.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <small>{prod.nombre}</small>
                  <span className="badge bg-danger rounded-pill">{prod.stock}</span>
                </li>
              ))}
              {productosBajoStock.length === 0 && <li className="list-group-item text-success">Inventario OK.</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* SECCIÓN: MENSAJES DE CONTACTO (Conectado a puerto 8081) */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold text-primary">
              <i className="fas fa-envelope me-2"></i> Mensajes de Clientes
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
                    {mensajes.map((msg) => (
                      <tr key={msg.id}>
                        <td style={{width: '15%'}}>
                            {/* Usamos fechaEnvio que es como se llama en tu Java */}
                            {new Date(msg.fechaEnvio).toLocaleDateString()}
                        </td>
                        <td style={{width: '20%'}} className="fw-bold">{msg.nombre}</td>
                        <td style={{width: '20%'}}>{msg.email}</td>
                        <td>{msg.mensaje}</td>
                      </tr>
                    ))}
                    {mensajes.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-4">No hay mensajes de contacto aún.</td>
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

export default AdminPanel;