import React from "react";
import { Box, Typography } from "@mui/material";

const BookingQueInfoSection = ({ data }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const suffix = getDaySuffix(day);
      const month = date.toLocaleString("en-US", { month: "long" });
      const year = date.getFullYear();
      return `${day}${suffix} ${month} ${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Format status to uppercase
  const formatStatus = (status) => {
    if (!status) return "-";
    return status.toUpperCase();
  };

  // Extract data from bookingData
  const bookingStatus = formatStatus(data?.status || data?.bookingStatus);
  const bookingReference = data?.bookingId || data?.bookingReference || "-";
  const pnr = data?.gdsPNR || data?.pnr || "-";
  const airlinePNR = data?.airlinePNR || data?.airlinesPNR || pnr;
  const fareType = data?.fareType || data?.refundable ? "Refundable" : "Non-Refundable";
  const cancellationTime = formatDate(data?.cancellationTime || data?.bookingCancelationTime);

  const infoFields = [
    {
      label: "Booking Status",
      value: bookingStatus,
    },
    {
      label: "Booking Reference",
      value: bookingReference,
    },
    {
      label: "PNR",
      value: pnr,
    },
    {
      label: "Airlines PNR",
      value: airlinePNR,
    },
    {
      label: "Fare Type",
      value: fareType,
    },
    {
      label: "Booking Cancelation Time",
      value: cancellationTime,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 700,
          color: "#0F2F56",
        }}
      >
        Booking Information
      </Typography>
      
      <Box
        sx={{
          backgroundColor: "#EAF2FF",
          borderRadius: 1,
          border: "1px solid #E5E7EB",
          display: "flex",
          overflow: "hidden",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {infoFields.map((field, index) => (
          <React.Fragment key={field.label}>
            <Box
              sx={{
                flex: 1,
                px: 2,
                py: 1.5,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                borderRight: {
                  xs: "none",
                  md: index < infoFields.length - 1 ? "1px solid #CBD5E1" : "none",
                },
                borderBottom: {
                  xs: index < infoFields.length - 1 ? "1px solid #CBD5E1" : "none",
                  md: "none",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#0F2F56",
                  textTransform: "uppercase",
                }}
              >
                {field.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0F172A",
                }}
              >
                {field.value}
              </Typography>
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default BookingQueInfoSection;
