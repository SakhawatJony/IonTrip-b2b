import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";

const MultiCity = () => {
  const [cities, setCities] = useState([
    { from: "Dhaka (DAC)", to: "Dubai (DXB)", travelDate: "WED, 06 Oct 23" },
    { from: "Dhaka (DAC)", to: "Dubai (DXB)", travelDate: "WED, 06 Oct 23" },
  ]);
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

  const handleCityChange = (index, field, value) => {
    setCities((prev) =>
      prev.map((city, i) => (i === index ? { ...city, [field]: value } : city))
    );
  };

  const handleSwap = (index) => {
    setCities((prev) =>
      prev.map((city, i) =>
        i === index ? { ...city, from: city.to, to: city.from } : city
      )
    );
  };

  const handleAddCity = () => {
    setCities((prev) => [
      ...prev,
      { from: "Dhaka (DAC)", to: "Dubai (DXB)", travelDate: "WED, 06 Oct 23" },
    ]);
  };

  const handleRemoveCity = () => {
    setCities((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="stretch">
        {cities.map((city, index) => (
          <React.Fragment key={`${city.from}-${city.to}-${index}`}>
            {/* From and To Fields */}
            <Grid item xs={12} sm={6} md={5}>
              <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, gap: 1.5 }}>
                  <Typography sx={{ ...labelSx, flex: 1 }}>
                    From
                  </Typography>
                  <Box sx={{ width: "20px", display: "flex", justifyContent: "center" }} />
                  <Typography sx={{ ...labelSx, flex: 1 }}>
                    To
                  </Typography>
                </Box>
                <Box
                  sx={inputContainerSx}
                >
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      value={city.from}
                      onChange={(e) =>
                        handleCityChange(index, "from", e.target.value)
                      }
                      variant="outlined"
                      sx={inlineInputSx}
                    />
                  </Box>

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
                    onClick={() => handleSwap(index)}
                  >
                    <SwapHorizIcon
                      sx={{
                        fontSize: 18,
                        color: "#FFFFFF",
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      value={city.to}
                      onChange={(e) =>
                        handleCityChange(index, "to", e.target.value)
                      }
                      variant="outlined"
                      sx={inlineInputSx}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Travel Date Field */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Typography sx={{ ...labelSx, mb: 0.5 }}>
                  Travel Date
                </Typography>
                <TextField
                  fullWidth
                  value={city.travelDate}
                  onChange={(e) =>
                    handleCityChange(index, "travelDate", e.target.value)
                  }
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarTodayIcon sx={{ fontSize: 18, color: "#93A3B8" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={boxedFieldSx}
                />
              </Box>
            </Grid>

            {/* Passenger & Class Field (only on first row) */}
            {index === 0 && (
              <Grid item xs={12} sm={6} md={4}>
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
            )}

            {/* Add/Remove Buttons (only on last row) */}
            {index === cities.length - 1 && (
              <Grid item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      height: "16px",
                      mb: 0.5,
                      visibility: "hidden",
                    }}
                  >
                    Label
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      justifyContent: { xs: "flex-start", md: "flex-end" },
                    }}
                  >
                    <Button
                      onClick={handleRemoveCity}
                      sx={{
                        backgroundColor: "#F44336",
                        color: "#FFFFFF",
                        px: 3,
                        height: "40px",
                        borderRadius: "10px",
                        fontSize: 14,
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#D32F2F",
                        },
                      }}
                    >
                      Remove City
                    </Button>
                    <Button
                      onClick={handleAddCity}
                      sx={{
                        backgroundColor: "#4CAF50",
                        color: "#FFFFFF",
                        px: 3,
                        height: "40px",
                        borderRadius: "10px",
                        fontSize: 14,
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#43A047",
                        },
                      }}
                    >
                      Add City
                    </Button>
                  </Box>
                </Box>
              </Grid>
            )}
            {index !== 0 && index !== cities.length - 1 && (
              <Grid item xs={12} sm={6} md={4} />
            )}
          </React.Fragment>
        ))}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
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

      {/* Search Button */}
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

export default MultiCity;
