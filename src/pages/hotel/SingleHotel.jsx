import React from "react";
import { Box, Button, Typography, Rating } from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WifiIcon from "@mui/icons-material/Wifi";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";

const LINK_BLUE = "var(--secondary-color, #024DAF)";

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
        border: "1px solid rgba(255,255,255,0.06)",
        gap: { xs: 2, md: 0 },
        p: { xs: 2, md: 2.5 },
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt={name}
        sx={{
          width: { xs: "100%", md: 240 },
          minWidth: { md: 240 },
          height: { xs: 200, md: 170 },
          objectFit: "cover",
          borderRadius: "10px",
          flexShrink: 0,
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0, px: { md: 1 } }}>
        <Typography sx={{ fontSize: { xs: 18, md: 20 } }} component="h3" fontWeight={700} color="#111827">
          {name}
        </Typography>
        <Typography sx={{ mt: 0.75, fontSize: 14, color: LINK_BLUE, fontWeight: 500, lineHeight: 1.4 }}>
          {address}
        </Typography>
        <Button
          type="button"
          size="small"
          onClick={(e) => e.preventDefault()}
          sx={{
            mt: 0.25,
            p: 0,
            minWidth: 0,
            textTransform: "none",
            fontSize: 13,
            fontWeight: 600,
            color: LINK_BLUE,
            "&:hover": { backgroundColor: "transparent", textDecoration: "underline" },
          }}
        >
          Show on the map
        </Button>
        <Typography sx={{ mt: 0.75, fontSize: 12, color: "#9CA3AF" }}>
          {distanceKm} km from the city center
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1.5, alignItems: "center" }}>
          {amenities.slice(0, 5).map((a) => (
            <Box key={a.label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              {iconFor(a.icon || a.label)}
              <Typography sx={{ fontSize: 12, color: "#6B7280" }}>{a.label}</Typography>
            </Box>
          ))}
        </Box>

        <Rating
          value={rating}
          precision={0.5}
          readOnly
          sx={{
            mt: 1.25,
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
        <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 800, color: "#111827", alignSelf: { md: "flex-end" } }}>
          {price}
          <Box component="span" sx={{ fontSize: "0.85em", fontWeight: 700, ml: 0.25 }}>
            ৳
          </Box>
        </Typography>
        <Button
          variant="contained"
          onClick={onSeeRooms}
          sx={{
            bgcolor: "var(--primary-color, #123D6E)",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            py: 1.1,
            borderRadius: "8px",
            boxShadow: "none",
            "&:hover": { bgcolor: "var(--primary-dark, #0F2F56)", boxShadow: "none" },
          }}
        >
          See all Rooms
        </Button>
      </Box>
    </Box>
  );
};

export default SingleHotel;
