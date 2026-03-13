import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import dayjs from "dayjs";

const DateSelectionBar = ({ 
  selectedDate, 
  onDateSelect, 
  from, 
  to,
  currency: propCurrency = "BDT",
  fromCode,
  toCode,
  passengerCounts = { adults: 1, children: 0, infants: 0 },
  travelClass = "Economy",
  email = "user@example.com",
  tripType = "one-way",
  returnDateISO = "",
  returnDate = "",
  selectedDatePrice = null,
}) => {
  const currency = propCurrency || "BDT";
  // State for display center date (for navigation without triggering search)
  const [displayCenterDate, setDisplayCenterDate] = useState(() => {
    return selectedDate ? dayjs(selectedDate) : dayjs();
  });

  // Update display center date when selectedDate changes from parent
  useEffect(() => {
    if (selectedDate) {
      setDisplayCenterDate(dayjs(selectedDate));
    }
  }, [selectedDate]);

  const selectedDateStr = selectedDate 
    ? dayjs(selectedDate).format("YYYY-MM-DD") 
    : dayjs().format("YYYY-MM-DD");

  const normalizedTripType = String(tripType || "")
    .toLowerCase()
    .replace(/[\s_-]/g, "") || "oneway";

  const effectiveReturnDateISO = returnDateISO
    ? dayjs(returnDateISO).format("YYYY-MM-DD")
    : returnDate && dayjs(returnDate).isValid()
    ? dayjs(returnDate).format("YYYY-MM-DD")
    : "";

  const roundTripOffsetDays = useMemo(() => {
    if (normalizedTripType !== "roundway") return 0;
    const departure = dayjs(selectedDateStr);
    const ret = dayjs(effectiveReturnDateISO);
    if (departure.isValid() && ret.isValid()) {
      return Math.max(0, ret.diff(departure, "day"));
    }
    return 6;
  }, [normalizedTripType, selectedDateStr, effectiveReturnDateISO]);

  // Generate 7 days with display center date in the middle (4th position)
  // 3 days before, center date, 3 days after
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      // index 0-2: 3 days before, index 3: center date, index 4-6: 3 days after
      const offset = index - 3;
      const date = displayCenterDate.add(offset, "day");
      return {
        date,
        dateStr: date.format("YYYY-MM-DD"),
        dayName: date.format("ddd"),
        dayNumber: date.format("D"),
        month: date.format("MMM"),
        fullDate: date.format("ddd, MMM D"),
      };
    });
  }, [displayCenterDate]);

  // No automatic price fetch: searchFlights is only called when user clicks a date (via parent's onDateSelect).

  const handlePreviousWeek = () => {
    // Only navigate dates, don't trigger search
    setDisplayCenterDate((prev) => prev.subtract(7, "day"));
  };

  const handleNextWeek = () => {
    // Only navigate dates, don't trigger search
    setDisplayCenterDate((prev) => prev.add(7, "day"));
  };

  return (
    <Box sx={{ mb: 3 }}>
     

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          backgroundColor: "#FFFFFF",
          borderRadius: 2.5,
          p: 0,
          overflowX: "auto",
          border: "1px solid #E5E5E5",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        <IconButton
          onClick={handlePreviousWeek}
          sx={{
            color: "#9E9E9E",
            minWidth: 40,
            width: 40,
            height: 40,
            flexShrink: 0,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <ArrowBackIosIcon sx={{ fontSize: 16 }} />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            gap: 0,
            flex: 1,
            justifyContent: "space-between",
            minWidth: 0,
            alignItems: "stretch",
            position: "relative",
          }}
        >
          {dates
            .map((dateInfo, index) => {
            const isSelected = dateInfo.dateStr === selectedDateStr;

            return (
              <Box
                key={dateInfo.dateStr}
                onClick={() => onDateSelect && onDateSelect(dateInfo.dateStr)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  flex: 1,
                  minWidth: 90,
                  px: 1.5,
                  py: 1.5,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: "transparent",
                  position: "relative",
                  borderRight: index < dates.length - 1 ? "1px solid #E0E0E0" : "none",
                  borderBottom: isSelected ? `1px solid var(--primary-color)` : "1px solid transparent",
                  "&:hover": {
                    backgroundColor: "rgba(18, 61, 110, 0.03)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? "var(--primary-color)" : "#4F4F4F",
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  {dateInfo.dayName}, {dateInfo.month} {dateInfo.dayNumber}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: isSelected ? "#4F4F4F" : "var(--primary-color)",
                    textAlign: "center",
                    textUnderlineOffset: 4,
                    textDecorationThickness: 2,
                    lineHeight: 1.2,
                    minHeight: 16,
                  }}
                >
                  {isSelected && selectedDatePrice != null && Number(selectedDatePrice) > 0
                    ? `${currency} ${Number(selectedDatePrice).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                    : isSelected
                    ? "Selected"
                    : "View"}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <IconButton
          onClick={handleNextWeek}
          sx={{
            color: "#616161",
            minWidth: 40,
            width: 40,
            height: 40,
            flexShrink: 0,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default DateSelectionBar;
