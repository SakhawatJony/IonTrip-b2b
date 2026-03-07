import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Button, Typography, CircularProgress, Menu, MenuItem } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import dayjs from "dayjs";

const headerTitleSx = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
};

const statusCards = [
  { label: "Deposit", amount: "BDT 10,000" },
  { label: "Ticketed", amount: "BDT 10,000" },
  { label: "Reissue", amount: "BDT 10,000" },
  { label: "Refund", amount: "BDT 10,000" },
  { label: "Void", amount: "BDT 10,000" },
];

const tableColumns = [
  { key: "id", label: "ID", width: "80px" },
  { key: "route", label: "Route", width: "140px" },
  { key: "tripType", label: "Trip Type", width: "100px" },
  { key: "departureDate", label: "Departure Date", width: "140px" },
  { key: "returnDate", label: "Return Date", width: "140px" },
  { key: "passengers", label: "Passengers", width: "120px" },
  { key: "cabinClass", label: "Cabin Class", width: "110px" },
  { key: "currency", label: "Currency", width: "100px" },
  { key: "email", label: "Email", width: "180px" },
  { key: "date", label: "Search Date", width: "150px" },
];


const tableGridTemplate = tableColumns.map((col) => col.width).join(" ");

const SearchReport = () => {
  const { agentToken, agentData } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
  const [allData, setAllData] = useState([]); // Store all fetched data
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filter states
  const [searchId, setSearchId] = useState("");
  const [searchRoute, setSearchRoute] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [searchTypeAnchor, setSearchTypeAnchor] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchRecentSearches = useCallback(async () => {
    const agentEmail = agentData?.email || "";
    
    if (!agentEmail) {
      setError("Email not found. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = agentToken || localStorage.getItem("agentToken") || "";
      const params = new URLSearchParams({
        email: agentEmail,
      });

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get(`${baseUrl}/flight/recent-search?${params.toString()}`, {
        headers,
      });

      // Handle API response - API returns array of objects with id, email, and data
      const searchesData = Array.isArray(response?.data) ? response.data : [];

      // Transform API data to match table format
      const formattedRows = searchesData.map((item) => {
        const search = item.data || {};
        
        // Format date for display
        const formatDate = (dateStr) => {
          if (!dateStr) return "N/A";
          try {
            const date = dayjs(dateStr);
            return date.isValid() ? date.format("DD MMM YY") : dateStr;
          } catch (error) {
            return dateStr;
          }
        };

        // Capitalize first letter
        const capitalize = (str) => {
          if (!str) return "";
          return str.charAt(0).toUpperCase() + str.slice(1);
        };

        // Format passengers
        const formatPassengers = () => {
          const adult = search.adult || 0;
          const child = search.child || 0;
          const infant = search.infant || 0;
          const parts = [];
          if (adult > 0) parts.push(`${adult} Adult${adult > 1 ? 's' : ''}`);
          if (child > 0) parts.push(`${child} Child${child > 1 ? 'ren' : ''}`);
          if (infant > 0) parts.push(`${infant} Infant${infant > 1 ? 's' : ''}`);
          return parts.length > 0 ? parts.join(", ") : "1 Adult";
        };

        return {
          id: item.id || "N/A",
          route: `${search.journeyfrom || ""} → ${search.journeyto || ""}`,
          tripType: capitalize(search.tripType || "oneway"),
          departureDate: formatDate(search.departuredate),
          returnDate: search.returndate ? formatDate(search.returndate) : "N/A",
          passengers: formatPassengers(),
          cabinClass: capitalize(search.cabinclass || "economy"),
          currency: search.currency || "USD",
          email: item.email || search.email || "N/A",
          date: formatDate(search.departuredate),
        };
      });

      // Store all formatted data
      setAllData(formattedRows);
    } catch (err) {
      console.error("Error fetching recent searches:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load search data.");
      setAllData([]);
    } finally {
      setLoading(false);
    }
  }, [agentData?.email, agentToken, baseUrl]);

  // Filter and paginate data
  const filteredData = useMemo(() => {
    let filtered = [...allData];

    // Filter by ID
    if (searchId.trim()) {
      filtered = filtered.filter((row) =>
        row.id.toString().toLowerCase().includes(searchId.toLowerCase())
      );
    }

    // Filter by Route
    if (searchRoute.trim()) {
      filtered = filtered.filter((row) =>
        row.route.toLowerCase().includes(searchRoute.toLowerCase())
      );
    }

    // Filter by Trip Type
    if (searchType !== "all") {
      filtered = filtered.filter((row) =>
        row.tripType.toLowerCase() === searchType.toLowerCase()
      );
    }

    // Filter by Date Range
    if (dateFrom) {
      filtered = filtered.filter((row) => {
        const rowDate = dayjs(row.departureDate, "DD MMM YY");
        const fromDate = dayjs(dateFrom);
        return rowDate.isValid() && fromDate.isValid() && rowDate.isSameOrAfter(fromDate, "day");
      });
    }

    if (dateTo) {
      filtered = filtered.filter((row) => {
        const rowDate = dayjs(row.departureDate, "DD MMM YY");
        const toDate = dayjs(dateTo);
        return rowDate.isValid() && toDate.isValid() && rowDate.isSameOrBefore(toDate, "day");
      });
    }

    return filtered;
  }, [allData, searchId, searchRoute, searchType, dateFrom, dateTo]);

  // Apply pagination to filtered data
  useEffect(() => {
    const totalCount = filteredData.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRows = filteredData.slice(startIndex, endIndex);
    
    setTableRows(paginatedRows);
    setTotalPages(Math.ceil(totalCount / limit) || 1);
    setTotal(totalCount);
    
    // Reset to page 1 if current page is beyond total pages
    if (page > Math.ceil(totalCount / limit) && totalCount > 0) {
      setPage(1);
    }
  }, [filteredData, page, limit]);

  useEffect(() => {
    if (agentData?.email) {
      fetchRecentSearches();
    }
  }, [fetchRecentSearches, agentData?.email]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchId, searchRoute, searchType, dateFrom, dateTo]);

  const handleClearFilters = () => {
    setSearchId("");
    setSearchRoute("");
    setSearchType("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const renderCell = (columnKey, value) => {
    if (columnKey === "id") {
      return (
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: "#111827",
            backgroundColor: "#EEF2F6",
            borderRadius: 0.8,
            px: 1,
            py: 0.35,
            width: "fit-content",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      );
    }

    if (columnKey === "route") {
      return (
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: "#111827",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      );
    }

    return (
      <Typography
        sx={{
          fontSize: 11,
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
        px: { xs: 2, md: 7 },
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
          <Typography sx={headerTitleSx}>Search Report</Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            
            <Button
              variant="contained"
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
              onClick={(e) => setSearchTypeAnchor(e.currentTarget)}
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
              {searchType === "all" ? "Search Type" : searchType.charAt(0).toUpperCase() + searchType.slice(1)}
            </Button>
            <Menu
              anchorEl={searchTypeAnchor}
              open={Boolean(searchTypeAnchor)}
              onClose={() => setSearchTypeAnchor(null)}
            >
              <MenuItem onClick={() => { setSearchType("all"); setSearchTypeAnchor(null); }}>All</MenuItem>
              <MenuItem onClick={() => { setSearchType("oneway"); setSearchTypeAnchor(null); }}>One Way</MenuItem>
              <MenuItem onClick={() => { setSearchType("roundway"); setSearchTypeAnchor(null); }}>Round Way</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
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
              placeholder="Enter Search ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
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
              placeholder="Enter Route (e.g., DAC → DXB)"
              value={searchRoute}
              onChange={(e) => setSearchRoute(e.target.value)}
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
            <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: "#1F4D8B" }} />
            <Box
              component="input"
              type="date"
              placeholder="From Date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              sx={{
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                fontSize: 11.5,
                color: dateFrom ? "#1F2A44" : "#6B7280",
                width: "100%",
                "&::placeholder": {
                  color: "#6B7280",
                },
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
            <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: "#1F4D8B" }} />
            <Box
              component="input"
              type="date"
              placeholder="To Date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              sx={{
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                fontSize: 11.5,
                color: dateTo ? "#1F2A44" : "#6B7280",
                width: "100%",
                "&::placeholder": {
                  color: "#6B7280",
                },
              }}
            />
          </Box>
          {(searchId || searchRoute || searchType !== "all" || dateFrom || dateTo) && (
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
              Clear Filters
            </Button>
          )}
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: 11.5,
              fontWeight: 600,
              height: 32,
              px: 1.5,
              backgroundColor: "#EAF2FF",
              color: "#1F4D8B",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#DCE9FF", boxShadow: "none" },
            }}
          >
            Download CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<TuneIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              fontSize: 11.5,
              fontWeight: 600,
              height: 32,
              px: 1.5,
              backgroundColor: "#0F2F56",
              "&:hover": { backgroundColor: "#0B2442" },
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
            overflow: "auto",
          }}
        >
          <Box sx={{ minWidth: 1150 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: tableGridTemplate,
                alignItems: "stretch",
                backgroundColor: "#F8FAFC",
              }}
            >
              {tableColumns?.map((column) => (
                <Box
                  key={column.key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                    borderBottom: "1px solid #E5E7EB",
                    backgroundColor: "#F8FAFC",
                  }}
                >
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#0F2F56" }}>
                    {column.label}
                  </Typography>
                </Box>
              ))}
            </Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4, gridColumn: "1 / -1" }}>
                <CircularProgress size={24} sx={{ color: "#0F2F56" }} />
              </Box>
            ) : error ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4, gridColumn: "1 / -1" }}>
                <Typography sx={{ fontSize: 12, color: "#d32f2f" }}>{error}</Typography>
              </Box>
            ) : tableRows.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4, gridColumn: "1 / -1" }}>
                <Typography sx={{ fontSize: 12, color: "#6B7280" }}>No search data found</Typography>
              </Box>
            ) : (
              tableRows.map((row, index) => (
              <Box
                key={`${row.reference}-${index}`}
                sx={{
                  display: "grid",
                  gridTemplateColumns: tableGridTemplate,
                  alignItems: "stretch",
                }}
              >
                {tableColumns.map((column) => (
                  <Box
                    key={`${row.reference}-${column.key}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      py: 1.4,
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    {renderCell(column.key, row[column.key])}
                  </Box>
                ))}
              </Box>
            ))
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, flexWrap: "wrap", gap: 2 }}>
          {/* Pagination Info */}
          <Typography sx={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
            {loading ? (
              "Loading..."
            ) : total > 0 ? (
              `Showing ${(page - 1) * limit + 1} to ${Math.min(page * limit, total)} of ${total} entries`
            ) : (
              "No entries found"
            )}
          </Typography>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchReport;
