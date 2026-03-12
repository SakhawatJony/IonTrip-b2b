import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from "@mui/icons-material/Logout";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";

const DashboardNavbar = () => {
  const { agentData, clearAuthSession } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoError, setLogoError] = useState(false);
  const open = Boolean(anchorEl);

  const agentLogoUrl = agentData?.logoUrl || agentData?.logo;
  const agentLogoFullUrl = agentLogoUrl
    ? agentLogoUrl.startsWith("http")
      ? agentLogoUrl
      : `${baseUrl}/${agentLogoUrl.replace(/^\//, "")}`
    : null;

  useEffect(() => {
    setLogoError(false);
  }, [agentLogoFullUrl]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMyProfile = () => {
    handleMenuClose();
    navigate("/dashboard/account");
  };

  const handleLogout = () => {
    handleMenuClose();
    clearAuthSession();
    navigate("/login");
  };

  const supportPhone = "09613001005";
  const supportEmail = "support@iontrip.tech";
  const crmPhone = "+8801332564525";
  const crmEmail = "khaza@iontrip.tech";
  const rewardPoints = agentData?.rewardPoints ?? 5337;
  const tlCoins = agentData?.tlCoins ?? agentData?.walletBalance ?? 156;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 1,
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {/* Left: Support & Reservation | CRM (Khaza) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ fontSize: 10.5, color: "#6B7280", mb: 0.25 }}>Support & Reservation</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PhoneIcon sx={{ fontSize: 13, color: "#374151" }} />
            <Typography sx={{ fontSize: 12, color: "#374151" }}>{supportPhone}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <EmailIcon sx={{ fontSize: 13, color: "#374151" }} />
            <Typography sx={{ fontSize: 12, color: "#374151" }}>{supportEmail}</Typography>
          </Box>
        </Box>
        <Box sx={{ width: "1px", height: 40, bgcolor: "#D1D5DB" }} />
        {/* <Box>
          <Typography sx={{ fontSize: 10.5, color: "#6B7280", mb: 0.25 }}>CRM (Khaza)</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PhoneIcon sx={{ fontSize: 13, color: "#374151" }} />
            <Typography sx={{ fontSize: 12, color: "#374151" }}>{crmPhone}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <EmailIcon sx={{ fontSize: 13, color: "#374151" }} />
            <Typography sx={{ fontSize: 12, color: "#374151" }}>{crmEmail}</Typography>
          </Box>
        </Box> */}
      </Box>

      {/* Right: Reward Points, TL Coins, User Profile */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1,
            borderRadius: "12px",
            border: "1px solid #C4C1E0",
            background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)",
            minWidth: 140,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MonetizationOnIcon sx={{ fontSize: 20, color: "#B45309" }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Reward Points</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>{rewardPoints}</Typography>
          </Box>
        </Box> */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1,
            borderRadius: "12px",
            border: "1px solid #C4C1E0",
            bgcolor: "#F3F4F6",
            minWidth: 160,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: "#fff",
              border: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 20, color: "#6B7280" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>IT Coins</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>
              <span style={{ color: "#059669" }}>+</span> {Number(tlCoins).toFixed(2)}
            </Typography>
          </Box>
          <IconButton size="small" sx={{ "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}>
            <RefreshIcon sx={{ fontSize: 18, color: "#6B7280" }} />
          </IconButton>
        </Box>

        <Box
          onClick={handleProfileClick}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: "12px",
            border: "1px solid #C4C1E0",
            p: 0.75,
            cursor: "pointer",
            "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: agentLogoFullUrl ? "transparent" : "var(--primary-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {agentLogoFullUrl && !logoError ? (
              <Box
                component="img"
                src={agentLogoFullUrl}
                alt="Agent logo"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={() => setLogoError(true)}
              />
            ) : null}
            <Box
              sx={{
                display: agentLogoFullUrl && !logoError ? "none" : "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <PersonIcon sx={{ fontSize: 20, color: "#FFFFFF" }} />
            </Box>
          </Box>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                mt: 1.5,
                minWidth: 180,
                py: 1,
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              },
            },
          }}
        >
          <MenuItem
            onClick={handleMyProfile}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: "8px",
              border: "1px solid #C4C1E0",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              color: "#8B8A9E",
              py: 1.25,
            }}
          >
            <PersonIcon sx={{ fontSize: 20, color: "#8B8A9E" }} />
            <Typography sx={{ fontSize: 14 }}>My Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            sx={{
              mx: 1,
              mb: 1,
              borderRadius: "8px",
              border: "1px solid #C4C1E0",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              color: "#8B8A9E",
              py: 1.25,
            }}
          >
            <LogoutIcon sx={{ fontSize: 20, color: "#8B8A9E" }} />
            <Typography sx={{ fontSize: 14 }}>Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default DashboardNavbar;
