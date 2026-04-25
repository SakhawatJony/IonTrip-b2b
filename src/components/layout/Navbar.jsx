import {
  Toolbar,
  Container,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import AgentProfileNavActions from "./AgentProfileNavActions";
import brandLogo from "../../assets/logo1.png";

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
  const secondaryColor = getCSSVariable("--secondary-color") || "#024DAF";
  const secondaryHover = getCSSVariable("--secondary-color-hover") || "#02358f";
  const linkMuted = "rgba(229, 231, 235, 0.92)";
  const linkActive = "#FFFFFF";
  const linkHover = "#93C5FD";

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
            px: { xs: 0, sm: 1.5 },
            minHeight: { xs: 62, md: 70 },
            gap: 1.5,
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
                height: { xs: 34, sm: 40 },
                width: "auto",
                maxWidth: { xs: 190, sm: 240 },
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.1, md: 2.4 },
              justifyContent: "flex-end",
            }}
          >
            {navItems.map(({ label, path }) => (
              <Typography
                key={path}
                component={Link}
                to={path}
                sx={{
                  color: linkMuted,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: { xs: "12px", sm: "13.5px" },
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  "&:hover": { color: linkHover },
                }}
              >
                {label}
              </Typography>
            ))}
            {isLoggedIn ? (
              <AgentProfileNavActions />
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  onClick={() => navigate("/login")}
                  sx={{
                    color: whiteColor,
                    borderRadius: "10px",
                    minWidth: "86px",
                    border: "1px solid rgba(255,255,255,0.35)",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 12.5,
                    py: 0.6,
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.6)",
                      backgroundColor: "rgba(255,255,255,0.06)",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  sx={{
                    backgroundColor: secondaryColor,
                    color: whiteColor,
                    borderRadius: "10px",
                    minWidth: "92px",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 12.5,
                    py: 0.6,
                    "&:hover": {
                      backgroundColor: secondaryHover,
                    },
                  }}
                >
                  Register
                </Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </Box>
  );
}
