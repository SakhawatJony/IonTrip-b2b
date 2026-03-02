import React from "react";
import {
  Box,
  Typography,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Slider,
} from "@mui/material";

const SectionTitle = ({ children }) => (
  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#2A2A2A", mb: 1 }}>
    {children}
  </Typography>
);

const OnewayFlightFilter = ({
  stops = [],
  airlines = [],
  refundableOptions = [],
  departTimes = [],
  arriveTimes = [],
  filterState = {
    stops: [],
    airlines: [],
    refundability: [],
    departTimes: [],
    arriveTimes: [],
    minPrice: null,
    maxPrice: null,
  },
  priceBounds = { min: 0, max: 0 },
  onPriceRangeChange,
  currency = "USD",
  onFilterChange,
  onReset,
  enableRouteTimeTabs = false,
  routeLabels = {
    outboundFrom: "Origin",
    inboundFrom: "Return Origin",
    outboundTo: "Destination",
    inboundTo: "Return Destination",
  },
}) => {
  const [logoErrors, setLogoErrors] = React.useState({});
  const [activeTimeTab, setActiveTimeTab] = React.useState("departure");
  const uncheckedIcon = (
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "3px",
        border: "1.5px solid #9AA4B2",
        backgroundColor: "#FFFFFF",
      }}
    />
  );

  const checkedIcon = (
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "3px",
        border: "1.5px solid var(--primary-color)",
        backgroundColor: "var(--primary-color)",
      }}
    />
  );

  const checkboxSx = {
    p: 0.25,
  };

  const labelSx = {
    "& .MuiTypography-root": {
      fontSize: 11.5,
      color: "#444444",
      fontWeight: 500,
    },
    my: 0.25,
  };

  const toTitleCase = (value) => {
    if (!value) return "";
    return String(value)
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const normalizeStopLabel = (label) => {
    if (!label) return "";
    const normalized = String(label).toLowerCase().trim();
    if (normalized.includes("non")) return "Non Stop";
    // Check for exactly 1 stop - matches "1 stop" or "one stop" but not "2 stops", "3 stops", etc.
    const oneStopPattern = /^1\s*stop$|^one\s*stop$/;
    if (oneStopPattern.test(normalized) || (normalized.includes("1") && normalized.includes("stop") && !normalized.match(/[2-9]/))) {
      return "One Stop";
    }
    // Everything else is one plus stops
    return "One Plus Stops";
  };

  const handleCheckboxChange = (filterType, value) => (event) => {
    if (onFilterChange) {
      onFilterChange(filterType, value, event.target.checked);
    }
  };

  const isChecked = (filterType, value) => {
    const normalizedValue = filterType === "stops" ? normalizeStopLabel(value) : value;
    return (filterState[filterType] || []).includes(normalizedValue);
  };

  const fallbackStops = ["Non Stop", "One Stop", "One Plus Stops"];
  const fallbackDepartTimes = [
    "12:00am - 04:59am",
    "05:00am - 11:59am",
    "12:00pm - 05:59pm",
    "06:00pm - 11:59pm",
  ];
  const fallbackArriveTimes = fallbackDepartTimes;

  const stopsToRender = stops.length ? stops : fallbackStops;
  const airlinesToRender = airlines.length ? airlines : [];
  const refundableToRender = refundableOptions.length
    ? refundableOptions
    : ["Non Refundable", "Refundable"];
  const departTimesToRender = departTimes.length ? departTimes : fallbackDepartTimes;
  const arriveTimesToRender = arriveTimes.length ? arriveTimes : fallbackArriveTimes;
  const hasPriceData =
    Number.isFinite(priceBounds?.min) &&
    Number.isFinite(priceBounds?.max) &&
    priceBounds.max >= priceBounds.min;
  const selectedMin = Number.isFinite(filterState?.minPrice) ? filterState.minPrice : priceBounds.min;
  const selectedMax = Number.isFinite(filterState?.maxPrice) ? filterState.maxPrice : priceBounds.max;

  const handlePriceRangeChange = (_, value) => {
    if (!Array.isArray(value) || value.length !== 2) return;
    const [min, max] = value;
    onPriceRangeChange?.(min, max);
  };

  // Airline name to carrier code mapping for common airlines
  const airlineCodeMap = {
    "SINGAPORE AIRLINES": "SQ",
    "SINGAPORE AIRLINE": "SQ",
    "SINGAPORE": "SQ",
    "EMIRATES": "EK",
    "CHINA SOUTHERN AIRLINES": "CZ",
    "CHINA SOUTHERN": "CZ",
    "QATAR AIRWAYS": "QR",
    "QATAR": "QR",
    "THAI AIRWAYS": "TG",
    "THAI": "TG",
    "MALAYSIA AIRLINES": "MH",
    "MALAYSIA": "MH",
    "AIR ASIA": "AK",
    "AIRASIA": "AK",
    "CATHAY PACIFIC": "CX",
    "CATHAY": "CX",
    "JAPAN AIRLINES": "JL",
    "JAL": "JL",
    "ALL NIPPON AIRWAYS": "NH",
    "ANA": "NH",
    "OMAN AIR": "WY",
    "BIMAN BANGLADESH AIRLINES": "BG",
    "BIMAN": "BG",
    "SRILANKAN AIRLINES": "UL",
    "SRILANKAN": "UL",
    "SAUDI ARABIAN AIRLINES": "SV",
    "SAUDI ARABIAN": "SV",
    "FLYDUBAI": "FZ",
    "KUWAIT AIRWAYS": "KU",
    "AIR INDIA": "AI",
    "ETHIOPIAN AIRLINES": "ET",
    "ETHIOPIAN": "ET",
    "HAHN AIR TECHNOLOGIES": "HR",
    "HAHN AIR": "HR",
  };

  // Helper to get carrier code from airline name
  const getCarrierCodeFromName = (airlineName) => {
    if (!airlineName) return "";
    const upperName = airlineName.toUpperCase().trim();
    return airlineCodeMap[upperName] || "";
  };

  const getAirlineName = (airlineItem) =>
    typeof airlineItem === "string" ? airlineItem : airlineItem?.name || "";

  const getAirlineCode = (airlineItem, airlineName) => {
    // First, try to get explicit code from airlineItem object
    const explicitCode =
      typeof airlineItem === "object" && airlineItem?.code
        ? String(airlineItem.code).toUpperCase()
        : "";
    if (explicitCode) return explicitCode;
    
    // Then, try to get code from airline name mapping
    const mappedCode = getCarrierCodeFromName(airlineName);
    if (mappedCode) return mappedCode;
    
    // Fallback to first 2 letters of airline name
    return String(airlineName || "")
      .slice(0, 2)
      .toUpperCase();
  };

  const getAirlineLogoUrl = (carrierCode) =>
    carrierCode
      ? `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${carrierCode}.png`
      : "";

  const timeButtonSx = (active) => ({
    border: "1px solid #C7D2E5",
    borderRadius: 1,
    px: 1.25,
    py: 0.7,
    fontSize: 11,
    fontWeight: 600,
    color: active ? "#FFFFFF" : "#243B64",
    backgroundColor: active ? "var(--primary-color)" : "#FFFFFF",
    textTransform: "none",
    lineHeight: 1.2,
    "&:hover": {
      backgroundColor: active ? "var(--primary-color)" : "#F5F8FD",
      borderColor: active ? "var(--primary-color)" : "#AFC1DF",
    },
  });

  const renderRouteTimeGroup = (title, filterKey, values) => (
    <Box sx={{ mb: 1.5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1F2A44", mb: 1 }}>
        {title}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0.75,
        }}
      >
        {values.map((value) => {
          const active = isChecked(filterKey, value);
          return (
            <Button
              key={`${filterKey}-${value}`}
              onClick={() => onFilterChange?.(filterKey, value, !active)}
              sx={timeButtonSx(active)}
            >
              {value}
            </Button>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        p: 2,
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1F1F1F" }}>
          Filter
        </Typography>
        <Button
          size="small"
          onClick={onReset}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "var(--primary-color)",
          }}
        >
          Reset
        </Button>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <SectionTitle>Price Range</SectionTitle>
      {hasPriceData ? (
        <>
          {/* <Typography sx={{ fontSize: 12, color: "#6B7280", mb: 1 }}>
            Starts from {currency} {priceBounds.min.toLocaleString("en-US")} - {currency}{" "}
            {priceBounds.max.toLocaleString("en-US")}
          </Typography> */}
          <Box sx={{ px: 0.5 }}>
            <Slider
              value={[selectedMin, selectedMax]}
              min={priceBounds.min}
              max={priceBounds.max}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              disableSwap
              sx={{
                color: "var(--primary-color)",
                "& .MuiSlider-thumb": {
                  width: 16,
                  height: 16,
                },
              }}
            />
          </Box>
          <Typography sx={{ fontSize: 12, color: "#4B5563", fontWeight: 600 }}>
            {currency} {selectedMin.toLocaleString("en-US")} - {currency}{" "}
            {selectedMax.toLocaleString("en-US")}
          </Typography>
        </>
      ) : (
        <Typography sx={{ fontSize: 12, color: "#6B7280" }}>No price data</Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <SectionTitle>Stops</SectionTitle>
      <FormGroup>
        {stopsToRender.map((label) => {
          const normalizedLabel = normalizeStopLabel(label);
          return (
            <FormControlLabel
              key={label}
              sx={labelSx}
              control={
                <Checkbox
                  size="small"
                  sx={checkboxSx}
                  icon={uncheckedIcon}
                  checkedIcon={checkedIcon}
                  checked={isChecked("stops", label)}
                  onChange={handleCheckboxChange("stops", normalizedLabel)}
                />
              }
              label={toTitleCase(label)}
            />
          );
        })}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <SectionTitle>Airlines</SectionTitle>
      <FormGroup>
        {airlinesToRender.length ? (
          airlinesToRender.map((airlineItem) => {
            const airlineName = getAirlineName(airlineItem);
            const carrierCode = getAirlineCode(airlineItem, airlineName);
            const logoUrl = getAirlineLogoUrl(carrierCode);
            const hasLogoError = Boolean(logoErrors[carrierCode || airlineName]);
            return (
            <FormControlLabel
              key={airlineName || carrierCode}
              sx={{
                ...labelSx,
                "& .MuiTypography-root": {
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  ...labelSx["& .MuiTypography-root"],
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
              control={
                <Checkbox
                  size="small"
                  sx={checkboxSx}
                  icon={uncheckedIcon}
                  checkedIcon={checkedIcon}
                  checked={isChecked("airlines", airlineName)}
                  onChange={handleCheckboxChange("airlines", airlineName)}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
                  {logoUrl && !hasLogoError ? (
                    <Box
                      component="img"
                      src={logoUrl}
                      alt={airlineName || "Airline"}
                      onError={() =>
                        setLogoErrors((prev) => ({
                          ...prev,
                          [carrierCode || airlineName]: true,
                        }))
                      }
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        objectFit: "contain",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        backgroundColor: "#E6EEF7",
                        color: "#6B7A90",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {carrierCode || "NA"}
                    </Box>
                  )}
                  <Box component="span" sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis",fontSize:"10.8px" }}>
                    {toTitleCase(airlineName)}
                  </Box>
                </Box>
              }
            />
            );
          })
        ) : (
          <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
            No airline data
          </Typography>
        )}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <SectionTitle>Refundability</SectionTitle>
      <FormGroup>
        {refundableToRender.map((label) => (
          <FormControlLabel
            key={label}
            sx={labelSx}
            control={
              <Checkbox
                size="small"
                sx={checkboxSx}
                icon={uncheckedIcon}
                checkedIcon={checkedIcon}
                checked={isChecked("refundability", label)}
                onChange={handleCheckboxChange("refundability", label)}
              />
            }
            label={label}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      {enableRouteTimeTabs ? (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              mb: 1.25,
            }}
          >
            <Button
              onClick={() => setActiveTimeTab("departure")}
              sx={timeButtonSx(activeTimeTab === "departure")}
            >
              Departure
            </Button>
            <Button
              onClick={() => setActiveTimeTab("arrival")}
              sx={timeButtonSx(activeTimeTab === "arrival")}
            >
              Arrival
            </Button>
          </Box>

          {activeTimeTab === "departure" ? (
            <>
              {renderRouteTimeGroup(
                `Departure Time ${routeLabels.outboundFrom}`,
                "goDepartTimes",
                departTimesToRender
              )}
              {renderRouteTimeGroup(
                `Departure Time ${routeLabels.inboundFrom}`,
                "backDepartTimes",
                departTimesToRender
              )}
            </>
          ) : (
            <>
              {renderRouteTimeGroup(
                `Arrival Time ${routeLabels.outboundTo}`,
                "goArriveTimes",
                arriveTimesToRender
              )}
              {renderRouteTimeGroup(
                `Arrival Time ${routeLabels.inboundTo}`,
                "backArriveTimes",
                arriveTimesToRender
              )}
            </>
          )}
        </>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              mb: 1.25,
            }}
          >
            <Button
              onClick={() => setActiveTimeTab("departure")}
              sx={timeButtonSx(activeTimeTab === "departure")}
            >
              Departure
            </Button>
            <Button
              onClick={() => setActiveTimeTab("arrival")}
              sx={timeButtonSx(activeTimeTab === "arrival")}
            >
              Arrival
            </Button>
          </Box>

          {activeTimeTab === "departure" ? (
            <Box sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1F2A44", mb: 1 }}>
                Departure Time
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0.75,
                }}
              >
                {departTimesToRender.map((value) => {
                  const active = isChecked("departTimes", value);
                  return (
                    <Button
                      key={`departTimes-${value}`}
                      onClick={() => onFilterChange?.("departTimes", value, !active)}
                      sx={timeButtonSx(active)}
                    >
                      {value}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          ) : (
            <Box sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1F2A44", mb: 1 }}>
                Arrival Time
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0.75,
                }}
              >
                {arriveTimesToRender.map((value) => {
                  const active = isChecked("arriveTimes", value);
                  return (
                    <Button
                      key={`arriveTimes-${value}`}
                      onClick={() => onFilterChange?.("arriveTimes", value, !active)}
                      sx={timeButtonSx(active)}
                    >
                      {value}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default OnewayFlightFilter;
