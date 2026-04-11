import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WifiIcon from "@mui/icons-material/Wifi";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import { useLocation, useNavigate } from "react-router-dom";

const secondary = "var(--secondary-color, #024DAF)";
const secondarySoft = "rgba(2, 77, 175, 0.10)";

const tabItems = [
  { label: "About the hotel" },
  { label: "Rooms" },
  { label: "Amenities" },
  { label: "Location" },
  { label: "Policies" },
  { label: "Things to know" },
];

function amenityIcon(label) {
  const t = String(label || "").toLowerCase();
  if (t.includes("wifi")) return <WifiIcon sx={{ fontSize: 18, color: secondary }} />;
  if (t.includes("breakfast") || t.includes("morning"))
    return <FreeBreakfastIcon sx={{ fontSize: 18, color: secondary }} />;
  return <AcUnitIcon sx={{ fontSize: 18, color: secondary }} />;
}

function HotelDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const hotel = state?.hotel || null;

  const [tabIndex, setTabIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);

  const roomCards = useMemo(() => {
    const roomTypes = Array.isArray(hotel?.roomTypes) ? hotel.roomTypes : ["Deluxe"];
    const fareTypes = Array.isArray(hotel?.fareTypes) ? hotel.fareTypes : ["Breakfast included"];

    // Placeholder prices derived from hotel.price (string like "42,000")
    const base = Number(String(hotel?.price || "0").replace(/[^\d.]/g, "")) || 0;
    const mkPrice = (mult) => {
      const n = base ? Math.round(base * mult) : 42000;
      return n.toLocaleString("en-US");
    };

    return roomTypes.slice(0, 4).map((rt, idx) => ({
      id: `${rt}-${idx}`,
      name: rt,
      occupancy: idx === 0 ? "1-2 Guests" : "2 Guests",
      cancellation: fareTypes[idx % fareTypes.length] || fareTypes[0],
      price: mkPrice(0.95 + idx * 0.08),
    }));
  }, [hotel]);

  const imageUrls = useMemo(() => {
    const fromGallery =
      hotel && Array.isArray(hotel.imageUrls) ? hotel.imageUrls.filter(Boolean) : null;
    if (fromGallery && fromGallery.length > 0) return fromGallery;
    return hotel?.imageUrl ? [hotel.imageUrl] : [];
  }, [hotel]);

  const tagLabel = useMemo(() => {
    if (!hotel) return "";
    return (
      hotel.tag ||
      (Array.isArray(hotel.fareTypes) && hotel.fareTypes.length > 0 ? hotel.fareTypes[0] : "") ||
      ""
    );
  }, [hotel]);

  useEffect(() => {
    if (!hotel) return;
    if (imageUrls.length <= 1) return;
    if (carouselPaused) return;
    const t = window.setInterval(() => {
      setActiveSlide((i) => (i + 1) % imageUrls.length);
    }, 4500);
    return () => window.clearInterval(t);
  }, [hotel, imageUrls.length, carouselPaused]);

  useEffect(() => {
    // Keep slide index valid when hotel changes.
    setActiveSlide(0);
  }, [hotel?.id]);

  if (!hotel) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#ECECEC", p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} variant="contained" onClick={() => navigate("/dashboard/hotel/search")}>
          Back
        </Button>
        <Typography sx={{ mt: 2, color: "#6B7280" }}>No hotel selected.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ECECEC", px: { xs: 2, md: 4 }, py: 3 }}>
      <Paper sx={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
        {/* Hero */}
        <Box
          sx={{
            height: { xs: 220, md: 280 },
            position: "relative",
            backgroundColor: "#E5E7EB",
          }}
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
        >
          {imageUrls[activeSlide] ? (
            <Box
              component="img"
              src={imageUrls[activeSlide]}
              alt={hotel.name}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : null}

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(2,77,175,0.70) 0%, rgba(2,77,175,0.20) 55%, rgba(0,0,0,0) 100%)",
            }}
          />

          {/* Left/Right carousel buttons */}
          <IconButton
            sx={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 34,
              height: 34,
              bgcolor: "rgba(0,0,0,0.35)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.45)" },
              zIndex: 3,
            }}
            onClick={() =>
              setActiveSlide((i) => (imageUrls.length ? (i - 1 + imageUrls.length) % imageUrls.length : 0))
            }
          >
            <ChevronLeftIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            sx={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 34,
              height: 34,
              bgcolor: "rgba(0,0,0,0.35)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.45)" },
              zIndex: 3,
            }}
            onClick={() => setActiveSlide((i) => (imageUrls.length ? (i + 1) % imageUrls.length : 0))}
          >
            <ChevronRightIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Carousel position dots */}
          {imageUrls.length > 1 ? (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 18,
                display: "flex",
                gap: 0.75,
                zIndex: 4,
                alignItems: "center",
              }}
            >
              {imageUrls.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "999px",
                    bgcolor: idx === activeSlide ? secondary : "rgba(255,255,255,0.55)",
                    transition: "all 180ms ease",
                  }}
                />
              ))}
            </Box>
          ) : null}
        </Box>

        {/* Details heading (white area above tabs) */}
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            py: 1.25,
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 16, md: 20 },
                  fontWeight: 900,
                  color: "#0F172A",
                  lineHeight: 1.1,
                }}
              >
                {hotel.name}
              </Typography>
              <Box sx={{ mt: 0.8, display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                <Rating
                  value={hotel.rating || 4.5}
                  readOnly
                  precision={0.5}
                  size="small"
                  sx={{
                    "& .MuiRating-iconFilled": { color: "#FBBF24" },
                    "& .MuiRating-iconEmpty": { color: "#E5E7EB" },
                  }}
                />
                <Typography sx={{ color: "#6B7280", fontSize: 13, fontWeight: 700 }}>
                  {hotel.rating || 4.5} • Guest rating
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
              {tagLabel ? (
                <Box
                  sx={{
                    borderRadius: "999px",
                    px: 1.35,
                    py: 0.55,
                    border: "1px solid rgba(2, 77, 175, 0.18)",
                    backgroundColor: secondarySoft,
                    color: secondary,
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  {tagLabel}
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ backgroundColor: "#FFFFFF" }}>
          <Tabs
            value={tabIndex}
            onChange={(_, v) => setTabIndex(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: { xs: 1, md: 2 },
              borderBottom: "1px solid #E5E7EB",
              minHeight: 52,
              "& .MuiTabs-indicator": { backgroundColor: secondary, height: 4, borderRadius: 999 },
              "& .MuiTab-root": {
                textTransform: "none",
                minHeight: 44,
                fontSize: 13,
                fontWeight: 800,
                color: "#6B7280",
                "&:hover": { opacity: 0.95 },
              },
              "& .MuiTab-root.Mui-selected": {
                color: secondary,
              },
            }}
          >
            {tabItems.map((t) => (
              <Tab key={t.label} label={t.label} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
          {tabIndex === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                  About the hotel
                </Typography>
                <Typography sx={{ mt: 1.2, color: "#4B5563", fontSize: 13, lineHeight: 1.7 }}>
                  Enjoy a comfortable stay with convenient facilities. This UI is designed to match your requested layout:
                  hero image, tab bar, and content sections with consistent spacing and typography.
                </Typography>

                <Divider sx={{ my: 2.2 }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Rating
                    value={hotel.rating || 4.5}
                    readOnly
                    precision={0.5}
                    sx={{
                      "& .MuiRating-iconFilled": { color: "#FBBF24" },
                      "& .MuiRating-iconEmpty": { color: "#E5E7EB" },
                    }}
                  />
                  <Typography sx={{ color: "#6B7280", fontSize: 13, fontWeight: 600 }}>
                    {hotel.rating || 4.5} • Guest rating
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, borderRadius: 2, border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: secondary }}>
                    KEY HIGHLIGHTS
                  </Typography>
                  <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                    {hotel.amenities?.slice(0, 4).map((a) => (
                      <Box key={a.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircleOutlineIcon sx={{ color: secondary }} fontSize="small" />
                        <Typography sx={{ color: "#374151", fontSize: 13, fontWeight: 600 }}>
                          {a.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}

          {tabIndex === 1 && (
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                Rooms
              </Typography>
              <Typography sx={{ mt: 1, color: "#6B7280", fontSize: 13 }}>
                Choose a room type that fits your travel needs.
              </Typography>

              <Grid container spacing={2.5} sx={{ mt: 2 }}>
                {roomCards.map((r) => (
                  <Grid item xs={12} md={6} key={r.id}>
                    <Box
                      sx={{
                        borderRadius: 2,
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#FFFFFF",
                        overflow: "hidden",
                        display: "flex",
                        gap: 2,
                        p: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src={hotel.imageUrl}
                        alt={r.name}
                        sx={{ width: 110, height: 80, borderRadius: 2, objectFit: "cover" }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>
                          {r.name}
                        </Typography>
                        <Typography sx={{ mt: 0.4, color: "#6B7280", fontSize: 12, fontWeight: 600 }}>
                          {r.occupancy}
                        </Typography>
                        <Typography sx={{ mt: 1, color: "#374151", fontSize: 12, fontWeight: 600 }}>
                          Cancellation: {r.cancellation}
                        </Typography>
                        <Box sx={{ mt: 2, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                          <Typography sx={{ color: secondary, fontSize: 16, fontWeight: 900 }}>
                            {r.price} ৳
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={() => navigate("/dashboard/hotel/bookings")}
                            sx={{
                              bgcolor: secondary,
                              textTransform: "none",
                              fontWeight: 800,
                              borderRadius: 1.5,
                              px: 2,
                              "&:hover": { bgcolor: secondary, opacity: 0.92 },
                            }}
                          >
                            Book
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {tabIndex === 2 && (
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                Amenities
              </Typography>
              <Grid container spacing={2.2} sx={{ mt: 1.5 }}>
                {(hotel.amenities || []).map((a) => (
                  <Grid item xs={12} md={6} key={a.label}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      {amenityIcon(a.label)}
                      <Typography sx={{ color: "#374151", fontSize: 13, fontWeight: 700 }}>
                        {a.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {tabIndex === 3 && (
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                Location
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  height: 260,
                  borderRadius: 2,
                  border: "1px solid #E5E7EB",
                  background:
                    "linear-gradient(135deg, rgba(2,77,175,0.12) 0%, rgba(2,77,175,0.04) 50%, rgba(0,0,0,0) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                <Typography sx={{ color: "#6B7280", fontSize: 13, fontWeight: 700 }}>
                  Map placeholder (wire your map later)
                </Typography>
              </Box>
              <Typography sx={{ mt: 1.5, color: "#374151", fontSize: 13, fontWeight: 600 }}>
                {hotel.address}
              </Typography>
            </Box>
          )}

          {tabIndex === 4 && (
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                Policies
              </Typography>
              <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                {[
                  "Check-in time starts from 2:00 PM.",
                  "Check-out is until 12:00 PM.",
                  "Guests must provide a valid ID at check-in.",
                  "Cancellation policies may apply depending on the rate.",
                ].map((t) => (
                  <Box key={t} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                    <CheckCircleOutlineIcon sx={{ color: secondary, mt: 0.3 }} fontSize="small" />
                    <Typography sx={{ color: "#374151", fontSize: 13, fontWeight: 650 }}>
                      {t}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {tabIndex === 5 && (
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                Things to know
              </Typography>
              <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1.2 }}>
                {[
                  "Most popular facilities are displayed as highlights.",
                  "Room availability and prices depend on your selected dates.",
                  "Special requests are subject to availability.",
                ].map((t) => (
                  <Typography key={t} sx={{ color: "#374151", fontSize: 13, fontWeight: 650, lineHeight: 1.6 }}>
                    - {t}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default HotelDetails;

