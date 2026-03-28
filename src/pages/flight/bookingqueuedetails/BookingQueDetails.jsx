import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Modal,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentIcon from "@mui/icons-material/Payment";
import CancelIcon from "@mui/icons-material/Cancel";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import TimelineIcon from "@mui/icons-material/Timeline";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import BookingQueDetailsCard from "./BookingQueDetailsCard";
import BookingQuePassengerList from "./BookingQuePassengerList";
import BookingQueRefundDetails from "./BookingQueRefundDetails";
import BookingQueFareDetails from "./BookingQueFareDetails";
import BookingQueSupport from "./BookingQueSupport";
import BookingQueSessionTime from "./BookingQueSessionTime";
import BookingQueInfoSection from "./BookingQueInfoSection";
import BookingQueInvoiceDetails from "./BookingQueInvoiceDetails";

const BookingQueDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { agentToken, agentData } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production-2d3b.up.railway.app";

  const bookingId = location.state?.bookingId || "";
  const agentEmail = agentData?.email || "";

  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [timelineData, setTimelineData] = useState(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [voucherMenuAnchor, setVoucherMenuAnchor] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedVoucherType, setSelectedVoucherType] = useState(null);
  const [issueBalanceDialogOpen, setIssueBalanceDialogOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletBalanceLoading, setWalletBalanceLoading] = useState(false);
  const [payWithWalletLoading, setPayWithWalletLoading] = useState(false);
  const [cancelBookingLoading, setCancelBookingLoading] = useState(false);

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

  // Fetch timeline when modal opens (dynamic from API)
  useEffect(() => {
    if (!timelineModalOpen || !bookingId || !agentEmail) return;
    const token = agentToken || localStorage.getItem("agentToken") || "";
    if (!token) return;

    const fetchTimeline = async () => {
      setTimelineLoading(true);
      setTimelineData(null);
      try {
        const res = await axios.get(
          `${baseUrl}/booking/agent/${bookingId}/timeline?email=${encodeURIComponent(agentEmail)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const raw = res?.data?.data ?? res?.data?.timeline ?? res?.data;
        setTimelineData(Array.isArray(raw) ? raw : raw?.timeline ?? raw?.bookingHistory ?? raw?.history ?? null);
      } catch {
        setTimelineData(null);
      } finally {
        setTimelineLoading(false);
      }
    };

    fetchTimeline();
  }, [timelineModalOpen, bookingId, agentEmail, agentToken, baseUrl]);

  // Fetch wallet balance when Issue with Balance dialog opens
  useEffect(() => {
    if (!issueBalanceDialogOpen || !agentEmail) return;
    const token = agentToken || localStorage.getItem("agentToken") || "";
    if (!token) return;
    const fetchWalletBalance = async () => {
      setWalletBalanceLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/agent/wallet/${encodeURIComponent(agentEmail)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = res?.data?.data || res?.data;
        const bal = data?.balance ?? data?.amount ?? data?.walletBalance ?? 0;
        setWalletBalance(bal);
      } catch {
        setWalletBalance(null);
      } finally {
        setWalletBalanceLoading(false);
      }
    };
    fetchWalletBalance();
  }, [issueBalanceDialogOpen, agentEmail, agentToken, baseUrl]);

  const handlePayWithWallet = async () => {
    const token = agentToken || localStorage.getItem("agentToken") || "";
    if (!token || !agentEmail || !bookingId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Missing agent token, email, or booking ID. Please login again.",
        confirmButtonColor: "var(--primary-color)",
      });
      return;
    }
    const amount = Number(bookingData?.agentFare?? 0);
    if (!amount || amount <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid booking amount.",
        confirmButtonColor: "var(--primary-color)",
      });
      return;
    }
    setPayWithWalletLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/ticket-actions/pay-with-wallet`,
        {
          amount,
          email: agentEmail,
          currency: "MYR",
          bookingId: bookingId || bookingData?.bookingId,
        },
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
        "Payment successful!";
      setIssueBalanceDialogOpen(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: successMessage,
        confirmButtonColor: "var(--primary-color)",
      });
      // Refetch booking details to update status
      const refetchRes = await axios.get(
        `${baseUrl}/booking/agent/${bookingId}?email=${encodeURIComponent(agentEmail)}`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setBookingData(refetchRes?.data || refetchRes?.data?.data || null);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err?.message ??
        "Payment failed. Please try again.";
      setIssueBalanceDialogOpen(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "var(--primary-color)",
      });
      console.error("Pay with wallet failed:", err?.response?.data || err);
    } finally {
      setPayWithWalletLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    const token = agentToken || localStorage.getItem("agentToken") || "";
    if (!token || !agentEmail || !bookingId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Missing agent email or booking ID. Please login again.",
        confirmButtonColor: "var(--primary-color)",
      });
      return;
    }
    const result = await Swal.fire({
      icon: "warning",
      title: "Cancel Booking",
      text: "Are you sure you want to cancel this booking?",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
      confirmButtonColor: "var(--primary-color)",
      cancelButtonColor: "#6B7280",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    setCancelBookingLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/flight/CancelBooking?bookingId=${encodeURIComponent(bookingId)}&email=${encodeURIComponent(agentEmail)}`,
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
        "Booking cancelled successfully.";
      Swal.fire({
        icon: "success",
        title: "Success",
        text: successMessage,
        confirmButtonColor: "var(--primary-color)",
      });
      const refetchRes = await axios.get(
        `${baseUrl}/booking/agent/${bookingId}?email=${encodeURIComponent(agentEmail)}`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setBookingData(refetchRes?.data || refetchRes?.data?.data || null);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err?.message ??
        "Failed to cancel booking. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "var(--primary-color)",
      });
      console.error("Cancel booking failed:", err?.response?.data || err);
    } finally {
      setCancelBookingLoading(false);
    }
  };

  const normalizeTimelineEvent = (e) => {
    const dateTime =
      e.dateTime ?? e.date ?? e.createdAt ?? e.created_at ?? e.timestamp ?? e.updatedAt ?? e.updated_at ?? e.time;
    const statusRaw =
      e.status ?? e.event ?? e.eventType ?? e.action ?? e.state ?? e.bookingStatus ?? "";
    const status = String(statusRaw).toUpperCase().replace(/\s+/g, " ").trim() || "N/A";
    const agent =
      e.agent ??
      e.agentName ??
      e.agent_name ??
      e.performedBy ??
      e.user ??
      e.userName ??
      "N/A";
    const remarks = e.remarks ?? e.remark ?? e.note ?? e.notes ?? e.description ?? "N/A";
    return { dateTime, status, agent, remarks };
  };

  const timelineEvents = useMemo(() => {
    const fromFetched = Array.isArray(timelineData) && timelineData.length > 0;
    const fromBooking =
      bookingData?.timeline ?? bookingData?.bookingHistory ?? bookingData?.history ?? bookingData?.bookingTimeline ?? bookingData?.events ?? bookingData?.statusHistory;
    const rawList = fromFetched ? timelineData : Array.isArray(fromBooking) ? fromBooking : null;

    if (rawList && rawList.length > 0) {
      const events = rawList.map(normalizeTimelineEvent);
      const hasHold = events.some(
        (e) =>
          /HOLD|BOOKED/i.test(e.status) && !/CANCEL|EXPIRED/i.test(e.status)
      );
      const isCancelled = events.some(
        (e) => /CANCELLED|CANCELED|EXPIRED/i.test(e.status)
      );
      const created =
        bookingData?.createdAt ??
        bookingData?.created_at ??
        bookingData?.lastTicketTime;
      const agentName =
        bookingData?.agentName ??
        bookingData?.agent_name ??
        agentData?.name ??
        agentData?.email ??
        "N/A";
      const remarks = bookingData?.remarks ?? "N/A";
      if (isCancelled && !hasHold && created) {
        const holdEvent = {
          dateTime: created,
          status: "BOOKING HOLD",
          agent: agentName,
          remarks,
        };
        const sorted = [holdEvent, ...events].sort(
          (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
        );
        return sorted;
      }
      return events.sort(
        (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
      );
    }
    const status = (bookingData?.status || "HOLD").toUpperCase().replace("BOOKED", "HOLD");
    const created =
      bookingData?.createdAt ?? bookingData?.created_at ?? bookingData?.lastTicketTime ?? new Date().toISOString();
    const updated =
      bookingData?.updatedAt ??
      bookingData?.updated_at ??
      bookingData?.cancelledAt ??
      bookingData?.cancelled_at ??
      bookingData?.canceledAt ??
      bookingData?.modifiedAt ??
      bookingData?.modified_at ??
      new Date().toISOString();
    const agentName =
      bookingData?.agentName ?? bookingData?.agent_name ?? agentData?.name ?? agentData?.email ?? "N/A";
    const remarks = bookingData?.remarks ?? "N/A";
    const isCancelled =
      status === "CANCELLED" || status === "CANCELED" || status === "EXPIRED";

    if (isCancelled) {
      return [
        {
          dateTime: created,
          status: "BOOKING HOLD",
          agent: agentName,
          remarks,
        },
        {
          dateTime: updated,
          status: status === "EXPIRED" ? "BOOKING EXPIRED" : "BOOKING CANCELLED",
          agent: agentName,
          remarks,
        },
      ];
    }
    return [
      {
        dateTime: created,
        status: status === "HOLD" ? "BOOKING HOLD" : status,
        agent: agentName,
        remarks,
      },
    ];
  }, [bookingData, agentData, timelineData]);

  const formatTimelineDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} ${h}:${m}`;
  };

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
    <Box sx={{ minHeight: "100vh", px: 4, py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <BookingQueInfoSection data={bookingData} />
            <BookingQueDetailsCard data={bookingData} />
            <BookingQuePassengerList data={bookingData} />
          </Box>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Timeline & Voucher Download - always visible */}
            <Box sx={{ display: "flex", gap: 1, flexDirection: "column"}}>
              <Button
                startIcon={<TimelineIcon />}
                onClick={() => setTimelineModalOpen(true)}
                sx={{
                  flex: 1,
                  bgcolor: "#2C4A57",
                  color: "white",
                  textTransform: "capitalize",
                  borderRadius: "6px",
                  "&:hover": { bgcolor: "#243d47" },
                }}
              >
                Timeline
              </Button>
              <Button
                startIcon={<FileDownloadIcon />}
                endIcon={<KeyboardArrowDownIcon />}
                onClick={(e) => setVoucherMenuAnchor(e.currentTarget)}
                sx={{
                  flex: 1,
                  bgcolor: "#2CCEE4",
                  color: "white",
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "#25b8cc" },
                }}
              >
                Voucher Download
              </Button>
              <Menu
                anchorEl={voucherMenuAnchor}
                open={Boolean(voucherMenuAnchor)}
                onClose={() => setVoucherMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{ sx: { minWidth: 200, mt: 1.5 } }}
              >
                {(() => {
                  const rawStatus = (bookingData?.status || "").toUpperCase();
                  const isBookedOrCancelled = ["BOOKED", "HOLD", "CANCELLED", "CANCELED", "EXPIRED"].includes(rawStatus);
                  const goToInvoice = (invoiceType) => {
                    setVoucherMenuAnchor(null);
                    navigate("/dashboard/bookingqueueinvoice", {
                      state: { bookingData, invoiceType },
                    });
                  };
                  if (isBookedOrCancelled) {
                    return (
                      <MenuItem onClick={() => goToInvoice("Customer Invoice")}>
                        Booking Invoice
                      </MenuItem>
                    );
                  }
                  return (
                    <>
                      <MenuItem onClick={() => goToInvoice("E-Ticket")}>
                        E-Ticket
                      </MenuItem>
                      <MenuItem onClick={() => goToInvoice("Agent Invoice")}>
                        Agent Invoice
                      </MenuItem>
                      <MenuItem onClick={() => goToInvoice("Customer Invoice")}>
                        Customer Invoice
                      </MenuItem>
                    </>
                  );
                })()}
              </Menu>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {(() => {
                const rawStatus = (bookingData?.status || "").toUpperCase().replace(/\s+/g, " ");
                const isHold = rawStatus === "HOLD" || rawStatus === "BOOKED";
                const isRefundOrReissueRequest =
                  rawStatus === "REFUND REQUEST" || rawStatus === "REISSUE REQUEST";
                const buttonRowSx = { display: "flex", gap: 1, flexDirection: "column" };
                if (isHold) {
                  return (
                    <Box sx={buttonRowSx}>
                      <Button
                        startIcon={<PaymentIcon />}
                        onClick={() => setIssueBalanceDialogOpen(true)}
                        sx={{
                          flex: 1,
                          bgcolor: "var(--primary-color)",
                          color: "white",
                          textTransform: "capitalize",
                          "&:hover": { bgcolor: "var(--primary-color)", opacity: 0.9 },
                        }}
                      >
                        Issue with Balance
                      </Button>
                      <Button
                        startIcon={<CancelIcon />}
                        onClick={handleCancelBooking}
                        disabled={cancelBookingLoading}
                        sx={{
                          flex: 1,
                          bgcolor: "red",
                          color: "white",
                          textTransform: "capitalize",
                          "&:hover": { bgcolor: "#c62828" },
                        }}
                      >
                        {cancelBookingLoading ? "Cancelling..." : "Cancel"}
                      </Button>
                    </Box>
                  );
                }
                if (isRefundOrReissueRequest) {
                  return null;
                }
                return (
                  <Box sx={buttonRowSx}>
                    <Button
                      startIcon={<MoneyOffIcon />}
                      onClick={() => navigate("/dashboard/bookingqueuerefund", { state: { bookingData } })}
                      sx={{
                        flex: 1,
                        bgcolor: "var(--grey)",
                        color: "white",
                        textTransform: "capitalize",
                        "&:hover": { bgcolor: "#555" },
                      }}
                    >
                      Refund
                    </Button>
                    <Button
                      startIcon={<AutorenewIcon />}
                      onClick={() => navigate("/dashboard/bookingqueuereissue", { state: { bookingData } })}
                      sx={{
                        flex: 1,
                        bgcolor: "var(--input)",
                        color: "white",
                        textTransform: "capitalize",
                        "&:hover": { bgcolor: "#666" },
                      }}
                    >
                      Reissue
                    </Button>
                  </Box>
                );
              })()}
            </Box>
            <BookingQueFareDetails data={bookingData} />
            <BookingQueSupport />
            <BookingQueSessionTime data={bookingData} />
           
          </Box>
        </Grid>
      </Grid>

      {/* Booking Timeline Modal */}
      <Modal
        open={timelineModalOpen}
        onClose={() => setTimelineModalOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
      >
        <Box
          sx={{
            bgcolor: "#2C4A57",
            borderRadius: "12px",
            maxWidth: 520,
            width: "100%",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: 24,
          }}
        >
          {/* Header */}
          <Box sx={{ position: "relative", px: 3, pt: 3, pb: 1 }}>
            <IconButton
              onClick={() => setTimelineModalOpen(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white",
                bgcolor: "rgba(0,0,0,0.2)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.35)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: "white" }}>
              Booking Timeline
            </Typography>
            <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.9)", mt: 0.5 }}>
              Airlines PNR: {bookingData?.airlinePNR ?? bookingData?.gdsPNR ?? "N/A"}, PNR :{" "}
              {bookingData?.gdsPNR ?? "N/A"}
            </Typography>
          </Box>

          {/* Timeline list - all dynamic from API / bookingData */}
          <Box sx={{ px: 3, pb: 3, pt: 1, overflowY: "auto" }}>
            {timelineLoading ? (
              <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress sx={{ color: "rgba(255,255,255,0.8)" }} size={32} />
              </Box>
            ) : (
            timelineEvents.map((event, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  position: "relative",
                  pb: index < timelineEvents.length - 1 ? 2.5 : 0,
                }}
              >
                {/* Left: date/time */}
                <Box sx={{ width: 140, flexShrink: 0, pr: 2 }}>
                  <Typography sx={{ fontSize: 13, color: "white" }}>
                    {formatTimelineDate(event.dateTime)}
                  </Typography>
                </Box>
                {/* Vertical line + dot */}
                <Box
                  sx={{
                    width: 20,
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#e53935",
                      flexShrink: 0,
                    }}
                  />
                  {index < timelineEvents.length - 1 && (
                    <Box
                      sx={{
                        width: 2,
                        flex: 1,
                        minHeight: 40,
                        bgcolor: "rgba(255,255,255,0.5)",
                        mt: 0.5,
                      }}
                    />
                  )}
                </Box>
                {/* Right: status, agent, remarks */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 700, color: "white", textTransform: "uppercase" }}
                  >
                    {event.status}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.95)", mt: 0.25 }}>
                    Agent: {event.agent}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.9)" }}>
                    Remarks: {event.remarks}
                  </Typography>
                </Box>
              </Box>
            ))
            )}
          </Box>
        </Box>
      </Modal>

      {/* Issue with Balance Dialog */}
      <Modal
        open={issueBalanceDialogOpen}
        onClose={() => setIssueBalanceDialogOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
      >
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderRadius: "8px",
            maxWidth: 380,
            width: "100%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            overflow: "hidden",
            textAlign: "center",
            
            py: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#212121",
              mb: 1,
            }}
          >
            Issue with full payment
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 400,
              color: "#616161",
              mb: 3,
            }}
          >
            Your Balance:{" "}
            {walletBalanceLoading ? (
              "Loading..."
            ) : (
              <>
                {(walletBalance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                {bookingData?.farecurrency || "BDT"}
              </>
            )}
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#212121",
              mb: 1.5,
            }}
          >
            Amount to Pay
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "2px",
                bgcolor: "var(--primary-color)",
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--primary-color)",
              }}
            >
              {Number(bookingData?.netPrice ?? bookingData?.clientFare ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {bookingData?.farecurrency || "BDT"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={() => setIssueBalanceDialogOpen(false)}
              sx={{
                
              
                borderRadius: "5px",
                bgcolor: "#F96E4C",
                color: "#FFFFFF",
                textTransform: "capitalize",
                fontSize: "12px",
                fontWeight: 600,
                width: "100px",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#E85D3B",
                  boxShadow: "none",
                },
              }}
            >
              Not Now
            </Button>
            <Button
              onClick={handlePayWithWallet}
              disabled={payWithWalletLoading}
              sx={{
                borderRadius: "5px",
                bgcolor: "var(--primary-color)",
                color: "#FFFFFF",
                textTransform: "capitalize",
                fontSize: "13px",
                width: "100px",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "var(--primary-color)",
                  opacity: 0.9,
                  boxShadow: "none",
                },
              }}
            >
              {payWithWalletLoading ? "Processing..." : "Issue Now"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Invoice Details Modal (E-Ticket / Agent Invoice / Customer Invoice) */}
      <Modal
        open={invoiceModalOpen}
        onClose={() => { setInvoiceModalOpen(false); setSelectedVoucherType(null); }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "12px",
            maxWidth: 560,
            width: "100%",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: 24,
          }}
        >
          <Box sx={{ position: "relative", px: 3, pt: 3, pb: 2, borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
            <IconButton
              onClick={() => { setInvoiceModalOpen(false); setSelectedVoucherType(null); }}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#6B7280",
                "&:hover": { bgcolor: "rgba(0,0,0,0.06)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#1F2937" }}>
              {selectedVoucherType || "Invoice"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Typography sx={{ fontSize: 12, color: "#6B7280" }}>Booking Status:</Typography>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "6px",
                  bgcolor:
                    (bookingData?.status || "").toUpperCase() === "CANCELLED" ||
                    (bookingData?.status || "").toUpperCase() === "CANCELED" ||
                    (bookingData?.status || "").toUpperCase() === "EXPIRED"
                      ? "#FEE2E2"
                      : "#D1FAE5",
                  color:
                    (bookingData?.status || "").toUpperCase() === "CANCELLED" ||
                    (bookingData?.status || "").toUpperCase() === "CANCELED" ||
                    (bookingData?.status || "").toUpperCase() === "EXPIRED"
                      ? "#B91C1C"
                      : "#065F46",
                  fontWeight: 600,
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                {(() => {
                  const s = (bookingData?.status || "N/A").toUpperCase();
                  if (s === "CANCELLED" || s === "CANCELED" || s === "EXPIRED") return s.replace("CANCELED", "Cancelled");
                  if (s === "BOOKED" || s === "HOLD") return "Booked / Ticketed";
                  return s;
                })()}
              </Box>
            </Box>
          </Box>
          <Box sx={{ px: 3, py: 2, overflowY: "auto", flex: 1 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#374151", mb: 1.5 }}>
              Invoice Details
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { label: "Booking ID", value: bookingData?.bookingId || "N/A" },
                { label: "PNR", value: bookingData?.gdsPNR || "N/A" },
                { label: "Airlines PNR", value: bookingData?.airlinePNR || bookingData?.gdsPNR || "N/A" },
                { label: "Booking Status", value: (bookingData?.status || "N/A") },
                {
                  label: "Total Amount",
                  value: `${bookingData?.farecurrency || "MYR"} ${Number(bookingData?.netPrice ?? bookingData?.clientFare ?? 0).toFixed(2)}`,
                },
              ].map((row) => (
                <Box
                  key={row.label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1,
                    px: 1.5,
                    borderRadius: "6px",
                    bgcolor: "#F3F4F6",
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
                    {row.label}
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#1F2937" }}>
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Box>
            {Array.isArray(bookingData?.travellers) && bookingData.travellers.length > 0 && (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#374151", mt: 2, mb: 1 }}>
                  Passengers
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  {bookingData.travellers.map((p, i) => (
                    <Box
                      key={i}
                      sx={{
                        py: 1,
                        px: 1.5,
                        borderRadius: "6px",
                        bgcolor: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#1F2937" }}>
                        {[p.title, p.firstName, p.lastName].filter(Boolean).join(" ")}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
                        {p.paxType || "Adult"} • {p.dateOfBirth ? `DOB: ${p.dateOfBirth}` : ""}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}
            {Array.isArray(bookingData?.pricebreakdown) && bookingData.pricebreakdown.length > 0 && (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#374151", mt: 2, mb: 1 }}>
                  Fare breakdown
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  {bookingData.pricebreakdown.map((item, i) => {
                    const paxCount = item.PaxCount || 1;
                    const base = (parseFloat(item.BaseFare || 0) * paxCount).toFixed(2);
                    const tax = (parseFloat(item.Tax || 0) * paxCount).toFixed(2);
                    const currency = bookingData?.farecurrency || "MYR";
                    return (
                      <Box
                        key={i}
                        sx={{
                          py: 1,
                          px: 1.5,
                          borderRadius: "6px",
                          bgcolor: "#F9FAFB",
                          border: "1px solid #E5E7EB",
                        }}
                      >
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#1F2937" }}>
                          {item.PaxType || "Adult"} (x{paxCount})
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
                          Base: {currency} {base} • Tax: {currency} {tax}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default BookingQueDetails;
