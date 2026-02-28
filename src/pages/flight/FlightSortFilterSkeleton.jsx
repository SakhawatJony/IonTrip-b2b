import React from "react";
import { Box, Skeleton } from "@mui/material";

const FlightSortFilterSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        border: "1px solid #E5E5E5",
        overflow: "hidden",
        mb: 2,
      }}
    >
      {/* Cheapest Skeleton */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          borderRight: "1px solid #E0E0E0",
        }}
      >
        <Skeleton variant="text" width={70} height={20} />
        <Skeleton variant="text" width={60} height={20} />
      </Box>

      {/* Earliest Skeleton */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderRight: "1px solid #E0E0E0",
        }}
      >
        <Skeleton variant="text" width={70} height={20} />
        <Skeleton variant="text" width={60} height={20} />
      </Box>

      {/* Fastest Skeleton */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <Skeleton variant="text" width={70} height={20} />
        <Skeleton variant="text" width={60} height={20} />
      </Box>
    </Box>
  );
};

export default FlightSortFilterSkeleton;
