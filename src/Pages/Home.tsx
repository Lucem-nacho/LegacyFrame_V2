import React from "react";

const Home: React.FC = () => { // Declara un componente funcional llamado Home, significa React Functional Component, y le dice a TypeScript que Home es un componente de React.
  return (
    <div className="main-content">
      <h1 className="text-white fw-bold display-5">
        Bienvenidos a AdoptaPet 🐾
      </h1>
      <p className="lead text-white">
        Conoce, adopta y da amor a tu nuevo mejor amigo.
      </p>
    </div>
  );
};

export default Home;