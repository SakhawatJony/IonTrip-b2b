import React from "react";
import { Box, Divider, Skeleton } from "@mui/material";

const OnewayFilterSkeleton = () => {
  const line = (width = "80%") => <Skeleton variant="text" height={16} width={width} />;

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        p: 2,
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Skeleton variant="text" height={22} width={70} />
        <Skeleton variant="text" height={18} width={50} />
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Skeleton variant="text" height={18} width={80} />
      {line()}
      {line("70%")}
      {line("75%")}

      <Divider sx={{ my: 2 }} />

      <Skeleton variant="text" height={18} width={90} />
      {line()}
      {line("70%")}
      {line("65%")}
      {line("75%")}

      <Divider sx={{ my: 2 }} />

      <Skeleton variant="text" height={18} width={140} />
      {line()}
      {line("70%")}
      {line("75%")}
      {line("68%")}

      <Divider sx={{ my: 2 }} />

      <Skeleton variant="text" height={18} width={140} />
      {line()}
      {line("70%")}
      {line("75%")}
      {line("68%")}
    </Box>
  );
};

export default OnewayFilterSkeleton;
