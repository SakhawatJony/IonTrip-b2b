import React, { useState } from "react";
import { Box, Tabs, Tab, useTheme, Typography } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import HotelIcon from "@mui/icons-material/Hotel";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import FlightSearchBox from "../../pages/flight/FlightSearchBox";
import TourSearchBox from "../../pages/tour/TourSearchBox";
import HotelSearchBox from "../../pages/hotel/HotelSearchBox";
import RecentSearches from "./RecentSearches";
import Promotion from "./Promotion";

const HomeSearchBox = () => {
  const [tabValue, setTabValue] = useState(0);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);

  // Passenger state management
  const [counts, setCounts] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [tripType, setTripType] = useState("one-way");
  const [travelClass, setTravelClass] = useState("economy");
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        // maxWidth: 1120,
        mx: "auto"
      }}
    >
      {/* White card */}
      <Box
        sx={{
          
          borderRadius: 2,
          minHeight: "200px",
          // border: "1px solid #E3E8F0",
          // boxShadow: "0 12px 35px rgba(15, 35, 52, 0.12)",
          // pt: 6,
        
         
        }}
      >
        {tabValue === 0 && (
          <Box sx={{ width: "100%" }}>
            <FlightSearchBox tripType={tripType} onTripTypeChange={setTripType} />
          </Box>
        )}
        {tabValue === 1 && (
          <Box sx={{ width: "100%" }}>
            <HotelSearchBox />
          </Box>
        )}
        {tabValue === 2 && (
          <Box sx={{ width: "100%" }}>
            <TourSearchBox />
          </Box>
        )}
      </Box>

      {/* Top tabs overlapping the card */}
      <Box
        sx={{
          position: "absolute",
          top: "-2.5%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          // textColor="inherit"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            minHeight: "unset",
            "& .MuiTab-root": {
              textTransform: "capitalize",
              borderRadius: "10px 10px 0 0",
              overflow: "auto",
              minWidth: "150px",
              py: 1.2,
              minHeight: "unset",
              mr: 0.75,
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: "var(--primary-color) !important",
              color: "var(--white)",
            },
            "& .MuiTab-root.Mui-selected": {
              backgroundColor: "var(--white) !important",
              color: "var(--primary-color)",
              minWidth: "150px",
            },
          }}
        >
          <Tab
            icon={<FlightTakeoffIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="Book Flight"
          />
          <Tab
            icon={<HotelIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="Hotel"
          />
          <Tab
            icon={<TravelExploreIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="Tour Package"
          />
          <Tab
            icon={<CreditCardIcon sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="Visa"
          />
        </Tabs>
      </Box>

      {/* Recent Searches Section */}
      <RecentSearches />

      {/* Promotion Slider */}
      <Promotion />
    </Box>
  );
};

export default HomeSearchBox;
