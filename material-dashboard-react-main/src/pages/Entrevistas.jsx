import React, { useEffect, useState } from "react";
import "./Entrevistas.css";

function Entrevistas() {
  const [entrevistas, setEntrevistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/entrevistas")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar entrevistas");
        return res.json();
      })
      .then((data) => {
        setEntrevistas(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">Cargando entrevistas...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="entrevistas-container">
      <h2>Lista de Entrevistas</h2>
      {entrevistas.length === 0 ? (
        <p className="no-entrevistas">No hay entrevistas registradas.</p>
      ) : (
        <table className="entrevistas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fase Actual</th>
              <th>Respuestas</th>
            </tr>
          </thead>
          <tbody>
            {entrevistas.map((entrevista) => (
              <tr key={entrevista._id}>
                <td>{entrevista._id}</td>
                <td>{entrevista.faseActual}</td>
                <td>
                  <pre className="respuestas-json">
                    {JSON.stringify(entrevista.respuestas, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Entrevistas;
