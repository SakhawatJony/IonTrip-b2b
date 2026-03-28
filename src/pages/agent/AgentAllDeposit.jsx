import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Pagination } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const headerTitleSx = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
};

const tableColumns = [
  { key: "srlNo", label: "Srl No", width: "80px" },
  { key: "depositId", label: "Deposit ID", width: "120px" },
  { key: "depositType", label: "Type", width: "100px" },
  { key: "paymentMethod", label: "Payment Method", width: "140px" },
  { key: "originalAmount", label: "Amount", width: "140px" },
  { key: "currency", label: "Currency", width: "100px" },



  
  { key: "paymentReason", label: "Payment Reason", width: "200px" },
  { key: "status", label: "Status", width: "120px" },
  { key: "adminNote", label: "Admin Note", width: "200px" },
  { key: "previousAmount", label: "Previous", width: "120px" },
  { key: "updatedAmount", label: "Updated", width: "120px" },
  { key: "date", label: "Date", width: "150px" },
  { key: "attachment", label: "Attachment", width: "120px" },
];

const tableGridTemplate = tableColumns.map((col) => col.width).join(" ");



const AgentAllDeposit = () => {
  const navigate = useNavigate();
  const { agentToken, agentData } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production-2d3b.up.railway.app";

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [depositIdFilter, setDepositIdFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currency, setCurrency] = useState("BDT");
  const [viewDocumentOpen, setViewDocumentOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState({ url: "", name: "" });
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  const agentEmail = agentData?.email || "";

  const fetchDeposits = useCallback(async () => {
    const token = agentToken || localStorage.getItem("agentToken") || "";

    if (!token || !agentEmail) {
      setError("Agent token or email missing. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        email: agentEmail,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) {
        params.append("status", status);
      }

      if (depositIdFilter && depositIdFilter.trim()) {
        params.append("depositId", depositIdFilter.trim());
      }

      const response = await axios.get(`${baseUrl}/deposit/agent/list?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // API returns array directly or wrapped in data property
      const depositsData = Array.isArray(response?.data)
        ? response.data
        : response?.data?.data || [];
      const paginationData = response?.data || {};

      const depositsArray = Array.isArray(depositsData) ? depositsData : [];
      setDeposits(depositsArray);
      
      // Calculate pagination: use API pagination if available, otherwise calculate from data length
      const apiTotalPages = paginationData.totalPages;
      const apiTotal = paginationData.total;
      
      if (apiTotalPages && apiTotal) {
        // Backend pagination is working
        setTotalPages(apiTotalPages);
        setTotal(apiTotal);
      } else {
        // Backend returns all data, calculate pagination client-side
        const calculatedTotal = depositsArray.length;
        const calculatedTotalPages = Math.ceil(calculatedTotal / limit) || 1;
        setTotalPages(calculatedTotalPages);
        setTotal(calculatedTotal);
      }

      // Extract currency from first deposit if available
      if (depositsData.length > 0 && depositsData[0]?.currency) {
        setCurrency(depositsData[0].currency);
      }
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load deposits.";
      setError(apiMessage);
      setDeposits([]);
      console.error("Fetch deposits failed:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, [status, page, limit, depositIdFilter, agentToken, agentEmail, baseUrl]);

  // Initial fetch and when status/page/limit changes (immediate)
  useEffect(() => {
    if (agentToken && agentEmail) {
      fetchDeposits();
    }
  }, [status, page, limit, fetchDeposits, agentToken, agentEmail]);

  // Debounce text input filters
  useEffect(() => {
    if (!agentToken || !agentEmail) return;

    const timeoutId = setTimeout(() => {
      fetchDeposits();
    }, 500); // 500ms debounce for text inputs

    return () => clearTimeout(timeoutId);
  }, [depositIdFilter, fetchDeposits]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "depositId") {
      setDepositIdFilter(value);
    }
    setPage(1); // Reset to first page when filter changes
  };

  const handleClearFilters = () => {
    setDepositIdFilter("");
    setPage(1);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleAddDeposit = () => {
    navigate("/dashboard/agentdeposit/add");
  };

  // Get status colors based on status value
  const getStatusColors = (statusValue) => {
    if (!statusValue || statusValue === "-") {
      return { bg: "#F3F4F6", color: "#6B7280" };
    }

    const statusLower = statusValue.toLowerCase().trim();

    if (statusLower.includes("approved") || statusLower === "approved") {
      return { bg: "#10B981", color: "#FFFFFF" };
    }
    if (statusLower.includes("rejected") || statusLower === "rejected") {
      return { bg: "#EF4444", color: "#FFFFFF" };
    }
    if (statusLower.includes("pending") || statusLower === "pending") {
      return { bg: "#FDE68A", color: "#78350F" };
    }
    if (statusLower.includes("hold") || statusLower === "hold") {
      return { bg: "#FEF3C7", color: "#92400E" };
    }

    // Default color
    return { bg: "#F3F4F6", color: "#6B7280" };
  };

  // Map API deposit data to table row format
  const mapDepositToTableRow = (deposit, index) => {
    const srlNo = (page - 1) * limit + index + 1;
    const depositId = deposit?.depositId || "NA";
    const depositType = deposit?.depositType || "NA";
    const paymentMethod = deposit?.paymentMethod || "NA";
    const originalAmount = deposit?.amount || 0;
    const formattedOriginalAmount = originalAmount > 0 ? parseFloat(originalAmount).toFixed(2) : "NA";
    const convertedAmount = deposit?.convertedAmount || 0;
    const depositCurrency = deposit?.currency || currency;
    const formattedConvertedAmount = convertedAmount > 0 ? `MYR ${parseFloat(convertedAmount).toFixed(2)}` : "NA";
    const conversionRate = deposit?.conversionRate || 0;
    const formattedRate = conversionRate > 0 ? parseFloat(conversionRate).toFixed(4) : "NA";
    const paymentReason = deposit?.paymentReason || "NA";
    const status = deposit?.status || "NA";
    const adminNote = deposit?.adminNote || "NA";
    const previousAmount = deposit?.previousAmount && deposit.previousAmount !== "" && deposit.previousAmount !== "0"
      ? deposit.previousAmount
      : "NA";
    const updatedAmount = deposit?.updatedAmount && deposit.updatedAmount !== "" && deposit.updatedAmount !== "0"
      ? deposit.updatedAmount
      : "NA";
    const date = deposit?.createdDate || deposit?.createdAt || null;
    const formattedDate = date ? new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString() : "NA";
    const attachment = deposit?.documentImage || null;

    return {
      srlNo: srlNo,
      depositId: depositId,
      depositType: depositType,
      paymentMethod: paymentMethod,
      originalAmount: formattedOriginalAmount,
      convertedAmount: formattedConvertedAmount,
      conversionRate: formattedRate,
      currency: depositCurrency || "NA",
      paymentReason: paymentReason,
      status: status,
      adminNote: adminNote,
      previousAmount: previousAmount,
      updatedAmount: updatedAmount,
      date: formattedDate,
      attachment: attachment,
      originalDeposit: deposit, // Store original deposit for document viewing
    };
  };

  const handleViewDocument = (documentUrl, depositId) => {
    setViewingDocument({ url: documentUrl, name: `Deposit ${depositId}` });
    setViewDocumentOpen(true);
  };

  const handleCloseDocumentView = () => {
    setViewDocumentOpen(false);
    setViewingDocument({ url: "", name: "" });
  };

  const renderCell = (columnKey, value, deposit = null) => {
    if (columnKey === "srlNo") {
      return (
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {value}
        </Typography>
      );
    }

    if (columnKey === "depositId") {
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

    if (columnKey === "status") {
      const statusColors = getStatusColors(value);
      const capitalizeStatus = (statusText) => {
        if (!statusText || statusText === "NA") return statusText;
        return statusText
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
      };
      const capitalizedStatus = capitalizeStatus(value);

      return (
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: statusColors.color,
            backgroundColor: statusColors.bg,
            borderRadius: 0.8,
            px: 1.2,
            py: 0.4,
            width: "fit-content",
            whiteSpace: "nowrap",
            textTransform: "capitalize",
          }}
        >
          {capitalizedStatus}
        </Typography>
      );
    }

    if (columnKey === "attachment") {
      if (value === "NA" || !value || value === null) {
        return (
          <Typography
            sx={{
              fontSize: 11,
              color: "#6B7280",
            }}
          >
            NA
          </Typography>
        );
      }
      return (
        <Typography
          onClick={() => {
            if (deposit?.documentImage) {
              handleViewDocument(deposit.documentImage, deposit.depositId);
            }
          }}
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: "#1976d2",
            cursor: deposit?.documentImage ? "pointer" : "default",
            textDecoration: deposit?.documentImage ? "underline" : "none",
            "&:hover": {
              color: deposit?.documentImage ? "#1565c0" : "#1976d2",
            },
          }}
        >
          {deposit?.documentImage ? "View" : "NA"}
        </Typography>
      );
    }

    // Handle empty or null values - show NA
    if (value === "NA" || value === null || value === "" || value === "0" || value === "0.00") {
      if (columnKey === "adminNote" || columnKey === "previousAmount" || columnKey === "updatedAmount" ||
        columnKey === "originalAmount" || columnKey === "conversionRate" || columnKey === "convertedAmount") {
        return (
          <Typography
            sx={{
              fontSize: 11,
              color: "#6B7280",
            }}
          >
            NA
          </Typography>
        );
      }
    }

    // Format numeric columns
    if (columnKey === "originalAmount" || columnKey === "conversionRate") {
      return (
        <Typography
          sx={{
            fontSize: 11,
            color: value === "NA" ? "#6B7280" : "#111827",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      );
    }

    // Format currency columns
    if (columnKey === "convertedAmount" || columnKey === "previousAmount" || columnKey === "updatedAmount") {
      return (
        <Typography
          sx={{
            fontSize: 11,
            color: value === "NA" ? "#6B7280" : "#111827",
            fontWeight: 500,
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
          color: value === "NA" ? "#6B7280" : "#111827",
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
          <Typography sx={headerTitleSx}>All Deposit</Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={handleAddDeposit}
            sx={{
              textTransform: "none",
              fontSize: 12,
              fontWeight: 600,
              px: 2,
              height: 36,
              backgroundColor: "#000000",
              "&:hover": { backgroundColor: "#1a1a1a" },
            }}
          >
            Deposit Request
          </Button>
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
                  placeholder="Enter Deposit ID"
                  value={depositIdFilter}
                  onChange={(e) => handleFilterChange("depositId", e.target.value)}
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
              {depositIdFilter && (
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
            onClick={handleToggleFilters}
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
          <Box >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: tableGridTemplate,
                alignItems: "stretch",
                backgroundColor: "var(--secondary-color, #024DAF)",
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
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                    backgroundColor: "var(--secondary-color, #024DAF)",
                  }}
                >
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#FFFFFF" }}>
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
            ) : deposits.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <Typography sx={{ fontSize: 12, color: "#6B7280" }}>No deposits found</Typography>
              </Box>
            ) : (
              deposits.slice((page - 1) * limit, page * limit).map((deposit, index) => {
                const row = mapDepositToTableRow(deposit, index);
                const isRowHovered = hoveredRowIndex === index;
                const isEvenRow = index % 2 === 0;
                return (
                  <Box
                    key={`${deposit.id || deposit.depositId || index}-${index}`}
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
                      const value = row[column.key] || "NA";
                      return (
                        <Box
                          key={`${deposit.id || deposit.depositId || index}-${column.key}`}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            px: 2,
                            py: 1.4,
                            borderBottom: "1px solid #E5E7EB",
                            backgroundColor: "transparent",
                          }}
                        >
                          {renderCell(column.key, value, deposit)}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              size="small"
              sx={{
                "& .MuiPaginationItem-root": {
                  fontSize: 12,
                  minWidth: 32,
                  height: 32,
                  color: "#1F2A44",
                  "&.Mui-selected": {
                    backgroundColor: "#0F2F56",
                    color: "#FFFFFF",
                    "&:hover": {
                      backgroundColor: "#0B2442",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "#EAF2FF",
                  },
                },
                "& .MuiPaginationItem-ellipsis": {
                  color: "#6B7280",
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Document View Modal */}
      <Dialog
        open={viewDocumentOpen}
        onClose={handleCloseDocumentView}
        maxWidth={false}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "95vh",
            maxWidth: "95vw",
            m: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#111827" }}>
            {viewingDocument.name || "View Document"}
          </Typography>
          <IconButton
            onClick={handleCloseDocumentView}
            sx={{
              color: "#6B7280",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
            backgroundColor: "#f5f5f5",
            flex: 1,
            minWidth: "auto",
            minHeight: "auto",
          }}
        >
          {viewingDocument.url && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "fit-content",
                height: "fit-content",
              }}
            >
              {viewingDocument.url && /\.(jpg|jpeg|png|gif|svg|webp|avif)$/i.test(viewingDocument.url) ? (
                <img
                  src={viewingDocument.url}
                  alt={viewingDocument.name || "Document"}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  style={{
                    maxWidth: "90vw",
                    maxHeight: "85vh",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <iframe
                  src={viewingDocument.url}
                  title={viewingDocument.name || "Document"}
                  style={{
                    width: "90vw",
                    height: "85vh",
                    minHeight: "400px",
                    border: "none",
                  }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDocumentView}
            sx={{
              textTransform: "none",
              color: "#6B7280",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentAllDeposit;
