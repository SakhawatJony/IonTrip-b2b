import React from "react";
import { Box, Typography } from "@mui/material";

const columns = [
  "Title",
  "First Name",
  "Last Name",
  "PAX",
  "Gender",
  "Date of Birth",
  "Passport No",
  "Expire Date",
  "Passport Copy",
  "Visa Copy",
];

const rows = [
  {
    id: 1,
    title: "Mr",
    firstName: "John",
    lastName: "Doe",
    pax: "Adult",
    gender: "Male",
    dob: "12 Jan 1990",
    passportNo: "A1234567",
    expireDate: "12 Jan 2030",
    passportCopy: "Uploaded",
    visaCopy: "Uploaded",
  },
  {
    id: 2,
    title: "Mrs",
    firstName: "Sara",
    lastName: "Khan",
    pax: "Adult",
    gender: "Female",
    dob: "25 Apr 1992",
    passportNo: "B7654321",
    expireDate: "25 Apr 2031",
    passportCopy: "Pending",
    visaCopy: "Pending",
  },
  {
    id: 3,
    title: "Miss",
    firstName: "Lina",
    lastName: "Rahman",
    pax: "Child",
    gender: "Female",
    dob: "06 Aug 2016",
    passportNo: "C9081726",
    expireDate: "06 Aug 2028",
    passportCopy: "Uploaded",
    visaCopy: "Pending",
  },
];

const gridTemplate =
  "0.6fr 1fr 1fr 0.6fr 0.8fr 1fr 1fr 1fr 1fr 1fr";

const cellSx = {
  fontSize: 11,
  color: "#6B7280",
};

const BookingQuePassengerList = () => {
  return (
    <Box
      sx={{
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        overflowX: "auto",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: gridTemplate,
          px: 2,
          py: 1,
          borderBottom: "1px solid #E5E7EB",
          minWidth: 900,
        }}
      >
        {columns.map((col) => (
          <Typography
            key={col}
            fontSize={11}
            fontWeight={600}
            color="#111827"
          >
            {col}
          </Typography>
        ))}
      </Box>

      {rows.map((row) => (
        <Box
          key={row.id}
          sx={{
            display: "grid",
            gridTemplateColumns: gridTemplate,
            px: 2,
            py: 1.2,
            borderBottom: "1px solid #E5E7EB",
            minWidth: 900,
          }}
        >
          <Typography sx={cellSx}>{row.title}</Typography>
          <Typography sx={cellSx}>{row.firstName}</Typography>
          <Typography sx={cellSx}>{row.lastName}</Typography>
          <Typography sx={cellSx}>{row.pax}</Typography>
          <Typography sx={cellSx}>{row.gender}</Typography>
          <Typography sx={cellSx}>{row.dob}</Typography>
          <Typography sx={cellSx}>{row.passportNo}</Typography>
          <Typography sx={cellSx}>{row.expireDate}</Typography>
          <Typography sx={cellSx}>{row.passportCopy}</Typography>
          <Typography sx={cellSx}>{row.visaCopy}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default BookingQuePassengerList;
