import React, { useState, useEffect } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import "./checkBalance.css";

const BalanceNoticeBar = () => {
  const { agentToken, agentData, currency } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
  const agentEmail = agentData?.email || "";

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Currency symbol mapping
  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      MYR: "RM",
      BDT: "৳",
      USD: "$",
      GBP: "£",
      INR: "₹",
      PKR: "₨",
      EUR: "€",
    };
    return symbols[currencyCode] || currencyCode;
  };

  const currencySymbol = getCurrencySymbol(currency || "MYR");

  useEffect(() => {
    const fetchBalance = async () => {
      if (!agentToken || !agentEmail) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${baseUrl}/agent/wallet/${encodeURIComponent(agentEmail)}`,
          {
            headers: {
              Authorization: `Bearer ${agentToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Extract balance from response (adjust based on actual API response structure)
        const balanceData = response?.data?.data || response?.data;
        const balanceAmount = balanceData?.balance || balanceData?.amount || balanceData?.walletBalance || 0;
        setBalance(balanceAmount);
      } catch (err) {
        console.error("Fetch balance failed:", err?.response?.data || err);
        setError("Failed to load balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [agentToken, agentEmail, baseUrl]);

  const formatBalance = (amount) => {
    if (amount === null || amount === undefined) return "0.00";
    return parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Box
      sx={{
        mx: "30px",
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
        startIcon={<span style={{ fontSize: "13.8px", color: "var(--primary-color)" }} className="check-balance-icon">{currencySymbol}</span>}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={16} sx={{ color: "inherit", mr: 1 }} />
        ) : (
          <>
            {balance !== null ? `Balance: ${formatBalance(balance)}` : "Check Balance"}
          </>
        )}
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
