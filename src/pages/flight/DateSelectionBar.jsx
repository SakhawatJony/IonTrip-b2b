import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import dayjs from "dayjs";
import DateSelectionBarSkeleton from "./DateSelectionBarSkeleton";
import useAuth from "../../hooks/useAuth";

const DateSelectionBar = ({ 
  selectedDate, 
  onDateSelect, 
  from, 
  to,
  currency: propCurrency,
  fromCode,
  toCode,
  passengerCounts = { adults: 1, children: 0, infants: 0 },
  travelClass = "Economy",
  email = "user@example.com",
  tripType = "one-way",
  returnDateISO = "",
  returnDate = ""
}) => {
  const { currency: authCurrency, agentToken } = useAuth();
  // Use authCurrency from navbar if available, otherwise use prop currency
  const currency = authCurrency || propCurrency || "USD";
  
  const [datePrices, setDatePrices] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  
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

  // Fetch prices for all dates
  useEffect(() => {
    if (!fromCode || !toCode || dates.length === 0) {
      setDatePrices({});
      return;
    }

    const controller = new AbortController();
    const fetchPrices = async () => {
      setLoadingPrices(true);
      setDatePrices({}); // Clear previous prices while loading
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        const pricePromises = dates.map(async (dateInfo) => {
          try {
            const requestBody = {
              tripType: normalizedTripType,
              journeyfrom: fromCode,
              journeyto: toCode,
              adult: passengerCounts.adults || 1,
              child: passengerCounts.children || 0,
              infant: passengerCounts.infants || 0,
              cabinclass: (travelClass || "economy").toLowerCase(),
              departuredate: dateInfo.dateStr,
              email: email,
              currency: currency,
            };
            if (normalizedTripType === "roundway") {
              requestBody.returndate = dateInfo.date
                .add(roundTripOffsetDays, "day")
                .format("YYYY-MM-DD");
            }

            const token = agentToken || localStorage.getItem("agentToken") || "";
            const headers = {
              "Content-Type": "application/json",
            };
            if (token) {
              headers.Authorization = `Bearer ${token}`;
            }
            
            const response = await fetch(`${baseUrl}/flight/searchFlights`, {
              method: "POST",
              headers,
              body: JSON.stringify(requestBody),
              signal: controller.signal,
            });

            if (!response.ok) {
              console.warn(`Price fetch failed for ${dateInfo.dateStr}: ${response.status}`);
              return { dateStr: dateInfo.dateStr, price: null };
            }

            const payload = await response.json();
            const rawFlights = Array.isArray(payload)
              ? payload
              : payload?.data || payload?.flights || payload?.results || payload?.items || payload;
            const normalized = Array.isArray(rawFlights) ? rawFlights : rawFlights ? [rawFlights] : [];

            if (normalized.length === 0) {
              console.warn(`No flights found for ${dateInfo.dateStr}`);
              return { dateStr: dateInfo.dateStr, price: null };
            }

            // Get the lowest price from all flights
            const prices = normalized
              .map((item) => {
                // Try multiple price fields
                let priceValue = 
                  item?.clientFare ||
                  item?.agentFare ||
                  item?.netPrice ||
                  item?.basePrice ||
                  item?.totalPrice ||
                  item?.fare ||
                  item?.price ||
                  item?.AirFareData?.price?.grandTotal ||
                  item?.AirFareData?.price?.total ||
                  item?.AirFareData?.price?.baseFare ||
                  null;

                // If no direct price, try currency-specific fields
                if (!priceValue && currency) {
                  const currencyUpper = currency.toUpperCase();
                  priceValue = 
                    item?.[currencyUpper]?.clientFare ||
                    item?.[currencyUpper]?.netPrice ||
                    item?.[currencyUpper]?.agentFare ||
                    item?.[currencyUpper]?.fare ||
                    null;
                }

                // Try pricebreakdown array
                if (!priceValue && item?.pricebreakdown && Array.isArray(item.pricebreakdown) && item.pricebreakdown.length > 0) {
                  const breakdown = item.pricebreakdown[0];
                  priceValue = 
                    breakdown?.TotalFare ||
                    breakdown?.BaseFare ||
                    breakdown?.TotalPrice ||
                    breakdown?.Price ||
                    null;
                }

                // Try to extract numeric value
                if (priceValue) {
                  const numValue = typeof priceValue === 'string' 
                    ? parseFloat(priceValue.replace(/[^\d.]/g, '')) 
                    : parseFloat(priceValue);
                  return !isNaN(numValue) && numValue > 0 ? numValue : null;
                }
                return null;
              })
              .filter((p) => p !== null && p > 0);

            const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;
            return { dateStr: dateInfo.dateStr, price: lowestPrice };
          } catch (err) {
            if (err.name !== "AbortError") {
              return { dateStr: dateInfo.dateStr, price: null };
            }
            return null;
          }
        });

        const results = await Promise.all(pricePromises);
        const pricesMap = {};
        results.forEach((result) => {
          if (result && result.dateStr) {
            pricesMap[result.dateStr] = result.price;
            // Log for debugging - especially for selected date
            if (result.dateStr === selectedDateStr) {
              console.log(`Price for selected date ${result.dateStr}:`, result.price);
            }
          }
        });
        setDatePrices(pricesMap);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching prices:", err);
        }
      } finally {
        setLoadingPrices(false);
      }
    };

    // Debounce the fetch to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchPrices();
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [dates, fromCode, toCode, passengerCounts, travelClass, email, currency, normalizedTripType, roundTripOffsetDays, agentToken]);

  const getPriceForDate = (dateStr) => {
    return datePrices[dateStr] || null;
  };

  const handlePreviousWeek = () => {
    // Only navigate dates, don't trigger search
    setDisplayCenterDate((prev) => prev.subtract(7, "day"));
  };

  const handleNextWeek = () => {
    // Only navigate dates, don't trigger search
    setDisplayCenterDate((prev) => prev.add(7, "day"));
  };

  // Show skeleton on initial load when prices haven't been fetched yet
  const showSkeleton = loadingPrices && Object.keys(datePrices).length === 0;

  if (showSkeleton) {
    return <DateSelectionBarSkeleton />;
  }

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
            const price = getPriceForDate(dateInfo.dateStr);
            const isLoading = loadingPrices && !(dateInfo.dateStr in datePrices);

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
                  {isLoading
                    ? "..."
                    : isSelected && price !== null
                    ? `${currency} ${price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                    : "View Price"}
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
