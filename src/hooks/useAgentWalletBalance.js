import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useAuth from "./useAuth";

export const getCurrencySymbol = (currencyCode) => {
  const symbols = {
    MYR: "RM",
    BDT: "৳",
    USD: "$",
    GBP: "£",
    INR: "₹",
    PKR: "₨",
    EUR: "€",
  };
  return symbols[currencyCode] || currencyCode || "";
};

export const formatWalletBalance = (amount) => {
  if (amount === null || amount === undefined) return "0.00";
  return parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Fetches agent wallet balance from API; same source as BalanceNoticeBar / navbar.
 */
export function useAgentWalletBalance() {
  const { agentToken, agentData, currency } = useAuth();
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://iontrip-backend-production.up.railway.app";
  const agentEmail = agentData?.email || "";

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBalance = useCallback(async () => {
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

      const balanceData = response?.data?.data || response?.data;
      const balanceAmount =
        balanceData?.balance ??
        balanceData?.amount ??
        balanceData?.walletBalance ??
        0;
      setBalance(balanceAmount);
    } catch (err) {
      console.error("Fetch balance failed:", err?.response?.data || err);
      setError("Failed to load balance");
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, [agentToken, agentEmail, baseUrl]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  /** Shown in UI before/without API: context profile balance */
  const fallbackBalance =
    agentData?.tlCoins ?? agentData?.walletBalance ?? null;

  const displayNumeric =
    balance !== null && balance !== undefined
      ? balance
      : fallbackBalance !== null && fallbackBalance !== undefined
        ? fallbackBalance
        : null;

  return {
    balance,
    loading,
    error,
    refetch: fetchBalance,
    currency,
    displayNumeric,
    currencySymbol: getCurrencySymbol(currency || "MYR"),
  };
}
