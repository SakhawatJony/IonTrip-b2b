import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

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
  { key: "reference", label: "Reffrence", width: "120px" },
  { key: "status", label: "Status", width: "90px" },
  { key: "agentName", label: "Agent Name", width: "120px" },
  { key: "company", label: "Company", width: "120px" },
  { key: "email", label: "Email", width: "160px" },
  { key: "password", label: "Password", width: "110px" },
  { key: "joinedAt", label: "Join At", width: "150px" },
  { key: "bonusWallet", label: "Bonus Wallet", width: "120px" },
  { key: "creditWallet", label: "Credit Wallet", width: "120px" },
  { key: "balance", label: "Balance", width: "110px" },
];

const tableRows = [
  {
    reference: "FFTRB14525",
    status: "HOLD",
    agentName: "Sabre",
    company: "Zinga lala",
    email: "afridi@flyfar.tech",
    password: "**********",
    joinedAt: "09 Sep 23 02:35 PM",
    bonusWallet: "412.00 ৳",
    creditWallet: "412.00 ৳",
    balance: "412.00 ৳",
  },
  {
    reference: "FFTRB14525",
    status: "HOLD",
    agentName: "Sabre",
    company: "Zinga lala",
    email: "afridi@flyfar.tech",
    password: "**********",
    joinedAt: "09 Sep 23 02:35 PM",
    bonusWallet: "412.00 ৳",
    creditWallet: "412.00 ৳",
    balance: "412.00 ৳",
  },
  {
    reference: "FFTRB14525",
    status: "HOLD",
    agentName: "Sabre",
    company: "Zinga lala",
    email: "afridi@flyfar.tech",
    password: "**********",
    joinedAt: "09 Sep 23 02:35 PM",
    bonusWallet: "412.00 ৳",
    creditWallet: "412.00 ৳",
    balance: "412.00 ৳",
  },
  {
    reference: "FFTRB14525",
    status: "HOLD",
    agentName: "Sabre",
    company: "Zinga lala",
    email: "afridi@flyfar.tech",
    password: "**********",
    joinedAt: "09 Sep 23 02:35 PM",
    bonusWallet: "412.00 ৳",
    creditWallet: "412.00 ৳",
    balance: "412.00 ৳",
  },
  {
    reference: "FFTRB14525",
    status: "HOLD",
    agentName: "Sabre",
    company: "Zinga lala",
    email: "afridi@flyfar.tech",
    password: "**********",
    joinedAt: "09 Sep 23 02:35 PM",
    bonusWallet: "412.00 ৳",
    creditWallet: "412.00 ৳",
    balance: "412.00 ৳",
  },
  {
    reference: "FFTRB14525",
    status: "HOLD",
    agentName: "Sabre",
    company: "Zinga lala",
    email: "afridi@flyfar.tech",
    password: "**********",
    joinedAt: "09 Sep 23 02:35 PM",
    bonusWallet: "412.00 ৳",
    creditWallet: "412.00 ৳",
    balance: "412.00 ৳",
  },
  {
    reference: "FFTRB14525",
    status: "HOLD",
    agentName: "Sabre",
    company: "Zinga lala",
    email: "afridi@flyfar.tech",
    password: "**********",
    joinedAt: "09 Sep 23 02:35 PM",
    bonusWallet: "412.00 ৳",
    creditWallet: "412.00 ৳",
    balance: "412.00 ৳",
  },
  {
    reference: "FFTRB14525",
    status: "HOLD",
    agentName: "Sabre",
    company: "Zinga lala",
    email: "afridi@flyfar.tech",
    password: "**********",
    joinedAt: "09 Sep 23 02:35 PM",
    bonusWallet: "412.00 ৳",
    creditWallet: "412.00 ৳",
    balance: "412.00 ৳",
  },
  {
    reference: "FFTRB14525",
    status: "HOLD",
    agentName: "Sabre",
    company: "Zinga lala",
    email: "afridi@flyfar.tech",
    password: "**********",
    joinedAt: "09 Sep 23 02:35 PM",
    bonusWallet: "412.00 ৳",
    creditWallet: "412.00 ৳",
    balance: "412.00 ৳",
  },
  {
    reference: "FFTRB14525",
    status: "HOLD",
    agentName: "Sabre",
    company: "Zinga lala",
    email: "afridi@flyfar.tech",
    password: "**********",
    joinedAt: "09 Sep 23 02:35 PM",
    bonusWallet: "412.00 ৳",
    creditWallet: "412.00 ৳",
    balance: "412.00 ৳",
  },
];

const tableGridTemplate = tableColumns.map((col) => col.width).join(" ");

const SalesReport = () => {
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  const renderCell = (columnKey, value) => {
    if (columnKey === "reference") {
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
          <Typography sx={headerTitleSx}>Sales Report</Typography>

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
              Sales Type
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
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>
                    {column.label}
                  </Typography>
                </Box>
              ))}
            </Box>
            {tableRows.map((row, index) => {
                const isRowHovered = hoveredRowIndex === index;
                const isEvenRow = index % 2 === 0;
                return (
              <Box
                key={`${row.reference}-${index}`}
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
                    key={`${row.reference}-${column.key}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      py: 1.4,
                      borderBottom: "1px solid #E5E7EB",
                      backgroundColor: "transparent",
                    }}
                  >
                    {renderCell(column.key, row[column.key])}
                  </Box>
                ))}
              </Box>
                );
              })}
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

export default SalesReport;
