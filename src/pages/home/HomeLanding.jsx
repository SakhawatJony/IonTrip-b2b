import React from "react";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import PublicIcon from "@mui/icons-material/Public";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import { useNavigate } from "react-router-dom";
import TrustedAirlineAlliances from "../../components/home/TrustedAirlineAlliances";

/** Hero visual assets (transparent airplane + world map SVG) */
const WORLD_MAP_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg";
const AIRPLANE_IMAGE = "https://pngimg.com/d/airplane_PNG101.png";

const HERO = {
  bgFrom: "#020617",
  bgVia: "#0a1628",
  bgTo: "#0c2347",
  subtext: "#E5E7EB",
  loginBlue: "var(--secondary-color)",
  loginBlueHover: "var(--secondary-color-hover)",
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
    title: "All-in-One Global Travel Inventory",
    lead: "Access flights, hotels, transfers, tours, and more from multiple suppliers in one platform.",
    leadExtra: "No need to switch between systems — everything is centralized.",
    bullets: [
      "GDS + API + direct supplier integration",
      "Real-time availability and competitive pricing",
      "One dashboard for all bookings",
    ],
    tip: "B2B portals connect agents to global inventory via GDS and APIs, allowing real-time search and booking from multiple providers",
    icon: <PublicIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Instant Booking with Live Availability",
    lead: "Search, compare, and confirm bookings instantly with real-time data.",
    bullets: [
      "Live seat & room availability",
      "Instant PNR and e-ticket generation",
      "Faster response to customer queries",
    ],
    tip: "Real-time booking reduces delays and improves efficiency for travel agents",
    icon: <FlashOnOutlinedIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Smart Pricing & Profit Control",
    lead: "Take full control of your business margins with flexible pricing tools.",
    bullets: [
      "Set markups (agent-wise / product-wise)",
      "Manage commissions easily",
      "Offer competitive pricing while maximizing profit",
    ],
    tip: "B2B systems allow agencies to control pricing, commissions, and margins from a single platform",
    icon: <AttachMoneyOutlinedIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Multi-Agent & Sub-Agent Management",
    lead: "Grow your network and manage multiple agents under one system.",
    bullets: [
      "Create unlimited sub-agents",
      "Agent wallet & credit limit system",
      "Role-based access (Admin / Agent / Staff)",
    ],
    tip: "B2B portals are designed to support sub-agent networks and scale business globally",
    icon: <GroupsOutlinedIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Automation That Saves Time",
    lead: "Reduce manual work and run your agency more efficiently.",
    bullets: [
      "Auto booking, cancellation, and notifications",
      "Invoice, voucher, and reporting automation",
      "Centralized booking management",
    ],
    tip: "Automation reduces operational workload and errors while improving efficiency",
    icon: <SettingsSuggestOutlinedIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Secure & Reliable Booking System",
    lead: "Built with stable infrastructure to handle high booking volume.",
    bullets: [
      "Secure payment gateway integration",
      "Data protection & safe transactions",
      "High uptime and system reliability",
    ],
    icon: <ShieldOutlinedIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Advanced Reports & Business Insights",
    lead: "Make smarter decisions with real-time data.",
    bullets: ["Sales & profit reports", "Agent performance tracking", "Booking analytics dashboard"],
    tip: "Reporting tools help agencies track performance and optimize business decisions",
    icon: <AnalyticsOutlinedIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "24/7 Access – Book Anytime, Anywhere",
    lead: "Your agents can log in and book anytime from anywhere.",
    bullets: ["Cloud-based system", "Mobile-friendly interface", "No dependency on office hours"],
    tip: "B2B portals allow agents to operate globally without time or location limits",
    icon: <CloudOutlinedIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Dedicated Support & Onboarding",
    lead: "You're not alone — we support your growth.",
    bullets: [
      "Setup & training support",
      "Technical & operational assistance",
      "Continuous updates and improvements",
    ],
    icon: <SupportAgentOutlinedIcon sx={{ color: SECONDARY }} />,
  },
];

const SOLUTION_CARDS = [
  {
    title: "Flight Booking (Global GDS & API Access)",
    lead: "Search and book flights from global airlines with real-time fares and instant confirmation.",
    bullets: [
      "Access GDS + LCC + consolidator fares",
      "Live seat availability & instant ticketing",
      "Smart fare comparison for best deals",
      "Multi-city & group booking support",
    ],
    tip: "B2B portals allow agents to access real-time airline inventory and pricing through integrated systems, improving speed and accuracy",
    icon: <FlightIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Hotel Booking (Worldwide Inventory)",
    lead: "Offer your clients thousands of hotels worldwide with competitive B2B rates.",
    bullets: [
      "Global hotel inventory (budget to luxury)",
      "Instant confirmation with real-time availability",
      "Special agent rates & markup control",
      "Easy filtering by price, location, and rating",
    ],
    tip: "A centralized portal gives agents access to global hotel suppliers and competitive pricing in one place",
    icon: <HotelIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Tour & Holiday Packages",
    lead: "Sell complete travel experiences, not just tickets.",
    bullets: [
      "Pre-built and customizable tour packages",
      "Sightseeing, activities, and excursions",
      "Dynamic packaging (flight + hotel + tour)",
      "Increase revenue with bundled services",
    ],
    tip: "Modern B2B systems integrate tours and activities APIs, helping agencies diversify offerings and increase sales",
    icon: <TravelExploreIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Transfers & Transportation",
    lead: "Provide seamless airport and city transfers for your clients.",
    bullets: [
      "Airport pickup & drop services",
      "Private and shared transfers",
      "Reliable global transfer suppliers",
      "Add-on services to increase booking value",
    ],
    tip: "B2B portals allow agents to book multiple services like transfers in one system, improving efficiency",
    icon: <AirportShuttleIcon sx={{ color: SECONDARY }} />,
  },
  {
    title: "Visa Assistance Management",
    lead: "Simplify visa services and documentation for your clients.",
    bullets: [
      "Manage visa applications and requirements",
      "Track documentation and processing",
      "Add visa services as an extra revenue stream",
      "Improve customer experience with full travel support",
    ],
    tip: "Some advanced portals integrate visa workflows and documentation support into itinerary management",
    icon: <DescriptionOutlinedIcon sx={{ color: SECONDARY }} />,
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    no: "1",
    title: "Register & Get Approved",
    lead: "Create your agent account and activate your B2B dashboard.",
    bullets: [
      "Quick onboarding & account setup",
      "Dedicated agent login with secure access",
      "Add company details and start instantly",
    ],
    tip: "B2B portals are designed for agents with dedicated access and multi-user control systems",
  },
  {
    no: "2",
    title: "Search, Compare & Customize",
    lead: "Find the best deals across flights, hotels, tours, and more — all in one place.",
    bullets: [
      "Real-time inventory from multiple suppliers",
      "Compare prices instantly (GDS + API + LCC)",
      "Build complete itineraries (flight + hotel + transfer + tour)",
      "Multi-currency and flexible options",
    ],
    tip: "Modern B2B systems provide real-time availability and multi-supplier comparison to improve booking accuracy and speed",
  },
  {
    no: "3",
    title: "Book Instantly & Manage Everything",
    lead: "Confirm bookings in seconds and manage your entire business from one dashboard.",
    bullets: [
      "Instant booking & e-ticket/voucher generation",
      "Automated invoicing & reporting",
      "Manage bookings, cancellations, and changes",
      "Track sales, profit, and agent performance",
    ],
    tip: "Automation in B2B portals improves efficiency, reduces manual work, and increases productivity for travel agents",
  },
  {
    no: "4",
    title: "Earn & Grow Your Agency",
    lead: "Scale your business with full control over pricing and your agent network.",
    bullets: [
      "Set your own markup & commissions",
      "Add sub-agents and expand your network",
      "Wallet, credit limit & payment management",
      "Increase revenue with multi-service sales",
    ],
    tip: "B2B travel platforms help agencies increase revenue and expand their distribution network globally",
  },
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

      <TrustedAirlineAlliances />

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Typography sx={{ textAlign: "center", fontSize: { xs: 30, md: 40 }, fontWeight: 800, color: "#0B1F4D" }}>
          Why Travel Agents Choose{" "}
          <Box component="span" sx={{ color: SECONDARY }}>
            IonTrip
          </Box>
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            color: "#5F6B7A",
            mt: 1,
            mb: 4,
            maxWidth: 800,
            mx: "auto",
            fontSize: { xs: 15, md: 16 },
            lineHeight: 1.6,
          }}
        >
          A complete B2B booking platform built to help travel agents sell faster, earn more, and scale globally.
        </Typography>
        <Grid container spacing={2}>
          {WHY_CARDS.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.title}>
              <Box
                sx={{
                  bgcolor: "#FFFFFF",
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid #E6EBF2",
                  height: "100%",
                  borderTop: `3px solid ${SECONDARY}`,
                  display: "flex",
                  flexDirection: "column",
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
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, md: 17 }, color: "#0B1F4D", mb: 0.8 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ fontSize: 14, color: "#5F6B7A", lineHeight: 1.55 }}>{item.lead}</Typography>
                {item.leadExtra ? (
                  <Typography sx={{ fontSize: 14, color: "#5F6B7A", lineHeight: 1.55, mt: 0.75 }}>{item.leadExtra}</Typography>
                ) : null}
                <Stack component="ul" sx={{ m: 0, pl: 2.25, mt: 1.25, color: "#5F6B7A", fontSize: 14, lineHeight: 1.55, flex: 1 }}>
                  {item.bullets.map((line) => (
                    <Box component="li" key={line} sx={{ mb: 0.5 }}>
                      {line}
                    </Box>
                  ))}
                </Stack>
                {item.tip ? (
                  <Box
                    sx={{
                      mt: 1.75,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: SECONDARY_SOFT,
                      borderLeft: `3px solid ${SECONDARY}`,
                      display: "flex",
                      gap: 1,
                      alignItems: "flex-start",
                    }}
                  >
                    <LightbulbOutlinedIcon sx={{ fontSize: 20, color: SECONDARY, mt: 0.15, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 13, color: "#5F6B7A", lineHeight: 1.5 }}>{item.tip}</Typography>
                  </Box>
                ) : null}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Typography
          sx={{
            textAlign: "center",
            color: "#5F6B7A",
            mt: 4,
            maxWidth: 720,
            mx: "auto",
            fontSize: { xs: 15, md: 16 },
            lineHeight: 1.65,
            fontWeight: 500,
          }}
        >
          Start your B2B travel business or scale your agency with a powerful, all-in-one booking platform built for
          professionals.
        </Typography>
      </Container>

      <Box sx={{  py: { xs: 6, md: 8 } }}>
        <Container>
          <Typography sx={{ textAlign: "center", fontSize: { xs: 30, md: 40 }, fontWeight: 800, color: "#0B1F4D" }}>
            Complete Travel Solutions for Your{" "}
            <Box component="span" sx={{ color: SECONDARY }}>
              Business
            </Box>
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "#5F6B7A",
              mt: 1,
              mb: 4,
              maxWidth: 800,
              mx: "auto",
              fontSize: { xs: 15, md: 16 },
              lineHeight: 1.6,
            }}
          >
            Everything a modern travel agent needs — flights, hotels, tours, transfers, and visa services — all in one
            powerful B2B platform.
          </Typography>
          <Grid container spacing={2}>
            {SOLUTION_CARDS.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.title}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid #E6EBF2",
                    height: "100%",
                    bgcolor: "#FBFCFF",
                    borderLeft: `3px solid ${SECONDARY}`,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ color: SECONDARY, mb: 1 }}>{item.icon}</Box>
                  <Typography sx={{ fontWeight: 700, color: "#0B1F4D", mb: 0.7, fontSize: { xs: 16, md: 17 } }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#5F6B7A", fontSize: 14, lineHeight: 1.55, mb: 1.25 }}>{item.lead}</Typography>
                  <Stack component="ul" sx={{ m: 0, pl: 2.25, color: "#5F6B7A", fontSize: 14, lineHeight: 1.55, flex: 1 }}>
                    {item.bullets.map((line) => (
                      <Box component="li" key={line} sx={{ mb: 0.5 }}>
                        {line}
                      </Box>
                    ))}
                  </Stack>
                  <Box
                    sx={{
                      mt: 1.75,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: SECONDARY_SOFT,
                      borderLeft: `3px solid ${SECONDARY}`,
                      display: "flex",
                      gap: 1,
                      alignItems: "flex-start",
                    }}
                  >
                    <LightbulbOutlinedIcon sx={{ fontSize: 20, color: SECONDARY, mt: 0.15, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 13, color: "#5F6B7A", lineHeight: 1.5 }}>{item.tip}</Typography>
                  </Box>
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
            IonTrip Works
          </Box>
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            color: "#5F6B7A",
            mt: 1,
            mb: 4,
            maxWidth: 720,
            mx: "auto",
            fontSize: { xs: 15, md: 16 },
            lineHeight: 1.6,
          }}
        >
          Start selling travel services in minutes with a powerful B2B booking system designed for agents.
        </Typography>
        <Grid container spacing={2}>
          {HOW_IT_WORKS_STEPS.map((step) => (
            <Grid item xs={12} md={6} key={step.no}>
              <Box
                sx={{
                  bgcolor: "#FFFFFF",
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid #E6EBF2",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
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
                    flexShrink: 0,
                  }}
                >
                  {step.no}
                </Box>
                <Typography sx={{ fontWeight: 700, color: "#0B1F4D", mb: 0.8, fontSize: { xs: 17, md: 18 } }}>
                  {step.title}
                </Typography>
                <Typography sx={{ color: "#5F6B7A", fontSize: 14, lineHeight: 1.55, mb: 1.25 }}>{step.lead}</Typography>
                <Stack component="ul" sx={{ m: 0, pl: 2.25, color: "#5F6B7A", fontSize: 14, lineHeight: 1.55, flex: 1 }}>
                  {step.bullets.map((line) => (
                    <Box component="li" key={line} sx={{ mb: 0.5 }}>
                      {line}
                    </Box>
                  ))}
                </Stack>
                <Box
                  sx={{
                    mt: 1.75,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: SECONDARY_SOFT,
                    borderLeft: `3px solid ${SECONDARY}`,
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                  }}
                >
                  <LightbulbOutlinedIcon sx={{ fontSize: 20, color: SECONDARY, mt: 0.15, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 13, color: "#5F6B7A", lineHeight: 1.5 }}>{step.tip}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
