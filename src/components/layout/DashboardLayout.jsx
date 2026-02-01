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
      <Grid container >
        {/* Sidebar Grid Item */}
        <Grid item md={2}>
          <Sidebar />
        </Grid>

        {/* Main Content Grid Item */}
        <Grid item xs={12} md={10}>
          <Grid container>
            <Grid item md={12}>
              <Box
                sx={{
                 
                  minHeight: "100vh",
                  boxSizing: "border-box",
                  bgcolor:"#ECECEC"
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
