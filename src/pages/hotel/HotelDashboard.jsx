import { Box, Typography } from "@mui/material";
import React from "react";

const HotelDashboard = () => {
  return (
    <Box sx={{ px: "30px", py: 4 }}>
      <Typography variant="h5" fontWeight={700} color="#0F172A">
        Hotel
      </Typography>
      <Typography sx={{ mt: 2, color: "#6B7280" }}>
        Hotel overview and search. Use the sidebar to open Hotel Bookings.
      </Typography>
    </Box>
  );
};

export default HotelDashboard;
