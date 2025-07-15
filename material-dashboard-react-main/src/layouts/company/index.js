import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Button,
  Modal,
  Box,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

const API_URL = process.env.REACT_APP_API_URL;

function Company() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
    nit: "",
    environment: "",
    sector: "",
    description: "",
    status: "",
    managerRH: "",
    state: "",
    createdAt: "",
    updatedAt: "",
  });
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });

  const showAlert = (message, severity = "error") => setAlert({ open: true, message, severity });
  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const handleOpen = () => {
    setIsViewMode(false);
    setOpen(true);
  };

  const handleClose = () => {
    setForm({
      nombre: "",
      direccion: "",
      telefono: "",
      correo: "",
      nit: "",
      environment: "",
      sector: "",
      description: "",
      status: "",
      managerRH: "",
      state: "",
      createdAt: "",
      updatedAt: "",
    });
    setEditingId(null);
    setOpen(false);
    setIsViewMode(false);
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{8}$/;
    const nitRegex = /^\d{6,12}$/;
    const textRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]{2,}$/;
    const addressRegex = /^[a-zA-Z0-9\s.,\-#\/]{5,100}$/;
    const onlyLetters = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ ]+$/;

    if (!textRegex.test(form.nombre)) return showAlert("Nombre inválido.");
    if (!addressRegex.test(form.direccion)) return showAlert("Dirección inválida.");
    if (!phoneRegex.test(form.telefono)) return showAlert("Teléfono inválido.");
    if (!emailRegex.test(form.correo)) return showAlert("Correo inválido.");
    if (!nitRegex.test(form.nit)) return showAlert("NIT inválido.");
    if (!onlyLetters.test(form.environment)) return showAlert("Ambiente inválido.");
    if (!onlyLetters.test(form.sector)) return showAlert("Sector inválido.");
    if (form.description.trim().length < 10) return showAlert("Descripción muy corta.");
    if (!onlyLetters.test(form.status)) return showAlert("Estado inválido.");
    if (!onlyLetters.test(form.managerRH)) return showAlert("Encargado RRHH inválido.");
    if (!onlyLetters.test(form.state)) return showAlert("Departamento inválido.");
    return true;
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const currentDate = new Date().toISOString();
      const data = {
        nombre: form.nombre,
        direccion: form.direccion,
        telefono: form.telefono,
        correo: form.correo,
        nit: form.nit,
        entorno: form.environment,
        sector: form.sector,
        descripcion: form.description,
        estado: form.status,
        encargadoRH: form.managerRH,
        estadoPerteneciente: form.state,
        updatedAt: currentDate,
      };
      if (editingId) {
        await axios.put(`${API_URL}/updatecompany/${editingId}`, data);
        showAlert("Empresa actualizada con éxito", "success");
      } else {
        data.createdAt = currentDate;
        await axios.post(`${API_URL}/addcompany`, data);
        showAlert("Empresa agregada con éxito", "success");
      }
      handleClose();
      loadCompanies(); // Cargar empresas después de guardar
    } catch (err) {
      console.error("Error al guardar empresa:", err);
      showAlert("Error al guardar empresa");
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${API_URL}/deletecompany/${confirmDialog.id}`);
      loadCompanies(); // Cargar empresas después de eliminar
      showAlert("Empresa eliminada", "info");
    } catch (err) {
      console.error("Error al eliminar empresa:", err);
      showAlert("Error al eliminar empresa");
    }
    setConfirmDialog({ open: false, id: null });
  };

  const handleEdit = (company, viewOnly = false) => {
    setForm({
      nombre: company.nombre || "",
      direccion: company.direccion || "",
      telefono: company.telefono || "",
      correo: company.correo || "",
      nit: company.nit || "",
      environment: company.environment || company.entorno || "",
      sector: company.sector || "",
      description: company.description || company.descripcion || "",
      status: company.status || company.estado || "",
      managerRH: company.managerRH || company.encargadoRH || "",
      state: company.state || company.estadoPerteneciente || "",
      createdAt: company.createdAt || "",
      updatedAt: company.updatedAt || "",
    });
    setEditingId(company._id);
    setOpen(true);
    setIsViewMode(viewOnly);
  };

  const loadCompanies = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/companies`);
      const loadedRows = res.data.map((company) => ({
        nombre: (
          <div onClick={() => handleEdit(company, true)} style={{ cursor: "pointer" }}>
            <strong>{company.nombre}</strong>
            <div style={{ fontSize: "0.75rem", color: "#555" }}>{company.correo}</div>
          </div>
        ),
        direccion: company.direccion,
        nit: company.nit,
        telefono: company.telefono,
        status: company.status || company.estado || "",
        createdAt: new Date(company.createdAt).toLocaleDateString("es-ES"),
        updatedAt: new Date(company.updatedAt).toLocaleDateString("es-ES"),
        accion: (
          <MDBox display="flex" justifyContent="center" gap={2}>
            <MDTypography
              variant="caption"
              color="info"
              sx={{ cursor: "pointer" }}
              onClick={() => handleEdit(company, false)}
            >
              Editar
            </MDTypography>
            <MDTypography
              variant="caption"
              color="error"
              sx={{ cursor: "pointer" }}
              onClick={() => setConfirmDialog({ open: true, id: company._id })}
            >
              Eliminar
            </MDTypography>
          </MDBox>
        ),
      }));
      setRows(loadedRows);
    } catch (err) {
      console.error("Error al cargar empresas:", err);
    }
  };

  const handleDownloadPDF = (rows) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Lista de Empresas", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["Nombre", "Dirección", "NIT", "Teléfono", "Estado", "Creado", "Modificado"]],
      body: rows.map((row) => [
        row.nombre.props.children[0].props.children, // Nombre
        row.direccion,
        row.nit,
        row.telefono,
        row.status,
        row.createdAt,
        row.updatedAt,
      ]),
    });
    doc.save("empresas.pdf");
  };

  useEffect(() => {
    loadCompanies();
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
                  Empresas
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
              <DataTable
                table={{
                  columns: [
                    { Header: "Nombre", accessor: "nombre" },
                    { Header: "Dirección", accessor: "direccion" },
                    { Header: "NIT", accessor: "nit" },
                    { Header: "Teléfono", accessor: "telefono" },
                    { Header: "Estado", accessor: "status" },
                    { Header: "Creado", accessor: "createdAt" },
                    { Header: "Modificado", accessor: "updatedAt" },
                    { Header: "Acciones", accessor: "accion" },
                  ],
                  rows,
                }}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
            </Card>
          </Grid>
        </Grid>
      </MDBox>
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
            {editingId
              ? isViewMode
                ? "Detalles de Empresa"
                : "Editar Empresa"
              : "Agregar Empresa"}
          </MDTypography>
          <TextField
            name="nombre"
            label="Nombre"
            fullWidth
            margin="normal"
            value={form.nombre}
            onChange={handleChange}
            InputProps={{
              maxLength: 30,
              readOnly: isViewMode,
              pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]*",
            }}
          />
          <TextField
            name="direccion"
            label="Dirección"
            fullWidth
            margin="normal"
            value={form.direccion}
            onChange={handleChange}
            InputProps={{
              maxLength: 30,
              readOnly: isViewMode,
              pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]*",
            }}
          />
          <TextField
            name="telefono"
            label="Teléfono"
            fullWidth
            margin="normal"
            value={form.telefono}
            onChange={handleChange}
            InputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 13,
              readOnly: isViewMode,
            }}
          />
          <TextField
            name="correo"
            label="Correo"
            fullWidth
            margin="normal"
            value={form.correo}
            onChange={handleChange}
            InputProps={{
              maxLength: 35,
              readOnly: isViewMode,
              pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]*",
            }}
          />
          <TextField
            name="nit"
            label="NIT"
            fullWidth
            margin="normal"
            value={form.nit}
            onChange={handleChange}
            InputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 8,
              readOnly: isViewMode,
            }}
          />
          <TextField
            name="environment"
            label="Ambiente"
            fullWidth
            margin="normal"
            value={form.environment}
            onChange={handleChange}
            InputProps={{
              maxLength: 30,
              readOnly: isViewMode,
              pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]*",
            }}
          />
          <TextField
            name="sector"
            label="Sector"
            fullWidth
            margin="normal"
            value={form.sector}
            onChange={handleChange}
            InputProps={{
              maxLength: 30,
              readOnly: isViewMode,
              pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]*",
            }}
          />
          <TextField
            name="description"
            label="Descripción"
            fullWidth
            margin="normal"
            value={form.description}
            onChange={handleChange}
            InputProps={{
              maxLength: 40,
              readOnly: isViewMode,
              pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]*",
            }}
          />
          <FormLabel component="legend">Estado</FormLabel>
          <RadioGroup
            name="status"
            value={form.status}
            onChange={handleChange}
            row
            disabled={isViewMode}
          >
            <FormControlLabel value="Activo" control={<Radio />} label="Activo" />
            <FormControlLabel value="Inactivo" control={<Radio />} label="Inactivo" />
          </RadioGroup>
          <TextField
            name="managerRH"
            label="Encargado RRHH"
            fullWidth
            margin="normal"
            value={form.managerRH}
            onChange={handleChange}
            InputProps={{
              maxLength: 30,
              readOnly: isViewMode,
              pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]*",
            }}
          />
          <TextField
            name="state"
            label="Departamento"
            fullWidth
            margin="normal"
            value={form.state}
            onChange={handleChange}
            InputProps={{
              maxLength: 30,
              readOnly: isViewMode,
              pattern: "[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]*",
            }}
          />
          <TextField
            name="createdAt"
            label="Fecha de Creación"
            fullWidth
            margin="normal"
            value={form.createdAt ? new Date(form.createdAt).toLocaleDateString("es-ES") : ""}
            InputProps={{ readOnly: true }}
          />
          <TextField
            name="updatedAt"
            label="Fecha de Modificación"
            fullWidth
            margin="normal"
            value={form.updatedAt ? new Date(form.updatedAt).toLocaleDateString("es-ES") : ""}
            InputProps={{ readOnly: true }}
          />
          {isViewMode ? (
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => setIsViewMode(false)}
            >
              Editar
            </Button>
          ) : (
            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
              {editingId ? "Actualizar" : "Agregar"}
            </Button>
          )}
        </Box>
      </Modal>

      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, id: null })}>
        <DialogTitle>¿Eliminar empresa?</DialogTitle>
        <DialogContent>Esta acción no se puede deshacer.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, id: null })}>Cancelar</Button>
          <Button onClick={handleDeleteConfirmed} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Footer />
    </DashboardLayout>
  );
}

export default Company;
