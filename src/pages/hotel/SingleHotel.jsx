import React from "react";
import { Box, Button, Typography, Rating } from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WifiIcon from "@mui/icons-material/Wifi";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";

const LINK_BLUE = "var(--secondary-color, #024DAF)";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#6B7280";

/**
 * Single hotel card for search results — image | details | price & CTA.
 */
const SingleHotel = ({ hotel }) => {
  const {
    name,
    address,
    distanceKm,
    amenities = [],
    rating = 4.5,
    price,
    imageUrl,
    onSeeRooms,
  } = hotel;

  const iconFor = (key) => {
    const k = String(key || "").toLowerCase();
    if (k.includes("wifi")) return <WifiIcon sx={{ fontSize: 18, color: "#9CA3AF" }} />;
    if (k.includes("breakfast") || k.includes("morning")) return <FreeBreakfastIcon sx={{ fontSize: 18, color: "#9CA3AF" }} />;
    return <AcUnitIcon sx={{ fontSize: 18, color: "#9CA3AF" }} />;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        bgcolor: "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        overflow: "hidden",
        border: "1px solid #E5E7EB",
        gap: { xs: 2, md: 0 },
        p: { xs: 2, md: 2.5 },
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt={name}
        sx={{
          width: { xs: "100%", md: 170 },
          minWidth: { md: 170 },
          height: { xs: 130, md: 130 },
          objectFit: "cover",
          borderRadius: "10px",
          flexShrink: 0,
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0, px: { md: 1 }, display: "flex", flexDirection: "column" }}>
        <Typography
          sx={{ fontSize: { xs: 16, md: 18 } }}
          component="h3"
          fontWeight={700}
          color={"#222222"}
        >
          {name}
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: 12, color: LINK_BLUE, fontWeight: 500, lineHeight: 1.35 }}>
          {address}
          <Button
            component="span"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            sx={{
              ml: 0.5,
              p: 0,
              minWidth: 0,
              textTransform: "none",
              fontSize: 12,
              fontWeight: 600,
              color: LINK_BLUE,
              "&:hover": { backgroundColor: "transparent", textDecoration: "underline" },
            }}
          >
            • Show on the map
          </Button>
        </Typography>

        <Typography sx={{ mt: 0.5, fontSize: 12, color: "#9CA3AF" }}>
          {distanceKm} km from the city center
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1, alignItems: "center" }}>
          {amenities.slice(0, 5).map((a) => (
            <Box key={a.label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              {iconFor(a.icon || a.label)}
              <Typography sx={{ fontSize: 12, color: TEXT_MUTED }}>{a.label}</Typography>
            </Box>
          ))}
        </Box>

        <Rating
          value={rating}
          precision={0.2}
          readOnly
          sx={{
            mt: 1.0,
            "& .MuiRating-iconFilled": { color: "#FBBF24" },
            "& .MuiRating-iconEmpty": { color: "#E5E7EB" },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "stretch", md: "flex-end" },
          justifyContent: "space-between",
          minWidth: { md: 160 },
          gap: 2,
          pt: { xs: 1, md: 0 },
          borderTop: { xs: "1px solid #F3F4F6", md: "none" },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 16, md: 20 },
            fontWeight: 600,
            color: TEXT_DARK,
            alignSelf: { md: "flex-end" },
          }}
        >
          {price}
          <Box component="span" sx={{ fontSize: "0.85em", fontWeight: 700, ml: 0.25 }}>
            ৳
          </Box>
        </Typography>
        <Button
          variant="contained"
          onClick={onSeeRooms}
          sx={{
            bgcolor: LINK_BLUE,
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            px: 2,
            py: 1,
            borderRadius: "5px",
            boxShadow: "none",
            "&:hover": { bgcolor: LINK_BLUE, opacity: 0.92, boxShadow: "none" },
          }}
        >
          See all Rooms
        </Button>
      </Box>
    </Box>
  );
};

export default SingleHotel;
