import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import AirlineSeatReclineNormalOutlinedIcon from "@mui/icons-material/AirlineSeatReclineNormalOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";

const toCapitalizedText = (value) => {
  return String(value || "")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
};

const getAmenityIcon = (description) => {
  const text = String(description || "").toLowerCase();
  if (text.includes("seat")) return AirlineSeatReclineNormalOutlinedIcon;
  if (text.includes("meal") || text.includes("food") || text.includes("beverage"))
    return RestaurantOutlinedIcon;
  if (
    text.includes("refund") ||
    text.includes("cancel") ||
    text.includes("ticket")
  )
    return CancelOutlinedIcon;
  if (text.includes("change") || text.includes("upgrade") || text.includes("miles"))
    return EventRepeatOutlinedIcon;
  if (text.includes("bag")) return LuggageOutlinedIcon;
  return WorkOutlineIcon;
};

const RoundWayBrandedFare = ({ fares, data }) => {
  const navigate = useNavigate();
  const currency =
    data?.farecurrency ||
    data?.priceCurrency ||
    data?.AirFareData?.price?.currency ||
    data?.pricebreakdown?.[0]?.currency ||
    "USD";

  const formatAmount = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return `${currency} ${num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const fareSummary = React.useMemo(() => {
    const travelerPricings = data?.AirFareData?.travelerPricings || [];
    const priceBreakdown = data?.pricebreakdown || [];

    let totalPassengers = 0;
    let passengerLabel = "Passenger";
    if (travelerPricings.length) {
      totalPassengers = travelerPricings.length;
      passengerLabel = `${totalPassengers} Passenger${totalPassengers > 1 ? "s" : ""}`;
    } else if (priceBreakdown.length) {
      totalPassengers = priceBreakdown.reduce(
        (sum, row) => sum + Number(row?.PaxCount || 0),
        0
      );
      passengerLabel = `${totalPassengers || 1} Passenger${(totalPassengers || 1) > 1 ? "s" : ""}`;
    }

    const airlineHeading =
      data?.careerName ||
      data?.airline ||
      data?.segments?.go?.[0]?.marketingcareerName ||
      data?.segments?.go?.[0]?.operatingCarrierName ||
      "Airline Fare";

    const totalFareValue =
      data?.clientFare ??
      data?.netPrice ??
      data?.AirFareData?.price?.grandTotal ??
      data?.AirFareData?.price?.total ??
      null;
    const baseFareValue =
      data?.basePrice ?? data?.AirFareData?.price?.base ?? null;

    // Get details from outbound segment (go)
    const outboundSegment = data?.segments?.go?.[0] || data?.details?.outboundSegments?.[0] || {};
    const returnSegment = data?.segments?.back?.[0] || data?.details?.returnSegments?.[0] || {};
    
    // Use outbound segment details, fallback to return segment if needed
    const firstFareDetail = travelerPricings?.[0]?.fareDetailsBySegment?.[0] || {};
    const firstBreakdown = priceBreakdown?.[0] || {};
    const checkedQty =
      firstFareDetail?.includedCheckedBags?.quantity ?? firstBreakdown?.CheckInBags ?? "N/A";
    const cabinQty =
      firstFareDetail?.includedCabinBags?.quantity ?? firstBreakdown?.CabinBags ?? "N/A";
    const fareClass = firstFareDetail?.cabin || data?.cabinClass || firstBreakdown?.CabinClass || "ECONOMY";
    const bookingClass = firstFareDetail?.class || data?.bookingClass || "";
    
    // Get amenities from both segments
    const outboundAmenities = outboundSegment?.amenities || [];
    const returnAmenities = returnSegment?.amenities || [];
    const allAmenities = [...outboundAmenities, ...returnAmenities];
    
    const amenityPerks = Array.isArray(allAmenities)
      ? allAmenities
          .filter((item) => item?.description)
          .map((item, index) => ({
            label: `${toCapitalizedText(item.description)} (${item.isChargeable ? "Paid" : "Free"})`,
            icon: getAmenityIcon(item.description),
            id: `amenity-${index}`,
          }))
      : [];

    return {
      id: "total-fare",
      title: String(airlineHeading),
      subtitle: `${passengerLabel} | Round-Trip Fare Offered by Airline`,
      price: formatAmount(totalFareValue) || "Price unavailable",
      originalPrice: formatAmount(baseFareValue),
      perks: [
        { label: `Cabin ${cabinQty}`, icon: WorkOutlineIcon },
        { label: `Check In ${checkedQty}`, icon: LuggageOutlinedIcon },
        { label: `Class ${fareClass}`, icon: AirlineSeatReclineNormalOutlinedIcon },
        { label: bookingClass ? `Booking ${bookingClass}` : "Booking Standard", icon: EventRepeatOutlinedIcon },
        { label: data?.refundable || "Refundability unknown", icon: CancelOutlinedIcon },
        { label: data?.seats || "Seat availability unknown", icon: AirlineSeatReclineNormalOutlinedIcon },
        ...amenityPerks,
      ],
    };
  }, [data, currency]);

  const handleBookNow = () => {
    const serializableFareSummary = {
      ...fareSummary,
      perks: Array.isArray(fareSummary?.perks)
        ? fareSummary.perks.map((perk, index) => ({
            id: perk?.id || `perk-${index}`,
            label: perk?.label || "",
          }))
        : [],
    };

    // Use originalData if available (from API response), otherwise use data
    const flightDataForBooking = data?.originalData || data || null;

    navigate("/dashboard/flightbooking", {
      state: {
        selectedFlight: flightDataForBooking,
        selectedFare: serializableFareSummary || null,
      },
    });
  };

  return (
    <Box
      sx={{
        mt: 2,
        borderTop: "1px solid #E5E7EB",
        pt: 1.5,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-track": { backgroundColor: "#E5E7EB", borderRadius: 8 },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#9CA3AF", borderRadius: 8 },
        }}
      >
          <Box
            key={fareSummary.id}
            sx={{
              border: "1px solid #C9CEDA",
              borderRadius: 2,
              backgroundColor: "#FFF7F7",
              px: 2,
              py: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
              minHeight: 360,
              minWidth: 250,
              width: 250,
              maxWidth: 250,
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: "2px solid #2B4D80",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: "2px",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#2B4D80",
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1F2A44" }}>
                  {fareSummary.title}
                </Typography>
                <Typography sx={{ fontSize: 10, color: "#6B7280" }}>
                  {fareSummary.subtitle}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {fareSummary.perks.map((perk) => {
                const Icon = perk.icon;
                return (
                  <Box key={perk.label} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Icon sx={{ fontSize: 16, color: "#344054" }} />
                    <Typography sx={{ fontSize: 11, color: "#4B5563", textTransform: "capitalize" }}>
                      {perk.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ mt: "auto" }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                  {fareSummary.price}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "#9CA3AF",
                    textDecoration: "line-through",
                  }}
                >
                  {fareSummary.originalPrice}
                </Typography>
              </Box>
              <Button
                fullWidth
                onClick={handleBookNow}
                sx={{
                  mt: 1,
                  textTransform: "none",
                  backgroundColor: "#0F2F56",
                  color: "#fff",
                  fontSize: 11,
                  height: 30,
                  borderRadius: 1,
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#0B2442" },
                }}
              >
                Book Now
              </Button>
            </Box>
          </Box>
      </Box>
    </Box>
  );
};

export default RoundWayBrandedFare;
