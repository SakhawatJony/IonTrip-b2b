import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import OneWay from "./OneWay";
import RoundWay from "./RoundWay";
import MultiCity from "./MultiCity";

const FlightSearchBox = ({ tripType: tripTypeProp, onTripTypeChange }) => {
  const [localTripType, setLocalTripType] = useState("one-way");
  const tripType = tripTypeProp ?? localTripType;

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
      borderRadius: "12px",
   
      p: 3,
      position: "relative",
    }}>
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
                  color: tripType === "round-way" ? "#123D6E" : "#9E9E9E",
                  "&.Mui-checked": {
                    color: "#123D6E",
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
                  color: tripType === "round-way" ? "#123D6E" : "#9E9E9E",
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
                  color: tripType === "one-way" ? "#123D6E" : "#9E9E9E",
                  "&.Mui-checked": {
                    color: "#123D6E",
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
                  color: tripType === "one-way" ? "#123D6E" : "#9E9E9E",
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
                  color: tripType === "multi-city" ? "#123D6E" : "#9E9E9E",
                  "&.Mui-checked": {
                    color: "#123D6E",
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
                  color: tripType === "multi-city" ? "#123D6E" : "#9E9E9E",
                  ml: 1,
                }}
              >
                Multi City
              </Typography>
            }
          />
        </RadioGroup>
      </FormControl>

      {/* Conditionally render components based on trip type */}
      <Box sx={{ mt: 3 }}>
        {tripType === "round-way" && <RoundWay />}
        {tripType === "one-way" && (
          <OneWay onAddReturn={() => setTripTypeValue("round-way")} />
        )}
        {tripType === "multi-city" && <MultiCity />}
      </Box>
    </Box>
  );
};

export default FlightSearchBox;
