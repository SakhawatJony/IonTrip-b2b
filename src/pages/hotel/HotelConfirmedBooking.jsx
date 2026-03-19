import React from "react";
import HotelBookingsPage from "./HotelBookingsPage";

const HotelConfirmedBooking = () => (
  <HotelBookingsPage
    title="Hotel Confirmed Bookings"
    viewMode="confirmed"
    emptyLabel="No confirmed hotel bookings found"
  />
);

export default HotelConfirmedBooking;
