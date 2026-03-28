import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Collapse, Grid, Typography, Tooltip, IconButton } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightIcon from "@mui/icons-material/Flight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BackpackIcon from "@mui/icons-material/Backpack";
import WifiIcon from "@mui/icons-material/Wifi";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import BoltIcon from "@mui/icons-material/Bolt";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import OnewayFlightDetails from "./OnewayFlightDetails";
import OnewayBrandedFare from "./OnewayBrandedFare";
import dayjs from "dayjs";
import useAuth from "../../hooks/useAuth";

/** Route line + arrow use secondary; stop circles stay primary blue rings. */
const ROUTE_STROKE = "var(--secondary-color, #024DAF)";

/** Scaled chevron; pivot at arrow tip (114.3, 5.282). */
const RouteArrowHead = () => (
  <g transform="translate(114.3, 5.28203) scale(1.25) translate(-114.3, -5.28203)">
    <path
      d="M108.9 0.332031L114.3 5.28203L108.9 9.78203"
      stroke={ROUTE_STROKE}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

const OnewayFlight = ({ flight }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [brandedOpen, setBrandedOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyResetTimerRef = useRef(null);
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

  const handleCopyFlightDetails = async () => {
    const airline = formatTitleCase(data?.airline) || "N/A";
    const fromCode = data?.departCode || "N/A";
    const toCode = data?.arriveCode || "N/A";
    const departDate = formatShortDate(data?.departDate) || "N/A";
    const arriveDate = formatShortDate(data?.arriveDate || data?.departDate) || "N/A";
    const departTime = formatTime(data?.departTime) || "N/A";
    const arriveTime = formatTime(data?.arriveTime) || "N/A";
    const duration = data?.duration || "N/A";
    const fareCurrency = authCurrency || data?.priceCurrency || "USD";
    const fareValue = Number(data?.priceValue);
    const fare = Number.isFinite(fareValue) ? `${fareValue.toFixed(2)} ${fareCurrency}` : `${data?.price || "N/A"}`;

    const copyText = [
      `Airlines: ${airline}`,
      `From: ${fromCode} (${departDate} ${departTime})`,
      `To: ${toCode} (${arriveDate} ${arriveTime})`,
      `Duration: ${duration}`,
      `Fare: ${fare}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(copyText);
    } catch (error) {
      // Fallback for older browsers/non-secure contexts.
      const textArea = document.createElement("textarea");
      textArea.value = copyText;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    setCopied(true);
    if (copyResetTimerRef.current) {
      clearTimeout(copyResetTimerRef.current);
    }
    copyResetTimerRef.current = setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }
    };
  }, []);

  const formatDate = (value) => {
    if (!value) return "";
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("DD MMM, YYYY") : value;
  };

  const formatShortDate = (value) => {
    if (!value) return "";
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("DD MMM") : value;
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

  const stopDotCount = useMemo(() => {
    const normalized = String(data?.stops || "").toLowerCase().trim();
    if (!normalized || normalized.includes("non")) return 0;

    const numericMatch = normalized.match(/\d+/);
    if (numericMatch) {
      return Math.min(3, Math.max(0, Number.parseInt(numericMatch[0], 10)));
    }

    if (normalized.includes("one")) return 1;
    if (normalized.includes("two")) return 2;
    if (normalized.includes("three")) return 3;
    return 0;
  }, [data?.stops]);

  const showTransitTooltip = stopDotCount > 0;

  const transitLayovers = useMemo(() => {
    const go = data?.segments?.go;
    if (!Array.isArray(go) || go.length < 2) return [];

    const ordinalLabel = (n) => {
      if (n === 1) return "1st";
      if (n === 2) return "2nd";
      if (n === 3) return "3rd";
      return `${n}th`;
    };

    const pickLayoverDuration = (seg, idx) => {
      const t = seg?.transit;
      if (t == null) return "";
      if (typeof t === "string") return t.trim();
      if (typeof t === "object") {
        const keys = Object.keys(t);
        const direct =
          t.transit1 ||
          t[`transit${idx + 1}`] ||
          (keys.length ? t[keys[Math.min(idx, keys.length - 1)]] : "");
        if (direct != null && String(direct).trim()) return String(direct).trim();
        const firstVal = Object.values(t).find((v) => v != null && String(v).trim() !== "");
        return firstVal != null ? String(firstVal).trim() : "";
      }
      return "";
    };

    const rows = [];
    for (let i = 0; i < go.length - 1; i++) {
      const seg = go[i];
      const code = seg.arrival || seg.arrival?.iataCode || "";
      const airport = String(seg.arrivalAirport || seg.arrivalLocation || "").trim();
      const city = String(seg.arrivalCityName || "").trim();
      const layover = pickLayoverDuration(seg, i);

      let cityLine = "";
      if (city && code) cityLine = `${city} (${code})`;
      else if (code) cityLine = code;
      else if (airport) cityLine = airport;
      else cityLine = "Connection";

      let airportLine = "";
      if (airport && (!city || airport.toLowerCase() !== city.toLowerCase())) {
        airportLine = airport;
      }

      rows.push({
        key: `${code}-${i}`,
        ordinalLabel: ordinalLabel(i + 1),
        cityLine,
        airportLine,
        layoverText: layover || "",
      });
    }
    return rows;
  }, [data?.segments?.go]);

  const transitTooltipSx = {
    bgcolor: "#1B2347",
    color: "#FFFFFF",
    p: 2,
    maxWidth: 300,
    borderRadius: 2,
    boxShadow: "0 10px 28px rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  const transitTooltipTitle = useMemo(() => {
    if (!transitLayovers.length) {
      return (
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.75, color: "#FFFFFF" }}>
            Transit (Plane Change)
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#9FE7FF", lineHeight: 1.45 }}>
            Connection details are not available for this fare. Open Flight Details for more information.
          </Typography>
        </Box>
      );
    }
    return (
      <Box sx={{ maxWidth: 280 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1.25, color: "#FFFFFF" }}>
          Transit (Plane Change)
        </Typography>
        {transitLayovers.map((item, idx) => (
          <Box key={item.key} sx={{ mb: idx < transitLayovers.length - 1 ? 2 : 0 }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "#FFFFFF",
                pb: 0.5,
                mb: 1,
                borderBottom: "1px dashed rgba(255,255,255,0.45)",
              }}
            >
              {item.ordinalLabel} Transit
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#7DD3FC", fontWeight: 600, lineHeight: 1.45 }}>
              {item.cityLine}
            </Typography>
            {item.airportLine ? (
              <Typography sx={{ fontSize: 11, color: "#7DD3FC", fontWeight: 400, mt: 0.5, lineHeight: 1.4 }}>
                {item.airportLine}
              </Typography>
            ) : null}
            <Typography sx={{ fontSize: 12, color: "#FCD34D", fontWeight: 600, mt: 1 }}>
              Layover Time: {item.layoverText || "—"}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }, [transitLayovers]);

  const transitTooltipSlotProps = useMemo(
    () => ({
      tooltip: { sx: transitTooltipSx },
      arrow: { sx: { color: "#1B2347" } },
    }),
    []
  );

  const amenityRows = useMemo(() => {
    const rawAmenities = data?.segments?.go?.[0]?.amenities;
    if (!Array.isArray(rawAmenities)) return [];

    const normalizeAmenity = (item) => {
      const description = String(item?.description || item || "").trim();
      if (!description) return null;

      const lowerText = description.toLowerCase();
      let key = "other";
      let icon = WorkOutlineIcon;
      let shortLabel = "Amenity";

      if (lowerText.includes("wifi") || lowerText.includes("wi-fi") || lowerText.includes("internet")) {
        key = "wifi";
        icon = WifiIcon;
        shortLabel = "Wi-Fi";
      } else if (
        lowerText.includes("meal") ||
        lowerText.includes("food") ||
        lowerText.includes("beverage")
      ) {
        key = "meal";
        icon = RestaurantIcon;
        shortLabel = "Meal";
      } else if (
        lowerText.includes("usb") ||
        lowerText.includes("power") ||
        lowerText.includes("charge") ||
        lowerText.includes("charging")
      ) {
        key = "power";
        icon = BoltIcon;
        shortLabel = "Power";
      } else if (
        lowerText.includes("entertainment") ||
        lowerText.includes("screen") ||
        lowerText.includes("tv")
      ) {
        key = "entertainment";
        icon = LiveTvIcon;
        shortLabel = "Entertainment";
      }

      const chargeLabel =
        item && typeof item === "object" && "isChargeable" in item
          ? item.isChargeable
            ? " (additional charge)"
            : " (included)"
          : "";

      return {
        key,
        icon,
        shortLabel,
        fullLabel: `${formatTitleCase(description)}${chargeLabel}`,
      };
    };

    const mapped = rawAmenities.map(normalizeAmenity).filter(Boolean);
    const deduped = [];
    const seen = new Set();

    mapped.forEach((row) => {
      if (!seen.has(row.key)) {
        seen.add(row.key);
        deduped.push(row);
      }
    });

    return deduped;
  }, [data?.segments?.go, formatTitleCase]);

  const amenityTooltipTitle = useMemo(() => {
    if (!amenityRows.length) return "";

    const airlineLabel = formatTitleCase(data?.airline) || "Airline";
    const cabinLabel =
      String(
        data?.class ||
        data?.cabinClass ||
        data?.travelClass ||
        data?.cabinclass ||
        data?.pricebreakdown?.[0]?.CabinClass ||
        "Economy"
      )
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()) + " class";

    return (
      <Box sx={{ minWidth: 220 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", mb: 0.7 }}>
          {airlineLabel}
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#D1E7FF", mb: 0.8 }}>{cabinLabel}</Typography>
        {amenityRows.map((item, idx) => (
          <Box key={`${item.key}-${idx}`} sx={{ display: "flex", alignItems: "flex-start", gap: 0.8, mb: 0.5 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 13, color: "#67E8F9", mt: "2px" }} />
            <Typography sx={{ fontSize: 12, color: "#E5ECF6", lineHeight: 1.35 }}>
              {item.fullLabel}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }, [amenityRows, data, formatTitleCase]);

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
        <Grid item xs={12} md={9.9}>
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
                  {amenityRows.length ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mt: 0.45 }}>
                      {amenityRows.map((item, index) => {
                        const AmenityIcon = item.icon;
                        return (
                          <Tooltip
                            key={`${item.key}-${index}`}
                            title={amenityTooltipTitle}
                            arrow
                            placement="top"
                            slotProps={transitTooltipSlotProps}
                          >
                            <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                              <AmenityIcon sx={{ fontSize: 14, color: "var(--secondary-color, #024DAF)" }} />
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </Box>
                  ) : null}
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
              <Tooltip
                title={transitTooltipTitle}
                arrow
                placement="top"
                enterDelay={200}
                disableHoverListener={!showTransitTooltip}
                disableFocusListener={!showTransitTooltip}
                disableTouchListener={!showTransitTooltip}
                slotProps={transitTooltipSlotProps}
              >
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "visible",
                    width: "100%",
                    cursor: showTransitTooltip ? "help" : "default",
                  }}
                >
                  <svg
                    width="80"
                    height="11"
                    viewBox="0 0 115 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    overflow="visible"
                    style={{ display: "block", overflow: "visible" }}
                  >
                    {stopDotCount === 0 ? (
                      <>
                        <path d="M0 5.28125H107.5" stroke={ROUTE_STROKE} strokeWidth="0.85" strokeLinecap="round" />
                        <RouteArrowHead />
                      </>
                    ) : null}
                    {stopDotCount === 1 ? (
                      <>
                        <circle cx="57.1496" cy="5.28242" r="3.375" stroke="#123D6E" strokeWidth="1.35" fill="none" />
                        <path d="M0 5.28125H53.0995" stroke={ROUTE_STROKE} strokeWidth="0.85" strokeLinecap="round" />
                        <path d="M61.2002 5.28125H107.5" stroke={ROUTE_STROKE} strokeWidth="0.85" strokeLinecap="round" />
                        <RouteArrowHead />
                      </>
                    ) : null}
                    {stopDotCount === 2 ? (
                      <>
                        <circle cx="26.55" cy="5.28242" r="3.375" stroke="#123D6E" strokeWidth="1.35" fill="none" />
                        <circle cx="87.7502" cy="5.28242" r="3.375" stroke="#123D6E" strokeWidth="1.35" fill="none" />
                        <path d="M0 5.28125H22.4999" stroke={ROUTE_STROKE} strokeWidth="0.85" strokeLinecap="round" />
                        <path d="M30.5996 5.28125H83.7001" stroke={ROUTE_STROKE} strokeWidth="0.85" strokeLinecap="round" />
                        <path d="M91.7998 5.28125H107.5" stroke={ROUTE_STROKE} strokeWidth="0.85" strokeLinecap="round" />
                        <RouteArrowHead />
                      </>
                    ) : null}
                    {stopDotCount === 3 ? (
                      <>
                        <circle cx="26.55" cy="5.28242" r="3.375" stroke="#123D6E" strokeWidth="1.35" fill="none" />
                        <circle cx="57.1496" cy="5.28242" r="3.375" stroke="#123D6E" strokeWidth="1.35" fill="none" />
                        <circle cx="87.7502" cy="5.28242" r="3.375" stroke="#123D6E" strokeWidth="1.35" fill="none" />
                        <path d="M0 5.28125H22.4999" stroke={ROUTE_STROKE} strokeWidth="0.85" strokeLinecap="round" />
                        <path d="M30.5996 5.28125H53.0995" stroke={ROUTE_STROKE} strokeWidth="0.85" strokeLinecap="round" />
                        <path d="M61.2002 5.28125H83.7001" stroke={ROUTE_STROKE} strokeWidth="0.85" strokeLinecap="round" />
                        <path d="M91.7998 5.28125H107.5" stroke={ROUTE_STROKE} strokeWidth="0.85" strokeLinecap="round" />
                        <RouteArrowHead />
                      </>
                    ) : null}
                  </svg>
                </Box>
              </Tooltip>
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
                <Tooltip
                  title={transitTooltipTitle}
                  arrow
                  placement="top"
                  enterDelay={200}
                  disableHoverListener={!showTransitTooltip}
                  disableFocusListener={!showTransitTooltip}
                  disableTouchListener={!showTransitTooltip}
                  slotProps={transitTooltipSlotProps}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 11.5,
                      color: "#53555D",
                      fontWeight: 600,
                      display: "inline-block",
                      cursor: showTransitTooltip ? "help" : "default",
                    }}
                  >
                    {data.stops}
                  </Typography>
                </Tooltip>
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

            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", mr: "6px" }}>
              <Button
                endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 12 }} />}
                onClick={handleToggleDetails}
                sx={{
                  textTransform: "none",
                  // backgroundColor: "#0F2F56",
                  color: "var(--secondary-color, #024DAF)",
                  fontSize: 10.5,
                  height: 24,
                  borderRadius: 1,
                  minWidth: 95,
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  border: "1px solid var(--secondary-color, #024DAF)",
                  px: 1,
                  // "&:hover": { backgroundColor: "#0B2442" },
                }}
              >
                Flight Details
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={2.1} sx={{ borderLeft: { xs: "none", md: "1px solid #E6E6E6" }, pl: { xs: 0, md: 1.25 }, textAlign: "right" }}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <Box display="flex" alignItems="flex-end" justifyContent="flex-start" flexDirection="column">
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
              justifyContent="space-between"
              gap={1}
              mt={0.5}
            >
              <Tooltip title={copied ? "Copied" : "Click to copy flight details"} arrow>
                <IconButton
                  onClick={handleCopyFlightDetails}
                  size="small"
                  sx={{
                    width: 22,
                    height: 22,
                    border: copied
                      ? "1px solid var(--primary-color, #024DAF)"
                      : "1px solid var(--secondary-color, #024DAF)",
                    color: copied ? "var(--primary-color, #024DAF)" : "var(--secondary-color, #024DAF)",
                  }}
                >
                  <ContentCopyOutlinedIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Tooltip>
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
                  minWidth: 100,
                  whiteSpace: "nowrap",
                  fontWeight: 600,

                  textAlign: "right",
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
