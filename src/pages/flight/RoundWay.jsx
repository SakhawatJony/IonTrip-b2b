import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  InputAdornment,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";

const RoundWay = () => {
  const [from, setFrom] = useState("Dhaka (DAC)");
  const [to, setTo] = useState("Dubai (DXB)");
  const [travelDate, setTravelDate] = useState("WED, 06 Oct 23");
  const [returnDate, setReturnDate] = useState("SUN, 06 Oct 23");
  const [passengerClass, setPassengerClass] = useState("1 Passenger & Economy");
  const [directFlight, setDirectFlight] = useState(false);

  const labelSx = {
    fontSize: 12,
    fontWeight: 600,
    color: "#1F4D8B",
    lineHeight: 1.2,
    height: "16px",
  };

  const inputContainerSx = {
    backgroundColor: "#F6F8FB",
    borderRadius: 1.5,
    border: "1px solid #E6EDF5",
    px: 1.5,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    height: "46px",
    minHeight: "46px",
  };

  const inlineInputSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "transparent",
      borderRadius: 0,
      height: "46px",
      minHeight: "46px",
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: "none",
      },
    },
    "& .MuiInputBase-input": {
      fontSize: 15,
      fontWeight: 600,
      color: "#1F2A44",
      py: 0,
      height: "46px",
      padding: "0 !important",
    },
  };

  const boxedFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#F6F8FB",
      borderRadius: 1.5,
      height: "46px",
      minHeight: "46px",
      "& fieldset": {
        border: "1px solid #E6EDF5",
      },
      "&:hover fieldset": {
        border: "1px solid #D7E0EC",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #C7D3E3",
      },
    },
    "& .MuiInputBase-input": {
      fontSize: 15,
      fontWeight: 600,
      color: "#1F2A44",
      py: 0,
      height: "46px",
    },
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <Box>
      {/* Top Section - Input Fields */}
      <Grid container spacing={2} alignItems="stretch">
        {/* From and To Fields in One Container */}
        <Grid item xs={12} sm={6} md={4.8}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Labels Row */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, gap: 1.5 }}>
              <Typography sx={{ ...labelSx, flex: 1 }}>
                From
              </Typography>
              <Box sx={{ width: "20px", display: "flex", justifyContent: "center" }} />
              <Typography sx={{ ...labelSx, flex: 1 }}>
                To
              </Typography>
            </Box>
            {/* Input Container */}
            <Box
              sx={inputContainerSx}
            >
              {/* From Input */}
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  variant="outlined"
                  sx={inlineInputSx}
                />
              </Box>

              {/* Swap Icon */}
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1,
                  backgroundColor: "#1F4D8B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#163B6A",
                  },
                }}
                onClick={handleSwap}
              >
                <SwapHorizIcon
                  sx={{
                    fontSize: 18,
                    color: "#FFFFFF",
                  }}
                />
              </Box>

              {/* To Input */}
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  variant="outlined"
                  sx={inlineInputSx}
                />
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Travel Date Field */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography sx={{ ...labelSx, mb: 0.5 }}>
              Travel Date
            </Typography>
            <TextField
              fullWidth
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarTodayIcon
                      sx={{ fontSize: 18, color: "#93A3B8" }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={boxedFieldSx}
            />
          </Box>
        </Grid>

        {/* Return Date Field */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography sx={{ ...labelSx, mb: 0.5 }}>
              Return Date
            </Typography>
            <TextField
              fullWidth
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarTodayIcon
                      sx={{ fontSize: 18, color: "#93A3B8" }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={boxedFieldSx}
            />
          </Box>
        </Grid>

        {/* Passenger & Class Field */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography sx={{ ...labelSx, mb: 0.5 }}>
              Passenger & Class
            </Typography>
            <TextField
              fullWidth
              value={passengerClass}
              onChange={(e) => setPassengerClass(e.target.value)}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PersonIcon sx={{ fontSize: 18, color: "#93A3B8" }} />
                  </InputAdornment>
                ),
              }}
              sx={boxedFieldSx}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Options Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          width: "100%",
          gap: 2,
          mt: 3,
          mb: 4,
        }}
      >
        {/* Left Side: Direct Flight and Student Fare */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          {/* Direct Flight Checkbox */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={directFlight}
              onChange={(e) => setDirectFlight(e.target.checked)}
              sx={{
                color: "#9E9E9E",
                "&.Mui-checked": {
                  color: "#123D6E",
                },
                p: 0.5,
              }}
            />
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 400,
                color: "#444444",
              }}
            >
              Direct Flight
            </Typography>
          </Box>

          {/* Student Fare Dropdown */}
          <FormControl
            variant="standard"
            sx={{
              minWidth: 120,
              "& .MuiInput-underline:before": {
                borderBottom: "none",
              },
              "& .MuiInput-underline:hover:before": {
                borderBottom: "none",
              },
              "& .MuiInput-underline:after": {
                borderBottom: "none",
              },
            }}
          >
            <Select
              value=""
              displayEmpty
              sx={{
                fontSize: 14,
                fontWeight: 400,
                color: "#444444",
                "& .MuiSelect-icon": {
                  color: "#444444",
                },
                "&:before": {
                  borderBottom: "none",
                },
                "&:after": {
                  borderBottom: "none",
                },
              }}
            >
              <MenuItem value="">
                <Typography sx={{ fontSize: 14, color: "#444444" }}>
                  Student Fare
                </Typography>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Right Side: Preferred Airlines */}
        <FormControl
          variant="standard"
          sx={{
            minWidth: 150,
            "& .MuiInput-underline:before": {
              borderBottom: "none",
            },
            "& .MuiInput-underline:hover:before": {
              borderBottom: "none",
            },
            "& .MuiInput-underline:after": {
              borderBottom: "none",
            },
          }}
        >
          <Select
            value=""
            displayEmpty
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: "#444444",
              "& .MuiSelect-icon": {
                color: "#444444",
              },
              "&:before": {
                borderBottom: "none",
              },
              "&:after": {
                borderBottom: "none",
              },
            }}
          >
            <MenuItem value="">
              <Typography sx={{ fontSize: 14, color: "#444444" }}>
                Preferred Airlines
              </Typography>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Search Button - Centered at Bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: "-24px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Button
          startIcon={<SendIcon sx={{ fontSize: 18 }} />}
          sx={{
            backgroundColor: "#123D6E",
            color: "#fff",
            px: 4.5,
            height: "42px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0px 6px 16px rgba(18,61,110,0.25)",
            "&:hover": {
              backgroundColor: "#0f2f56",
            },
          }}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
};

export default RoundWay;