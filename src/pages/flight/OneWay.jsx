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

const OneWay = () => {
  const [from, setFrom] = useState("Dhaka (DAC)");
  const [to, setTo] = useState("Dubai (DXB)");
  const [travelDate, setTravelDate] = useState("WED, 06 Oct 23");
  const [returnDate, setReturnDate] = useState("SUN, 06 Oct 23");
  const [passengerClass, setPassengerClass] = useState("1 Passenger & Economy");
  const [directFlight, setDirectFlight] = useState(false);

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
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#666666",
                  lineHeight: 1.2,
                  height: "16px",
                  flex: 1,
                }}
              >
                From
              </Typography>
              <Box sx={{ width: "20px", display: "flex", justifyContent: "center" }} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#666666",
                  lineHeight: 1.2,
                  height: "16px",
                  flex: 1,
                }}
              >
                To
              </Typography>
            </Box>
            {/* Input Container */}
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: 1,
                border: "1px solid rgba(0, 0, 0, 0.1)",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                height: "40px",
                minHeight: "40px",
              }}
            >
              {/* From Input */}
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "transparent",
                      borderRadius: 0,
                      height: "40px",
                      minHeight: "40px",
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
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#333333",
                      py: 0,
                      height: "40px",
                      padding: "0 !important",
                    },
                  }}
                />
              </Box>

              {/* Swap Icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SwapHorizIcon
                  sx={{
                    fontSize: 20,
                    color: "#444444",
                    cursor: "pointer",
                    "&:hover": {
                      color: "#123D6E",
                    },
                  }}
                  onClick={handleSwap}
                />
              </Box>

              {/* To Input */}
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "transparent",
                      borderRadius: 0,
                      height: "40px",
                      minHeight: "40px",
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
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#333333",
                      py: 0,
                      height: "40px",
                      padding: "0 !important",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Travel Date Field */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 500,
                color: "#666666",
                mb: 0.5,
                lineHeight: 1.2,
                height: "16px",
              }}
            >
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
                      sx={{ fontSize: 16, color: "#666666" }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1,
                  height: "40px",
                  minHeight: "40px",
                  "& fieldset": {
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                  },
                  "&:hover fieldset": {
                    border: "1px solid rgba(0, 0, 0, 0.15)",
                  },
                  "&.Mui-focused fieldset": {
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#333333",
                  py: 0,
                  height: "40px",
                },
              }}
            />
          </Box>
        </Grid>

        {/* Return Date Field */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 500,
                color: "#666666",
                mb: 0.5,
                lineHeight: 1.2,
                height: "16px",
              }}
            >
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
                      sx={{ fontSize: 16, color: "#666666" }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1,
                  height: "40px",
                  minHeight: "40px",
                  "& fieldset": {
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                  },
                  "&:hover fieldset": {
                    border: "1px solid rgba(0, 0, 0, 0.15)",
                  },
                  "&.Mui-focused fieldset": {
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#333333",
                  py: 0,
                  height: "40px",
                },
              }}
            />
          </Box>
        </Grid>

        {/* Passenger & Class Field */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 500,
                color: "#666666",
                mb: 0.5,
                lineHeight: 1.2,
                height: "16px",
              }}
            >
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
                    <PersonIcon sx={{ fontSize: 16, color: "#666666" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1,
                  height: "40px",
                  minHeight: "40px",
                  "& fieldset": {
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                  },
                  "&:hover fieldset": {
                    border: "1px solid rgba(0, 0, 0, 0.15)",
                  },
                  "&.Mui-focused fieldset": {
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#333333",
                  py: 0,
                  height: "40px",
                },
              }}
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
          startIcon={<SendIcon />}
          sx={{
            backgroundColor: "#123D6E",
            color: "#fff",
            px: 6,
            height: "48px",
            borderRadius: "999px",
            fontSize: "15px",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0px 8px 20px rgba(18,61,110,0.3)",
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

export default OneWay;