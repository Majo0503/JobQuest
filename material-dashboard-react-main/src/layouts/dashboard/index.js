import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/dashboard/components/Projects";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import axios from "axios";
import dayjs from "dayjs";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import MDTypography from "components/MDTypography";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

const API_URL = process.env.REACT_APP_API_URL;
console.log("API URL:", API_URL); // Esto debería mostrar la URL en la consola

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  const [barData, setBarData] = useState({ labels: [], datasets: { label: "", data: [] } });
  const [empresasCount, setEmpresasCount] = useState(0);
  const [empresasPorcentaje, setEmpresasPorcentaje] = useState({
    amount: "+0%",
    color: "text",
    label: "vs ayer",
  });

  const [usuariosCount, setUsuariosCount] = useState(0);
  const [usuariosPorcentaje, setUsuariosPorcentaje] = useState({
    amount: "+0%",
    color: "text",
    label: "vs ayer",
  });

  const [entrevistasCount, setEntrevistasCount] = useState(0);
  const [entrevistasPorcentaje, setEntrevistasPorcentaje] = useState({
    amount: "+0%",
    color: "text",
    label: "vs ayer",
  });

  const [rolesCount, setRolesCount] = useState({ admin: 0, cliente: 0, entrevistador: 0 });

  const [homeAccessChart, setHomeAccessChart] = useState({
    labels: [],
    datasets: { label: "", data: [] },
  });

  const COLORS = ["#1A73E8", "#4CAF50", "#FF9800"]; // info, success, warning

  const dataRoles = [
    { name: "Administradores", value: rolesCount.admin },
    { name: "Clientes", value: rolesCount.cliente },
    { name: "Entrevistadores", value: rolesCount.entrevistador },
  ];
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const filteredUsers = users.filter((user) => {
      const text = searchText.toLowerCase();
      return (
        user.nombre?.toLowerCase().includes(text) ||
        user.correo?.toLowerCase().includes(text) ||
        user.rol?.toLowerCase().includes(text)
      );
    });

    // Usa filteredUsers para el conteo:
    filteredUsers.forEach((user) => {
      switch (user.rol) {
        case "admin":
          conteo.admin++;
          break;
        case "cliente":
          conteo.cliente++;
          break;
        case "entrevistador":
          conteo.entrevistador++;
          break;
        default:
          break;
      }
    });
    const onSearchChange = (event) => {
      setSearchTerm(event.target.value);
      // Si quieres buscar o filtrar, lo haces aquí
    };
    const loadEntrevistas = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/entrevista/fase`);
        const data = res.data;

        const weeks = {};
        data.forEach((ent) => {
          const fecha = dayjs(ent.created_at || ent.fecha_creacion);
          const clave = `${fecha.year()}-W${fecha.isoWeek()}`;
          weeks[clave] = (weeks[clave] || 0) + 1;
        });

        const sorted = Object.entries(weeks)
          .sort(([a], [b]) => (a > b ? 1 : -1))
          .slice(-8);
        const labels = sorted.map(([k]) => k);
        const values = sorted.map(([, v]) => v);

        setBarData({ labels, datasets: { label: "Entrevistas", data: values } });
      } catch (err) {
        console.error("Error cargando entrevistas:", err);
      }
    };

    const loadEmpresas = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/empresas`);
        const empresas = res.data?.empresas || [];

        setEmpresasCount(empresas.length);

        const today = dayjs().startOf("day");
        const yesterday = today.subtract(1, "day");

        let countToday = 0;
        let countYesterday = 0;

        empresas.forEach((emp) => {
          const fecha = dayjs(emp.fecha_creacion || emp.created_at);
          if (fecha.isSame(today, "day")) countToday += 1;
          else if (fecha.isSame(yesterday, "day")) countYesterday += 1;
        });

        const difference = countToday - countYesterday;
        const percentage =
          countYesterday === 0 ? 100 : Math.round((difference / countYesterday) * 100);

        setEmpresasPorcentaje({
          amount: `${difference >= 0 ? "+" : ""}${percentage}%`,
          color: difference >= 0 ? "success" : "error",
          label: "vs ayer",
        });
      } catch (err) {
        console.error("Error al cargar empresas:", err);
      }
    };

    const loadUsuarios = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users`);
        const users = res.data?.users || [];

        setUsuariosCount(users.length);

        const today = dayjs().startOf("day");
        const yesterday = today.subtract(1, "day");

        let countToday = 0;
        let countYesterday = 0;

        users.forEach((user) => {
          const fecha = dayjs(user.fecha_creacion || user.created_at);
          if (fecha.isSame(today, "day")) countToday += 1;
          else if (fecha.isSame(yesterday, "day")) countYesterday += 1;
        });

        const difference = countToday - countYesterday;
        const percentage =
          countYesterday === 0 ? 100 : Math.round((difference / countYesterday) * 100);

        setUsuariosPorcentaje({
          amount: `${difference >= 0 ? "+" : ""}${percentage}%`,
          color: difference >= 0 ? "success" : "error",
          label: "vs ayer",
        });
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      }
    };

    const loadResumenEntrevistas = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/entrevista/fase`);
        const entrevistas = res.data;

        setEntrevistasCount(entrevistas.length);

        const today = dayjs().startOf("day");
        const yesterday = today.subtract(1, "day");

        let countToday = 0;
        let countYesterday = 0;

        entrevistas.forEach((e) => {
          const fecha = dayjs(e.fecha_creacion || e.created_at);
          if (fecha.isSame(today, "day")) countToday += 1;
          else if (fecha.isSame(yesterday, "day")) countYesterday += 1;
        });

        const difference = countToday - countYesterday;
        const percentage =
          countYesterday === 0 ? 100 : Math.round((difference / countYesterday) * 100);

        setEntrevistasPorcentaje({
          amount: `${difference >= 0 ? "+" : ""}${percentage}%`,
          color: difference >= 0 ? "success" : "error",
          label: "vs ayer",
        });
      } catch (err) {
        console.error("Error al cargar entrevistas:", err);
      }
    };

    const loadRoles = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users`);
        const users = res.data?.users || [];

        const conteo = { admin: 0, cliente: 0, entrevistador: 0 };

        users.forEach((user) => {
          switch (user.rol) {
            case "admin":
              conteo.admin++;
              break;
            case "cliente":
              conteo.cliente++;
              break;
            case "entrevistador":
              conteo.entrevistador++;
              break;
            default:
              break;
          }
        });

        setRolesCount(conteo);
      } catch (err) {
        console.error("Error cargando roles:", err);
      }
    };

    const loadHomeAccessStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/accesos/home`);
        const data = res.data;

        const days = {};
        data.forEach((access) => {
          const fecha = dayjs(access.fecha_acceso).format("YYYY-MM-DD");
          days[fecha] = (days[fecha] || 0) + 1;
        });

        const sorted = Object.entries(days)
          .sort(([a], [b]) => (a > b ? 1 : -1))
          .slice(-7);
        const labels = sorted.map(([fecha]) => fecha);
        const values = sorted.map(([, cantidad]) => cantidad);

        setHomeAccessChart({
          labels,
          datasets: {
            label: "Visitas al Home",
            data: values,
          },
        });
      } catch (err) {
        console.error("Error cargando accesos al home:", err);
      }
    };

    loadEntrevistas();
    loadEmpresas();
    loadUsuarios();
    loadResumenEntrevistas();
    loadHomeAccessStats();
    loadRoles();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar onSearchChange={setSearchText} />
      <MDBox py={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Empresas registradas"
                count={empresasCount}
                percentage={empresasPorcentaje}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Usuarios registrados"
                count={usuariosCount}
                percentage={usuariosPorcentaje}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="assignment"
                title="Entrevistas registradas"
                count={entrevistasCount}
                percentage={entrevistasPorcentaje}
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Ingresos al Home"
                  description={<>({homeAccessChart.datasets.data.slice(-1)[0] || 0}) accesos hoy</>}
                  date={`Actualizado: ${dayjs().format("DD/MM/YYYY")}`}
                  chart={homeAccessChart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} lg={6}>
              <MDBox
                mb={3}
                p={2}
                sx={{ backgroundColor: "white", borderRadius: "xl", boxShadow: 3 }}
              >
                <MDTypography variant="h6" mb={2}>
                  Distribución por rol
                </MDTypography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={dataRoles}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {dataRoles.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
