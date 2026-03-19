import React from "react";
import { Box, Container } from "@mui/material";
import FlightSearchBox from "../../pages/flight/FlightSearchBox";
import afterSearchBg from "../../assets/Home/home2.png";

const AfterSearchBanner = ({ initialSearchParams }) => {
  return (
    <Box
      sx={{
        py: 4,
        position: "relative",
        width: "100%",
        backgroundImage: `url(${afterSearchBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Keep content readable over the hero image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(2, 77, 175, 0.35) 0%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0.9) 100%)",
          pointerEvents: "none",
        }}
      />
      <Container maxWidth="lg">
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <FlightSearchBox initialSearchParams={initialSearchParams} />
        </Box>
      </Container>
    </Box>
  );
};

export default AfterSearchBanner;
