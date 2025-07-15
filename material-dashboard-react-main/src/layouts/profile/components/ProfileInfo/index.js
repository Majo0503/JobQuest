import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const API_URL = process.env.REACT_APP_API_URL;

function PlatformSettings() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nombre: "", correo: "", rol: "" });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const { _id } = JSON.parse(stored);

      fetch(`${API_URL}/api/users/${_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setUser(data);
            setForm({
              nombre: data.nombre || "",
              correo: data.correo || "",
              rol: data.rol || "",
            });
          }
        })
        .catch((err) => console.error("Error cargando el usuario:", err));
    }
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user || !user.id) return;

    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setUser({ ...user, ...form });
        setEditMode(false);
      } else {
        console.error("Error al actualizar:", data);
      }
    } catch (err) {
      console.error("Error en actualización:", err);
    }
  };

  if (!user) return <p style={{ padding: "1rem" }}>Datos...</p>;

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Perfil del Usuario
        </MDTypography>
        <MDTypography
          component="span"
          variant="body2"
          color="info"
          sx={{ cursor: "pointer" }}
          onClick={handleEditToggle}
        >
          <Icon>edit</Icon> &nbsp;{editMode ? "Cancelar" : "Editar"}
        </MDTypography>
      </MDBox>

      <MDBox pt={1} pb={2} px={3}>
        {!editMode ? (
          <>
            <MDTypography variant="body2" color="text">
              ¡Hola! Mi nombre es <strong>{user.nombre}</strong>, con rol de{" "}
              <strong>{user.rol}</strong> en JobQuest.
            </MDTypography>
            <Divider sx={{ my: 2 }} />
            <MDBox display="flex" flexDirection="column" gap={1}>
              <MDBox display="flex" justifyContent="space-between">
                <MDTypography variant="button" fontWeight="bold" color="text">
                  Nombre completo:
                </MDTypography>
                <MDTypography variant="button" color="text">
                  {user.nombre}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="space-between">
                <MDTypography variant="button" fontWeight="bold" color="text">
                  Correo electrónico:
                </MDTypography>
                <MDTypography variant="button" color="text">
                  {user.correo}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" justifyContent="space-between">
                <MDTypography variant="button" fontWeight="bold" color="text">
                  Rol:
                </MDTypography>
                <MDTypography variant="button" color="text">
                  {user.rol}
                </MDTypography>
              </MDBox>
            </MDBox>
          </>
        ) : (
          <MDBox component="form" display="flex" flexDirection="column" gap={2}>
            <TextField
              name="nombre"
              label="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="correo"
              label="Correo electrónico"
              value={form.correo}
              onChange={handleChange}
              fullWidth
            />
            <TextField name="rol" label="Rol" value={form.rol} onChange={handleChange} fullWidth />
            <Button variant="contained" color="primary" onClick={handleSave}>
              Guardar Cambios
            </Button>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

export default PlatformSettings;
