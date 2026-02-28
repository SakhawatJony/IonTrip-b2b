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

  const formatTime = (value) => {
    if (!value) return "";
    if (value.includes("T")) {
      const time = value.split("T")[1];
      return time ? time.slice(0, 5) : value;
    }
    return value.length >= 5 ? value.slice(0, 5) : value;
  };

  const formatDate = (value) => {
    if (!value) return "";
    if (value.includes("T")) {
      const date = new Date(value);
      if (!Number.isNaN(date.valueOf())) {
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }
    return value;
  };

  const rawSegments =
    data?.segments?.go?.length
      ? data.segments.go
      : data?.AirFareData?.itineraries?.[0]?.segments || [];

  const segments = rawSegments.map((segment) => ({
    departTime: formatTime(segment.departureTime || segment.departure?.at),
    departDate: formatDate(
      segment.departureDate || segment.departureTime || segment.departure?.at
    ),
    arriveTime: formatTime(segment.arrivalTime || segment.arrival?.at),
    arriveDate: formatDate(
      segment.arrivalDate || segment.arrivalTime || segment.arrival?.at
    ),
    fromCode:
      segment.departure ||
      segment.departure?.iataCode ||
      data?.godeparture ||
      "",
    fromName: segment.departureAirport || segment.departureLocation || "",
    toCode:
      segment.arrival || segment.arrival?.iataCode || data?.goarrival || "",
    toName: segment.arrivalAirport || segment.arrivalLocation || "",
    airline:
      segment.marketingcareerName ||
      segment.operatingCarrierName ||
      data?.careerName ||
      "",
    flight: `${segment.marketingcareer || segment.carrierCode || data?.career || ""} ${segment.marketingflight || segment.number || ""}`.trim(),
    aircraft: segment.aircraft || segment.aircraft?.code || "",
    cabin: segment.class || segment.cabin || data?.cabinClass || "",
    bookingClass: segment.bookingcode ? `${segment.bookingcode} Class` : "",
    baggage: segment.bags || data?.pricebreakdown?.[0]?.CheckInBags || "",
    duration: segment.flightduration || segment.duration || data?.goflightduration || "",
    transit: segment.transit?.transit1 || "",
  }));

  const routeLabel = segments.length
    ? `${segments[0]?.fromCode || "—"} → ${segments[segments.length - 1]?.toCode || "—"}`
    : `${data?.godeparture || "—"} → ${data?.goarrival || "—"}`;

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
                {routeLabel}
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
          {segments.map((segment, i) => {
            const nextSegment = segments[i + 1];
            const layoverAirportCode = segment?.toCode || "";
            const layoverAirportName = segment?.toName || "";
            const layoverDuration = segment?.transit || "";
            return (
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
                      backgroundColor: "#E6EEF7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {data?.carrierCode || data?.career ? (
                      <Box
                        component="img"
                        src={`https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${data?.carrierCode || data?.career}.png`}
                        alt={data?.careerName || "Airline"}
                        sx={{ width: 18, height: 18 }}
                      />
                    ) : (
                      <FlightIcon sx={{ color: "#6B7A90", fontSize: 14 }} />
                    )}
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
                      Stops {segments.length - 1} /{" "}
                      {layoverAirportCode || layoverAirportName
                        ? `Layover at ${layoverAirportCode}${
                            layoverAirportName ? ` - ${layoverAirportName}` : ""
                          }${layoverDuration ? ` (${layoverDuration})` : ""}`
                        : nextSegment?.fromCode
                        ? `Layover at ${nextSegment.fromCode}${
                            nextSegment?.fromName ? ` - ${nextSegment.fromName}` : ""
                          }`
                        : layoverDuration
                        ? `Layover ${layoverDuration}`
                        : "Layover info"}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )})}
        </Box>
      )}

      {/* FARE POLICY */}
      {tab === 1 && (
        <OnewayFareDetails data={data} />
      )}
    </Box>
  );
};

export default OnewayFlightDetails;
