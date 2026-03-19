import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import BookingQueRefundForm from "./BookingQueRefundForm";

const BookingQueRefund = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { agentToken, agentData } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
  const stateBookingData = location.state?.bookingData || null;
  const stateBookingId = location.state?.bookingId || "";
  const stateEmail = location.state?.email || "";

  const [data, setData] = useState(stateBookingData);
  const [loading, setLoading] = useState(!stateBookingData && !!stateBookingId && !!stateEmail);
  const [loadError, setLoadError] = useState("");
  const agentEmail = stateEmail || agentData?.email || "";
  const bookingId = data?.bookingId || stateBookingId || "";
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (stateBookingData || !stateBookingId || !agentEmail) {
      setLoading(false);
      return;
    }
    const token = agentToken || localStorage.getItem("agentToken") || "";
    if (!token) {
      setLoadError("Agent token missing. Please login again.");
      setLoading(false);
      return;
    }
    const fetchBooking = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const response = await axios.get(
          `${baseUrl}/booking/agent/${stateBookingId}?email=${encodeURIComponent(agentEmail)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const bookingData = response?.data || response?.data?.data || null;
        setData(bookingData);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load booking details.";
        setLoadError(msg);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [stateBookingId, agentEmail, agentToken, baseUrl, stateBookingData]);

  const handleSendRefundRequest = async (payload) => {
    const token = agentToken || localStorage.getItem("agentToken") || "";
    if (!token || !agentEmail) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please log in again. Agent session is missing.",
        confirmButtonColor: "var(--primary-color)",
      });
      return;
    }
    if (!bookingId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Booking ID is missing.",
        confirmButtonColor: "var(--primary-color)",
      });
      return;
    }

    setSending(true);
    try {
      const goSegments = data?.segments?.go || [];
      const backSegments = data?.segments?.back || [];
      const segmentRefunds = [];
      if (payload?.departureSelected) {
        goSegments.forEach((_, i) => segmentRefunds.push(`go-${i}`));
      }
      if (payload?.returnSelected) {
        backSegments.forEach((_, i) => segmentRefunds.push(`back-${i}`));
      }

      const requestBody = {
        requestReason: (payload?.remarks || "").trim() || "Passenger no longer travelling",
        segmentRefunds,
        travelerRefunds: Array.isArray(payload?.selectedPassengers) ? payload.selectedPassengers : [],
      };

      const response = await axios.post(
        `${baseUrl}/booking/agent/${bookingId}/request-refund?email=${encodeURIComponent(agentEmail)}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const successMessage =
        response?.data?.message ??
        response?.data?.data?.message ??
        "Refund request submitted successfully.";
      Swal.fire({
        icon: "success",
        title: "Success",
        text: successMessage,
        confirmButtonColor: "var(--primary-color)",
      });
      navigate("/dashboard/bookingqueuedetails", { state: { bookingId } });
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err?.message ??
        "Failed to submit refund request. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "var(--primary-color)",
      });
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard/bookingqueuedetails", { state: { bookingId: data?.bookingId || stateBookingId } });
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
        <CircularProgress size={32} sx={{ color: "var(--primary-color)" }} />
        <Typography sx={{ fontSize: 14, color: "#6B7280" }}>Loading booking details…</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ minHeight: "100vh", px: 4, py: 4 }}>
        <Typography sx={{ fontSize: 14, color: "#6B7280", mb: 2 }}>
          {loadError || "No booking data. Please go back and open Refund from the booking details."}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/bookings/refund")}
          variant="outlined"
        >
          Back to Refunds
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Dark blue header bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.5,
          bgcolor: "var(--primary-dark)",
          minHeight: 56,
        }}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            color: "#FFFFFF",
            p: 0.75,
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
          aria-label="Back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>
          Refund Request
        </Typography>
      </Box>

      <Box sx={{ px: 4, py: 4 }}>
        <BookingQueRefundForm
        data={data}
        sending={sending}
        onSendRefundRequest={handleSendRefundRequest}
        />
      </Box>
    </Box>
  );
};

export default BookingQueRefund;
