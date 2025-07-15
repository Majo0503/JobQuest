import React, { useState, useEffect } from "react";
import equipoImg from "../assets/img/equipo.png";
import misionImg from "../assets/img/mision1.png";
import visionImg from "../assets/img/vision.png";
import valoresImg from "../assets/img/valores.png";

function Conocenos() {
  const mensajes = [
    "Tu plataforma para prepararte para entrevistas de trabajo",
    "Simulaciones Personalizadas",
    "Avanza en tu carrera con JobQuest",
  ];

  const [mensajeIndex, setMensajeIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setMensajeIndex((prev) => (prev + 1) % mensajes.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <>
      <style>
        {`
          .garamond-text, p, li, span, a, small {
            font-family: 'EB Garamond', serif;
            font-weight: 400;
            
          }
              .titulo-hero {
              color: #f1a523;
          }


          h1, h2, h3, h4, h5, h6, .garamond-bold {
            font-family: 'EB Garamond', serif;
            font-weight: 700;
          }

          .section-title {
            font-size: 2rem;
            margin-bottom: 20px;
            color: #fddd92;
          }

          .section-box {
            background-color: #18323f;
            padding: 25px;
            border-radius: 16px;
            margin-bottom: 50px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            color: white;
            transition: transform 0.2s ease;
          }

          .section-box:hover {
            transform: translateY(-5px);
          }

          .valores-list li {
            margin-bottom: 10px;
          }

          .bg-conocenos {
            background-color: #ffffff;
            color: #18323f;
            padding-top: 60px;
            padding-bottom: 60px;
          }

          .lead {
            font-size: 1.3rem;
          }

          .highlight {
            color: #f1a523;
          }

          .section-content {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
          }

          .section-content.reverse {
            flex-direction: row-reverse;
          }

          .section-img {
            flex: 1 1 300px;
            max-width: 400px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
          }

          .section-img img {
            width: 100%;
            height: auto;
            display: block;
          }

          .section-text {
            flex: 2;
            min-width: 280px;
          }

          @media (max-width: 768px) {
            .section-content {
              flex-direction: column;
            }

            .section-content.reverse {
              flex-direction: column;
            }
          }
        `}
      </style>

      {/* Hero Section */}
      <div
        className="text-center py-5 garamond-text"
        style={{ backgroundColor: "#ffffff", color: "#18323f" }}
      >
        <div className="container">
          <h1 className="display-3 font-weight-bold garamond-bold titulo-hero">
            Conócenos<span className="highlight">.</span>
          </h1>
          <p className="lead">{mensajes[mensajeIndex]}</p>
        </div>
      </div>

      {/* Sección Conócenos */}
      <div className="bg-conocenos garamond-text">
        <div className="container">
          {/* ¿Quiénes Somos? */}
          <div className="section-box">
            <div className="section-content">
              <div className="section-img">
                <img src={equipoImg} alt="Equipo JobQuest" />
              </div>
              <div className="section-text">
                <h2 className="section-title garamond-bold">¿Quiénes Somos?</h2>
                <p>
                  Somos un equipo apasionado por el crecimiento profesional. En JobQuest, combinamos
                  tecnología, pedagogía y diseño para ayudarte a enfrentar entrevistas reales con
                  confianza. Nuestra plataforma fue creada con el objetivo de nivelar el campo de
                  juego para todos.
                </p>
              </div>
            </div>
          </div>

          {/* Misión */}
          <div className="section-box">
            <div className="section-content reverse">
              <div className="section-img">
                <img src={misionImg} alt="Misión JobQuest" />
              </div>
              <div className="section-text">
                <h2 className="section-title garamond-bold">Nuestra Misión</h2>
                <p>
                  Empoderar a las personas con herramientas de simulación y preparación profesional
                  que les permitan enfrentar entrevistas de trabajo con confianza, seguridad y
                  preparación real.
                </p>
              </div>
            </div>
          </div>

          {/* Visión */}
          <div className="section-box">
            <div className="section-content">
              <div className="section-img">
                <img src={visionImg} alt="Visión JobQuest" />
              </div>
              <div className="section-text">
                <h2 className="section-title garamond-bold">Nuestra Visión</h2>
                <p>
                  Ser la plataforma líder en preparación para entrevistas en Latinoamérica,
                  adaptándonos a cada perfil profesional y generacional, impulsando el crecimiento y
                  empleabilidad de nuestros usuarios.
                </p>
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="section-box">
            <div className="section-content reverse">
              <div className="section-img">
                <img src={valoresImg} alt="Valores JobQuest" />
              </div>
              <div className="section-text">
                <h2 className="section-title garamond-bold">Nuestros Valores</h2>
                <ul className="valores-list">
                  <li>
                    <strong>Compromiso:</strong> Nos dedicamos a mejorar la experiencia de cada
                    usuario.
                  </li>
                  <li>
                    <strong>Innovación:</strong> Usamos tecnología para transformar la preparación
                    laboral.
                  </li>
                  <li>
                    <strong>Inclusividad:</strong> Creemos en las oportunidades para todos sin
                    importar edad o experiencia.
                  </li>
                  <li>
                    <strong>Confianza:</strong> Creamos un entorno seguro y profesional para el
                    crecimiento personal.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Conocenos;
