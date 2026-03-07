import {
  Toolbar,
  Container,
  Box,
  Button,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/features" },
  { label: "Support", path: "/contact" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { agentToken, agentData, clearAuthSession } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const isLoggedIn = Boolean(agentToken);

  const handleAgentMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleAgentMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    clearAuthSession();
    handleAgentMenuClose();
    navigate("/login");
  };

  const agentName = agentData?.name || agentData?.agentName || agentData?.email || "";
  const agentInitial = agentName ? String(agentName).trim().charAt(0).toUpperCase() : "A";


  // Get CSS variable values
  const getCSSVariable = (variableName) => {
    if (typeof window !== "undefined") {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
    }
    return "";
  };

  const primaryColor = getCSSVariable("--primary-color") || "#123D6E";
  const whiteColor = getCSSVariable("--white") || "#FFFFFF";
  const primaryTextColor = getCSSVariable("--primary-text-color") || "#202124";

  return (
    <Container >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          component={Link}
          to="/"
          fontWeight="bold"
          fontSize={22}
          color="#123d6e"
          sx={{ pl: "20px", textDecoration: "none" }}
        >
          IonTrip
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {navItems.map(({ label, path }) => (
            <Typography
              key={path}
              component={Link}
              to={path}
              sx={{
                color: location.pathname === path ? primaryColor : primaryTextColor,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "16px",
                whiteSpace: "nowrap",
                textDecoration: "none",
                "&:hover": { color: primaryColor },
              }}
            >
              {label}
            </Typography>
          ))}
          {isLoggedIn ? (
            <>
              <IconButton
                onClick={handleAgentMenuOpen}
                sx={{
                  color: primaryColor,
                  p: 0.5,
                  "&:hover": { backgroundColor: "rgba(18, 61, 110, 0.08)" },
                }}
                aria-label="Agent account"
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: primaryColor,
                    fontSize: "1rem",
                  }}
                >
                  {agentInitial}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleAgentMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  component={Link}
                  to="/dashboard/account"
                  onClick={handleAgentMenuClose}
                >
                  Account
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              sx={{
                backgroundColor: primaryColor,
                color: whiteColor,
                borderRadius: "17px",
                width: "100px",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: primaryColor,
                  opacity: 0.9,
                },
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </Container>
  );
}
