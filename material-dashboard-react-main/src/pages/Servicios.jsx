import React, { useState } from "react";
import "./Servicios.css";

const servicesData = [
  {
    id: 1,
    title: "Registro de Candidatos",
    shortDesc: "Inscripción de personas para ser entrevistadas.",
    fullDesc:
      "Registramos personas interesadas en empleos mediante un formulario simple. Se almacenan sus datos, CVs y disponibilidad para entrevistas en nuestra base de datos.",
    image: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
  },
  {
    id: 2,
    title: "Entrevistas Grabadas",
    shortDesc: "Realización de entrevistas en el sistema.",
    fullDesc:
      "Cada candidato registrado puede ser entrevistado a través de videollamadas integradas. Las entrevistas quedan grabadas y almacenadas para posterior revisión por parte de las empresas.",
    image: "https://cdn-icons-png.flaticon.com/512/1087/1087815.png",
  },
  {
    id: 3,
    title: "Evaluación de Candidatos",
    shortDesc: "Análisis de entrevistas con calificación.",
    fullDesc:
      "Nuestros especialistas o la empresa pueden calificar las entrevistas con observaciones, puntuaciones y etiquetas (como habilidades blandas, comunicación, etc.). Esto permite una selección más precisa.",
    image: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  },
  {
    id: 4,
    title: "Solicitud de Perfiles",
    shortDesc: "Las empresas pueden solicitar candidatos específicos.",
    fullDesc:
      "Las empresas registradas pueden pedir candidatos con criterios concretos (experiencia, sector, ubicación). Nuestro sistema busca automáticamente coincidencias en la base de datos y las muestra.",
    image: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
  },
  {
    id: 5,
    title: "Venta de Candidatos",
    shortDesc: "Ofrecemos perfiles preevaluados a empresas.",
    fullDesc:
      "Nuestro equipo identifica talento valioso y lo pone a disposición de empresas interesadas. Estas pueden adquirir derechos de contacto y contratación de los perfiles recomendados.",
    image: "https://cdn-icons-png.flaticon.com/512/2913/2913466.png",
  },
  {
    id: 6,
    title: "Reportes Personalizados",
    shortDesc: "Generación de informes detallados para contratación.",
    fullDesc:
      "Generamos informes visuales con estadísticas de entrevistas, perfiles más aptos, candidatos destacados y proyecciones para tomar decisiones de contratación eficientes.",
    image: "https://cdn-icons-png.flaticon.com/512/1828/1828919.png",
  },
];

const Servicios = () => {
  const [openId, setOpenId] = useState(null);

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Servicios del Sistema de Entrevistas</h1>
      <p className="contact-description">
        Descubre cómo nuestro sistema mejora el proceso de entrevistas, registro y contratación de
        personal calificado.
      </p>

      <div className="services-grid">
        {servicesData.map(({ id, title, shortDesc, fullDesc, image }) => (
          <div key={id} className={`service-card ${openId === id ? "open" : ""}`}>
            <img src={image} alt={title} className="service-image" />
            <div className="service-header" onClick={() => toggleOpen(id)}>
              <h3>{title}</h3>
            </div>
            <p className="service-short">{shortDesc}</p>
            <div className="service-expand" onClick={() => toggleOpen(id)}>
              <span>{openId === id ? "Ocultar información ▲" : "Visualizar servicio ▼"}</span>
            </div>
            {openId === id && <p className="service-full">{fullDesc}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servicios;
