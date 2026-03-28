import React from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightIcon from "@mui/icons-material/Flight";
import BadgeIcon from "@mui/icons-material/Badge";
import ComputerIcon from "@mui/icons-material/Computer";
import LuggageIcon from "@mui/icons-material/Luggage";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

// Helpers
const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return "N/A";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return "N/A";
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return `${formatDate(dateString)}, ${formatTime(dateString)}`;
  } catch {
    return "N/A";
  }
};

const getTitle = (gender) => {
  if (!gender) return "MR";
  return String(gender).toUpperCase() === "FEMALE" ? "MRS" : "MR";
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0.00";
  const n = parseFloat(num);
  if (Number.isNaN(n)) return "0.00";
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const getPaxTypeLabel = (value) => {
  const v = String(value || "").toUpperCase().replace(/_/g, " ");
  if (["ADT", "ADULT"].includes(v)) return "ADULT";
  if (["CHD", "CHILD"].includes(v)) return "CHILD";
  if (["INF", "INFT", "INFANT", "HELD INFANT", "HELD_INFANT"].includes(v)) return "INFANT";
  return value ? String(value).toUpperCase() : "ADULT";
};

const ETicketPdfLayout = ({ data, showFareSummary = true }) => {
  const currency = data?.farecurrency || "BDT";
  const pricebreakdown = Array.isArray(data?.pricebreakdown) ? data.pricebreakdown : [];
  const rawTravellers = Array.isArray(data?.travellers) ? data.travellers : [];

  const getTicketNo = (traveller) => {
    const tickets = traveller?.Ticket;
    if (Array.isArray(tickets) && tickets.length > 0) {
      const nos = tickets.map((t) => t?.TicketNo).filter(Boolean);
      return nos.length > 0 ? nos.join(", ") : data?.gdsPNR || data?.airlinePNR || "—";
    }
    return data?.gdsPNR || data?.airlinePNR || "—";
  };

  const travellers = rawTravellers.map((t, i) => {
    const paxType = pricebreakdown[i]?.PaxType || "ADULT";
    const cabinBag = pricebreakdown[0]?.CabinBags || "7KG";
    const firstGo = data?.segments?.go?.[0];
    const checkBag = firstGo?.bags || pricebreakdown[0]?.CheckInBags || "N/A";
    return {
      name: `${getTitle(t.gender)} ${(t.firstName || "").trim()} ${(t.lastName || "").trim()}`.trim() || "N/A",
      type: getPaxTypeLabel(paxType),
      ticket: getTicketNo(t),
      checkBag,
      cabinBag,
    };
  });

  const buildSegmentsForPdf = (segmentsArray) => {
    if (!Array.isArray(segmentsArray)) return [];
    return segmentsArray.map((seg) => {
      const departTime = formatTime(seg.departureTime);
      const arriveTime = formatTime(seg.arrivalTime);
      const departDate = formatDate(seg.departureTime);
      const departCode = seg.departure || seg.departureAirport || "N/A";
      const arriveCode = seg.arrival || seg.arrivalAirport || "N/A";
      const route = `${departCode} - ${arriveCode}`;
      const airline = seg.marketingcareerName || seg.marketingcareer || "N/A";
      const flight = `${seg.marketingcareer || ""} - ${seg.marketingflight || ""}`.trim() || "N/A";
      const duration = seg.flightduration || "N/A";
      const cabin = seg.class || data?.cabinClass || "Economy";
      const layover = seg.transit && Object.keys(seg.transit || {}).length > 0 ? "Stops" : "Non Stop";
      return {
        route,
        date: departDate,
        airline,
        flight,
        departCity: departCode,
        departTime: `${departDate}, ${departTime}`,
        arriveCity: arriveCode,
        arriveTime: `${formatDate(seg.arrivalTime)}, ${arriveTime}`,
        duration,
        cabin,
        layover,
      };
    });
  };

  const goSegments = data?.segments?.go || [];
  const backSegments = data?.segments?.back || [];
  const segments = [...buildSegmentsForPdf(goSegments), ...buildSegmentsForPdf(backSegments)];

  const totalBaseFare = pricebreakdown.reduce(
    (sum, item) => sum + parseFloat(item.BaseFare || 0) * parseFloat(item.PaxCount || 1),
    0
  );
  const totalTax = pricebreakdown.reduce(
    (sum, item) => sum + parseFloat(item.Tax || 0) * parseFloat(item.PaxCount || 1),
    0
  );
  const totalTravelerCount = pricebreakdown.reduce(
    (sum, item) => sum + parseInt(item.PaxCount || 1, 10),
    0
  );
  const aitVat = parseFloat(data?.aitVat ?? data?.ait ?? data?.vat ?? 0);
  const extraBaggage = parseFloat(data?.extraBaggage ?? data?.extraBaggageMealSeat ?? 0);
  const bundleCost = parseFloat(data?.bundleCost ?? 0);
  const grandTotal =
    parseFloat(data?.netPrice ?? data?.clientFare ?? "") ||
    totalBaseFare + totalTax + aitVat + extraBaggage + bundleCost;

  const bookingDate = formatDateTime(
    data?.createdAt ?? data?.created_at ?? data?.lastTicketTime ?? data?.updatedAt
  );

  const reminders = [
    { icon: <FlightTakeoffIcon sx={{ fontSize: 18 }} />, title: "Flight Status", text: "Before your flight, please check your update flight status by inputting airline PNR on the airline website or by calling the airline's customer support." },
    { icon: <BadgeIcon sx={{ fontSize: 18 }} />, title: "Government ID", text: "Please carry a government issued photo ID card with your e-ticket for verification during check-in." },
    { icon: <ComputerIcon sx={{ fontSize: 18 }} />, title: "Online Check-in", text: "Airline website usually have online check-in available which can be availed in requirement." },
    { icon: <LuggageIcon sx={{ fontSize: 18 }} />, title: "Baggage Drop", text: "Please ensure you arrive at the Check-in Bag Drop counter before it closes for document verification and to check in your baggage." },
    { icon: <ExitToAppIcon sx={{ fontSize: 18 }} />, title: "Emergency Exit", text: "Passengers occupying seats in the emergency exit row are required to adhere to safety regulations and fulfill necessary requirements." },
  ];

  return (
    <Box sx={{ maxWidth: 720, margin: "0 auto", background: "#fff", padding: 3, fontFamily: "Arial, Helvetica, sans-serif", color: "#1F2937" }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px dashed #C9CED6", pb: 1, mb: 2 }}>
        <Box sx={{ background: "#1625A7", color: "#fff", padding: "10px 16px", fontWeight: 700, fontSize: 22 }}>ionTrip</Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>IONTRIP & TRAVEL LTD.</Typography>
          <Typography sx={{ fontSize: 11 }}>46A, PURANA PALTAN, DHAKA-1000</Typography>
          <Typography sx={{ fontSize: 10, color: "#6B7280" }}>IATA No: 42343755</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonIcon sx={{ fontSize: 26, background: "#F3F4F6", borderRadius: "50%", padding: "4px" }} />
          <Box>
            <Typography sx={{ fontSize: 11 }}>Emergency Contact</Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>8801813304444</Typography>
          </Box>
        </Box>
      </Box>

      {/* PNR / BOOKING INFO */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#2F3A55" }}>Passenger Information</Typography>
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: 11 }}>Airline PNR : <b>{data?.airlinePNR ?? data?.gdsPNR ?? "N/A"}</b></Typography>
          <Typography sx={{ fontSize: 11 }}>BookingId: {data?.bookingId ?? "N/A"}</Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#16A34A" }}>CONFIRMED</Typography>
          <Typography sx={{ fontSize: 11 }}>{bookingDate}</Typography>
        </Box>
      </Box>

      {/* PASSENGER TABLE */}
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "var(--secondary-color, #024DAF)" }}>
            <TableCell sx={{ fontSize: 11, color: "#FFFFFF", fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontSize: 11, color: "#FFFFFF", fontWeight: 600 }}>Type</TableCell>
            <TableCell sx={{ fontSize: 11, color: "#FFFFFF", fontWeight: 600 }}>E-Ticket No</TableCell>
            <TableCell sx={{ fontSize: 11, color: "#FFFFFF", fontWeight: 600 }}>Check-in Baggage</TableCell>
            <TableCell sx={{ fontSize: 11, color: "#FFFFFF", fontWeight: 600 }}>Cabin Baggage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {travellers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ fontSize: 11 }}>No passenger data</TableCell>
            </TableRow>
          ) : (
            travellers.map((p, i) => (
              <TableRow key={i}>
                <TableCell sx={{ fontSize: 11 }}>{p.name}</TableCell>
                <TableCell sx={{ fontSize: 11 }}>{p.type}</TableCell>
                <TableCell sx={{ fontSize: 11 }}>{p.ticket}</TableCell>
                <TableCell sx={{ fontSize: 11 }}>{p.checkBag}</TableCell>
                <TableCell sx={{ fontSize: 11 }}>{p.cabinBag}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* FLIGHT ITINERARY */}
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#2F3A55", mt: 2 }}>Flight Itinerary</Typography>

      {segments.length === 0 ? (
        <Box sx={{ background: "#E5E7EB", p: 1, fontSize: 11, mt: 1 }}>No flight segments available</Box>
      ) : (
        segments.map((s, i) => (
          <Box key={i}>
            <Box sx={{ background: "#E5E7EB", p: 1, fontSize: 11, mt: 1 }}>
              <ChevronRightIcon sx={{ fontSize: 18 }} /> {s.route} | {s.date} | {s.layover} | {s.cabin} Class
            </Box>
            <Typography sx={{ fontSize: 11, mt: 1 }}>{s.airline} | {s.flight}</Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Box sx={{ width: 22, height: 22, background: "#EF4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FlightTakeoffIcon sx={{ fontSize: 14, color: "#fff" }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{s.departCity}</Typography>
                  <Typography sx={{ fontSize: 11 }}>{s.departTime}</Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <FlightIcon sx={{ fontSize: 16, color: "#9CA3AF" }} />
                <Typography sx={{ fontSize: 11 }}>{s.duration}</Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{s.arriveCity}</Typography>
                <Typography sx={{ fontSize: 11 }}>{s.arriveTime}</Typography>
              </Box>
            </Box>
          </Box>
        ))
      )}

      {/* FARE SUMMARY - only when showFareSummary is true */}
      {showFareSummary && (
        <>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#2F3A55", mt: 2 }}>Fare Summary</Typography>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--secondary-color, #024DAF)" }}>
                <TableCell sx={{ fontSize: 11, color: "#FFFFFF", fontWeight: 600 }}>Passenger Type</TableCell>
                <TableCell sx={{ fontSize: 11, color: "#FFFFFF", fontWeight: 600 }}>Base Fare</TableCell>
                <TableCell sx={{ fontSize: 11, color: "#FFFFFF", fontWeight: 600 }}>Taxes</TableCell>
                <TableCell sx={{ fontSize: 11, color: "#FFFFFF", fontWeight: 600 }}>Total Pax</TableCell>
                <TableCell sx={{ fontSize: 11, color: "#FFFFFF", fontWeight: 600 }}>Total Fare</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pricebreakdown.length === 0 ? (
                <TableRow>
                  <TableCell sx={{ fontSize: 11 }}>ADULT</TableCell>
                  <TableCell sx={{ fontSize: 11 }}>{formatNumber(totalBaseFare)}</TableCell>
                  <TableCell sx={{ fontSize: 11 }}>{formatNumber(totalTax)}</TableCell>
                  <TableCell sx={{ fontSize: 11 }}>{totalTravelerCount}</TableCell>
                  <TableCell sx={{ fontSize: 11 }}>{formatNumber(totalBaseFare + totalTax)}</TableCell>
                </TableRow>
              ) : (
                pricebreakdown.map((item, idx) => {
                  const paxCount = parseInt(item.PaxCount || 1, 10);
                  const base = parseFloat(item.BaseFare || 0) * paxCount;
                  const tax = parseFloat(item.Tax || 0) * paxCount;
                  const total = base + tax;
                  return (
                    <TableRow key={idx}>
                      <TableCell sx={{ fontSize: 11 }}>{getPaxTypeLabel(item.PaxType)}</TableCell>
                      <TableCell sx={{ fontSize: 11 }}>{formatNumber(item.BaseFare)}</TableCell>
                      <TableCell sx={{ fontSize: 11 }}>{formatNumber(item.Tax)}</TableCell>
                      <TableCell sx={{ fontSize: 11 }}>{paxCount}</TableCell>
                      <TableCell sx={{ fontSize: 11 }}>{formatNumber(total)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: 11 }}>AIT & VAT</Typography>
              <Typography sx={{ fontSize: 11 }}>Extra Baggage / Meal / Seat</Typography>
              <Typography sx={{ fontSize: 11 }}>Bundle Cost</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 600, mt: 1 }}>Grand Total</Typography>
            </Box>
            <Box sx={{ textAlign: "right", ml: 4 }}>
              <Typography sx={{ fontSize: 11 }}>{formatNumber(aitVat)} {currency}</Typography>
              <Typography sx={{ fontSize: 11 }}>{formatNumber(extraBaggage)} {currency}</Typography>
              <Typography sx={{ fontSize: 11 }}>{formatNumber(bundleCost)} {currency}</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{formatNumber(grandTotal)} {currency}</Typography>
            </Box>
          </Box>
        </>
      )}

      {/* REMINDERS */}
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#2F3A55", mt: 3 }}>Reminders:</Typography>
      {reminders.map((item, i) => (
        <Box key={i} sx={{ display: "flex", gap: 1.5, mt: 1 }}>
          <Box sx={{ width: 30, height: 30, background: "#E5E7EB", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</Box>
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600 }}>{item.title}:</Typography>
            <Typography sx={{ fontSize: 11 }}>{item.text}</Typography>
          </Box>
        </Box>
      ))}

      {/* IMPORTANT INFO */}
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#2F3A55" }}>Important Information:</Typography>
        <Typography sx={{ fontSize: 11, lineHeight: 1.7 }}>
          This electronic ticket receipt / itinerary serves as your documentation for your electronic ticket and is an integral part of your contract of carriage.
        </Typography>
      </Box>
    </Box>
  );
};

export default ETicketPdfLayout;
