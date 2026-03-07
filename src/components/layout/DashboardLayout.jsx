import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Avatar,
  Button,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Description as BookingsIcon,
  Settings as SettingsIcon,
  AccountBalanceWallet as WalletIcon,
  AccountCircle as AccountIcon,
  ManageAccounts as ManageIcon,
  Assessment as ReportsIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  ChevronLeft,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import BalanceNoticeBar from "./BalanceNoticeBar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleMenuToggle = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box >
      <Grid container sx={{ height: "100vh", overflow: "hidden" }}>
        {/* Sidebar Grid Item */}
        <Grid item md={2} sx={{ height: "100vh", overflow: "hidden" }}>
          <Sidebar />
        </Grid>

        {/* Main Content Grid Item */}
        <Grid item xs={12} md={10} sx={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Grid container sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <Grid item xs={12} sx={{ height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <Box
                sx={{
                  pt: "20px",
                  flex: 1,
                  minHeight: 0,
                  boxSizing: "border-box",
                  bgcolor: "#ECECEC",
                  overflowY: "auto",
                  overflowX: "hidden",
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "2px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "2px",
                    "&:hover": {
                      background: "#555",
                    },
                  },
                }}
              >
                <BalanceNoticeBar />
                <Outlet />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardLayout;
