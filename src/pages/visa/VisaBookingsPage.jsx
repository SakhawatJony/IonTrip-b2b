import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneIcon from "@mui/icons-material/Tune";

const headerTitleSx = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
};

// Visa table columns (same layout style as hotel / tour booking)
const tableColumns = [
  { key: "bookingId", label: "Booking Id", width: "100px" },
  { key: "applicant", label: "Applicant", width: "120px" },
  { key: "country", label: "Country", width: "100px" },
  { key: "visaType", label: "Visa Type", width: "90px" },
  { key: "submissionDate", label: "Submission Date", width: "110px" },
  { key: "amount", label: "Amount", width: "90px" },
  { key: "bookingTime", label: "Booking Time", width: "100px" },
  { key: "status", label: "Status", width: "110px" },
];

const tableGridTemplate = tableColumns.map((col) => col.width).join(" ");

const getStatusColors = (statusValue) => {
  if (!statusValue || statusValue === "-") {
    return { bg: "#F3F4F6", color: "#6B7280" };
  }
  const s = (statusValue || "").toLowerCase().trim();
  if (s.includes("cancelled")) return { bg: "#FEF3C7", color: "#92400E" };
  if (s.includes("confirmed")) return { bg: "#10B981", color: "#FFFFFF" };
  if (s.includes("pending")) return { bg: "#FDE68A", color: "#78350F" };
  if (s.includes("refund")) return { bg: "#FEE2E2", color: "#991B1B" };
  return { bg: "#F3F4F6", color: "#6B7280" };
};

const VisaBookingsPage = ({
  title = "Visa All Bookings",
  viewMode = "all",
  emptyLabel = "No visa bookings found",
}) => {
  const [bookingIdFilter, setBookingIdFilter] = useState("");
  const [applicantFilter, setApplicantFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages] = useState(1);
  const [loading] = useState(false);
  const [bookings] = useState([]);

  const handleFilterChange = (type, value) => {
    if (type === "bookingId") setBookingIdFilter(value);
    if (type === "applicant") setApplicantFilter(value);
  };

  const handleClearFilters = () => {
    setBookingIdFilter("");
    setApplicantFilter("");
    setPage(1);
  };

  const renderCell = (columnKey, value) => {
    if (columnKey === "bookingId") {
      return (
        <Typography
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
          }}
        >
          {value}
        </Typography>
      );
    }
    if (columnKey === "status") {
      const statusColors = getStatusColors(value);
      const text =
        value && value !== "-"
          ? value
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ")
          : value;
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
          }}
        >
          {text}
        </Typography>
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
        px: "30px",
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
                  placeholder="Enter Applicant Name"
                  value={applicantFilter}
                  onChange={(e) => handleFilterChange("applicant", e.target.value)}
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
              {(bookingIdFilter || applicantFilter) && (
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
            onClick={() => setShowFilters(!showFilters)}
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
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: tableGridTemplate,
              alignItems: "stretch",
              backgroundColor: "var(--secondary-color, #024DAF)",
            }}
          >
            {tableColumns.map((column) => (
              <Box
                key={column.key}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 1,
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: "var(--secondary-color, #024DAF)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  {column.label}
                </Typography>
              </Box>
            ))}
          </Box>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress size={24} sx={{ color: "#0F2F56" }} />
            </Box>
          ) : bookings.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                {emptyLabel}
              </Typography>
            </Box>
          ) : (
            bookings.map((row, index) => {
              const isRowHovered = hoveredRowIndex === index;
              return (
                <Box
                  key={row.bookingId || index}
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
                  {tableColumns.map((column) => (
                    <Box
                      key={column.key}
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
                      {renderCell(column.key, row[column.key] || "-")}
                    </Box>
                  ))}
                </Box>
              );
            })
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.5 }}>
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
              const pageNum = i + 1;
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
        </Box>
      </Box>
    </Box>
  );
};

export default VisaBookingsPage;
