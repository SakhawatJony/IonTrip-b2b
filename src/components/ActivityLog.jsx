import React, { useState, useMemo } from "react";
import { Box, Typography, Chip } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

const sectionTitleSx = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
};

const sectionSubtitleSx = {
  mt: 0.5,
  fontSize: 12.5,
  color: "#94A3B8",
};

const activityLogColumns = [
  { key: "srlNo", label: "Srl No", width: "60px" },
  { key: "time", label: "Time", width: "1.4fr" },
  { key: "status", label: "Status", width: "90px" },
  { key: "ipLocation", label: "IP / Location", width: "1.5fr" },
  { key: "reason", label: "Reason", width: "1.2fr" },
  { key: "device", label: "Device", width: "2fr" },
];

const tableGridTemplate = activityLogColumns.map((col) => col.width).join(" ");

const formatDateTime = (dateString) => {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    return d.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return dateString;
  }
};

/**
 * @param {{ logs: Array<{ id?: number; ip?: string; userAgent?: string; success?: boolean; reason?: string | null; region?: string | null; city?: string | null; country?: string | null; createdAt?: string }> }} props
 */
const ActivityLog = ({ logs = [] }) => {
  const entries = Array.isArray(logs) ? logs : [];
  const [page, setPage] = useState(1);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(entries.length / limit));

  const paginatedEntries = useMemo(() => {
    const start = (page - 1) * limit;
    return entries.slice(start, start + limit);
  }, [entries, page, limit]);

  const getLocation = (row) => {
    const parts = [row.city, row.region, row.country].filter(Boolean);
    return parts.length ? parts.join(", ") : "—";
  };

  const getDeviceShort = (userAgent) => {
    if (!userAgent) return "—";
    return userAgent.length > 55 ? `${userAgent.slice(0, 55)}…` : userAgent;
  };

  return (
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <HistoryIcon sx={{ fontSize: 24, color: "var(--primary-color, #123D6E)" }} />
        <Box>
          <Typography sx={sectionTitleSx}>Activity Log</Typography>
          <Typography sx={sectionSubtitleSx}>Recent sign-in and account activity</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 1.5,
          backgroundColor: "#FFFFFF",
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "60vh",
          position: "relative",
          "&::-webkit-scrollbar": {
            width: "10px",
            height: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#F1F5F9",
            borderRadius: "5px",
            border: "1px solid #E5E7EB",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#94A3B8",
            borderRadius: "5px",
            border: "1px solid #CBD5E1",
            "&:hover": {
              backgroundColor: "#64748B",
            },
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#94A3B8 #F1F5F9",
        }}
      >
        <Box sx={{ width: "100%" }}>
          {/* Header row - same as All Traveler */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: tableGridTemplate,
              alignItems: "stretch",
              backgroundColor: "#F8FAFC",
            }}
          >
            {activityLogColumns.map((column) => (
              <Box
                key={column.key}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: column.key === "srlNo" ? "center" : "flex-start",
                  px: 2,
                  py: 1,
                  borderBottom: "1px solid #E5E7EB",
                  backgroundColor: "#F8FAFC",
                }}
              >
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: "var(--primary-color, #123D6E)", whiteSpace: "nowrap" }}>
                  {column.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {entries.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
              <Typography sx={{ fontSize: 12, color: "#6B7280" }}>No activity recorded yet.</Typography>
            </Box>
          ) : (
            paginatedEntries.map((row, index) => {
              const serialNumber = (page - 1) * limit + index + 1;
              const uniqueKey = row.id ?? row.createdAt ?? `log-${index}`;
              const isRowHovered = hoveredRowIndex === index;
              const isEvenRow = index % 2 === 0;
              return (
                <Box
                  key={uniqueKey}
                  onMouseEnter={() => setHoveredRowIndex(index)}
                  onMouseLeave={() => setHoveredRowIndex(null)}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: tableGridTemplate,
                    alignItems: "stretch",
                    backgroundColor: isRowHovered ? "#FFFFFF" : isEvenRow ? "#FFFFFF" : "#F8FAFC",
                    borderRadius: 1,
                    mb: 0.5,
                    transition: "box-shadow 0.2s ease, background-color 0.15s ease",
                    ...(isRowHovered && {
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 8px 16px -2px rgba(0, 0, 0, 0.1)",
                    }),
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 2,
                      py: 1.4,
                      borderBottom: "1px solid #E5E7EB",
                      overflow: "hidden",
                      minWidth: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: "#111827", whiteSpace: "nowrap" }}>
                      {serialNumber}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      py: 1.4,
                      borderBottom: "1px solid #E5E7EB",
                      overflow: "hidden",
                      minWidth: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: "#111827", whiteSpace: "nowrap" }}>
                      {formatDateTime(row.createdAt)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      py: 1.4,
                      borderBottom: "1px solid #E5E7EB",
                      overflow: "hidden",
                      minWidth: 0,
                    }}
                  >
                    <Chip
                      label={row.success ? "Success" : "Failed"}
                      size="small"
                      sx={{
                        fontSize: 10,
                        fontWeight: 500,
                        height: 22,
                        bgcolor: row.success ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
                        color: row.success ? "#15803d" : "#b91c1c",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      px: 2,
                      py: 1.4,
                      borderBottom: "1px solid #E5E7EB",
                      overflow: "hidden",
                      minWidth: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: "#374151", whiteSpace: "nowrap" }}>
                      {row.ip || "—"}
                    </Typography>
                    <Typography sx={{ fontSize: 10, color: "#94A3B8", whiteSpace: "nowrap" }}>
                      {getLocation(row)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      py: 1.4,
                      borderBottom: "1px solid #E5E7EB",
                      overflow: "hidden",
                      minWidth: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: "#6B7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={row.reason || ""}>
                      {row.reason || "—"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      py: 1.4,
                      borderBottom: "1px solid #E5E7EB",
                      overflow: "hidden",
                      minWidth: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={row.userAgent || ""}>
                      {getDeviceShort(row.userAgent)}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Box>

      {entries.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, pt: 0.5 }}>
          <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, entries.length)} of {entries.length}
          </Typography>
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
        </Box>
      )}
    </Box>
  );
};

export default ActivityLog;
