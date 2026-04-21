import React, { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import PublicLayout from "../../components/layout/PublicLayout";
import { toast } from "react-toastify";

const inputWrapSx = {
  mb: 2.5,
  bgcolor: "#f0f2f5",
  borderRadius: "8px",
  px: 2,
  py: 1.25,
  border: "1px solid #e8eaed",
  display: "flex",
  alignItems: "center",
  "&:focus-within": {
    borderColor: "var(--secondary-color, #024DAF)",
    boxShadow: "0 0 0 1px var(--secondary-color, #024DAF)",
  },
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.iontrip.com";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setOtp(tokenFromUrl.trim());
    }
  }, [searchParams]);

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
    const token = String(otp || "").trim();
    const pwd = String(newPassword || "");
    const confirm = String(confirmPassword || "");

    if (!token) {
      showToast("Please enter the OTP or reset code from your email.");
      return;
    }
    if (!pwd) {
      showToast("Please enter a new password.");
      return;
    }
    if (pwd.length < 8) {
      showToast("New password must be at least 8 characters.");
      return;
    }
    if (pwd !== confirm) {
      showToast("New password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${baseUrl}/auth/agent/reset-password`,
        { token, newPassword: pwd },
        { headers: { "Content-Type": "application/json" } }
      );
      const apiSuccess = response?.data?.message || "Your password has been reset. You can sign in now.";
      showToast(apiSuccess, "success");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const data = err?.response?.data;
      const apiMessage = data?.message ?? data?.error;
      const msg =
        (Array.isArray(apiMessage) ? apiMessage.join(", ") : apiMessage) ||
        err?.message ||
        "";
      showToast(msg || "Something went wrong. Please try again.");
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
            Reset your password
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
            Enter the OTP from your email, then choose and confirm your new password.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} autoComplete="on">
            <Typography sx={{ fontSize: "14px", color: "#5F6368", fontWeight: 500, mb: 1 }}>
              OTP / reset code
            </Typography>
            <Box sx={{ ...inputWrapSx, mb: 3 }}>
              <input
                type="text"
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP or paste code from email"
                className="reset-password-input"
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

            <Typography sx={{ fontSize: "14px", color: "#5F6368", fontWeight: 500, mb: 1 }}>
              New password
            </Typography>
            <Box sx={{ ...inputWrapSx, mb: 3 }}>
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="reset-password-input"
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "16px",
                  backgroundColor: "transparent",
                  color: "var(--primary-text-color, #202124)",
                }}
              />
              <IconButton
                type="button"
                size="small"
                onClick={() => setShowNew((v) => !v)}
                sx={{ color: "var(--secondary-color)", ml: 0.5 }}
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </Box>

            <Typography sx={{ fontSize: "14px", color: "#5F6368", fontWeight: 500, mb: 1 }}>
              Confirm new password
            </Typography>
            <Box sx={{ ...inputWrapSx, mb: 3 }}>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="reset-password-input"
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "16px",
                  backgroundColor: "transparent",
                  color: "var(--primary-text-color, #202124)",
                }}
              />
              <IconButton
                type="button"
                size="small"
                onClick={() => setShowConfirm((v) => !v)}
                sx={{ color: "var(--secondary-color)", ml: 0.5 }}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </Box>

            <Button
              fullWidth
              type="submit"
              disabled={isSubmitting}
              sx={{
                bgcolor: "var(--secondary-color)",
                color: "var(--white)",
                py: 1.75,
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                mb: 2,
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
              {isSubmitting ? "Updating…" : "Reset password"}
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
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Back to Sign In
            </Typography>
            <Typography
              component={RouterLink}
              to="/forgot-password"
              sx={{
                fontSize: "14px",
                color: "#5F6368",
                textDecoration: "none",
                "&:hover": { color: "var(--secondary-color)", textDecoration: "underline" },
              }}
            >
              Request a new reset email
            </Typography>
          </Box>

          <style>{`
            .reset-password-input::placeholder {
              color: #9aa0a6;
            }
            .reset-password-input:focus {
              outline: none;
            }
          `}</style>
        </Box>
      </Box>
    </PublicLayout>
  );
};

export default ResetPassword;
