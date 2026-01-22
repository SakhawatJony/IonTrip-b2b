import React from "react";
import { Box, Grid, Typography, Select, MenuItem } from "@mui/material";
import AfterSearchBanner from "../../components/layout/AfterSearchBanner";
import OnewayFlightFilter from "./OnewayFlightFilter";
import OnewayFlight from "./OnewayFlight";

const OneWaySearchResult = () => {
  const flights = Array.from({ length: 5 }).map((_, index) => ({
    id: index + 1,
  }));

  return (
    <Box>
      <Box sx={{ mt: 2 }}>
        <AfterSearchBanner />
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2.4}mt={8}>
            <OnewayFlightFilter />
          </Grid>

          <Grid item xs={12} md={9.6}>
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                mb: 2,
                flexDirection: { xs: "column", md: "row" },
                gap: 1.5,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1F1F1F" }}>
                  Dubai Int Airport (DXB) → Hazrat Shahjalal Int Airport (DAC)
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#6B6B6B" }}>
                  152 Flights found
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: 13, color: "#6B6B6B" }}>Sort By</Typography>
                <Select
                  size="small"
                  value="lowest"
                  sx={{
                    backgroundColor: "#FFFFFF",
                    fontSize: 13,
                    height: 34,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <MenuItem value="lowest">Lowest Price</MenuItem>
                  <MenuItem value="fastest">Fastest</MenuItem>
                  <MenuItem value="earliest">Earliest Departure</MenuItem>
                </Select>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {flights.map((flight) => (
                <OnewayFlight key={flight.id} />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default OneWaySearchResult;