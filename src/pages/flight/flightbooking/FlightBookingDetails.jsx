import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FlightIcon from "@mui/icons-material/Flight";

const FlightBookingDetails = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        p: 2,
      }}
    >
      <Typography fontSize={12} color="#64748B" fontWeight={600} mb={1}>
        Flight Details
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Typography fontSize={13} fontWeight={700} color="#0F172A">
          Roundtrip Flight
        </Typography>
        <SwapHorizIcon sx={{ fontSize: 16, color: "#0F2F56" }} />
      </Box>

      <Typography fontSize={12} color="#111827" fontWeight={500}>
        DXB - Dubai Int Airport to DAC - Hazrat Shah Jalal Int Airport
      </Typography>
      <Typography fontSize={11} color="#64748B" mt={0.5}>
        Wed, 1 Apr - Sat 5 Jun / 35H 45Min
      </Typography>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: "#E11D48",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FlightIcon sx={{ color: "#FFFFFF", fontSize: 18 }} />
        </Box>
        <Box>
          <Typography fontSize={12} fontWeight={700} color="#111827">
            Biman Bangladesh
          </Typography>
          <Typography fontSize={11} color="#64748B">
            BG 458 | BG 542 | BG 542 / 2 Stops
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: "#E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 600,
            color: "#0F172A",
          }}
        >
          1
        </Box>
        <Typography fontSize={11} color="#475569">
          Passenger
        </Typography>
      </Box>
    </Box>
  );
};

export default FlightBookingDetails;
