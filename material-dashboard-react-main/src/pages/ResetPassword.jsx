import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://jobquest-production.up.railway.app//${token}`, {
        password,
      });
      setMensaje(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMensaje(err.response?.data?.message || "Error al actualizar la contraseña");
    }
  };

  return (
    <div className="container">
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Restablecer</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default ResetPassword;
