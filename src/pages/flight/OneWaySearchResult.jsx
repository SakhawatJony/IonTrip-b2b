import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Grid, Typography, Select, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import AfterSearchBanner from "../../components/layout/AfterSearchBanner";
import OnewayFlightFilter from "./OnewayFlightFilter";
import OnewayFlight from "./OnewayFlight";
import OnewayFlightSkeleton from "./OnewayFlightSkeleton";
import OnewayFilterSkeleton from "./OnewayFilterSkeleton";

const OneWaySearchResult = () => {
  const location = useLocation();
  const searchData = location.state || {};
  const {
    from = "Dubai Int Airport (DXB)",
    to = "Hazrat Shahjalal Int Airport (DAC)",
    travelDate = "",
    departureDateISO = "",
    fromCode = "",
    toCode = "",
    email = "",
    passengerCounts = { adults: 1, children: 0, infants: 0 },
    childAges = [],
    travelClass = "Economy",
    directFlight = false,
  } = searchData;
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const formatCount = (count, singular, plural) =>
    `${count} ${count === 1 ? singular : plural}`;
  const passengerSummary = [
    formatCount(passengerCounts.adults || 0, "Adult", "Adults"),
    formatCount(passengerCounts.children || 0, "Child", "Children"),
    formatCount(passengerCounts.infants || 0, "Infant", "Infants"),
  ].join(", ");

  const childAgeSummary =
    (passengerCounts.children || 0) > 0 && childAges.length > 0
      ? `Child ages: ${childAges.join(", ")}`
      : "";

  const extractAirportCode = (value) => {
    const match = value?.match(/\(([^)]+)\)/);
    return match ? match[1] : value?.trim() || "";
  };

  const effectiveFromCode = fromCode || extractAirportCode(from);
  const effectiveToCode = toCode || extractAirportCode(to);
  const effectiveDepartureDateISO =
    departureDateISO || (travelDate && dayjs(travelDate).isValid()
      ? dayjs(travelDate).format("YYYY-MM-DD")
      : "");

  const cabinClass = (travelClass || "economy").toLowerCase();
  const adultCount = passengerCounts.adults || 1;
  const childCount = passengerCounts.children || 0;
  const infantCount = passengerCounts.infants || 0;

  const requestBody = useMemo(
    () => ({
      tripType: "oneway",
      journeyfrom: effectiveFromCode || "",
      journeyto: effectiveToCode || "",
      adult: adultCount,
      child: childCount,
      infant: infantCount,
      cabinclass: cabinClass,
      departuredate: effectiveDepartureDateISO || "",
      email: email || "user@example.com",
    }),
    [
      effectiveFromCode,
      effectiveToCode,
      adultCount,
      childCount,
      infantCount,
      cabinClass,
      effectiveDepartureDateISO,
      email,
    ]
  );

  useEffect(() => {
    if (!requestBody.journeyfrom || !requestBody.journeyto || !requestBody.departuredate) {
      return;
    }

    const controller = new AbortController();
    const fetchFlights = async () => {
      setLoading(true);
      setHasSearched(true);
      setError("");
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        const response = await fetch(`${baseUrl}/flight/searchFlights`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Search failed (${response.status})`);
        }

        const payload = await response.json();
        const rawFlights = Array.isArray(payload)
          ? payload
          : payload?.data || payload?.flights || payload?.results || payload?.items || payload;
        const normalized = Array.isArray(rawFlights) ? rawFlights : rawFlights ? [rawFlights] : [];

        const mappedFlights = normalized.map((item, index) => {
          const goSegments = item?.segments?.go || [];
          const firstSegment = goSegments[0];
          const lastSegment = goSegments[goSegments.length - 1];
          const priceCurrency =
            item?.USD?.farecurrency ||
            item?.USD?.currency ||
            item?.AirFareData?.price?.currency ||
            "USD";
          const priceValue =
            item?.USD?.clientFare ||
            item?.USD?.netPrice ||
            item?.USD?.agentFare ||
            item?.AirFareData?.price?.grandTotal ||
            item?.AirFareData?.price?.total ||
            "";
          const stopCount = Math.max(0, goSegments.length - 1);
          const stopLabel = stopCount === 0 ? "Non Stop" : `${stopCount} Stop${stopCount > 1 ? "s" : ""}`;
          const bags =
            item?.pricebreakdown?.[0]?.CheckInBags ||
            firstSegment?.bags ||
            "";

          return {
            id: item?.offerId || item?.AirFareData?.id || index + 1,
            carrierCode:
              item?.career ||
              firstSegment?.marketingcareer ||
              item?.AirFareData?.validatingAirlineCodes?.[0] ||
              "",
            airline:
              item?.careerName ||
              firstSegment?.marketingcareerName ||
              item?.AirFareData?.validatingAirlineCodes?.[0] ||
              "Airline",
            flightNo: goSegments.length
              ? goSegments
                  .map((segment) => `${segment.marketingcareer} ${segment.marketingflight}`.trim())
                  .filter(Boolean)
                  .join(" | ")
              : item?.offerId || "",
            departTime: item?.godepartureTime || firstSegment?.departureTime || "",
            departDate: item?.godepartureDate || firstSegment?.departureTime || "",
            departCode: item?.godeparture || firstSegment?.departure || fromCode,
            arriveTime: item?.goarrivalTime || lastSegment?.arrivalTime || "",
            arriveDate: item?.goarrivalDate || lastSegment?.arrivalTime || "",
            arriveCode: item?.goarrival || lastSegment?.arrival || toCode,
            duration:
              item?.goflightduration ||
              item?.AirFareData?.itineraries?.[0]?.duration ||
              "",
            stops: stopLabel,
            price: priceValue ? `${priceCurrency} ${priceValue}` : "Price unavailable",
            seats: item?.seat ? `${item.seat} Seat available` : "Seat availability unknown",
            baggage: bags ? `Baggage ${bags}` : "Baggage info",
            refundable: item?.refundable || "Refundability unknown",
          };
        });

        setFlights(mappedFlights);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load flights.");
          setFlights([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();

    return () => controller.abort();
  }, [requestBody, fromCode, toCode]);

  return (
    <Box>
      <Box sx={{ mt: 2 }}>
        <AfterSearchBanner />
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2.4}mt={8}>
            {loading ? <OnewayFilterSkeleton /> : <OnewayFlightFilter />}
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
                  {from} → {to}
                </Typography>
            <Typography sx={{ fontSize: 12, color: "#6B6B6B" }}>
              {loading
                ? "Searching flights..."
                : `${flights.length} Flights found`}
            </Typography>
                <Typography sx={{ fontSize: 12, color: "#6B6B6B" }}>
                  {travelDate || "Travel date not set"} | {travelClass}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#6B6B6B" }}>
                  {passengerSummary} | Direct flight: {directFlight ? "Yes" : "No"}
                </Typography>
                {childAgeSummary ? (
                  <Typography sx={{ fontSize: 12, color: "#6B6B6B" }}>
                    {childAgeSummary}
                  </Typography>
                ) : null}
                {error ? (
                  <Typography sx={{ fontSize: 12, color: "#D32F2F" }}>{error}</Typography>
                ) : null}
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
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <OnewayFlightSkeleton key={`flight-skeleton-${index}`} />
                ))
              ) : hasSearched && flights.length === 0 ? (
                <Typography sx={{ fontSize: 14, color: "#6B6B6B" }}>
                  No flights found.
                </Typography>
              ) : (
                flights?.map((flight) => <OnewayFlight key={flight.id} flight={flight} />)
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default OneWaySearchResult;