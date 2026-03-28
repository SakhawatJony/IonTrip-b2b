import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Select,
  FormControl,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import useAuth from "../../hooks/useAuth";
import {
  useAgentWalletBalance,
  formatWalletBalance,
} from "../../hooks/useAgentWalletBalance";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production-2d3b.up.railway.app";

const CURRENCIES = ["MYR", "USD", "BDT", "EUR", "GBP"];

const DashboardNavbar = () => {
  const { agentData, currency, setCurrency, clearAuthSession } = useAuth();
  const {
    balance: walletApiBalance,
    loading: walletLoading,
    refetch: refetchWallet,
    displayNumeric,
    currencySymbol,
  } = useAgentWalletBalance();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [logoError, setLogoError] = useState(false);
  const [balanceAnchorEl, setBalanceAnchorEl] = useState(null);

  const agentLogoUrl = agentData?.logoUrl || agentData?.logo;
  const agentLogoFullUrl = agentLogoUrl
    ? agentLogoUrl.startsWith("http")
      ? agentLogoUrl
      : `${baseUrl}/${agentLogoUrl.replace(/^\//, "")}`
    : null;

  const balanceLine =
    displayNumeric !== null && displayNumeric !== undefined
      ? `${currencySymbol} ${formatWalletBalance(displayNumeric)}`
      : walletLoading
        ? null
        : "--";

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchValue?.trim()) return;
    navigate(`/dashboard/bookings?search=${encodeURIComponent(searchValue.trim())}`);
  };

  const handleProfileClick = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleMyProfile = () => {
    handleProfileClose();
    navigate("/dashboard/account");
  };

  const handleLogout = () => {
    handleProfileClose();
    clearAuthSession();
    navigate("/login");
  };

  const primaryColor = "var(--primary-color, #024DAF)";
  const secondaryColor = "var(--secondary-color, #024DAF)";

  const pillRadius = "9999px";
  const inputHeight = 36;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        px: 2.5,
        py: 1.25,
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        flexWrap: "wrap",
      }}
    >
      {/* Search bar: input + button (single pill-shaped unit) */}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: 0,
          flex: 1,
          minWidth: 0,
          maxWidth: 540,
          height: inputHeight,
        }}
      >
        <TextField
          placeholder="PNR/Booking Ref/Passport/Ticket Number"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          variant="outlined"
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              height: "100%",
              bgcolor: "#FFFFFF",
              borderRadius: `${pillRadius} 0 0 ${pillRadius}`,
              borderRight: "none",
              fontSize: 13,
              "& fieldset": {
                borderColor: "#E5E7EB",
                borderWidth: "1px",
                borderRight: "none",
              },
              "&:hover fieldset": { borderColor: "#D1D5DB" },
              "&.Mui-focused fieldset": { borderColor: secondaryColor, borderWidth: "1px" },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#6B7280",
              fontSize: 13,
              opacity: 1,
            },
          }}
          inputProps={{ "aria-label": "Search PNR or booking reference" }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<SearchIcon sx={{ color: "#fff", fontSize: 20 }} />}
          sx={{
            height: "100%",
            borderRadius: `0 ${pillRadius} ${pillRadius} 0`,
            bgcolor: secondaryColor,
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 600,
            px: 2.25,
            boxShadow: "none",
            border: `1px solid ${secondaryColor}`,
            borderLeft: "none",
            "&:hover": { bgcolor: secondaryColor, opacity: 0.9, boxShadow: "none", borderColor: secondaryColor },
          }}
        >
          Search
        </Button>
      </Box>

      {/* Right: $ Balance pill, MYR pill, circular icons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
        {/* $ Balance – pill-shaped box with chevron, click opens Balance Summary below */}
        <Box
          onClick={(e) => setBalanceAnchorEl(e.currentTarget)}
          role="button"
          aria-label="View balance summary"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            minHeight: 40,
            px: 1.5,
            py: 0.5,
            bgcolor: "#FFFFFF",
            border: "1px solid #D1D5DB",
            borderRadius: pillRadius,
            minWidth: 140,
            cursor: "pointer",
            "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F9FAFB" },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: 14, color: "#6B7280", fontWeight: 600, lineHeight: 1.2 }}>
              Balance
            </Typography>
            
          </Box>
          <KeyboardArrowDownIcon sx={{ fontSize: 20, color: "#374151", flexShrink: 0 }} />
        </Box>
        {/* MYR – pill-shaped dropdown */}
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              height: 40,
              bgcolor: "#FFFFFF",
              borderRadius: pillRadius,
              fontSize: 15,
              fontWeight: 400,
              color: "#374151",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #D1D5DB",
                borderRadius: pillRadius,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9CA3AF" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563EB" },
            }}
          >
            {CURRENCIES.map((c) => (
              <MenuItem key={c} value={c} sx={{ fontSize: 15 }}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Circular icons: headset, bell, profile – white bg, 1px black border, black icon */}
        <IconButton
          aria-label="Support"
          onClick={() => navigate("/dashboard/support")}
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#FFFFFF",
            border: "1px solid #1F2937",
            "&:hover": { bgcolor: "#F9FAFB", borderColor: "#1F2937" },
          }}
        >
          <HeadsetMicIcon sx={{ fontSize: 20, color: "#1F2937" }} />
        </IconButton>
        <IconButton
          aria-label="Notifications"
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#FFFFFF",
            border: "1px solid #1F2937",
            "&:hover": { bgcolor: "#F9FAFB", borderColor: "#1F2937" },
          }}
        >
          <NotificationsNoneIcon sx={{ fontSize: 20, color: "#1F2937" }} />
        </IconButton>
        <IconButton
          aria-label="Profile"
          onClick={handleProfileClick}
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#FFFFFF",
            border: "1px solid #1F2937",
            "&:hover": { bgcolor: "#F9FAFB", borderColor: "#1F2937" },
          }}
        >
          <Box
            sx={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              bgcolor: agentLogoFullUrl ? "transparent" : "#1F2937",
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
                alt="Profile"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={() => setLogoError(true)}
              />
            ) : (
              <PersonIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
            )}
          </Box>
        </IconButton>
      </Box>

      {/* Balance Summary popup – opens below navbar $ Balance */}
      <Menu
        anchorEl={balanceAnchorEl}
        open={Boolean(balanceAnchorEl)}
        onClose={() => setBalanceAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              borderRadius: "12px",
              border: `2px solid ${primaryColor}`,
              minWidth: 420,
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              py: 2,
              px: 2,
            },
          },
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#1F2937", mb: 1.5 }}>
          Balance Summary
        </Typography>
        <Typography component="div" sx={{ fontSize: 14, color: "#374151", mb: 2 }}>
          <Box component="span" sx={{ fontWeight: 700, color: "#1F2937" }}>Current Balance: </Box>
          <Box component="span">
            {walletLoading && walletApiBalance === null && (displayNumeric === null || displayNumeric === undefined) ? (
              <CircularProgress size={18} sx={{ ml: 1, verticalAlign: "middle", color: secondaryColor }} />
            ) : (
              `${currency} ${formatWalletBalance(displayNumeric ?? 0)}`
            )}
          </Box>
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            disabled={walletLoading}
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={async () => {
              await refetchWallet();
              setBalanceAnchorEl(null);
              navigate("/dashboard/agentdeposit/add");
            }}
            sx={{
              borderColor: secondaryColor,
              color: secondaryColor,
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { borderColor: primaryColor, bgcolor: "rgba(2, 77, 175, 0.04)" },
            }}
          >
            Reload Balance
          </Button>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon sx={{ fontSize: 18 }} />}
            onClick={() => {
              setBalanceAnchorEl(null);
              navigate("/dashboard/agentdeposit");
            }}
            sx={{
              borderColor: secondaryColor,
              color: secondaryColor,
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { borderColor: primaryColor, bgcolor: "rgba(2, 77, 175, 0.04)" },
            }}
          >
            Reload History
          </Button>
        </Box>
      </Menu>

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
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
          sx={{ mx: 1, mb: 0.5, borderRadius: "8px", display: "flex", alignItems: "center", gap: 1.5, py: 1.25 }}
        >
          <PersonIcon sx={{ fontSize: 20, color: "#6B7280" }} />
          <Typography sx={{ fontSize: 14 }}>My Profile</Typography>
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{ mx: 1, borderRadius: "8px", display: "flex", alignItems: "center", gap: 1.5, py: 1.25, color: "#6B7280" }}
        >
          <LogoutIcon sx={{ fontSize: 20 }} />
          <Typography sx={{ fontSize: 14 }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardNavbar;
