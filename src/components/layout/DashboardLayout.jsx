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
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import BalanceNoticeBar from "./BalanceNoticeBar";
import DashboardNavbar from "./DashboardNavbar";
import DashboardPageHeading from "./DashboardPageHeading";
import { getDashboardPageTitle, shouldShowDashboardPageHeading } from "../../utils/dashboardPageMeta";

const DashboardLayout = () => {
  const location = useLocation();
  const showPageHeading = shouldShowDashboardPageHeading(location.pathname);
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
        <Grid
          item
          md={open ? 2 : 0.5}
          sx={{
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Sidebar
            collapsed={!open}
            onToggleCollapsed={handleDrawerToggle}
          />
        </Grid>

        {/* Main Content Grid Item */}
        <Grid
          item
          xs={12}
          md={open ? 10 : 11.5}
          sx={{
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            // Collapsed sidebar: clear separation between rail and dashboard routes
            borderLeft: !open
              ? "3px solid var(--primary-color, #024DAF)"
              : "none",
          }}
        >
          <Grid container sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <Grid item xs={12} sx={{ height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <DashboardNavbar />
              <Box
                sx={{
                  
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
                {/* <BalanceNoticeBar /> */}
                {showPageHeading ? (
                  <DashboardPageHeading
                    title={getDashboardPageTitle(location.pathname)}
                    pathname={location.pathname}
                  />
                ) : null}
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
