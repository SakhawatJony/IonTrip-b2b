import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import PublicLayout from "../../components/layout/PublicLayout";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://iontrip-backend-production-2d3b.up.railway.app";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from location state or localStorage
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem("verificationEmail");
    const emailToUse = emailFromState || emailFromStorage || "";
    setEmail(emailToUse);
  }, [location]);

  const showToast = (message, severity = "error") => {
    if (severity === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp(newOtp);
      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      showToast("Please enter the complete 6-digit OTP code", "error");
      return;
    }

    setIsVerifying(true);
    try {
      // Backend email verification API: /agent/all/VerifyEmail?token=617155
      const verifyUrl = `${baseUrl}/agent/all/VerifyEmail?token=${encodeURIComponent(
        otpString
      )}`;
      const response = await axios.get(verifyUrl);

      if (response.data) {
        showToast(response.data.message || "OTP verified successfully!", "success");

        // Navigate to login or dashboard after successful verification
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to verify OTP. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      showToast("Email not found. Please register again.", "error");
      return;
    }

    setIsResending(true);
    try {
      const response = await axios.post(
        `${baseUrl}/agent/resend-otp`,
        {
          email: email,
        }
      );

      if (response.data) {
        showToast(response.data.message || "OTP resent successfully!", "success");

        // Clear OTP inputs
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend OTP. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsResending(false);
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
          py: 4,
        }}
      >
        <Box
          sx={{
            bgcolor: "var(--white)",
            width: "100%",
            maxWidth: "500px",
            borderRadius: "12px",
            p: 3,
           
          }}
        >
          {/* Circular Icon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "var(--primary-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FlightIcon
                sx={{
                  color: "#fff",
                  fontSize: 40,
                  transform: "rotate(45deg)",
                }}
              />
            </Box>
          </Box>

          {/* Title */}
          <Typography
            sx={{
              color: "var(--primary-color)",
              fontSize: "24px",
              fontWeight: 600,
              textAlign: "center",
              mb: 2,
            }}
          >
            OTP Verification
          </Typography>

          {/* Instruction Text */}
          <Typography
            sx={{
              color: "#5F6368",
              fontSize: "14px",
              textAlign: "center",
              mb: 4,
              px: 2,
            }}
          >
            Enter the 6 digit verification code received on your Email ID
          </Typography>

          {/* OTP Input Fields */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1.5,
              mb: 4,
            }}
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(el) => {
                  if (el) {
                    inputRefs.current[index] = el;
                  }
                }}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: 600,
                    padding: "12px 0",
                  },
                }}
                sx={{
                  width: 50,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "var(--primary-color)",
                      borderWidth: "1.5px",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--primary-color)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--primary-color)",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
            ))}
          </Box>

          {/* Verify OTP Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleVerifyOtp}
            disabled={isVerifying || otp.join("").length !== 6}
            sx={{
              bgcolor: "var(--primary-color)",
              color: "#ffffff",
              py: 1,
              fontSize: "15px",
              fontWeight: 600,
              borderRadius: "5px",
              textTransform: "none",
              mb: 2,
              "&:hover": {
                bgcolor: "var(--primary-color)",
                opacity: 0.9,
              },
              "&:disabled": {
                bgcolor: "#ccc",
                color: "#fff",
              },
            }}
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>

          {/* Resend OTP Link */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
            }}
          >
            <Button
              onClick={handleResendOtp}
              disabled={isResending}
              sx={{
                color: "#d32f2f",
                fontSize: "14px",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#b71c1c",
                },
                "&:disabled": {
                  color: "#ccc",
                },
              }}
            >
              {isResending ? "Resending..." : "Resend OTP ?"}
            </Button>
          </Box>
        </Box>
      </Box>
    </PublicLayout>
  );
};

export default OtpVerification;
