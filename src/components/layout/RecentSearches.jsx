import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import FlightIcon from "@mui/icons-material/Flight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const STORAGE_KEY = "recentFlightSearches";
const MAX_RECENT_SEARCHES = 6;

const RecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load recent searches from localStorage
    const loadRecentSearches = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const searches = JSON.parse(stored);
          setRecentSearches(searches);
        }
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    };

    loadRecentSearches();

    // Listen for storage changes (when new search is saved)
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        loadRecentSearches();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    window.addEventListener("recentSearchUpdated", loadRecentSearches);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("recentSearchUpdated", loadRecentSearches);
    };
  }, []);

  // Calculate items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setItemsPerView(1);
      } else if (width < 960) {
        setItemsPerView(2);
      } else if (width < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, recentSearches.length - itemsPerView);

  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.offsetWidth / itemsPerView;
      container.scrollTo({
        left: itemWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    setCurrentIndex(newIndex);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.offsetWidth / itemsPerView;
      container.scrollTo({
        left: itemWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  const handleDotClick = (slideIndex) => {
    const newIndex = slideIndex * itemsPerView;
    setCurrentIndex(newIndex);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.offsetWidth / itemsPerView;
      container.scrollTo({
        left: itemWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  // Update current index based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const itemWidth = container.offsetWidth / itemsPerView;
      const scrollIndex = Math.round(container.scrollLeft / itemWidth);
      setCurrentIndex(scrollIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [itemsPerView]);

  const extractAirportCode = (value) => {
    const match = value?.match(/\(([^)]+)\)/);
    return match ? match[1] : value?.trim() || "";
  };

  const handleSearchClick = (search) => {
    // Navigate to search results with the saved search data
    navigate("/dashboard/onewaysearchresult", {
      state: {
        tripType: "one-way",
        from: search.from,
        to: search.to,
        travelDate: search.travelDate,
        departureDateISO: search.departureDateISO,
        fromCode: search.fromCode,
        toCode: search.toCode,
        passengerCounts: search.passengerCounts || { adults: 1, children: 0, infants: 0 },
        childAges: search.childAges || [],
        travelClass: search.travelClass || "Economy",
        directFlight: search.directFlight || false,
        currency: search.currency,
      },
    });
  };

  if (recentSearches.length === 0) {
    return null; // Don't show section if no recent searches
  }

  const totalSlides = Math.ceil(recentSearches.length / itemsPerView);

  return (
    <Box my={10}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Previous Button */}
        {recentSearches.length > itemsPerView && (
          <IconButton
            onClick={handlePrev}
            disabled={currentIndex === 0}
            sx={{
              backgroundColor: "#FFF",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: "#F5F5F5",
              },
              "&.Mui-disabled": {
                opacity: 0.3,
              },
            }}
          >
            <ChevronLeftIcon sx={{ color: "#0E5AA7" }} />
          </IconButton>
        )}

        {/* Slider Container */}
        <Box
          ref={scrollContainerRef}
          sx={{
            flex: 1,
            display: "flex",
            gap: 1.5,
            overflow: "hidden",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          {recentSearches.map((search, i) => {
            const fromCode = search.fromCode || extractAirportCode(search.from);
            const toCode = search.toCode || extractAirportCode(search.to);
            
            return (
              <Box
                key={i}
                onClick={() => handleSearchClick(search)}
                sx={{
                  backgroundColor: "#FFF",
                  borderRadius: "6px",
                  px: 1.8,
                  py: 1,
                  minWidth: { xs: "100%", sm: "calc(50% - 6px)", md: "calc(33.333% - 10px)", lg: "calc(25% - 12px)" },
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* LEFT CONTENT */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#1A1A1A",
                      }}
                    >
                      {fromCode}
                    </Typography>

                    {/* SAME ARROW AS IMAGE */}
                    <ArrowRightAltIcon
                      sx={{
                        fontSize: 18,
                        color: "#0E5AA7",
                        mt: "1px",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#1A1A1A",
                      }}
                    >
                      {toCode}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 10.5,
                      color: "#6E6E6E",
                      mt: 0.2,
                    }}
                  >
                    {search.travelDate || "Date not set"}
                  </Typography>
                </Box>

                {/* RIGHT PLANE ICON */}
                <FlightIcon
                  sx={{
                    fontSize: 17,
                    color: "#0E5AA7",
                    transform: "rotate(45deg)",
                    ml: 1,
                  }}
                />
              </Box>
            );
          })}
        </Box>

        {/* Next Button */}
        {recentSearches.length > itemsPerView && (
          <IconButton
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            sx={{
              backgroundColor: "#FFF",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: "#F5F5F5",
              },
              "&.Mui-disabled": {
                opacity: 0.3,
              },
            }}
          >
            <ChevronRightIcon sx={{ color: "#0E5AA7" }} />
          </IconButton>
        )}
      </Box>

      {/* Navigation Dots */}
      {totalSlides > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            mt: 2,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, index) => {
            const activeSlide = Math.floor(currentIndex / itemsPerView);
            return (
              <Box
                key={index}
                onClick={() => handleDotClick(index)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: index === activeSlide ? "#0E5AA7" : "#D0D0D0",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: index === activeSlide ? "#0E5AA7" : "#A0A0A0",
                    transform: "scale(1.2)",
                  },
                }}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

// Utility function to save recent search
export const saveRecentSearch = (searchData) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let searches = stored ? JSON.parse(stored) : [];

    // Remove duplicate if exists (same from, to, and date)
    searches = searches.filter(
      (s) =>
        !(
          s.fromCode === searchData.fromCode &&
          s.toCode === searchData.toCode &&
          s.departureDateISO === searchData.departureDateISO
        )
    );

    // Add new search at the beginning
    searches.unshift({
      ...searchData,
      timestamp: new Date().toISOString(),
    });

    // Keep only the most recent searches
    searches = searches.slice(0, MAX_RECENT_SEARCHES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("recentSearchUpdated"));
  } catch (error) {
    console.error("Error saving recent search:", error);
  }
};

export default RecentSearches;
