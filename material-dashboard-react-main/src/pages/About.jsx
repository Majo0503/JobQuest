import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function About() {
  const teamMembers = [
    { name: "John Doe", role: "CEO, Founder", img: "/img/team-1.jpg" },
    { name: "Kate Wilson", role: "Designer", img: "/img/team-2.jpg" },
    { name: "John Brown", role: "Developer", img: "/img/team-3.jpg" },
    { name: "Paul Watson", role: "Marketer", img: "/img/team-4.jpg" },
  ];

  const sliderSettings = {
    autoplay: true,
    dots: true,
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }],
  };

  return (
    <>
      {/* Navbar */}
      <div className="container-fluid nav-bar p-0">
        <div className="container-lg p-0">
          <nav className="navbar navbar-expand-lg bg-secondary navbar-dark">
            <Link to="/" className="navbar-brand">
              <h1 className="m-0 text-white display-4">
                <span className="text-primary">J</span>ob
                <span className="text-primary">Q</span>uest
              </h1>
            </Link>
            <button className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
              <div className="navbar-nav ml-auto py-0">
                <Link to="/" className="nav-item nav-link">
                  Inicio
                </Link>
                <Link to="/about" className="nav-item nav-link active">
                  Conócenos
                </Link>
                <Link to="/mision-vision" className="nav-item nav-link">
                  Misión y Visión
                </Link>
                <Link to="/valores" className="nav-item nav-link">
                  Valores
                </Link>
                <Link to="/login" className="nav-item nav-link">
                  Login
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="container-fluid page-header d-flex flex-column align-items-center justify-content-center mb-5">
        <h1 className="display-4 text-white mb-3">Conócenos</h1>
        <div className="d-inline-flex text-white">
          <p className="m-0">
            <Link className="text-white" to="/">
              Home
            </Link>
          </p>
          <p className="m-0 px-2">/</p>
          <p className="m-0">About</p>
        </div>
      </div>

      {/* About Section */}
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row align-items-center pb-1">
            <div className="col-lg-5">
              <img className="img-thumbnail p-3" src="/img/about.jpg" alt="about" />
            </div>
            <div className="col-lg-7 mt-5 mt-lg-0">
              <small className="bg-primary text-white text-uppercase font-weight-bold px-1">
                Quiénes Somos
              </small>
              <h1 className="mt-2 mb-4">Proveedor Creativo más Eficaz para Empresas</h1>
              <p className="mb-4">
                Eirmod est dolor nonumy sea amet dolore erat sit dolor et dolor vero...
              </p>
              <a href="#" className="btn btn-primary py-md-2 px-md-4 font-weight-semi-bold">
                Leer Más
              </a>
            </div>
          </div>

          {/* Info Cards */}
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="d-flex align-items-center border mb-4 p-4" style={{ height: 120 }}>
                <i className="fa fa-2x fa-map-marker-alt text-primary mr-3"></i>
                <div>
                  <h5 className="font-weight-bold">Nuestra Oficina</h5>
                  <p className="m-0">123 Street, New York, USA</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center border mb-4 p-4" style={{ height: 120 }}>
                <i className="fa fa-2x fa-envelope-open text-primary mr-3"></i>
                <div>
                  <h5 className="font-weight-bold">Email</h5>
                  <p className="m-0">info@example.com</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center border mb-4 p-4" style={{ height: 120 }}>
                <i className="fas fa-2x fa-phone-alt text-primary mr-3"></i>
                <div>
                  <h5 className="font-weight-bold">Llámanos</h5>
                  <p className="m-0">+012 345 6789</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container-fluid pt-5 pb-2">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-5">
              <small className="bg-primary text-white text-uppercase font-weight-bold px-1">
                Por qué elegirnos
              </small>
              <h1 className="mt-2 mb-3">25 Años de Experiencia</h1>
              <h4 className="font-weight-normal text-muted mb-4">
                Lorem ut kasd dolores elitr sed est duo ea ipsum justo diam...
              </h4>
              <ul className="list-unstyled">
                <li>
                  <i className="fa fa-angle-right text-primary mr-2"></i> Dolores elitr
                </li>
                <li>
                  <i className="fa fa-angle-right text-primary mr-2"></i> Ipsum lorem justo
                </li>
                <li>
                  <i className="fa fa-angle-right text-primary mr-2"></i> Est dolor diama
                </li>
              </ul>
              <a href="#" className="btn btn-primary py-md-2 px-md-4 font-weight-semi-bold">
                Aprender más
              </a>
            </div>
            <div className="col-lg-6">
              <div className="row">
                {[
                  { count: 25, label: "Años de Experiencia" },
                  { count: 225, label: "Expertos Capacitados" },
                  { count: 1050, label: "Clientes Felices" },
                  { count: 2500, label: "Proyectos Completos" },
                ].map((item, i) => (
                  <div className="col-sm-6 pb-1" key={i}>
                    <div className="d-flex flex-column align-items-center border px-4 mb-4">
                      <h2 className="display-3 text-primary mb-3">{item.count}</h2>
                      <h5 className="font-weight-bold mb-4">{item.label}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Carousel */}
      <div className="container-fluid pt-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-5">
              <small className="bg-primary text-white text-uppercase font-weight-bold px-1">
                Nuestro Equipo
              </small>
              <h1 className="mt-2 mb-3">Expertos Detrás del Trabajo</h1>
              <p className="font-weight-normal text-muted mb-4">
                Eirmod diam magna sed sea rebum, elitr diam dolor lorem ipsum...
              </p>
              <a href="#" className="btn btn-primary py-md-2 px-md-4 font-weight-semi-bold">
                Ver Todo
              </a>
            </div>
            <div className="col-lg-8 mb-5">
              <Slider {...sliderSettings}>
                {teamMembers.map((member, index) => (
                  <div className="team-item" key={index}>
                    <div className="position-relative">
                      <img className="img-fluid w-100" src={member.img} alt={member.name} />
                      <div className="team-overlay d-flex align-items-center justify-content-center m-3">
                        <div className="d-flex align-items-center">
                          <a
                            className="btn btn-outline-secondary rounded-circle text-center mr-2"
                            href="#"
                          >
                            <i className="fab fa-twitter"></i>
                          </a>
                          <a
                            className="btn btn-outline-secondary rounded-circle text-center mr-2"
                            href="#"
                          >
                            <i className="fab fa-facebook-f"></i>
                          </a>
                          <a
                            className="btn btn-outline-secondary rounded-circle text-center"
                            href="#"
                          >
                            <i className="fab fa-linkedin-in"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="border border-top-0 text-center p-4">
                      <h5 className="font-weight-bold">{member.name}</h5>
                      <span>{member.role}</span>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
