import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const REFUND_STYLES = {
  sectionHeader: { color: "#1A2B49", fontSize: "17px", fontWeight: 700 },
  tabText: { color: "#808080", fontSize: "15px", fontWeight: 400 },
  tabActiveUnderline: "#007bff",
  departureLabel: { color: "#808080", fontSize: "13px" },
  routeText: { color: "#333333", fontSize: "19px", fontWeight: 700 },
  timeText: { color: "#333333", fontSize: "17px", fontWeight: 700 },
  dateText: { color: "#333333", fontSize: "14px", fontWeight: 400 },
  bulletText: { color: "#A0A0A0", fontSize: "13px" },
  durationBlue: { color: "#007bff", fontSize: "13px", fontWeight: 700 },
  redIconBg: "#E74C3C",
  tableHeaderBg: "#2E86C1",
  tableHeaderText: { color: "#FFFFFF", fontSize: "13px", fontWeight: 700 },
  tableRowBg: "#FFFFFF",
  tableRowAltBg: "#E8F4FC",
  tableCellText: { color: "#333333", fontSize: "15px" },
};

const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  } catch {
    return "N/A";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  } catch {
    return "N/A";
  }
};

const formatDateDDMMYYYY = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
};

const getTitle = (gender) => {
  if (!gender) return "N/A";
  return gender === "MALE" ? "MR" : gender === "FEMALE" ? "MRS" : "MR";
};

const buildSegments = (segmentsArray, cabinClass) => {
  if (!Array.isArray(segmentsArray)) return [];
  return segmentsArray.map((segment) => {
    const departTime = formatTime(segment.departureTime);
    const departDate = formatDate(segment.departureTime);
    const arriveTime = formatTime(segment.arrivalTime);
    const arriveDate = formatDate(segment.arrivalTime);
    const route = `${segment.departureAirport || segment.departure || "N/A"} to ${segment.arrivalAirport || segment.arrival || "N/A"}`;
    const airline = `${segment.marketingcareerName || segment.marketingcareer || "N/A"} - ${segment.marketingcareer || ""} ${segment.marketingflight || ""}`;
    const cabin = segment.class || cabinClass || "ECONOMY";
    const baggage = segment.bags || "N/A";
    const duration = segment.flightduration || "N/A";
    return { departTime, departDate, arriveTime, arriveDate, route, airline, cabin, baggage, duration };
  });
};

const BookingQueRefundDetails = ({ data }) => {
  const [refundTab, setRefundTab] = useState(0);

  if (!data) {
    return (
      <Box sx={{ p: 2, bgcolor: "#FFFFFF", borderRadius: 1.5, border: "1px solid #E5E7EB" }}>
        <Typography sx={{ fontSize: 14, color: "#6B7280" }}>No booking data for refund details.</Typography>
      </Box>
    );
  }

  const goSegments = data?.segments?.go || [];
  const backSegments = data?.segments?.back || [];
  const cabinClass = data?.cabinClass;
  const processedGo = buildSegments(goSegments, cabinClass);
  const processedBack = buildSegments(backSegments, cabinClass);
  const goDeparture = data?.godeparture || data?.segments?.go?.[0]?.departure || "N/A";
  const goArrival = data?.goarrival || data?.segments?.go?.[goSegments.length - 1]?.arrival || "N/A";
  const backDeparture = data?.backdeparture || data?.segments?.back?.[0]?.departure;
  const backArrival = data?.backarrival || data?.segments?.back?.[backSegments.length - 1]?.arrival;
  const isRoundTrip = data?.triptype === "roundtrip" || (backDeparture && backArrival);
  const travellers = data?.travellers || [];
  const pricebreakdown = data?.pricebreakdown || [];
  const getPaxType = (index) => pricebreakdown[index]?.PaxType || "ADULT";

  const renderFlightCard = (label, route, segments) => (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: 1,
        border: "1px solid #E5E7EB",
        p: 2,
        mb: 2,
      }}
    >
      <Typography sx={REFUND_STYLES.departureLabel}>{label}</Typography>
      <Typography sx={REFUND_STYLES.routeText}>{route}</Typography>
      {segments.length === 0 ? (
        <Typography sx={{ ...REFUND_STYLES.bulletText, mt: 1 }}>No segment data</Typography>
      ) : (
        segments.map((seg, idx) => (
          <Box key={idx} sx={{ display: "flex", gap: 1.5, mt: 1.5, alignItems: "flex-start" }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: REFUND_STYLES.redIconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FlightIcon sx={{ color: "#FFFFFF", fontSize: 18 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Typography sx={REFUND_STYLES.timeText}>{seg.departTime}</Typography>
                <Typography sx={REFUND_STYLES.dateText}>{seg.departDate}</Typography>
                <ArrowForwardIcon sx={{ fontSize: 18, color: "#A0A0A0" }} />
                <Typography sx={REFUND_STYLES.timeText}>{seg.arriveTime}</Typography>
                <Typography sx={REFUND_STYLES.dateText}>{seg.arriveDate}</Typography>
              </Box>
              <Box component="ul" sx={{ m: 0, pl: 2.5, mt: 0.5, "& li": { ...REFUND_STYLES.bulletText, mb: 0.25 } }}>
                <li>{seg.route}</li>
                <li>{seg.airline}</li>
                <li>
                  <Box component="span" sx={REFUND_STYLES.durationBlue}>Duration: {seg.duration}</Box>
                </li>
                <li>{seg.cabin} · Baggage {seg.baggage}</li>
              </Box>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        p: 2,
        height: "100%",
      }}
    >
      <Tabs
        value={refundTab}
        onChange={(_, v) => setRefundTab(v)}
        sx={{
          borderBottom: "1px solid #E5E7EB",
          mb: 2,
          "& .MuiTab-root": { textTransform: "none", ...REFUND_STYLES.tabText },
          "& .Mui-selected": { color: "#333333", fontWeight: 600 },
          "& .MuiTabs-indicator": { backgroundColor: REFUND_STYLES.tabActiveUnderline, height: 3 },
        }}
      >
        <Tab label="Voluntary" />
        <Tab label="In-Voluntary" />
        <Tab label="Others" />
      </Tabs>

      <Typography sx={{ ...REFUND_STYLES.sectionHeader, mb: 2 }}>Select Flight Information</Typography>
      {renderFlightCard("Departure", `${goDeparture} → ${goArrival}`, processedGo)}
      {isRoundTrip && backDeparture && backArrival && renderFlightCard("Return", `${backDeparture} → ${backArrival}`, processedBack)}

      <Box sx={{ borderTop: "1px solid #E5E7EB", my: 2 }} />

      <Typography sx={{ ...REFUND_STYLES.sectionHeader, mb: 2 }}>Select Passenger Information</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E5E7EB", borderRadius: 1, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: REFUND_STYLES.tableHeaderBg }}>
              <TableCell sx={REFUND_STYLES.tableHeaderText}>Title</TableCell>
              <TableCell sx={REFUND_STYLES.tableHeaderText}>First Name</TableCell>
              <TableCell sx={REFUND_STYLES.tableHeaderText}>Last Name</TableCell>
              <TableCell sx={REFUND_STYLES.tableHeaderText}>PAX</TableCell>
              <TableCell sx={REFUND_STYLES.tableHeaderText}>Date of Birth</TableCell>
              <TableCell sx={REFUND_STYLES.tableHeaderText}>Passport No</TableCell>
              <TableCell sx={REFUND_STYLES.tableHeaderText}>Expire Date</TableCell>
              <TableCell sx={REFUND_STYLES.tableHeaderText}>Ticket No</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {travellers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ ...REFUND_STYLES.tableCellText, py: 3, textAlign: "center" }}>
                  No passenger data available
                </TableCell>
              </TableRow>
            ) : (
              travellers.map((traveller, index) => (
                <TableRow
                  key={index}
                  sx={{
                    bgcolor: index % 2 === 0 ? REFUND_STYLES.tableRowBg : REFUND_STYLES.tableRowAltBg,
                  }}
                >
                  <TableCell sx={REFUND_STYLES.tableCellText}>{getTitle(traveller.gender)}</TableCell>
                  <TableCell sx={REFUND_STYLES.tableCellText}>{traveller.firstName || "N/A"}</TableCell>
                  <TableCell sx={REFUND_STYLES.tableCellText}>{traveller.lastName || "N/A"}</TableCell>
                  <TableCell sx={REFUND_STYLES.tableCellText}>{getPaxType(index)}</TableCell>
                  <TableCell sx={REFUND_STYLES.tableCellText}>{formatDateDDMMYYYY(traveller.dateOfBirth)}</TableCell>
                  <TableCell sx={REFUND_STYLES.tableCellText}>{traveller.passportNumber || "N/A"}</TableCell>
                  <TableCell sx={REFUND_STYLES.tableCellText}>{formatDateDDMMYYYY(traveller.passportExpireDate)}</TableCell>
                  <TableCell sx={REFUND_STYLES.tableCellText}>
                    {Array.isArray(traveller?.Ticket) && traveller.Ticket.length > 0
                      ? traveller.Ticket.map((t) => t?.TicketNo).filter(Boolean).join(", ") || data?.gdsPNR || data?.airlinePNR || "N/A"
                      : data?.gdsPNR || data?.airlinePNR || "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookingQueRefundDetails;
