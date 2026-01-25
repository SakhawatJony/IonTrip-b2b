import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import LuggageOutlinedIcon from "@mui/icons-material/LuggageOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import AirlineSeatReclineNormalOutlinedIcon from "@mui/icons-material/AirlineSeatReclineNormalOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";

const defaultFares = [
  {
    id: "economy-value",
    title: "Economy Value | Premium Economy Value",
    subtitle: "Fare Offered by Airline",
    price: "BDT 35,000",
    originalPrice: "BDT 37,000",
    perks: [
      { label: "Cabin 5 KG", icon: WorkOutlineIcon },
      { label: "Check In 5 KG", icon: LuggageOutlinedIcon },
      { label: "Cancellation Fee BDT 20,000", icon: CancelOutlinedIcon },
      { label: "Date Change Fee BDT 20,000", icon: EventRepeatOutlinedIcon },
      { label: "Free Seats Available", icon: AirlineSeatReclineNormalOutlinedIcon },
      { label: "Baggage 25 KG", icon: LuggageOutlinedIcon },
      { label: "Get Complimentary Food", icon: RestaurantOutlinedIcon },
    ],
  },
  {
    id: "economy-value-2",
    title: "Economy Value | Premium Economy Value",
    subtitle: "Fare Offered by Airline",
    price: "BDT 35,000",
    originalPrice: "BDT 37,000",
    perks: [
      { label: "Cabin 5 KG", icon: WorkOutlineIcon },
      { label: "Check In 5 KG", icon: LuggageOutlinedIcon },
      { label: "Cancellation Fee BDT 20,000", icon: CancelOutlinedIcon },
      { label: "Date Change Fee BDT 20,000", icon: EventRepeatOutlinedIcon },
      { label: "Free Seats Available", icon: AirlineSeatReclineNormalOutlinedIcon },
      { label: "Baggage 25 KG", icon: LuggageOutlinedIcon },
      { label: "Get Complimentary Food", icon: RestaurantOutlinedIcon },
    ],
  },
  {
    id: "economy-value-3",
    title: "Economy Value | Premium Economy Value",
    subtitle: "Fare Offered by Airline",
    price: "BDT 35,000",
    originalPrice: "BDT 37,000",
    perks: [
      { label: "Cabin 5 KG", icon: WorkOutlineIcon },
      { label: "Check In 5 KG", icon: LuggageOutlinedIcon },
      { label: "Cancellation Fee BDT 20,000", icon: CancelOutlinedIcon },
      { label: "Date Change Fee BDT 20,000", icon: EventRepeatOutlinedIcon },
      { label: "Free Seats Available", icon: AirlineSeatReclineNormalOutlinedIcon },
      { label: "Baggage 25 KG", icon: LuggageOutlinedIcon },
      { label: "Get Complimentary Food", icon: RestaurantOutlinedIcon },
    ],
  },
  {
    id: "economy-value-4",
    title: "Economy Value | Premium Economy Value",
    subtitle: "Fare Offered by Airline",
    price: "BDT 35,000",
    originalPrice: "BDT 37,000",
    perks: [
      { label: "Cabin 5 KG", icon: WorkOutlineIcon },
      { label: "Check In 5 KG", icon: LuggageOutlinedIcon },
      { label: "Cancellation Fee BDT 20,000", icon: CancelOutlinedIcon },
      { label: "Date Change Fee BDT 20,000", icon: EventRepeatOutlinedIcon },
      { label: "Free Seats Available", icon: AirlineSeatReclineNormalOutlinedIcon },
      { label: "Baggage 25 KG", icon: LuggageOutlinedIcon },
      { label: "Get Complimentary Food", icon: RestaurantOutlinedIcon },
    ],
  },
];

const OnewayBrandedFare = ({ fares = defaultFares }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        mt: 2,
        borderTop: "1px solid #E5E7EB",
        pt: 1.5,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-track": { backgroundColor: "#E5E7EB", borderRadius: 8 },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#9CA3AF", borderRadius: 8 },
        }}
      >
        {fares.map((fare) => (
          <Box
            key={fare.id}
            sx={{
              border: "1px solid #C9CEDA",
              borderRadius: 2,
              backgroundColor: "#FFF7F7",
              px: 2,
              py: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
              minHeight: 360,
              minWidth: 230,
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: "2px solid #2B4D80",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: "2px",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#2B4D80",
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1F2A44" }}>
                  {fare.title}
                </Typography>
                <Typography sx={{ fontSize: 10, color: "#6B7280" }}>
                  {fare.subtitle}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {fare.perks.map((perk) => {
                const Icon = perk.icon;
                return (
                  <Box key={perk.label} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Icon sx={{ fontSize: 16, color: "#344054" }} />
                    <Typography sx={{ fontSize: 11, color: "#4B5563" }}>
                      {perk.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ mt: "auto" }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                  {fare.price}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "#9CA3AF",
                    textDecoration: "line-through",
                  }}
                >
                  {fare.originalPrice}
                </Typography>
              </Box>
              <Button
                fullWidth
                onClick={() => navigate("/dashboard/flightbooking")}
                sx={{
                  mt: 1,
                  textTransform: "none",
                  backgroundColor: "#0F2F56",
                  color: "#fff",
                  fontSize: 11,
                  height: 30,
                  borderRadius: 1,
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#0B2442" },
                }}
              >
                Book Now
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OnewayBrandedFare;
