import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <>
      <footer className="footer-container">
        <div className="footer-content container">
          <div className="footer-col">
            <h1 className="footer-logo">
              <span style={{ color: "#f1a523", fontWeight: "bold", textDecoration: "none" }}>
                J
              </span>
              ob
              <span style={{ color: "#f1a523", fontWeight: "bold", textDecoration: "none" }}>
                Q
              </span>
              uest
            </h1>
            <p className="footer-description">
              JobQuest es un simulador interactivo que te prepara para entrevistas reales mediante
              práctica guiada y retroalimentación personalizada.
            </p>
            <div className="social-icons">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5 className="footer-title">Navegación Rápida</h5>
            <nav className="footer-nav">
              <Link to="/" className="footer-link">
                Inicio
              </Link>
              <Link to="/fases" className="footer-link">
                Entrevistas
              </Link>
              <Link to="/servicios" className="footer-link">
                Servicios
              </Link>
              <Link to="/login" className="footer-link">
                Login
              </Link>
            </nav>
          </div>

          <div className="footer-col">
            <h5 className="footer-title">Recursos Útiles</h5>
            <nav className="footer-nav">
              <Link to="/conocenos" className="footer-link">
                Conócenos
              </Link>
              <Link to="/equipo" className="footer-link">
                Nuestro Equipo
              </Link>
              <Link to="/preguntas-frecuentes" className="footer-link">
                Preguntas Frecuentes
              </Link>
              <Link to="/guia-uso" className="footer-link">
                Guía de Uso
              </Link>
            </nav>
          </div>

          <div className="footer-col">
            <h5 className="footer-title">Contáctanos</h5>
            <address className="footer-contact">
              <p>
                <i className="fas fa-map-marker-alt icon"></i> San Juan Sacatepéquez, Guatemala
              </p>
              <p>
                <i className="fas fa-phone-alt icon"></i> +502 4281 0719
              </p>
              <p>
                <i className="fas fa-envelope icon"></i> informacion@jobquest.gt
              </p>
            </address>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} <strong>JobQuest</strong>. ExpoTec 2025 &mdash;
            Instituto Emiliani Somascos.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
