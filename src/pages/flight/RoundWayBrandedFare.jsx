import React, { useState } from "react";
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
  const [selected, setSelected] = useState(true);
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
          .reduce((acc, item) => {
            const normalizedDescription = toCapitalizedText(item.description);
            const chargeType = item.isChargeable ? "Paid" : "Free";
            const uniqueKey = `${normalizedDescription.toLowerCase()}-${chargeType.toLowerCase()}`;

            if (acc.seen.has(uniqueKey)) return acc;
            acc.seen.add(uniqueKey);
            acc.items.push({
              label: `${normalizedDescription} (${chargeType})`,
              icon: getAmenityIcon(item.description),
              id: `amenity-${acc.items.length}`,
            });
            return acc;
          }, { items: [], seen: new Set() })
          .items
      : [];

    const refundLabel = data?.refundable || "Refundability unknown";
    const isNonRefundable =
      String(refundLabel).toLowerCase().includes("non-refund") ||
      String(refundLabel).toLowerCase().includes("non refund");
    const displayTitle =
      (fareClass === "ECONOMY" ? "Economy" : toCapitalizedText(fareClass)) + " class";
    const changeFeeText =
      data?.changeFee != null
        ? typeof data.changeFee === "number"
          ? formatAmount(data.changeFee)
          : String(data.changeFee)
        : `${currency} 100`;

    return {
      id: "total-fare",
      title: String(airlineHeading),
      displayTitle,
      subtitle: `${passengerLabel} | Round-Trip Fare Offered by Airline`,
      price: formatAmount(totalFareValue) || "Price unavailable",
      originalPrice: formatAmount(baseFareValue),
      tripLabel: "Round-trip",
      sections: {
        baggage: [
          { label: `Carry-on baggage: ${cabinQty}`, icon: LuggageOutlinedIcon },
          { label: `Checked baggage: ${checkedQty}`, icon: LuggageOutlinedIcon },
        ],
        flexibility: [
          {
            label: isNonRefundable ? "Non-refundable (partial segments)" : refundLabel,
            icon: CancelOutlinedIcon,
            isNegative: isNonRefundable,
          },
          { label: `Change fee: from ${changeFeeText}`, icon: EventRepeatOutlinedIcon },
        ],
        otherBenefits: [
          { label: `Class ${fareClass}`, icon: AirlineSeatReclineNormalOutlinedIcon },
          {
            label: bookingClass ? `Booking ${bookingClass}` : "Booking Standard",
            icon: EventRepeatOutlinedIcon,
          },
          { label: data?.seats || "Seat availability unknown", icon: AirlineSeatReclineNormalOutlinedIcon },
          ...amenityPerks,
        ],
      },
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
    const serializableFareSummary = fareSummary
      ? {
          id: fareSummary.id,
          title: fareSummary.title,
          displayTitle: fareSummary.displayTitle,
          subtitle: fareSummary.subtitle,
          price: fareSummary.price,
          originalPrice: fareSummary.originalPrice,
          tripLabel: fareSummary.tripLabel,
          perks: Array.isArray(fareSummary.perks)
            ? fareSummary.perks.map((perk, index) => ({
                id: perk?.id || `perk-${index}`,
                label: perk?.label || "",
              }))
            : [],
        }
      : null;

    const flightDataForBooking = data?.originalData || data || null;

    navigate("/dashboard/flightbooking", {
      state: {
        selectedFlight: flightDataForBooking,
        selectedFare: serializableFareSummary,
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
            onClick={() => setSelected(true)}
            sx={{
              border: selected ? "2px solid var(--primary-color, #123D6E)" : "1px solid #E0E0E0",
              borderRadius: 2,
              backgroundColor: selected ? "rgba(18, 61, 110, 0.06)" : "#FFFFFF",
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
              cursor: "pointer",
              transition: "border-color 0.2s, background-color 0.2s",
              "&:hover": {
                borderColor: "var(--primary-color, #123D6E)",
                backgroundColor: selected ? "rgba(18, 61, 110, 0.08)" : "rgba(18, 61, 110, 0.04)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
              <Box>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#374151" }}>
                  {fareSummary.displayTitle || fareSummary.title}
                </Typography>
                <Typography sx={{ fontSize: 10, color: "#9CA3AF", mt: 0.25 }}>
                  {fareSummary.subtitle}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "2px solid var(--primary-color, #123D6E)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-color, #123D6E)",
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {fareSummary.sections?.baggage?.length > 0 && (
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#374151", mb: 0.75 }}>
                    Baggage
                  </Typography>
                  {fareSummary.sections.baggage.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Box key={item.label} sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0.5 }}>
                        <Icon sx={{ fontSize: 16, color: "var(--primary-color, #123D6E)" }} />
                        <Typography sx={{ fontSize: 11, color: "#4B5563" }}>{item.label}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
              {fareSummary.sections?.flexibility?.length > 0 && (
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#374151", mb: 0.75 }}>
                    Flexibility
                  </Typography>
                  {fareSummary.sections.flexibility.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Box key={item.label} sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0.5 }}>
                        <Icon
                          sx={{
                            fontSize: 16,
                            color: item.isNegative ? "#DC2626" : "var(--primary-color, #123D6E)",
                          }}
                        />
                        <Typography sx={{ fontSize: 11, color: "#4B5563" }}>{item.label}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
              {fareSummary.sections?.otherBenefits?.length > 0 && (
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#374151", mb: 0.75 }}>
                    Other benefits
                  </Typography>
                  {fareSummary.sections.otherBenefits.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Box key={item.label} sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0.5 }}>
                        <Icon sx={{ fontSize: 16, color: "var(--primary-color, #123D6E)" }} />
                        <Typography sx={{ fontSize: 11, color: "#4B5563" }}>{item.label}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>

            <Box sx={{ mt: "auto" }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--primary-color, #123D6E)" }}>
                  {fareSummary.price}
                </Typography>
                {fareSummary.tripLabel && (
                  <Typography sx={{ fontSize: 12, color: "#6B7280", fontWeight: 400 }}>
                    {fareSummary.tripLabel}
                  </Typography>
                )}
                {fareSummary.originalPrice ? (
                  <Typography sx={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }}>
                    {fareSummary.originalPrice}
                  </Typography>
                ) : null}
              </Box>
              <Button
                type="button"
                fullWidth
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBookNow();
                }}
                sx={{
                  mt: 1,
                  textTransform: "none",
                  backgroundColor: "var(--primary-color, #123D6E)",
                  color: "#fff",
                  fontSize: 11,
                  height: 30,
                  borderRadius: 1,
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "var(--primary-color, #123D6E)", opacity: 0.9 },
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
