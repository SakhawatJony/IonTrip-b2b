import React from "react";
import VisaBookingsPage from "./VisaBookingsPage";

const VisaConfirmedBooking = () => (
  <VisaBookingsPage
    title="Visa Confirmed Bookings"
    viewMode="confirmed"
    emptyLabel="No confirmed visa bookings found"
  />
);

export default VisaConfirmedBooking;
