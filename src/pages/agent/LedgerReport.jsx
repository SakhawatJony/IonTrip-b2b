import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const headerTitleSx = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
};



const tableColumns = [
  { key: "transactionId", label: "Transaction ID", width: "150px" },
  { key: "reference", label: "Reference", width: "150px" },
  { key: "runningBalance", label: "Running Balance", width: "150px" },
  { key: "previousBalance", label: "Previous Balance", width: "150px" },
  { key: "debit", label: "Debit", width: "120px" },
  { key: "credit", label: "Credit", width: "120px" },
  { key: "transactionTime", label: "Transaction Time", width: "180px" },
  { key: "transactionType", label: "Transaction Type", width: "180px" },
];


const tableGridTemplate = tableColumns.map((col) => col.width).join(" ");

const LedgerReport = () => {
  const { agentToken, agentData } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production-2d3b.up.railway.app";

  const [ledgerData, setLedgerData] = useState([]);
  const [statusCards, setStatusCards] = useState([
    { label: "Deposit", amount: "BDT 0" },
    { label: "Ticketed", amount: "BDT 0" },
    { label: "Reissue", amount: "BDT 0" },
    { label: "Refund", amount: "BDT 0" },
    { label: "Void", amount: "BDT 0" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  const agentEmail = agentData?.email || "";

  const fetchLedgerReport = useCallback(async () => {
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
      });

      const response = await axios.get(`${baseUrl}/transection/agent/list?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Handle response structure
      const responseData = response?.data?.data || response?.data || [];
      const ledgerList = Array.isArray(responseData) ? responseData : [];

      setLedgerData(ledgerList);

      // Calculate status card amounts from ledger data
      if (ledgerList.length > 0) {
        const depositTotal = ledgerList
          .filter((item) =>
            item.type?.toLowerCase().includes("deposit") ||
            item.type === "Deposit" ||
            item.transactionType?.toLowerCase().includes("deposit")
          )
          .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

        const ticketedTotal = ledgerList
          .filter((item) =>
            item.type?.toLowerCase().includes("ticket") ||
            item.type === "Ticketed" ||
            item.transactionType?.toLowerCase().includes("ticket")
          )
          .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

        const reissueTotal = ledgerList
          .filter((item) =>
            item.type?.toLowerCase().includes("reissue") ||
            item.type === "Reissue" ||
            item.transactionType?.toLowerCase().includes("reissue")
          )
          .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

        const refundTotal = ledgerList
          .filter((item) =>
            item.type?.toLowerCase().includes("refund") ||
            item.type === "Refund" ||
            item.transactionType?.toLowerCase().includes("refund")
          )
          .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

        const voidTotal = ledgerList
          .filter((item) =>
            item.type?.toLowerCase().includes("void") ||
            item.type === "Void" ||
            item.transactionType?.toLowerCase().includes("void")
          )
          .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

        // Get currency from first item or default to BDT
        const currency = ledgerList[0]?.currency || "BDT";

        setStatusCards([
          { label: "Deposit", amount: `${currency} ${depositTotal.toLocaleString()}` },
          { label: "Ticketed", amount: `${currency} ${ticketedTotal.toLocaleString()}` },
          { label: "Reissue", amount: `${currency} ${reissueTotal.toLocaleString()}` },
          { label: "Refund", amount: `${currency} ${refundTotal.toLocaleString()}` },
          { label: "Void", amount: `${currency} ${voidTotal.toLocaleString()}` },
        ]);
      }
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load ledger report.";
      setError(apiMessage);
      setLedgerData([]);
      console.error("Fetch ledger report failed:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, [agentToken, agentEmail, baseUrl]);

  useEffect(() => {
    if (agentToken && agentEmail) {
      fetchLedgerReport();
    }
  }, [fetchLedgerReport, agentToken, agentEmail]);

  // Map API data to table row format
  const mapLedgerToTableRow = (ledger, index, allLedgers) => {
    const formatDate = (dateString) => {
      if (!dateString) return "NA";
      try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("en-GB", { month: "short" });
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day} ${month} ${year} ${hours}:${minutes}`;
      } catch (error) {
        return dateString;
      }
    };

    const currency = ledger?.currency || "BDT";
    const amount = parseFloat(ledger?.amount) || 0;
    const updatedAmount = parseFloat(ledger?.updatedAmount) || 0;
    const previousAmount = parseFloat(ledger?.previousAmount) || 0;

    // Determine if it's a debit or credit based on transaction type
    const transactionType = ledger?.type || "";
    const isDeposit = transactionType.toLowerCase().includes("deposit");
    const isCredit = isDeposit;
    const isDebit = !isDeposit;

    const debit = isDebit ? amount.toFixed(2) : "0";
    const credit = isCredit ? amount.toFixed(2) : "0";

    // Format transaction type for display
    const formatTransactionType = (type) => {
      if (!type) return "NA";
      const typeMap = {
        deposit_approval: "Deposit Request",
        issue: "Issue",
        reissue: "Reissue Completed",
        refund: "Refund",
        void: "Void",
        partial_payment: "Partial Due Full Pay",
      };

      // Check for partial matches
      const lowerType = type.toLowerCase();
      if (lowerType.includes("deposit")) return "Deposit Request";
      if (lowerType.includes("issue") && !lowerType.includes("reissue")) return "Issue";
      if (lowerType.includes("reissue")) return "Reissue Completed";
      if (lowerType.includes("refund")) return "Refund";
      if (lowerType.includes("void")) return "Void";
      if (lowerType.includes("partial")) return "Partial Due Full Pay";

      return typeMap[type] || type;
    };

    return {
      transactionId: ledger?.tranId || `IOT${String(ledger?.id || "").padStart(6, "0")}` || "NA",
      reference: ledger?.referenceId || ledger?.tranId || ledger?.id?.toString() || "NA",
      previousBalance: previousAmount > 0 ? `${currency} ${previousAmount.toFixed(2)}` : "0",
      runningBalance: `${currency} ${updatedAmount.toFixed(2)}`,
      debit: debit !== "0" ? `${currency} ${debit}` : "0",
      credit: credit !== "0" ? `${currency} ${credit}` : "0",
      transactionTime: formatDate(ledger?.createdAt),
      transactionType: formatTransactionType(transactionType),
      originalData: ledger, // Store original for status badge
    };
  };

  const handleDownloadCSV = () => {
    if (!ledgerData || ledgerData.length === 0) {
      return;
    }

    // Map all ledger data to table rows
    const rows = ledgerData.map((ledger, index) => mapLedgerToTableRow(ledger, index, ledgerData));

    // CSV Headers
    const headers = [
      "Transaction ID",
      "Reference",
      "Running Balance",
      "Previous Balance",
      "Debit",
      "Credit",
      "Transaction Time",
      "Transaction Type",
    ];

    // Convert rows to CSV format
    const csvRows = [
      headers.join(","),
      ...rows.map((row) => {
        return [
          `"${row.transactionId || ""}"`,
          `"${row.reference || ""}"`,
          `"${row.runningBalance || ""}"`,
          `"${row.previousBalance || ""}"`,
          `"${row.debit || ""}"`,
          `"${row.credit || ""}"`,
          `"${row.transactionTime || ""}"`,
          `"${row.transactionType || ""}"`,
        ].join(",");
      }),
    ];

    // Create CSV content
    const csvContent = csvRows.join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `ledger_report_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderCell = (columnKey, value, rowData = null) => {
    if (columnKey === "transactionId") {
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

    if (columnKey === "reference") {
      return (
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: "#1976d2",
            cursor: "pointer",
            textDecoration: "underline",
            "&:hover": {
              color: "#1565c0",
            },
          }}
        >
          {value}
        </Typography>
      );
    }

    if (columnKey === "transactionType") {
      const transactionType = value || "NA";
      const isDeposit = transactionType.toLowerCase().includes("deposit");
      const isReissue = transactionType.toLowerCase().includes("reissue");
      const isPartial = transactionType.toLowerCase().includes("partial");

      let bgColor = "#D1FAE5"; // Green for deposits/issues
      let textColor = "#065F46";

      if (isReissue) {
        bgColor = "#D1FAE5";
        textColor = "#065F46";
      } else if (isPartial) {
        bgColor = "#DBEAFE";
        textColor = "#1E40AF";
      }

      return (
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: textColor,
            backgroundColor: bgColor,
            borderRadius: 0.8,
            px: 1.2,
            py: 0.4,
            width: "fit-content",
            whiteSpace: "nowrap",
            textTransform: "capitalize",
          }}
        >
          {transactionType}
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
          <Typography sx={headerTitleSx}>Transitions </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            {statusCards.map((card) => (
              <Box
                key={card.label}
                sx={{
                  backgroundColor: "#D9ECFF",
                  border: "1px solid #9EC6F1",
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.8,
                  minWidth: 95,
                }}
              >
                <Typography fontSize={10.5} fontWeight={600} color="#0F2F56">
                  {card.label}
                </Typography>
                <Typography fontSize={10.5} color="#1F2A44" mt={0.2}>
                  {card.amount}
                </Typography>
              </Box>
            ))}
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
              Ledger Type
            </Button>
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
          {["Enter Ledger ID", "Enter Transaction ID"].map((placeholder) => (
            <Box
              key={placeholder}
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
                placeholder={placeholder}
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
          ))}
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
            <Typography sx={{ fontSize: 11.5, color: "#6B7280" }}>
              Select Date Range
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
            onClick={handleDownloadCSV}
            disabled={!ledgerData || ledgerData.length === 0}
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
              "&:disabled": {
                backgroundColor: "#F3F4F6",
                color: "#9CA3AF",
              },
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
          <Box sx={{ minWidth: 1050 }}>
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
            ) : ledgerData.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <Typography sx={{ fontSize: 12, color: "#6B7280" }}>No ledger data found</Typography>
              </Box>
            ) : (
              ledgerData.map((ledger, index) => {
                const row = mapLedgerToTableRow(ledger, index, ledgerData);
                const isRowHovered = hoveredRowIndex === index;
                const isEvenRow = index % 2 === 0;
                return (
                  <Box
                    key={`${ledger.id || ledger.tranId || index}-${index}`}
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
                    {tableColumns.map((column) => (
                      <Box
                        key={`${ledger.id || ledger.tranId || index}-${column.key}`}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          px: 2,
                          py: 1.4,
                          borderBottom: "1px solid #E5E7EB",
                          backgroundColor: "transparent",
                        }}
                      >
                        {renderCell(column.key, row[column.key], row)}
                      </Box>
                    ))}
                  </Box>
                );
              })
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            {["prev", "1", "2", "3", "4", "5", "next"].map((item, index) => {
              const isArrow = item === "prev" || item === "next";
              const isActive = item === "3";
              return (
                <Box
                  key={`${item}-${index}`}
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
                    backgroundColor: isActive
                      ? "#0F2F56"
                      : isArrow
                        ? "#D1D5DB"
                        : "#EAF2FF",
                  }}
                >
                  {isArrow ? <span>{item === "prev" ? "<" : ">"}</span> : item}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LedgerReport;
