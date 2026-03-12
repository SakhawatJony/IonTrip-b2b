import React, { useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import BookingQueReissueForm from "./BookingQueReissueForm";

const BookingQueReissue = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { agentToken, agentData } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
  const data = location.state?.bookingData || null;

  const agentEmail = agentData?.email || "";
  const bookingId = data?.bookingId || "";
  const [sending, setSending] = useState(false);

  const handleSendReissueRequest = async (payload) => {
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
        requestReason: (payload?.remarks || "").trim() || "Change of itinerary",
        segmentRefunds,
        travelerRefunds: Array.isArray(payload?.selectedPassengers) ? payload.selectedPassengers : [],
        reissueDate: payload?.departureReissueDate ? payload.departureReissueDate?.toISOString?.() : null,
      };

      const response = await axios.post(
        `${baseUrl}/booking/agent/${bookingId}/request-reissue?email=${encodeURIComponent(agentEmail)}`,
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
        "Reissue request submitted successfully.";
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
        "Failed to submit reissue request. Please try again.";
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
    navigate("/dashboard/bookingqueuedetails", { state: { bookingId: data?.bookingId } });
  };

  if (!data) {
    return (
      <Box sx={{ minHeight: "100vh", px: 4, py: 4 }}>
        <Typography sx={{ fontSize: 14, color: "#6B7280", mb: 2 }}>
          No booking data. Please go back and open Reissue from the booking details.
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/bookings")}
          variant="outlined"
        >
          Back to Bookings
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
          Reissue Request
        </Typography>
      </Box>

      <Box sx={{ px: 4, py: 4 }}>
        <BookingQueReissueForm
          data={data}
          sending={sending}
          onSendReissueRequest={handleSendReissueRequest}
        />
      </Box>
    </Box>
  );
};

export default BookingQueReissue;
