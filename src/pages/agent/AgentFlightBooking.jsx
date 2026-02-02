import React from "react";
import { Box, Button, Typography } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";

const headerTitleSx = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
};

const statusCards = [
  { label: "Ticketed", amount: "BDT 10,000" },
  { label: "Reissue", amount: "BDT 10,000" },
  { label: "Refund", amount: "BDT 10,000" },
  { label: "Void", amount: "BDT 10,000" },
  { label: "Hold", amount: "BDT 10,000" },
];

const tableColumns = [
  { key: "bookingId", label: "Booking Id", width: "120px" },
  { key: "customer", label: "Customer", width: "150px" },
  { key: "route", label: "Route", width: "110px" },
  { key: "type", label: "Type", width: "100px" },
  { key: "pnr", label: "PNR", width: "90px" },
  { key: "bookingTime", label: "Booking Time", width: "150px" },
  { key: "dueAmount", label: "Due Amount", width: "120px" },
  { key: "grossFare", label: "Gross Fare", width: "110px" },
  { key: "ticketFare", label: "Ticket Fare", width: "110px" },
  { key: "pax", label: "PAX", width: "70px" },
  { key: "airline", label: "Airline", width: "140px" },
  { key: "flightDate", label: "Flight Date", width: "120px" },
  { key: "status", label: "Status", width: "110px" },
];

const tableRows = [
  {
    "bookingId": "BK-1001",
    "customer": "Sakhawat Hosen",
    "route": "DAC → DXB",
    "type": "One Way",
    "pnr": "A1B2C3",
    "bookingTime": "2026-02-01T10:45:00",
    "dueAmount": 5000,
    "grossFare": 65000,
    "ticketFare": 60000,
    "pax": 1,
    "airline": "Emirates",
    "flightDate": "2026-02-10",
    "status": "Confirmed"
  },
  {
    "bookingId": "BK-1001",
    "customer": "Sakhawat Hosen",
    "route": "DAC → DXB",
    "type": "One Way",
    "pnr": "A1B2C3",
    "bookingTime": "2026-02-01T10:45:00",
    "dueAmount": 5000,
    "grossFare": 65000,
    "ticketFare": 60000,
    "pax": 1,
    "airline": "Emirates",
    "flightDate": "2026-02-10",
    "status": "Confirmed"
  },
  {
    "bookingId": "BK-1001",
    "customer": "Sakhawat Hosen",
    "route": "DAC → DXB",
    "type": "One Way",
    "pnr": "A1B2C3",
    "bookingTime": "2026-02-01T10:45:00",
    "dueAmount": 5000,
    "grossFare": 65000,
    "ticketFare": 60000,
    "pax": 1,
    "airline": "Emirates",
    "flightDate": "2026-02-10",
    "status": "Confirmed"
  },
  {
    "bookingId": "BK-1001",
    "customer": "Sakhawat Hosen",
    "route": "DAC → DXB",
    "type": "One Way",
    "pnr": "A1B2C3",
    "bookingTime": "2026-02-01T10:45:00",
    "dueAmount": 5000,
    "grossFare": 65000,
    "ticketFare": 60000,
    "pax": 1,
    "airline": "Emirates",
    "flightDate": "2026-02-10",
    "status": "Confirmed"
  },
  {
    "bookingId": "BK-1001",
    "customer": "Sakhawat Hosen",
    "route": "DAC → DXB",
    "type": "One Way",
    "pnr": "A1B2C3",
    "bookingTime": "2026-02-01T10:45:00",
    "dueAmount": 5000,
    "grossFare": 65000,
    "ticketFare": 60000,
    "pax": 1,
    "airline": "Emirates",
    "flightDate": "2026-02-10",
    "status": "Confirmed"
  },
  {
    "bookingId": "BK-1001",
    "customer": "Sakhawat Hosen",
    "route": "DAC → DXB",
    "type": "One Way",
    "pnr": "A1B2C3",
    "bookingTime": "2026-02-01T10:45:00",
    "dueAmount": 5000,
    "grossFare": 65000,
    "ticketFare": 60000,
    "pax": 1,
    "airline": "Emirates",
    "flightDate": "2026-02-10",
    "status": "Confirmed"
  },
  {
    "bookingId": "BK-1001",
    "customer": "Sakhawat Hosen",
    "route": "DAC → DXB",
    "type": "One Way",
    "pnr": "A1B2C3",
    "bookingTime": "2026-02-01T10:45:00",
    "dueAmount": 5000,
    "grossFare": 65000,
    "ticketFare": 60000,
    "pax": 1,
    "airline": "Emirates",
    "flightDate": "2026-02-10",
    "status": "Confirmed"
  },
  {
    "bookingId": "BK-1002",
    "customer": "Rahim Uddin",
    "route": "DAC → BKK",
    "type": "Round Trip",
    "pnr": "D4E5F6",
    "bookingTime": "2026-02-02T15:20:00",
    "dueAmount": 0,
    "grossFare": 42000,
    "ticketFare": 42000,
    "pax": 2,
    "airline": "Thai Airways",
    "flightDate": "2026-02-18",
    "status": "Ticketed"
  },
  {
    "bookingId": "BK-1003",
    "customer": "Ayesha Khan",
    "route": "DAC → KUL",
    "type": "One Way",
    "pnr": "G7H8I9",
    "bookingTime": "2026-02-03T09:10:00",
    "dueAmount": 12000,
    "grossFare": 38000,
    "ticketFare": 26000,
    "pax": 1,
    "airline": "Malaysia Airlines",
    "flightDate": "2026-02-22",
    "status": "Pending"
  }


];

const tableGridTemplate = tableColumns.map((col) => col.width).join(" ");

const AgentFlightBooking = () => {
  const renderCell = (columnKey, value) => {
    if (columnKey === "bookingId") {
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
          <Typography sx={headerTitleSx}>All Booking</Typography>

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
              All Booking
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
          {["Enter Booking ID", "Enter PNR", "Enter Airlines"].map((placeholder) => (
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
            // maxHeight: "55vh",
          }}
        >
          <Box sx={{ minWidth: 1200 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: tableGridTemplate,
                alignItems: "stretch",
                backgroundColor: "#F8FAFC",
              }}
            >
              {tableColumns?.map((column, columnIndex) => (
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
            {tableRows.map((row, index) => (
              <Box
                key={`${row.bookingId}-${index}`}
                sx={{
                  display: "grid",
                  gridTemplateColumns: tableGridTemplate,
                  alignItems: "stretch",
                }}
              >
                {tableColumns.map((column) => (
                  <Box
                    key={`${row.bookingId}-${column.key}`}
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
            ))}
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
                  {isArrow ? <span>{item === "prev" ? "‹" : "›"}</span> : item}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AgentFlightBooking;
