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
import brandLogo from "../../assets/updatedslogo2.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/features" },
  { label: "Support", path: "/contact" },
];

/** Same gradient as `HomeLanding` hero so the bar reads as one piece with the hero. */
const HERO_BG = {
  from: "#020617",
  via: "#0a1628",
  to: "#0c2347",
};

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

  const whiteColor = getCSSVariable("--white") || "#FFFFFF";
  const linkMuted = "rgba(229, 231, 235, 0.92)";
  const linkActive = "#FFFFFF";
  const linkHover = "#93C5FD";
  const signInBlue = "#2563EB";

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: `linear-gradient(155deg, ${HERO_BG.from} 0%, ${HERO_BG.via} 42%, ${HERO_BG.to} 100%)`,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          opacity: 0.28,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 12px 18px, rgba(147,197,253,0.45) 50%, transparent 50%)",
          backgroundSize: "40px 40px",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          right: "-20%",
          top: "-60%",
          width: "55%",
          height: "220%",
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 48% 48%, rgba(0,86,179,0.35) 0%, rgba(37,99,235,0.1) 45%, transparent 68%)",
        },
      }}
    >
      <Container sx={{ position: "relative", zIndex: 1 }}>
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
                maxWidth: { xs: 200, sm: 280 },
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
                  color: location.pathname === path ? linkActive : linkMuted,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: { xs: "14px", sm: "16px" },
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  "&:hover": { color: linkHover },
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
                  backgroundColor: signInBlue,
                  color: whiteColor,
                  borderRadius: "17px",
                  minWidth: "100px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#1d4ed8",
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
