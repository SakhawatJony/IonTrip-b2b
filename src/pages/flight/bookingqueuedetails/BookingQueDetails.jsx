import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import BookingQueDetailsCard from "./BookingQueDetailsCard";
import BookingQuePassengerList from "./BookingQuePassengerList";
import BookingQueFareDetails from "./BookingQueFareDetails";
import BookingQueSupport from "./BookingQueSupport";
import BookingQueSessionTime from "./BookingQueSessionTime";

const BookingQueDetails = () => {
  return (
    <Box sx={{ minHeight: "100vh", px: 9.5, py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <BookingQueDetailsCard />

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography fontSize={14} fontWeight={700} color="#111827">
                  Passenger Details
                </Typography>
                <Button
                  sx={{
                    height: 32,
                    px: 2,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "none",
                    backgroundColor: "#E11D48",
                    color: "#FFFFFF",
                    "&:hover": { backgroundColor: "#BE123C" },
                  }}
                >
                  Upload Passenger Document
                </Button>
              </Box>
              <BookingQuePassengerList />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <BookingQueFareDetails />
            <BookingQueSupport />
            <BookingQueSessionTime />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingQueDetails;
