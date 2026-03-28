import React from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import {
  useAgentWalletBalance,
  formatWalletBalance,
} from "../../hooks/useAgentWalletBalance";
import "./checkBalance.css";

const BalanceNoticeBar = () => {
  const {
    balance,
    loading,
    error,
    refetch,
    currencySymbol,
  } = useAgentWalletBalance();

  return (
    <Box
      sx={{
        mx: "15px",
        mb: 5,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "2px",
        px: 4,
        py: 1,
        display: "flex",
        alignItems: "center",
        mx: "60px",
        gap: 2,
      }}
    >
      {/* Info Icon */}
      <ErrorIcon
        sx={{ color: "var(--primary-color)", fontSize: 20, flexShrink: 0 }}
      />

      {/* Marquee Text */}
      <Box
        sx={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          flexGrow: 1,
        }}
      >
        <Typography
          sx={{
            display: "inline-block",
            fontSize: "14px",
            color: "var(--marku)",
            lineHeight: 1.6,
            animation: "marquee 18s linear infinite",
          }}
        >
          প্রিয় ট্রেড পার্টনার, আমাদের সাথে হোয়াটসঅ্যাপ এ যোগাযোগ করতে উপরে থাকা
          হোয়াটসঅ্যাপ বাটনটিতে ক্লিক করুন, অথবা +৮৮০ ১৭৫৫ ৫৭২ ০৯৮ এবং +৮৮০ ১৭৫৫ ৫৭২
        </Typography>
      </Box>



      {/* Marquee Animation */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </Box>
  );
};

export default BalanceNoticeBar;
