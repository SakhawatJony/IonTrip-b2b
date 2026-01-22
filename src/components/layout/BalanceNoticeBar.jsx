import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import "./checkBalance.css";

const BalanceNoticeBar = () => {
  return (
    <Box
      sx={{
        mx: "80px",
        backgroundColor: "var(--white)",
        borderRadius: "2px",
        px: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
      
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

      {/* ✅ Fixed Check Balance Button */}
      <Button
        disableRipple
        className="check-balance-btn"
        startIcon={<span className="check-balance-icon">৳</span>}
      >
        Check Balance
      </Button>

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
