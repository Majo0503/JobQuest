import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

import breakpoints from "assets/theme/base/breakpoints";

import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";

function Header({ children, userId }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [userName, setUserName] = useState("Cargando...");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    function handleTabsOrientation() {
      window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }
    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, []);

  useEffect(() => {
    if (!userId) {
      setUserName("Invitado");
      setUserRole("");
      return;
    }
    // Reemplaza localhost:5000 si usas otro host/puerto
    fetch(`https://jobquest-production.up.railway.app/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo obtener el usuario");
        return res.json();
      })
      .then((data) => {
        setUserName(data.nombre || "Usuario");
        setUserRole(data.rol || "");
      })
      .catch(() => {
        setUserName("Usuario");
        setUserRole("");
      });
  }, [userId]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card sx={{ position: "relative", mt: -8, mx: 3, py: 2, px: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar src={burceMars} alt="profile-image" size="xl" shadow="sm" />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {userName}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {userRole}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Menú"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      home
                    </Icon>
                  }
                />
                <Tab
                  label="Mensajes"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      email
                    </Icon>
                  }
                />
                <Tab
                  label="Ajustes"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      settings
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

Header.defaultProps = {
  children: "",
  userId: null,
};

Header.propTypes = {
  children: PropTypes.node,
  userId: PropTypes.string,
};

export default Header;
