import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState, useMemo } from "react";
import OneWay from "./OneWay";
import RoundWay from "./RoundWay";
import MultiCity from "./MultiCity";
import useAuth from "../../hooks/useAuth";

const FlightSearchBox = ({ tripType: tripTypeProp, onTripTypeChange, initialSearchParams }) => {
  const [localTripType, setLocalTripType] = useState("one-way");
  const tripType = tripTypeProp ?? localTripType;
  const { currency, setCurrency } = useAuth();
  
  const currencies = useMemo(
    () => [
      { code: "MYR", label: "MYR", flagCode: "my" },
      { code: "BDT", label: "BDT", flagCode: "bd" },
      { code: "USD", label: "USD", flagCode: "us" },
      { code: "GBP", label: "GBP", flagCode: "gb" },
      { code: "INR", label: "INR", flagCode: "in" },
      { code: "PKR", label: "PKR", flagCode: "pk" },
      { code: "EUR", label: "EUR", flagCode: "eu" },
    ],
    []
  );
  
  const getFlagUrl = (flagCode) =>
    `https://flagcdn.com/w20/${flagCode}.png`;

  useEffect(() => {
    if (tripTypeProp) return;
    if (initialSearchParams?.tripType === "round-way") {
      setLocalTripType("round-way");
      return;
    }
    if (initialSearchParams?.tripType === "one-way") {
      setLocalTripType("one-way");
    }
  }, [tripTypeProp, initialSearchParams]);

  const setTripTypeValue = (value) => {
    if (onTripTypeChange) {
      onTripTypeChange(value);
      return;
    }
    setLocalTripType(value);
  };

  const handleTripTypeChange = (event) => {
    setTripTypeValue(event.target.value);
  };

  return (
    <Box sx={{
      backgroundColor: "#FFFFFF",
      borderRadius: "10px",
   
      p: 1.5,
      position: "relative",
    }}>
      {/* Header with Trip Type and Currency */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        {/* Trip Type Radio Buttons */}
        <FormControl component="fieldset">
        <RadioGroup
          row
          value={tripType}
          onChange={handleTripTypeChange}
          sx={{
            display: "flex",
            gap: 3,
            "& .MuiFormControlLabel-root": {
              margin: 0,
            },
          }}
        >
          <FormControlLabel
            value="round-way"
            control={
              <Radio
                sx={{
                  color: tripType === "round-way" ? "var(--secondary-color, #024DAF)" : "#9E9E9E",
                  "&.Mui-checked": {
                    color: "var(--secondary-color, #024DAF)",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: 20,
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: tripType === "round-way" ? "var(--secondary-color, #024DAF)" : "#9E9E9E",
                  ml: 1,
                }}
              >
                Round Way
              </Typography>
            }
          />
          <FormControlLabel
            value="one-way"
            control={
              <Radio
                sx={{
                  color: tripType === "one-way" ? "var(--secondary-color, #024DAF)" : "#9E9E9E",
                  "&.Mui-checked": {
                    color: "var(--secondary-color, #024DAF)",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: 20,
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: tripType === "one-way" ? "var(--secondary-color, #024DAF)" : "#9E9E9E",
                  ml: 1,
                }}
              >
                One Way
              </Typography>
            }
          />
          <FormControlLabel
            value="multi-city"
            control={
              <Radio
                sx={{
                  color: tripType === "multi-city" ? "var(--secondary-color, #024DAF)" : "#9E9E9E",
                  "&.Mui-checked": {
                    color: "var(--secondary-color, #024DAF)",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: 20,
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: tripType === "multi-city" ? "var(--secondary-color, #024DAF)" : "#9E9E9E",
                  ml: 1,
                }}
              >
                Multi City
              </Typography>
            }
          />
        </RadioGroup>
      </FormControl>
      
      {/* Currency Dropdown on the right
      <FormControl variant="standard" sx={{ minWidth: 100 }}>
        <Select
          value={currency || "MYR"}
          onChange={(event) => {
            const nextCurrency = event.target.value;
            setCurrency(nextCurrency);
          }}
          renderValue={(value) => {
            const selected = currencies.find(
              (item) => item.code === value
            );
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <Box
                  component="img"
                  src={selected ? getFlagUrl(selected.flagCode) : ""}
                  alt={selected?.label || "Flag"}
                  sx={{ width: 18, height: 12, borderRadius: "2px" }}
                />
                <Box component="span" sx={{ fontSize: 14, fontWeight: 600 }}>
                  {selected?.label}
                </Box>
              </Box>
            );
          }}
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#123D6E",
            "&:before": { borderBottom: "none" },
            "&:after": { borderBottom: "none" },
            "& .MuiSelect-icon": { color: "#123D6E" },
          }}
          disableUnderline
        >
          {currencies.map((item) => (
            <MenuItem key={item.code} value={item.code}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <Box
                  component="img"
                  src={getFlagUrl(item.flagCode)}
                  alt={`${item.label} flag`}
                  sx={{ width: 18, height: 12, borderRadius: "2px" }}
                />
                <Box component="span">{item.label}</Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      </Box>

      {/* Conditionally render components based on trip type */}
      <Box sx={{ mt: 3 }}>
        {tripType === "round-way" && (
          <RoundWay
            tripType={tripType}
            onRemoveReturn={() => setTripTypeValue("one-way")}
            initialSearchParams={initialSearchParams}
          />
        )}
        {tripType === "one-way" && (
          <OneWay 
            tripType={tripType}
            onAddReturn={() => setTripTypeValue("round-way")} 
            initialSearchParams={initialSearchParams}
          />
        )}
        {tripType === "multi-city" && <MultiCity />}
      </Box>
    </Box>
  );
};

export default FlightSearchBox;
