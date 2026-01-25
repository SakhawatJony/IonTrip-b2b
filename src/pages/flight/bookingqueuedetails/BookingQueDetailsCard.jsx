import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const segments = [
  {
    departTime: "23:30",
    departDate: "11 Apr, 2028",
    arriveTime: "23:30",
    arriveDate: "11 Apr, 2028",
    route:
      "DAC - Hazrat Shah Jalal Intl Airport, Dhaka, Bangladesh to BOM - Chhatropati Shivaji Intl Airport, Mumbai, India",
    airline: "Biman Bangladesh - BG 456 / Boeing X777-365",
    cabin: "Economy / W Class",
    baggage: "45 KG",
    duration: "45H 35Min",
    layover: "Stops 1 / Layover 45H 50Min",
  },
  {
    departTime: "23:30",
    departDate: "11 Apr, 2028",
    arriveTime: "23:30",
    arriveDate: "11 Apr, 2028",
    route:
      "DAC - Hazrat Shah Jalal Intl Airport, Dhaka, Bangladesh to BOM - Chhatropati Shivaji Intl Airport, Mumbai, India",
    airline: "Biman Bangladesh - BG 456 / Boeing X777-365",
    cabin: "Economy / W Class",
    baggage: "45 KG",
    duration: "45H 35Min",
    layover: "Stops 1 / Layover 45H 50Min",
  },
];

const BookingQueDetailsCard = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        overflow: "hidden",
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography fontSize={12} color="#94A3B8" fontWeight={600} mb={0.5}>
          Departure
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography fontSize={16} fontWeight={700} color="#0F172A">
            DXB
          </Typography>
          <ArrowForwardIcon sx={{ fontSize: 18, color: "#0F2F56" }} />
          <Typography fontSize={16} fontWeight={700} color="#0F172A">
            DAC
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ px: 2, py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {segments.map((segment, index) => (
          <Box key={`${segment.departTime}-${index}`}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  backgroundColor: "#E11D48",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FlightIcon sx={{ color: "#FFFFFF", fontSize: 18 }} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 0.5,
                  }}
                >
                  <Typography fontSize={14} fontWeight={700} color="#111827">
                    {segment.departTime}
                  </Typography>
                  <Typography fontSize={11} color="#94A3B8">
                    {segment.departDate}
                  </Typography>
                  <ArrowForwardIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
                  <Typography fontSize={14} fontWeight={700} color="#111827">
                    {segment.arriveTime}
                  </Typography>
                  <Typography fontSize={11} color="#94A3B8">
                    {segment.arriveDate}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4 }}>
                  <Typography fontSize={11} color="#6B7280">
                    {segment.route}
                  </Typography>
                  <Typography fontSize={11} color="#6B7280">
                    {segment.airline}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Typography fontSize={11} color="#6B7280">
                      {segment.cabin}
                    </Typography>
                    <Typography fontSize={11} color="#6B7280">
                      Baggage {segment.baggage}
                    </Typography>
                    <Typography fontSize={11} color="#0F172A">
                      Duration: {segment.duration}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#0F2F56",
                }}
              />
              <Typography fontSize={11} color="#0F172A" fontWeight={600}>
                {segment.layover}
              </Typography>
            </Box>

            {index < segments.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BookingQueDetailsCard;
