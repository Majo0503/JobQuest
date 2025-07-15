// Entrevistas.jsx – versión completa con verificación de estado de correo
import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = process.env.REACT_APP_API_URL;

export default function Entrevistas() {
  const [rows, setRows] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [comentarioModal, setComentarioModal] = useState({ open: false, userId: null });
  const [comentarioTexto, setComentarioTexto] = useState("");

  const loadEntrevistas = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/entrevista/fase`);
      const tabla = data.map((ent) => ({
        candidato: (
          <MDBox
            display="flex"
            flexDirection="column"
            lineHeight={1}
            sx={{ cursor: "pointer" }}
            onClick={() => handleOpenDetalle(ent.user_id)}
          >
            <MDTypography variant="button" fontWeight="medium">
              {ent.user_name}
            </MDTypography>
            <MDTypography variant="caption" color="text.secondary">
              {ent.user_email || "Sin correo"}
            </MDTypography>
          </MDBox>
        ),
        entrevistador: (
          <MDTypography variant="caption" fontWeight="medium">
            {ent.interviewer_name || "—"}
          </MDTypography>
        ),
        fases: (
          <MDTypography variant="caption" fontWeight="medium">
            {ent.fase_titulos?.length || 0} / 6
          </MDTypography>
        ),
        correo: (
          <span
            style={{
              background: ent.correo_enviado ? "#4caf50" : "#f44336",
              color: "#fff",
              borderRadius: 6,
              padding: "2px 6px",
              fontSize: 12,
            }}
          >
            {ent.correo_enviado ? "Enviado" : "Pendiente"}
          </span>
        ),
        action: (
          <MDBox display="flex" justifyContent="center" gap={2}>
            <MDTypography
              variant="caption"
              color="error"
              fontWeight="medium"
              sx={{ cursor: "pointer" }}
              onClick={() => setConfirmDialog({ open: true, userId: ent.user_id })}
            >
              Eliminar
            </MDTypography>
          </MDBox>
        ),
        rawData: {
          candidateName: ent.user_name,
          candidateEmail: ent.user_email,
          interviewer: ent.interviewer_name || "—",
          fases: Array.isArray(ent.fase_titulos) ? ent.fase_titulos : [],
          correoEnviado: ent.correo_enviado,
        },
      }));
      setRows(tabla);
    } catch (err) {
      console.error("Error al cargar entrevistas:", err);
    }
  };

  useEffect(() => {
    loadEntrevistas();
  }, []);

  const handleOpenDetalle = async (userId) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/entrevista/${userId}`);
      setDetalle(data);
      setOpen(true);
    } catch (err) {
      console.error("Error al obtener detalle:", err);
    }
  };
  const handleCloseDetalle = () => {
    setOpen(false);
    setDetalle(null);
  };

  const handleDownloadPDF = (rows) => {
    const doc = new jsPDF();
    doc.text("Registros - Entrevistas", 14, 15);
    const head = ["Nombre", "Correo", "Entrevistador", "Fases", "Correo Enviado"];
    const body = rows.map((r) => {
      const { candidateName, candidateEmail, interviewer, fases, correoEnviado } = r.rawData;
      return [
        candidateName,
        candidateEmail,
        interviewer,
        (fases || []).length,
        correoEnviado ? "Sí" : "No",
      ];
    });
    autoTable(doc, { head: [head], body, startY: 20, styles: { fontSize: 10, cellPadding: 3 } });
    doc.save("entrevistas.pdf");
  };

  const handleDownloadDetallePDF = () => {
    if (!detalle) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Detalle de Entrevista", 14, 15);
    doc.setFontSize(12);
    doc.text(`Nombre: ${detalle.user_name}`, 14, 25);
    doc.text(`Correo: ${detalle.user_email}`, 14, 32);
    doc.text(`Correo enviado: ${detalle.correo_enviado ? "Sí" : "No"}`, 14, 39);
    doc.text("Fases:", 14, 46);
    let y = 54;
    detalle.phases.forEach((fase, idx) => {
      doc.text(`${idx + 1}. ${fase.fase} - ${fase.titulo}`, 14, y);
      y += 6;
      fase.respuestas.forEach((r, i) => {
        const q = doc.splitTextToSize(`${i + 1}) ${r.pregunta}`, 180);
        const a = doc.splitTextToSize(`Respuesta: ${r.respuesta || "—"}`, 180);
        [...q, ...a].forEach((line) => {
          doc.text(line, 16, y);
          y += 5;
        });
        y += 2;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      y += 4;
    });
    doc.save(`detalle-${detalle.user_name}.pdf`);
  };

  const handleEnviarComentario = async () => {
    if (!detalle || !comentarioTexto.trim()) return;
    try {
      await axios.post(`${API_URL}/api/entrevista/${comentarioModal.userId}/comentario`, {
        comentario: comentarioTexto,
        correo: detalle.user_email,
        nombre: detalle.user_name,
      });
      setSnackbar({ open: true, message: "Comentario enviado", severity: "success" });
      setComentarioModal({ open: false, userId: null });
      setComentarioTexto("");
      loadEntrevistas();
      if (detalle) setDetalle({ ...detalle, correo_enviado: true });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Error al enviar comentario", severity: "error" });
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${API_URL}/api/entrevista/${confirmDialog.userId}`);
      loadEntrevistas();
      setSnackbar({ open: true, message: "Entrevista eliminada", severity: "info" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Error al eliminar", severity: "error" });
    }
    setConfirmDialog({ open: false, userId: null });
  };

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
                  Entrevistas
                </MDTypography>
                <Button variant="outlined" onClick={() => handleDownloadPDF(rows)}>
                  Descargar PDF
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Candidato", accessor: "candidato" },
                      { Header: "Entrevistador", accessor: "entrevistador" },
                      { Header: "Fases", accessor: "fases" },
                      { Header: "Correo", accessor: "correo" },
                      { Header: "Acciones", accessor: "action" },
                    ],
                    rows,
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

      {/* Modal Detalle */}
      <Modal open={open} onClose={handleCloseDetalle}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: 700 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {!detalle ? (
            <MDTypography>Cargando...</MDTypography>
          ) : (
            <>
              <MDTypography variant="h5" fontWeight="bold" mb={1}>
                {detalle.user_name}
              </MDTypography>
              <MDTypography variant="caption" color="text.secondary" mb={2}>
                {detalle.user_email}
              </MDTypography>
              <MDTypography variant="caption" mb={2} display="block">
                Correo enviado: {detalle.correo_enviado ? "Sí" : "No"}
              </MDTypography>
              {detalle.phases.map((fase, idx) => (
                <Accordion key={idx} defaultExpanded={idx === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    {" "}
                    <MDTypography fontWeight="medium">
                      {fase.fase}: {fase.titulo}
                    </MDTypography>{" "}
                  </AccordionSummary>
                  <AccordionDetails>
                    {fase.respuestas.map((r, i) => (
                      <MDBox key={i} mb={1}>
                        <MDTypography variant="button" fontWeight="bold">
                          {i + 1}. {r.pregunta}
                        </MDTypography>
                        <MDTypography variant="caption" display="block">
                          {r.respuesta || "—"}
                        </MDTypography>
                      </MDBox>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
              <MDBox display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button variant="outlined" onClick={handleDownloadDetallePDF}>
                  Descargar PDF
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={detalle.correo_enviado}
                  onClick={() => setComentarioModal({ open: true, userId: detalle.user_id })}
                >
                  Enviar Comentario
                </Button>
                <Button variant="contained" color="info" onClick={handleCloseDetalle}>
                  Cerrar
                </Button>
              </MDBox>
            </>
          )}
        </Box>
      </Modal>

      <Dialog
        open={comentarioModal.open}
        onClose={() => setComentarioModal({ open: false, userId: null })}
      >
        <DialogTitle>Comentario del administrador</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Comentario"
            value={comentarioTexto}
            onChange={(e) => setComentarioTexto(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComentarioModal({ open: false, userId: null })}>
            Cancelar
          </Button>
          <Button onClick={handleEnviarComentario} variant="contained" color="success">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, userId: null })}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>¿Estás seguro de que deseas eliminar esta entrevista?</DialogContent>
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
