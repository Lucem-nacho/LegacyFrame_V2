import React from 'react';
import { Link } from 'react-router-dom';

const Terminos = () => {
  return (
    <div className="container my-5">
      {/* Encabezado */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 text-center">
          <h1 className="display-4 fw-bold text-primary mb-3">Términos y Condiciones</h1>
          <p className="lead text-muted">
            Información legal, políticas de uso y garantías de Legacy Frames.
            <br />
            <small>Última actualización: Noviembre 2025</small>
          </p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              
              {/* SECCIÓN 1 */}
              <section className="mb-5">
                <h4 className="fw-bold text-dark border-bottom pb-2 mb-3">1. Aspectos Generales</h4>
                <p className="text-secondary">
                  Bienvenido a <strong>Legacy Frames</strong>. Al acceder y utilizar nuestro sitio web para la compra de molduras y cuadros, aceptas los términos y condiciones descritos a continuación. Nos reservamos el derecho de modificar estas políticas en cualquier momento sin previo aviso.
                </p>
              </section>

              {/* SECCIÓN 2 */}
              <section className="mb-5">
                <h4 className="fw-bold text-dark border-bottom pb-2 mb-3">2. Sobre los Productos y Fabricación</h4>
                <p className="text-secondary">
                  Nuestros productos son fabricados mayoritariamente de manera artesanal o semi-industrial. Por lo tanto:
                </p>
                <ul className="text-secondary">
                  <li><strong>Materiales:</strong> La madera es un material natural; las vetas, nudos y tonos pueden variar ligeramente respecto a la foto referencial.</li>
                  <li><strong>Colores:</strong> Los colores de las molduras pueden visualizarse de manera diferente dependiendo de la calibración de su pantalla.</li>
                  <li><strong>Medidas:</strong> Las medidas indicadas corresponden al tamaño interno del marco (tamaño de la imagen). Puede existir una tolerancia de +/- 2mm debido al corte manual.</li>
                </ul>
              </section>

              {/* SECCIÓN 3 */}
              <section className="mb-5">
                <h4 className="fw-bold text-dark border-bottom pb-2 mb-3">3. Precios y Stock</h4>
                <p className="text-secondary">
                  Todos los precios están expresados en pesos chilenos (CLP) e incluyen IVA. 
                  El stock mostrado en la web está sincronizado con nuestro inventario real. Sin embargo, en caso de un quiebre de stock simultáneo a una compra, nos pondremos en contacto para ofrecer un cambio de producto o la devolución total del dinero.
                </p>
              </section>

              {/* SECCIÓN 4 */}
              <section className="mb-5">
                <h4 className="fw-bold text-dark border-bottom pb-2 mb-3">4. Envíos y Despachos</h4>
                <p className="text-secondary">
                  Realizamos envíos a todo Chile a través de servicios de courier externos.
                </p>
                <ul className="text-secondary">
                  <li>Los tiempos de entrega son estimados y dependen de la empresa de transporte.</li>
                  <li>Es responsabilidad del cliente ingresar una dirección válida y asegurarse de que haya alguien para recibir el paquete.</li>
                  <li>Si el producto llega dañado por el transporte, debe notificarse dentro de las <strong>24 horas</strong> siguientes a la recepción con fotografías del embalaje y el producto.</li>
                </ul>
              </section>

              {/* SECCIÓN 5 */}
              <section className="mb-5">
                <h4 className="fw-bold text-dark border-bottom pb-2 mb-3">5. Garantía Legal y Devoluciones</h4>
                <p className="text-secondary">
                  Conforme a la Ley del Consumidor en Chile:
                </p>
                <ul className="text-secondary">
                  <li><strong>Garantía Legal (6 meses):</strong> Si el producto presenta fallas de fabricación (despegado, madera quebrada, vidrio roto al recibir), tienes derecho a la reparación gratuita, cambio del producto o devolución del dinero.</li>
                  <li><strong>Derecho a Retracto:</strong> No ofrecemos derecho a retracto por satisfacción si el producto fue fabricado a medida o bajo pedido especial, salvo que se trate de productos de stock estándar devueltos en perfecto estado y en su embalaje original dentro de los primeros 10 días.</li>
                </ul>
              </section>

              {/* SECCIÓN 6 */}
              <section className="mb-4">
                <h4 className="fw-bold text-dark border-bottom pb-2 mb-3">6. Privacidad de Datos</h4>
                <p className="text-secondary">
                  Tus datos personales (nombre, correo, dirección) son confidenciales y se utilizan únicamente para procesar tu pedido y el envío. No compartimos información con terceros salvo con la empresa de transporte para efectos de entrega.
                </p>
              </section>

              {/* CAJA DE CONTACTO */}
              <div className="alert alert-light border mt-5 text-center">
                <h5 className="fw-bold text-primary">¿Tienes más dudas?</h5>
                <p className="mb-3">Estamos disponibles para ayudarte con cualquier consulta legal o comercial.</p>
                <Link to="/contacto" className="btn btn-outline-primary rounded-pill px-4">
                  Ir a Contacto
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminos;