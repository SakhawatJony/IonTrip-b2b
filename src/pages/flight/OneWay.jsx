import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveRecentSearch } from "../../components/layout/RecentSearches";
import {
  Box,
  TextField,
  Typography,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  Popover,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import FlightData from "../../common/FlightData";
import useAuth from "../../hooks/useAuth";

const OneWay = ({ onAddReturn, initialSearchParams, tripType = "one-way" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currency } = useAuth();
  const normalizedPathname = location.pathname.replace(/\/+$/, "");
  const isDashboardHome = normalizedPathname === "/dashboard";
  const secondaryColor = "var(--secondary-color, #024DAF)";
  const searchButtonColor = isDashboardHome ? secondaryColor : "#525371";
  const searchButtonHoverColor = isDashboardHome ? secondaryColor : "#424055";
  const searchButtonShadow = isDashboardHome
    ? "0px 6px 16px rgba(18,61,110,0.25)"
    : "0px 6px 16px rgba(82,83,113,0.25)";
  
  // Helper function to parse date from initialSearchParams
  const parseInitialDate = () => {
    if (initialSearchParams?.departureDateISO) {
      const parsed = dayjs(initialSearchParams.departureDateISO);
      if (parsed.isValid()) return parsed;
    }
    if (initialSearchParams?.travelDate) {
      const parsed = dayjs(initialSearchParams.travelDate, "ddd, DD MMM YY");
      if (parsed.isValid()) return parsed;
    }
    return dayjs();
  };

  // Initialize state with initialSearchParams if available
  const [from, setFrom] = useState(initialSearchParams?.from || "Dhaka (DAC)");
  const [to, setTo] = useState(initialSearchParams?.to || "Dubai (DXB)");
  const [travelDate, setTravelDate] = useState(parseInitialDate());
  const [travelPickerOpen, setTravelPickerOpen] = useState(false);
  const [returnDate, setReturnDate] = useState("SUN, 06 Oct 23");
  const [showReturnDate, setShowReturnDate] = useState(false);
  const [passengerCounts, setPassengerCounts] = useState(
    initialSearchParams?.passengerCounts || {
      adults: 1,
      children: 0,
      infants: 0,
    }
  );
  const [childAges, setChildAges] = useState(initialSearchParams?.childAges || []);
  const [passengerAnchorEl, setPassengerAnchorEl] = useState(null);
  const [travelClass, setTravelClass] = useState(initialSearchParams?.travelClass || "Economy");
  const [directFlight, setDirectFlight] = useState(initialSearchParams?.directFlight || false);
  const [openField, setOpenField] = useState(null);

  // Update state when initialSearchParams changes
  useEffect(() => {
    if (initialSearchParams) {
      if (initialSearchParams.from) setFrom(initialSearchParams.from);
      if (initialSearchParams.to) setTo(initialSearchParams.to);
      // Parse date - prefer ISO format, fallback to formatted string
      if (initialSearchParams.departureDateISO) {
        const parsedDate = dayjs(initialSearchParams.departureDateISO);
        if (parsedDate.isValid()) {
          setTravelDate(parsedDate);
        }
      } else if (initialSearchParams.travelDate) {
        const parsedDate = dayjs(initialSearchParams.travelDate, "ddd, DD MMM YY");
        if (parsedDate.isValid()) {
          setTravelDate(parsedDate);
        }
      }
      if (initialSearchParams.passengerCounts) {
        setPassengerCounts(initialSearchParams.passengerCounts);
      }
      if (initialSearchParams.childAges) {
        setChildAges(initialSearchParams.childAges);
      }
      if (initialSearchParams.travelClass) {
        setTravelClass(initialSearchParams.travelClass);
      }
      if (initialSearchParams.directFlight !== undefined) {
        setDirectFlight(initialSearchParams.directFlight);
      }
    }
  }, [initialSearchParams]);

  const extractAirportCode = (value) => {
    const match = value?.match(/\(([^)]+)\)/);
    return match ? match[1] : value?.trim() || "";
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const formattedTravelDate = travelDate ? travelDate.format("ddd, DD MMM YY") : "";
    const departureDateISO = travelDate ? travelDate.format("YYYY-MM-DD") : "";
    const fromCode = extractAirportCode(from);
    const toCode = extractAirportCode(to);
    
    const searchData = {
      tripType: tripType || "one-way",
      from,
      to,
      travelDate: formattedTravelDate,
      departureDateISO,
      fromCode,
      toCode,
      passengerCounts,
      childAges,
      travelClass,
      directFlight,
      currency,
    };

    // Save to recent searches
    saveRecentSearch(searchData);

    navigate("/dashboard/onewaysearchresult", {
      state: searchData,
    });
  };

  const formatAddress = (address) => (address ? address.replace(",", ", ") : "");

  const formatAirportLabel = (airport) => {
    const city = airport?.Address?.split(",")[0] || airport?.name || "";
    return `${city} (${airport.code})`;
  };

  const getFilteredAirports = (value) => {
    const query = value.trim().toLowerCase();
    if (!query) {
      return FlightData.slice(0, 7);
    }
    const normalizedQuery = query.replace(/\s*\(.*?\)\s*/g, " ").trim();
    const q = normalizedQuery || query;

    // Rank matches so airport code results appear first (e.g., typing "kul" shows KUL on top).
    const rankedMatches = FlightData.map((airport) => {
      const code = airport.code?.toLowerCase() || "";
      const name = airport.name?.toLowerCase() || "";
      const address = airport.Address?.toLowerCase() || "";

      const codeStarts = code.startsWith(q);
      const codeIncludes = code.includes(q);
      const nameIncludes = name.includes(q);
      const addressIncludes = address.includes(q);

      if (!codeIncludes && !nameIncludes && !addressIncludes) return null;

      // Lower score = higher priority.
      let score = 50;
      if (codeStarts) score = 0;
      else if (codeIncludes) score = 10;
      else if (nameIncludes) score = 20;
      else if (addressIncludes) score = 30;

      return { airport, score };
    })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score)
      .slice(0, 8)
      .map((item) => item.airport);

    return rankedMatches.length ? rankedMatches : FlightData.slice(0, 7);
  };

  const handleSelectAirport = (airport, field) => {
    const label = formatAirportLabel(airport);
    if (field === "from") {
      setFrom(label);
    } else {
      setTo(label);
    }
    setOpenField(null);
  };

  const labelSx = {
    fontSize: 12,
    fontWeight: 600,
    color: "#1F4D8B",
    lineHeight: 1.2,
    height: "16px",
  };

  const inputContainerSx = {
    backgroundColor: "#F6F8FB",
    borderRadius: 1.5,
    border: "1px solid var(--secondary-color, #024DAF)",
    px: 1.5,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    height: "46px",
    minHeight: "46px",
    width: "100%",
    minWidth: 0,
  };

  const inlineInputSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "transparent",
      borderRadius: 0,
      height: "46px",
      minHeight: "46px",
      paddingLeft: "0px",
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: "none",
      },
    },
    "& .MuiInputBase-input": {
      fontSize: 15,
      fontWeight: 600,
      color: "#1F2A44",
      py: 0,
      height: "46px",
      padding: "0 !important",
    },
    "& .MuiInputAdornment-positionStart": {
      marginRight: "6px",
    },
  };

  const boxedFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#F6F8FB",
      borderRadius: 1.5,
      height: "46px",
      minHeight: "46px",
      "& fieldset": {
        border: "1px solid var(--secondary-color, #024DAF)",
      },
      "&:hover fieldset": {
        border: "1px solid var(--secondary-color, #024DAF)",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid var(--secondary-color, #024DAF)",
      },
    },
    "& .MuiInputBase-input": {
      fontSize: 15,
      fontWeight: 600,
      color: "#1F2A44",
      py: 0,
      height: "46px",
    },
  };

  const addReturnBoxSx = {
    backgroundColor: "#F6F8FB",
    borderRadius: 1.5,
    border: "1px solid var(--secondary-color, #024DAF)",
    height: "46px",
    minHeight: "46px",
    display: "flex",
    alignItems: "center",
    px: 1.5,
  };

  const suggestionMenuSx = {
    position: "absolute",
    top: "48px",
    left: 0,
    width: 340,
    minWidth: "100%",
    zIndex: 20,
    backgroundColor: "#FFFFFF",
    border: "1px solid var(--secondary-color, #024DAF)",
    borderRadius: 1.5,
    boxShadow: "0px 6px 16px rgba(18,61,110,0.12)",
    maxHeight: 280,
    overflowY: "auto",
  };

  const suggestionItemSx = {
    px: 1.5,
    py: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 1.25,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#F6F8FB",
    },
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleClearFrom = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setFrom("");
    setOpenField("from");
  };

  const handleClearTo = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setTo("");
    setOpenField("to");
  };

  const totalPassengers =
    passengerCounts.adults + passengerCounts.children + passengerCounts.infants;

  const passengerLabel = `${totalPassengers} ${
    totalPassengers === 1 ? "Traveler" : "Passengers"
  }, ${travelClass}`;

  const handlePassengerChange = (field, delta) => {
    setPassengerCounts((prev) => {
      const nextValue = Math.max(0, (prev[field] || 0) + delta);
      if (field === "adults") {
        return { ...prev, adults: Math.max(1, nextValue) };
      }
      if (field === "children") {
        const nextChildren = nextValue;
        setChildAges((prevAges) => {
          if (nextChildren > prevAges.length) {
            return [...prevAges, ...Array(nextChildren - prevAges.length).fill(11)];
          }
          return prevAges.slice(0, nextChildren);
        });
      }
      return { ...prev, [field]: nextValue };
    });
  };

  const childAgeOptions = useMemo(
    () => Array.from({ length: 10 }, (_, index) => 2 + index),
    []
  );

  return (
    <Box component="form" onSubmit={handleSearch} noValidate>
      {/* Top Section - Input Fields */}
      <Grid container spacing={1} alignItems="stretch">
        {/* From and To Fields in One Container */}
        <Grid item xs={12} sm={6} md={5}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column", width: "100%" }}>
            {/* Labels Row */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, gap: 1.5 }}>
              <Typography sx={{ ...labelSx, flex: 1 }}>
                From
              </Typography>
              <Box sx={{ width: "20px", display: "flex", justifyContent: "center" }} />
              <Typography sx={{ ...labelSx, flex: 1 }}>
                To
              </Typography>
            </Box>
            {/* Input Container */}
            <Box
              sx={inputContainerSx}
            >
              {/* From Input */}
              <Box sx={{ flex: 1, position: "relative", minWidth: 0 }}>
                <TextField
                  fullWidth
                  value={from}
                  placeholder="Leaving from"
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setOpenField("from");
                  }}
                  onFocus={(e) => {
                    setOpenField("from");
                    e.target.select();
                  }}
                  onBlur={() => {
                    setTimeout(() => setOpenField(null), 100);
                  }}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0.75 }}>
                        <LocationOnIcon sx={{ fontSize: 18, color: "#93A3B8" }} />
                      </InputAdornment>
                    ),
                    endAdornment: openField === "from" && from ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onMouseDown={handleClearFrom}
                          onClick={handleClearFrom}
                          sx={{ color: "#93A3B8", }}
                        >
                          <CloseIcon sx={{ fontSize: 16, }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                  sx={{
                    ...inlineInputSx,
                    "& .MuiInputBase-input": {
                      ...inlineInputSx["& .MuiInputBase-input"],
                      paddingRight: openField === "from" && from ? "32px" : "0px",
                    },
                  }}
                />
                {openField === "from" && (
                  <Box sx={suggestionMenuSx}>
                    {getFilteredAirports(from).map((airport) => (
                      <Box
                        key={`${airport.code}-${airport.name}`}
                        sx={suggestionItemSx}
                        onMouseDown={() => handleSelectAirport(airport, "from")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: "#1F4D8B",
                              minWidth: 46,
                            }}
                          >
                            {airport.code}
                          </Typography>

                          <LocalAirportIcon sx={{ fontSize: 16, color: "#93A3B8", flexShrink: 0 }} />

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#1F2A44",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {airport.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#6B7A90",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {formatAddress(airport.Address)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Swap Icon */}
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1,
                  backgroundColor: "#1F4D8B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#163B6A",
                  },
                }}
                onClick={handleSwap}
              >
                <SwapHorizIcon
                  sx={{
                    fontSize: 18,
                    color: "#FFFFFF",
                  }}
                />
              </Box>

              {/* To Input */}
              <Box sx={{ flex: 1, position: "relative", minWidth: 0 }}>
                <TextField
                  fullWidth
                  value={to}
                  placeholder="Going to"
                  onChange={(e) => {
                    setTo(e.target.value);
                    setOpenField("to");
                  }}
                  onFocus={(e) => {
                    setOpenField("to");
                    e.target.select();
                  }}
                  onBlur={() => {
                    setTimeout(() => setOpenField(null), 100);
                  }}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0.75 }}>
                        <LocationOnIcon sx={{ fontSize: 18, color: "#93A3B8" }} />
                      </InputAdornment>
                    ),
                    endAdornment: openField === "to" && to ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onMouseDown={handleClearTo}
                          onClick={handleClearTo}
                          sx={{ color: "#93A3B8" }}
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                  sx={{
                    ...inlineInputSx,
                    "& .MuiInputBase-input": {
                      ...inlineInputSx["& .MuiInputBase-input"],
                      paddingRight: openField === "to" && to ? "32px" : "0px",
                    },
                  }}
                />
                {openField === "to" && (
                  <Box sx={suggestionMenuSx}>
                    {getFilteredAirports(to).map((airport) => (
                      <Box
                        key={`${airport.code}-${airport.name}`}
                        sx={suggestionItemSx}
                        onMouseDown={() => handleSelectAirport(airport, "to")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: "#1F4D8B",
                              minWidth: 46,
                            }}
                          >
                            {airport.code}
                          </Typography>

                          <LocalAirportIcon sx={{ fontSize: 16, color: "#93A3B8", flexShrink: 0 }} />

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#1F2A44",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {airport.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#6B7A90",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {formatAddress(airport.Address)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Travel Date Field */}
        <Grid item xs={12} sm={6} md={2.2}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography sx={{ ...labelSx, mb: 0.5 }}>
              Travel Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={travelDate}
                onChange={(newValue) => setTravelDate(newValue)}
                open={travelPickerOpen}
                onOpen={() => setTravelPickerOpen(true)}
                onClose={() => setTravelPickerOpen(false)}
                disablePast
                minDate={dayjs()}
                format="ddd, DD MMM YY"
                slots={{ openPickerIcon: CalendarTodayIcon }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    sx: {
                      ...boxedFieldSx,
                      "& .MuiInputBase-input": {
                        ...boxedFieldSx["& .MuiInputBase-input"],
                        fontSize: 15,
                        textOverflow: "clip",
                      },
                    },
                    onClick: () => setTravelPickerOpen(true),
                    inputProps: { readOnly: true },
                  },
                  openPickerIcon: {
                    sx: { fontSize: 18, color: "#93A3B8" },
                  },
                  popper: {
                    sx: {
                      "& .MuiPickersDay-root.Mui-selected": {
                        backgroundColor: "var(--secondary-color, #024DAF) !important",
                        color: "#fff",
                      },
                      "& .MuiPickersDay-root.Mui-selected:hover": {
                        backgroundColor: "var(--secondary-color, #024DAF) !important",
                      },
                      "& .MuiPickersDay-root.MuiPickersDay-today": {
                        borderColor: "var(--secondary-color, #024DAF) !important",
                      },
                      "& .MuiPickersArrowSwitcher-button": {
                        color: "var(--secondary-color, #024DAF) !important",
                      },
                      "& .MuiPickersYear-yearButton.Mui-selected": {
                        backgroundColor: "var(--secondary-color, #024DAF)",
                      },
                    },
                  },
                }}
                sx={{
                  "& .MuiPickersCalendarHeader-label": {
                    color: "#1F2A44",
                    fontWeight: 600,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Grid>

        {/* Return Date Field */}
        {showReturnDate ? (
          <Grid item xs={12} sm={6} md={2.2}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography sx={{ ...labelSx, mb: 0.5 }}>
                Return Date
              </Typography>
              <TextField
                fullWidth
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayIcon
                        sx={{ fontSize: 18, color: "#93A3B8" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={boxedFieldSx}
              />
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12} sm={6} md={2.2}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <Typography sx={{ ...labelSx, mb: 0.5 }}>
                Return Date
              </Typography>
              <Box
                sx={{
                  ...addReturnBoxSx,
                }}
              >
                <Button
                  variant="text"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => {
                    if (onAddReturn) {
                      onAddReturn();
                      return;
                    }
                    setShowReturnDate(true);
                  }}
                  sx={{
                    color: "var(--primary-color)",
                    textTransform: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    justifyContent: "flex-start",
                    px: 0,
                    minWidth: 0,
                  }}
                >
                  Add Return
                </Button>
              </Box>
            </Box>
          </Grid>
        )}

        {/* Passenger & Class Field */}
        <Grid item xs={12} sm={6} md={2.5}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography sx={{ ...labelSx, mb: 0.5 }}>
              Passenger & Class
            </Typography>
            <TextField
              fullWidth
              value={passengerLabel}
              
              onClick={(event) => setPassengerAnchorEl(event.currentTarget)}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PersonIcon sx={{ fontSize: 18, color: "#93A3B8" }} />
                  </InputAdornment>
                ),
              }}
              inputProps={{ readOnly: true }}
              sx={{
                ...boxedFieldSx,
                "& .MuiInputBase-input": {
                  ...boxedFieldSx["& .MuiInputBase-input"],
                  fontSize: 15,
                },
              }}
            />
            <Popover
              open={Boolean(passengerAnchorEl)}
              anchorEl={passengerAnchorEl}
              onClose={() => setPassengerAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{
                sx: {
                  mt: 1,
                  width: 280,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: "0px 8px 24px rgba(18,61,110,0.18)",
                },
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1F2A44", mb: 1 }}>
                Passenger
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  { key: "adults", label: "Adult (12+ Years)" },
                  { key: "children", label: "Children (2 - 11 years)" },
                ].map((row) => (
                  <Box
                    key={row.key}
                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#1F2A44" }}>
                      {row.label}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handlePassengerChange(row.key, -1)}
                        disabled={row.key === "adults" ? passengerCounts.adults <= 1 : passengerCounts[row.key] <= 0}
                        sx={{ color: "var(--primary-color)" }}
                      >
                        <RemoveCircleOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, width: 16, textAlign: "center" }}>
                        {passengerCounts[row.key]}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handlePassengerChange(row.key, 1)}
                        sx={{ color: "var(--primary-color)" }}
                      >
                        <AddCircleOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
                {passengerCounts.children > 0 && (
                  <Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "var(--red-dark)" }}>
                      Select Age of Children
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "var(--red-dark)" }}>
                      Must be accurate when booking
                    </Typography>
                    <Box sx={{ mt: 0.75, display: "flex", flexDirection: "column", gap: 0.5 }}>
                      {childAges.map((age, index) => (
                        <Box
                          key={`child-age-${index}`}
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#1F2A44" }}>
                            Child {index + 1}
                          </Typography>
                          <Select
                            size="small"
                            value={age}
                            onChange={(event) => {
                              const value = Number(event.target.value);
                              setChildAges((prevAges) => {
                                const next = [...prevAges];
                                next[index] = value;
                                return next;
                              });
                            }}
                            sx={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#1F2A44",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--secondary-color, #024DAF)",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--secondary-color, #024DAF)",
                              },
                            }}
                          >
                            {childAgeOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#1F2A44" }}>
                    Infant (Under 2 years)
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handlePassengerChange("infants", -1)}
                      disabled={passengerCounts.infants <= 0}
                      sx={{ color: "var(--primary-color)" }}
                    >
                      <RemoveCircleOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, width: 16, textAlign: "center" }}>
                      {passengerCounts.infants}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handlePassengerChange("infants", 1)}
                      sx={{ color: "var(--primary-color)" }}
                    >
                      <AddCircleOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ pt: 1.5, borderTop: "1px solid #E6EDF5" }}>
                  <RadioGroup
                    value={travelClass}
                    onChange={(event) => setTravelClass(event.target.value)}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 0.5,
                      "& .MuiFormControlLabel-root": {
                        margin: 0,
                      },
                    }}
                  >
                    {["Economy", "Business", "First Class", "Premium Economy"].map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={
                          <Radio
                            size="small"
                            sx={{
                              color: "var(--primary-color)",
                              "&.Mui-checked": {
                                color: "var(--primary-color)",
                              },
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: 12, color: "#1F2A44", whiteSpace: "nowrap" }}>
                            {option}
                          </Typography>
                        }
                      />
                    ))}
                  </RadioGroup>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => setPassengerAnchorEl(null)}
                      sx={{
                        backgroundColor: "var(--primary-color)",
                        textTransform: "none",
                        borderRadius: 1.5,
                        fontSize: 12,
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "var(--primary-color)",
                          opacity: 0.9,
                        },
                      }}
                    >
                      Done
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Popover>
          </Box>
        </Grid>
      </Grid>

      {/* Options Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          width: "100%",
          gap: 2,
          mt: 3,
          mb: 1,
        }}
      >
        {/* Left Side: Direct Flight and Student Fare */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          {/* Direct Flight Checkbox */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={directFlight}
              onChange={(e) => setDirectFlight(e.target.checked)}
              sx={{
                color: "#9E9E9E",
                "&.Mui-checked": {
                  color: "#123D6E",
                },
                p: 0.5,
              }}
            />
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 400,
                color: "#444444",
              }}
            >
              Direct Flight
            </Typography>
          </Box>

          {/* Student Fare Dropdown */}
          <FormControl
            variant="standard"
            sx={{
              minWidth: 120,
              "& .MuiInput-underline:before": {
                borderBottom: "none",
              },
              "& .MuiInput-underline:hover:before": {
                borderBottom: "none",
              },
              "& .MuiInput-underline:after": {
                borderBottom: "none",
              },
            }}
          >
            <Select
              value=""
              displayEmpty
              sx={{
                fontSize: 14,
                fontWeight: 400,
                color: "#444444",
                "& .MuiSelect-icon": {
                  color: "#444444",
                },
                "&:before": {
                  borderBottom: "none",
                },
                "&:after": {
                  borderBottom: "none",
                },
              }}
            >
              <MenuItem value="">
                <Typography sx={{ fontSize: 14, color: "#444444" }}>
                  Student Fare
                </Typography>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Right Side: Preferred Airlines */}
        <FormControl
          variant="standard"
          sx={{
            minWidth: 150,
            "& .MuiInput-underline:before": {
              borderBottom: "none",
            },
            "& .MuiInput-underline:hover:before": {
              borderBottom: "none",
            },
            "& .MuiInput-underline:after": {
              borderBottom: "none",
            },
          }}
        >
          <Select
            value=""
            displayEmpty
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: "#444444",
              "& .MuiSelect-icon": {
                color: "#444444",
              },
              "&:before": {
                borderBottom: "none",
              },
              "&:after": {
                borderBottom: "none",
              },
            }}
          >
            <MenuItem value="">
              <Typography sx={{ fontSize: 14, color: "#444444" }}>
                Preferred Airlines
              </Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Search Button - Centered at Bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: location.pathname === "/dashboard/onewaysearchresult" ? "10px" : "-18px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Button
          startIcon={<SendIcon sx={{ fontSize: 16 }} />}
          type="submit"
          sx={{
            backgroundColor: searchButtonColor,
            color: "#fff",
            px: 2.5,
            height: "35px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: searchButtonShadow,
            "&:hover": {
              backgroundColor: searchButtonColor,
            },
          }}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
};

export default OneWay;