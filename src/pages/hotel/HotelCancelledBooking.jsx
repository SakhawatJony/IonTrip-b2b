import React from "react";
import HotelBookingsPage from "./HotelBookingsPage";

const HotelCancelledBooking = () => (
  <HotelBookingsPage
    title="Hotel Cancelled Bookings"
    viewMode="cancelled"
    emptyLabel="No cancelled hotel bookings found"
  />
);

export default HotelCancelledBooking;
