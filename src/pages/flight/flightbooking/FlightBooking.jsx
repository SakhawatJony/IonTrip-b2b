import React from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import FlightPassenger from "./FlightPassenger";
import FlightBookingDetails from "./FlightBookingDetails";
import FlightBookingFareDetails from "./FlightBookingFareDetails";
import Support from "./Support";
import BookingSessionTime from "./BookingSessionTime";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 38,
    backgroundColor: "#FFFFFF",
  },
};

const FlightBooking = () => {
  return (
    <Box sx={{  minHeight: "100vh", px:9.5,py:4 }}>
      <Typography fontSize={17} fontWeight={700} color="#222222" mb={2}>
        Enter Passenger Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[1, 2, 3].map((index) => (
              <FlightPassenger key={index} index={index} type="Adult" />
            ))}

            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: 1.5,
                border: "1px solid #E5E7EB",
                p: 2,
              }}
            >
              <Typography fontSize={13} fontWeight={600} mb={2} color="#111827">
                Passenger Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    placeholder="First Name"
                    size="small"
                    fullWidth
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    placeholder="Last Name"
                    size="small"
                    fullWidth
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FlightBookingDetails />
            <FlightBookingFareDetails />
            <Support />
            <BookingSessionTime />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button
          fullWidth
          sx={{
            height: 46,
            backgroundColor: "#0F2F56",
            color: "#FFFFFF",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { backgroundColor: "#0B2442" },
          }}
        >
          Book This Flight
        </Button>
      </Box>
    </Box>
  );
};

export default FlightBooking;
