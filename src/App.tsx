import { Routes, Route, Link } from "react-router-dom";
import Home from "./Pages/Home";
import Contacto from "./Pages/Contacto";

function App() {
  return (
    <div className="app-container">
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top w-100 shadow">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            AdoptaPet
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/"> Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/nosotros">
                  Nosotros
                </Link>                
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contacto">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </div>

      {/* FOOTER */}
      <footer className="footer text-center py-3 bg-primary text-white">
        © 2025 AdoptaPet - Todos los derechos reservados
      </footer>
    </div>
  );
}

export default App;