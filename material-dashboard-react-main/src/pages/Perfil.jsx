import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import avatar from "assets/img/avatar.jpeg.jpg";
import "./Perfil.css";

const API_URL = process.env.REACT_APP_API_URL;

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState({});
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();

  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) return;

    fetch(`${API_URL}/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUsuario(data);
        setDatosEditados(data);
      })
      .catch((err) => console.error("Error al obtener usuario:", err));
  }, [userId]);

  const handleChange = (e) => {
    setDatosEditados({ ...datosEditados, [e.target.name]: e.target.value });
  };

  const guardarCambios = () => {
    fetch(`${API_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosEditados),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Perfil actualizado");
        setUsuario(datosEditados);
        setEditando(false);
      })
      .catch((err) => alert("Error al actualizar perfil"));
  };

  const cerrarSesion = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  if (!usuario) {
    return (
      <div className="perfil">
        <div className="banner"></div>
        <div className="perfil-card">
          <img src={avatar} className="perfil-avatar" alt="avatar" />
          <h2>Invitado</h2>
          <p>Por favor inicia sesión para ver tu perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil">
      <div className="banner"></div>
      <div className="perfil-card">
        <img src={avatar} className="perfil-avatar" alt="avatar" />
        <h2>
          {usuario.nameUser} {usuario.lastName}
        </h2>

        <div className="perfil-info">
          <label>Nombre:</label>
          {editando ? (
            <input name="nameUser" value={datosEditados.nameUser || ""} onChange={handleChange} />
          ) : (
            <p>{usuario.nameUser}</p>
          )}

          <label>Apellido:</label>
          {editando ? (
            <input name="lastName" value={datosEditados.lastName || ""} onChange={handleChange} />
          ) : (
            <p>{usuario.lastName}</p>
          )}

          <label>Correo:</label>
          {editando ? (
            <input name="email" value={datosEditados.email || ""} onChange={handleChange} />
          ) : (
            <p>{usuario.email}</p>
          )}

          <label>Teléfono:</label>
          {editando ? (
            <input name="phone" value={datosEditados.phone || ""} onChange={handleChange} />
          ) : (
            <p>{usuario.phone || "N/A"}</p>
          )}

          <label>Género:</label>
          {editando ? (
            <input name="gender" value={datosEditados.gender || ""} onChange={handleChange} />
          ) : (
            <p>{usuario.gender || "N/A"}</p>
          )}

          <label>DPI:</label>
          {editando ? (
            <input name="dpi" value={datosEditados.dpi || ""} onChange={handleChange} />
          ) : (
            <p>{usuario.dpi || "N/A"}</p>
          )}

          <label>Fecha de nacimiento:</label>
          {editando ? (
            <input
              type="date"
              name="birthDate"
              value={datosEditados.birthDate?.slice(0, 10) || ""}
              onChange={handleChange}
            />
          ) : (
            <p>{usuario.birthDate?.slice(0, 10) || "N/A"}</p>
          )}
          <label>Contraseña:</label>
          {editando ? (
            <div style={{ position: "relative" }}>
              <input
                type={mostrarPassword ? "text" : "password"}
                name="password"
                value={datosEditados.password || ""}
                onChange={handleChange}
              />
              <FontAwesomeIcon
                icon={mostrarPassword ? faEyeSlash : faEye}
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 8,
                  cursor: "pointer",
                  color: "#000000",
                }}
              />
            </div>
          ) : (
            <p></p>
          )}
        </div>

        <div className="botones-perfil">
          <button onClick={() => setEditando(!editando)}>{editando ? "Cancelar" : "Editar"}</button>
          {editando && <button onClick={guardarCambios}>Guardar</button>}
          <button onClick={cerrarSesion} className="cerrar-sesion">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
