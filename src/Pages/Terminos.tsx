const Terminos = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="mb-3 section-title">Términos y Condiciones</h1>
          
          <div className="text-center mb-3">
            {/* CORRECCIÓN: Usamos la ruta directa a public/assets */}
            <img 
              src="/assets/like_gato.jpg" 
              alt="Términos y Condiciones" 
              className="img-fluid rounded" 
              style={{ maxWidth: '100%', height: 'auto' }}
              // Fallback por si la imagen no carga
              onError={(e) => { e.currentTarget.style.display = 'none'; }} 
            />
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h3>Políticas de Uso</h3>
              <p>
                Bienvenido a Legacy Frames. Al utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones...
              </p>
              <hr />
              <h5>1. Sobre los Productos</h5>
              <p>
                Todos nuestros marcos son fabricados artesanalmente. Las medidas pueden variar ligeramente en milímetros debido al trabajo manual.
              </p>
              <h5>2. Envíos y Devoluciones</h5>
              <p>
                Realizamos envíos a todo Chile. Si el producto llega dañado, contáctanos dentro de las primeras 24 horas para gestionar el cambio.
              </p>
              <h5>3. Privacidad</h5>
              <p>
                Tus datos personales son utilizados únicamente para procesar tu pedido y mejorar tu experiencia en el sitio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminos;