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

const RoundWayFlightFilter = ({
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
  currency = "USD",
  onPriceRangeChange,
  onFilterChange,
  onReset,
}) => {
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
      fontSize: 13,
      color: "#444444",
      fontWeight: 500,
    },
    my: 0.25,
  };

  const normalizeStopLabel = (label) => {
    const value = String(label || "").toLowerCase();
    if (value.includes("non")) return "Non Stop";
    if (value.includes("one stop") || value === "1 stop") return "One Stop";
    return "One Plus Stops";
  };

  const handleCheckboxChange = (filterType, value) => (event) => {
    onFilterChange?.(filterType, value, event.target.checked);
  };

  const isChecked = (filterType, value) => {
    const checkedValue = filterType === "stops" ? normalizeStopLabel(value) : value;
    return (filterState[filterType] || []).includes(checkedValue);
  };

  const fallbackStops = ["Non Stop", "One Stop", "One Plus Stops"];
  const fallbackTimes = [
    "12:00am - 04:59am",
    "05:00am - 11:59am",
    "12:00pm - 05:59pm",
    "06:00pm - 11:59pm",
  ];
  const stopsToRender = stops.length ? stops : fallbackStops;
  const refundableToRender = refundableOptions.length ? refundableOptions : ["Non Refundable", "Refundable"];
  const departTimesToRender = departTimes.length ? departTimes : fallbackTimes;
  const arriveTimesToRender = arriveTimes.length ? arriveTimes : fallbackTimes;
  const hasPriceData =
    Number.isFinite(priceBounds?.min) &&
    Number.isFinite(priceBounds?.max) &&
    priceBounds.max >= priceBounds.min;
  const selectedMin = Number.isFinite(filterState?.minPrice) ? filterState.minPrice : priceBounds.min;
  const selectedMax = Number.isFinite(filterState?.maxPrice) ? filterState.maxPrice : priceBounds.max;

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
          <Typography sx={{ fontSize: 12, color: "#6B7280", mb: 1 }}>
            {currency} {priceBounds.min.toLocaleString("en-US")} - {currency}{" "}
            {priceBounds.max.toLocaleString("en-US")}
          </Typography>
          <Slider
            value={[selectedMin, selectedMax]}
            min={priceBounds.min}
            max={priceBounds.max}
            onChange={(_, value) => {
              if (!Array.isArray(value) || value.length !== 2) return;
              onPriceRangeChange?.(value[0], value[1]);
            }}
            valueLabelDisplay="auto"
            disableSwap
            sx={{ color: "var(--primary-color)" }}
          />
        </>
      ) : (
        <Typography sx={{ fontSize: 12, color: "#6B7280" }}>No price data</Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <SectionTitle>Stops</SectionTitle>
      <FormGroup>
        {stopsToRender.map((label) => (
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
                onChange={handleCheckboxChange("stops", normalizeStopLabel(label))}
              />
            }
            label={label}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <SectionTitle>Airlines</SectionTitle>
      <FormGroup>
        {airlines.map((label) => (
          <FormControlLabel
            key={label}
            sx={labelSx}
            control={
              <Checkbox
                size="small"
                sx={checkboxSx}
                icon={uncheckedIcon}
                checkedIcon={checkedIcon}
                checked={isChecked("airlines", label)}
                onChange={handleCheckboxChange("airlines", label)}
              />
            }
            label={label}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <SectionTitle>Departure Time - Dhaka</SectionTitle>
      <FormGroup>
        {departTimesToRender.map((label) => (
          <FormControlLabel
            key={label}
            sx={labelSx}
            control={
              <Checkbox
                size="small"
                sx={checkboxSx}
                icon={uncheckedIcon}
                checkedIcon={checkedIcon}
                checked={isChecked("departTimes", label)}
                onChange={handleCheckboxChange("departTimes", label)}
              />
            }
            label={label}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <SectionTitle>Arrival Time - Dubai</SectionTitle>
      <FormGroup>
        {arriveTimesToRender.map((label) => (
          <FormControlLabel
            key={label}
            sx={labelSx}
            control={
              <Checkbox
                size="small"
                sx={checkboxSx}
                icon={uncheckedIcon}
                checkedIcon={checkedIcon}
                checked={isChecked("arriveTimes", label)}
                onChange={handleCheckboxChange("arriveTimes", label)}
              />
            }
            label={label}
          />
        ))}
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
    </Box>
  );
};

export default RoundWayFlightFilter;
