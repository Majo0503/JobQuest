import React from "react";
import JobQuestBlanco from "../assets/img/JobQuestBlanco.png";

function GuiaUso() {
  const pasos = [
    {
      titulo: "1. Crea tu cuenta",
      descripcion:
        "Regístrate con tus datos personales para acceder a todas las funcionalidades y guardar tu progreso.",
    },
    {
      titulo: "3. Simula entrevistas",
      descripcion:
        "Accede a preguntas reales organizadas por edad y profesión. Responde y practica en tiempo real.",
    },
    {
      titulo: "4. Analiza tu desempeño",
      descripcion:
        "Obtén retroalimentación automática, revisa estadísticas y mejora tus respuestas.",
    },
    {
      titulo: "5. Guarda y recupera tu historial",
      descripcion:
        "Toda tu actividad se guarda de forma segura para que accedas desde cualquier dispositivo.",
    },
  ];

  return (
    <div style={{ backgroundColor: "#fff", padding: "50px 0", textAlign: "center" }}>
      <div className="container" style={{ maxWidth: "960px", margin: "0 auto" }}>
        <small style={etiquetaEstilo}>JobQuest</small>
        <h1
          className="garamond-bold mt-3"
          style={{ color: "#18323f", fontSize: "40px", marginTop: "15px" }}
        >
          Guía de Uso
        </h1>
        <hr style={{ width: "60px", borderTop: "3px solid #18323f", margin: "10px auto 30px" }} />
        <p style={{ maxWidth: "680px", margin: "0 auto 40px", fontSize: "18px", color: "#18323f" }}>
          Sigue estos pasos para comenzar tu preparación con JobQuest de forma sencilla y efectiva.
        </p>

        <div className="row" style={{ justifyContent: "center" }}>
          {pasos.map((paso, index) => (
            <div className="col-md-6 col-lg-4 mb-4" key={index}>
              <div style={cajaPasoEstilo} className="shadow-sm paso-card">
                <div className="mb-3">
                  <div style={iconoContenedor}>
                    <img
                      src={JobQuestBlanco}
                      alt="JobQuest Logo"
                      style={{
                        maxWidth: "40px",
                        maxHeight: "40px",
                        objectFit: "contain",
                        margin: "auto",
                      }}
                    />
                  </div>
                </div>
                <h4 className="garamond-bold mb-2" style={{ color: "#fddd92", fontSize: "20px" }}>
                  {paso.titulo}
                </h4>
                <p style={{ color: "#eee", fontSize: "16px" }}>{paso.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Botón*/}
        {/*
        <div className="text-center mt-5">
          <a href="/login" className="btn btn-jobquest btn-lg" style={botonEstilo}>Comienza Ahora</a>
        </div>
        */}
      </div>
    </div>
  );
}

const etiquetaEstilo = {
  backgroundColor: "#fddd92",
  color: "#18323f",
  padding: "6px 14px",
  fontWeight: "bold",
  textTransform: "uppercase",
  borderRadius: "20px",
  fontSize: "14px",
  letterSpacing: "1px",
};

const cajaPasoEstilo = {
  backgroundColor: "#18323f",
  borderRadius: "18px",
  padding: "35px 25px",
  textAlign: "center",
  height: "100%",
  transition: "all 0.3s ease-in-out",
  border: "1px solid #2c5b6c",
};

const iconoContenedor = {
  backgroundColor: "#18323f",
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  margin: "0 auto 15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid #fddd92",
};

const botonEstilo = {
  backgroundColor: "#fddd92",
  color: "#18323f",
  padding: "12px 30px",
  borderRadius: "25px",
  fontWeight: "bold",
  fontSize: "16px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

export default GuiaUso;
