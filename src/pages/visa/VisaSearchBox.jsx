import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation, useNavigate } from "react-router-dom";

const COUNTRIES = [
  "India",
  "United Arab Emirates",
  "Thailand",
  "Malaysia",
  "Singapore",
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Saudi Arabia",
  "Qatar",
  "Turkey",
  "Japan",
  "Bangladesh",
];

const VISA_TYPES = [
  "Tourist Visa",
  "Business Visa",
  "Transit Visa",
  "Student Visa",
  "Work Visa",
  "Visit Visa",
];

/** Section title shown above each grey field box */
const sectionLabelSx = {
  fontSize: 14,
  fontWeight: 700,
  color: "var(--primary-color, #123D6E)",
  lineHeight: 1.3,
  mb: 0.75,
  display: "block",
};

/**
 * Same bg/border as flight OneWay inputs; taller box (previous visa layout ~72px).
 */
const fieldShellSx = {
  backgroundColor: "#F6F8FB",
  borderRadius: 1.5,
  border: "1px solid var(--secondary-color, #024DAF)",
  px: 1.5,
  py: 1.25,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  position: "relative",
  minHeight: 72,
  height: "100%",
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

/** Typography matches OneWay; height follows tall field shell */
const selectSx = {
  fontSize: 15,
  fontWeight: 600,
  color: "#1F2A44",
  width: "100%",
  flex: 1,
  "&:before": { borderBottom: "none" },
  "&:after": { borderBottom: "none" },
  "& .MuiSelect-select": {
    py: 0,
    px: 0,
    minHeight: 44,
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  "& .MuiSelect-icon": {
    color: "var(--secondary-color, #024DAF)",
    right: 0,
    top: "calc(50% - 12px)",
  },
};

/** Visa-type column: extra right padding for person icon + chevron */
const visaTypeSelectSx = {
  ...selectSx,
  "& .MuiSelect-select": {
    ...selectSx["& .MuiSelect-select"],
    pr: "40px",
  },
};

/**
 * Visa search row: Country + Visa Type (design reference) + Search button
 * aligned like flight OneWay (pill button, bottom center overlap).
 */
const VisaSearchBox = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const normalizedPathname = location.pathname.replace(/\/+$/, "");
  const isDashboardHome = normalizedPathname === "/dashboard";

  const [country, setCountry] = useState("India");
  const [visaType, setVisaType] = useState("Tourist Visa");

  const secondaryColor = "var(--secondary-color, #024DAF)";
  const searchButtonColor = isDashboardHome ? secondaryColor : "#525371";
  const searchButtonHoverColor = isDashboardHome ? secondaryColor : "#424055";
  const searchButtonShadow = isDashboardHome
    ? "0px 6px 16px rgba(18,61,110,0.25)"
    : "0px 6px 16px rgba(82,83,113,0.25)";

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/dashboard/visa/bookings", {
      state: { country, visaType },
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        p: 1.5,
        position: "relative",
        pb: 4,
      }}
    >
      <Box component="form" onSubmit={handleSearch} noValidate>
        <Grid container spacing={1.25} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <Typography component="label" htmlFor="visa-country-select" sx={sectionLabelSx}>
                Country
              </Typography>
              <Box sx={fieldShellSx}>
                <Select
                  id="visa-country-select"
                  value={country}
                  onChange={(ev) => setCountry(ev.target.value)}
                  variant="standard"
                  disableUnderline
                  fullWidth
                  displayEmpty
                  inputProps={{ "aria-label": "Country" }}
                  sx={selectSx}
                  MenuProps={{
                    PaperProps: { sx: { maxHeight: 280, borderRadius: 2 } },
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <MenuItem key={c} value={c} sx={{ fontSize: 15, fontWeight: 600 }}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <Typography component="label" htmlFor="visa-type-select" sx={sectionLabelSx}>
                Visa Type
              </Typography>
              <Box sx={{ ...fieldShellSx, pr: 4 }}>
              <PersonIcon
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 32,
                  fontSize: 20,
                  color: "var(--secondary-color, #024DAF)",
                  opacity: 0.55,
                  pointerEvents: "none",
                }}
                aria-hidden
              />
              <Select
                id="visa-type-select"
                value={visaType}
                onChange={(ev) => setVisaType(ev.target.value)}
                variant="standard"
                disableUnderline
                fullWidth
                displayEmpty
                inputProps={{ "aria-label": "Visa type" }}
                sx={visaTypeSelectSx}
                MenuProps={{
                  PaperProps: { sx: { maxHeight: 280, borderRadius: 2 } },
                }}
              >
                {VISA_TYPES.map((v) => (
                  <MenuItem key={v} value={v} sx={{ fontSize: 15, fontWeight: 600 }}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Same placement as OneWay.jsx search CTA */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-18px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Button
            startIcon={<SendIcon sx={{ fontSize: 18 }} />}
            type="submit"
            sx={{
              backgroundColor: searchButtonColor,
              color: "#fff",
              px: 4.5,
              height: "42px",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: searchButtonShadow,
              "&:hover": {
                backgroundColor: searchButtonHoverColor,
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VisaSearchBox;
