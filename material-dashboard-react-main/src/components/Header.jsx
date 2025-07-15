import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/img/logo.png";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const isActive = (path) => (location.pathname === path ? "nav-link active" : "nav-link");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="nav-bar">
      <div className="nav-background">
        <nav className="navbar navbar-expand-lg custom-navbar navbar-dark">
          <div className="container">
            <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
              <img src={logo} alt="JobQuest Logo" className="nav-logo" />
              <h1 className="m-0 text-white display-4">
                <span className="highlight-primary">J</span>ob
                <span className="highlight-primary">Q</span>uest
              </h1>
            </Link>

            <button
              className={`navbar-toggler ${dropdownOpen ? "active" : ""}`}
              type="button"
              onClick={() => {
                const collapse = document.getElementById("navbarCollapse");
                collapse.classList.toggle("show");
                setDropdownOpen(false);
              }}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarCollapse">
              <div className="navbar-nav py-0">
                <Link to="/" className={`nav-item nav-link ${isActive("/")}`}>
                  Inicio
                </Link>
                <Link to="/fases" className={`nav-item nav-link ${isActive("/fases")}`}>
                  Entrevistas
                </Link>
                <Link to="/servicios" className={`nav-item nav-link ${isActive("/servicios")}`}>
                  Servicios
                </Link>

                <div className={`nav-item dropdown ${dropdownOpen ? "show" : ""}`}>
                  <span
                    className={`nav-link dropdown-toggle custom-nav-dropdown-toggle ${
                      dropdownOpen ? "show" : ""
                    }`}
                    onClick={toggleDropdown}
                    role="button"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    Acerca de Nosotros
                  </span>
                  <div
                    className={`dropdown-menu custom-nav-dropdown-menu ${
                      dropdownOpen ? "show" : ""
                    }`}
                    onMouseLeave={closeDropdown}
                  >
                    <Link
                      to="/conocenos"
                      className="dropdown-item custom-nav-dropdown-item"
                      onClick={closeDropdown}
                    >
                      Conócenos
                    </Link>
                    <Link
                      to="/equipo"
                      className="dropdown-item custom-nav-dropdown-item"
                      onClick={closeDropdown}
                    >
                      Nuestro Equipo
                    </Link>
                    <Link
                      to="/preguntas-frecuentes"
                      className="dropdown-item custom-nav-dropdown-item"
                      onClick={closeDropdown}
                    >
                      Preguntas Frecuentes
                    </Link>
                    <Link
                      to="/guia-uso"
                      className="dropdown-item custom-nav-dropdown-item"
                      onClick={closeDropdown}
                    >
                      Guía de Uso
                    </Link>
                  </div>
                </div>

                {!user ? (
                  <Link to="/login" className={`nav-item nav-link ${isActive("/login")}`}>
                    Login
                  </Link>
                ) : (
                  <div className="nav-item nav-link text-white">
                    <strong>{user.nombre}</strong> ({user.rol}){" "}
                    <button
                      onClick={handleLogout}
                      className="btn btn-sm btn-outline-light ms-2"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;
