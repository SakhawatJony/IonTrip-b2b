import React from "react";
import { Box, Container } from "@mui/material";
import FlightSearchBox from "../../pages/flight/FlightSearchBox";

const AfterSearchBanner = () => {
  return (
    <Box
      sx={{
        backgroundColor: "var(--primary-color)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <FlightSearchBox />
      </Container>
    </Box>
  );
};

export default AfterSearchBanner;
