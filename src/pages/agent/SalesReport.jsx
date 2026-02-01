import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const headerTitleSx = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
};

const headerSubtitleSx = {
  fontSize: 12,
  color: "#94A3B8",
  mt: 0.4,
};

const cardSx = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: 1.5,
  px: { xs: 2, md: 3 },
  py: { xs: 2, md: 2.5 },
  transition: "background-color 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "#FFF1F2",
  },
};

const rowSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "200px 1fr" },
  gap: { xs: 0.5, sm: 3 },
  alignItems: "center",
  py: 1.4,
  borderBottom: "1px solid #E5E7EB",
};

const labelSx = {
  fontSize: 12.5,
  color: "#9CA3AF",
};

const valueSx = {
  fontSize: 13.5,
  color: "#111827",
};

const totalSx = {
  fontSize: 12.5,
  fontWeight: 600,
  color: "#0F2F56",
};

const salesCards = [
  {
    date: "21 May 2022, Monday",
    total: "BDT45,000",
    rows: [
      {
        label: "Air Ticket",
        value:
          "Agent Cost: BDT 5000 || Agent Cost with Markup: BDT 5000 || Profit Amount : BDT 50000",
      },
      {
        label: "Hotel",
        value:
          "Agent Cost: BDT 5000 || Agent Cost with Markup: BDT 5000 || Profit Amount : BDT 50000",
      },
    ],
  },
];

const SalesReport = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        px: { xs: 2, md: 9.5 },
        my: "30px",
        mx: "80px",
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography sx={headerTitleSx}>Sales Report</Typography>
          <Typography sx={headerSubtitleSx}>
            Basic info, for a faster booking experience
          </Typography>
        </Box>

        <IconButton
          sx={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            backgroundColor: "#0F2F56",
            color: "#FFFFFF",
            "&:hover": { backgroundColor: "#0B2442" },
          }}
        >
          <SearchOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {salesCards.map((card, index) => (
          <Box key={`sales-${index}`} sx={cardSx}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Typography fontSize={15} fontWeight={700} color="#0F2F56">
                {card.date}
              </Typography>
              <Typography sx={totalSx}>Total Profit: {card.total}</Typography>
            </Box>
            <Box>
              {card.rows.map((row) => (
                <Box key={row.label} sx={rowSx}>
                  <Typography sx={labelSx}>{row.label}</Typography>
                  <Typography sx={valueSx}>{row.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SalesReport;
