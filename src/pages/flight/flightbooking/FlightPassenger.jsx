import React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const titleButtonSx = (active) => ({
  textTransform: "none",
  minWidth: 54,
  height: 30,
  borderRadius: 1,
  fontSize: 12,
  fontWeight: 600,
  border: active ? "1px solid #0F2F56" : "1px solid #E5E7EB",
  backgroundColor: active ? "#0F2F56" : "#FFFFFF",
  color: active ? "#FFFFFF" : "#111827",
  "&:hover": {
    backgroundColor: active ? "#0B2442" : "#F8FAFC",
  },
});

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 38,
    backgroundColor: "#FFFFFF",
  },
  "& .MuiOutlinedInput-input": {
    padding: "8px 12px",
    fontSize: 12,
  },
};

const searchFieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 30,
    backgroundColor: "#FFFFFF",
  },
  "& .MuiOutlinedInput-input": {
    padding: "5px 10px",
    fontSize: 12,
  },
};

const FlightPassenger = ({ index, type }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: 30,
          mb: 1,
        }}
      >
        <Typography
          fontSize={13}
          fontWeight={600}
          color="#111827"
          sx={{ lineHeight: 1 }}
        >
          Passenger #{index}, {type}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button sx={titleButtonSx(true)}>Mr</Button>
          <Button sx={titleButtonSx(false)}>Mrs</Button>
          <Button sx={titleButtonSx(false)}>Miss</Button>
        </Box>
        <TextField
          placeholder="Search By"
          size="small"
          sx={{ ...searchFieldSx, width: 220 }}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            placeholder="First Name"
            size="small"
            fullWidth
            sx={fieldSx}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            placeholder="Last Name"
            size="small"
            fullWidth
            sx={fieldSx}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            placeholder="Gender"
            size="small"
            fullWidth
            sx={fieldSx}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            placeholder="Date of Birth"
            size="small"
            fullWidth
            sx={fieldSx}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            placeholder="Nationality"
            size="small"
            fullWidth
            sx={fieldSx}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            placeholder="Passport Number"
            size="small"
            fullWidth
            sx={fieldSx}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            placeholder="Passport Expiry"
            size="small"
            fullWidth
            sx={fieldSx}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FlightPassenger;
