import {
  Toolbar,
  Container,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import AgentProfileNavActions from "./AgentProfileNavActions";
import brandLogo from "../../assets/updatedslogo2.jpeg";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/features" },
  { label: "Support", path: "/contact" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { agentToken } = useAuth();
  const isLoggedIn = Boolean(agentToken);

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
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        width: "100%",
      }}
    >
      <Container>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 0, sm: 2 },
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              pl: { xs: 0, sm: "20px" },
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={brandLogo}
              alt="IonTrip"
              sx={{
                height: { xs: 36, sm: 44 },
                width: "auto",
                maxWidth: { xs: 200, sm: 240 },
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, md: 3 },
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {navItems.map(({ label, path }) => (
              <Typography
                key={path}
                component={Link}
                to={path}
                sx={{
                  color: location.pathname === path ? primaryColor : primaryTextColor,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: { xs: "14px", sm: "16px" },
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  "&:hover": { color: primaryColor },
                }}
              >
                {label}
              </Typography>
            ))}
            {isLoggedIn ? (
              <AgentProfileNavActions />
            ) : (
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  backgroundColor: primaryColor,
                  color: whiteColor,
                  borderRadius: "17px",
                  minWidth: "100px",
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
    </Box>
  );
}
