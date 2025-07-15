import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// MUI Theme
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// RTL
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";

// Themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// Dashboard
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator, setLayout } from "context";

// Layout público
import PublicLayout from "layouts/PublicLayout";
import Home from "pages/Home";
import Conocenos from "pages/Conocenos";
import About from "pages/About";
import BlogDetail from "pages/BlogDetail";
import Contact from "pages/Contact";
import Entrevistas from "pages/Entrevistas";
import Equipo from "pages/Equipo";
import PreguntasFrecuentes from "pages/Faq";
import EntrevistaFases from "pages/EntrevistaFases";
import GuiaUso from "pages/GuiaUso";
import ResetPassword from "pages/ResetPassword";
import Servicios from "pages/Servicios";
import Login from "pages/Login";

// Imágenes
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

// Botón de Configurador
import MDBox from "components/MDBox";
import Icon from "@mui/material/Icon";
import Perfil from "pages/Perfil";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  // ✅ Activar layout "dashboard" solo en rutas exactas
  useEffect(() => {
    const dashboardPaths = ["/menu", "/clientes", "/empresas", "/entrevistas", "/perfil"];
    const isDashboardPath = dashboardPaths.some((path) => pathname.startsWith(path));
    setLayout(dispatch, isDashboardPath ? "dashboard" : "public");
  }, [pathname, dispatch]);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) =>
      route.route ? <Route key={route.key} path={route.route} element={route.component} /> : null
    );

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  const themeSetup =
    direction === "rtl" && rtlCache
      ? { ThemeProvider, theme: darkMode ? themeDarkRTL : themeRTL, CacheProvider, cache: rtlCache }
      : { ThemeProvider, theme: darkMode ? themeDark : theme };

  const renderApp = (
    <Routes>
      {getRoutes(routes)}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="conocenos" element={<Conocenos />} />
        <Route path="about" element={<About />} />
        <Route path="blogdetail" element={<BlogDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="entrevistas" element={<Entrevistas />} />
        <Route path="equipo" element={<Equipo />} />
        <Route path="preguntas-frecuentes" element={<PreguntasFrecuentes />} />
        <Route path="fases" element={<EntrevistaFases />} />
        <Route path="guia-uso" element={<GuiaUso />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="servicios" element={<Servicios />} />
        <Route path="login" element={<Login />} />
        <Route path="user" element={<Perfil />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );

  return themeSetup.CacheProvider ? (
    <themeSetup.CacheProvider value={themeSetup.cache}>
      <themeSetup.ThemeProvider theme={themeSetup.theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="JobQuest"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {renderApp}
      </themeSetup.ThemeProvider>
    </themeSetup.CacheProvider>
  ) : (
    <themeSetup.ThemeProvider theme={themeSetup.theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="JobQuest"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {renderApp}
    </themeSetup.ThemeProvider>
  );
}
