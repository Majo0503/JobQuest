/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

// @mui material components
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Este archivo ahora exporta una función que recibe datos dinámicos:
export default function data(companies = []) {
  const avatars = (members = []) =>
    members.map(({ id, image, name }) => (
      <Tooltip key={id} title={name} placement="bottom">
        <MDAvatar
          src={image || "/default-avatar.jpg"}
          alt={name}
          size="xs"
          sx={{
            border: ({ borders: { borderWidth }, palette: { white } }) =>
              `${borderWidth[2]} solid ${white.main}`,
            cursor: "pointer",
            position: "relative",
            "&:not(:first-of-type)": {
              ml: -1.25,
            },
            "&:hover, &:focus": {
              zIndex: "10",
            },
          }}
        />
      </Tooltip>
    ));

  const Company = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image || "/default-logo.png"} name={name} size="sm" />
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "companies", accessor: "companies", width: "45%", align: "left" },
      { Header: "members", accessor: "members", width: "10%", align: "left" },
      { Header: "budget", accessor: "budget", align: "center" },
      { Header: "completion", accessor: "completion", align: "center" },
    ],

    rows: companies.map((company) => ({
      companies: <Company image={company.logo || "/default-logo.png"} name={company.nombre} />,
      members: (
        <MDBox display="flex" py={1}>
          {avatars(
            (company.members || []).map((member) => ({
              id: member._id,
              name: member.nombre,
              image: member.image || "/default-avatar.jpg",
            }))
          )}
        </MDBox>
      ),
      budget: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {company.budget ? `$${company.budget}` : "Not set"}
        </MDTypography>
      ),
      completion: (
        <MDBox width="8rem" textAlign="center">
          <MDProgress
            value={company.completion || 0}
            color={company.completion === 100 ? "success" : "info"}
            variant="gradient"
            label={false}
          />
        </MDBox>
      ),
    })),
  };
}
