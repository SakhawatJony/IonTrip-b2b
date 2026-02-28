import React from "react";
import { Box, Skeleton, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const DateSelectionBarSkeleton = () => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          backgroundColor: "#FFFFFF",
          borderRadius: 2.5,
          p: 0,
          overflowX: "auto",
          border: "1px solid #E5E5E5",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        <IconButton
          disabled
          sx={{
            color: "#9E9E9E",
            minWidth: 40,
            width: 40,
            height: 40,
            flexShrink: 0,
            opacity: 0.5,
          }}
        >
          <ArrowBackIosIcon sx={{ fontSize: 16 }} />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            gap: 0,
            flex: 1,
            justifyContent: "space-between",
            minWidth: 0,
            alignItems: "stretch",
            position: "relative",
          }}
        >
          {Array.from({ length: 7 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                flex: 1,
                minWidth: 90,
                px: 1.5,
                py: 1.5,
                borderRight: index < 6 ? "1px solid #E0E0E0" : "none",
              }}
            >
              <Skeleton
                variant="text"
                width={80}
                height={14}
                sx={{
                  borderRadius: 0.5,
                }}
              />
              <Skeleton
                variant="text"
                width={60}
                height={14}
                sx={{
                  borderRadius: 0.5,
                }}
              />
            </Box>
          ))}
        </Box>

        <IconButton
          disabled
          sx={{
            color: "#616161",
            minWidth: 40,
            width: 40,
            height: 40,
            flexShrink: 0,
            opacity: 0.5,
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default DateSelectionBarSkeleton;
