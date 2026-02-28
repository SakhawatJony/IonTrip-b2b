import React, { useMemo, useState, useRef, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const AirlineFilterCard = ({
  flights = [],
  selectedAirlines = [],
  onAirlineSelect,
  onAirlineDeselect,
  currency = "USD",
}) => {
  const scrollContainerRef = useRef(null);
  const [logoErrors, setLogoErrors] = useState({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const parsePriceValue = (flight) => {
    if (typeof flight?.priceValue === "number" && !Number.isNaN(flight.priceValue) && flight.priceValue > 0) {
      return flight.priceValue;
    }
    const parsedPrice = parseFloat(String(flight?.price || "").replace(/[^\d.]/g, ""));
    return !Number.isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice : null;
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
  };

  // Helper to get carrier code from airline name
  const getCarrierCodeFromName = (airlineName) => {
    if (!airlineName) return "";
    const upperName = airlineName.toUpperCase().trim();
    return airlineCodeMap[upperName] || "";
  };

  // Calculate airline data with counts and min airline price
  const airlineData = useMemo(() => {
    const airlineMap = new Map();
    const airlineCodeCounts = new Map(); // Track carrier code frequency per airline

    flights.forEach((flight) => {
      const airline = flight?.airline || "";
      const carrierCode = (flight?.carrierCode || "").toUpperCase();
      const priceValue = parsePriceValue(flight);
      const priceCurrency = flight?.priceCurrency || currency;
      
      if (airline) {
        // Try to get carrier code from name mapping if carrierCode is missing or doesn't match
        const mappedCode = getCarrierCodeFromName(airline);
        const finalCarrierCode = carrierCode || mappedCode || airline.substring(0, 2).toUpperCase();
        
        if (!airlineMap.has(airline)) {
          airlineMap.set(airline, {
            name: airline,
            code: finalCarrierCode,
            count: 0,
            minPrice: Number.POSITIVE_INFINITY,
            priceCurrency,
          });
          airlineCodeCounts.set(airline, new Map());
        }
        
        const existingAirline = airlineMap.get(airline);
        existingAirline.count += 1;
        
        // Track carrier code frequency for this airline
        const codeCounts = airlineCodeCounts.get(airline);
        const currentCount = codeCounts.get(finalCarrierCode) || 0;
        codeCounts.set(finalCarrierCode, currentCount + 1);
        
        if (priceValue !== null && priceValue < existingAirline.minPrice) {
          existingAirline.minPrice = priceValue;
        }
      }
    });

    // Convert to array, use most common carrier code for each airline, and sort by count
    return Array.from(airlineMap.values())
      .map((airline) => {
        const codeCounts = airlineCodeCounts.get(airline.name);
        if (codeCounts && codeCounts.size > 0) {
          // Find the most common carrier code for this airline
          let mostCommonCode = airline.code;
          let maxCount = 0;
          codeCounts.forEach((count, code) => {
            if (count > maxCount) {
              maxCount = count;
              mostCommonCode = code;
            }
          });
          // Prefer mapped code if available
          const mappedCode = getCarrierCodeFromName(airline.name);
          airline.code = mappedCode || mostCommonCode || airline.code;
        } else {
          // Fallback to mapped code or first 2 letters
          const mappedCode = getCarrierCodeFromName(airline.name);
          airline.code = mappedCode || airline.code || airline.name.substring(0, 2).toUpperCase();
        }
        return {
          name: airline.name,
          code: airline.code || airline.name.substring(0, 2).toUpperCase(),
          count: airline.count,
          minPrice: Number.isFinite(airline.minPrice) ? airline.minPrice : null,
          priceCurrency: airline.priceCurrency,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [flights, currency]);

  // Check scroll position
  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
          container.scrollLeft < container.scrollWidth - container.clientWidth - 1
        );
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [airlineData]);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 150;
    const currentScroll = container.scrollLeft;
    const newPosition = direction === "left" 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  const handleAirlineClick = (airline) => {
    const isSelected = selectedAirlines.includes(airline.name);
    if (isSelected) {
      onAirlineDeselect?.(airline.name);
    } else {
      onAirlineSelect?.(airline.name);
    }
  };

  // Get airline icon/logo - S3 image with fallback initials
  const getAirlineIcon = (code, name) => {
    const logoUrl = code
      ? `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${code}.png`
      : "";
    const fallbackText = code || name.substring(0, 2).toUpperCase();

    return (
      <Box
        sx={{
          width: 56,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 700,
          color: "#5F6368",
          mb: 0.25,
        }}
      >
        {logoUrl && !logoErrors[code] ? (
          <Box
            component="img"
            src={logoUrl}
            alt={name || code || "Airline"}
            onError={() => setLogoErrors((prev) => ({ ...prev, [code]: true }))}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          fallbackText
        )}
      </Box>
    );
  };

  if (airlineData.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        backgroundColor: "#FFFFFF",
        borderRadius: "5px",
        overflow: "hidden",
        mb: 2,
      }}
    >
      {/* Left Arrow */}
      <IconButton
        onClick={() => handleScroll("left")}
        disabled={!canScrollLeft}
        sx={{
          color: !canScrollLeft ? "#9E9E9E" : "#616161",
          minWidth: 48,
          width: 48,
          height: 48,
          flexShrink: 0,
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          margin: "4px",
          opacity: !canScrollLeft ? 0.5 : 1,
          "&:hover": {
            backgroundColor: !canScrollLeft ? "#FFFFFF" : "rgba(0, 0, 0, 0.04)",
          },
          "&:disabled": {
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <ArrowBackIosIcon sx={{ fontSize: 16 }} />
      </IconButton>

      {/* Scrollable Airlines Container */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: "flex",
          gap: 0,
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          
        }}
      >
        {airlineData.map((airline, index) => {
          const isSelected = selectedAirlines.includes(airline.name);
          return (
            <Box
              key={`${airline.name}-${index}`}
              onClick={() => handleAirlineClick(airline)}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                flex: "0 0 auto",
                minWidth: 116,
                maxWidth: 116,
                px: 1,
                py: 1.5,
          

                cursor: "pointer",
                backgroundColor: "#FFFFFF",
                // borderRadius: "5px",
                margin: "0 4px",
                transition: "all 0.2s ease",
                // border: "1px solid transparent",
                color: isSelected ? "#FFFFFF" : "inherit",
                backgroundColor: isSelected ? "var(--primary-color)" : "#FFFFFF",
                "&:hover": {
                  backgroundColor: isSelected ? "var(--primary-color)" : "#F5F5F5",
                },
              }}
            >
              {/* Airline Icon */}
              {getAirlineIcon(airline.code, airline.name)}

              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", minWidth: 42 }}>
                {/* Airline Code with Dot */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minHeight: 14 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: isSelected ? "#FFFFFF" : "#4F4F4F",
                      lineHeight: 1.1,
                      textTransform: "uppercase",
                    }}
                  >
                    {airline.code}
                  </Typography>
                  <Box
                    sx={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      backgroundColor: isSelected ? "#FFFFFF" : "#9E9E9E",
                    }}
                  />
                </Box>

                {/* Minimum Price */}
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: isSelected ? "#FFFFFF" : "#9E9E9E",
                    lineHeight: 1.1,
                    minHeight: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  {airline.minPrice !== null
                    ? airline.minPrice.toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })
                    : "Price unavailable"}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Right Arrow */}
      <IconButton
        onClick={() => handleScroll("right")}
        disabled={!canScrollRight}
        sx={{
          color: !canScrollRight ? "#9E9E9E" : "#616161",
          minWidth: 48,
          width: 48,
          height: 48,
          flexShrink: 0,
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          margin: "4px",
          opacity: !canScrollRight ? 0.5 : 1,
          "&:hover": {
            backgroundColor: !canScrollRight ? "#FFFFFF" : "rgba(0, 0, 0, 0.04)",
          },
          "&:disabled": {
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
};

export default AirlineFilterCard;
