import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import homeBg1 from "../../assets/Home/home2.png";
import {
  FlightTabIcon,
  HotelTabIcon,
  TourTabIcon,
  VisaTabIcon,
} from "../icons/TravelTabIcons";
import FlightSearchBox from "../../pages/flight/FlightSearchBox";
import TourSearchBox from "../../pages/tour/TourSearchBox";
import HotelSearchBox from "../../pages/hotel/HotelSearchBox";
import VisaSearchBox from "../../pages/visa/VisaSearchBox";
import BalanceNoticeBar from "./BalanceNoticeBar";
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

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* Full-width hero background; padding only on inner content */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          pt: 3,
          pb: 4,
          px: 0,
          backgroundImage: `url(${homeBg1})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        <BalanceNoticeBar />



        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            px: { xs: 2, sm: "30px" },
            boxSizing: "border-box",
          }}
        >
          {/* Tabs - inside white box */}
          <Box sx={{ px: 0.5, pt: 1.5 }}>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                minHeight: "unset",
                width: "100%",
                "& .MuiTabs-flexContainer": {
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 0.5,
                },
                "& .MuiTab-root": {
                  textTransform: "capitalize",
                  borderRadius: "10px 10px 0 0",
                  minWidth: "unset",
                  flex: "1 1 0",
                  maxWidth: 180,
                  px: 1.5,
                  py: 0.5,
                  minHeight: "unset",
                  fontSize: 13,
                  fontWeight: 600,
                  gap: 1,
                  backgroundColor: "var(--primary-color) !important",
                  color: "var(--white)",
                  borderRight: "1px solid rgba(255,255,255,0.28)",
                  "&:last-of-type": { borderRight: "none" },
                },
                "& .MuiTab-root.Mui-selected": {
                  backgroundColor: "var(--white) !important",
                  color: "var(--primary-color)",
                  borderRight: "1px solid rgba(15, 23, 42, 0.08)",
                  "&:last-of-type": { borderRight: "none" },
                },
              }}
            >
              <Tab
                icon={<FlightTabIcon />}
                iconPosition="start"
                label="Flight"
              />
              <Tab icon={<HotelTabIcon />} iconPosition="start" label="Hotel" />
              <Tab
                icon={<TourTabIcon />}
                iconPosition="start"
                label="Tour Package"
              />
              <Tab icon={<VisaTabIcon />} iconPosition="start" label="Visa" />
            </Tabs>
          </Box>

          {/* Search content */}
          <Box sx={{ minHeight: "200px",   }}>
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
            {tabValue === 3 && (
              <Box sx={{ width: "100%" }}>
                <VisaSearchBox />
              </Box>
            )}
          </Box>

        </Box>
        <RecentSearches/>
      </Box>

      <Box
        sx={{
          width: "100%",
        
          boxSizing: "border-box",
        }}
      >
        {/* <RecentSearches /> */}
        <Promotion />
      </Box>
    </Box>
  );
};

export default HomeSearchBox;
