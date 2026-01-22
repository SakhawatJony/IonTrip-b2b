import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/HomeOutlined";
import BookingsIcon from "@mui/icons-material/StorageOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import WalletIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccountIcon from "@mui/icons-material/PersonOutline";
import ManageIcon from "@mui/icons-material/AutorenewOutlined";
import ReportIcon from "@mui/icons-material/BarChartOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const menuItem = (icon, text, dropdown = false) => (
  <ListItemButton sx={{ py: 3 }}>
    <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
    <ListItemText sx={{fontSize:"16px",color:"var(--ions)"}} primary={text} />
    {dropdown && (
      <IconButton size="small">
        <ExpandMoreIcon fontSize="small" />
      </IconButton>
    )}
  </ListItemButton>
);

const Sidebar = () => {
  return (
    <Box
      sx={{
   
        height: "100vh",
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        px:2
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3 }}>
        <Typography fontWeight={700} fontSize={22}>
          FLYFAR
          <span style={{ fontWeight: 400 }}> TECH</span>
        </Typography>
      </Box>

      {/* Menu */}
      <List sx={{ flexGrow: 1 }}>
        {menuItem(<DashboardIcon  sx={{ color: "var(--ions)", fontSize: "25px" }} />, "Dashboard")}
        {menuItem(<BookingsIcon sx={{ color: "var(--ions)", fontSize: "25px" }} />, "Bookings", true)}
        {menuItem(<SettingsIcon sx={{ color: "var(--ions)", fontSize: "25px" }} />, "Settings", true)}
        {menuItem(<WalletIcon sx={{ color: "var(--ions)", fontSize: "25px" }} />, "Wallet")}
        {menuItem(<AccountIcon sx={{ color: "var(--ions)", fontSize: "25px" }} />, "Account", true)}
        {menuItem(<ManageIcon sx={{ color: "var(--ions)", fontSize: "25px" }} />, "Manage", true)}
        {menuItem(<ReportIcon sx={{ color: "var(--ions)", fontSize: "25px" }} />, "Ot Reports", true)}
        {menuItem(<LogoutIcon sx={{ color: "var(--ions)", fontSize: "25px" }} />, "Logout")}
      </List>

      {/* User Info Bottom */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          width:"100%"
        }}
      >
        <Avatar sx={{ width: 36, height: 36 }} />
        <Box>
          <Typography fontSize={14} fontWeight={600}>
            Syed Afridi
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            Project Manager
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
