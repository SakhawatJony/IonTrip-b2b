import React, { useMemo, useState } from "react";
import { Box, Button, Collapse, Grid, Typography, Tooltip } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightIcon from "@mui/icons-material/Flight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BackpackIcon from "@mui/icons-material/Backpack";
import RoundwayFlightDetails from "./RoundwayFlightDetails";
import RoundWayBrandedFare from "./RoundWayBrandedFare";
import useAuth from "../../hooks/useAuth";
import dayjs from "dayjs";
import durationIcon from "../../assets/duration icons.svg";



const RoundWayFlight = ({ flight }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [brandedOpen, setBrandedOpen] = useState(false);
  const [logoErrors, setLogoErrors] = useState({});
  const { currency: authCurrency } = useAuth();
  const data = flight || {};

  const displayPrice = useMemo(() => {
    const displayCurrency = authCurrency || data?.priceCurrency || "USD";
    if (typeof data?.priceValue === "number" && !Number.isNaN(data.priceValue) && data.priceValue > 0) {
      return `${displayCurrency} ${data.priceValue.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;
    }
    return data?.price || "Price unavailable";
  }, [authCurrency, data?.price, data?.priceCurrency, data?.priceValue]);

  const displayNetPrice = useMemo(() => {
    const displayCurrency = authCurrency || data?.priceCurrency || "USD";
    const rawNetPrice = data?.netprice ?? data?.netPrice ?? data?.USD?.netPrice;
    if (rawNetPrice === null || rawNetPrice === undefined || rawNetPrice === "") return "";
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
  }, [authCurrency, data?.netprice, data?.netPrice, data?.USD?.netPrice, data?.priceCurrency]);


  const formatDate = (value) => {
    if (!value) return "";
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("DD MMM, YYYY") : value;
  };

  const formatTime = (value) => {
    if (!value) return "";
    const parsed = dayjs(value);
    if (parsed.isValid()) return parsed.format("HH:mm");
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

  const tripSegments = useMemo(() => {
    const segments = Array.isArray(data?.segments) ? data.segments : [];
    if (segments.length) return segments;
    return [
      {
        airline: data?.airline || "Airline",
        flightNo: data?.flightNo || "",
        departTime: data?.departTime || "",
        departDate: data?.departDate || "",
        departCode: data?.departCode || "",
        arriveTime: data?.arriveTime || "",
        arriveDate: data?.arriveDate || "",
        arriveCode: data?.arriveCode || "",
        duration: data?.duration || "",
        stops: data?.stops || "Non Stop",
      },
    ];
  }, [data]);

  const isRefundable = useMemo(() => {
    if (!data?.refundable) return false;
    const refundableText = String(data.refundable).toLowerCase();
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

  const seatLabel = useMemo(() => {
    const rawSeat = String(data?.seats || "");
    const seatCountMatch = rawSeat.match(/\d+/);
    return seatCountMatch ? `${seatCountMatch[0]} Seat` : rawSeat || "Seat N/A";
  }, [data?.seats]);

  const classLabel = useMemo(() => {
    const rawClass = data?.class || data?.cabinClass || data?.travelClass || data?.cabinclass || "";
    if (!rawClass) return "Class: N/A";
    return `Class: ${String(rawClass).toUpperCase()}`;
  }, [data?.class, data?.cabinClass, data?.travelClass, data?.cabinclass]);

  const handleToggleDetails = () => setDetailsOpen((prev) => !prev);
  const handleToggleBranded = () => setBrandedOpen((prev) => !prev);

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
          {tripSegments.map((segment, index) => (
            <Box
              key={`${segment?.flightNo || "segment"}-${index}`}
              sx={{
                py: index === 0 ? 0 : 1.25,
                pb: index === tripSegments.length - 1 ? 0.25 : 1.25,
                borderBottom: index === tripSegments.length - 1 ? "none" : "1px solid #E6E6E6",
              }}
            >
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
                      {(() => {
                        // Get carrier code from segment (added in RoundWaySearchResult)
                        const segmentCarrierCode = (
                          segment?.carrierCode ||
                          segment?.marketingcareer ||
                          (index === 0 
                            ? (data?.details?.outboundSegments?.[0]?.marketingcareer || data?.originalData?.segments?.go?.[0]?.marketingcareer)
                            : (data?.details?.returnSegments?.[0]?.marketingcareer || data?.originalData?.segments?.back?.[0]?.marketingcareer)
                          ) ||
                          data?.carrierCode ||
                          data?.career ||
                          ""
                        ).toUpperCase();
                        
                        const logoUrl = segmentCarrierCode
                          ? `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${segmentCarrierCode}.png`
                          : "";
                        const logoKey = `${segmentCarrierCode}-${index}`;
                        const hasLogoError = logoErrors[logoKey];
                        
                        return logoUrl && !hasLogoError ? (
                          <img
                            src={logoUrl}
                            alt={segment?.airline || "Airline"}
                            style={{ width: 35, height: 35, objectFit: "contain" }}
                            onError={() => setLogoErrors((prev) => ({ ...prev, [logoKey]: true }))}
                          />
                        ) : (
                          <FlightTakeoffIcon sx={{ fontSize: 20, color: "#6B7A90" }} />
                        );
                      })()}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Tooltip title={formatTitleCase(segment?.airline)} arrow placement="top">
                        <Typography
                          noWrap
                          sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--marku)",
                            textTransform: "capitalize",
                          }}
                        >
                          {formatTitleCase(segment?.airline)}
                        </Typography>
                      </Tooltip>
                      <Typography noWrap sx={{ fontSize: 10.5, color: "var(--sub)" }}>
                        {segment?.flightNo}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item md={1.5}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.4 }}>
                    <FlightIcon sx={{ color: "var(--primary-color)", fontSize: 18, rotate: "90deg" }} />
                    <Typography sx={{ fontSize: 11, color: "var(--sub)", fontWeight: 600, textWrap: "nowrap" }}>
                      {formatDate(segment?.departDate)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item md={1.5}>
                  <Box textAlign="right">
                    <Typography sx={{ fontSize: 18, color: "var(--primary-light)", fontWeight: 600 }}>
                      {formatTime(segment?.departTime)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: "var(--sub)", fontWeight: 500 }}>
                      {segment?.departCode}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item md={1.8}>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box component="img" src={durationIcon} alt="Duration" sx={{ width: "85%", height: "100%" }} />
                  </Box>
                </Grid>

                <Grid item md={1.5}>
                  <Box textAlign="left">
                    <Typography sx={{ fontSize: 18, color: "var(--primary-light)", fontWeight: 600 }}>
                      {formatTime(segment?.arriveTime)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: "var(--sub)", fontWeight: 500 }}>
                      {segment?.arriveCode}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item md={1.7}>
                  <Box textAlign="left">
                    <Typography sx={{ fontSize: 11, color: "#74757C", fontWeight: 400, textWrap: "nowrap" }}>
                      {segment?.duration}
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: "#53555D", fontWeight: 600 }}>
                      {segment?.stops}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.6,
          mt: 1,
        }}
      >
        {data?.cabinBaggage ? (
          <Tooltip title={`Cabin baggage: ${data.cabinBaggage}`} arrow placement="top">
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
              {data.cabinBaggage}
            </Box>
          </Tooltip>
        ) : null}

        {data?.checkedBaggage ? (
          <Tooltip title={`Checked baggage: ${data.checkedBaggage}`} arrow placement="top">
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
              {data.checkedBaggage}
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
              width="100%"
              pl={{ xs: 0, md: 0.75 }}
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
                onClick={handleToggleBranded}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#0F2F56",
                  color: "#fff",
                  fontSize: 11,
                  height: 28,
                  borderRadius: 1,
                  
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#0B2442" },
                }}
              >
                Select
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      

      <Collapse in={brandedOpen} timeout="auto" unmountOnExit>
        <RoundWayBrandedFare data={data} />
      </Collapse>

      <Collapse in={detailsOpen} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <RoundwayFlightDetails data={data} />
        </Box>
      </Collapse>
    </Box>
  );
};

export default RoundWayFlight;
