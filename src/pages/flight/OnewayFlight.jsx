import React, { useState } from "react";
import { Box, Button, Collapse, Grid, Typography } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightIcon from "@mui/icons-material/Flight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import OnewayFlightDetails from "./OnewayFlightDetails";

const OnewayFlight = ({ flight }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const data = flight || {
    airline: "Biman Bangladesh",
    flightNo: "BG 458 | BG 542 | BG 542",
    departTime: "23:30",
    departDate: "11 Apr, 2028",
    departCode: "DXB",
    arriveTime: "18:00",
    arriveDate: "11 Apr, 2028",
    arriveCode: "DAC",
    duration: "35h 40m",
    stops: "3 Stops",
    price: "BDT 286,121",
    seats: "6 Seat available",
    baggage: "Baggage 30KG",
    refundable: "Refundable",
  };

  const handleToggleDetails = () => {
    setDetailsOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        p: 2,
        border: "1px solid #E8EAEE",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        wrap="nowrap"
      
      >
        {/* Airline */}
        <Grid item md={2.8}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                height: 35,
                width: 35,
                borderRadius: "50%",
                backgroundColor: "#E53935",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FlightTakeoffIcon sx={{ color: "#FFFFFF", fontSize: 20 }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontSize: 13, fontWeight: 700,color:"var(--marku)" }}>
                {data.airline}
              </Typography>
              <Typography noWrap sx={{ fontSize: 11, color: "var(--sub)" }}>
                {data.flightNo}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Date */}
        <Grid item md={1.2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.4,
            }}
          >
            <FlightIcon sx={{ color: "var(--primary-color)", fontSize: 20 ,rotate:"90deg"}} />
            <Typography sx={{ fontSize: 11, color: "var(--sub)", fontWeight: 600 }}>
              {data.departDate}
            </Typography>
          </Box>
        </Grid>

        {/* Departure */}
        <Grid item md={1.2}>
          <Box textAlign="right">
            <Typography sx={{ fontSize: 19, color:"var(--primary-light)",fontWeight: 500 }}>
              {data.departTime}
            </Typography>
            <Typography sx={{ fontSize: 15, color: "var(--sub)", fontWeight: 500 ,}}>
              {data.departCode}
            </Typography>
          </Box>
        </Grid>

        {/* Timeline */}
        <Grid item md={1.4}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ px: 0.8 }}
          >
            {[0, 1, 2].map((dot) => (
              <Box
                key={dot}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: "1px solid #8FB3E0",
                  mx: 0.4,
                }}
              />
            ))}
            <Box sx={{ fontSize: 16, color: "#9AA4B2", ml: 0.4 }}>→</Box>
          </Box>
        </Grid>

        {/* Arrival */}
        <Grid item md={1.2}>
          <Box textAlign="left">
            <Typography sx={{ fontSize: 19, color:"var(--primary-light)",fontWeight: 500 }}>
              {data.arriveTime}
            </Typography>
            <Typography sx={{ fontSize: 15, color: "var(--sub)", fontWeight: 500 ,}}>
              {data.arriveCode}
            </Typography>
          </Box>
        </Grid>

        {/* Duration */}
        <Grid item md={1.1}>
          <Box textAlign="left">
            <Typography sx={{ fontSize: 13, color: "#74757C" }}>
              {data.duration}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#53555D" }}>
              {data.stops}
            </Typography>
          </Box>
        </Grid>

        {/* Price */}
        <Grid
          item
          md={3.1}
          sx={{
            borderLeft: "1px solid #E6E6E6",
          }}
        >
          <Box display="flex" alignItems="center" gap={0.5} justifyContent="flex-start">
            <Typography sx={{ fontSize: 16, fontWeight: 700,color:"var(--primary-light)" }}>
              {data.price}
            </Typography>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "#FFAF00",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <KeyboardArrowDownIcon sx={{ color: "var(--white)", fontSize: 14 }} />
            </Box>
          </Box>

          <Typography sx={{ fontSize: 12, color: "#A2A6A9", textAlign: "left" }}>
            {data.seats}
          </Typography>

          <Typography sx={{ fontSize: 12, color: "#A2A6A9", textAlign: "left" }}>
            {data.baggage}{" "}
            <Box component="span" sx={{ color: "#8DB163", fontWeight: 600 }}>
              | {data.refundable}
            </Box>
          </Typography>

          <Box display="flex" justifyContent="flex-end" width="100%" gap={1} mt={1}>
            <Button
             
              endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 10 }} />}
              onClick={handleToggleDetails}
              sx={{
                textTransform: "none",
                border: "1px solid #D0D5DD",
                fontSize: 10.5,
                height: 30,
                borderRadius: 1,
                width: "160px",
               
                color: "#344054",
                fontWeight: 600,
                backgroundColor: "#FFFFFF",
                "&:hover": { backgroundColor: "#F8FAFC", borderColor: "#D0D5DD" },
              }}
            >
              Flight Details
            </Button>
            <Button
             
              
              sx={{
                textTransform: "none",
                backgroundColor: "#0F2F56",
                color: "#fff",
                fontSize: 11,
                height: 30,
                borderRadius: 1,
                width: "100px",
               
                fontWeight: 600,
                "&:hover": { backgroundColor: "#0B2442" },
              }}
            >
              Book Now
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Collapse in={detailsOpen} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <OnewayFlightDetails data={data} />
        </Box>
      </Collapse>
    </Box>
  );
};

export default OnewayFlight;
