import React, { useState } from "react";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PublicLayout from "../../components/layout/PublicLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthSession } = useAuth();
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://iontrip-backend-production.up.railway.app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastState, setToastState] = useState({ open: false, message: "", severity: "error" });

  const showToast = (message, severity = "error") => {
    setToastState({ open: true, message, severity });
  };

  const handleToastClose = () => {
    setToastState((prev) => ({ ...prev, open: false }));
  };

  const handleLogin = async () => {
    const trimmedEmail = String(email || "").trim();
    const rawPassword = String(password || "");

    if (!trimmedEmail || !rawPassword) {
      showToast("Email and password are required.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/signAgent`, {
        email: trimmedEmail,
        password: rawPassword,
      });

      const successMessage = response?.data?.message || "Sign in successful.";
      showToast(successMessage, "success");

      // Persist auth payload from API response.
      const token =
        response?.data?.access_token ||
        response?.data?.accessToken ||
        response?.data?.token ||
        response?.data?.data?.access_token ||
        response?.data?.data?.accessToken ||
        response?.data?.data?.token;
      const agent =
        response?.data?.agentData ||
        response?.data?.agent ||
        response?.data?.data?.agentData ||
        response?.data?.data?.agent ||
        null;
      const expireIn = response?.data?.expireIn || response?.data?.data?.expireIn || "";

      setAuthSession(token, agent, expireIn);

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      const apiError = error?.response?.data?.error;
      const message =
        (Array.isArray(apiMessage) ? apiMessage.join(", ") : apiMessage) ||
        apiError ||
        error?.message ||
        "Sign in failed. Please try again.";
      showToast(message, "error");
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
        }}
      >
        <Box
          sx={{
            bgcolor: "var(--white)",
            width: "100%",
            maxWidth: "700px",
            borderRadius: "8px",
            p: 5,
            // boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            sx={{
              color: "var(--primary-color)",
              fontSize: "28px",
              fontWeight: 600,
              mb: 4,
              textAlign: "center",
            }}
          >
            Agent Sign In
          </Typography>

          {/* Email Field */}
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#5F6368",
                fontWeight: 500,
                mb: 1,
              }}
            >
              Email
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #E0E0E0",
                pb: 1,
                "&:focus-within": {
                  borderBottom: "2px solid var(--primary-color)",
                },
              }}
            >
              <EmailIcon
                sx={{
                  color: "#9E9E9E",
                  mr: 2,
                  fontSize: "20px",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="login-input"
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  fontSize: "16px",
                  padding: "8px 0",
                  color: "#202124",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
              />
            </Box>
          </Box>

          {/* Password Field */}
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#5F6368",
                fontWeight: 500,
                mb: 1,
              }}
            >
              Password
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #E0E0E0",
                pb: 1,
                "&:focus-within": {
                  borderBottom: "2px solid var(--primary-color)",
                },
              }}
            >
              <LockIcon
                sx={{
                  color: "#9E9E9E",
                  mr: 2,
                  fontSize: "20px",
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="login-input"
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  fontSize: "16px",
                  padding: "8px 0",
                  color: "#202124",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
              />
            </Box>
          </Box>

          {/* Forgot Password Link */}
          <Box sx={{ mb: 3, textAlign: "right" }}>
            <Typography
              component="a"
              href="#"
              sx={{
                fontSize: "14px",
                color: "#1976d2",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot Password ?
            </Typography>
          </Box>

          {/* Sign In Button */}
          <Button
            fullWidth
            type="submit"
            disabled={isSubmitting}
            sx={{
              bgcolor: "var(--primary-color)",
              color: "var(--white)",
              py: 1.5,
              fontSize: "16px",
              fontWeight: 500,
              textTransform: "none",
              height: "40px",
              borderRadius: "4px",
              mb: 3,
              "&:hover": {
                bgcolor: "var(--primary-color)",
                opacity: 0.9,
              },
            }}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#5F6368",
              }}
            >
              Don't have an Account?{" "}
              <Typography
                component="span"
                onClick={() => navigate("/register")}
                sx={{
                  fontSize: "14px",
                  color: "#1976d2",
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign Up
              </Typography>
            </Typography>
          </Box>
          </Box>
          <style>{`
            .login-input {
              background: transparent !important;
              box-shadow: none !important;
              -webkit-appearance: none;
              appearance: none;
            }
            .login-input:focus {
              outline: none !important;
              background: transparent !important;
              box-shadow: none !important;
            }
            .login-input::selection {
              background: transparent;
            }
            .login-input::-moz-selection {
              background: transparent;
            }
            .login-input:-webkit-autofill,
            .login-input:-webkit-autofill:hover,
            .login-input:-webkit-autofill:focus,
            .login-input:-webkit-autofill:active {
              background-color: transparent !important;
              -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
              box-shadow: 0 0 0 1000px transparent inset !important;
              -webkit-text-fill-color: #202124 !important;
              transition: background-color 9999s ease-in-out 0s;
            }
          `}</style>
        </Box>
      </Box>
      <Snackbar
        open={toastState.open}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toastState.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toastState.message}
        </Alert>
      </Snackbar>
    </PublicLayout>
  );
};

export default Login;
