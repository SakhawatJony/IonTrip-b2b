import React from "react";
import { Box, Typography, Grid } from "@mui/material";

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
        backgroundColor: "#F9FAFB",
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 700,
          color: "#0F2F56",
        }}
      >
        Booking Information
      </Typography>
      
      <Grid container spacing={1.5}>
        {infoFields.map((field) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={field.label}>
            <Box
              sx={{
                backgroundColor: "#EAF2FF",
                borderRadius: 1.5,
                px: 2,
                py: 1,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                height: "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#0F2F56",
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                  mb: 0.3,
                }}
              >
                {field.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0F2F56",
                }}
              >
                {field.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookingQueInfoSection;
