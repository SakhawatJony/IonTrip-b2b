import React, { useMemo, useCallback, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

const FlightSortFilter = ({ flights, sortBy, onSortChange, currency = "USD" }) => {
  // Parse duration - matching parent component logic
  const parseDuration = (duration) => {
    try {
      if (!duration) return null;
      const durationStr = String(duration).trim();
      
      // Try format like "10H 50Min" or "10 H 50 Min" (with capital H and Min)
      let match = durationStr.match(/(\d+)\s*(?:h|hr|hour|hours|Hr|H|Hour|Hours)\s*(\d+)?\s*(?:m|min|minute|minutes|Min|M|Minute|Minutes)?/i);
      if (match) {
        const hours = Number(match[1]) || 0;
        const minutes = Number(match[2]) || 0;
        return { hours, minutes, totalMinutes: hours * 60 + minutes, duration: durationStr };
      }
      
      // Try format like "1h" or "1 Hr" or "1Hr" or "10H"
      match = durationStr.match(/(\d+)\s*(?:h|hr|hour|hours|Hr|H|Hour|Hours)/i);
      if (match) {
        const hours = Number(match[1]) || 0;
        return { hours, minutes: 0, totalMinutes: hours * 60, duration: durationStr };
      }
      
      // Try format like "30m" or "30 Min" or "30Min" or "50Min"
      match = durationStr.match(/(\d+)\s*(?:m|min|minute|minutes|Min|M|Minute|Minutes)/i);
      if (match) {
        const minutes = Number(match[1]) || 0;
        return { hours: 0, minutes, totalMinutes: minutes, duration: durationStr };
      }
      
      // Try format like "1:30" (hours:minutes) or "01:30:00" (with seconds)
      match = durationStr.match(/(\d+):(\d+)(?::\d+)?/);
      if (match) {
        const hours = Number(match[1]) || 0;
        const minutes = Number(match[2]) || 0;
        return { hours, minutes, totalMinutes: hours * 60 + minutes, duration: durationStr };
      }
      
      // Try pure number (assume minutes)
      const pureNumber = parseFloat(durationStr);
      if (!isNaN(pureNumber) && pureNumber > 0) {
        return { hours: 0, minutes: pureNumber, totalMinutes: pureNumber, duration: durationStr };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };

  // Parse time to minutes - matching parent component logic
  const parseTimeToMinutes = (time) => {
    try {
      if (!time) return null;
      const timeStr = String(time);
      
      // Try format like "HH:MM" or "H:MM"
      let match = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        const hours = Number(match[1]) || 0;
        const minutes = Number(match[2]) || 0;
        return { hours, minutes, totalMinutes: hours * 60 + minutes, time: timeStr };
      }
      
      // Try format like "HH:MM:SS"
      match = timeStr.match(/(\d{1,2}):(\d{2}):(\d{2})/);
      if (match) {
        const hours = Number(match[1]) || 0;
        const minutes = Number(match[2]) || 0;
        return { hours, minutes, totalMinutes: hours * 60 + minutes, time: timeStr };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };

  // Calculate values for each filter option
  const filterValues = useMemo(() => {
    try {
      if (!flights || flights.length === 0) {
        return {
          cheapest: null,
          earliest: null,
          fastest: null,
        };
      }

      // Cheapest price
      const prices = flights
        .map((flight) => {
          try {
            // Use priceValue if available, otherwise parse from price string
            if (flight?.priceValue && typeof flight.priceValue === 'number' && !isNaN(flight.priceValue) && flight.priceValue > 0) {
              return flight.priceValue;
            }
            // Try to extract numeric value from price string
            const priceStr = String(flight?.price || "");
            // Remove currency code and extract number
            const priceValue = parseFloat(priceStr.replace(/[^\d.]/g, "")) || 0;
            return priceValue > 0 && !isNaN(priceValue) ? priceValue : null;
          } catch (err) {
            return null;
          }
        })
        .filter((p) => p !== null && p > 0 && !isNaN(p));
      const cheapest = prices.length > 0 ? Math.min(...prices) : null;

      // Earliest departure time
      const times = flights
        .map((flight) => {
          try {
            const timeStr = flight?.departTime || flight?.departureTime || "";
            if (!timeStr) return null;
            return parseTimeToMinutes(timeStr);
          } catch (err) {
            return null;
          }
        })
        .filter((t) => t !== null && t.totalMinutes >= 0);
      
      const earliest = times.length > 0 ? times.reduce((earliest, current) => 
        current.totalMinutes < earliest.totalMinutes ? current : earliest
      ) : null;

      // Fastest duration
      const durations = flights
        .map((flight) => {
          try {
            const durationStr = flight?.duration || flight?.flightDuration || "";
            if (!durationStr) return null;
            return parseDuration(durationStr);
          } catch (err) {
            return null;
          }
        })
        .filter((d) => d !== null && d.totalMinutes > 0);
      
      const fastest = durations.length > 0 ? durations.reduce((fastest, current) => 
        current.totalMinutes < fastest.totalMinutes ? current : fastest
      ) : null;

      return { cheapest, earliest, fastest };
    } catch (error) {
      console.error("Error calculating filter values:", error);
      return {
        cheapest: null,
        earliest: null,
        fastest: null,
      };
    }
  }, [flights]);

  const formatTime = (timeObj) => {
    if (!timeObj || !timeObj.time) return "";
    try {
      const timeStr = String(timeObj.time);
      const match = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        const hours = Number(match[1]);
        const minutes = Number(match[2]);
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
        return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
      }
      return timeStr;
    } catch (error) {
      return timeObj.time || "";
    }
  };

  const formatDuration = (durationObj) => {
    if (!durationObj) return "";
    const { hours, minutes } = durationObj;
    if (hours > 0 && minutes > 0) {
      return `${hours} Hr ${minutes} Min`;
    } else if (hours > 0) {
      return `${hours} Hr`;
    } else if (minutes > 0) {
      return `${minutes} Min`;
    }
    return "";
  };

  // Debug: Log when sortBy prop changes
  useEffect(() => {
    console.log("🔍 FlightSortFilter: sortBy prop changed to:", sortBy);
  }, [sortBy]);

  // Debug: Log when onSortChange prop changes
  useEffect(() => {
    console.log("🔍 FlightSortFilter: onSortChange prop:", typeof onSortChange, onSortChange);
  }, [onSortChange]);

  const handleFilterClick = useCallback((filterType) => {
    try {
      console.log("🖱️ FlightSortFilter: Clicked filter:", filterType, "Current sortBy:", sortBy);
      if (onSortChange && typeof onSortChange === 'function') {
        console.log("🖱️ FlightSortFilter: Calling onSortChange with:", filterType);
        // Call the callback immediately
        onSortChange(filterType);
        console.log("🖱️ FlightSortFilter: onSortChange called successfully");
      } else {
        console.error("❌ FlightSortFilter: onSortChange is not a function", typeof onSortChange, onSortChange);
      }
    } catch (error) {
      console.error("❌ FlightSortFilter: Error handling filter click:", error);
    }
  }, [onSortChange, sortBy]);

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        border: "1px solid #E5E5E5",
        overflow: "hidden",
        mb: 2,
      }}
    >
      {/* Cheapest */}
      <Box
        component="button"
        type="button"
        onClick={() => {
          console.log("🖱️ Cheapest clicked, calling onSortChange('lowest')");
          if (onSortChange) {
            onSortChange("lowest");
          }
        }}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          cursor: "pointer",
          userSelect: "none",
          border: "none",
          outline: "none",
          backgroundColor: sortBy === "lowest" ? "var(--primary-color)" : "#FFFFFF",
          color: sortBy === "lowest" ? "#FFFFFF" : "#4F4F4F",
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          borderRight: "1px solid #E0E0E0",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: sortBy === "lowest" ? "var(--primary-color)" : "rgba(18, 61, 110, 0.05)",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600, pointerEvents: "none" }}>
          Cheapest
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 600, pointerEvents: "none" }}>
          {filterValues.cheapest !== null
            ? `${currency} ${filterValues.cheapest.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
            : "-"}
        </Typography>
      </Box>

      {/* Earliest */}
      <Box
        component="button"
        type="button"
        onClick={() => {
          console.log("🖱️ Earliest clicked, calling onSortChange('earliest')");
          if (onSortChange) {
            onSortChange("earliest");
          }
        }}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          cursor: "pointer",
          userSelect: "none",
          border: "none",
          outline: "none",
          backgroundColor: sortBy === "earliest" ? "var(--primary-color)" : "#FFFFFF",
          color: sortBy === "earliest" ? "#FFFFFF" : "#4F4F4F",
          borderRight: "1px solid #E0E0E0",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: sortBy === "earliest" ? "var(--primary-color)" : "rgba(18, 61, 110, 0.05)",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600, pointerEvents: "none" }}>
          Earliest
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 600, pointerEvents: "none" }}>
          {filterValues.earliest ? formatTime(filterValues.earliest) : "-"}
        </Typography>
      </Box>

      {/* Fastest */}
      <Box
        component="button"
        type="button"
        onClick={() => {
          console.log("🖱️ Fastest clicked, calling onSortChange('fastest')");
          if (onSortChange) {
            onSortChange("fastest");
          }
        }}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          cursor: "pointer",
          userSelect: "none",
          border: "none",
          outline: "none",
          backgroundColor: sortBy === "fastest" ? "var(--primary-color)" : "#FFFFFF",
          color: sortBy === "fastest" ? "#FFFFFF" : "#4F4F4F",
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: sortBy === "fastest" ? "var(--primary-color)" : "rgba(18, 61, 110, 0.05)",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600, pointerEvents: "none" }}>
          Fastest
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 600, pointerEvents: "none" }}>
          {filterValues.fastest ? formatDuration(filterValues.fastest) : "-"}
        </Typography>
      </Box>
    </Box>
  );
};

export default FlightSortFilter;
