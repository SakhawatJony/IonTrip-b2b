import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarMonthYearSelectHeader from "../../components/pickers/CalendarMonthYearSelectHeader";
import { IONTRIP_CALENDAR_MENU_CONTAINER_ID } from "../../constants/calendarMenuContainer";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";

/** Matches VisaSearchBox — label above each field */
const sectionLabelSx = {
  fontSize: 14,
  fontWeight: 700,
  color: "var(--primary-color, #123D6E)",
  lineHeight: 1.3,
  mb: 0.75,
  display: "block",
};

/** Matches VisaSearchBox field shell */
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

/** Value text — same weight/color family as Visa Select */
const valueSx = {
  fontSize: 15,
  fontWeight: 600,
  color: "#1F2A44",
  lineHeight: 1.35,
};

/** Corner icon — same as Visa PersonIcon */
const shellIconSx = {
  position: "absolute",
  top: 12,
  right: 32,
  pointerEvents: "none",
  color: "var(--secondary-color, #024DAF)",
  opacity: 0.55,
};

function HotelFieldColumn({
  label,
  htmlFor,
  onShellClick,
  icon,
  valueNode,
  flex,
  children,
  shellSx,
  compact,
}) {
  const resolvedLabelSx = compact
    ? {
        ...sectionLabelSx,
        fontSize: 11,
        fontWeight: 700,
        color: "var(--secondary-color, #024DAF)",
        letterSpacing: 0.04,
      }
    : sectionLabelSx;
  const resolvedShell = {
    ...fieldShellSx,
    ...(compact
      ? {
          minHeight: 56,
          py: 1,
        }
      : {}),
    ...shellSx,
  };
  const interactive = Boolean(onShellClick);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: flex ?? { xs: "1 1 auto", md: "1 1 0%" },
        minWidth: 0,
      }}
    >
      <Typography
        component={htmlFor ? "label" : "div"}
        htmlFor={htmlFor}
        sx={resolvedLabelSx}
      >
        {label}
      </Typography>
      <Box
        onClick={onShellClick}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onShellClick?.(e);
                }
              }
            : undefined
        }
        sx={{
          ...resolvedShell,
          cursor: interactive ? "pointer" : "default",
          transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          ...(interactive
            ? {
                "&:hover": {
                  boxShadow: "0 2px 10px rgba(2, 77, 175, 0.12)",
                },
              }
            : {}),
        }}
      >
        {icon ? (
          <Box
            component="span"
            sx={{
              ...shellIconSx,
              ...(compact ? { color: "var(--secondary-color, #024DAF)", opacity: 0.75 } : {}),
            }}
            aria-hidden
          >
            {icon}
          </Box>
        ) : null}
        {valueNode ? <Box sx={{ pr: icon ? 3.5 : 0 }}>{valueNode}</Box> : null}
        {children}
      </Box>
    </Box>
  );
}

/**
 * @param {{ variant?: "default" | "compact"; initialSearch?: { destination?: string; checkIn?: string; checkOut?: string; rooms?: number; adults?: number } | null }} props
 */
const HotelSearchBox = ({ variant = "default", initialSearch = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const normalizedPathname = location.pathname.replace(/\/+$/, "");
  const isDashboardHome = normalizedPathname === "/dashboard";
  const isCompact = variant === "compact";

  const [destination, setDestination] = useState("Dhaka");
  const [checkIn, setCheckIn] = useState(() => dayjs());
  const [checkOut, setCheckOut] = useState(() => dayjs().add(3, "day"));
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);

  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [datePickerTarget, setDatePickerTarget] = useState(null);

  const [guestAnchorEl, setGuestAnchorEl] = useState(null);

  useEffect(() => {
    if (!initialSearch) return;
    const { destination: d, checkIn: ci, checkOut: co, rooms: r, adults: ad } = initialSearch;
    if (d != null && d !== "") setDestination(d);
    if (ci) {
      const nextIn = dayjs(ci);
      if (nextIn.isValid()) setCheckIn(nextIn);
    }
    if (co) {
      const nextOut = dayjs(co);
      if (nextOut.isValid()) setCheckOut(nextOut);
    }
    if (typeof r === "number" && r >= 1) setRooms(r);
    if (typeof ad === "number" && ad >= 1) setAdults(ad);
  }, [
    initialSearch?.destination,
    initialSearch?.checkIn,
    initialSearch?.checkOut,
    initialSearch?.rooms,
    initialSearch?.adults,
  ]);

  const secondaryColor = "var(--secondary-color, #024DAF)";
  const searchButtonColor = isCompact
    ? secondaryColor
    : isDashboardHome
      ? secondaryColor
      : "#525371";
  const searchButtonHoverColor = isCompact
    ? secondaryColor
    : isDashboardHome
      ? secondaryColor
      : "#424055";
  const searchButtonShadow = isCompact
    ? "0px 6px 16px rgba(2, 77, 175, 0.35)"
    : isDashboardHome
      ? "0px 6px 16px rgba(18,61,110,0.25)"
      : "0px 6px 16px rgba(82,83,113,0.25)";

  const formatDateLine = (d) =>
    d && d.isValid() ? d.format("ddd, DD MMM YY").toUpperCase() : "—";

  const guestSummary = `${rooms} Room${rooms !== 1 ? "s" : ""} · ${adults} Adult${adults !== 1 ? "s" : ""}`;

  const openDatePicker = (target) => (event) => {
    setDatePickerTarget(target);
    setDateAnchorEl(event.currentTarget);
  };

  const closeDatePicker = () => {
    setDateAnchorEl(null);
    setDatePickerTarget(null);
  };

  const handleCalendarChange = (newValue) => {
    if (!newValue || !newValue.isValid()) return;
    if (datePickerTarget === "in") {
      setCheckIn(newValue);
      if (checkOut.isBefore(newValue, "day")) {
        setCheckOut(newValue.add(1, "day"));
      }
    } else if (datePickerTarget === "out") {
      if (newValue.isBefore(checkIn, "day")) return;
      setCheckOut(newValue);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/dashboard/hotel/search", {
      state: {
        destination,
        checkIn: checkIn.format("YYYY-MM-DD"),
        checkOut: checkOut.format("YYYY-MM-DD"),
        rooms,
        adults,
      },
    });
  };

  const calendarValue = datePickerTarget === "out" ? checkOut : checkIn;
  const minCalendarDate = datePickerTarget === "out" ? checkIn : undefined;

  const valueTypographySx = valueSx;
  const popoverTitleColor = secondaryColor;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          border: isCompact ? `1px solid ${secondaryColor}` : "none",
          borderRadius: "12px",
          p: isCompact ? 1.5 : 1.5,
          position: "relative",
          pb: isCompact ? 1.5 : 4,
        }}
      >
        <Box component="form" onSubmit={handleSearch} noValidate>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 1.25,
              alignItems: { xs: "stretch", md: isCompact ? "flex-end" : "stretch" },
            }}
          >
            <HotelFieldColumn
              label="Location"
              htmlFor="hotel-location-input"
              flex={{ xs: "1 1 auto", md: "1.35 1 0%" }}
              compact={isCompact}
            >
              <TextField
                id="hotel-location-input"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                variant="standard"
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    ...valueTypographySx,
                    p: 0,
                  },
                }}
                inputProps={{
                  "aria-label": "Hotel location",
                  style: { padding: 0 },
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </HotelFieldColumn>

            <HotelFieldColumn
              label="Check In Date"
              onShellClick={openDatePicker("in")}
              icon={<CalendarTodayIcon sx={{ fontSize: 20 }} />}
              valueNode={<Typography sx={valueTypographySx}>{formatDateLine(checkIn)}</Typography>}
              compact={isCompact}
            />

            <HotelFieldColumn
              label="Check Out Date"
              onShellClick={openDatePicker("out")}
              icon={<CalendarTodayIcon sx={{ fontSize: 20 }} />}
              valueNode={<Typography sx={valueTypographySx}>{formatDateLine(checkOut)}</Typography>}
              compact={isCompact}
            />

            <HotelFieldColumn
              label="Guests & Rooms"
              onShellClick={(e) => setGuestAnchorEl(e.currentTarget)}
              icon={<PersonIcon sx={{ fontSize: 20 }} />}
              shellSx={{ pr: 4 }}
              valueNode={<Typography sx={valueTypographySx}>{guestSummary}</Typography>}
              compact={isCompact}
            />

            {isCompact ? (
              <Box sx={{ flexShrink: 0, width: { xs: "100%", md: "auto" } }}>
                <Typography sx={{ ...sectionLabelSx, visibility: "hidden", mb: 0.75, height: 0 }} aria-hidden>
                  .
                </Typography>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  startIcon={<SendIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    backgroundColor: searchButtonColor,
                    color: "#fff",
                    px: 3,
                    height: 48,
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: searchButtonShadow,
                    "&:hover": {
                      backgroundColor: searchButtonHoverColor,
                      opacity: isCompact ? 0.92 : 1,
                    },
                  }}
                >
                  Search
                </Button>
              </Box>
            ) : null}
          </Box>

          <Popover
            open={Boolean(dateAnchorEl)}
            anchorEl={dateAnchorEl}
            onClose={closeDatePicker}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                id: IONTRIP_CALENDAR_MENU_CONTAINER_ID,
                "data-iontrip-calendar-root": true,
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  overflow: "visible",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
              },
            }}
          >
            <DateCalendar
              value={calendarValue}
              onChange={handleCalendarChange}
              minDate={minCalendarDate}
              views={["day"]}
              openTo="day"
              slots={{ calendarHeader: CalendarMonthYearSelectHeader }}
              slotProps={{
                day: {
                  sx: {
                    "&.Mui-selected": {
                      backgroundColor: "var(--secondary-color, #024DAF) !important",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "var(--secondary-color, #024DAF) !important",
                        opacity: 0.92,
                      },
                    },
                    "&.MuiPickersDay-today": {
                      border: "none !important",
                      fontWeight: 700,
                      textDecoration: "underline",
                      textDecorationThickness: 3,
                      textUnderlineOffset: "4px",
                      textDecorationColor: "var(--secondary-color, #024DAF)",
                    },
                  },
                },
              }}
            />
          </Popover>

          <Popover
            open={Boolean(guestAnchorEl)}
            anchorEl={guestAnchorEl}
            onClose={() => setGuestAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: { mt: 1, p: 2, minWidth: 260, borderRadius: 2 },
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 14,
                mb: 1.5,
                color: popoverTitleColor,
              }}
            >
              Guests & rooms
            </Typography>
            {[
              { label: "Rooms", value: rooms, set: setRooms, min: 1, max: 9 },
              { label: "Adults", value: adults, set: setAdults, min: 1, max: 20 },
            ].map((row) => (
              <Box
                key={row.label}
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}
              >
                <Typography sx={{ fontSize: 14, color: "#374151" }}>{row.label}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => row.set((v) => Math.max(row.min, v - 1))}
                    disabled={row.value <= row.min}
                    aria-label={`Decrease ${row.label}`}
                  >
                    <RemoveCircleOutlineIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>{row.value}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => row.set((v) => Math.min(row.max, v + 1))}
                    disabled={row.value >= row.max}
                    aria-label={`Increase ${row.label}`}
                  >
                    <AddCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
            <Button
              fullWidth
              variant="contained"
              onClick={() => setGuestAnchorEl(null)}
              sx={{
                mt: 1,
                textTransform: "none",
                backgroundColor: secondaryColor,
                "&:hover": { backgroundColor: secondaryColor, opacity: 0.92 },
              }}
            >
              Done
            </Button>
          </Popover>

          {!isCompact ? (
            <Box
              sx={{
                position: "absolute",
                bottom: "-18px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Button
                type="submit"
                startIcon={<SendIcon sx={{ fontSize: 18 }} />}
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
                Search Hotels
              </Button>
            </Box>
          ) : null}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default HotelSearchBox;
