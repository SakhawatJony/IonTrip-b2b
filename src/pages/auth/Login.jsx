import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PublicLayout from "../../components/layout/PublicLayout";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  fontSize: "16px",
                  padding: "8px 0",
                  color: "#202124",
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
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  fontSize: "16px",
                  padding: "8px 0",
                  color: "#202124",
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
            Sign In
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
      </Box>
    </PublicLayout>
  );
};

export default Login;
