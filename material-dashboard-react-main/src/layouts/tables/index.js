import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import defaultAvatar from "assets/images/team-2.jpg";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

const API_URL = process.env.REACT_APP_API_URL;

const ROLES = ["Administrador", "Cliente", "Entrevistador"];

const getBase64Image = (imgPath) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgPath;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
  });

const handleDownloadPDF = async (rows) => {
  const doc = new jsPDF();
  doc.text("Registros - Authors Table", 14, 15);
  const tableColumn = ["Foto", "Nombre", "Correo", "Password", "Rol", "Estado", "Fecha"];
  const tableRows = [];

  for (const row of rows) {
    const { image, name, email, password, role, status, date } = row.rawData || {};
    let base64 = "";

    try {
      base64 = await getBase64Image(image);
    } catch {
      base64 = defaultAvatar;
    }

    tableRows.push([
      { image: base64, width: 10, height: 10 },
      name,
      email,
      password,
      role,
      status,
      date,
    ]);
  }

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    didDrawCell: (data) => {
      if (data.column.index === 0 && data.cell.raw?.image) {
        doc.addImage(data.cell.raw.image, "PNG", data.cell.x + 1, data.cell.y + 1, 10, 10);
      }
    },
    startY: 20,
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: { 0: { cellWidth: 14 } },
  });

  doc.save("authors-table.pdf");
};

function Tables() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    lastName: "",
    phone: "",
    birthDate: "",
    gender: "",
    dpi: "",
    role: "",
    email: "",
    password: "",
    status: "",
    createDate: "",
    modificationDate: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: null });
  const [isViewMode, setIsViewMode] = useState(false);

  const handleOpen = () => {
    setIsViewMode(false);
    setOpen(true);
  };

  const handleClose = () => {
    setForm({
      code: "",
      name: "",
      lastName: "",
      phone: "",
      birthDate: "",
      gender: "",
      dpi: "",
      role: "",
      email: "",
      password: "",
      status: "",
      createDate: "",
      modificationDate: "",
    });
    setErrors({});
    setEditingUserId(null);
    setShowPassword(false);
    setIsViewMode(false);
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "name" || name === "lastName") {
      // Solo letras y espacios
      newValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    }

    if (name === "phone") {
      // Solo dígitos, máx 8
      newValue = value.replace(/[^0-9]/g, "").slice(0, 8);
    }

    if (name === "dpi") {
      // Solo dígitos, máx 13
      newValue = value.replace(/[^0-9]/g, "").slice(0, 13);
    }

    if (name === "email" && value.length > 50) return;
    if (name === "password" && value.length > 20) return;

    setForm({ ...form, [name]: newValue });
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const phoneRegex = /^[0-9]{8}$/;
    const dpiRegex = /^[0-9]{13}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/;

    if (!(form.name || "").trim()) newErrors.name = "El nombre es obligatorio.";
    else if (!nameRegex.test(form.name)) newErrors.name = "Solo letras permitidas.";

    if (!(form.lastname || "").trim()) newErrors.lastName = "El apellido es obligatorio.";
    else if (!nameRegex.test(form.lastName)) newErrors.lastName = "Solo letras permitidas.";

    if (!(form.email || "").trim()) newErrors.email = "El correo es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Correo no válido.";

    if (!(form.phone || "").trim()) newErrors.phone = "Teléfono obligatorio.";
    else if (!phoneRegex.test(form.phone)) newErrors.phone = "Teléfono: 8 dígitos.";

    if (!(form.dpi || "").trim()) newErrors.dpi = "DPI obligatorio.";
    else if (!dpiRegex.test(form.dpi)) newErrors.dpi = "DPI: 13 dígitos.";

    if (!(form.password || "").trim()) newErrors.password = "Contraseña obligatoria.";
    else if (!passwordRegex.test(form.password))
      newErrors.password = "Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.";

    if (!(form.role || "").trim()) newErrors.role = "Rol obligatorio.";
    else if (!ROLES.includes(form.role)) newErrors.role = "Rol inválido.";

    if (!["Masculino", "Femenino"].includes(form.gender)) newErrors.gender = "Género obligatorio.";

    if (!["activo", "inactivo"].includes(form.status))
      newErrors.status = "Estado debe ser Activo o Inactivo.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const formatDate = (mongoDate) => {
    try {
      const date = new Date(typeof mongoDate === "string" ? mongoDate : mongoDate?.$date);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`);
      const loadedRows = res.data.map((user) => {
        const date = formatDate(user.created_at || user.fecha_creacion || new Date());

        return {
          author: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
              <img
                src={defaultAvatar}
                alt={user.nombre}
                width={30}
                height={30}
                style={{ borderRadius: "50%", marginRight: "8px" }}
              />
              <MDBox
                sx={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
                onClick={() => {
                  setForm({
                    name: user.nombre || "",
                    lastName: user.apellido || "",
                    phone: user.telefono || "",
                    birthDate: user.fecha_nacimiento || "",
                    gender: user.genero || "",
                    dpi: user.dpi || "",
                    role: user.rol || "",
                    email: user.correo || "",
                    password: user.password || "",
                    status: user.estado || "activo",
                    createDate: user.created_at || "",
                    modificationDate: user.updated_at || "",
                  });
                  setEditingUserId(user._id);
                  setIsViewMode(true);
                  setOpen(true);
                }}
              >
                <MDTypography variant="button" fontWeight="medium">
                  {user.nombre}
                </MDTypography>
                <MDTypography variant="caption" color="text.secondary">
                  {user.correo}
                </MDTypography>
              </MDBox>
            </MDBox>
          ),
          password: (
            <MDTypography variant="caption" fontWeight="medium">
              {user.password || "******"}
            </MDTypography>
          ),
          function: (
            <MDBox lineHeight={1}>
              <MDTypography variant="caption" fontWeight="medium">
                {user.rol}
              </MDTypography>
            </MDBox>
          ),
          status: (
            <MDBox ml={-1}>
              <span
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  borderRadius: "8px",
                  padding: "2px 6px",
                  fontSize: "12px",
                }}
              >
                {user.estado || "activo"}
              </span>
            </MDBox>
          ),
          employed: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {date}
            </MDTypography>
          ),
          action: (
            <MDBox display="flex" justifyContent="center" gap={2}>
              <MDTypography
                variant="caption"
                color="info"
                fontWeight="medium"
                sx={{ cursor: "pointer" }}
                onClick={() => handleEdit(user)}
              >
                Edit
              </MDTypography>
              <MDTypography
                variant="caption"
                color="error"
                fontWeight="medium"
                sx={{ cursor: "pointer" }}
                onClick={() => setConfirmDialog({ open: true, userId: user._id })}
              >
                Delete
              </MDTypography>
            </MDBox>
          ),
          rawData: {
            id: user._id,
            image: defaultAvatar,
            name: user.nombre,
            email: user.correo,
            password: user.password,
            role: user.rol,
            status: user.estado || "activo",
            date,
          },
        };
      });

      setRows(loadedRows);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const handleSubmit = async () => {
    if (isViewMode) {
      // Cambia a modo edición
      setIsViewMode(false);
      return;
    }

    if (!validateForm()) return;

    try {
      if (editingUserId) {
        await axios.put(`${API_URL}/api/users/${editingUserId}`, {
          nombre: form.name,
          apellido: form.lastName,
          telefono: form.phone,
          fecha_nacimiento: form.birthDate,
          genero: form.gender,
          dpi: form.dpi,
          rol: form.role,
          correo: form.email,
          password: form.password,
          estado: form.status,
          created_at: form.createDate,
          updated_at: new Date().toISOString(),
        });
        setSnackbar({ open: true, message: "Usuario actualizado", severity: "success" });
      } else {
        await axios.post(`${API_URL}/api/register`, {
          nombre: form.name,
          apellido: form.lastName,
          telefono: form.phone,
          fecha_nacimiento: form.birthDate,
          genero: form.gender,
          dpi: form.dpi,
          rol: form.role,
          correo: form.email,
          password: form.password,
          estado: form.status,
          created_at: new Date().toISOString(),
        });
        setSnackbar({ open: true, message: "Usuario agregado", severity: "success" });
      }
      handleClose();
      loadUsers();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      setSnackbar({ open: true, message: "Error al guardar", severity: "error" });
    }
  };

  const handleEdit = (user) => {
    setForm({
      code: user.code || "",
      name: user.nombre || "",
      lastName: user.apellido || "",
      phone: user.telefono || "",
      birthDate: user.fecha_nacimiento || "",
      gender: user.genero || "",
      dpi: user.dpi || "",
      role: user.rol || "",
      email: user.correo || "",
      password: user.password || "",
      status: user.estado || "",
      createDate: user.created_at || "",
      modificationDate: user.updated_at || "",
    });
    setErrors({});
    setEditingUserId(user._id);
    setIsViewMode(false);
    setOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${API_URL}/api/users/${confirmDialog.userId}`);
      loadUsers();
      setSnackbar({ open: true, message: "Usuario eliminado", severity: "info" });
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setSnackbar({ open: true, message: "Error al eliminar", severity: "error" });
    }
    setConfirmDialog({ open: false, userId: null });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Usuarios
                </MDTypography>
                <MDBox display="flex" gap={1}>
                  <Button variant="contained" onClick={handleOpen}>
                    Agregar nuevo ítem
                  </Button>
                  <Button variant="outlined" onClick={() => handleDownloadPDF(rows)}>
                    Descargar PDF
                  </Button>
                </MDBox>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Usuario", accessor: "author" },
                      { Header: "Contraseña", accessor: "password" },
                      { Header: "Rol", accessor: "funtion" },
                      { Header: "Estado", accessor: "status" },
                      { Header: "Fecha Creación", accessor: "employed" },
                      { Header: "Acciones", accessor: "action" },
                    ],
                    rows: rows,
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#f9f9f9",
            p: 4,
            borderRadius: 3,
            boxShadow: 24,
            width: 450,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <IconButton onClick={handleClose} sx={{ position: "absolute", top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>

          <MDTypography variant="h6" mb={2}>
            {editingUserId
              ? isViewMode
                ? "Detalles del usuario"
                : "Editar usuario"
              : "Agregar usuario"}
          </MDTypography>

          <TextField
            name="name"
            label="Nombre"
            fullWidth
            value={form.name}
            onChange={handleChange}
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              maxLength: 30,
              readOnly: isViewMode,
              pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]*",
            }}
          />
          <TextField
            name="lastName"
            label="Apellido"
            fullWidth
            value={form.lastName}
            onChange={handleChange}
            margin="normal"
            error={!!errors.lastName}
            helperText={errors.lastName}
            inputProps={{
              maxLength: 30,
              readOnly: isViewMode,
              pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]*",
            }}
          />
          <TextField
            name="phone"
            label="Teléfono"
            fullWidth
            value={form.phone}
            onChange={handleChange}
            margin="normal"
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 8,
              readOnly: isViewMode,
            }}
          />
          <TextField
            name="birthDate"
            label="Fecha de nacimiento"
            type="date"
            fullWidth
            value={form.birthDate}
            onChange={handleChange}
            margin="normal"
            error={!!errors.birthDate}
            helperText={errors.birthDate}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: isViewMode }}
          />
          <TextField
            name="dpi"
            label="DPI"
            fullWidth
            value={form.dpi}
            onChange={handleChange}
            margin="normal"
            error={!!errors.dpi}
            helperText={errors.dpi}
            InputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 13,
              readOnly: isViewMode,
            }}
          />
          <TextField
            name="role"
            label="Rol"
            select
            fullWidth
            value={form.role}
            onChange={handleChange}
            margin="normal"
            error={!!errors.role}
            helperText={errors.role}
            InputProps={{ readOnly: isViewMode }}
          >
            {ROLES.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="email"
            label="Correo"
            fullWidth
            value={form.email}
            onChange={handleChange}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{ maxLength: 50, readOnly: isViewMode }}
          />
          <TextField
            name="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={form.password}
            onChange={handleChange}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              maxLength: 20,
              readOnly: isViewMode,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* Género */}
          <MDTypography
            variant="caption"
            fontWeight="medium"
            sx={{ display: "block", mt: 2, mb: 1, color: "#5f6368" }}
          >
            Género
          </MDTypography>
          <RadioGroup row name="gender" value={form.gender} onChange={handleChange}>
            <FormControlLabel
              value="Masculino"
              control={<Radio disabled={isViewMode} />}
              label="Masculino"
            />
            <FormControlLabel
              value="Femenino"
              control={<Radio disabled={isViewMode} />}
              label="Femenino"
            />
          </RadioGroup>
          {errors.gender && <p style={{ color: "red" }}>{errors.gender}</p>}

          {/* Estado */}
          <MDTypography
            variant="caption"
            fontWeight="medium"
            sx={{ display: "block", mt: 2, mb: 1, color: "#5f6368" }}
          >
            Estado
          </MDTypography>
          <RadioGroup row name="status" value={form.status} onChange={handleChange}>
            <FormControlLabel
              value="activo"
              control={<Radio disabled={isViewMode} />}
              label="Activo"
            />
            <FormControlLabel
              value="inactivo"
              control={<Radio disabled={isViewMode} />}
              label="Inactivo"
            />
          </RadioGroup>
          {errors.status && <p style={{ color: "red" }}>{errors.status}</p>}
          <TextField
            name="createDate"
            label="Fecha creación"
            fullWidth
            value={form.createDate ? formatDate(form.createDate) : ""}
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <TextField
            name="modificationDate"
            label="Fecha modificación"
            fullWidth
            value={form.modificationDate ? formatDate(form.modificationDate) : ""}
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <Button
            fullWidth
            variant="contained"
            color="info"
            sx={{ mt: 2, borderRadius: 2 }}
            onClick={handleSubmit}
          >
            {isViewMode ? "Editar datos" : editingUserId ? "Actualizar" : "Agregar"}
          </Button>
        </Box>
      </Modal>

      {/* Dialog Confirmación */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, userId: null })}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar este usuario?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, userId: null })}>Cancelar</Button>
          <Button onClick={handleDeleteConfirmed} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
