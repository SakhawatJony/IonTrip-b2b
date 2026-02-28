import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Button,
  MenuItem,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useAuth from "../../../hooks/useAuth";

const titleButtonSx = (active) => ({
  textTransform: "none",
  minWidth: 54,
  height: 30,
  borderRadius: 1,
  fontSize: 12,
  fontWeight: 600,
  border: active ? "1px solid #0F2F56" : "1px solid #E5E7EB",
  backgroundColor: active ? "#0F2F56" : "#FFFFFF",
  color: active ? "#FFFFFF" : "#111827",
  "&:hover": {
    backgroundColor: active ? "#0B2442" : "#F8FAFC",
  },
});

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 38,
    backgroundColor: "#FFFFFF",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--primary-color, #123D6E)",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "8px 12px",
    fontSize: 12,
  },
};

const searchFieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 30,
    backgroundColor: "#FFFFFF",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--primary-color, #123D6E)",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "5px 10px",
    fontSize: 12,
  },
};

const inputLabelSx = {
  fontSize: 12,
  color: "var(--primary-color, #123D6E)",
  mb: 0.5,
};

const pickerPopperSx = {
  "& .MuiPickersDay-root.Mui-selected": {
    backgroundColor: "#123D6E !important",
    color: "#fff",
  },
  "& .MuiPickersDay-root.Mui-selected:hover": {
    backgroundColor: "#123D6E !important",
  },
  "& .MuiPickersDay-root.MuiPickersDay-today": {
    borderColor: "#123D6E !important",
  },
  "& .MuiPickersArrowSwitcher-button": {
    color: "#123D6E !important",
  },
  "& .MuiPickersYear-yearButton.Mui-selected": {
    backgroundColor: "#123D6E",
  },
};

const NATIONALITY_OPTIONS = [
  { value: "Bangladeshi", label: "Bangladeshi", code: "bd" },
  { value: "Malaysian", label: "Malaysian", code: "my" },
  { value: "Indian", label: "Indian", code: "in" },
  { value: "Pakistani", label: "Pakistani", code: "pk" },
  { value: "Indonesian", label: "Indonesian", code: "id" },
  { value: "Singaporean", label: "Singaporean", code: "sg" },
  { value: "Thai", label: "Thai", code: "th" },
  { value: "Emirati", label: "Emirati", code: "ae" },
  { value: "Saudi Arabian", label: "Saudi Arabian", code: "sa" },
  { value: "British", label: "British", code: "gb" },
  { value: "American", label: "American", code: "us" },
  { value: "Canadian", label: "Canadian", code: "ca" },
  { value: "Australian", label: "Australian", code: "au" },
];

const FlightPassenger = ({ index, type, values = {}, onFieldChange }) => {
  const { agentToken, agentData } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
  const agentEmail = agentData?.email || "";
  
  const selectedTitle = values?.title || "Mr";
  const [dateOfBirthOpen, setDateOfBirthOpen] = useState(false);
  const [passportExpiryOpen, setPassportExpiryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const today = dayjs().startOf("day");

  const handleChange = (field) => (event) => {
    if (typeof onFieldChange === "function") {
      onFieldChange(field, event.target.value);
    }
  };

  const parseDateValue = (value) => {
    if (!value) return null;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  };

  const handleDateChange = (field) => (newValue) => {
    if (typeof onFieldChange !== "function") return;
    onFieldChange(field, newValue && newValue.isValid() ? newValue.format("YYYY-MM-DD") : "");
  };

  const getDobRulesByType = (passengerType) => {
    if (passengerType === "Adult") {
      return {
        minDate: today.subtract(120, "year"),
        maxDate: today.subtract(12, "year"),
        helper: "Adult: 12+ years",
      };
    }

    if (passengerType === "Child") {
      return {
        minDate: today.subtract(12, "year").add(1, "day"),
        maxDate: today.subtract(2, "year"),
        helper: "Child: 2 to less than 12 years",
      };
    }

    if (passengerType === "Infant") {
      return {
        minDate: today.subtract(2, "year").add(1, "day"),
        maxDate: today,
        helper: "Infant: 0 to 23 months",
      };
    }

    return {
      minDate: null,
      maxDate: today,
      helper: "Select valid date of birth",
    };
  };

  const dobRules = getDobRulesByType(type);
  const dateOfBirthValue = parseDateValue(values?.dateOfBirth);
  const isDateOfBirthInvalid = Boolean(
    dateOfBirthValue &&
      ((dobRules.minDate && dateOfBirthValue.isBefore(dobRules.minDate, "day")) ||
        (dobRules.maxDate && dateOfBirthValue.isAfter(dobRules.maxDate, "day")))
  );

  const passportExpiryDate = parseDateValue(values?.passportExpiry);
  const isPassportExpiryInvalid = Boolean(
    passportExpiryDate && passportExpiryDate.isBefore(today, "day")
  );
  const getNationalityOption = (value) =>
    NATIONALITY_OPTIONS.find((option) => option.value === value);
  const getFlagUrl = (code) => `https://flagcdn.com/w20/${code}.png`;

  // Search passengers by query
  const searchPassenger = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      return;
    }

    if (!agentToken || !agentEmail) {
      console.warn("Agent token or email missing for passenger search");
      return;
    }

    setSearchLoading(true);
    try {
      const token = agentToken || localStorage.getItem("agentToken") || "";
      const params = new URLSearchParams({
        email: agentEmail,
        q: query.trim(),
      });

      const response = await fetch(`${baseUrl}/passenger/agent/search?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn(`Passenger search failed: ${response.status}`);
        setSearchLoading(false);
        return;
      }

      const data = await response.json();
      const passengers = Array.isArray(data) ? data : data?.data || data?.passengers || [];
      
      setSearchResults(passengers);
      setShowDropdown(passengers.length > 0);
    } catch (error) {
      console.error("Error searching passenger:", error);
    } finally {
      setSearchLoading(false);
    }
  }, [agentToken, agentEmail, baseUrl, onFieldChange]);

  // Map nationality code to full name
  const mapNationalityCode = (code) => {
    const matched = NATIONALITY_OPTIONS.find(
      opt => opt.code.toUpperCase() === code.toUpperCase()
    );
    return matched ? matched.value : null;
  };

  // Normalize gender
  const normalizeGender = (gender) => {
    if (!gender) return "";
    const upper = gender.toUpperCase();
    if (upper === "MALE" || upper === "M") return "Male";
    if (upper === "FEMALE" || upper === "F") return "Female";
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  };

  // Populate form fields with passenger data
  const populatePassengerFields = (passenger) => {
    if (!onFieldChange || !passenger) return;

    if (passenger.title) onFieldChange("title", passenger.title);
    if (passenger.firstName) onFieldChange("firstName", passenger.firstName);
    if (passenger.lastName) onFieldChange("lastName", passenger.lastName);
    
    if (passenger.gender) {
      const normalizedGender = normalizeGender(passenger.gender);
      onFieldChange("gender", normalizedGender);
    }
    
    if (passenger.dateOfBirth) {
      const dob = dayjs(passenger.dateOfBirth);
      if (dob.isValid()) {
        onFieldChange("dateOfBirth", dob.format("YYYY-MM-DD"));
      }
    }
    
    if (passenger.nationality) {
      // Handle both code (MY) and full name (Malaysian)
      const nationality = mapNationalityCode(passenger.nationality) || 
                         NATIONALITY_OPTIONS.find(
                           opt => opt.value.toLowerCase() === passenger.nationality.toLowerCase()
                         )?.value || passenger.nationality;
      onFieldChange("nationality", nationality);
    }
    
    if (passenger.passportNumber) onFieldChange("passportNumber", passenger.passportNumber);
    
    if (passenger.passportExpiryDate) {
      const expiry = dayjs(passenger.passportExpiryDate);
      if (expiry.isValid()) {
        onFieldChange("passportExpiry", expiry.format("YYYY-MM-DD"));
      }
    }
  };

  // Handle passenger selection
  const handlePassengerSelect = (passenger) => {
    populatePassengerFields(passenger);
    setSearchQuery(`${passenger.firstName} ${passenger.lastName} - ${passenger.passportNumber}`);
    setShowDropdown(false);
    setSearchResults([]);
  };

  // Debounce search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchPassenger(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchPassenger]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: 30,
          mb: 1,
        }}
      >
        <Typography
          fontSize={13}
          fontWeight={600}
          color="#111827"
          sx={{ lineHeight: 1 }}
        >
          Passenger #{index}, {type}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            sx={titleButtonSx(selectedTitle === "Mr")}
            onClick={() => onFieldChange?.("title", "Mr")}
          >
            Mr
          </Button>
          <Button
            sx={titleButtonSx(selectedTitle === "Mrs")}
            onClick={() => onFieldChange?.("title", "Mrs")}
          >
            Mrs
          </Button>
          <Button
            sx={titleButtonSx(selectedTitle === "Miss")}
            onClick={() => onFieldChange?.("title", "Miss")}
          >
            Miss
          </Button>
        </Box>
        <Box sx={{ width: 220, position: "relative" }}>
          <Typography sx={inputLabelSx}>Search by</Typography>
          <TextField 
            inputRef={searchInputRef}
            placeholder="Search by first name, last name, or passport number" 
            size="small" 
            fullWidth 
            sx={searchFieldSx}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowDropdown(true);
              }
            }}
            InputProps={{
              endAdornment: searchLoading ? (
                <CircularProgress size={16} sx={{ color: "#123D6E" }} />
              ) : null,
            }}
          />
          {showDropdown && searchResults.length > 0 && (
            <Paper
              ref={dropdownRef}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 0.5,
                maxHeight: 300,
                overflowY: "auto",
                zIndex: 1000,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                border: "1px solid #E5E7EB",
                borderRadius: 1,
              }}
            >
              <List sx={{ p: 0 }}>
                {searchResults.map((passenger) => (
                  <ListItem
                    key={passenger.id}
                    onClick={() => handlePassengerSelect(passenger)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#F6F8FB",
                      },
                      borderBottom: "1px solid #F0F0F0",
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                            {passenger.firstName} {passenger.lastName}
                          </Typography>
                          {passenger.type && (
                            <Typography
                              sx={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: "var(--primary-color, #123D6E)",
                                backgroundColor: "#E3F2FD",
                                px: 1,
                                py: 0.25,
                                borderRadius: 0.5,
                              }}
                            >
                              {passenger.type}
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
                            Passport: {passenger.passportNumber}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
                            DOB: {passenger.dateOfBirth} | {passenger.gender}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography sx={inputLabelSx}>First name <span style={{ color: "#d32f2f" }}>*</span></Typography>
          <TextField
            placeholder="Enter first name"
            size="small"
            fullWidth
            required
            sx={fieldSx}
            value={values?.firstName || ""}
            onChange={handleChange("firstName")}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography sx={inputLabelSx}>Last name <span style={{ color: "#d32f2f" }}>*</span></Typography>
          <TextField
            placeholder="Enter last name"
            size="small"
            fullWidth
            required
            sx={fieldSx}
            value={values?.lastName || ""}
            onChange={handleChange("lastName")}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography sx={inputLabelSx}>Gender <span style={{ color: "#d32f2f" }}>*</span></Typography>
          <TextField
            size="small"
            fullWidth
            required
            sx={fieldSx}
            select
            value={values?.gender || ""}
            onChange={handleChange("gender")}
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography sx={inputLabelSx}>Date of birth <span style={{ color: "#d32f2f" }}>*</span></Typography>
          <DatePicker
            value={parseDateValue(values?.dateOfBirth)}
            onChange={handleDateChange("dateOfBirth")}
            open={dateOfBirthOpen}
            onOpen={() => setDateOfBirthOpen(true)}
            onClose={() => setDateOfBirthOpen(false)}
            format="DD MMM YYYY"
            minDate={dobRules.minDate || undefined}
            maxDate={dobRules.maxDate || undefined}
            slots={{ openPickerIcon: CalendarTodayIcon }}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                required: true,
                sx: fieldSx,
                inputProps: { readOnly: true },
                onClick: () => setDateOfBirthOpen(true),
                error: isDateOfBirthInvalid,
                helperText: isDateOfBirthInvalid
                  ? `Date of birth must match: ${dobRules.helper}`
                  : "",
              },
              openPickerIcon: {
                sx: { fontSize: 18, color: "#93A3B8" },
              },
              popper: {
                sx: pickerPopperSx,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography sx={inputLabelSx}>Nationality <span style={{ color: "#d32f2f" }}>*</span></Typography>
          <TextField
            size="small"
            fullWidth
            required
            sx={fieldSx}
            select
            value={values?.nationality || ""}
            onChange={handleChange("nationality")}
            SelectProps={{
              displayEmpty: true,
              MenuProps: {
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                PaperProps: {
                  sx: {
                    mt: 0.5,
                    maxHeight: 280,
                  },
                },
              },
              renderValue: (selected) => {
                if (!selected) return "Select Nationality";
                const selectedOption = getNationalityOption(selected);
                return (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {selectedOption?.code ? (
                      <Box
                        component="img"
                        src={getFlagUrl(selectedOption.code)}
                        alt={`${selectedOption.label} flag`}
                        sx={{ width: 18, height: 12, borderRadius: "2px", objectFit: "cover" }}
                      />
                    ) : null}
                    <Box component="span">{selectedOption?.label || selected}</Box>
                  </Box>
                );
              },
            }}
          >
            <MenuItem value="">Select Nationality</MenuItem>
            {NATIONALITY_OPTIONS.map((country) => (
              <MenuItem key={country.value} value={country.value}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    component="img"
                    src={getFlagUrl(country.code)}
                    alt={`${country.label} flag`}
                    sx={{ width: 18, height: 12, borderRadius: "2px", objectFit: "cover" }}
                  />
                  <Box component="span">{country.label}</Box>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography sx={inputLabelSx}>Passport number <span style={{ color: "#d32f2f" }}>*</span></Typography>
          <TextField
            placeholder="Enter passport number"
            size="small"
            fullWidth
            required
            sx={fieldSx}
            value={values?.passportNumber || ""}
            onChange={handleChange("passportNumber")}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography sx={inputLabelSx}>Passport expiry <span style={{ color: "#d32f2f" }}>*</span></Typography>
          <DatePicker
            value={parseDateValue(values?.passportExpiry)}
            onChange={handleDateChange("passportExpiry")}
            open={passportExpiryOpen}
            onOpen={() => setPassportExpiryOpen(true)}
            onClose={() => setPassportExpiryOpen(false)}
            format="DD MMM YYYY"
            disablePast
            minDate={today}
            slots={{ openPickerIcon: CalendarTodayIcon }}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                required: true,
                sx: fieldSx,
                inputProps: { readOnly: true },
                onClick: () => setPassportExpiryOpen(true),
                error: isPassportExpiryInvalid,
                helperText: isPassportExpiryInvalid
                  ? "Passport expiry must be today or a future date."
                  : "",
              },
              openPickerIcon: {
                sx: { fontSize: 18, color: "#93A3B8" },
              },
              popper: {
                sx: pickerPopperSx,
              },
            }}
          />
        </Grid>
      </Grid>
      </LocalizationProvider>
    </Box>
  );
};

export default FlightPassenger;
