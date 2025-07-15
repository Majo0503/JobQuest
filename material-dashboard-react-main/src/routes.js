import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Profile from "layouts/profile";
import Company from "layouts/company";
import Icon from "@mui/material/Icon";
import Entrevista from "layouts/Entrevista";

const routes = [
  {
    type: "collapse",
    name: "Menú Principal",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/menu",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Clientes",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/clientes",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Entrevista",
    key: "entrevista",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/entrevistas",
    component: <Entrevista />,
  },
  {
    type: "collapse",
    name: "Empresas",
    key: "company",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/empresas",
    component: <Company />,
  },
  {
    type: "collapse",
    name: "Perfil",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/perfil",
    component: <Profile />,
  },
];

export default routes;
