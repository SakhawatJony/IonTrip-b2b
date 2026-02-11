import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";

const OnewayFlightSkeleton = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        p: 2,
        border: "1px solid #E8EAEE",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Grid container spacing={2} alignItems="center" wrap="nowrap">
        <Grid item md={2.8}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Skeleton variant="circular" width={35} height={35} />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Skeleton variant="text" height={18} width="70%" />
              <Skeleton variant="text" height={14} width="55%" />
            </Box>
          </Box>
        </Grid>

        <Grid item md={1.2}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.4 }}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" height={12} width={50} />
          </Box>
        </Grid>

        <Grid item md={1.2}>
          <Skeleton variant="text" height={22} width="70%" />
          <Skeleton variant="text" height={16} width="45%" />
        </Grid>

        <Grid item md={1.4}>
          <Skeleton variant="rectangular" height={10} width="100%" />
        </Grid>

        <Grid item md={1.2}>
          <Skeleton variant="text" height={22} width="70%" />
          <Skeleton variant="text" height={16} width="45%" />
        </Grid>

        <Grid item md={1.1}>
          <Skeleton variant="text" height={16} width="80%" />
          <Skeleton variant="text" height={16} width="65%" />
        </Grid>

        <Grid item md={3.1} sx={{ borderLeft: "1px solid #E6E6E6", pl: 2 }}>
          <Skeleton variant="text" height={22} width="55%" />
          <Skeleton variant="text" height={14} width="60%" />
          <Skeleton variant="text" height={14} width="70%" />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
            <Skeleton variant="rectangular" height={30} width={160} />
            <Skeleton variant="rectangular" height={30} width={100} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OnewayFlightSkeleton;
