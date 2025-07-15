import React from "react";
import Slider from "react-slick";
import "./Equipo.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Imágenes del equipo
import melanyImg from "../assets/img/Melany.png";
import cristianImg from "../assets/img/Cristian.png";
import quintaImg from "../assets/img/Quinta.png";
import MajoImg from "../assets/img/Majo.png";
import luisImg from "../assets/img/Luis.png";

const teamMembers = [
  {
    photo: melanyImg,
    name: "Melany Trujillo",
    role: "Estudiante IES",
    description: "EXPOTEC",
  },
  {
    photo: cristianImg,
    name: "Cristian Soto",
    role: "Estudiante IES",
    description: "EXPOTEC",
  },
  {
    photo: MajoImg,
    name: "Maria Jose",
    role: "Estudiante IES",
    description: "EXPOTEC",
  },
  {
    photo: quintaImg,
    name: "William Quintanilla",
    role: "Estudiante IES",
    description: "EXPOTEC",
  },
  {
    photo: luisImg,
    name: "Luis Orizabal",
    role: "Estudiante IES",
    description: "EXPOTEC",
  },
  {
    photo: "/img/jorge.jpg",
    name: "Dereck Zarceño",
    role: "Estudiante IES",
    description: "EXPOTEC",
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 700,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3500,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const Equipo = () => {
  return (
    <section className="team-section">
      <h1 className="team-title">Conoce a Nuestro Equipo</h1>
      <Slider {...settings}>
        {teamMembers.map((member) => (
          <article className="team-card" key={member.name}>
            <img
              src={member.photo}
              alt={`Foto de ${member.name}`}
              className="team-photo"
              loading="lazy"
            />
            <h2>{member.name}</h2>
            <h4>{member.role}</h4>
            <p>{member.description}</p>
          </article>
        ))}
      </Slider>
    </section>
  );
};

export default Equipo;
