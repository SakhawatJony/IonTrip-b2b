import React from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import PublicIcon from "@mui/icons-material/Public";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

/** Hero visual assets (transparent airplane + world map SVG) */
const WORLD_MAP_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg";
const AIRPLANE_IMAGE = "https://pngimg.com/d/airplane_PNG101.png";

const HERO = {
  bgFrom: "#020617",
  bgVia: "#0a1628",
  bgTo: "#0c2347",
  subtext: "#E5E7EB",
  loginBlue: "#2563EB",
  loginBlueHover: "#1d4ed8",
  agentGreen: "#10B981",
  agentGreenHover: "#059669",
  pillBg: "rgba(15, 35, 75, 0.88)",
  pillBorder: "rgba(255,255,255,0.12)",
  checkGreen: "#22c55e",
};

/** Brand secondary — used in sections below the hero (same token as dashboard / search). */
const SECONDARY = "var(--secondary-color, #024DAF)";
const SECONDARY_SOFT = "color-mix(in srgb, var(--secondary-color, #024DAF) 14%, #ffffff)";

const WHY_CARDS = [
  {
    title: "Global Inventory",
    text: "Access flights, hotels, and travel services from top suppliers worldwide.",
    icon: <PublicIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Real-Time Booking",
    text: "Live availability and instant booking confirmations for faster operations.",
    icon: <FlashOnOutlinedIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Secure Platform",
    text: "Reliable booking flows with stable performance and safe transactions.",
    icon: <ShieldOutlinedIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Dedicated Support",
    text: "Our support team helps your agents with booking and account issues quickly.",
    icon: <SupportAgentOutlinedIcon sx={{ color: SECONDARY }} />,
  },
];

const SOLUTION_CARDS = [
  { title: "Flight Booking", text: "Search and book flights with smart fares.", icon: <FlightIcon sx={{ color: SECONDARY }} /> },
  { title: "Hotel Booking", text: "Find and reserve hotels with instant confirmation.", icon: <HotelIcon sx={{ color: SECONDARY }} /> },
  { title: "Visa Assistance", text: "Manage visa services and documentation flows.", icon: <PublicIcon sx={{ color: SECONDARY }} /> },
  { title: "Transfers", text: "Offer airport and city transfer services to clients.", icon: <SupportAgentOutlinedIcon sx={{ color: SECONDARY }} /> },
];

const STEPS = [
  { no: "1", title: "Register as Agent", text: "Create your account and activate your agency." },
  { no: "2", title: "Search and Compare", text: "Compare options from multiple suppliers in one place." },
  { no: "3", title: "Book and Earn", text: "Confirm bookings quickly and grow your business." },
];

export default function HomeLanding() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "#F6F8FC" }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(155deg, ${HERO.bgFrom} 0%, ${HERO.bgVia} 42%, ${HERO.bgTo} 100%)`,
          color: "#FFFFFF",
          py: { xs: 8, md: 12 },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            pointerEvents: "none",
            backgroundImage:
              "radial-gradient(1.5px 1.5px at 12px 18px, rgba(147,197,253,0.55) 50%, transparent 50%)",
            backgroundSize: "40px 40px",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            right: "-18%",
            top: "-28%",
            width: "72%",
            height: "120%",
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 48% 48%, rgba(0,86,179,0.42) 0%, rgba(37,99,235,0.12) 45%, transparent 68%)",
          },
        }}
      >
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  fontWeight: 800,
                  lineHeight: 1.12,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                  maxWidth: 720,
                }}
              >
                Empowering Travel Agents with Smart Booking Technology
              </Typography>
              <Typography
                sx={{
                  mt: 3,
                  mb: 4,
                  fontSize: "1.125rem",
                  lineHeight: 1.65,
                  color: HERO.subtext,
                  maxWidth: 560,
                }}
              >
                Access global flights, hotels, and travel services in one powerful B2B platform. Fast,
                reliable, and built for modern travel businesses.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<LockOutlinedIcon sx={{ fontSize: 20 }} />}
                  onClick={() => navigate("/login")}
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 2.5,
                    py: 1.1,
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    bgcolor: HERO.loginBlue,
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: HERO.loginBlueHover },
                  }}
                >
                  Login to Agent
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<CheckCircleOutlineIcon sx={{ fontSize: 20 }} />}
                  onClick={() => navigate("/register")}
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 2.5,
                    py: 1.1,
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    bgcolor: HERO.agentGreen,
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: HERO.agentGreenHover },
                  }}
                >
                  Become an Agent
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap", mt: 3.5 }}>
                {["Real-Time Inventory", "Global GDS Integration", "Instant Ticketing", "Competitive B2B Rates"].map(
                  (pill) => (
                    <Box
                      key={pill}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.4,
                        py: 0.75,
                        borderRadius: "8px",
                        bgcolor: HERO.pillBg,
                        border: `1px solid ${HERO.pillBorder}`,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#FFFFFF",
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 16, color: HERO.checkGreen }} />
                      {pill}
                    </Box>
                  )
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: "relative",
                  minHeight: { xs: 340, md: 480 },
                  width: "100%",
                  overflow: "visible",
                }}
              >
                {/* Local star / particle field (right column) */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: "-8%",
                    pointerEvents: "none",
                    zIndex: 0,
                    opacity: 0.55,
                    backgroundImage:
                      "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.9) 50%, transparent 50%), radial-gradient(1px 1px at 88% 12%, rgba(186,230,253,0.95) 50%, transparent 50%), radial-gradient(1.2px 1.2px at 72% 78%, rgba(255,255,255,0.75) 50%, transparent 50%), radial-gradient(1px 1px at 40% 88%, rgba(147,197,253,0.8) 50%, transparent 50%)",
                    backgroundSize: "120% 120%",
                  }}
                />

                {/* Outer halo behind globe */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "52%",
                    transform: "translate(-50%, -50%)",
                    width: "min(104%, 440px)",
                    aspectRatio: "1",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 50% 42%, rgba(0,86,179,0.55) 0%, rgba(37,99,235,0.18) 42%, transparent 72%)",
                    filter: "blur(2px)",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />

                {/* Globe + map + arcs — centered */}
                <Box
                  sx={{
                    position: "relative",
                    width: "min(100%, 400px)",
                    aspectRatio: "1",
                    mx: "auto",
                    mt: { xs: 1, md: 2 },
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      overflow: "hidden",
                      boxShadow:
                        "0 0 0 1px rgba(147,197,253,0.12), 0 0 80px rgba(0,86,179,0.55), inset 0 -24px 60px rgba(0,0,0,0.55), inset 0 0 40px rgba(100,180,255,0.12)",
                      background:
                        "radial-gradient(circle at 32% 28%, #1e5a9e 0%, #0b3d78 38%, #051a30 72%, #000814 100%)",
                    }}
                  >
                    <Box
                      component="img"
                      src={WORLD_MAP_IMAGE}
                      alt=""
                      sx={{
                        position: "absolute",
                        inset: "-6%",
                        width: "112%",
                        height: "112%",
                        objectFit: "cover",
                        opacity: 0.88,
                        filter: "invert(1) brightness(1.18) contrast(1.12)",
                        pointerEvents: "none",
                      }}
                    />
                    {/* Dotted / digital texture over landmasses */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.42,
                        backgroundImage:
                          "radial-gradient(1.1px 1.1px at center, rgba(255,255,255,0.95) 50%, transparent 51%)",
                        backgroundSize: "5px 5px",
                        mixBlendMode: "overlay",
                        pointerEvents: "none",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "radial-gradient(circle at 50% 50%, transparent 52%, rgba(0,8,20,0.75) 100%)",
                        pointerEvents: "none",
                      }}
                    />
                  </Box>

                  {/* Flight-path arcs + glow */}
                  <Box
                    component="svg"
                    viewBox="0 0 400 400"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                      zIndex: 2,
                      overflow: "visible",
                    }}
                    aria-hidden
                  >
                    <defs>
                      <filter id="heroArcGlow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="2.2" result="b" />
                        <feMerge>
                          <feMergeNode in="b" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <path
                      d="M 52 210 Q 180 90 348 168"
                      fill="none"
                      stroke="rgba(147,197,253,0.9)"
                      strokeWidth="1.4"
                      filter="url(#heroArcGlow)"
                      opacity={0.95}
                    />
                    <path
                      d="M 78 268 Q 210 140 330 220"
                      fill="none"
                      stroke="rgba(186,230,253,0.75)"
                      strokeWidth="1.1"
                      filter="url(#heroArcGlow)"
                      opacity={0.85}
                    />
                    <path
                      d="M 120 120 Q 240 40 300 100"
                      fill="none"
                      stroke="rgba(125,211,252,0.65)"
                      strokeWidth="1"
                      filter="url(#heroArcGlow)"
                      opacity={0.75}
                    />
                    {[
                      [52, 210],
                      [348, 168],
                      [78, 268],
                      [330, 220],
                      [120, 120],
                      [300, 100],
                    ].map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r="4" fill="#e0f2fe" opacity={0.95} filter="url(#heroArcGlow)" />
                    ))}
                  </Box>
                </Box>

                {/* Airplane — in front of globe, angled up toward left */}
                <Box
                  component="img"
                  src={AIRPLANE_IMAGE}
                  alt=""
                  sx={{
                    position: "absolute",
                    width: { xs: "86%", md: "92%" },
                    maxWidth: 400,
                    right: { xs: "-10%", md: "-12%" },
                    top: { xs: "2%", md: "0%" },
                    transform: "scaleX(-1) rotate(-8deg)",
                    filter:
                      "drop-shadow(0 22px 36px rgba(0,0,0,0.55)) drop-shadow(0 -2px 12px rgba(255,255,255,0.12))",
                    zIndex: 4,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Typography sx={{ textAlign: "center", fontSize: { xs: 30, md: 40 }, fontWeight: 800, color: "#0B1F4D" }}>
          Why Travel Agents Choose{" "}
          <Box component="span" sx={{ color: SECONDARY }}>
            IonTrip
          </Box>
        </Typography>
        <Typography sx={{ textAlign: "center", color: "#5F6B7A", mt: 1, mb: 4 }}>
          Better speed, better pricing, and better control for your team.
        </Typography>
        <Grid container spacing={2}>
          {WHY_CARDS.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Box
                sx={{
                  bgcolor: "#FFFFFF",
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid #E6EBF2",
                  height: "100%",
                  borderTop: `3px solid ${SECONDARY}`,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: SECONDARY_SOFT,
                    display: "grid",
                    placeItems: "center",
                    mb: 1.5,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#0B1F4D", mb: 0.8 }}>{item.title}</Typography>
                <Typography sx={{ fontSize: 14, color: "#5F6B7A", lineHeight: 1.5 }}>{item.text}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "#FFFFFF", py: { xs: 6, md: 8 } }}>
        <Container>
          <Typography sx={{ textAlign: "center", fontSize: { xs: 30, md: 40 }, fontWeight: 800, color: "#0B1F4D" }}>
            Complete Travel Solutions for Your{" "}
            <Box component="span" sx={{ color: SECONDARY }}>
              Business
            </Box>
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {SOLUTION_CARDS.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.title}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid #E6EBF2",
                    height: "100%",
                    bgcolor: "#FBFCFF",
                    borderLeft: `3px solid ${SECONDARY}`,
                  }}
                >
                  <Box sx={{ color: SECONDARY, mb: 1 }}>{item.icon}</Box>
                  <Typography sx={{ fontWeight: 700, color: "#0B1F4D", mb: 0.7 }}>{item.title}</Typography>
                  <Typography sx={{ color: "#5F6B7A", fontSize: 14 }}>{item.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Typography sx={{ textAlign: "center", fontSize: { xs: 30, md: 40 }, fontWeight: 800, color: "#0B1F4D" }}>
          How{" "}
          <Box component="span" sx={{ color: SECONDARY }}>
            It Works
          </Box>
        </Typography>
        <Typography sx={{ textAlign: "center", color: "#5F6B7A", mt: 1, mb: 4 }}>
          Start booking in 3 simple steps.
        </Typography>
        <Grid container spacing={2}>
          {STEPS.map((step) => (
            <Grid item xs={12} md={4} key={step.no}>
              <Box sx={{ bgcolor: "#FFFFFF", p: 2.5, borderRadius: 3, border: "1px solid #E6EBF2", height: "100%" }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    bgcolor: SECONDARY,
                    color: "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700,
                    mb: 1.2,
                  }}
                >
                  {step.no}
                </Box>
                <Typography sx={{ fontWeight: 700, color: "#0B1F4D", mb: 0.7 }}>{step.title}</Typography>
                <Typography sx={{ color: "#5F6B7A", fontSize: 14 }}>{step.text}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
