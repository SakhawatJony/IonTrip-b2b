import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Menu, MenuItem, Typography, CircularProgress } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const headerTitleSx = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
};

// Status mapping from API to display labels (Booked shown as Hold in stats)
const statusLabelMap = {
  "ticketed": "Ticketed",
  "reissue": "Reissue",
  "refund": "Refund",
  "void": "Void",
  "hold": "Hold",
  "issueinprocess": "Issue in Process",
  "booked": "Hold",
};

const tableColumns = [
  { key: "bookingId", label: "Booking Id", width: "100px" },
  { key: "customer", label: "Customer", width: "120px" },
  { key: "route", label: "Route", width: "80px" },
  { key: "type", label: "Type", width: "80px" },
  { key: "pnr", label: "PNR", width: "60px" },
  { key: "bookingTime", label: "Booking Time", width: "100px" },
  { key: "dueAmount", label: "Due Amount", width: "80px" },
  { key: "grossFare", label: "Gross Fare", width: "80px" },
  { key: "ticketFare", label: "Ticket Fare", width: "80px" },
  { key: "pax", label: "PAX", width: "40px" },
  { key: "airline", label: "Airline", width: "90px" },
  { key: "flightDate", label: "Flight Date", width: "80px" },
  { key: "status", label: "Status", width: "110px" },
];



const tableGridTemplate = tableColumns.map((col) => col.width).join(" ");

const STATUS_OPTIONS = [
  { value: "", label: "All Booking" },
  { value: "BOOKED", label: "Booked" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "HOLD", label: "Hold" },
  { value: "ISSUE", label: "Issue" },
  { value: "PROCESS", label: "Process" },
  { value: "REFUND", label: "Refund" },
  { value: "REISSUE", label: "Reissue" },
  { value: "TICKETED", label: "Ticketed" },
];

const AgentFlightBooking = ({ title = "All Booking", buttonLabel = "All Booking" }) => {
  const navigate = useNavigate();
  const { agentToken, agentData } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
  
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [logoErrors, setLogoErrors] = useState({});
  const [statusSummary, setStatusSummary] = useState([]);
  const [currency, setCurrency] = useState("BDT");
  const [bookingIdFilter, setBookingIdFilter] = useState("");
  const [pnrFilter, setPnrFilter] = useState("");
  const [airlinesFilter, setAirlinesFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const open = Boolean(anchorEl);

  const handleStatusClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusClose = () => {
    setAnchorEl(null);
  };

  const handleStatusSelect = (statusValue) => {
    setStatus(statusValue);
    setPage(1); // Reset to first page when status changes
    handleStatusClose();
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "bookingId") {
      setBookingIdFilter(value);
    } else if (filterType === "pnr") {
      setPnrFilter(value);
    } else if (filterType === "airlines") {
      setAirlinesFilter(value);
    }
    setPage(1); // Reset to first page when filter changes
  };

  const handleClearFilters = () => {
    setBookingIdFilter("");
    setPnrFilter("");
    setAirlinesFilter("");
    setPage(1);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const agentEmail = agentData?.email || "";

  const fetchBookings = useCallback(async () => {
    const token = agentToken || localStorage.getItem("agentToken") || "";

    if (!token || !agentEmail) {
      setError("Agent token or email missing. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        email: agentEmail,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) {
        params.append("status", status);
      }

      if (bookingIdFilter && bookingIdFilter.trim()) {
        params.append("bookingId", bookingIdFilter.trim());
      }

      if (pnrFilter && pnrFilter.trim()) {
        params.append("pnr", pnrFilter.trim());
      }

      if (airlinesFilter && airlinesFilter.trim()) {
        params.append("airlines", airlinesFilter.trim());
      }

      const response = await axios.get(`${baseUrl}/booking/agent/list?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const bookingsData = response?.data?.data || [];
      const paginationData = response?.data || {};
      const summaryData = response?.data?.statusSummary || [];
      
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setTotalPages(paginationData.totalPages || 1);
      setTotal(paginationData.total || 0);
      setStatusSummary(Array.isArray(summaryData) ? summaryData : []);
      
      // Extract currency from first booking if available
      if (bookingsData.length > 0 && bookingsData[0]?.farecurrency) {
        setCurrency(bookingsData[0].farecurrency);
      }
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load bookings.";
      setError(apiMessage);
      setBookings([]);
      setStatusSummary([]);
      console.error("Fetch bookings failed:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, [status, page, limit, bookingIdFilter, pnrFilter, airlinesFilter, agentToken, agentEmail, baseUrl]);

  // Initial fetch and when status/page/limit changes (immediate)
  useEffect(() => {
    if (agentToken && agentEmail) {
      fetchBookings();
    }
  }, [status, page, limit, fetchBookings, agentToken, agentEmail]);

  // Debounce text input filters (bookingId, pnr, airlines)
  useEffect(() => {
    if (!agentToken || !agentEmail) return;
    
    const timeoutId = setTimeout(() => {
      fetchBookings();
    }, 500); // 500ms debounce for text inputs

    return () => clearTimeout(timeoutId);
  }, [bookingIdFilter, pnrFilter, airlinesFilter, fetchBookings]);

  const selectedStatusLabel = STATUS_OPTIONS.find((opt) => opt.value === status)?.label || buttonLabel;

  // Format status summary for display
  const getStatusCards = () => {
    // Define the order of status cards
    const statusOrder = ["ticketed", "reissue", "refund", "void", "hold", "issueinprocess", "booked"];
    
    // Create a map from status summary
    const summaryMap = new Map();
    statusSummary.forEach((item) => {
      summaryMap.set(item.status?.toLowerCase(), item);
    });
    
    // Build cards in the defined order
    return statusOrder.map((statusKey) => {
      const summaryItem = summaryMap.get(statusKey);
      const label = statusLabelMap[statusKey] || statusKey.charAt(0).toUpperCase() + statusKey.slice(1);
      const amount = summaryItem?.totalAmount || 0;
      const formattedAmount = `${currency} ${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      
      return {
        label,
        amount: formattedAmount,
        count: summaryItem?.count || 0,
        status: statusKey,
      };
    });
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

  // Get airline logo URL
  const getAirlineLogoUrl = (airlineName) => {
    const code = getCarrierCodeFromName(airlineName);
    if (!code) return "";
    return `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${code}.png`;
  };

  // Map API booking data to table row format
  const mapBookingToTableRow = (booking) => {
    const firstTraveller = booking?.travellers?.[0] || {};
    const customerName = firstTraveller.firstName && firstTraveller.lastName
      ? `${firstTraveller.firstName} ${firstTraveller.lastName}`
      : "-";
    
    const route = booking?.godeparture && booking?.goarrival
      ? `${booking.godeparture} → ${booking.goarrival}`
      : "-";
    
    const tripType = booking?.triptype 
      ? booking.triptype.charAt(0).toUpperCase() + booking.triptype.slice(1)
      : "-";
    
    const pnr = booking?.gdsPNR || booking?.airlinePNR || "-";
    
    const bookingTime = booking?.bookingDateTime
      ? (() => {
          const d = new Date(booking.bookingDateTime);
          const day = d.getDate();
          const month = d.toLocaleString("en-US", { month: "short" });
          const year = d.getFullYear();
          return `${day} ${month} ${year}`;
        })()
      : "-";
    
    const grossFare = booking?.netPrice || 0;
    const ticketFare = booking?.agentFare || 0;
    const grossFareNum = parseFloat(grossFare) || 0;
    const ticketFareNum = parseFloat(ticketFare) || 0;
    const dueAmount = 0;
    const currency = booking?.farecurrency || "";
    
    const paxCount = booking?.travellers?.length || booking?.segment || 0;
    
    // Ensure due amount always shows, even if 0
    const formattedDueAmount = isNaN(dueAmount) ? "0.00" : Math.abs(dueAmount).toFixed(2);
    
    return {
      bookingId: booking?.bookingId || "-",
      customer: customerName,
      route: route,
      type: tripType,
      pnr: pnr,
      bookingTime: bookingTime,
      dueAmount: `${currency} ${formattedDueAmount}`,
      grossFare: `${currency} ${isNaN(grossFareNum) ? "0.00" : grossFareNum.toFixed(2)}`,
      ticketFare: `${currency} ${isNaN(ticketFareNum) ? "0.00" : ticketFareNum.toFixed(2)}`,
      pax: paxCount,
      airline: booking?.careerName || booking?.career || "-",
      carrierCode: booking?.careerCode || booking?.career || booking?.careerName?.substring(0, 2).toUpperCase() || "",
      flightDate: (() => {
        const raw = booking?.godepartureDate;
        if (!raw) return "-";
        const d = new Date(raw);
        if (Number.isNaN(d.getTime())) return raw;
        const day = d.getDate();
        const month = d.toLocaleString("en-US", { month: "short" });
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
      })(),
      status: booking?.status || "-",
    };
  };

  const handleBookingIdClick = (bookingId) => {
    if (bookingId && bookingId !== "-" && agentEmail) {
      navigate("/dashboard/bookingqueuedetails", {
        state: {
          bookingId,
          email: agentEmail,
        },
      });
    }
  };

  // Get status colors based on status value
  const getStatusColors = (statusValue) => {
    if (!statusValue || statusValue === "-") {
      return { bg: "#F3F4F6", color: "#6B7280" };
    }

    const statusLower = statusValue.toLowerCase().trim();
    
    // Map status values to colors
    if (statusLower.includes("expired") || statusLower === "booking expired") {
      return { bg: "#000000", color: "#FFFFFF" };
    }
    if (statusLower.includes("cancelled") || statusLower === "booking cancelled" || statusLower === "cancelled") {
      return { bg: "#FEF3C7", color: "#92400E" };
    }
    if (statusLower.includes("ticketed") || statusLower === "ticketed") {
      return { bg: "#10B981", color: "#FFFFFF" };
    }
    if (statusLower.includes("reissue") && statusLower.includes("completed")) {
      return { bg: "#84CC16", color: "#FFFFFF" };
    }
    if (statusLower.includes("refund") && statusLower.includes("expired")) {
      return { bg: "#E9D5FF", color: "#6B21A8" };
    }
    if (statusLower.includes("reissue")) {
      return { bg: "#DBEAFE", color: "#1E40AF" };
    }
    if (statusLower.includes("refund")) {
      return { bg: "#FEE2E2", color: "#991B1B" };
    }
    if (statusLower.includes("void")) {
      return { bg: "#F3F4F6", color: "#4B5563" };
    }
    if (statusLower.includes("hold")) {
      return { bg: "#FEF3C7", color: "#92400E" };
    }
    if (statusLower.includes("booked")) {
      return { bg: "#DBEAFE", color: "#1E40AF" };
    }
    if (statusLower.includes("issue") || statusLower.includes("process")) {
      return { bg: "#FDE68A", color: "#78350F" };
    }

    // Default color
    return { bg: "#F3F4F6", color: "#6B7280" };
  };

  const renderCell = (columnKey, value, bookingId = null, carrierCode = null) => {
    if (columnKey === "bookingId") {
      return (
        <Typography
          onClick={() => handleBookingIdClick(bookingId || value)}
          sx={{
            fontSize: 10,
            fontWeight: 600,
            color: "#111827",
            backgroundColor: "#EEF2F6",
            borderRadius: 0.8,
            px: 1,
            py: 0.35,
            width: "fit-content",
            whiteSpace: "nowrap",
            cursor: bookingId && bookingId !== "-" ? "pointer" : "default",
            "&:hover": {
              backgroundColor: bookingId && bookingId !== "-" ? "#D1D5DB" : "#EEF2F6",
            },
          }}
        >
          {value}
        </Typography>
      );
    }

    if (columnKey === "status") {
      const statusColors = getStatusColors(value);
      // Capitalize status text
      const capitalizeStatus = (statusText) => {
        if (!statusText || statusText === "-") return statusText;
        return statusText
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
      };
      const capitalizedStatus = capitalizeStatus(value);
      
      return (
        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 600,
            color: statusColors.color,
            backgroundColor: statusColors.bg,
            borderRadius: 0.8,
            px: 1,
            py: 0.4,
            width: "fit-content",
            whiteSpace: "nowrap",
            textTransform: "capitalize",
          }}
        >
          {capitalizedStatus}
        </Typography>
      );
    }

    if (columnKey === "airline") {
      const airlineName = value || "";
      // Use carrier code from booking data, fallback to name mapping
      const airlineCode = carrierCode || getCarrierCodeFromName(airlineName);
      const logoUrl = airlineCode 
        ? `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${airlineCode.toUpperCase()}.png`
        : getAirlineLogoUrl(airlineName);
      const fallbackText = airlineCode || (airlineName ? airlineName.substring(0, 2).toUpperCase() : "-");
      const hasLogoError = logoErrors[airlineCode] || false;
      const displayText = airlineCode ? airlineCode.toUpperCase() : (airlineName || "-");

      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {logoUrl && airlineCode && !hasLogoError ? (
            <Box
              component="img"
              src={logoUrl}
              alt={displayText}
              onError={() => {
                if (airlineCode) {
                  setLogoErrors((prev) => ({ ...prev, [airlineCode]: true }));
                }
              }}
              sx={{
                width: 25,
                height: 20,
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
          ) : (
            <Box
              sx={{
                width: 25,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#E6EEF7",
                borderRadius: 0.5,
                fontSize: 9,
                fontWeight: 700,
                color: "#6B7A90",
                flexShrink: 0,
              }}
            >
              {fallbackText}
            </Box>
          )}
          <Typography
            sx={{
              fontSize: 10,
              color: "#111827",
              whiteSpace: "nowrap",
            }}
          >
            {displayText}
          </Typography>
        </Box>
      );
    }

    return (
      <Typography
        sx={{
          fontSize: 10.5,
          color: "#111827",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
     px:"30px",
        py: 4,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: 2,
          border: "1px solid #E5E7EB",
          px: { xs: 2, md: 3 },
          py: { xs: 2.5, md: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography sx={headerTitleSx}>{title}</Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            {getStatusCards().map((card) => (
              <Box
                key={card.label}
                sx={{
                  backgroundColor: "#D9ECFF",
                  border: "1px solid #9EC6F1",
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.8,
                  minWidth: 95,
                }}
              >
                <Typography fontSize={10.5} fontWeight={600} color="#0F2F56">
                  {card.label}
                </Typography>
                <Typography fontSize={10.5} color="#1F2A44" mt={0.2}>
                  {card.amount}
                </Typography>
              </Box>
            ))}
            <Button
              variant="contained"
              onClick={handleStatusClick}
              endIcon={
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <ExpandMoreIcon sx={{ fontSize: 18 }} />
                </Box>
              }
              sx={{
                textTransform: "none",
                fontSize: 12,
                fontWeight: 600,
                px: 2,
                height: 36,
                backgroundColor: "#0F2F56",
                "&:hover": { backgroundColor: "#0B2442" },
              }}
            >
              {selectedStatusLabel}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleStatusClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => handleStatusSelect(option.value)}
                  selected={status === option.value}
                  sx={{
                    fontSize: 12,
                    fontWeight: status === option.value ? 600 : 400,
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          {showFilters && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
                flex: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "#EAF2FF",
                  borderRadius: 1,
                  px: 1.2,
                  height: 32,
                  minWidth: 170,
                }}
              >
                <SearchOutlinedIcon sx={{ fontSize: 16, color: "#1F4D8B" }} />
                <Box
                  component="input"
                  placeholder="Enter Booking ID"
                  value={bookingIdFilter}
                  onChange={(e) => handleFilterChange("bookingId", e.target.value)}
                  sx={{
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    fontSize: 11.5,
                    color: "#1F2A44",
                    width: "100%",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "#EAF2FF",
                  borderRadius: 1,
                  px: 1.2,
                  height: 32,
                  minWidth: 170,
                }}
              >
                <SearchOutlinedIcon sx={{ fontSize: 16, color: "#1F4D8B" }} />
                <Box
                  component="input"
                  placeholder="Enter PNR"
                  value={pnrFilter}
                  onChange={(e) => handleFilterChange("pnr", e.target.value)}
                  sx={{
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    fontSize: 11.5,
                    color: "#1F2A44",
                    width: "100%",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "#EAF2FF",
                  borderRadius: 1,
                  px: 1.2,
                  height: 32,
                  minWidth: 170,
                }}
              >
                <SearchOutlinedIcon sx={{ fontSize: 16, color: "#1F4D8B" }} />
                <Box
                  component="input"
                  placeholder="Enter Airlines"
                  value={airlinesFilter}
                  onChange={(e) => handleFilterChange("airlines", e.target.value)}
                  sx={{
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    fontSize: 11.5,
                    color: "#1F2A44",
                    width: "100%",
                  }}
                />
              </Box>
              {(bookingIdFilter || pnrFilter || airlinesFilter) && (
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  sx={{
                    textTransform: "none",
                    fontSize: 11.5,
                    fontWeight: 600,
                    height: 32,
                    px: 1.5,
                    borderColor: "#0F2F56",
                    color: "#0F2F56",
                    "&:hover": {
                      borderColor: "#0B2442",
                      backgroundColor: "#F0F4F8",
                    },
                  }}
                >
                  Reset
                </Button>
              )}
            </Box>
          )}
          <Button
            variant="contained"
            startIcon={<TuneIcon sx={{ fontSize: 16 }} />}
            onClick={handleToggleFilters}
            sx={{
              textTransform: "none",
              fontSize: 11.5,
              fontWeight: 600,
              height: 32,
              px: 1.5,
              backgroundColor: "#0F2F56",
              "&:hover": { backgroundColor: "#0B2442" },
              ml: "auto",
            }}
          >
            More Filter
          </Button>
        </Box>

        <Box
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 1.5,
            backgroundColor: "#FFFFFF",
            overflowX: "auto",
            overflowY: "auto",
            // maxHeight: "55vh",
          }}
        >
          <Box >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: tableGridTemplate,
                alignItems: "stretch",
                backgroundColor: "#F8FAFC",
              }}
            >
              {tableColumns?.map((column, columnIndex) => (
                <Box
                  key={column.key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    
                   py:1,
                    borderBottom: "1px solid #E5E7EB",
                    backgroundColor: "#F8FAFC",
                  }}
                >
                  <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "var(--primary-color, #123D6E)" }}>
                    {column.label}
                  </Typography>
                </Box>
              ))}
            </Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <CircularProgress size={24} sx={{ color: "#0F2F56" }} />
              </Box>
            ) : error ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <Typography sx={{ fontSize: 12, color: "#d32f2f" }}>{error}</Typography>
              </Box>
            ) : bookings.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <Typography sx={{ fontSize: 12, color: "#6B7280" }}>No bookings found</Typography>
              </Box>
            ) : (
              bookings.map((booking, index) => {
                const row = mapBookingToTableRow(booking);
                const isRowHovered = hoveredRowIndex === index;
                return (
                  <Box
                    key={`${booking.bookingId || booking.id || index}-${index}`}
                    onMouseEnter={() => setHoveredRowIndex(index)}
                    onMouseLeave={() => setHoveredRowIndex(null)}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: tableGridTemplate,
                      alignItems: "stretch",
                      backgroundColor: "#FFFFFF",
                      borderRadius: 1,
                      mb: 0.5,
                      transition: "box-shadow 0.2s ease",
                      ...(isRowHovered && {
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 8px 20px -2px rgba(0, 0, 0, 0.1)",
                        width: "100%",
                      }),
                    }}
                  >
                    {tableColumns.map((column) => {
                      const value = row[column.key] || "-";
                      const originalBookingId = booking?.bookingId || booking?.id || null;
                      const carrierCode = row.carrierCode || null;
                      return (
                        <Box
                          key={`${booking.bookingId || booking.id || index}-${column.key}`}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 1,
                            py: 0.5,
                            borderBottom: "1px solid #E5E7EB",
                            backgroundColor: "transparent",
                          }}
                        >
                          {renderCell(column.key, value, originalBookingId, carrierCode)}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            {/* Previous button */}
            <Box
              onClick={() => page > 1 && setPage(page - 1)}
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 600,
                color: page > 1 ? "#1F2A44" : "#9CA3AF",
                backgroundColor: page > 1 ? "#D1D5DB" : "#E5E7EB",
                cursor: page > 1 ? "pointer" : "not-allowed",
              }}
            >
              ‹
            </Box>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              const isActive = page === pageNum;
              return (
                <Box
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    color: isActive ? "#FFFFFF" : "#1F2A44",
                    backgroundColor: isActive ? "#0F2F56" : "#EAF2FF",
                    cursor: "pointer",
                  }}
                >
                  {pageNum}
                </Box>
              );
            })}
            
            {/* Next button */}
            <Box
              onClick={() => page < totalPages && setPage(page + 1)}
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 600,
                color: page < totalPages ? "#1F2A44" : "#9CA3AF",
                backgroundColor: page < totalPages ? "#D1D5DB" : "#E5E7EB",
                cursor: page < totalPages ? "pointer" : "not-allowed",
              }}
            >
              ›
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AgentFlightBooking;
