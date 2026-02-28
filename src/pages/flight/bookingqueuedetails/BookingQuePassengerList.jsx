import React from "react";
import { Box, Typography } from "@mui/material";

const BookingQuePassengerList = ({ data }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return dateString;
    }
  };

  // Get passenger data from booking data
  const travellers = data?.travellers || [];
  const firstTraveller = travellers[0] || {};

  // Extract passenger information
  const passengerData = {
    title: firstTraveller?.title || firstTraveller?.salutation || "MR",
    firstName: firstTraveller?.firstName || "-",
    lastName: firstTraveller?.lastName || "-",
    pax: firstTraveller?.passengerType || firstTraveller?.type || "Adult",
    dob: formatDate(firstTraveller?.dateOfBirth || firstTraveller?.dob),
    passportNo: firstTraveller?.passportNumber || firstTraveller?.passportNo || "-",
    expireDate: formatDate(firstTraveller?.passportExpiryDate || firstTraveller?.passportExpireDate),
    ticketNo: firstTraveller?.ticketNumber || firstTraveller?.ticketNo || "-",
  };

  // Get baggage information
  const segments = data?.segments || [];
  const baggageData = [];

  // Extract routes and baggage info
  if (segments.length > 0) {
    segments.forEach((segment) => {
      const departure = segment?.departureAirport || segment?.from || "";
      const arrival = segment?.arrivalAirport || segment?.to || "";
      const route = departure && arrival ? `${departure}-${arrival}` : "-";
      
      baggageData.push({
        route,
        cabinBag: segment?.cabinBaggage || segment?.cabinBag || "7KG",
        checkinBag: segment?.checkinBaggage || segment?.checkinBag || segment?.baggage || "25 KG",
      });
    });
  }

  // Default baggage if no segments
  if (baggageData.length === 0) {
    const goDeparture = data?.godeparture || "";
    const goArrival = data?.goarrival || "";
    const backDeparture = data?.backdeparture || "";
    const backArrival = data?.backarrival || "";

    if (goDeparture && goArrival) {
      baggageData.push({
        route: `${goDeparture}-${goArrival}`,
        cabinBag: "7KG",
        checkinBag: "25 KG",
      });
    }
    if (backDeparture && backArrival) {
      baggageData.push({
        route: `${backArrival}-${backDeparture}`,
        cabinBag: "7KG",
        checkinBag: "25 KG",
      });
    }
  }

  const passengerFields = [
    { label: "Title", value: passengerData.title },
    { label: "First Name", value: passengerData.firstName },
    { label: "Last Name", value: passengerData.lastName },
    { label: "PAX", value: passengerData.pax },
    { label: "Date of Birth", value: passengerData.dob },
    { label: "Passport No", value: passengerData.passportNo },
    { label: "Expire Date", value: passengerData.expireDate },
    { label: "Ticket No", value: passengerData.ticketNo },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#EAF2FF",
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        p: 2.5,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 0,
        overflow: "hidden",
      }}
    >
      {/* Passenger Details Section */}
      <Box
        sx={{
          flex: 1,
          px: 2.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          borderRight: { xs: "none", md: "1px solid #000000" },
          borderBottom: { xs: "1px solid #000000", md: "none" },
        }}
      >
        {passengerFields.map((field) => (
          <Box key={field.label} sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 500,
                color: "#64748B",
              }}
            >
              {field.label}
            </Typography>
            <Typography
              sx={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#0F2F56",
              }}
            >
              {field.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Baggage Allowance Section */}
      <Box
        sx={{
          flex: 1,
          px: 2.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              color: "#64748B",
            }}
          >
            Route
          </Typography>
          {baggageData.length > 0 ? (
            baggageData.map((bag, index) => (
              <Typography
                key={index}
                sx={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#0F2F56",
                }}
              >
                {bag.route}
              </Typography>
            ))
          ) : (
            <Typography
              sx={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#0F2F56",
              }}
            >
              -
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              color: "#64748B",
            }}
          >
            Cabin Bag
          </Typography>
          {baggageData.length > 0 ? (
            baggageData.map((bag, index) => (
              <Typography
                key={index}
                sx={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#0F2F56",
                }}
              >
                {bag.cabinBag}
              </Typography>
            ))
          ) : (
            <Typography
              sx={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#0F2F56",
              }}
            >
              -
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              color: "#64748B",
            }}
          >
            Checkin Bag
          </Typography>
          {baggageData.length > 0 ? (
            baggageData.map((bag, index) => (
              <Typography
                key={index}
                sx={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#0F2F56",
                }}
              >
                {bag.checkinBag}
              </Typography>
            ))
          ) : (
            <Typography
              sx={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#0F2F56",
              }}
            >
              -
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BookingQuePassengerList;
