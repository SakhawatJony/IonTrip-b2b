import React from "react";
import {
  Box,
  Typography,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";

const SectionTitle = ({ children }) => (
  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#2A2A2A", mb: 1 }}>
    {children}
  </Typography>
);

const OnewayFlightFilter = () => {
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

  const stops = ["Non Stops", "One Stops", "One Plus Stops"];
  const airlines = [
    "US Bangla Airlines",
    "Biman Bangladesh",
    "Novo Air",
    "American Airlines",
    "Emirates",
  ];
  const departTimes = [
    "12:00am - 04:59am",
    "05:00am - 11:59am",
    "12:00pm - 05:59pm",
    "06:00pm - 11:59pm",
  ];
  const arriveTimes = [
    "12:00am - 04:59am",
    "05:00am - 11:59am",
    "12:00pm - 05:59pm",
    "06:00pm - 11:59pm",
  ];

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

      <SectionTitle>Stops</SectionTitle>
      <FormGroup>
        {stops.map((label) => (
          <FormControlLabel
            key={label}
            sx={labelSx}
            control={
              <Checkbox
                size="small"
                sx={checkboxSx}
                icon={uncheckedIcon}
                checkedIcon={checkedIcon}
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
              />
            }
            label={label}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <SectionTitle>Departure Time - Dhaka</SectionTitle>
      <FormGroup>
        {departTimes.map((label) => (
          <FormControlLabel
            key={label}
            sx={labelSx}
            control={
              <Checkbox
                size="small"
                sx={checkboxSx}
                icon={uncheckedIcon}
                checkedIcon={checkedIcon}
              />
            }
            label={label}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <SectionTitle>Arrival Time - Dubai</SectionTitle>
      <FormGroup>
        {arriveTimes.map((label) => (
          <FormControlLabel
            key={label}
            sx={labelSx}
            control={
              <Checkbox
                size="small"
                sx={checkboxSx}
                icon={uncheckedIcon}
                checkedIcon={checkedIcon}
              />
            }
            label={label}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default OnewayFlightFilter;
