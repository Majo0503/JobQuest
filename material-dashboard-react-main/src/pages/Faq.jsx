import React, { useState } from "react";

function PreguntasFrecuentes() {
  const [activo, setActivo] = useState(null);

  const preguntas = [
    {
      pregunta: "¿Qué es JobQuest?",
      respuesta:
        "JobQuest es una plataforma interactiva diseñada para ayudarte a prepararte para entrevistas laborales a través de simulaciones, análisis y orientación.",
    },
    {
      pregunta: "¿Cómo funciona el simulador de entrevistas?",
      respuesta:
        "El simulador te presenta preguntas reales organizadas por rangos de edad y áreas laborales. Puedes practicar en tiempo real y obtener retroalimentación.",
    },
    {
      pregunta: "¿Necesito crear una cuenta?",
      respuesta:
        "Sí, para guardar tu progreso, acceder a tu historial y obtener análisis personalizados, necesitas registrarte en nuestra plataforma.",
    },
    {
      pregunta: "¿Qué pasa si pierdo mi cuenta?",
      respuesta:
        "Contamos con opciones de recuperación y respaldo automático para que no pierdas tus entrevistas ni tu progreso.",
    },
    {
      pregunta: "¿Mis datos están seguros?",
      respuesta:
        "Sí, toda tu información se almacena de forma cifrada y sólo tú tienes acceso a ella.",
    },
  ];

  const togglePregunta = (index) => {
    setActivo(activo === index ? null : index);
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        color: "#18323f",
        padding: "60px 20px",
        fontFamily: "'EB Garamond', serif",
      }}
    >
      <div className="container" style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header con bloque amarillo */}
        <div className="text-center mb-5">
          <div style={jobQuestCuadro}>JobQuest</div>
          <h2
            style={{ marginTop: "20px", fontWeight: "500", fontSize: "2.25rem", color: "#18323f" }}
          >
            Preguntas Frecuentes
          </h2>
          <p
            style={{ maxWidth: "600px", margin: "15px auto 0", fontSize: "18px", color: "#3a5068" }}
          >
            Aquí encontrarás respuestas a las preguntas más comunes sobre el funcionamiento de
            nuestra plataforma.
          </p>
        </div>

        {/* FAQ Items */}
        <div>
          {preguntas.map((item, index) => {
            const estaActivo = activo === index;
            return (
              <div
                key={index}
                onClick={() => togglePregunta(index)}
                style={{
                  backgroundColor: estaActivo ? "#18323f" : "#bdbaba",
                  color: estaActivo ? "white" : "#18323f",
                  cursor: "pointer",
                  borderRadius: "14px",
                  padding: "20px 25px",
                  marginBottom: "18px",
                  boxShadow: estaActivo
                    ? "0 6px 15px rgba(24, 50, 63, 0.3)"
                    : "0 2px 8px rgba(24, 50, 63, 0.1)",
                  transition: "background-color 0.4s ease, box-shadow 0.4s ease, color 0.4s ease",
                  userSelect: "none",
                }}
                aria-expanded={estaActivo}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") togglePregunta(index);
                }}
              >
                <h5 style={{ marginBottom: estaActivo ? "12px" : "0", fontWeight: "700" }}>
                  {item.pregunta}
                </h5>
                <div
                  style={{
                    maxHeight: estaActivo ? "500px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.5s ease",
                    fontSize: "16px",
                    lineHeight: "1.6",
                    color: estaActivo ? "rgba(255,255,255,0.9)" : "transparent",
                  }}
                >
                  <p style={{ margin: 0 }}>{item.respuesta}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const jobQuestCuadro = {
  display: "inline-block",
  backgroundColor: "#fddd92",
  color: "#18323f",
  padding: "10px 35px",
  borderRadius: "25px",
  fontSize: "20px",
  fontWeight: "400",
  userSelect: "none",
  fontFamily: "'EB Garamond', serif",
};

export default PreguntasFrecuentes;
