import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, CircularProgress, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const headerTitleSx = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
};

const tableColumns = [
  { key: "srlNo", label: "Srl No", width: "80px" },
  { key: "title", label: "Title", width: "1fr" },
  { key: "firstName", label: "First Name", width: "1.5fr" },
  { key: "lastName", label: "Last Name", width: "1.5fr" },
  { key: "pax", label: "PAX", width: "1fr" },
  { key: "dateOfBirth", label: "Date of Birth", width: "1.2fr" },
  { key: "nationality", label: "Nationality", width: "1.2fr" },
  { key: "passportNo", label: "Passport No", width: "1.3fr" },
  { key: "expireDate", label: "Expire Date", width: "1.2fr" },
  { key: "action", label: "Action", width: "120px" },
];

const tableGridTemplate = tableColumns.map((col) => col.width).join(" ");

const AllTraveler = () => {
  const navigate = useNavigate();
  const { agentToken, agentData } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  const agentEmail = agentData?.email || "";

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const fetchTravelers = useCallback(async () => {
    const token = agentToken || localStorage.getItem("agentToken") || "";

    if (!token || !agentEmail) {
      setError("Agent token or email missing. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fetch travelers from passenger API
      const params = new URLSearchParams({
        email: agentEmail,
      });

      // Add pagination if API supports it
      if (page) {
        params.append("page", page.toString());
      }
      if (limit) {
        params.append("limit", limit.toString());
      }

      const response = await axios.get(`${baseUrl}/passenger/agent/list?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // API returns array directly or wrapped in data property
      const passengersData = Array.isArray(response?.data) 
        ? response.data 
        : (response?.data?.data || []);
      const paginationData = response?.data || {};
      
      // Map passenger data to table format based on actual API response structure
      const mappedTravelers = Array.isArray(passengersData) ? passengersData.map((passenger) => {
        return {
          title: passenger?.title || "MR",
          firstName: passenger?.firstName || "-",
          lastName: passenger?.lastName || "-",
          pax: passenger?.type || "Adult",
          dateOfBirth: formatDate(passenger?.dateOfBirth),
          nationality: passenger?.nationality || "-",
          passportNo: passenger?.passportNumber || "-",
          expireDate: formatDate(passenger?.passportExpiryDate),
          passengerId: passenger?.id || null, // Store passenger ID for reference
        };
      }) : [];
      
      setTravelers(mappedTravelers);
      setTotalPages(paginationData.totalPages || 1);
      setTotal(paginationData.total || mappedTravelers.length);
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load travelers.";
      setError(apiMessage);
      setTravelers([]);
      console.error("Fetch travelers failed:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, agentToken, agentEmail, baseUrl]);

  useEffect(() => {
    if (agentToken && agentEmail) {
      fetchTravelers();
    }
  }, [fetchTravelers, agentToken, agentEmail]);

  const handleEdit = (passengerId) => {
    if (passengerId) {
      navigate("/dashboard/account/addtraveler", {
        state: {
          travelerId: passengerId,
        },
      });
    }
  };

  const handleDelete = async (passengerId, travelerName) => {
    const token = agentToken || localStorage.getItem("agentToken") || "";

    if (!token || !agentEmail) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Agent token or email missing. Please login again.",
        confirmButtonColor: "#0F2F56",
      });
      return;
    }

    if (!passengerId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Missing traveler ID",
        confirmButtonColor: "#0F2F56",
      });
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to delete this traveler? This action cannot be undone.${travelerName ? `\n\nTraveler: ${travelerName}` : ""}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const params = new URLSearchParams({
          email: agentEmail,
        });

        await axios.delete(
          `${baseUrl}/passenger/agent/${passengerId}?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Success message
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Traveler has been deleted successfully.",
          confirmButtonColor: "#0F2F56",
        });

        // Refresh travelers list
        await fetchTravelers();
      } catch (err) {
        const apiMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to delete traveler.";
        
        Swal.fire({
          icon: "error",
          title: "Error",
          text: apiMessage,
          confirmButtonColor: "#0F2F56",
        });
        console.error("Delete traveler failed:", err?.response?.data || err);
      }
    }
  };

  const renderCell = (columnKey, value, traveler) => {
    if (columnKey === "action") {
      return (
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            gap: 0.5,
            width: "100%",
          }}
        >
          <IconButton
            size="small"
            onClick={() => handleEdit(traveler?.passengerId)}
            sx={{
              color: "#0F2F56",
              padding: 0.75,
              "&:hover": {
                backgroundColor: "rgba(15, 47, 86, 0.08)",
              },
            }}
          >
            <EditIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(traveler?.passengerId, `${traveler?.firstName} ${traveler?.lastName}`)}
            sx={{
              color: "#d32f2f",
              padding: 0.75,
              "&:hover": {
                backgroundColor: "rgba(211, 47, 47, 0.08)",
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      );
    }

    return (
      <Typography
        sx={{
          fontSize: 11,
          color: "#111827",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
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
        px: { xs: 2, md: 4 },
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
          <Typography sx={headerTitleSx}>All Traveler</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate("/dashboard/account/addtraveler")}
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
            Add Traveler
          </Button>
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
            // Firefox scrollbar
            scrollbarWidth: "thin",
            scrollbarColor: "#94A3B8 #F1F5F9",
          }}
        >
          <Box sx={{ width: "100%" }}>
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
                    justifyContent: column.key === "action" || column.key === "srlNo" ? "center" : "flex-start",
                    px: column.key === "action" ? 1 : 2,
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
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <CircularProgress size={24} sx={{ color: "#0F2F56" }} />
              </Box>
            ) : error ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <Typography sx={{ fontSize: 12, color: "#d32f2f" }}>{error}</Typography>
              </Box>
            ) : travelers.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <Typography sx={{ fontSize: 12, color: "#6B7280" }}>No travelers found</Typography>
              </Box>
            ) : (
              travelers.map((traveler, index) => {
                const uniqueKey = `${traveler.passengerId || traveler.id || 'traveler'}-${traveler.firstName}-${traveler.lastName}-${traveler.passportNo}-${index}`;
                // Calculate serial number based on page and index
                const serialNumber = (page - 1) * limit + index + 1;
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
                    {tableColumns.map((column) => {
                      let value;
                      if (column.key === "action") {
                        value = "";
                      } else if (column.key === "srlNo") {
                        value = serialNumber;
                      } else {
                        value = traveler[column.key] || "-";
                      }
                      return (
                        <Box
                          key={`${uniqueKey}-${column.key}`}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            px: column.key === "action" ? 1 : 2,
                            py: 1.4,
                            borderBottom: "1px solid #E5E7EB",
                            justifyContent: column.key === "action" || column.key === "srlNo" ? "center" : "flex-start",
                            overflow: "hidden",
                            minWidth: 0,
                            backgroundColor: "transparent",
                          }}
                        >
                          {renderCell(column.key, value, traveler)}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            {/* Previous button */}
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
            
            {/* Page numbers */}
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
            
            {/* Next button */}
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

export default AllTraveler;
