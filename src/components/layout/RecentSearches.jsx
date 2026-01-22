import React from "react";
import { Box, Typography } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import FlightIcon from "@mui/icons-material/Flight";

const RecentSearches = () => {
  const data = [
    "29 Mar 23 & 31 Mar 23",
    "29 Mar 23",
    "29 Mar 23 & 31 Mar 23",
    "29 Mar 23",
    "29 Mar 23 & 31 Mar 23",
    "29 Mar 23",
  ];

  return (
    <Box
     my={10}
    >
  

      <Box sx={{ display: "flex", gap: 1.5, overflowX: "auto" }}>
        {data.map((date, i) => (
          <Box
            key={i}
            sx={{
              backgroundColor: "#FFF",
              borderRadius: "6px",
              px: 1.8,
              py: 1,
              minWidth: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              whiteSpace: "nowrap",
            }}
          >
            {/* LEFT CONTENT */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1A1A1A",
                  }}
                >
                  DAC
                </Typography>

                {/* SAME ARROW AS IMAGE */}
                <ArrowRightAltIcon
                  sx={{
                    fontSize: 18,
                    color: "#0E5AA7",
                    mt: "1px",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1A1A1A",
                  }}
                >
                  JFK
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: 10.5,
                  color: "#6E6E6E",
                  mt: 0.2,
                }}
              >
                {date}
              </Typography>
            </Box>

            {/* RIGHT PLANE ICON */}
            <FlightIcon
              sx={{
                fontSize: 17,
                color: "#0E5AA7",
                transform: "rotate(45deg)",
                ml: 1,
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecentSearches;
