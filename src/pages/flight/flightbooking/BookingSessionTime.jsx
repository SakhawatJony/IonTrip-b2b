import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const BookingSessionTime = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        p: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Box>
        <Typography fontSize={12} color="#0F172A" fontWeight={700}>
          Time Remaining 14:30
        </Typography>
        <Typography fontSize={10} color="#64748B">
          For security reason your session will close automatically
        </Typography>
      </Box>
      <CircularProgress
        variant="determinate"
        value={70}
        size={32}
        thickness={5}
        sx={{ color: "#0F2F56" }}
      />
    </Box>
  );
};

export default BookingSessionTime;
