// src/layouts/tables/data/authorsTableData.js

export default function authorsTableData() {
  return {
    columns: [
      { Header: "Usuario", accessor: "author", width: "45%", align: "left" },
      { Header: "Contraseña", accessor: "password", align: "center" },
      { Header: "Rol", accessor: "funtion", align: "left" },
      { Header: "Estado", accessor: "status", align: "center" },
      { Header: "Fecha Creación", accessor: "employed", align: "center" },
      { Header: "Acciones", accessor: "action", align: "center" },
    ],
    rows: [], // Las filas ya no se definen aquí, se cargan dinámicamente en Tables.jsx
  };
}
