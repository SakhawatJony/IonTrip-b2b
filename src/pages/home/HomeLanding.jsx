import React, { useState } from "react";
import { Box, Button, Container, Divider, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PublicIcon from "@mui/icons-material/Public";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StorageIcon from "@mui/icons-material/Storage";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PercentIcon from "@mui/icons-material/Percent";
import PaymentsIcon from "@mui/icons-material/Payments";
import MonitorIcon from "@mui/icons-material/Monitor";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MapIcon from "@mui/icons-material/Map";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useNavigate } from "react-router-dom";

const ACCENT = "var(--secondary-color)";
const DARK = "#0b1f4e";
const ICON_BLUE = "#1d4ed8";
const ICON_LIGHT_BG = "#eaf2ff";
const HERO_BG_IMAGE = "/src/assets/hero.jpeg";

const PARTNERS = [
  { name: "Emirates", country: "UAE", domain: "emirates.com" },
  { name: "Qatar Airways", country: "Qatar", domain: "qatarairways.com" },
  { name: "Singapore Airlines", country: "Singapore", domain: "singaporeair.com" },
  { name: "Turkish Airlines", country: "Turkey", domain: "turkishairlines.com" },
  { name: "Etihad Airways", country: "UAE", domain: "etihad.com" },
  { name: "AirAsia", country: "Malaysia", domain: "airasia.com" },
  { name: "Biman Bangladesh", country: "Bangladesh", domain: "biman-airlines.com" },
  { name: "US-Bangla Airlines", country: "Bangladesh", domain: "us-banglaairlines.com" },
  { name: "Lufthansa", country: "Germany", domain: "lufthansa.com" },
  { name: "Air France", country: "France", domain: "airfrance.com" },
  { name: "KLM", country: "Netherlands", domain: "klm.com" },
  { name: "British Airways", country: "UK", domain: "britishairways.com" },
  { name: "American Airlines", country: "USA", domain: "aa.com" },
  { name: "Delta Air Lines", country: "USA", domain: "delta.com" },
  { name: "United Airlines", country: "USA", domain: "united.com" },
  { name: "Cathay Pacific", country: "Hong Kong", domain: "cathaypacific.com" },
  { name: "Thai Airways", country: "Thailand", domain: "thaiairways.com" },
  { name: "Japan Airlines", country: "Japan", domain: "jal.co.jp" },
  { name: "ANA", country: "Japan", domain: "ana.co.jp" },
  { name: "Qantas", country: "Australia", domain: "qantas.com" },
  { name: "Ryanair", country: "Ireland", domain: "ryanair.com" },
  { name: "easyJet", country: "UK", domain: "easyjet.com" },
  { name: "Wizz Air", country: "Hungary", domain: "wizzair.com" },
  { name: "SWISS", country: "Switzerland", domain: "swiss.com" },
  { name: "Austrian Airlines", country: "Austria", domain: "austrian.com" },
  { name: "Brussels Airlines", country: "Belgium", domain: "brusselsairlines.com" },
  { name: "Finnair", country: "Finland", domain: "finnair.com" },
  { name: "Iberia", country: "Spain", domain: "iberia.com" },
  { name: "Vueling", country: "Spain", domain: "vueling.com" },
  { name: "TAP Air Portugal", country: "Portugal", domain: "flytap.com" },
  { name: "SAS", country: "Sweden", domain: "flysas.com" },
  { name: "LOT Polish Airlines", country: "Poland", domain: "lot.com" },
  { name: "Air Canada", country: "Canada", domain: "aircanada.com" },
  { name: "WestJet", country: "Canada", domain: "westjet.com" },
  { name: "Alaska Airlines", country: "USA", domain: "alaskaair.com" },
  { name: "JetBlue", country: "USA", domain: "jetblue.com" },
  { name: "Southwest", country: "USA", domain: "southwest.com" },
  { name: "Avianca", country: "Colombia", domain: "avianca.com" },
  { name: "LATAM", country: "Chile", domain: "latam.com" },
  { name: "Aerolineas Argentinas", country: "Argentina", domain: "aerolineas.com.ar" },
  { name: "Aeromexico", country: "Mexico", domain: "aeromexico.com" },
  { name: "Saudia", country: "Saudi Arabia", domain: "saudia.com" },
  { name: "Kuwait Airways", country: "Kuwait", domain: "kuwaitairways.com" },
  { name: "Oman Air", country: "Oman", domain: "omanair.com" },
  { name: "Gulf Air", country: "Bahrain", domain: "gulfair.com" },
  { name: "Royal Jordanian", country: "Jordan", domain: "rj.com" },
  { name: "Air India", country: "India", domain: "airindia.com" },
  { name: "IndiGo", country: "India", domain: "goindigo.in" },
  { name: "SpiceJet", country: "India", domain: "spicejet.com" },
  { name: "Malaysia Airlines", country: "Malaysia", domain: "malaysiaairlines.com" },
  { name: "Garuda Indonesia", country: "Indonesia", domain: "garuda-indonesia.com" },
  { name: "Vietnam Airlines", country: "Vietnam", domain: "vietnamairlines.com" },
  { name: "Philippine Airlines", country: "Philippines", domain: "philippineairlines.com" },
  { name: "Korean Air", country: "South Korea", domain: "koreanair.com" },
  { name: "Asiana Airlines", country: "South Korea", domain: "flyasiana.com" },
  { name: "China Airlines", country: "Taiwan", domain: "china-airlines.com" },
  { name: "EVA Air", country: "Taiwan", domain: "evaair.com" },
  { name: "Air New Zealand", country: "New Zealand", domain: "airnewzealand.com" },
  { name: "Fiji Airways", country: "Fiji", domain: "fijiairways.com" },
  { name: "EgyptAir", country: "Egypt", domain: "egyptair.com" },
  { name: "Ethiopian Airlines", country: "Ethiopia", domain: "ethiopianairlines.com" },
  { name: "Kenya Airways", country: "Kenya", domain: "kenya-airways.com" },
  { name: "South African Airways", country: "South Africa", domain: "flysaa.com" },
  { name: "Royal Air Maroc", country: "Morocco", domain: "royalairmaroc.com" },
  { name: "RwandAir", country: "Rwanda", domain: "rwandair.com" },
];

const getPrimaryLogoUrl = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
const getFallbackLogoUrl = (domain) => `https://icons.duckduckgo.com/ip3/${domain}.ico`;
const WHY = [
  { icon: <PublicIcon sx={{ color: ICON_BLUE, fontSize: 27 }} />, title: "Global Inventory,\nLocal Advantage", text: "Access flights, hotels, and travel services worldwide with highly competitive B2B pricing." },
  { icon: <AirplanemodeActiveIcon sx={{ color: ICON_BLUE, fontSize: 27 }} />, title: "Advanced Flight\nTechnology", text: "Seamless integration with Multi GDS, NDC, and LCC ensures maximum coverage and best fares." },
  { icon: <StorageIcon sx={{ color: ICON_BLUE, fontSize: 27 }} />, title: "Reliable & Scalable\nPlatform", text: "Our system handles high-volume bookings with speed, security, and stability." },
  { icon: <HeadsetMicIcon sx={{ color: ICON_BLUE, fontSize: 27 }} />, title: "24/7 Dedicated\nSupport", text: "Our support team is always available to assist your agency anytime." },
  { icon: <PaymentsIcon sx={{ color: ICON_BLUE, fontSize: 27 }} />, title: "Flexible Payment\nSolutions", text: "Multiple payment options including wallet system, bank transfer, and more." },
  { icon: <MonitorIcon sx={{ color: ICON_BLUE, fontSize: 27 }} />, title: "User-Friendly\nInterface", text: "Clean and intuitive booking system that increases daily productivity." },
];

const SOLUTIONS = [
  {
    icon: <FlightIcon sx={{ color: ICON_BLUE }} />,
    title: "Flight Booking\nSystem",
    text: "Real-time access to global airlines through GDS, NDC, and LCC connectivity.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80",
  },
  {
    icon: <HotelIcon sx={{ color: ICON_BLUE }} />,
    title: "Hotel Booking\nEngine",
    text: "Millions of hotels worldwide with dynamic rates and instant confirmation.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80",
  },
  {
    icon: <BeachAccessIcon sx={{ color: ICON_BLUE }} />,
    title: "Holiday\nPackages",
    text: "Ready-made and customizable holiday packages to meet client needs.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
  },
  {
    icon: <DirectionsCarIcon sx={{ color: ICON_BLUE }} />,
    title: "Transfer\nServices",
    text: "Worldwide airport and city transfer options with reliable suppliers.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80",
  },
  {
    icon: <DescriptionOutlinedIcon sx={{ color: ICON_BLUE }} />,
    title: "Visa Assistance\nModule",
    text: "Simplified visa processing support to help serve your customers efficiently.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80",
  },
  {
    icon: <StorageIcon sx={{ color: ICON_BLUE }} />,
    title: "B2B Management\nTools",
    text: "Track dashboard, reports, control, and booking management all in one place.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80",
  },
];

const STEPS = [
  { no: "1", icon: <ManageAccountsIcon sx={{ color: "#fff", fontSize: 19 }} />, title: "Register Your Agency", text: "Sign up and get access to your dedicated B2B dashboard." },
  { no: "2", icon: <SearchIcon sx={{ color: "#fff", fontSize: 19 }} />, title: "Search & Compare", text: "Find best options across flights, hotels, and services in real time." },
  { no: "3", icon: <ShoppingCartCheckoutIcon sx={{ color: "#fff", fontSize: 19 }} />, title: "Book Instantly", text: "Confirm bookings with competitive B2B rates in a few clicks." },
  { no: "4", icon: <TrendingUpIcon sx={{ color: "#fff", fontSize: 19 }} />, title: "Manage & Grow", text: "Track bookings, team, pricing, and scale your business with ease." },
];
const HERO_FEATURES = [
  { icon: <PublicIcon sx={{ color: "#9ecbff", fontSize: 18 }} />, label: "Multi GDS\n+ NDC + LCC\nIntegration" },
  { icon: <FlightIcon sx={{ color: "#9ecbff", fontSize: 18 }} />, label: "Millions of\nGlobal Hotel\nInventory" },
  { icon: <DescriptionOutlinedIcon sx={{ color: "#9ecbff", fontSize: 18 }} />, label: "Best B2B\nNet Rates\nGuaranteed" },
  { icon: <HeadsetMicIcon sx={{ color: "#9ecbff", fontSize: 18 }} />, label: "24/7\nDedicated\nAgent Support" },
];

const HERO_STATS = [
  { value: "900+", label: "Airlines", icon: <AirplanemodeActiveIcon sx={{ fontSize: 21, color: "#2f62ff" }} /> },
  { value: "2M+", label: "Hotels", icon: <ApartmentIcon sx={{ fontSize: 20, color: "#2f62ff" }} /> },
  { value: "150+", label: "Countries", icon: <PublicIcon sx={{ fontSize: 20, color: "#2f62ff" }} /> },
  { value: "24/7", label: "Support", icon: <AccessTimeIcon sx={{ fontSize: 20, color: "#2f62ff" }} /> },
];

export default function HomeLanding() {
  const navigate = useNavigate();
  const [logoLoadFailed, setLogoLoadFailed] = useState({});

  return (
    <Box sx={{ bgcolor: "#f5f7fc" }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 4, md: 2.9 },
          pb: { xs: 5.2, md: 1.9 },
          background: "linear-gradient(102deg, #041a4a 0%, #0a2f72 53%, #0f5db8 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, rgba(3,20,58,0.97) 0%, rgba(3,20,58,0.93) 42%, rgba(3,20,58,0.44) 58%, rgba(0,103,195,0.08) 100%), url('${HERO_BG_IMAGE}')`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
            opacity: 0.95,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.22,
            backgroundImage:
              "radial-gradient(1px 1px at 6% 14%, rgba(255,255,255,0.65) 50%, transparent 50%), radial-gradient(1px 1px at 14% 36%, rgba(255,255,255,0.42) 50%, transparent 50%), radial-gradient(1px 1px at 28% 22%, rgba(255,255,255,0.3) 50%, transparent 50%), radial-gradient(1.1px 1.1px at 36% 48%, rgba(143,190,255,0.52) 50%, transparent 50%)",
          }}
        />
        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={{ xs: 3.2, md: 3.4 }} alignItems="center">
            <Grid item xs={12} md={5.1}>
              <Typography sx={{ color: "#fff", fontWeight: 800, lineHeight: 1.03, fontSize: { xs: 34, sm: 42, md: 52, lg: 58 }, letterSpacing: -0.65, maxWidth: { xs: "100%", md: 470, lg: 500 } }}>
                Powering
                <Box component="span" sx={{ display: "block", color: "#3d95ff", whiteSpace: { xs: "normal", lg: "nowrap" } }}>
                  Travel Businesses
                </Box>
                Worldwide
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.92)", mt: 1.6, fontSize: 15.5, maxWidth: 468, lineHeight: 1.42, fontWeight: 500 }}>
                All-in-one B2B travel booking platform with real-time access to flights, hotels, holidays, transfers, and
                visa services - designed for modern travel agents.
              </Typography>
              {/* <Grid container  >
                {HERO_FEATURES.map((item) => (
                  <Grid item xs={6} md={3} key={item.label}>
                    <Stack
                      direction="column"
                      spacing={0.8}
                      alignItems="center"
                      sx={{ p: 0.25, minHeight: 96, textAlign: "center" }}
                    >
                      <Box sx={{ width: 50, height: 50, borderRadius: "50%", border: "1px solid rgba(92,162,255,0.95)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        {item.icon}
                      </Box>
                      <Typography sx={{ whiteSpace: "pre-line", color: "rgba(255,255,255,0.97)", fontSize: 13, fontWeight: 600, lineHeight: 1.27 }}>
                        {item.label}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid> */}
              <Stack direction="row" spacing={1.3} sx={{ mt: 2.2 }}>
                <Button
                  onClick={() => navigate("/login")}
                  startIcon={<DashboardCustomizeOutlinedIcon sx={{ fontSize: 17 }} />}
                  sx={{
                    textTransform: "none",
                    bgcolor: ACCENT,
                    color: "#fff",
                    borderRadius: 1.3,
                    fontWeight: 700,
                    fontSize: 13,
                    px: 3.2,
                    py: 1,
                    "&:hover": { bgcolor: "var(--secondary-color-hover)" },
                  }}
                >
                  Login to Dashboard
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  startIcon={<PersonAddAlt1OutlinedIcon sx={{ fontSize: 17, color: "#fff" }} />}
                  sx={{
                    textTransform: "none",
                    border: "1px solid rgba(255,255,255,0.45)",
                    color: "#fff",
                    borderRadius: 1.3,
                    fontWeight: 600,
                    fontSize: 14,
                    px: 3.1,
                    py: 1.08,
                    backgroundColor: "transparent",
                  }}
                >
                  Start Selling as an Agent
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6.9}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems="stretch" sx={{ pt: { md: 3.55 },ml: { md: 10 } , width: "100%" }}>
                <Paper sx={{ position: "relative", width: { xs: "100%", md: 500 }, maxWidth: "100%", borderRadius: 2.1, p: 1.5, pt: 1.95, boxShadow: "0 14px 36px rgba(3,9,30,0.46)", overflow: "hidden", bgcolor: "#ffffff" }}>
                  <Box
                    component="img"
                    src="https://pngimg.com/d/airplane_PNG101271.png"
                    alt="Flight"
                    sx={{
                      position: "absolute",
                      top: -130,
                      left: "8%",
                      width: 392,
                      height: 160,
                      objectFit: "contain",
                      display: { xs: "none", md: "block" },
                      filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.25))",
                    }}
                  />
                  <Stack direction="row" spacing={0.8} sx={{ mb: 1.15, flexWrap: "wrap", pb: 0.7, borderBottom: "1px solid #e6ebf5" }}>
                    {["Flights", "Hotels", "Holidays", "Transfers", "Visa"].map((tab, i) => (
                      <Box
                        key={tab}
                        sx={{
                          px: 1.35,
                          py: 0.54,
                          borderRadius: 1,
                          bgcolor: i === 0 ? ACCENT : "transparent",
                          color: i === 0 ? "#fff" : "#4E5F7C",
                          fontWeight: 700,
                          fontSize: 12,
                          border: "none",
                        }}
                      >
                        {tab}
                      </Box>
                    ))}
                  </Stack>
                  <Stack direction="row" spacing={1.7} sx={{ mb: 1.05 }}>
                    {["Round Trip", "One Way", "Multi City"].map((m, i) => (
                      <Stack key={m} direction="row" spacing={0.5} alignItems="center">
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            border: "1.4px solid",
                            borderColor: i === 0 ? ACCENT : "#9aa6ba",
                            bgcolor: i === 0 ? ACCENT : "transparent",
                          }}
                        />
                        <Typography sx={{ fontSize: 11.5, color: i === 0 ? ACCENT : "#7A879C", fontWeight: i === 0 ? 700 : 500 }}>
                          {m}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Box
                    sx={{
                      position: { md: "absolute" },
                      right: { md: 14 },
                      top: { md: 76 },
                    
                      width: { xs: "100%", md: 142 },
                      height: { md: 194 },
                      borderRadius: 1.8,
                      background: "linear-gradient(180deg, #0a357e 0%, #08275f 100%)",
                      color: "#fff",
                      p: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 12px 28px rgba(3,9,30,0.34)",
                      mt: { xs: 1.1, md: 0 },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: 14.8, lineHeight: 1.32 }}>
                        Exclusive B2B
                        <Box component="span" sx={{ display: "block" }}>
                          Net Fares
                        </Box>
                      </Typography>
                      <Typography sx={{ fontSize: 11.7, mt: 1, color: "rgba(255,255,255,0.92)", lineHeight: 1.28, fontWeight: 600 }}>
                        Best Prices for
                        <Box component="span" sx={{ display: "block" }}>
                          your Business
                        </Box>
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", pb: 0.45, position: "relative" }}>
                      <LocalOfferOutlinedIcon sx={{ fontSize: 46, color: "#ffffff", opacity: 0.98, transform: "rotate(90deg) translateX(2px)" }} />
                      <PercentIcon sx={{ fontSize: 15, color: "#ffffff", position: "absolute", top: 13, left: "52%", transform: "translateX(-50%)" }} />
                    </Box>
                  </Box>
                  <Grid container spacing={0.85} sx={{ pr: { md: "150px" }, position: "relative" }}>
                    <Grid item xs={6}><TextField fullWidth size="small" label="From" placeholder="Select City or Airport" /></Grid>
                    <Grid item xs={6}><TextField fullWidth size="small" label="To" placeholder="Select City or Airport" /></Grid>
                    <Box
                      sx={{
                        position: "absolute",
                        left: "50%",
                        top: 24,
                        transform: "translate(-50%, -50%)",
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        border: "1px solid #d9e2f3",
                        bgcolor: "#fff",
                        display: { xs: "none", md: "grid" },
                        placeItems: "center",
                        zIndex: 2,
                      }}
                    >
                      <SwapHorizIcon sx={{ fontSize: 17, color: "#5e6f8d" }} />
                    </Box>
                    <Grid item xs={6}><TextField fullWidth size="small" label="Departure" placeholder="DD/MM/YYYY" /></Grid>
                    <Grid item xs={6}><TextField fullWidth size="small" label="Return" placeholder="DD/MM/YYYY" /></Grid>
                    <Grid item xs={12}><TextField fullWidth size="small" label="Travellers & Class" placeholder="1 Traveler, Economy" /></Grid>
                  </Grid>
                  <Button
                    fullWidth
                    sx={{ mt: 1.1, bgcolor: ACCENT, color: "#fff", textTransform: "none", fontWeight: 700, fontSize: 13.2, py: 0.9, borderRadius: 1.1, width: { md: "calc(100% - 150px)" } }}
                  >
                    Search Flights
                  </Button>
                </Paper>
              </Stack>
              <Paper sx={{ mt: 0.9, width: { xs: "100%", md: 500 },  ml: { md: 10 }, maxWidth: "100%", borderRadius: 1.5, boxShadow: "none", border: "1px solid #dbe6f5", overflow: "hidden", bgcolor: "#ffffff" }}>
                <Grid container>
                  {HERO_STATS.map((stat, index) => (
                    <Grid item xs={3} key={stat.label}>
                      <Box
                        sx={{
                          py: 1,
                          px: 1.2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.9,
                          borderRight: index !== HERO_STATS.length - 1 ? "1px solid #e2e9f6" : "none",
                        }}
                      >
                        <Box sx={{ display: "grid", placeItems: "center" }}>{stat.icon}</Box>
                        <Box>
                          <Typography sx={{ color: DARK, fontWeight: 800, fontSize: 18, lineHeight: 1.06 }}>{stat.value}</Typography>
                          <Typography sx={{ color: "#65748B", fontSize: 11.4, lineHeight: 1.1 }}>{stat.label}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container sx={{ mt: -1.4, position: "relative", zIndex: 3 }}>
        <Paper sx={{ borderRadius: 1, overflow: "hidden", boxShadow: "0 10px 24px rgba(13,30,60,0.12)", height: "80px", display: "flex", alignItems: "center" }}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} sx={{ alignItems: "center", flexWrap: "nowrap", justifyContent: "center", width: "100%", height: "100%" }}>
            <Box sx={{ px: 2, minWidth: 220, flexShrink: 0, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <Typography sx={{ color: "#6A778D", fontSize: 13, fontWeight: 700, textAlign: "center" }}>Connected with Leading Partners</Typography>
            </Box>
            <Box sx={{ px: 2, minHeight: 58, flex: 1, minWidth: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  width: "max-content",
                  flexWrap: "nowrap",
                  "@keyframes partnersMarqueeRtl": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                  },
                  animation: "partnersMarqueeRtl 80s linear infinite",
                }}
              >
                {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
                  <Stack key={`${partner.name}-${idx}`} direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ minWidth: { xs: 170, md: 170 } }}>
                    {!logoLoadFailed[partner.name] ? (
                      <Box
                        component="img"
                        src={getPrimaryLogoUrl(partner.domain)}
                        alt={partner.name}
                        onError={(event) => {
                          if (event.currentTarget.dataset.fallbackApplied !== "true") {
                            event.currentTarget.dataset.fallbackApplied = "true";
                            event.currentTarget.src = getFallbackLogoUrl(partner.domain);
                            return;
                          }
                          setLogoLoadFailed((prev) => ({ ...prev, [partner.name]: true }));
                        }}
                        sx={{ width: 44, height: 22, objectFit: "contain", filter: "contrast(1.06)" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: 1,
                          bgcolor: "#eef3ff",
                          border: "1px solid #d7e3ff",
                          display: "grid",
                          placeItems: "center",
                          color: "#2f62ff",
                          fontSize: 10.5,
                          fontWeight: 800,
                          letterSpacing: 0.2,
                          flexShrink: 0,
                        }}
                      >
                        {partner.name
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()}
                      </Box>
                    )}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography sx={{ color: "#2E4060", fontWeight: 800, fontSize: 12.2, lineHeight: 1.1 }}>
                        {partner.name}
                      </Typography>
                      <Typography sx={{ color: "#6f7f96", fontWeight: 600, fontSize: 10.6, lineHeight: 1.1 }}>
                        {partner.country}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>

      <Container sx={{ py: { xs: 5.2, md: 6 } }}>
        <Typography sx={{ textAlign: "center", color: ACCENT, fontSize: 11.5, fontWeight: 800, letterSpacing: 0.9 }}>
          WHY CHOOSE IONTRIP
        </Typography>
        <Typography sx={{ textAlign: "center", color: "#102457", fontWeight: 800, fontSize: { xs: 25, md: 30 }, lineHeight: 1.1, mt: 0.8, mb: 3.1 }}>
          Built for Travel Professionals Who Want More
        </Typography>
        <Grid container spacing={{ xs: 1.8, md: 1.4 }}>
          {WHY.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={item.title}>
              <Box sx={{ textAlign: "center", px: 0.8, py: 0.45 }}>
                <Box sx={{ width: 68, height: 68, borderRadius: "50%", bgcolor: "#e8edf6", border: "1px solid #d9e2f2", display: "grid", placeItems: "center", mx: "auto", mb: 1.2 }}>
                  {item.icon}
                </Box>
                <Typography sx={{ whiteSpace: "pre-line", color: "#162a57", fontSize: 13.9, fontWeight: 700, lineHeight: 1.33, minHeight: 56 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: "#334a73", fontSize: 13, lineHeight: 1.58, mt: 0.6, maxWidth: 210, mx: "auto" }}>{item.text}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "#fff", py: { xs: 5.3, md: 6 } }}>
        <Container>
          <Typography sx={{ textAlign: "center", color: ACCENT, fontSize: 11.7, fontWeight: 800, letterSpacing: 0.95 }}>
            OUR COMPLETE SOLUTIONS
          </Typography>
          <Typography sx={{ textAlign: "center", color: "#102457", fontWeight: 800, fontSize: { xs: 18, md: 28 }, lineHeight: 1.08, mt: 0.65, mb: 3.2 }}>
            Everything You Need to Run and Grow Your Travel Agency
          </Typography>
          <Grid container spacing={{ xs: 1.8, md: 1.6 }}>
            {SOLUTIONS.map((item) => (
              <Grid item xs={12} sm={6} md={2} key={item.title}>
                <Paper sx={{ borderRadius: 1.35, border: "1px solid #e3ecfb", boxShadow: "none", p: 1.05, height: "100%", minHeight: 302 }}>
                  <Box
                    sx={{
                      borderRadius: 1,
                      height: 92,
                      mb: 1.05,
                      backgroundImage: `linear-gradient(0deg, rgba(236,243,255,0.3), rgba(236,243,255,0.3)), url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <Typography sx={{ whiteSpace: "pre-line", color: "#0f2c66", fontWeight: 800, fontSize: 15, lineHeight: 1, minHeight: 52 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#334a73", fontSize: 11.2, lineHeight: 1.5, mt: 0.6, minHeight: 98 }}>{item.text}</Typography>
                  <Typography sx={{ mt: 0.65, color: ACCENT, fontWeight: 700, fontSize: 12.2 }}>Learn More  →</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 5.5, md: 6.2 } }}>
        <Typography sx={{ textAlign: "center", color: ACCENT, fontSize: 11.5, fontWeight: 800, letterSpacing: 0.75 }}>
          HOW IONTRIP WORKS
        </Typography>
        <Typography sx={{ textAlign: "center", color: DARK, fontWeight: 800, fontSize: { xs: 22, md: 30 }, lineHeight: 1.08, mt: 0.55, mb: 3.5 }}>
          Simple. Fast. Efficient.
        </Typography>
        <Grid container spacing={1.8}>
          {STEPS.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.no}>
              <Paper sx={{ p: 1.4, borderRadius: 1.7, border: "1px solid #E5ECF7", boxShadow: "none", height: "100%" }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 33, height: 33, borderRadius: "50%", bgcolor: ICON_BLUE, display: "grid", placeItems: "center" }}>{item.icon}</Box>
                  <Typography sx={{ color: "#18345F", fontWeight: 700, fontSize: 14 }}>{item.title}</Typography>
                </Stack>
                <Typography sx={{ mt: 0.8, color: "#66758C", fontSize: 12.1, lineHeight: 1.55 }}>{item.text}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Box
          sx={{
            position: "relative",
            py: { xs: 4, md: 4.3 },
            background: "linear-gradient(102deg, #082561 0%, #0e3fa0 40%, #155dca 76%, #1c74da 100%)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(90deg, rgba(6,28,82,0.92) 0%, rgba(8,40,110,0.55) 45%, rgba(12,72,160,0.35) 100%), url('https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1400&q=70')",
              backgroundSize: "cover",
              backgroundPosition: "left center",
              opacity: 0.52,
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(270deg, rgba(6,28,82,0.15) 0%, rgba(6,28,82,0.75) 55%), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=75')",
              backgroundSize: "cover",
              backgroundPosition: "right 20% center",
              opacity: 0.62,
              pointerEvents: "none",
            }}
          />
          <Container sx={{ position: "relative", zIndex: 1 }}>
            <Grid container spacing={{ xs: 3, md: 2 }} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: { xs: 18, md: 26 }, lineHeight: 1.08, letterSpacing: -0.3 }}>
                  Ready to Grow Your
                  <Box component="span" sx={{ display: "block" }}>
                    Travel Business?
                  </Box>
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.9)", mt: 1.35, fontSize: { xs: 13, md: 13 }, lineHeight: 1.55, maxWidth: 400, fontWeight: 400 }}>
                  Join thousands of travel professionals who trust IonTrip to power their bookings and expand their reach globally.
                </Typography>
              </Grid>
              <Grid item xs={12} md={5}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 1.4, md: 2.8 }} sx={{ alignItems: { xs: "flex-start", md: "center" }, justifyContent: "center" }}>
                  <Stack direction="row" spacing={1.1} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        border: "2px solid rgba(120,180,255,0.95)",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        bgcolor: "rgba(255,255,255,0.08)",
                      }}
                    >
                      <AutoAwesomeIcon sx={{ color: "#fff", fontSize: 22 }} />
                    </Box>
                    <Typography sx={{ color: "#fff", fontSize: { xs: 13.5, md: 14.5 }, fontWeight: 500, lineHeight: 1.3, maxWidth: 220 }}>
                      Start selling smarter, faster, and more profitably
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.1} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        border: "2px solid rgba(120,180,255,0.95)",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        bgcolor: "rgba(255,255,255,0.08)",
                      }}
                    >
                      <MapIcon sx={{ color: "#fff", fontSize: 22 }} />
                    </Box>
                    <Typography sx={{ color: "#fff", fontSize: { xs: 13.5, md: 14.5 }, fontWeight: 500, lineHeight: 1.3, maxWidth: 190 }}>
                      All from one powerful platform
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack spacing={1.1} alignItems={{ xs: "stretch", md: "flex-end" }} sx={{ width: { xs: "100%", md: 318 }, maxWidth: { xs: "100%", md: 318 }, ml: { md: "auto" } }}>
                  <Button
                    onClick={() => navigate("/register")}
                    startIcon={<DashboardCustomizeOutlinedIcon sx={{ fontSize: 18, color: "#0d47a1" }} />}
                    sx={{
                      width: "100%",
                      bgcolor: "#fff",
                      color: "#0d47a1",
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: 2,
                      px: 2.5,
                      py: 1.15,
                      fontSize: 14,
                      boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                      "&:hover": { bgcolor: "#f0f4ff" },
                    }}
                  >
                    Login to Dashboard
                  </Button>
                  <Button
                    onClick={() => navigate("/contact")}
                    startIcon={<PersonAddAlt1OutlinedIcon sx={{ fontSize: 20, color: "#fff" }} />}
                    sx={{
                      width: "100%",
                      color: "#fff",
                      border: "1.5px solid rgba(255,255,255,0.85)",
                      textTransform: "none",
                      borderRadius: 2,
                      px: 2.5,
                      py: 1.1,
                      fontSize: 14,
                      fontWeight: 600,
                      bgcolor: "transparent",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                    }}
                  >
                    Start Selling as an Agent
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 0,
            boxShadow: "0 -2px 20px rgba(15,40,90,0.08)",
            borderTop: "1px solid #e8edf5",
            bgcolor: "#fff",
            py: { xs: 1.6, md: 1.85 },
          }}
        >
          <Container>
            <Grid container spacing={0} alignItems="center">
              {[
                { icon: <PersonOutlineIcon sx={{ fontSize: 28, color: "#1d4ed8" }} />, top: "Trusted by", bottom: "Global Travel Agents" },
                { icon: <VerifiedUserIcon sx={{ fontSize: 28, color: "#1d4ed8" }} />, top: "Secure & Reliable", bottom: "Booking Environment" },
                { icon: <AutorenewIcon sx={{ fontSize: 28, color: "#1d4ed8" }} />, top: "Continuous Upgrades", bottom: "& Innovations" },
                { icon: <HeadsetMicIcon sx={{ fontSize: 28, color: "#1d4ed8" }} />, top: "Dedicated Account", bottom: "Management Support" },
              ].map((row, i) => (
                <Grid item xs={12} sm={6} md={3} key={row.bottom}>
                  <Stack
                    direction="row"
                    spacing={1.25}
                    alignItems="center"
                    sx={{
                      py: { xs: 0.5, md: 0 },
                      pl: { md: i === 0 ? 0 : 2 },
                      borderLeft: { md: i === 0 ? "none" : "1px solid #e2e8f4" },
                      justifyContent: { xs: "flex-start", md: "center" },
                    }}
                  >
                    <Box sx={{ flexShrink: 0 }}>{row.icon}</Box>
                    <Box>
                      <Typography sx={{ color: "#334155", fontSize: 12.5, fontWeight: 500, lineHeight: 1.25 }}>{row.top}</Typography>
                      <Typography sx={{ color: "#0f172a", fontSize: 13.5, fontWeight: 800, lineHeight: 1.25 }}>{row.bottom}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Paper>
      </Box>
    </Box>
  );
}
