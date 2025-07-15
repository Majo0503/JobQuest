import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://jobquest-production.up.railway.app/";

const fases = [
  {
    nombre: "Pre-entrevista",
    preguntas: [
      { tipo: "texto", texto: "Nombre completo" },
      { tipo: "texto", texto: "¿Cuál es tu edad?" },
      { tipo: "radio", texto: "Género", opciones: ["Masculino", "Femenino", "Otro"] },
      { tipo: "texto", texto: "¿Cuál es tu lugar de residencia actual?" },
      {
        tipo: "radio",
        texto: "¿Cuál es tu estado civil?",
        opciones: ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a"],
      },
      { tipo: "texto", texto: "¿Tienes hijos? ¿Cuántos y qué edades tienen?" },
      { tipo: "texto", texto: "¿Cuántas personas viven en tu hogar actualmente?" },
      { tipo: "texto", texto: "¿Qué te motiva o te inspira para seguir adelante?" },
      { tipo: "texto", texto: "¿Hablas algún otro idioma? ¿Cómo lo manejas?" },
      { tipo: "texto", texto: "¿Tienes licencia de conducir? ¿Qué tipo?" },
    ],
  },
  {
    nombre: "Entrevista Psicológica",
    preguntas: [
      { tipo: "texto", texto: "¿Algún error importante que hayas cometido?" },
      { tipo: "texto", texto: "¿Cómo gestionas el estrés o la presión?" },
      { tipo: "texto", texto: "Describe un desafío significativo que hayas enfrentado" },
      { tipo: "texto", texto: "¿Cómo mantienes una actitud positiva ante percances?" },
      { tipo: "texto", texto: "¿Cómo reaccionas ante los fracasos?" },
      { tipo: "texto", texto: "¿Qué tipo de ambiente te hace sentir más productivo?" },
      { tipo: "texto", texto: "¿Cómo resuelves problemas complejos?" },
      { tipo: "texto", texto: "¿Cómo manejas las críticas injustas?" },
      { tipo: "texto", texto: "¿Qué haces si no estás de acuerdo con tu superior?" },
      { tipo: "texto", texto: "¿Cómo manejas los cambios inesperados en el trabajo?" },
    ],
  },
  {
    nombre: "Experiencia Laboral",
    preguntas: [
      { tipo: "texto", texto: "¿Cuál ha sido tu mayor logro profesional o académico?" },
      { tipo: "texto", texto: "¿Cómo aseguras la calidad de tu trabajo?" },
      { tipo: "texto", texto: "Describe tu experiencia laboral más relevante" },
      { tipo: "texto", texto: "¿Qué habilidades desarrollaste en tu último empleo?" },
      { tipo: "texto", texto: "¿Cómo gestionas interrupciones en la jornada laboral?" },
      { tipo: "texto", texto: "¿Cómo organizas tus prioridades y tareas?" },
      { tipo: "texto", texto: "¿Qué estrategia usas para mantener la concentración?" },
      { tipo: "texto", texto: "¿Tenías buena relación con compañeros y jefes?" },
      { tipo: "texto", texto: "¿Cómo manejas información confidencial?" },
      { tipo: "texto", texto: "¿Manejas bien entregas urgentes de trabajo?" },
      { tipo: "texto", texto: "¿Has capacitado a otras personas?" },
    ],
  },
  {
    nombre: "Puesto y la Empresa",
    preguntas: [
      { tipo: "texto", texto: "¿Qué te atrae de esta oportunidad laboral?" },
      { tipo: "texto", texto: "¿Cómo encajan tus habilidades en este puesto?" },
      { tipo: "texto", texto: "¿Qué valor crees aportar a la empresa?" },
      { tipo: "texto", texto: "¿Cómo priorizas objetivos ante múltiples tareas?" },
      { tipo: "texto", texto: "¿Qué impacto esperas tener el primer año?" },
      { tipo: "texto", texto: "¿Qué es lo más importante en tu próximo empleo?" },
      { tipo: "texto", texto: "¿Qué expectativas tienes de nuestra empresa?" },
      { tipo: "texto", texto: "¿Cómo te adaptarías a este estilo de rol?" },
      { tipo: "texto", texto: "¿Cómo defines un entorno de trabajo ideal?" },
      { tipo: "texto", texto: "¿Cómo manejas la expectativa de tu supervisor?" },
      { tipo: "texto", texto: "¿Qué tomarías en cuenta sobre tu próximo empleo?" },
    ],
  },
  {
    nombre: "Habilidades Técnicas",
    preguntas: [
      { tipo: "texto", texto: "¿Qué herramientas o software dominas?" },
      { tipo: "texto", texto: "¿Qué certificaciones posees?" },
      { tipo: "texto", texto: "¿Cómo te mantienes actualizado en tu área?" },
      {
        tipo: "texto",
        texto: "Describe un proyecto técnico que hayas liderado o en el que participaste",
      },
      { tipo: "texto", texto: "¿Qué tecnologías nuevas te gustaría aprender?" },
    ],
  },
  {
    nombre: "Comunicación y Trabajo en Equipo",
    preguntas: [
      { tipo: "texto", texto: "¿Cómo manejas desacuerdos con colegas?" },
      {
        tipo: "texto",
        texto: "Describe una situación en la que tu comunicación fue clave para el éxito",
      },
      { tipo: "texto", texto: "¿Prefieres trabajar solo o en equipo? ¿Por qué?" },
      { tipo: "texto", texto: "¿Cómo contribuyes a un ambiente laboral positivo?" },
      { tipo: "texto", texto: "¿Has tenido que resolver conflictos? ¿Cómo lo hiciste?" },
    ],
  },
];

const EntrevistaFases = () => {
  const navigate = useNavigate();
  const [faseActual, setFaseActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [errores, setErrores] = useState([]);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const [redirigirLogin, setRedirigirLogin] = useState(false);
  const [nombreEntrevistado, setNombreEntrevistado] = useState("");

  useEffect(() => {
    const entrevistado = localStorage.getItem("entrevistado");
    if (!entrevistado) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      try {
        const usuario = JSON.parse(entrevistado);
        // Usamos nombre y apellido si existen, si no, mostramos email, o "Entrevistado"
        const nombreCompleto =
          usuario.nombre && usuario.apellido
            ? `${usuario.nombre} ${usuario.apellido}`
            : usuario.email || "Entrevistado";

        setNombreEntrevistado(nombreCompleto);
        setVerificandoSesion(false);
      } catch (e) {
        navigate("/login");
      }
    }
    const interval = setInterval(() => {
      const sesionActiva = localStorage.getItem("entrevistado");
      if (!sesionActiva) {
        navigate("/login");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [faseActual]);

  const handleRespuesta = (faseIndex, preguntaIndex, valor) => {
    setRespuestas((prev) => ({ ...prev, [`${faseIndex}-${preguntaIndex}`]: valor }));
  };

  const validarRespuestas = () => {
    const erroresTemp = [];
    fases[faseActual].preguntas.forEach((_, i) => {
      const val = respuestas[`${faseActual}-${i}`];
      if (!val || val.trim() === "") erroresTemp.push(i);
    });
    setErrores(erroresTemp);
    return erroresTemp.length === 0;
  };
  // Función para cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem("entrevistado");
    navigate("/login");
  };

  const enviarAlServidor = async () => {
    const entrevistadoRaw = localStorage.getItem("entrevistado");
    if (!entrevistadoRaw) {
      console.error("No hay entrevistado en localStorage");
      return;
    }

    const entrevistado = JSON.parse(entrevistadoRaw);

    // Asegúrate que las propiedades existen y no son undefined
    const userId = entrevistado._id || entrevistado.id || null;
    const nombre = entrevistado.nombre || "";
    const apellido = entrevistado.apellido || "";
    const userName = `${nombre} ${apellido}`.trim();

    if (!userId) {
      console.error("No se encontró userId en entrevistado:", entrevistado);
      return;
    }

    const datos = {
      userId,
      userName,
      fase: `Fase ${faseActual + 1}`,
      titulo: fases[faseActual].nombre,
      respuestas: fases[faseActual].preguntas.map((pregunta, i) => ({
        pregunta: pregunta.texto,
        respuesta: respuestas[`${faseActual}-${i}`] || "",
      })),
      fecha: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API_URL}/api/entrevista/fase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error backend:", errorData);
      } else {
        console.log("Fase enviada correctamente");
      }
    } catch (error) {
      console.error("Error al enviar al backend:", error);
    }
  };

  const avanzar = async () => {
    if (!validarRespuestas()) return;
    await enviarAlServidor();
    if (faseActual + 1 >= fases.length) {
      setMostrarResumen(true);
    } else {
      setFaseActual(faseActual + 1);
      setErrores([]);
    }
  };

  const retroceder = () => {
    if (faseActual === 0) return;
    setFaseActual(faseActual - 1);
    setErrores([]);
  };

  if (verificandoSesion) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.5rem",
          fontFamily: "'EB Garamond', serif",
          color: "#18323f",
          backgroundColor: "#fff",
        }}
      >
        Por favor, inicia sesión para realizar la entrevista...
      </div>
    );
  }

  if (mostrarResumen) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          minHeight: "100vh",
          padding: "60px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "'EB Garamond', serif",
          color: "#18323f",
        }}
      >
        <h2>Gracias por completar la entrevista</h2>
        <p
          style={{ fontSize: "1.2rem", maxWidth: "500px", textAlign: "center", marginTop: "10px" }}
        >
          Tu información ha sido registrada. Pronto te contactaremos.
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "30px",
            padding: "12px 25px",
            backgroundColor: "#f1a523",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1rem",
            color: "#18323f",
          }}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const fase = fases[faseActual];

  return (
    <div
      style={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        padding: "40px 15px",
        fontFamily: "'EB Garamond', serif",
        color: "#18323f",
      }}
    >
      <div style={{ maxWidth: "850px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "15px", color: "#444" }}>
          Bienvenido(a), <strong>{nombreEntrevistado}</strong>
        </h2>
        <h1 style={{ marginBottom: "25px", fontWeight: "700", color: "#18323f" }}>
          Fase {faseActual + 1}: {fase.nombre}
        </h1>

        {fase.preguntas.map((pregunta, i) => {
          const key = `${faseActual}-${i}`;
          const valor = respuestas[key] || "";

          return (
            <div
              key={i}
              style={{
                backgroundColor: "#18323f",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "22px",
                color: "#bdbaba",
                boxShadow: errores.includes(i) ? "0 0 8px #f1a523" : "none",
              }}
            >
              <p style={{ fontWeight: "600", marginBottom: "10px", color: "#fff" }}>
                Pregunta {i + 1} de {fase.preguntas.length}
              </p>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontSize: "1.1rem",
                  color: "#bdbaba",
                }}
              >
                {pregunta.texto}
              </label>

              {pregunta.tipo === "texto" && (
                <input
                  type="text"
                  value={valor}
                  onChange={(e) => handleRespuesta(faseActual, i, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "6px",
                    border: `1.5px solid ${errores.includes(i) ? "#f1a523" : "#ccc"}`,
                    fontSize: "1rem",
                    color: "#18323f",
                    outline: "none",
                  }}
                  placeholder="Escribe tu respuesta aquí..."
                />
              )}

              {pregunta.tipo === "radio" && pregunta.opciones && (
                <div style={{ marginTop: "6px" }}>
                  {pregunta.opciones.map((op, idx) => (
                    <label
                      key={idx}
                      style={{ display: "block", marginBottom: "8px", color: "#fff" }}
                    >
                      <input
                        type="radio"
                        name={key}
                        value={op}
                        checked={valor === op}
                        onChange={() => handleRespuesta(faseActual, i, op)}
                        style={{ marginRight: "10px" }}
                      />
                      {op}
                    </label>
                  ))}
                </div>
              )}

              {errores.includes(i) && (
                <div style={{ color: "#f1a523", marginTop: "6px", fontWeight: "600" }}>
                  Esta pregunta es obligatoria
                </div>
              )}
            </div>
          );
        })}

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "35px" }}>
          <button
            onClick={retroceder}
            disabled={faseActual === 0}
            style={{
              padding: "12px 30px",
              backgroundColor: faseActual === 0 ? "#ccc" : "#f1a523",
              border: "none",
              borderRadius: "8px",
              cursor: faseActual === 0 ? "not-allowed" : "pointer",
              fontWeight: "700",
              fontSize: "1rem",
              color: "#18323f",
            }}
          >
            Anterior
          </button>
          <button
            onClick={avanzar}
            style={{
              padding: "12px 30px",
              backgroundColor: "#f1a523",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "1rem",
              color: "#18323f",
            }}
          >
            {faseActual === fases.length - 1 ? "Finalizar" : "Siguiente"}
          </button>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 30px",
              backgroundColor: "#f1a523",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "1rem",
              color: "#18323f",
            }}
          >
            Salir
          </button>
          <button
            onClick={cerrarSesion}
            style={{
              float: "right",
              backgroundColor: "#f1a523",
              border: "none",
              padding: "8px 15px",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntrevistaFases;
