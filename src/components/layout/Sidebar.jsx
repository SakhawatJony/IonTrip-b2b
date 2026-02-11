import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Home";
import BookingsIcon from "@mui/icons-material/Storage";
import SettingsIcon from "@mui/icons-material/Settings";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountIcon from "@mui/icons-material/Person";
import ManageIcon from "@mui/icons-material/Autorenew";
import ReportIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import companyLogo from "../../assets/companylogo.jpg";

const MENU_TEXT_COLOR = "#4B5563";
const MENU_ICON_COLOR = "#6B7280";
const MENU_ACTIVE_COLOR = "#1F2A44";
const SIDEBAR_BORDER = "#E5E7EB";
const BRAND_PRIMARY = "#1F2A44";
const BRAND_ACCENT = "#5BA2D4";
const DROPDOWN_ICON_BG = "#111827";

const SUBMENU_TEXT_COLOR = "#6B7C93";
const SUBMENU_ACTIVE_COLOR = "#1F4D8B";
const SUBMENU_ICON_BORDER = "#D1D5DB";
const SUBMENU_ICON_ACTIVE = "#1F4D8B";

const menuItem = (icon, text, options = {}) => {
  const { dropdown = false, path, end = false, sx, onClick, isOpen } = options;

  const buttonProps = path
    ? { component: NavLink, to: path, end }
    : { component: "div" };

  return (
    <ListItemButton
      {...buttonProps}
      onClick={onClick}
      sx={{
        py: 1.2,
        px: 1.25,
        borderRadius: 1.25,
        minHeight: 42,
        alignItems: "center",
        gap: 1.25,
        "&.active": {
          bgcolor: "rgba(31, 42, 68, 0.08)",
        },
        "&.active .MuiListItemIcon-root, &.active .MuiListItemText-primary": {
          color: MENU_ACTIVE_COLOR,
        },
        ...sx,
      }}
    >
      <ListItemIcon sx={{ minWidth: 34, color: MENU_ICON_COLOR }}>
        {icon}
      </ListItemIcon>

      <ListItemText
        primaryTypographyProps={{
          fontSize: 14,
          fontWeight: 500,
          color: MENU_TEXT_COLOR,
        }}
        primary={text}
      />

      {dropdown && (
        <IconButton
          size="small"
          onClick={onClick}
          sx={{
            ml: "auto",
            width: 22,
            height: 22,
            bgcolor: DROPDOWN_ICON_BG,
            color: "#fff",
            "&:hover": { bgcolor: DROPDOWN_ICON_BG },
          }}
        >
          <ExpandMoreIcon
            fontSize="small"
            sx={{
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </IconButton>
      )}
    </ListItemButton>
  );
};

const SubMenuItem = ({ text, path, location }) => {
  const isActive = location.pathname === path;

  return (
    <Box
      component={NavLink}
      to={path}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 1.75,
        py: 0.55,
        pl: 5.25,
        pr: 1.25,
        minHeight: 32,
        textDecoration: "none",
        cursor: "pointer",
        width: "100%",
        "&:hover": {
          bgcolor: "transparent",
        },
      }}
    >
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: 1,
          bgcolor: isActive ? SUBMENU_ICON_ACTIVE : "#fff",
          border: `1px solid ${isActive ? SUBMENU_ICON_ACTIVE : SUBMENU_ICON_BORDER}`,
          flexShrink: 0,
          zIndex: 1,
        }}
      />
      <Typography
        component="div"
        sx={{
          fontSize: 13,
          fontWeight: isActive ? 600 : 500,
          color: isActive ? SUBMENU_ACTIVE_COLOR : SUBMENU_TEXT_COLOR,
          lineHeight: 1.6,
          whiteSpace: "nowrap",
          display: "block",
          flex: 1,
          zIndex: 1,
          position: "relative",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard/bookings")) {
      setExpandedMenu("bookings");
      return;
    }
    if (location.pathname.startsWith("/dashboard/wallet")) {
      setExpandedMenu("wallet");
      return;
    }
    if (location.pathname.startsWith("/dashboard/agentdeposit")) {
      setExpandedMenu("wallet");
      return;
    }
    if (location.pathname.startsWith("/dashboard/ledgerreport")) {
      setExpandedMenu("reports");
      return;
    }
    if (location.pathname.startsWith("/dashboard/salesreport")) {
      setExpandedMenu("reports");
      return;
    }
    if (location.pathname.startsWith("/dashboard/searchreport")) {
      setExpandedMenu("reports");
      return;
    }
    setExpandedMenu(null);
  }, [location.pathname]);

  const handleToggle = (menuKey) => {
    setExpandedMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  return (
    <Box
      sx={{
        height: "100vh",
        borderRight: `1px solid ${SIDEBAR_BORDER}`,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        px: 2,
      }}
    >
      <Box sx={{ px: 1, py: 3, textAlign: "center" }}>

        <Typography fontWeight={800} fontSize={22} color={BRAND_PRIMARY}>
          ionTrip
        </Typography>
        <Typography
          fontWeight={700}
          fontSize={13}
          letterSpacing={2}
          color={BRAND_ACCENT}
        >
          TECH
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.75 }}>
        {menuItem(<DashboardIcon sx={{ fontSize: 23 }} />, "Dashboard", {
          path: "/dashboard",
          end: true,
        })}

        {menuItem(<BookingsIcon sx={{ fontSize: 23 }} />, "Bookings", {
          dropdown: true,
          isOpen: expandedMenu === "bookings",
          onClick: () => handleToggle("bookings"),
        })}
        <Collapse in={expandedMenu === "bookings"} timeout="auto" unmountOnExit>
          <Box
            sx={{
              position: "relative",
              pl: 0,
              pr: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                left: 49,
                top: 16,
                bottom: 16,
                width: 2,
                bgcolor: SUBMENU_ICON_BORDER,
              },
            }}
          >
            <SubMenuItem text="All Booking" path="/dashboard/bookings" location={location} />
            <SubMenuItem text="Confirmed Booking" path="/dashboard/bookings/confirmed" location={location} />
            <SubMenuItem text="Refund Booking" path="/dashboard/bookings/refund" location={location} />
            <SubMenuItem text="Reissue Booking" path="/dashboard/bookings/reissue" location={location} />
          </Box>
        </Collapse>

        {menuItem(<SettingsIcon sx={{ fontSize: 23 }} />, "Settings", {
          path: "/dashboard/settings",
        })}

        {menuItem(<WalletIcon sx={{ fontSize: 23 }} />, "Wallet", {
          dropdown: true,
          isOpen: expandedMenu === "wallet",
          onClick: () => handleToggle("wallet"),
        })}
        <Collapse in={expandedMenu === "wallet"} timeout="auto" unmountOnExit>
          <Box
            sx={{
              position: "relative",
              pl: 0,
              pr: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                left: 49,
                top: 16,
                bottom: 16,
                width: 2,
                bgcolor: SUBMENU_ICON_BORDER,
              },
            }}
          >
            <SubMenuItem text="Wallet Overview" path="/dashboard/wallet" location={location} />
            <SubMenuItem text="Agent Deposit" path="/dashboard/agentdeposit" location={location} />
          </Box>
        </Collapse>

        {menuItem(<AccountIcon sx={{ fontSize: 23 }} />, "Account", {
          path: "/dashboard/account",
        })}

        {menuItem(<ManageIcon sx={{ fontSize: 23 }} />, "Manage", {
          path: "/dashboard/manage",
        })}

        {menuItem(<ReportIcon sx={{ fontSize: 23 }} />, "Ot Reports", {
          dropdown: true,
          isOpen: expandedMenu === "reports",
          onClick: () => handleToggle("reports"),
        })}
        <Collapse in={expandedMenu === "reports"} timeout="auto" unmountOnExit>
          <Box
            sx={{
              position: "relative",
              pl: 0,
              pr: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                left: 49,
                top: 16,
                bottom: 16,
                width: 2,
                bgcolor: SUBMENU_ICON_BORDER,
              },
            }}
          >
            <SubMenuItem text="Ledger Report" path="/dashboard/ledgerreport" location={location} />
            <SubMenuItem text="Sales Report" path="/dashboard/salesreport" location={location} />
            <SubMenuItem text="Search Report" path="/dashboard/searchreport" location={location} />
          </Box>
        </Collapse>

        {menuItem(<LogoutIcon sx={{ fontSize: 23 }} />, "Logout")}
      </List>

      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${SIDEBAR_BORDER}`,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Avatar sx={{ width: 36, height: 36 }} />
        <Box>
          <Typography fontSize={12} fontWeight={600}>
            Sakhawat Hosen
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
