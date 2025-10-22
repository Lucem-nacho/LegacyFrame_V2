import likeGato from '../assets/like_gato.jpg';

const Terminos = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="mb-3 section-title">Términos y Condiciones</h1>
          <div className="text-center mb-3">
            <img src={likeGato} alt="Términos y Condiciones" className="img-fluid rounded" />
          </div>
          <div className="card shadow-sm">
            <div className="card-body">
              <h1> Estos son los Terminos y  condiciones gracias</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminos;
