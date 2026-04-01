import React, { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import HotelSearchBox from "./HotelSearchBox";
import HotelFilter, { createDefaultHotelFilters } from "./HotelFilter";
import SingleHotel from "./SingleHotel";

/** Demo inventory — replace with API results when wired. */
const MOCK_HOTELS = [
  {
    id: "1",
    name: "After Hours Residence Hotel",
    address: "Road 18 Block A House 12 Banani, Dhaka",
    distanceKm: 7.9,
    rating: 4.5,
    price: "42,000",
    priceAmount: 42000,
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    amenities: [
      { label: "Air Condition", icon: "ac" },
      { label: "WIFI", icon: "wifi" },
      { label: "Breakfast", icon: "breakfast" },
    ],
    amenityIds: ["pool", "gym"],
    locationIds: ["banani"],
    roomTypes: ["Deluxe"],
    fareTypes: ["Breakfast included"],
  },
  {
    id: "2",
    name: "Urban Stay Gulshan",
    address: "Plot 12 North Avenue, Gulshan 2, Dhaka",
    distanceKm: 5.2,
    rating: 4.2,
    price: "28,500",
    priceAmount: 28500,
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    amenities: [
      { label: "Air Condition", icon: "ac" },
      { label: "WIFI", icon: "wifi" },
      { label: "Breakfast", icon: "breakfast" },
    ],
    amenityIds: ["gym", "spa"],
    locationIds: ["gulshan"],
    roomTypes: ["Standard", "Suite"],
    fareTypes: ["Refundable"],
  },
  {
    id: "3",
    name: "Dhanmondi Executive Inn",
    address: "House 45 Road 27 Old Dhanmondi, Dhaka",
    distanceKm: 3.1,
    rating: 3.8,
    price: "19,200",
    priceAmount: 19200,
    imageUrl:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
    amenities: [
      { label: "Air Condition", icon: "ac" },
      { label: "WIFI", icon: "wifi" },
    ],
    amenityIds: ["parking"],
    locationIds: ["dhanmondi"],
    roomTypes: ["Standard"],
    fareTypes: ["Non-refundable"],
  },
];

function hotelPassesFilters(hotel, f) {
  if (hotel.priceAmount < f.priceRange[0] || hotel.priceAmount > f.priceRange[1]) {
    return false;
  }
  if (f.starMin > 0 && Math.round(hotel.rating) < f.starMin) {
    return false;
  }
  if (f.amenities.length > 0) {
    const ok = f.amenities.every((id) => hotel.amenityIds.includes(id));
    if (!ok) return false;
  }
  if (f.locations.length > 0) {
    const ok = f.locations.some((id) => hotel.locationIds.includes(id));
    if (!ok) return false;
  }
  if (f.roomTypes.length > 0) {
    const ok = f.roomTypes.some((rt) => hotel.roomTypes.includes(rt));
    if (!ok) return false;
  }
  if (f.fareTypes.length > 0) {
    const ok = f.fareTypes.some((ft) => hotel.fareTypes.includes(ft));
    if (!ok) return false;
  }
  return true;
}

const HotelSearchResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(createDefaultHotelFilters);

  const initialSearch = useMemo(
    () => ({
      destination: state?.destination ?? "Dhaka",
      checkIn: state?.checkIn ?? dayjs().format("YYYY-MM-DD"),
      checkOut: state?.checkOut ?? dayjs().add(3, "day").format("YYYY-MM-DD"),
      rooms: state?.rooms ?? 1,
      adults: state?.adults ?? 2,
    }),
    [state?.destination, state?.checkIn, state?.checkOut, state?.rooms, state?.adults]
  );

  const destinationLabel = initialSearch.destination || "Dhaka";

  const filteredHotels = useMemo(
    () => MOCK_HOTELS.filter((h) => hotelPassesFilters(h, filters)),
    [filters]
  );

  return (
    <Box
      sx={{
        bgcolor: "#0B0B0B",
        minHeight: "100%",
        width: "100%",
        px: { xs: 2, sm: 3 },
        py: 3,
        boxSizing: "border-box",
      }}
    >
      <HotelSearchBox variant="compact" initialSearch={initialSearch} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "flex-start",
          mt: 3,
        }}
      >
        <HotelFilter filters={filters} onChange={setFilters} />
        <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          <Typography
            sx={{
              color: "#FAFAFA",
              fontWeight: 700,
              fontSize: { xs: 16, md: 18 },
              mb: 2,
            }}
          >
            {filteredHotels.length} hotels in {destinationLabel}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredHotels.length === 0 ? (
              <Typography sx={{ color: "#A3A3A3", fontSize: 15 }}>
                No properties match your filters. Try adjusting price or clearing some options.
              </Typography>
            ) : (
              filteredHotels.map((h) => (
                <SingleHotel
                  key={h.id}
                  hotel={{
                    name: h.name,
                    address: h.address,
                    distanceKm: h.distanceKm,
                    amenities: h.amenities,
                    rating: h.rating,
                    price: h.price,
                    imageUrl: h.imageUrl,
                    onSeeRooms: () => navigate("/dashboard/hotel/bookings"),
                  }}
                />
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HotelSearchResult;
