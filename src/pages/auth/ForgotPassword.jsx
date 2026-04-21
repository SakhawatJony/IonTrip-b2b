import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import PublicLayout from "../../components/layout/PublicLayout";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.iontrip.com";
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, severity = "error") => {
    const options = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };
    if (severity === "success") toast.success(message, options);
    else toast.error(message, options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = String(email || "").trim();
    if (!trimmed) {
      showToast("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${baseUrl}/auth/agent/forgot-password`,
        { email: trimmed },
        { headers: { "Content-Type": "application/json" } }
      );
      const apiSuccess =
        response?.data?.message ||
        "If an account exists for this email, you will receive password reset instructions shortly.";
      showToast(apiSuccess, "success");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const data = err?.response?.data;
      const apiMessage = data?.message ?? data?.error;
      const msg =
        (Array.isArray(apiMessage) ? apiMessage.join(", ") : apiMessage) ||
        err?.message ||
        "";
      if (msg) {
        showToast(msg);
      } else {
        showToast("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f2f2f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          px: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "var(--white)",
            width: "100%",
            maxWidth: "480px",
            borderRadius: "8px",
            p: { xs: 3, sm: 5 },
          }}
        >
          <Typography
            sx={{
              color: "var(--primary-text-color, #202124)",
              fontSize: { xs: "24px", sm: "26px" },
              fontWeight: 700,
              mb: 2,
              textAlign: "center",
            }}
          >
            Forgot your password?
          </Typography>
          <Typography
            sx={{
              fontSize: "15px",
              color: "#5F6368",
              lineHeight: 1.6,
              textAlign: "center",
              mb: 4,
            }}
          >
            Enter the email associated with your account and we&apos;ll send you password reset instructions.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#5F6368",
                fontWeight: 500,
                mb: 1,
              }}
            >
              Your Email address
            </Typography>
            <Box
              sx={{
                mb: 3,
                bgcolor: "#f0f2f5",
                borderRadius: "8px",
                px: 2,
                py: 1.25,
                border: "1px solid #e8eaed",
                "&:focus-within": {
                  borderColor: "var(--secondary-color, #024DAF)",
                  boxShadow: "0 0 0 1px var(--secondary-color, #024DAF)",
                },
              }}
            >
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="forgot-password-input"
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "16px",
                  backgroundColor: "transparent",
                  color: "var(--primary-text-color, #202124)",
                }}
              />
            </Box>

            <Button
              fullWidth
              type="submit"
              disabled={isSubmitting}
              sx={{
                bgcolor: "var(--secondary-color)",
                color: "var(--white)",
                py: 1,
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                mb: 3,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "var(--secondary-color-hover)",
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  bgcolor: "var(--secondary-color)",
                  color: "var(--white)",
                  opacity: 0.6,
                },
              }}
            >
              {isSubmitting ? "Sending…" : "Send Reset Instructions"}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography
              component={RouterLink}
              to="/login"
              sx={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--secondary-color, #024DAF)",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Return to Sign In
            </Typography>
            <Typography
              component={RouterLink}
              to="/reset-password"
              sx={{
                fontSize: "14px",
                color: "#5F6368",
                textDecoration: "none",
                "&:hover": {
                  color: "var(--secondary-color)",
                  textDecoration: "underline",
                },
              }}
            >
              Already have an OTP? Reset password
            </Typography>
          </Box>

          <style>{`
            .forgot-password-input::placeholder {
              color: #9aa0a6;
            }
            .forgot-password-input:focus {
              outline: none;
            }
          `}</style>
        </Box>
      </Box>
    </PublicLayout>
  );
};

export default ForgotPassword;
