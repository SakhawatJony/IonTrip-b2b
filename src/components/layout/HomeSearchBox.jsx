import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import FlightTakeoffOutlined from "@mui/icons-material/FlightTakeoffOutlined";
import LocationCityOutlined from "@mui/icons-material/LocationCityOutlined";
import TravelExploreOutlined from "@mui/icons-material/TravelExploreOutlined";
import ContactPageOutlined from "@mui/icons-material/ContactPageOutlined";
import homeBg1 from "../../assets/Home/home1.png";
import FlightSearchBox from "../../pages/flight/FlightSearchBox";
import TourSearchBox from "../../pages/tour/TourSearchBox";
import HotelSearchBox from "../../pages/hotel/HotelSearchBox";
import VisaSearchBox from "../../pages/visa/VisaSearchBox";
import BalanceNoticeBar from "./BalanceNoticeBar";
import RecentSearches from "./RecentSearches";
import Promotion from "./Promotion";

const tabIconSx = { fontSize: 22, color: "inherit" };

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
          pt: { xs: 2, sm: 0 },
          pb: 4,
          px: 0,
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        {/* Banner background (fixed height) */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            minHeight: { xs: "280px", sm: "320px", md: "360px" },
            backgroundImage: `url(${homeBg1})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
          }}
        />

        <BalanceNoticeBar />

        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            px: { xs: 2, sm: 8, md: 11 },
            pt: { xs: 2, sm: 11 },
            pb: { xs: 2, sm: 5 },
            boxSizing: "border-box",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Tabs - inside white box */}
          <Box >
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
                  maxWidth: 150,
                  px: 1.5,
                  py: 0.9,
                  minHeight: "unset",
                  fontSize: 13,
                  fontWeight: 600,
                  gap: 0.75,
                  "& .MuiTab-iconWrapper": { marginRight: 0 },
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
                icon={<FlightTakeoffOutlined sx={tabIconSx} />}
                iconPosition="start"
                label="Flight"
              />
              <Tab
                icon={<LocationCityOutlined sx={tabIconSx} />}
                iconPosition="start"
                label="Hotel"
              />
              <Tab
                icon={<TravelExploreOutlined sx={tabIconSx} />}
                iconPosition="start"
                label="Tour Package"
              />
              <Tab
                icon={<ContactPageOutlined sx={tabIconSx} />}
                iconPosition="start"
                label="Visa"
              />
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
