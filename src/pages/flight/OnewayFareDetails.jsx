import React from "react";
import { Box, Typography } from "@mui/material";

const OnewayFareDetails = () => {
  const fareRows = [
    { label: "Pax Count", adult: "02", child: "01" },
    { label: "Base Fare", adult: "54,000", child: "54,000" },
    { label: "TAX", adult: "02", child: "01" },
    { label: "Service Fee", adult: "02", child: "01" },
    { label: "Subtotal", adult: "02", child: "01" },
  ];

  const summaryRows = [
    { label: "Grand Total or Customer Total", value: "BDT 54,000" },
    { label: "Discount", value: "BDT 4,000" },
    { label: "Agent Payable", value: "BDT 50,000" },
  ];

  const notes = [
    "Cancellation charge will be: Refund Amount = Paid Amount - Airline Cancellation Fee",
    "Refund charge will be: Refund Fee = Airline's Fee + Fare Difference",
    "Re-Issue charge will be: Re-issue Fee = Airline's Fee + Fare Difference",
    "Void charge will be: Void Fee = Airline's Fee + Fare Difference",
  ];

  const rowSx = {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    alignItems: "stretch",
  };

  const leftHeaderCellSx = {
    backgroundColor: "#111827",
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: 600,
    px: 2,
    py: 1,
    borderRight: "1px solid #0F172A",
  };

  const headerCellSx = {
    backgroundColor: "#1E3A8A",
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: 600,
    px: 2,
    py: 1,
    textAlign: "center",
  };

  const leftCellSx = {
    backgroundColor: "#111827",
    color: "#FFFFFF",
    fontSize: 12,
    px: 2,
    py: 1,
    borderTop: "1px solid #1F2937",
  };

  const valueCellSx = {
    fontSize: 12,
    color: "#111827",
    px: 2,
    py: 1,
    borderTop: "1px solid #E5E7EB",
    textAlign: "center",
  };

  return (
    <Box sx={{ px: 2.5, py: 2 }}>
      <Box
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Box sx={rowSx}>
          <Box sx={leftHeaderCellSx}>Pax Type</Box>
          <Box sx={headerCellSx}>Adult</Box>
          <Box sx={headerCellSx}>Child</Box>
        </Box>

        {fareRows.map((row) => (
          <Box key={row.label} sx={rowSx}>
            <Box sx={leftCellSx}>{row.label}</Box>
            <Box sx={valueCellSx}>{row.adult}</Box>
            <Box sx={valueCellSx}>{row.child}</Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 1.5 }}>
        {summaryRows.map((row) => (
          <Box
            key={row.label}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 0.35,
            }}
          >
            <Typography fontSize={11} color="#111827">
              {row.label}
            </Typography>
            <Typography fontSize={11} color="#111827">
              {row.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 1.5, borderTop: "1px solid #E5E7EB", pt: 1.25 }}>
        {notes.map((note) => (
          <Box
            key={note}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              mt: 0.5,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: "1px solid #D1D5DB",
                mt: "2px",
                flexShrink: 0,
              }}
            />
            <Typography fontSize={10} color="#6B7280">
              {note}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OnewayFareDetails;
