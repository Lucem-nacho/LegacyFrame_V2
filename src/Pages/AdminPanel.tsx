const AdminPanel = () => {
  return (
    <div className="container py-5">
      <h1 className="text-primary">Panel de Administración</h1>
      <p className="lead">Bienvenido, Administrador. Aquí gestionarás los pedidos y productos.</p>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h3>Pedidos</h3>
            <p>Revisar y actualizar estado de envíos.</p>
            <button className="btn btn-outline-primary">Ver Pedidos</button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h3>Productos</h3>
            <p>Agregar o quitar cuadros del catálogo.</p>
            <button className="btn btn-outline-success">Gestionar Catálogo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;