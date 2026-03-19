import React, { useMemo, useState } from "react";
import { Box, Button, Collapse, Grid, Typography, Tooltip } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightIcon from "@mui/icons-material/Flight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BackpackIcon from "@mui/icons-material/Backpack";
import OnewayFlightDetails from "./OnewayFlightDetails";
import OnewayBrandedFare from "./OnewayBrandedFare";
import dayjs from "dayjs";
import durationIcon from "../../assets/duration icons.svg";
import useAuth from "../../hooks/useAuth";

const OnewayFlight = ({ flight }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [brandedOpen, setBrandedOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { currency: authCurrency } = useAuth();
  const data = flight;

  // Use dynamic currency from auth context (navbar selection) with price from API
  const displayPrice = useMemo(() => {
    // Use authCurrency from navbar if available, otherwise use currency from API
    const displayCurrency = authCurrency || data.priceCurrency || "USD";

    if (data.priceValue && displayCurrency) {
      // Format with current currency from navbar (authCurrency) and price value from API
      return `${displayCurrency} ${data.priceValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
    // Fallback to original price string
    return data.price || "Price unavailable";
  }, [data.price, data.priceValue, data.priceCurrency, authCurrency]);
  const displayNetPrice = useMemo(() => {
    const displayCurrency = authCurrency || data.priceCurrency || "USD";
    const rawNetPrice = data?.netprice ?? data?.netPrice ?? data?.USD?.netPrice;

    if (rawNetPrice === null || rawNetPrice === undefined || rawNetPrice === "") {
      return "";
    }

    const numericNetPrice =
      typeof rawNetPrice === "number"
        ? rawNetPrice
        : parseFloat(String(rawNetPrice).replace(/[^\d.]/g, ""));

    if (Number.isFinite(numericNetPrice)) {
      return `${displayCurrency} ${numericNetPrice.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;
    }

    return `${displayCurrency} ${rawNetPrice}`;
  }, [data?.netprice, data?.netPrice, data?.USD?.netPrice, data.priceCurrency, authCurrency]);
  const logoUrl = data?.carrierCode
    ? `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${data.carrierCode}.png`
    : "";
  const handleToggleDetails = () => {
    setDetailsOpen((prev) => !prev);
  };

  const handleToggleBranded = () => {
    setBrandedOpen((prev) => !prev);
  };

  const formatDate = (value) => {
    if (!value) return "";
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("DD MMM, YYYY") : value;
  };

  const formatTime = (value) => {
    if (!value) return "";
    const parsed = dayjs(value);
    if (parsed.isValid()) {
      return parsed.format("HH:mm");
    }
    const match = String(value).match(/(\d{1,2}):(\d{2})/);
    if (!match) return value;
    const hours = String(match[1]).padStart(2, "0");
    return `${hours}:${match[2]}`;
  };

  const formatTitleCase = (value) => {
    if (!value) return "";
    return String(value)
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Check if refundable and get color
  const isRefundable = useMemo(() => {
    if (!data?.refundable) return false;
    const refundableText = String(data.refundable).toLowerCase();
    // Check if it contains "refund" but not "non-refund" or "no refund"
    return (
      refundableText.includes("refund") &&
      !refundableText.includes("non-refund") &&
      !refundableText.includes("no refund") &&
      !refundableText.includes("not refund") &&
      refundableText !== "refundability unknown"
    );
  }, [data?.refundable]);

  const refundableColor = isRefundable ? "#8DB163" : "#d32f2f";
  const infoChipColor = "#EAF2FB";
  const infoChipTextColor = "#3C4A61";

  const baggageTokens = useMemo(() => {
    const rawBaggage = String(data?.baggage || "");
    const matches = rawBaggage.match(/\d+(?:\.\d+)?\s*(?:kg|kgs?|lb|lbs)/gi);
    return matches || [];
  }, [data?.baggage]);

  const cabinBaggage = useMemo(() => {
    return data?.handBaggage || data?.cabinBaggage || baggageTokens[0] || "";
  }, [data?.handBaggage, data?.cabinBaggage, baggageTokens]);

  const checkedBaggage = useMemo(() => {
    return data?.checkedBaggage || data?.checkInBaggage || baggageTokens[1] || "";
  }, [data?.checkedBaggage, data?.checkInBaggage, baggageTokens]);

  const seatLabel = useMemo(() => {
    const rawSeat = String(data?.seats || "");
    const seatCountMatch = rawSeat.match(/\d+/);
    return seatCountMatch ? `${seatCountMatch[0]} Seat` : rawSeat || "Seat N/A";
  }, [data?.seats]);

  const classLabel = useMemo(() => {
    const rawClass =
      data?.class ||
      data?.cabinClass ||
      data?.travelClass ||
      data?.cabinclass ||
      data?.pricebreakdown?.[0]?.CabinClass ||
      "";

    if (!rawClass) return "Class: N/A";
    return `Class: ${String(rawClass).toUpperCase()}`;
  }, [data?.class, data?.cabinClass, data?.travelClass, data?.cabinclass, data?.pricebreakdown]);

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        p: 1.75,
        border: "1px solid #E8EAEE",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Grid container spacing={0} alignItems="stretch">
        <Grid item xs={12} md={9}>
          <Grid container spacing={1} alignItems="center" wrap="nowrap">
            <Grid item md={4}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                height: 30,
                width: 30,
                borderRadius: "50%",
                backgroundColor: "#E6EEF7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {logoUrl && !logoError ? (
                <img
                  src={logoUrl}
                  alt={data?.airline || "Airline"}
                  style={{ width: 35, height: 35 }}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <FlightTakeoffIcon sx={{ fontSize: 20, color: "#6B7A90" }} />
              )}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Tooltip title={formatTitleCase(data.airline)} arrow placement="top">
                <Typography
                  noWrap
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--marku)",
                    textTransform: "capitalize",
                  }}
                >
                  {formatTitleCase(data.airline)}
                </Typography>
              </Tooltip>
              <Typography noWrap sx={{ fontSize: 10.5, color: "var(--sub)" }}>
                {data.flightNo}
              </Typography>
            </Box>
          </Box>
            </Grid>

            <Grid item md={1.5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.4,
            }}
          >
            <FlightIcon
              sx={{
                color: "var(--primary-color)",
                fontSize: 18,
                rotate: "90deg",
              }}
            />
            <Typography sx={{ fontSize: 11, color: "var(--sub)", fontWeight: 600, textWrap: "nowrap" }}>
              {formatDate(data.departDate)}
            </Typography>
          </Box>
            </Grid>

            <Grid item md={1.5}>
          <Box textAlign="right">
            <Typography
              sx={{ fontSize: 18, color: "var(--primary-light)", fontWeight: 600 }}
            >
              {formatTime(data.departTime)}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "var(--sub)", fontWeight: 500 }}>
              {data.departCode}
            </Typography>
          </Box>
            </Grid>

            <Grid item md={1.8}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box
              component="img"
              src={durationIcon}
              alt="Duration"
              sx={{ width: "85%", height: "100%" }}
            />
          </Box>
            </Grid>

            <Grid item md={1.5}>
          <Box textAlign="left">
            <Typography
              sx={{ fontSize: 18, color: "var(--primary-light)", fontWeight: 600 }}
            >
              {formatTime(data.arriveTime)}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "var(--sub)", fontWeight: 500 }}>
              {data.arriveCode}
            </Typography>
          </Box>
            </Grid>

            <Grid item md={1.7}>
          <Box textAlign="left">
            <Typography sx={{ fontSize: 11, color: "#74757C", fontWeight: 400, textWrap: "nowrap" }}>
              {data.duration}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "#53555D", fontWeight: 600 }}>
              {data.stops}
            </Typography>
          </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 0.6,
              mt: 1,
            }}
          >
        {cabinBaggage ? (
          <Tooltip title={`Cabin baggage: ${cabinBaggage}`} arrow placement="top">
            <Box
              sx={{
                px: 0.8,
                py: 0.35,
                borderRadius: 2,
                backgroundColor: infoChipColor,
                color: infoChipTextColor,
                fontSize: 11,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 0.35,
              }}
            >
              <WorkOutlineIcon sx={{ fontSize: 12 }} />
              {cabinBaggage}
            </Box>
          </Tooltip>
        ) : null}

        {checkedBaggage ? (
          <Tooltip title={`Checked baggage: ${checkedBaggage}`} arrow placement="top">
            <Box
              sx={{
                px: 0.8,
                py: 0.35,
                borderRadius: 2,
                backgroundColor: infoChipColor,
                color: infoChipTextColor,
                fontSize: 11,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 0.35,
              }}
            >
              <BackpackIcon sx={{ fontSize: 12 }} />
              {checkedBaggage}
            </Box>
          </Tooltip>
        ) : null}

        <Tooltip title={`Seat: ${seatLabel}`} arrow placement="top">
          <Box
            sx={{
              px: 0.8,
              py: 0.35,
              borderRadius: 2,
              backgroundColor: infoChipColor,
              color: infoChipTextColor,
              fontSize: 11,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 0.35,
            }}
          >
            <EventSeatIcon sx={{ fontSize: 12 }} />
            {seatLabel}
          </Box>
        </Tooltip>

        <Tooltip title={classLabel} arrow placement="top">
          <Box
            sx={{
              px: 0.8,
              py: 0.35,
              borderRadius: 2,
              backgroundColor: infoChipColor,
              color: infoChipTextColor,
              fontSize: 11,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 0.35,
            }}
          >
            <FlightTakeoffIcon sx={{ fontSize: 12 }} />
            {classLabel}
          </Box>
        </Tooltip>

        {data?.refundable ? (
          <Tooltip title={formatTitleCase(data.refundable)} arrow placement="top">
            <Box
              sx={{
                px: 0.9,
                py: 0.35,
                borderRadius: 2,
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: isRefundable ? "#EAF8ED" : "#FDECEC",
                color: refundableColor,
              }}
            >
              {formatTitleCase(data.refundable)}
            </Box>
          </Tooltip>
        ) : null}
          </Box>
        </Grid>

        <Grid item xs={12} md={3} sx={{ borderLeft: { xs: "none", md: "1px solid #E6E6E6" }, pl: { xs: 0, md: 1.25 } }}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
              <Box display="flex" alignItems="flex-start" justifyContent="flex-start" flexDirection="column">
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: "var(--primary-light)" }}>
                  {displayPrice}
                </Typography>
                {displayNetPrice ? (
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#7F8791" }}>
                    <del>{displayNetPrice}</del>
                  </Typography>
                ) : null}
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              gap={1}
              mt={0.5}
             
              pl={{ xs: 0, md: 1 }}
              boxSizing="border-box"
            >
              <Button
                endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 12 }} />}
                onClick={handleToggleDetails}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#0F2F56",
                  color: "#fff",
                  fontSize: 11,
                  height: 28,
                  borderRadius: 1,
                  minWidth: 110,
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#0B2442" },
                }}
              >
                Flight Details
              </Button>
              <Button
                endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
                onClick={handleToggleBranded}
                sx={{
                  textTransform: "none",
                  backgroundColor: "var(--secondary-color, #024DAF)",
                  color: "#fff",
                  fontSize: 11,
                  height: 28,
                  borderRadius: 1,
                  // minWidth: 70,
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "var(--secondary-color, #024DAF)", opacity: 0.9 },
                }}
              >
                Select
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Collapse in={brandedOpen} timeout="auto" unmountOnExit>
        <OnewayBrandedFare data={data} />
      </Collapse>

      <Collapse in={detailsOpen} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <OnewayFlightDetails data={data} />
        </Box>
      </Collapse>
    </Box>
  );
};

export default OnewayFlight;
