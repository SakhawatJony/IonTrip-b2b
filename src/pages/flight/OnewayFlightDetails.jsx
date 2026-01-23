import React, { useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Divider,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import OnewayFareDetails from "./OnewayFareDetails";

const OnewayFlightDetails = ({ data }) => {
  const [tab, setTab] = useState(0);
  const bulletRowSx = {
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    pl: 1,
  };
  const bulletDotSx = {
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: "#D1D5DB",
    flexShrink: 0,
    mt: "4px",
  };
  const segments = [
    {
      departTime: "23:30",
      departDate: "11 Apr, 2028",
      arriveTime: "23:30",
      arriveDate: "11 Apr, 2028",
      fromCode: "DAC",
      fromName:
        "Hazrat Sha Jalal Intl Airport, Dhaka, Bangladesh",
      toCode: "BOM",
      toName: "Chhatropati Shivaji Intl Airport, Mumbai, india",
      airline: "Biman Bangladesh",
      flight: "BG 456",
      aircraft: "Boeing 777-365",
      cabin: "Economy",
      bookingClass: "W Class",
      baggage: "45 KG",
      duration: "45H 35Min",
    },
    {
      departTime: "23:30",
      departDate: "11 Apr, 2028",
      arriveTime: "23:30",
      arriveDate: "11 Apr, 2028",
      fromCode: "DAC",
      fromName:
        "Hazrat Sha Jalal Intl Airport, Dhaka, Bangladesh",
      toCode: "BOM",
      toName: "Chhatropati Shivaji Intl Airport, Mumbai, india",
      airline: "Biman Bangladesh",
      flight: "BG 456",
      aircraft: "Boeing 777-365",
      cabin: "Economy",
      bookingClass: "W Class",
      baggage: "45 KG",
      duration: "45H 35Min",
    },
  ];

  return (
    <Box
      sx={{
        // border: "1px solid #E5E7EB",
        borderRadius: 2,
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        variant="fullWidth"
        sx={{
          minHeight: 52,
          borderTop: "2px solid #D9D9D9",
          borderBottom: "2px solid #D9D9D9",
        
         
          "& .MuiTabs-indicator": {
            backgroundColor: "var(--primary-color)",
            height: 2,
          },
          "& .MuiTab-root": {
            borderRight: "2px solid #D9D9D9",
            minHeight: 52,
          },
          "& .MuiTab-root:last-of-type": {
            borderRight: "none",
          },
        }}
      >
        <Tab
          disableRipple
          sx={{ alignItems: "flex-start", textTransform: "none" }}
          label={
            <Box>
              <Typography fontSize={10} color="#6B7280">
                Departure
              </Typography>
              <Typography fontSize={13} fontWeight={600} color="#111827">
                DXB → DAC
              </Typography>
            </Box>
          }
        />
        <Tab
          disableRipple
          sx={{ alignItems: "flex-start", textTransform: "none" }}
          label={
            <Box>
              <Typography fontSize={10} color="#6B7280">
                Fare Details &
              </Typography>
              <Typography fontSize={13} fontWeight={600} color="#111827">
                Fare Policy
              </Typography>
            </Box>
          }
        />
      </Tabs>

      {/* FLIGHT DETAILS */}
      {tab === 0 && (
        <Box sx={{ px: 2.5, py: 2 }}>
          {/* SEGMENT */}
          {segments.map((segment, i) => (
            <Box key={`${segment.flight}-${i}`}>
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* Timeline */}
                <Box
                  sx={{
                    width: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "#EF4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FlightIcon sx={{ color: "#fff", fontSize: 14 }} />
                  </Box>

                
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, pb: i < segments.length - 1 ? 2 : 0 }}>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Typography fontSize={13} fontWeight={600}>
                      {segment.departTime}
                    </Typography>
                    <Typography fontSize={11} color="#6B7280">
                      {segment.departDate}
                    </Typography>
                    <Typography fontSize={12} color="#6B7280">
                      →
                    </Typography>
                    <Typography fontSize={13} fontWeight={600}>
                      {segment.arriveTime}
                    </Typography>
                    <Typography fontSize={11} color="#6B7280">
                      {segment.arriveDate}
                    </Typography>
                  </Box>

                  <Box sx={{ ...bulletRowSx, mt: 0.75 }}>
                    <Box sx={bulletDotSx} />
                    <Typography fontSize={11} color="#6B7280">
                      {segment.fromCode} - {segment.fromName} to{" "}
                      {segment.toCode} - {segment.toName}
                    </Typography>
                  </Box>

                  <Box sx={{ ...bulletRowSx, mt: 0.75 }}>
                    <Box sx={bulletDotSx} />
                    <Typography fontSize={11} color="#6B7280">
                      {segment.airline} - {segment.flight} /{" "}
                      {segment.aircraft} · Duration: {segment.duration}
                    </Typography>
                  </Box>

                  <Box sx={{ ...bulletRowSx, mt: 0.75 }}>
                    <Box sx={bulletDotSx} />
                    <Typography fontSize={11} color="#6B7280">
                      {segment.cabin} / {segment.bookingClass} · Baggage{" "}
                      {segment.baggage}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {i < segments.length - 1 && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "40px 1fr",
                    alignItems: "center",
                    mt: 0.5,
                    mb: 1.5,
                  }}
                >
                  <Box />
                  <Box sx={{ ...bulletRowSx, mt: 0.1 }}>
                    <Box
                      sx={{
                        ...bulletDotSx,
                        backgroundColor: "var(--primary-color)",
                      }}
                    />
                    <Typography fontSize={11} color="#6B7280">
                      Stops 1 / Layover 45H 50Min
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* FARE POLICY */}
      {tab === 1 && (
        <OnewayFareDetails />
      )}
    </Box>
  );
};

export default OnewayFlightDetails;
