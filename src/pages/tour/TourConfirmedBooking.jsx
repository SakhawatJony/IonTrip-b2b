import React from "react";
import TourBookingsPage from "./TourBookingsPage";

const TourConfirmedBooking = () => (
  <TourBookingsPage
    title="Tour Confirmed Bookings"
    viewMode="confirmed"
    emptyLabel="No confirmed tour bookings found"
  />
);

export default TourConfirmedBooking;
