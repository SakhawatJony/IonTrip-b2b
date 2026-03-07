import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Select, MenuItem, Pagination, Button, Dialog } from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import dayjs from "dayjs";
import AfterSearchBanner from "../../components/layout/AfterSearchBanner";
import OnewayFlightFilter from "./OnewayFlightFilter";
import OnewayFlight from "./OnewayFlight";
import OnewayFlightSkeleton from "./OnewayFlightSkeleton";
import OnewayFilterSkeleton from "./OnewayFilterSkeleton";
import DateSelectionBar from "./DateSelectionBar";
import FlightSortFilter from "./FlightSortFilter";
import FlightSortFilterSkeleton from "./FlightSortFilterSkeleton";
import AirlineFilterCard from "./AirlineFilterCard";
import useAuth from "../../hooks/useAuth";

const OneWaySearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currency: authCurrency, agentToken, agentData } = useAuth();

  // Use useMemo to re-extract values when location.state changes
  const searchParams = useMemo(() => {
    const data = location.state || {};
    return {
      from: data.from || "Dubai Int Airport (DXB)",
      to: data.to || "Hazrat Shahjalal Int Airport (DAC)",
      travelDate: data.travelDate || "",
      departureDateISO: data.departureDateISO || "",
      fromCode: data.fromCode || "",
      toCode: data.toCode || "",
      email: data.email || "",
      passengerCounts: data.passengerCounts || { adults: 1, children: 0, infants: 0 },
      childAges: data.childAges || [],
      travelClass: data.travelClass || "Economy",
      directFlight: data.directFlight || false,
      currency: data.currency,
    };
  }, [location.state]);

  const {
    from,
    to,
    travelDate,
    departureDateISO,
    fromCode,
    toCode,
    email,
    passengerCounts,
    childAges,
    travelClass,
    directFlight,
    currency: searchCurrency,
  } = searchParams;
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true); // Start with true to show skeleton on initial load
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [filterState, setFilterState] = useState({
    stops: [],
    airlines: [],
    refundability: [],
    departTimes: [],
    arriveTimes: [],
    minPrice: null,
    maxPrice: null,
  });
  const [sortBy, setSortBy] = useState("lowest");
  const [sortTimestamp, setSortTimestamp] = useState(Date.now());
  const [remainingSeconds, setRemainingSeconds] = useState(20 * 60);
  const [searchRefreshKey, setSearchRefreshKey] = useState(0);
  
  // Use ref to track the last search params to prevent duplicate API calls
  const lastSearchParamsRef = useRef(null);
  const isSearchingRef = useRef(false);
  
  // Debug: Log when sortBy changes
  useEffect(() => {
    console.log("🔍 sortBy state changed to:", sortBy);
  }, [sortBy]);
  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 10;

  // Reset state when location changes (new search)
  useEffect(() => {
    setFlights([]);
    setLoading(true); // Set loading to true when new search starts
    setFilterState({
      stops: [],
      airlines: [],
      refundability: [],
      departTimes: [],
      arriveTimes: [],
      minPrice: null,
      maxPrice: null,
    });
    setError("");
    setHasSearched(false);
    setSortBy("lowest");
    setCurrentPage(1);
    setRemainingSeconds(20 * 60);
    // Reset refs when location changes
    lastSearchParamsRef.current = null;
    isSearchingRef.current = false;
  }, [location.key, location.state]);

  useEffect(() => {
    if (remainingSeconds <= 0) return undefined;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const formatCount = (count, singular, plural) =>
    `${count} ${count === 1 ? singular : plural}`;
  const passengerSummary = [
    formatCount(passengerCounts.adults || 0, "Adult", "Adults"),
    formatCount(passengerCounts.children || 0, "Child", "Children"),
    formatCount(passengerCounts.infants || 0, "Infant", "Infants"),
  ].join(", ");

  const childAgeSummary =
    (passengerCounts.children || 0) > 0 && childAges.length > 0
      ? `Child ages: ${childAges.join(", ")}`
      : "";

  const extractAirportCode = (value) => {
    const match = value?.match(/\(([^)]+)\)/);
    return match ? match[1] : value?.trim() || "";
  };

  const effectiveFromCode = fromCode || extractAirportCode(from);
  const effectiveToCode = toCode || extractAirportCode(to);
  const effectiveDepartureDateISO =
    departureDateISO || (travelDate && dayjs(travelDate).isValid()
      ? dayjs(travelDate).format("YYYY-MM-DD")
      : "");

  const cabinClass = (travelClass || "economy").toLowerCase();
  const adultCount = passengerCounts.adults || 1;
  const childCount = passengerCounts.children || 0;
  const infantCount = passengerCounts.infants || 0;
  const apiTripType = (() => {
    const normalized = String(searchParams.tripType || "")
      .toLowerCase()
      .replace(/[\s_-]/g, "");
    return normalized || "oneway";
  })();

  // Use current auth currency if search currency is not set
  const effectiveCurrency = searchCurrency || authCurrency || "MYR";

  const requestBody = useMemo(
    () => ({
      tripType: apiTripType,
      journeyfrom: effectiveFromCode || "",
      journeyto: effectiveToCode || "",
      adult: adultCount,
      child: childCount,
      infant: infantCount,
      cabinclass: cabinClass,
      departuredate: effectiveDepartureDateISO || "",
      email: email || agentData?.email || "user@example.com",
      currency: effectiveCurrency,
    }),
    [
      effectiveFromCode,
      effectiveToCode,
      adultCount,
      childCount,
      infantCount,
      apiTripType,
      cabinClass,
      effectiveDepartureDateISO,
      email,
      effectiveCurrency,
      agentData,
    ]
  );

  const isSessionExpired = remainingSeconds <= 0;

  // Set loading to true when we have valid search params on mount
  useEffect(() => {
    if (requestBody.journeyfrom && requestBody.journeyto && requestBody.departuredate && !hasSearched) {
      setLoading(true);
    } else if (!requestBody.journeyfrom || !requestBody.journeyto || !requestBody.departuredate) {
      // Only set loading to false if we don't have valid params AND haven't searched yet
      if (!hasSearched) {
        setLoading(false);
      }
    }
  }, [requestBody.journeyfrom, requestBody.journeyto, requestBody.departuredate, hasSearched]);

  useEffect(() => {
    if (isSessionExpired) {
      setLoading(false);
      setHasSearched(true);
      return;
    }
    if (!requestBody.journeyfrom || !requestBody.journeyto || !requestBody.departuredate) {
      // Only set loading to false if we've already searched or if we don't have valid params
      if (hasSearched) {
        setLoading(false);
      }
      return;
    }

    // Create a unique key for this search to prevent duplicate calls
    const searchKey = JSON.stringify({
      journeyfrom: requestBody.journeyfrom,
      journeyto: requestBody.journeyto,
      departuredate: requestBody.departuredate,
      adult: requestBody.adult,
      child: requestBody.child,
      infant: requestBody.infant,
      cabinclass: requestBody.cabinclass,
      currency: requestBody.currency,
    });

    // Skip if this exact search was already performed or is currently in progress
    if (lastSearchParamsRef.current === searchKey || isSearchingRef.current) {
      return;
    }

    // Mark as searching and store the search key
    isSearchingRef.current = true;
    lastSearchParamsRef.current = searchKey;

    const controller = new AbortController();
    const fetchFlights = async () => {
      // Ensure loading is true before starting fetch
      setLoading(true);
      setHasSearched(true);
      setError("");
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
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
          throw new Error(`Search failed (${response.status})`);
        }

        const payload = await response.json();
        const rawFlights = Array.isArray(payload)
          ? payload
          : payload?.data || payload?.flights || payload?.results || payload?.items || payload;
        const normalized = Array.isArray(rawFlights) ? rawFlights : rawFlights ? [rawFlights] : [];

        const mappedFlights = normalized.map((item, index) => {
          const goSegments = item?.segments?.go || [];
          const firstSegment = goSegments[0];
          const lastSegment = goSegments[goSegments.length - 1];
          const priceCurrency =
            item?.farecurrency ||
            item?.currency ||
            item?.pricebreakdown?.[0]?.currency ||
            item?.USD?.farecurrency ||
            item?.USD?.currency ||
            item?.AirFareData?.price?.currency ||
            "USD";
          const priceValue =
            item?.clientFare ||
            item?.agentFare ||
            item?.netPrice ||
            item?.basePrice ||
            item?.USD?.clientFare ||
            item?.USD?.netPrice ||
            item?.USD?.agentFare ||
            item?.AirFareData?.price?.grandTotal ||
            item?.AirFareData?.price?.total ||
            "";
          const stopCount = Math.max(0, goSegments.length - 1);
          const stopLabel = stopCount === 0 ? "Non Stop" : `${stopCount} Stop${stopCount > 1 ? "s" : ""}`;
          const checkedBaggage =
            item?.pricebreakdown?.[0]?.CheckInBags ||
            firstSegment?.bags ||
            "";
          const cabinBaggage =
            item?.pricebreakdown?.[0]?.CabinBags ||
            "";
          const bookingClass =
            firstSegment?.bookingcode
              ? `${firstSegment.bookingcode} Class`
              : "";
          const cabinClass =
            item?.cabinClass ||
            firstSegment?.class ||
            travelClass ||
            "";

          return {
            ...item,
            id: item?.offerId || item?.AirFareData?.id || index + 1,
            carrierCode:
              item?.career ||
              firstSegment?.marketingcareer ||
              item?.AirFareData?.validatingAirlineCodes?.[0] ||
              "",
            airline:
              item?.careerName ||
              firstSegment?.marketingcareerName ||
              item?.AirFareData?.validatingAirlineCodes?.[0] ||
              "Airline",
            flightNo: goSegments.length
              ? goSegments
                .map((segment) => `${segment.marketingcareer} ${segment.marketingflight}`.trim())
                .filter(Boolean)
                .join(" | ")
              : item?.offerId || "",
            departTime: item?.godepartureTime || firstSegment?.departureTime || "",
            departDate: item?.godepartureDate || firstSegment?.departureTime || "",
            departCode: item?.godeparture || firstSegment?.departure || fromCode,
            arriveTime: item?.goarrivalTime || lastSegment?.arrivalTime || "",
            arriveDate: item?.goarrivalDate || lastSegment?.arrivalTime || "",
            arriveCode: item?.goarrival || lastSegment?.arrival || toCode,
            duration:
              item?.goflightduration ||
              item?.AirFareData?.itineraries?.[0]?.duration ||
              "",
            stops: stopLabel,
            price: priceValue ? `${priceCurrency} ${priceValue}` : "Price unavailable",
            priceValue: priceValue ? parseFloat(priceValue) : null, // Store numeric value for dynamic currency formatting
            priceCurrency: priceCurrency, // Store original currency from API
            seats: item?.seat ? `${item.seat} Seat available` : "Seat availability unknown",
            baggage: checkedBaggage ? `Baggage ${checkedBaggage}` : "Baggage info",
            checkedBaggage,
            cabinBaggage,
            bookingClass,
            class: cabinClass,
            cabinClass: cabinClass,
            refundable: item?.refundable || "Refundability unknown",
          };
        });

        setFlights(mappedFlights);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load flights.");
          setFlights([]);
        }
      } finally {
        setLoading(false);
        isSearchingRef.current = false;
      }
    };

    fetchFlights();

    return () => {
      controller.abort();
      isSearchingRef.current = false;
    };
  }, [requestBody, isSessionExpired, agentToken]);

  // Auto-search when currency changes - but only if we have valid search params
  useEffect(() => {
    if (hasSearched && !isSessionExpired && effectiveCurrency && requestBody.journeyfrom && requestBody.journeyto && requestBody.departuredate) {
      // Reset the last search params ref to allow a new search with updated currency
      lastSearchParamsRef.current = null;
      // Trigger search refresh when currency changes
      setSearchRefreshKey((prev) => prev + 1);
    }
  }, [effectiveCurrency, hasSearched, isSessionExpired, requestBody.journeyfrom, requestBody.journeyto, requestBody.departuredate]);

  const parseTimeBucket = (value) => {
    if (!value) return "";
    const match = String(value).match(/(\d{1,2}):(\d{2})/);
    if (!match) return "";
    const hour = Number(match[1]);
    if (Number.isNaN(hour)) return "";
    if (hour >= 0 && hour <= 4) return "12:00am - 04:59am";
    if (hour >= 5 && hour <= 11) return "05:00am - 11:59am";
    if (hour >= 12 && hour <= 17) return "12:00pm - 05:59pm";
    return "06:00pm - 11:59pm";
  };

  const normalizeStopLabel = (stops) => {
    if (!stops) return "";
    const normalized = String(stops).toLowerCase().trim();
    if (normalized.includes("non")) return "Non Stop";
    // Check for exactly 1 stop - matches "1 stop" or "one stop" but not "2 stops", "3 stops", etc.
    const oneStopPattern = /^1\s*stop$|^one\s*stop$/;
    if (oneStopPattern.test(normalized) || (normalized.includes("1") && normalized.includes("stop") && !normalized.match(/[2-9]/))) {
      return "One Stop";
    }
    // Everything else is one plus stops
    return "One Plus Stops";
  };

  const handleFilterChange = (filterType, value, checked) => {
    setFilterState((prev) => {
      const current = prev[filterType] || [];
      if (checked) {
        return { ...prev, [filterType]: [...current, value] };
      } else {
        return { ...prev, [filterType]: current.filter((item) => item !== value) };
      }
    });
  };

  const handleResetFilters = () => {
    setFilterState({
      stops: [],
      airlines: [],
      refundability: [],
      departTimes: [],
      arriveTimes: [],
      minPrice: null,
      maxPrice: null,
    });
  };

  const normalizeRefundability = (value) => {
    const refundableText = String(value || "").toLowerCase();
    const isRefundable =
      refundableText.includes("refund") &&
      !refundableText.includes("non-refund") &&
      !refundableText.includes("no refund") &&
      !refundableText.includes("not refund") &&
      refundableText !== "refundability unknown";
    return isRefundable ? "Refundable" : "Non Refundable";
  };

  const handlePriceRangeChange = (minPrice, maxPrice) => {
    setFilterState((prev) => ({
      ...prev,
      minPrice,
      maxPrice,
    }));
  };

  // Parse duration function - must be defined before filteredAndSortedFlights
  const parseDuration = (duration) => {
    try {
      if (!duration) {
        return null;
      }
      
      const durationStr = String(duration).trim();
      
      // Try format like "7H 55Min" or "10H 50Min" - more specific pattern first
      // Pattern: number + H + space + number + Min
      let match = durationStr.match(/(\d+)\s*[Hh](?:r|our|ours)?\s*(\d+)\s*[Mm](?:in|inute|inutes)?/i);
      if (match) {
        const hours = Number(match[1]) || 0;
        const minutes = Number(match[2]) || 0;
        const totalMinutes = hours * 60 + minutes;
        return totalMinutes;
      }
      
      // Try format like "10H 50Min" or "10 H 50 Min" (with capital H and Min) - original pattern
      match = durationStr.match(/(\d+)\s*(?:h|hr|hour|hours|Hr|H|Hour|Hours)\s*(\d+)?\s*(?:m|min|minute|minutes|Min|M|Minute|Minutes)?/i);
      if (match) {
        const hours = Number(match[1]) || 0;
        const minutes = Number(match[2]) || 0;
        const totalMinutes = hours * 60 + minutes;
        return totalMinutes;
      }
      
      // Try format like "1h" or "1 Hr" or "1Hr" or "10H" (hours only)
      match = durationStr.match(/(\d+)\s*(?:h|hr|hour|hours|Hr|H|Hour|Hours)/i);
      if (match) {
        const hours = Number(match[1]) || 0;
        return hours * 60;
      }
      
      // Try format like "30m" or "30 Min" or "30Min" or "50Min" (minutes only)
      match = durationStr.match(/(\d+)\s*(?:m|min|minute|minutes|Min|M|Minute|Minutes)/i);
      if (match) {
        const minutes = Number(match[1]) || 0;
        return minutes;
      }
      
      // Try format like "1:30" (hours:minutes) or "01:30:00" (with seconds)
      match = durationStr.match(/(\d+):(\d+)(?::\d+)?/);
      if (match) {
        const hours = Number(match[1]) || 0;
        const minutes = Number(match[2]) || 0;
        return hours * 60 + minutes;
      }
      
      // Try pure number (assume minutes)
      const pureNumber = parseFloat(durationStr);
      if (!isNaN(pureNumber) && pureNumber > 0) {
        return pureNumber;
      }
      
      return null;
    } catch (error) {
      console.error("Error parsing duration:", error, duration);
      return null;
    }
  };

  // Parse time to minutes function - must be defined before filteredAndSortedFlights
  const parseTimeToMinutes = (time) => {
    try {
      if (!time) return null;
      const timeStr = String(time);
      
      // Try format like "HH:MM" or "H:MM"
      let match = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        const hours = Number(match[1]) || 0;
        const minutes = Number(match[2]) || 0;
        return hours * 60 + minutes;
      }
      
      // Try format like "HH:MM:SS"
      match = timeStr.match(/(\d{1,2}):(\d{2}):(\d{2})/);
      if (match) {
        const hours = Number(match[1]) || 0;
        const minutes = Number(match[2]) || 0;
        return hours * 60 + minutes;
      }
      
      return null;
    } catch (error) {
      console.error("Error parsing time:", error, time);
      return null;
    }
  };

  const filteredAndSortedFlights = useMemo(() => {
    console.log("🔄 Recalculating filteredAndSortedFlights - sortBy:", sortBy, "flights count:", flights?.length);
    
    if (!flights || flights.length === 0) {
      return [];
    }

    try {
      // Create a copy to ensure React detects the change
      let filtered = [...flights];

      // Filter by stops
      if (filterState.stops.length > 0) {
        filtered = filtered.filter((flight) => {
          const normalizedStop = normalizeStopLabel(flight?.stops);
          return filterState.stops.includes(normalizedStop);
        });
      }

      // Filter by airlines
      if (filterState.airlines.length > 0) {
        filtered = filtered.filter((flight) => {
          return filterState.airlines.includes(flight?.airline);
        });
      }

      // Filter by departure time
      if (filterState.departTimes.length > 0) {
        filtered = filtered.filter((flight) => {
          const departBucket = parseTimeBucket(flight?.departTime);
          return filterState.departTimes.includes(departBucket);
        });
      }

      // Filter by arrival time
      if (filterState.arriveTimes.length > 0) {
        filtered = filtered.filter((flight) => {
          const arriveBucket = parseTimeBucket(flight?.arriveTime);
          return filterState.arriveTimes.includes(arriveBucket);
        });
      }

      // Filter by price range
      if (Number.isFinite(filterState.minPrice) && Number.isFinite(filterState.maxPrice)) {
        filtered = filtered.filter((flight) => {
          let price = null;
          if (
            typeof flight?.priceValue === "number" &&
            !Number.isNaN(flight.priceValue) &&
            flight.priceValue > 0
          ) {
            price = flight.priceValue;
          } else if (flight?.price) {
            const parsed = parseFloat(String(flight.price).replace(/[^\d.]/g, ""));
            if (!Number.isNaN(parsed) && parsed > 0) {
              price = parsed;
            }
          }

          if (price === null) return false;
          return price >= filterState.minPrice && price <= filterState.maxPrice;
        });
      }

      // Filter by refundability
      if (filterState.refundability.length > 0) {
        filtered = filtered.filter((flight) => {
          const normalizedRefundability = normalizeRefundability(flight?.refundable);
          return filterState.refundability.includes(normalizedRefundability);
        });
      }

      // Sort flights - create a stable sort
      // Always sort, even if sortBy is not explicitly set
      if (sortBy === "lowest" || !sortBy) {
        filtered = [...filtered].sort((a, b) => {
          try {
            // Use priceValue if available, otherwise parse from price string
            let priceA = Infinity;
            if (a?.priceValue && typeof a.priceValue === 'number' && !isNaN(a.priceValue) && a.priceValue > 0) {
              priceA = a.priceValue;
            } else if (a?.price) {
              const priceStr = String(a.price);
              const parsed = parseFloat(priceStr.replace(/[^\d.]/g, ""));
              if (!isNaN(parsed) && parsed > 0) {
                priceA = parsed;
              }
            }
            
            let priceB = Infinity;
            if (b?.priceValue && typeof b.priceValue === 'number' && !isNaN(b.priceValue) && b.priceValue > 0) {
              priceB = b.priceValue;
            } else if (b?.price) {
              const priceStr = String(b.price);
              const parsed = parseFloat(priceStr.replace(/[^\d.]/g, ""));
              if (!isNaN(parsed) && parsed > 0) {
                priceB = parsed;
              }
            }
            
            // Put flights without valid prices at the end
            if (priceA === Infinity && priceB === Infinity) return 0;
            if (priceA === Infinity) return 1;
            if (priceB === Infinity) return -1;
            
            return priceA - priceB;
          } catch (error) {
            console.error("Error sorting by price:", error);
            return 0;
          }
        });
      } else if (sortBy === "highest") {
        filtered = [...filtered].sort((a, b) => {
          try {
            let priceA = -Infinity;
            if (a?.priceValue && typeof a.priceValue === "number" && !isNaN(a.priceValue) && a.priceValue > 0) {
              priceA = a.priceValue;
            } else if (a?.price) {
              const parsed = parseFloat(String(a.price).replace(/[^\d.]/g, ""));
              if (!isNaN(parsed) && parsed > 0) {
                priceA = parsed;
              }
            }

            let priceB = -Infinity;
            if (b?.priceValue && typeof b.priceValue === "number" && !isNaN(b.priceValue) && b.priceValue > 0) {
              priceB = b.priceValue;
            } else if (b?.price) {
              const parsed = parseFloat(String(b.price).replace(/[^\d.]/g, ""));
              if (!isNaN(parsed) && parsed > 0) {
                priceB = parsed;
              }
            }

            // Put flights without valid prices at the end
            if (priceA === -Infinity && priceB === -Infinity) return 0;
            if (priceA === -Infinity) return 1;
            if (priceB === -Infinity) return -1;

            return priceB - priceA;
          } catch (error) {
            console.error("Error sorting by highest price:", error);
            return 0;
          }
        });
      } else if (sortBy === "fastest") {
        filtered = [...filtered].sort((a, b) => {
          try {
            const durationA = parseDuration(a?.duration);
            const durationB = parseDuration(b?.duration);
            
            // Put flights without duration at the end
            if (durationA === null && durationB === null) return 0;
            if (durationA === null) return 1;
            if (durationB === null) return -1;
            
            // Handle NaN cases
            if (isNaN(durationA) && isNaN(durationB)) return 0;
            if (isNaN(durationA)) return 1;
            if (isNaN(durationB)) return -1;
            
            // Both are valid numbers, sort ascending (shortest first)
            return durationA - durationB;
          } catch (error) {
            console.error("Error sorting by duration:", error);
            return 0;
          }
        });
      } else if (sortBy === "earliest") {
        filtered = [...filtered].sort((a, b) => {
          try {
            const timeA = parseTimeToMinutes(a?.departTime);
            const timeB = parseTimeToMinutes(b?.departTime);
            // Put flights without time at the end
            if (timeA === null && timeB === null) return 0;
            if (timeA === null) return 1;
            if (timeB === null) return -1;
            if (isNaN(timeA) || isNaN(timeB)) return 0;
            return timeA - timeB;
          } catch (error) {
            console.error("Error sorting by time:", error);
            return 0;
          }
        });
      }

      // Create a new array reference to ensure React detects the change
      const result = [...filtered];
      console.log("✅ Sorting complete - sortBy:", sortBy, "result count:", result.length);
      if (result.length > 0 && sortBy) {
        console.log("✅ First 3 flights after sort:", result.slice(0, 3).map(f => ({
          id: f?.id,
          sortBy,
          price: f?.price,
          priceValue: f?.priceValue,
          departTime: f?.departTime,
          duration: f?.duration,
          parsedDuration: parseDuration(f?.duration)
        })));
      }
      return result;
    } catch (error) {
      console.error("Error filtering/sorting flights:", error);
      // Return original flights array if there's an error
      return flights || [];
    }
  }, [flights, filterState, sortBy, sortTimestamp]);

  // Calculate pagination - use useMemo to recalculate when sortBy or filteredAndSortedFlights changes
  const paginatedFlights = useMemo(() => {
    const totalPages = Math.ceil(filteredAndSortedFlights.length / flightsPerPage);
    const startIndex = (currentPage - 1) * flightsPerPage;
    const endIndex = startIndex + flightsPerPage;
    const paginated = filteredAndSortedFlights.slice(startIndex, endIndex);
    console.log("📄 Pagination updated - sortBy:", sortBy, "currentPage:", currentPage, "paginated count:", paginated.length);
    return paginated;
  }, [filteredAndSortedFlights, currentPage, sortBy, sortTimestamp, flightsPerPage]);
  
  const totalPages = Math.ceil(filteredAndSortedFlights.length / flightsPerPage);

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    filterState.stops,
    filterState.airlines,
    filterState.refundability,
    filterState.departTimes,
    filterState.arriveTimes,
    filterState.minPrice,
    filterState.maxPrice,
    sortBy,
  ]);

  const priceBounds = useMemo(() => {
    const prices = flights
      .map((flight) => {
        if (
          typeof flight?.priceValue === "number" &&
          !Number.isNaN(flight.priceValue) &&
          flight.priceValue > 0
        ) {
          return flight.priceValue;
        }
        const parsed = parseFloat(String(flight?.price || "").replace(/[^\d.]/g, ""));
        return !Number.isNaN(parsed) && parsed > 0 ? parsed : null;
      })
      .filter((price) => price !== null);

    if (!prices.length) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [flights]);

  // Handle sort change callback
  const handleSortChange = useCallback((newSortBy) => {
    console.log("📞 Parent: handleSortChange called with:", newSortBy);
    setSortBy((prevSortBy) => {
      console.log("📞 Parent: setSortBy - prev:", prevSortBy, "new:", newSortBy);
      return newSortBy;
    });
    setSortTimestamp(Date.now()); // Force re-render by updating timestamp
    console.log("📞 Parent: State update triggered");
  }, []);

  const handleAirlineSelect = useCallback((airlineName) => {
    setFilterState((prev) => {
      const currentAirlines = prev.airlines || [];
      if (!currentAirlines.includes(airlineName)) {
        return { ...prev, airlines: [...currentAirlines, airlineName] };
      }
      return prev;
    });
  }, []);

  const handleAirlineDeselect = useCallback((airlineName) => {
    setFilterState((prev) => {
      const currentAirlines = prev.airlines || [];
      return { ...prev, airlines: currentAirlines.filter((a) => a !== airlineName) };
    });
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top of flights list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDateSelect = (selectedDateStr) => {
    // Update the search with new date
    const newSearchParams = {
      ...searchParams,
      travelDate: dayjs(selectedDateStr).format("DD MMM, YYYY"),
      departureDateISO: selectedDateStr,
    };

    // Navigate with new search params to trigger new search
    navigate(location.pathname, {
      state: newSearchParams,
      replace: true,
    });
  };

  const formatRemainingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min : ${String(secs).padStart(2, "0")} sec`;
  };

  const handleSearchAgain = () => {
    navigate("/");
  };


  const filterData = useMemo(() => {
    const airlineMap = new Map();
    const stopSet = new Set();
    const refundableSet = new Set();
    const departTimeSet = new Set();
    const arriveTimeSet = new Set();

    flights.forEach((item) => {
      if (item?.airline) {
        const airlineName = item.airline;
        const carrierCode = String(item?.carrierCode || "")
          .trim()
          .toUpperCase();
        if (!airlineMap.has(airlineName)) {
          airlineMap.set(airlineName, {
            name: airlineName,
            code: carrierCode,
          });
        } else if (carrierCode && !airlineMap.get(airlineName)?.code) {
          airlineMap.set(airlineName, {
            name: airlineName,
            code: carrierCode,
          });
        }
      }
      if (item?.stops) {
        const normalizedStop = normalizeStopLabel(item.stops);
        if (normalizedStop) {
          stopSet.add(normalizedStop);
        }
      }
      refundableSet.add(normalizeRefundability(item?.refundable));
      const departBucket = parseTimeBucket(item?.departTime);
      if (departBucket) {
        departTimeSet.add(departBucket);
      }
      const arriveBucket = parseTimeBucket(item?.arriveTime);
      if (arriveBucket) {
        arriveTimeSet.add(arriveBucket);
      }
    });

    const bucketOrder = [
      "12:00am - 04:59am",
      "05:00am - 11:59am",
      "12:00pm - 05:59pm",
      "06:00pm - 11:59pm",
    ];

    return {
      airlines: Array.from(airlineMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      stops: Array.from(stopSet),
      refundableOptions: ["Non Refundable", "Refundable"].filter((label) => refundableSet.has(label)),
      departTimes: bucketOrder.filter((label) => departTimeSet.has(label)),
      arriveTimes: bucketOrder.filter((label) => arriveTimeSet.has(label)),
    };
  }, [flights]);

  return (
    <Box>
      <Box sx={{ mt: 2 }}>
        <AfterSearchBanner initialSearchParams={searchParams} />
      </Box>
      <Box sx={{ mt: 2,px: { xs: 2, md: 4 } }}>
        <DateSelectionBar
          selectedDate={effectiveDepartureDateISO || travelDate}
          onDateSelect={handleDateSelect}
          from={from}
          to={to}
          currency={effectiveCurrency}
          fromCode={effectiveFromCode}
          toCode={effectiveToCode}
          passengerCounts={passengerCounts}
          travelClass={travelClass}
          email={email}
        />
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2.4} >
            {loading ? (
              <OnewayFilterSkeleton />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  height: "calc(100vh - 180px)",
                  overflowY: "auto",
                  overflowX: "hidden",
                  pr: 1,
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "2px",
                    "&:hover": {
                      background: "#555",
                    },
                  },
                }}
              >
                {!isSessionExpired ? (
                  <Box
                    sx={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: 2,
                      px: 1.5,
                      py: 1.25,
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
                        <AccessTimeOutlinedIcon sx={{ fontSize: 14, color: "var(--primary-color)", flexShrink: 0 }} />

                      </Box>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: "var(--primary-color)",
                          lineHeight: 1,
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatRemainingTime(remainingSeconds)}
                      </Typography>
                    </Box>
                  </Box>
                ) : null}

                <OnewayFlightFilter
                  stops={filterData.stops}
                  airlines={filterData.airlines}
                  refundableOptions={filterData.refundableOptions}
                  departTimes={filterData.departTimes}
                  arriveTimes={filterData.arriveTimes}
                  filterState={filterState}
                  priceBounds={priceBounds}
                  onPriceRangeChange={handlePriceRangeChange}
                  currency={effectiveCurrency}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={9.6}>
            <Box
              sx={{
                height: "calc(100vh - 120px)",
                overflowY: "auto",
                overflowX: "hidden",
                pr: 1,
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "2px",
                  "&:hover": {
                    background: "#555",
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", md: "center" },
                  justifyContent: "space-between",
                  mb: 2,
                  flexDirection: { xs: "column", md: "row" },
                  gap: 1.5,
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#1F1F1F" }}>
                    {from} → {to}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography sx={{ fontSize: 12, color: "#6B6B6B" }}>
                      {loading
                        ? "Searching flights..."
                        : `${filteredAndSortedFlights.length} Flights found${totalPages > 1 ? ` (Page ${currentPage} of ${totalPages})` : ""}`}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#6B6B6B" }}>
                      {travelDate || "Travel date not set"} | {travelClass}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#6B6B6B" }}>
                      {passengerSummary} | Direct flight: {directFlight ? "Yes" : "No"}
                    </Typography>
                    {childAgeSummary ? (
                      <Typography sx={{ fontSize: 12, color: "#6B6B6B" }}>
                        {childAgeSummary}
                      </Typography>
                    ) : null}
                    {error ? (
                      <Typography sx={{ fontSize: 12, color: "#D32F2F" }}>{error}</Typography>
                    ) : null}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: 13, color: "#6B6B6B" }}>Sort By</Typography>
                  <Select
                    size="small"
                    // value={sortBy}
                    // onChange={(e) => handleSortChange(e.target.value)}
                    sx={{
                      backgroundColor: "#FFFFFF",
                      fontSize: 13,
                      height: 34,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <MenuItem value="lowest">AgentFare</MenuItem>
                    <MenuItem value="highest">ClientFare</MenuItem>
                 
                  </Select>
                </Box>
              </Box>

             

              {/* Airline Filter Card */}
              {!loading && flights.length > 0 && (
                <AirlineFilterCard
                  flights={flights}
                  selectedAirlines={filterState.airlines || []}
                  onAirlineSelect={handleAirlineSelect}
                  onAirlineDeselect={handleAirlineDeselect}
                  currency={effectiveCurrency}
                />
              )}
               {loading ? (
                <FlightSortFilterSkeleton />
              ) : (
                <FlightSortFilter
                  flights={flights}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  currency={effectiveCurrency}
                />
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <OnewayFlightSkeleton key={`flight-skeleton-${index}`} />
                ))
              ) : hasSearched && filteredAndSortedFlights.length === 0 ? (
                <Typography sx={{ fontSize: 14, color: "#6B6B6B" }}>
                  No flights found.
                </Typography>
              ) : (
                <>
                  {paginatedFlights?.map((flight, index) => {
                    // Force re-render by including sortBy and currentPage in key
                    return (
                      <OnewayFlight 
                        key={`flight-${flight.id}-${sortBy}-${sortTimestamp}-${currentPage}-${index}`} 
                        flight={flight} 
                      />
                    );
                  })}

                  {/* Pagination - show when there are results (even for single page) */}
                  {filteredAndSortedFlights.length > 0 && totalPages >= 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 4,
                        mb: 2,
                      }}
                    >
                      <Pagination
                        count={Math.max(1, totalPages)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                          "& .MuiPaginationItem-root": {
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#1F1F1F",
                            "&.Mui-selected": {
                              backgroundColor: "var(--primary-color)",
                              color: "#FFFFFF",
                              "&:hover": {
                                backgroundColor: "var(--primary-color)",
                                opacity: 0.9,
                              },
                            },
                            "&:hover": {
                              backgroundColor: "rgba(18, 61, 110, 0.08)",
                            },
                          },
                          "& .MuiPaginationItem-icon": {
                            color: "var(--primary-color)",
                          },
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={isSessionExpired}
        aria-labelledby="session-expired-title"
        aria-describedby="session-expired-description"
      >
        <Box sx={{ p: 2.5, minWidth: { xs: 260, sm: 320 }, textAlign: "center" }}>
          <Typography
            id="session-expired-title"
            sx={{ fontSize: 20, fontWeight: 700, color: "#B42318", mb: 0.75 }}
          >
            Session expired
          </Typography>
          <Typography
            id="session-expired-description"
            sx={{ fontSize: 14, color: "#5F6B7A", mb: 2 }}
          >
            Please search again.
          </Typography>
          <Button
            variant="contained"
            onClick={handleSearchAgain}
            sx={{
              textTransform: "none",
              backgroundColor: "var(--primary-color)",
              "&:hover": { backgroundColor: "var(--primary-color)", opacity: 0.9 },
            }}
          >
            Search Again
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default OneWaySearchResult;