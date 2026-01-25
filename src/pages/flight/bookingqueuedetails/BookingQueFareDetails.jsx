import React from "react";
import { Box, Divider, Typography } from "@mui/material";

const rows = [
  { label: "Traveler 1 : Adult", value: "55,400.00" },
  { label: "Traveler 1 : Child", value: "55,400.00" },
  { label: "Traveler 1 : Infant", value: "55,400.00" },
];

const summaryRows = [
  { label: "Total Base Fare", value: "55,400.00" },
  { label: "Total Tax & Fee", value: "55,400.00" },
  { label: "Discount", value: "55,400.00" },
];

const BookingQueFareDetails = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography fontSize={12} color="#64748B" fontWeight={600}>
          Fare Breakdown
        </Typography>
        <Typography fontSize={11} color="#64748B">
          Price as shown in BDT
        </Typography>
      </Box>

      {rows.map((row) => (
        <Box
          key={row.label}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 0.35,
          }}
        >
          <Typography fontSize={11} color="#475569">
            {row.label}
          </Typography>
          <Typography fontSize={11} color="#0F172A" fontWeight={600}>
            {row.value}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 1 }} />

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
          <Typography fontSize={11} color="#475569">
            {row.label}
          </Typography>
          <Typography fontSize={11} color="#0F172A" fontWeight={600}>
            {row.value}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography fontSize={12} fontWeight={700} color="#0F172A">
          Grand Total
        </Typography>
        <Typography fontSize={12} fontWeight={700} color="#0F2F56">
          55,400.00
        </Typography>
      </Box>
    </Box>
  );
};

export default BookingQueFareDetails;
