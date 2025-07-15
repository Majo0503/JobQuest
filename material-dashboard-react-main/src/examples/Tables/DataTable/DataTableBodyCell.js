// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

function DataTableBodyCell({ noBorder, align, children }) {
  return (
    <MDBox
      component="td"
      textAlign={align}
      py={1.5}
      px={3}
      sx={({ palette, typography, borders }) => ({
        fontSize: typography.size.sm,
        borderBottom: noBorder ? "none" : `${borders.borderWidth[1]} solid ${palette.grey[300]}`,
        color: palette.text.main,
      })}
    >
      <MDBox display="inline-block" width="max-content" sx={{ verticalAlign: "middle" }}>
        {children}
      </MDBox>
    </MDBox>
  );
}

// Default props
DataTableBodyCell.defaultProps = {
  noBorder: false,
  align: "left",
};

// Prop types
DataTableBodyCell.propTypes = {
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right", "center"]),
};

export default DataTableBodyCell;
