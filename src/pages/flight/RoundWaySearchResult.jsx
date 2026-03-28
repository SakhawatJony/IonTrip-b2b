import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Grid, Typography, Pagination, LinearProgress } from "@mui/material";
import dayjs from "dayjs";
import ModifySearchBar from "../../components/layout/ModifySearchBar";
import OnewayFlightFilter from "./OnewayFlightFilter";
import RoundWayFlight from "./RoundWayFlight";
import FlightSortFilter from "./FlightSortFilter";
import AirlineFilterCard from "./AirlineFilterCard";
import OnewayFlightSkeleton from "./OnewayFlightSkeleton";
import OnewayFilterSkeleton from "./OnewayFilterSkeleton";
import FlightSortFilterSkeleton from "./FlightSortFilterSkeleton";
import DateSelectionBar from "./DateSelectionBar";
import useAuth from "../../hooks/useAuth";

const RoundWaySearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currency: authCurrency, agentToken, agentData } = useAuth();
  const searchParams = useMemo(() => {
    const data = location.state || {};
    return {
      tripType: data.tripType || "round-way",
      from: data.from || "Dubai Int Airport (DXB)",
      to: data.to || "Hazrat Shahjalal Int Airport (DAC)",
      travelDate: data.travelDate || "",
      departureDateISO: data.departureDateISO || "",
      returnDate: data.returnDate || "",
      returnDateISO: data.returnDateISO || "",
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

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState("lowest");
  const [currentPage, setCurrentPage] = useState(1);
  const [progress, setProgress] = useState(18);
  const flightsPerPage = 10;
  
  // Use ref to track the last search params to prevent duplicate API calls
  const lastSearchParamsRef = useRef(null);
  const isSearchingRef = useRef(false);
  const [filterState, setFilterState] = useState({
    stops: [],
    airlines: [],
    refundability: [],
    departTimes: [],
    arriveTimes: [],
    goDepartTimes: [],
    backDepartTimes: [],
    goArriveTimes: [],
    backArriveTimes: [],
    minPrice: null,
    maxPrice: null,
  });

  const extractAirportCode = (value) => {
    const match = value?.match(/\(([^)]+)\)/);
    return match ? match[1] : value?.trim() || "";
  };

  const parseTimeBucket = (value) => {
    if (!value) return "";
    const match = String(value).match(/(\d{1,2}):(\d{2})/);
    if (!match) return "";
    const hour = Number(match[1]);
    if (hour >= 0 && hour <= 4) return "12:00am - 04:59am";
    if (hour >= 5 && hour <= 11) return "05:00am - 11:59am";
    if (hour >= 12 && hour <= 17) return "12:00pm - 05:59pm";
    return "06:00pm - 11:59pm";
  };

  const parseDuration = (duration) => {
    try {
      if (!duration) return null;
      const durationStr = String(duration).trim();
      let match = durationStr.match(/(\d+)\s*[Hh](?:r|our|ours)?\s*(\d+)\s*[Mm](?:in|inute|inutes)?/i);
      if (match) {
        const hours = Number(match[1]) || 0;
        const minutes = Number(match[2]) || 0;
        return hours * 60 + minutes;
      }
      match = durationStr.match(/(\d+)\s*(?:h|hr|hour|hours|Hr|H|Hour|Hours)\s*(\d+)?/i);
      if (match) {
        const hours = Number(match[1]) || 0;
        const minutes = Number(match[2]) || 0;
        return hours * 60 + minutes;
      }
      match = durationStr.match(/(\d+)\s*(?:m|min|minute|minutes|Min|M|Minute|Minutes)/i);
      if (match) return Number(match[1]) || 0;
      match = durationStr.match(/(\d+):(\d+)(?::\d+)?/);
      if (match) return (Number(match[1]) || 0) * 60 + (Number(match[2]) || 0);
      return null;
    } catch {
      return null;
    }
  };

  const parseTimeToMinutes = (time) => {
    if (!time) return null;
    const match = String(time).match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;
    return (Number(match[1]) || 0) * 60 + (Number(match[2]) || 0);
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

  const normalizeStopLabel = (stops) => {
    const normalized = String(stops || "").toLowerCase().trim();
    if (normalized.includes("non")) return "Non Stop";
    if (normalized === "1 stop" || normalized === "one stop") return "One Stop";
    return "One Plus Stops";
  };

  const effectiveFromCode = searchParams.fromCode || extractAirportCode(searchParams.from);
  const effectiveToCode = searchParams.toCode || extractAirportCode(searchParams.to);
  const effectiveDepartureDateISO =
    searchParams.departureDateISO ||
    (searchParams.travelDate && dayjs(searchParams.travelDate).isValid()
      ? dayjs(searchParams.travelDate).format("YYYY-MM-DD")
      : "");
  const effectiveReturnDateISO =
    searchParams.returnDateISO ||
    (searchParams.returnDate && dayjs(searchParams.returnDate).isValid()
      ? dayjs(searchParams.returnDate).format("YYYY-MM-DD")
      : "");
  const apiTripType = (() => {
    const normalized = String(searchParams.tripType || "")
      .toLowerCase()
      .replace(/[\s_-]/g, "");
    return normalized || "roundway";
  })();
  const cabinClass = (searchParams.travelClass || "economy").toLowerCase();
  const adultCount = Number(searchParams.passengerCounts?.adults) || 1;
  const childCount = Number(searchParams.passengerCounts?.children) || 0;
  const infantCount = Number(searchParams.passengerCounts?.infants) || 0;
  const effectiveCurrency = searchParams.currency || authCurrency || "USD";

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
      returndate: effectiveReturnDateISO || "",
      email: searchParams.email || agentData?.email || "user@example.com",
      currency: effectiveCurrency,
    }),
    [
      effectiveFromCode,
      effectiveToCode,
      effectiveDepartureDateISO,
      effectiveReturnDateISO,
      apiTripType,
      adultCount,
      childCount,
      infantCount,
      cabinClass,
      searchParams.email,
      effectiveCurrency,
      agentData,
    ]
  );

  // Reset state and refs when location changes (new search)
  useEffect(() => {
    setFlights([]);
    setLoading(true);
    setError("");
    setHasSearched(false);
    setSortBy("lowest");
    setCurrentPage(1);
    setFilterState({
      stops: [],
      airlines: [],
      refundability: [],
      departTimes: [],
      arriveTimes: [],
      goDepartTimes: [],
      backDepartTimes: [],
      goArriveTimes: [],
      backArriveTimes: [],
      minPrice: null,
      maxPrice: null,
    });
    // Reset refs when location changes
    lastSearchParamsRef.current = null;
    isSearchingRef.current = false;
  }, [location.key, location.state]);

  useEffect(() => {
    if (!loading) {
      setProgress(100);
      return undefined;
    }

    setProgress(18);
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? 18 : Math.min(prev + 8, 92)));
    }, 350);

    return () => clearInterval(timer);
  }, [loading, location.key]);

  useEffect(() => {
    if (!requestBody.journeyfrom || !requestBody.journeyto || !requestBody.departuredate || !requestBody.returndate) {
      return;
    }

    // Create a unique key for this search to prevent duplicate calls
    const searchKey = JSON.stringify({
      journeyfrom: requestBody.journeyfrom,
      journeyto: requestBody.journeyto,
      departuredate: requestBody.departuredate,
      returndate: requestBody.returndate,
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

    const toDetailSegments = (segments = []) =>
      segments.map((segment) => ({
        departTime: segment?.departureTime || "",
        departDate: segment?.departureTime || "",
        arriveTime: segment?.arrivalTime || "",
        arriveDate: segment?.arrivalTime || "",
        fromCode: segment?.departure || "",
        fromName: segment?.departureAirport || segment?.departureLocation || "",
        toCode: segment?.arrival || "",
        toName: segment?.arrivalAirport || segment?.arrivalLocation || "",
        airline: segment?.marketingcareerName || segment?.marketingcareer || "Airline",
        flight: `${segment?.marketingcareer || ""} ${segment?.marketingflight || ""}`.trim(),
        aircraft: segment?.aircraft || "N/A",
        cabin: segment?.class || requestBody.cabinclass || "Economy",
        bookingClass: segment?.bookingcode || segment?.bookingClass || "N/A",
        baggage: segment?.bags || "N/A",
        duration: segment?.flightduration || segment?.duration || "",
        transit: segment?.transit?.transit1 || "",
        amenities: Array.isArray(segment?.amenities) ? segment.amenities : [],
      }));

    const buildLegSummary = (segments, fallbackFrom, fallbackTo, fallbackDuration = "") => {
      const first = segments?.[0];
      const last = segments?.[segments.length - 1];
      const stopCount = Math.max(0, (segments?.length || 0) - 1);
      return {
        airline: first?.marketingcareerName || first?.marketingcareer || "Airline",
        flightNo: (segments || [])
          .map((segment) => `${segment?.marketingcareer || ""} ${segment?.marketingflight || ""}`.trim())
          .filter(Boolean)
          .join(" | "),
        departTime: first?.departureTime || "",
        departDate: first?.departureTime || "",
        departCode: first?.departure || fallbackFrom,
        arriveTime: last?.arrivalTime || "",
        arriveDate: last?.arrivalTime || "",
        arriveCode: last?.arrival || fallbackTo,
        duration: first?.flightduration || first?.duration || fallbackDuration || "",
        stops: stopCount === 0 ? "Non Stop" : `${stopCount} Stop${stopCount > 1 ? "s" : ""}`,
        carrierCode: first?.marketingcareer || first?.operatingcareer || "",
      };
    };

    const fetchFlights = async () => {
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
          const outbound = item?.segments?.go || item?.segments?.outbound || [];
          const inbound = item?.segments?.back || item?.segments?.return || item?.segments?.inbound || [];
          const outboundSummary = buildLegSummary(
            outbound,
            effectiveFromCode,
            effectiveToCode,
            item?.goflightduration
          );
          const inboundSummary = buildLegSummary(
            inbound,
            effectiveToCode,
            effectiveFromCode,
            item?.backflightduration
          );
          const priceCurrency =
            item?.farecurrency ||
            item?.currency ||
            item?.pricebreakdown?.[0]?.currency ||
            item?.USD?.farecurrency ||
            item?.USD?.currency ||
            "USD";
          const priceValue =
            item?.clientFare ||
            item?.agentFare ||
            item?.netPrice ||
            item?.basePrice ||
            item?.USD?.clientFare ||
            item?.USD?.netPrice ||
            item?.USD?.agentFare ||
            "";
          const stopCount = Math.max(0, (outbound?.length || 0) - 1);
          const stopLabel = stopCount === 0 ? "Non Stop" : `${stopCount} Stop${stopCount > 1 ? "s" : ""}`;
          const bags = item?.pricebreakdown?.[0]?.CheckInBags || "";

          return {
            system: item?.system || "",
            email: item?.email || requestBody.email || "",
            offerId: item?.offerId || "",
            triptype: item?.triptype || requestBody.tripType || "",
            lastTicketTime: item?.lastTicketTime || "",
            basePrice: item?.basePrice || 0,
            taxes: item?.taxes || 0,
            clientFare: item?.clientFare || item?.USD?.clientFare || null,
            agentFare: item?.agentFare || item?.USD?.agentFare || null,
            netPrice: item?.netPrice || item?.USD?.netPrice || null,
            farecurrency: item?.farecurrency || item?.currency || item?.pricebreakdown?.[0]?.currency || "",
            pricebreakdown: Array.isArray(item?.pricebreakdown) ? item.pricebreakdown : [],
            id: item?.offerId || index + 1,
            segments: [outboundSummary, inboundSummary],
            details: {
              outboundSegments: toDetailSegments(outbound),
              returnSegments: toDetailSegments(inbound),
            },
            airline: outboundSummary.airline || inboundSummary.airline || "Airline",
            stops: stopLabel,
            departTime: outboundSummary.departTime,
            arriveTime: inboundSummary.arriveTime,
            departDate: item?.godepartureDate || outboundSummary.departDate,
            arriveDate: item?.backarrivalDate || inboundSummary.arriveDate,
            price: priceValue ? `${priceCurrency} ${priceValue}` : "Price unavailable",
            priceValue: priceValue ? parseFloat(priceValue) : null,
            priceCurrency,
            carrierCode:
              item?.career ||
              outbound?.[0]?.marketingcareer ||
              inbound?.[0]?.marketingcareer ||
              "",
            duration:
              outboundSummary?.duration ||
              inboundSummary?.duration ||
              item?.goflightduration ||
              "",
            seats: item?.seat ? `${item.seat} Seat available` : "Seat availability unknown",
            baggage: bags ? `Baggage ${bags}` : "Baggage info",
            checkedBaggage: item?.pricebreakdown?.[0]?.CheckInBags || "",
            cabinBaggage: item?.pricebreakdown?.[0]?.CabinBags || "",
            class: item?.cabinClass || requestBody.cabinclass || "",
            refundable: item?.refundable || "Refundability unknown",
            // Preserve original API response data for offer price API call
            originalData: item,
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
  }, [requestBody, agentToken]);

  const handleFilterChange = (filterType, value, checked) => {
    setFilterState((prev) => {
      const current = prev[filterType] || [];
      return checked
        ? { ...prev, [filterType]: [...current, value] }
        : { ...prev, [filterType]: current.filter((item) => item !== value) };
    });
  };

  const handleResetFilters = () => {
    setFilterState({
      stops: [],
      airlines: [],
      refundability: [],
      departTimes: [],
      arriveTimes: [],
      goDepartTimes: [],
      backDepartTimes: [],
      goArriveTimes: [],
      backArriveTimes: [],
      minPrice: null,
      maxPrice: null,
    });
  };

  const handlePriceRangeChange = (minPrice, maxPrice) => {
    setFilterState((prev) => ({ ...prev, minPrice, maxPrice }));
  };

  const filteredFlights = useMemo(() => {
    let filtered = [...flights];
    if (filterState.stops.length > 0) {
      filtered = filtered.filter((flight) => filterState.stops.includes(normalizeStopLabel(flight?.stops)));
    }
    if (filterState.airlines.length > 0) {
      filtered = filtered.filter((flight) => filterState.airlines.includes(flight?.airline));
    }
    if (filterState.refundability.length > 0) {
      filtered = filtered.filter((flight) =>
        filterState.refundability.includes(normalizeRefundability(flight?.refundable))
      );
    }
    if (filterState.departTimes.length > 0) {
      filtered = filtered.filter((flight) =>
        filterState.departTimes.includes(parseTimeBucket(flight?.departTime))
      );
    }
    if (filterState.arriveTimes.length > 0) {
      filtered = filtered.filter((flight) =>
        filterState.arriveTimes.includes(parseTimeBucket(flight?.arriveTime))
      );
    }
    if (filterState.goDepartTimes.length > 0) {
      filtered = filtered.filter((flight) =>
        filterState.goDepartTimes.includes(parseTimeBucket(flight?.segments?.[0]?.departTime))
      );
    }
    if (filterState.backDepartTimes.length > 0) {
      filtered = filtered.filter((flight) =>
        filterState.backDepartTimes.includes(parseTimeBucket(flight?.segments?.[1]?.departTime))
      );
    }
    if (filterState.goArriveTimes.length > 0) {
      filtered = filtered.filter((flight) =>
        filterState.goArriveTimes.includes(parseTimeBucket(flight?.segments?.[0]?.arriveTime))
      );
    }
    if (filterState.backArriveTimes.length > 0) {
      filtered = filtered.filter((flight) =>
        filterState.backArriveTimes.includes(parseTimeBucket(flight?.segments?.[1]?.arriveTime))
      );
    }
    if (Number.isFinite(filterState.minPrice) && Number.isFinite(filterState.maxPrice)) {
      filtered = filtered.filter((flight) => {
        const price = Number(flight?.priceValue);
        return Number.isFinite(price) && price >= filterState.minPrice && price <= filterState.maxPrice;
      });
    }

    if (sortBy === "highest") {
      filtered.sort((a, b) => {
        const priceA = Number.isFinite(a?.priceValue) ? a.priceValue : -Infinity;
        const priceB = Number.isFinite(b?.priceValue) ? b.priceValue : -Infinity;
        if (priceA === -Infinity && priceB === -Infinity) return 0;
        if (priceA === -Infinity) return 1;
        if (priceB === -Infinity) return -1;
        return priceB - priceA;
      });
    } else if (sortBy === "fastest") {
      filtered.sort((a, b) => {
        const durationA = parseDuration(a?.duration);
        const durationB = parseDuration(b?.duration);
        if (durationA === null && durationB === null) return 0;
        if (durationA === null) return 1;
        if (durationB === null) return -1;
        return durationA - durationB;
      });
    } else if (sortBy === "earliest") {
      filtered.sort((a, b) => {
        const timeA = parseTimeToMinutes(a?.departTime);
        const timeB = parseTimeToMinutes(b?.departTime);
        if (timeA === null && timeB === null) return 0;
        if (timeA === null) return 1;
        if (timeB === null) return -1;
        return timeA - timeB;
      });
    } else {
      filtered.sort((a, b) => {
        const priceA = Number.isFinite(a?.priceValue) ? a.priceValue : Infinity;
        const priceB = Number.isFinite(b?.priceValue) ? b.priceValue : Infinity;
        if (priceA === Infinity && priceB === Infinity) return 0;
        if (priceA === Infinity) return 1;
        if (priceB === Infinity) return -1;
        return priceA - priceB;
      });
    }
    return filtered;
  }, [flights, filterState, sortBy]);

  const paginatedFlights = useMemo(() => {
    const startIndex = (currentPage - 1) * flightsPerPage;
    const endIndex = startIndex + flightsPerPage;
    return filteredFlights.slice(startIndex, endIndex);
  }, [filteredFlights, currentPage, flightsPerPage]);

  const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filterState.stops,
    filterState.airlines,
    filterState.refundability,
    filterState.departTimes,
    filterState.arriveTimes,
    filterState.goDepartTimes,
    filterState.backDepartTimes,
    filterState.goArriveTimes,
    filterState.backArriveTimes,
    filterState.minPrice,
    filterState.maxPrice,
    sortBy,
  ]);

  const extractRouteLabel = (value) => {
    if (!value) return "";
    return String(value).split("(")[0].split(",")[0].trim();
  };

  const handleAirlineSelect = (airlineName) => {
    setFilterState((prev) => {
      const currentAirlines = prev.airlines || [];
      if (currentAirlines.includes(airlineName)) return prev;
      return { ...prev, airlines: [...currentAirlines, airlineName] };
    });
  };

  const handleAirlineDeselect = (airlineName) => {
    setFilterState((prev) => ({
      ...prev,
      airlines: (prev.airlines || []).filter((a) => a !== airlineName),
    }));
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleDateSelect = (selectedDateStr) => {
    // Show loader immediately when a new date is selected
    setLoading(true);
    setFlights([]);
    setError("");
    setHasSearched(false);
    setCurrentPage(1);

    const selectedDeparture = dayjs(selectedDateStr);
    const currentDeparture = dayjs(effectiveDepartureDateISO);
    const currentReturn = dayjs(effectiveReturnDateISO);
    let nextReturnDateISO = effectiveReturnDateISO;

    if (selectedDeparture.isValid()) {
      if (currentDeparture.isValid() && currentReturn.isValid()) {
        const currentTripLength = Math.max(0, currentReturn.diff(currentDeparture, "day"));
        nextReturnDateISO = selectedDeparture.add(currentTripLength, "day").format("YYYY-MM-DD");
      } else if (currentReturn.isValid() && currentReturn.isAfter(selectedDeparture, "day")) {
        nextReturnDateISO = currentReturn.format("YYYY-MM-DD");
      } else {
        nextReturnDateISO = selectedDeparture.add(6, "day").format("YYYY-MM-DD");
      }
    }

    const newSearchParams = {
      ...searchParams,
      travelDate: dayjs(selectedDateStr).format("DD MMM, YYYY"),
      departureDateISO: selectedDateStr,
      returnDateISO: nextReturnDateISO,
      returnDate: dayjs(nextReturnDateISO).isValid()
        ? dayjs(nextReturnDateISO).format("DD MMM, YYYY")
        : searchParams.returnDate,
    };

    // Reset refs when navigating to a new search
    lastSearchParamsRef.current = null;
    isSearchingRef.current = false;

    navigate(location.pathname, {
      state: newSearchParams,
      replace: true,
    });
  };

  const filterData = useMemo(() => {
    const airlineMap = new Map();
    const stopSet = new Set();
    const refundableSet = new Set();
    const departSet = new Set();
    const arriveSet = new Set();
    
    flights.forEach((item) => {
      // Extract airline with carrier code
      if (item?.airline) {
        const airlineName = item.airline;
        // Get carrier code from flight data, prioritizing from segments
        const carrierCode = String(
          item?.carrierCode ||
          item?.details?.outboundSegments?.[0]?.marketingcareer ||
          item?.details?.returnSegments?.[0]?.marketingcareer ||
          item?.originalData?.segments?.go?.[0]?.marketingcareer ||
          item?.originalData?.segments?.back?.[0]?.marketingcareer ||
          item?.originalData?.career ||
          ""
        )
          .trim()
          .toUpperCase();
        
        if (!airlineMap.has(airlineName)) {
          airlineMap.set(airlineName, {
            name: airlineName,
            code: carrierCode,
          });
        } else if (carrierCode && !airlineMap.get(airlineName)?.code) {
          // Update if we found a carrier code and didn't have one before
          airlineMap.set(airlineName, {
            name: airlineName,
            code: carrierCode,
          });
        }
      }
      
      if (item?.stops) stopSet.add(normalizeStopLabel(item.stops));
      refundableSet.add(normalizeRefundability(item?.refundable));
      const departBucket = parseTimeBucket(item?.departTime);
      const arriveBucket = parseTimeBucket(item?.arriveTime);
      if (departBucket) departSet.add(departBucket);
      if (arriveBucket) arriveSet.add(arriveBucket);
    });
    
    return {
      stops: Array.from(stopSet),
      airlines: Array.from(airlineMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      refundableOptions: ["Non Refundable", "Refundable"].filter((item) => refundableSet.has(item)),
      departTimes: Array.from(departSet),
      arriveTimes: Array.from(arriveSet),
    };
  }, [flights]);

  const priceBounds = useMemo(() => {
    const prices = flights
      .map((flight) => (Number.isFinite(flight?.priceValue) ? flight.priceValue : null))
      .filter((price) => price !== null);
    if (!prices.length) return { min: 0, max: 0 };
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [flights]);

  const selectedDateLowestPrice = useMemo(() => {
    const prices = flights
      .map((f) => (Number.isFinite(f?.priceValue) && f.priceValue > 0 ? f.priceValue : null))
      .filter((p) => p !== null);
    return prices.length > 0 ? Math.min(...prices) : null;
  }, [flights]);

  return (
    <Box>
      <Box
        sx={{
          mt: 1,
          px: { xs: 2, md: 4 },
          py: 1.5,
        }}
      >
        <ModifySearchBar
          searchParams={searchParams}
          flightCount={filteredFlights.length}
          loading={loading}
        />
      </Box>
      {loading ? (
        <Box sx={{ mt: 0.5, px: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              px: { xs: 2, sm: "5px" },
              py: 0.5,
              borderRadius: "5px",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: "#001B48",
                lineHeight: 1.3,
                mb: 0.75,
              }}
            >
              Getting the best deals from over 750 airlines...
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 4,
                borderRadius: "999px",
                backgroundColor: "#D7D9E2",
                "& .MuiLinearProgress-bar": {
                  borderRadius: "999px",
                  backgroundColor: "var(--secondary-color, #024DAF)",
                },
              }}
            />
          </Box>
        </Box>
      ) : null}
      <Box sx={{ mt: 1, px: { xs: 2, md: 4 } }}>
        <DateSelectionBar
          selectedDate={
            effectiveDepartureDateISO ||
            (searchParams.travelDate && dayjs(searchParams.travelDate).isValid()
              ? dayjs(searchParams.travelDate).format("YYYY-MM-DD")
              : dayjs().format("YYYY-MM-DD"))
          }
          onDateSelect={handleDateSelect}
          loading={loading}
          from={searchParams.from}
          to={searchParams.to}
          currency={effectiveCurrency}
          fromCode={effectiveFromCode}
          toCode={effectiveToCode}
          passengerCounts={searchParams.passengerCounts}
          travelClass={searchParams.travelClass}
          email={searchParams.email}
          tripType={searchParams.tripType}
          returnDateISO={effectiveReturnDateISO}
          returnDate={searchParams.returnDate}
          selectedDatePrice={selectedDateLowestPrice}
        />
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2.4}>
            {loading ? (
              <OnewayFilterSkeleton />
            ) : (
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
              <OnewayFlightFilter
                stops={filterData.stops}
                airlines={filterData.airlines}
                refundableOptions={filterData.refundableOptions}
                departTimes={filterData.departTimes}
                arriveTimes={filterData.arriveTimes}
                filterState={filterState}
                priceBounds={priceBounds}
                currency={effectiveCurrency}
                onPriceRangeChange={handlePriceRangeChange}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                enableRouteTimeTabs
                routeLabels={{
                  outboundFrom: extractRouteLabel(searchParams.from),
                  inboundFrom: extractRouteLabel(searchParams.to),
                  outboundTo: extractRouteLabel(searchParams.to),
                  inboundTo: extractRouteLabel(searchParams.from),
                }}
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
                  <OnewayFlightSkeleton key={`roundway-flight-skeleton-${index}`} />
                ))
              ) : hasSearched && filteredFlights.length === 0 ? (
                <Typography sx={{ fontSize: 14, color: "#6B6B6B" }}>No round-way flights found.</Typography>
              ) : (
                <>
                  {paginatedFlights.map((flight) => (
                    <RoundWayFlight key={flight.id} flight={flight} />
                  ))}
                  {totalPages > 1 && (
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
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, value) => {
                          setCurrentPage(value);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
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
                            },
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
    </Box>
  );
};

export default RoundWaySearchResult;
