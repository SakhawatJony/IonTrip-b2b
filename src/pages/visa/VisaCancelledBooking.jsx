import React from "react";
import VisaBookingsPage from "./VisaBookingsPage";

const VisaCancelledBooking = () => (
  <VisaBookingsPage
    title="Visa Cancelled Bookings"
    viewMode="cancelled"
    emptyLabel="No cancelled visa bookings found"
  />
);

export default VisaCancelledBooking;
