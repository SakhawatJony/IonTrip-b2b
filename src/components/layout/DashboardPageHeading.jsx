import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { getDashboardBackTo, isDashboardRootPath } from "../../utils/dashboardPageMeta";

/**
 * Shared secondary-color heading bar for all dashboard routes (below DashboardNavbar).
 */
const DashboardPageHeading = ({ title, pathname }) => {
  const navigate = useNavigate();
  const backTo = getDashboardBackTo(pathname);
  const isRoot = isDashboardRootPath(pathname);

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 1.5, md: 2.5 },
        py: 1.2,
        bgcolor: "var(--secondary-color, #024DAF)",
        borderBottom: "2px solid #D1D5DB",
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      {!isRoot && (
        <IconButton
          size="small"
          onClick={() => navigate(backTo)}
          sx={{ color: "#FFFFFF" }}
          aria-label="Go back"
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <Typography
        sx={{
          fontSize: { xs: 22, md: 20 },
          fontWeight: 700,
          color: "#FFFFFF",
          pl: isRoot ? 0.5 : 0,
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default DashboardPageHeading;
