import React from "react";
import TourBookingsPage from "./TourBookingsPage";

const TourCancelledBooking = () => (
  <TourBookingsPage
    title="Tour Cancelled Bookings"
    viewMode="cancelled"
    emptyLabel="No cancelled tour bookings found"
  />
);

export default TourCancelledBooking;
