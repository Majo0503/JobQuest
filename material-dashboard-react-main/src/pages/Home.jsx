import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import usePageEffects from "../hook/usePageEffects";
import logoAbout from "../assets/img/JobQuestBlanco.png";
import logoAbout1 from "../assets/img/JobQuest.png";

function Home() {
  usePageEffects();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetch(`${process.env.REACT_APP_API_URL}/api/accesos/home`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_id: user?._id || null,
      }),
    }).catch((err) => console.error("Error registrando acceso al home:", err));
  }, []);

  const miembros = [
    { nombre: "Luis Santiago Orizabal Ortiz", img: logoAbout1 },
    { nombre: "William Joel Quintanilla Suárez", img: logoAbout1 },
    { nombre: "Cristian Roel Soto Rosil", img: logoAbout1 },
    { nombre: "Melany Alejandra Trujillo Sian", img: logoAbout1 },
    { nombre: "Maria Jose Vasquez Estrada", img: logoAbout1 },
    { nombre: "Dereck Stanley Zarceño Fuentes", img: logoAbout1 },
  ];

  const mensajes = [
    {
      titulo: "Sistema de Entrevistas",
      mensaje: "Prepárate, presenta y triunfa",
      boton: "Realiza tu Entrevista",
      link: "/entrevista",
    },
    {
      titulo: "Sistema de Entrevistas",
      mensaje: "Más Que Preguntas, Conexiones",
      boton: "Realiza tu Entrevista",
      link: "/entrevista",
    },
    {
      titulo: "Sistema de Entrevistas",
      mensaje: "Descubre. Pregunta. Conecta.",
      boton: "Realiza tu Entrevista",
      link: "/entrevista",
    },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [mensajeIndex, setMensajeIndex] = useState(0);

  useEffect(() => {
    const intervaloMiembros = setInterval(() => {
      setStartIndex((prev) => (prev + 1 >= miembros.length ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(intervaloMiembros);
  }, [miembros.length]);

  useEffect(() => {
    const intervaloMensajes = setInterval(() => {
      setMensajeIndex((prev) => (prev + 1) % mensajes.length);
    }, 5000);
    return () => clearInterval(intervaloMensajes);
  }, []);

  const visibleMiembros =
    startIndex + 3 <= miembros.length
      ? miembros.slice(startIndex, startIndex + 3)
      : [...miembros.slice(startIndex), ...miembros.slice(0, 3 - (miembros.length - startIndex))];

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? miembros.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1 >= miembros.length ? 0 : prev + 1));
  };

  // Opcional: modo oscuro automático
  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (darkMode) {
      document.body.style.backgroundColor = "#121212";
      document.body.style.color = "#ffffff";
    }
  }, []);

  return (
    <>
      <style>{`
          .garamond-text, p, li, span, a, small {
            font-family: 'EB Garamond', serif;
            font-weight: 400;
            color: #18323f;
          }
          h1, h2, h3, h4, h5, h6, .garamond-bold {
            font-family: 'EB Garamond', serif;
            font-weight: 700;
            color: #18323f;
          }
          .lead {
            color: #18323f !important;
          }
          .btn-jobquest {
            font-family: 'EB Garamond', serif;
            font-weight: 700;
            background-color: #fddd92;
            color: #18323f !important;
            padding: 12px 24px;
            border-radius: 5px;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            cursor: pointer;
          }
          .btn-jobquest:hover {
            background-color: #f1a523;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
            color: #18323f !important;
          }
          .fade-in {
            opacity: 0;
            animation: fadeIn 1.2s forwards;
          }
          .fade-in.delay-1s {
            animation-delay: 1s;
          }
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
          .carousel-msg {
            transition: opacity 0.5s ease-in-out;
          }
        `}</style>

      {/* Hero Section */}
      <section
        className="text-center d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "#ffffff",
          minHeight: "60vh",
          padding: "2rem",
        }}
      >
        <div className="container">
          <h1 className="display-3 font-weight-bold garamond-bold fade-in">
            Bienvenido a JobQuest
          </h1>
          <p className="lead fade-in delay-1s">
            Tu plataforma para prepararte para entrevistas de trabajo
          </p>
        </div>
      </section>

      {/* About Section */}
      <section
        className="py-5 garamond-text"
        style={{ backgroundColor: "#18323f", color: "#ffffff" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center mb-4 mb-md-0">
              <img src={logoAbout} alt="Logo JobQuest" style={{ width: "250px", height: "auto" }} />
            </div>
            <div className="col-md-6">
              <h2 className="mb-3 garamond-bold" style={{ color: "#ffffff" }}>
                JobQuest
              </h2>
              <p style={{ color: "#ffffff" }}>
                Somos un sistema de reclutamiento dedicado al registro y gestión de entrevistas.
              </p>
              <Link to="/conocenos" className="btn btn-jobquest">
                Conócenos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simulador Section */}
      <section className="py-5 garamond-text" style={{ backgroundColor: "#fff", color: "#18323f" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4">
              <h2 className="mb-3 garamond-bold">Entrena para tu próxima oportunidad</h2>
              <p>
                Con nuestro simulador de entrevistas, conviertes la práctica en resultados reales.
              </p>
              <ul className="list-unstyled">
                <li className="mb-2">✔ Prepárate como un profesional.</li>
                <li className="mb-2">✔ Convierte la práctica en resultados.</li>
              </ul>
              <Link to="/entrevista" className="btn btn-jobquest">
                Realiza tu entrevista
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="row justify-content-center">
                <div className="col-sm-6 mb-3">
                  <div className="bg-white text-center text-dark rounded p-4 shadow-sm">
                    <i className="fas fa-code fa-2x text-primary mb-2"></i>
                    <h2 className="display-4 garamond-bold">2</h2>
                    <p className="font-weight-bold mb-0 garamond-text">Meses de Desarrollo</p>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="bg-white text-center text-dark rounded p-4 shadow-sm">
                    <i className="fas fa-users fa-2x text-primary mb-2"></i>
                    <h2 className="display-4 garamond-bold">0</h2>
                    <p className="font-weight-bold mb-0 garamond-text">Usuarios Registrados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel Miembros */}
      <section
        className="garamond-text"
        style={{ backgroundColor: "#18323f", padding: "60px 20px" }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "40px" }}>
            <small style={etiquetaEstilo}>Conoce al Equipo</small>
            <h2 style={{ color: "white", marginTop: "10px" }} className="garamond-bold">
              Los estudiantes detrás de esta idea.
            </h2>
            <p style={{ color: "#ccc", fontSize: "18px", maxWidth: "600px" }}>
              Proyecto creado por estudiantes del Instituto Emiliani Somascos como parte de ExpoTec
              XXVIII.
            </p>
            <Link to="/conocenos" className="btn btn-jobquest">
              Conócenos
            </Link>
          </div>

          <div style={{ position: "relative" }}>
            <button onClick={handlePrev} style={flechaEstilo("left")} aria-label="Anterior">
              ❮
            </button>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              {visibleMiembros.map((miembro, index) => (
                <article
                  key={index}
                  style={{ ...tarjetaMiembroEstilo, width: "300px" }}
                  aria-label={`Miembro del equipo: ${miembro.nombre}`}
                >
                  <img src={miembro.img} alt={miembro.nombre} style={imagenMiembroEstilo} />
                  <div style={{ padding: "10px" }}>
                    <h5 className="garamond-bold" style={{ color: "white", margin: "10px 0 5px" }}>
                      {miembro.nombre}
                    </h5>
                    <span style={{ color: "#fddd92" }}>Estudiante, IES</span>
                  </div>
                </article>
              ))}
            </div>
            <button onClick={handleNext} style={flechaEstilo("right")} aria-label="Siguiente">
              ❯
            </button>
          </div>
        </div>
      </section>

      {/* Carrusel de Mensajes */}
      <section
        className="garamond-text"
        style={{ backgroundColor: "#ffffff", padding: "80px 20px", textAlign: "center" }}
      >
        <h5 style={{ fontSize: "22px", color: "#f1a523" }}>{mensajes[mensajeIndex].titulo}</h5>
        <h1
          className="garamond-bold carousel-msg"
          style={{ fontSize: "48px", marginBottom: "30px", color: "#18323f" }}
          key={mensajeIndex} // para que React re-renderice y active la transición
        >
          {mensajes[mensajeIndex].mensaje}
        </h1>
        <Link to={mensajes[mensajeIndex].link} className="btn btn-jobquest">
          {mensajes[mensajeIndex].boton}
        </Link>
      </section>
    </>
  );
}

const etiquetaEstilo = {
  backgroundColor: "#fddd92",
  color: "#18323f",
  padding: "5px 10px",
  textTransform: "uppercase",
  fontWeight: "bold",
  borderRadius: "3px",
  display: "inline-block",
  marginBottom: "10px",
};

const tarjetaMiembroEstilo = {
  backgroundColor: "#18323f",
  borderRadius: "10px",
  overflow: "hidden",
  textAlign: "center",
  paddingBottom: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
};

const imagenMiembroEstilo = {
  width: "100%",
  height: "200px",
  objectFit: "contain",
  backgroundColor: "#fff",
};

const flechaEstilo = (lado) => ({
  position: "absolute",
  top: "40%",
  [lado]: "-40px",
  background: "#fddd92",
  color: "#18323f",
  border: "none",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  fontSize: "20px",
  cursor: "pointer",
  zIndex: 10,
  transition: "all 0.3s",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
});

export default Home;
