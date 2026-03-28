import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import ActivityLog from "../../components/ActivityLog";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production-2d3b.up.railway.app";

const ActivityLogPage = () => {
  const { agentToken, agentData, activityLog: contextActivityLog } = useAuth();
  const agentEmail = agentData?.email || "";

  const [activityLogData, setActivityLogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = agentToken || (typeof window !== "undefined" ? window.localStorage.getItem("agentToken") : "") || "";

    if (!token || !agentEmail) {
      setActivityLogData(Array.isArray(contextActivityLog) ? contextActivityLog : []);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    const params = new URLSearchParams({ email: agentEmail });
    axios
      .get(`${baseUrl}/agent/list?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (cancelled) return;
        const responseData = res?.data?.data ?? res?.data ?? [];
        const firstItem = Array.isArray(responseData) ? responseData[0] : responseData;
        const logs = firstItem?.activityLog ?? [];
        setActivityLogData(Array.isArray(logs) ? logs : []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load activity log.");
        setActivityLogData(Array.isArray(contextActivityLog) ? contextActivityLog : []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [agentToken, agentEmail, contextActivityLog]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "50vh",
          px: { xs: 2, md: 4 },
          py: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "var(--primary-color, #123D6E)" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 4 },
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {error && (
        <Typography sx={{ fontSize: 14, color: "#d32f2f" }}>{error}</Typography>
      )}
      <ActivityLog logs={activityLogData} />
    </Box>
  );
};

export default ActivityLogPage;
