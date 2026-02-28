import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import BookingQueDetailsCard from "./BookingQueDetailsCard";
import BookingQuePassengerList from "./BookingQuePassengerList";
import BookingQueFareDetails from "./BookingQueFareDetails";
import BookingQueSupport from "./BookingQueSupport";
import BookingQueSessionTime from "./BookingQueSessionTime";
import BookingQueInfoSection from "./BookingQueInfoSection";

const BookingQueDetails = () => {
  const location = useLocation();
  const { agentToken, agentData } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
  
  const bookingId = location.state?.bookingId || "";
  const agentEmail = agentData?.email || "";
  
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("Booking ID missing.");
        return;
      }

      if (!agentEmail) {
        setError("Agent email missing. Please login again.");
        return;
      }

      const token = agentToken || localStorage.getItem("agentToken") || "";
      if (!token) {
        setError("Agent token missing. Please login again.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Pass bookingId as path parameter and email as query parameter (not in body)
        const response = await axios.get(`${baseUrl}/booking/agent/${bookingId}?email=${encodeURIComponent(agentEmail)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setBookingData(response?.data || response?.data?.data || null);
      } catch (err) {
        const apiMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load booking details.";
        setError(apiMessage);
        console.error("Fetch booking details failed:", err?.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, agentEmail, agentToken, baseUrl]);
  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: "#0F2F56" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ fontSize: 14, color: "#d32f2f" }}>{error}</Typography>
      </Box>
    );
  }

  if (!bookingData) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ fontSize: 14, color: "#6B7280" }}>No booking data found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", px: 9.5, py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <BookingQueInfoSection data={bookingData} />
            <BookingQueDetailsCard data={bookingData} />

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                    <Typography fontSize={14} fontWeight={700} color="#111827">
                      Passenger Details
                    </Typography>
                    <InfoOutlinedIcon sx={{ fontSize: 14, color: "#94A3B8" }} />
                  </Box>
                  <Typography fontSize={11} color="#94A3B8">
                    Please upload passenger information for issue this ticket
                  </Typography>
                </Box>
                <Button
                  sx={{
                    height: 32,
                    px: 2,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "none",
                    backgroundColor: "#E11D48",
                    color: "#FFFFFF",
                    "&:hover": { backgroundColor: "#BE123C" },
                  }}
                >
                  Upload Passenger Document
                </Button>
              </Box>
              <BookingQuePassengerList data={bookingData} />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <BookingQueFareDetails data={bookingData} />
            <BookingQueSupport />
            <BookingQueSessionTime />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingQueDetails;
