import React, { useEffect, useState } from "react";
import { Box, Divider, Typography, IconButton } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FlightIcon from "@mui/icons-material/Flight";

const toTitleCase = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const FlightBookingDetails = ({ data }) => {
  const goSegments = data?.segments?.go || [];
  const backSegments = data?.segments?.back || [];
  const firstSegment = goSegments[0] || {};
  const lastSegment = goSegments[goSegments.length - 1] || firstSegment;
  
  // Outbound (Go) route information
  const routeFromCode = firstSegment?.departure || data?.godeparture || "N/A";
  const routeToCode = lastSegment?.arrival || data?.goarrival || "N/A";
  const routeFromAirport =
    firstSegment?.departureAirport || data?.departureAirport || "Departure Airport";
  const routeToAirport =
    lastSegment?.arrivalAirport || data?.arrivalAirport || "Arrival Airport";
  const routeLine = `${routeFromCode} - ${routeFromAirport} to ${routeToCode} - ${routeToAirport}`;

  const departDate = data?.godepartureDate || "";
  const arrivalDate = data?.goarrivalDate || "";
  const duration =
    data?.goflightduration ||
    firstSegment?.flightduration ||
    "Duration unavailable";
  const dateLine = `${departDate}${arrivalDate ? ` - ${arrivalDate}` : ""} / ${duration}`;

  // Return (Back) route information for round-way trips
  const firstBackSegment = backSegments[0] || {};
  const lastBackSegment = backSegments[backSegments.length - 1] || firstBackSegment;
  const backRouteFromCode = firstBackSegment?.departure || data?.backdeparture || "N/A";
  const backRouteToCode = lastBackSegment?.arrival || data?.backarrival || "N/A";
  const backRouteFromAirport =
    firstBackSegment?.departureAirport || "Departure Airport";
  const backRouteToAirport =
    lastBackSegment?.arrivalAirport || "Arrival Airport";
  const backRouteLine = `${backRouteFromCode} - ${backRouteFromAirport} to ${backRouteToCode} - ${backRouteToAirport}`;

  const backDepartDate = data?.backdepartureDate || "";
  const backArrivalDate = data?.backarrivalDate || "";
  const backDuration =
    data?.backflightduration ||
    firstBackSegment?.flightduration ||
    "Duration unavailable";
  const backDateLine = `${backDepartDate}${backArrivalDate ? ` - ${backArrivalDate}` : ""} / ${backDuration}`;

  const tripTypeRaw = String(data?.triptype || "oneway").toLowerCase();
  const tripTypeLabel =
    tripTypeRaw === "roundway" ? "Round Trip Flight" : "One Way Flight";
  const isRoundTrip = tripTypeRaw === "roundway" || tripTypeRaw === "roundtrip";
  
  // State to track which segment is being displayed (default: "go" for outbound)
  const [showBackSegment, setShowBackSegment] = useState(false);

  // Determine which segment to use for airline info based on toggle state
  const activeSegment = showBackSegment && isRoundTrip && backSegments.length > 0 
    ? firstBackSegment 
    : firstSegment;
  
  // Airline information - use active segment
  const airlineName =
    data?.careerName ||
    activeSegment?.marketingcareerName ||
    activeSegment?.operatingCarrierName ||
    "Airline";
  const formattedAirlineName = toTitleCase(airlineName);
  const carrierCode =
    data?.carrierCode ||
    data?.career ||
    activeSegment?.marketingcareer ||
    activeSegment?.operatingcareer ||
    "";
  const logoUrl = carrierCode
    ? `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${carrierCode}.png`
    : "";
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);

  useEffect(() => {
    setLogoLoadFailed(false);
  }, [logoUrl]);

  // Reset to show "go" segment when data changes
  useEffect(() => {
    setShowBackSegment(false);
  }, [data]);
  
  // Outbound flight codes
  const flightCodes = goSegments
    .map((seg) => `${seg?.marketingcareer || ""} ${seg?.marketingflight || ""}`.trim())
    .filter(Boolean)
    .join(" | ");
  const stopsCount = Math.max(goSegments.length - 1, 0);
  const airlineLine = `${flightCodes || "Flight"} / ${stopsCount} ${
    stopsCount === 1 ? "Stop" : "Stops"
  }`;

  // Return flight codes for round trips
  const backFlightCodes = backSegments
    .map((seg) => `${seg?.marketingcareer || ""} ${seg?.marketingflight || ""}`.trim())
    .filter(Boolean)
    .join(" | ");
  const backStopsCount = Math.max(backSegments.length - 1, 0);
  const backAirlineLine = `${backFlightCodes || "Flight"} / ${backStopsCount} ${
    backStopsCount === 1 ? "Stop" : "Stops"
  }`;

  const paxCount =
    (data?.pricebreakdown || []).reduce(
      (sum, row) => sum + Number(row?.PaxCount || 0),
      0
    ) ||
    data?.AirFareData?.data?.flightOffers?.[0]?.travelerPricings?.length ||
    data?.AirFareData?.flightOffers?.[0]?.travelerPricings?.length ||
    1;

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        p: 2,
      }}
    >
      <Typography fontSize={12} color="#64748B" fontWeight={600} mb={1}>
        Flight Details
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Typography fontSize={13} fontWeight={700} color="#0F172A">
          {tripTypeLabel}
        </Typography>
        {isRoundTrip && backSegments.length > 0 ? (
          <IconButton
            size="small"
            onClick={() => setShowBackSegment(!showBackSegment)}
            sx={{
              p: 0.5,
              "&:hover": { backgroundColor: "rgba(15, 47, 86, 0.08)" },
            }}
          >
            <SwapHorizIcon sx={{ fontSize: 16, color: "#0F2F56" }} />
          </IconButton>
        ) : null}
      </Box>

      {/* Display selected segment (go or back) */}
      {showBackSegment && isRoundTrip && backSegments.length > 0 ? (
        // Return Flight
        <Box sx={{ mb: 0 }}>
          <Typography fontSize={12} color="#111827" fontWeight={500}>
            {backRouteLine}
          </Typography>
          <Typography fontSize={11} color="#64748B" mt={0.5}>
            {backDateLine}
          </Typography>
        </Box>
      ) : (
        // Outbound Flight (default)
        <Box sx={{ mb: 0 }}>
          <Typography fontSize={12} color="#111827" fontWeight={500}>
            {routeLine}
          </Typography>
          <Typography fontSize={11} color="#64748B" mt={0.5}>
            {dateLine}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 1.5 }} />

      {/* Display airline info for selected segment */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: logoLoadFailed || !logoUrl ? "#E11D48" : "#F8FAFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {!logoLoadFailed && logoUrl ? (
            <Box
              component="img"
              src={logoUrl}
              alt={carrierCode || "airline-logo"}
              onError={() => setLogoLoadFailed(true)}
              sx={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <FlightIcon sx={{ color: "#FFFFFF", fontSize: 18 }} />
          )}
        </Box>
        <Box>
          <Typography
            fontSize={12}
            fontWeight={700}
            color="#111827"
          >
            {formattedAirlineName}
          </Typography>
          <Typography fontSize={11} color="#64748B">
            {showBackSegment && isRoundTrip && backSegments.length > 0
              ? backAirlineLine
              : airlineLine}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: "#E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 600,
            color: "#0F172A",
          }}
        >
          {paxCount}
        </Box>
        <Typography fontSize={11} color="#475569">
          {paxCount} Passenger{paxCount > 1 ? "s" : ""}
        </Typography>
      </Box>
    </Box>
  );
};

export default FlightBookingDetails;
