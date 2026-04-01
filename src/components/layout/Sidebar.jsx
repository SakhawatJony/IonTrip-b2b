import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

import QueryStatsIcon from '@mui/icons-material/QueryStats';
import FlightIcon from "@mui/icons-material/Flight";
import HotelIcon from "@mui/icons-material/Hotel";
import ExploreIcon from "@mui/icons-material/Explore";
import BadgeIcon from "@mui/icons-material/Badge";
import SettingsIcon from "@mui/icons-material/Settings";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import ManageIcon from "@mui/icons-material/Autorenew";
import ReportIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
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

const menuItem = (icon, text, options = {}, location = null, collapsed = false) => {
  const {
    dropdown = false,
    path,
    end = false,
    sx,
    onClick,
    onToggleClick,
    isOpen,
    activePaths = [],
  } = options;

  // Check if current route matches this menu item or any of its active paths
  const isActive = path
    ? location?.pathname === path || (end ? false : location?.pathname.startsWith(path))
    : activePaths.some((activePath) => location?.pathname.startsWith(activePath));

  const buttonProps = path
    ? { component: NavLink, to: path, end }
    : { component: "div" };

  return (
    <ListItemButton
      {...buttonProps}
      onClick={onClick}
      sx={{
        py: collapsed ? 0.9 : 1.2,
        px: collapsed ? 0 : 1.25,
        borderRadius: 1.25,
        minHeight: 42,
        width: "100%",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: collapsed ? 0 : 1.25,
        textAlign: collapsed ? "center" : "left",
        boxSizing: "border-box",
        borderLeft: isActive
          ? "3px solid var(--primary-color, #024DAF)"
          : "3px solid transparent",
        bgcolor: isActive ? "rgba(31, 42, 68, 0.08)" : "transparent",
        "&.active": {
          bgcolor: "rgba(31, 42, 68, 0.08)",
        },
        "&.active .MuiListItemIcon-root, &.active .MuiListItemText-primary": {
          color: MENU_ACTIVE_COLOR,
        },
        ...sx,
      }}
    >
      <ListItemIcon 
        sx={{ 
          minWidth: collapsed ? 0 : 34,
          pr: collapsed ? 0 : undefined,
          width: collapsed ? "100%" : "auto",
          display: "flex",
          justifyContent: "center",
          color: isActive ? MENU_ACTIVE_COLOR : MENU_ICON_COLOR,
          "& .MuiSvgIcon-root": {
            color: isActive ? MENU_ACTIVE_COLOR : MENU_ICON_COLOR,
          },
        }}
      >
        {icon}
      </ListItemIcon>

      <ListItemText
        primaryTypographyProps={{
          fontSize: 14,
          fontWeight: isActive ? 600 : 500,
          color: isActive ? MENU_ACTIVE_COLOR : MENU_TEXT_COLOR,
        }}
        primary={text}
        sx={{ display: collapsed ? "none" : "block" }}
      />

      {!collapsed && dropdown && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onToggleClick?.(e);
          }}
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

const SubMenuItem = ({ text, path, location, collapsed = false }) => {
  const isActive = location.pathname === path;

  return (
    <Box
      component={NavLink}
      to={path}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: collapsed ? 0 : 1.75,
        py: 0.55,
        pl: collapsed ? 0 : 5.25,
        pr: collapsed ? 0 : 1.25,
        minHeight: 32,
        textDecoration: "none",
        cursor: "pointer",
        width: "100%",
        boxSizing: "border-box",
        borderLeft: isActive
          ? "3px solid var(--primary-color, #024DAF)"
          : "3px solid transparent",
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
          display: collapsed ? "none" : "block",
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

const Sidebar = ({ collapsed = false, onToggleCollapsed } = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearAuthSession } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    if (collapsed) {
      // When sidebar collapses, close any opened submenu sections.
      setExpandedMenu(null);
    }
  }, [collapsed]);

  useEffect(() => {
    if (
      location.pathname.startsWith("/dashboard/bookings") ||
      location.pathname.startsWith("/dashboard/flightinfo") ||
      location.pathname.startsWith("/dashboard/reschedulepax")
    ) {
      setExpandedMenu("flight");
      return;
    }
    if (
      location.pathname.startsWith("/dashboard/hotel")
    ) {
      setExpandedMenu("hotel");
      return;
    }
    if (location.pathname.startsWith("/dashboard/tour")) {
      setExpandedMenu("tour");
      return;
    }
    if (location.pathname.startsWith("/dashboard/visa")) {
      setExpandedMenu("visa");
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
    if (location.pathname.startsWith("/dashboard/account")) {
      setExpandedMenu("account");
      return;
    }
    if (location.pathname.startsWith("/dashboard/sub-users")) {
      setExpandedMenu("subUsers");
      return;
    }
    setExpandedMenu(null);
  }, [location.pathname]);

  const handleToggle = (menuKey) => {
    setExpandedMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  const handleMainMenuClick = (menuKey, firstSubRoute) => {
    if (expandedMenu === menuKey) {
      setExpandedMenu(null);
      return;
    }

    setExpandedMenu(menuKey);
    if (firstSubRoute && location.pathname !== firstSubRoute) {
      navigate(firstSubRoute);
    }
  };

  const handleLogout = () => {
    // Clear auth session
    clearAuthSession();
    
    // Show success toast
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    // Navigate to home page
    navigate("/");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        borderRight: collapsed ? "none" : `1px solid ${SIDEBAR_BORDER}`,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
        px: 0,
        overflowY: "hidden",
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
          width: "2px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "2px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: BRAND_PRIMARY,
          borderRadius: "2px",
          "&:hover": {
            background: "#0F172A",
          },
        },
      }}
    >
      <Box
        sx={{
          px: collapsed ? 0 : 1.5,
          py: collapsed ? 1.8 : 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 1,
          flexShrink: 0,
          borderBottom: collapsed ? "none" : `1px solid ${SIDEBAR_BORDER}`,
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Box
          component="img"
          src={companyLogo}
          alt="mynztrip"
          sx={{
            width: 28,
            height: 28,
            borderRadius: "6px",
            objectFit: "cover",
            display: collapsed ? "none" : "block",
          }}
        />

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 18,
            color: "var(--secondary-color, #024DAF)",
            lineHeight: 1,
            whiteSpace: "nowrap",
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: collapsed ? "none" : "block",
          }}
        >
          iontrip.com
        </Typography>

        <Box sx={{ ml: collapsed ? 0 : "auto", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <IconButton
            size="small"
            aria-label="Back"
            onClick={onToggleCollapsed}
            sx={{
              width: 28,
              height: 28,
              border: "1px solid #D1D5DB",
              bgcolor: "#FFFFFF",
              "&:hover": { bgcolor: "#F9FAFB" },
              flexShrink: 0,
            }}
          >
            <MenuOpenIcon sx={{ fontSize: 18, color: "#6B7280" }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "2px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "2px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: BRAND_PRIMARY,
            borderRadius: "2px",
            "&:hover": {
              background: "#0F172A",
            },
          },
        }}
      >
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
            ...(collapsed && {
              alignItems: "center",
              width: "100%",
              p: 0,
              py: 0.5,
              "& .MuiListItemButton-root": { maxWidth: "100%" },
            }),
          }}
        >
          {menuItem(<QueryStatsIcon sx={{ fontSize: 23 }} />, "Dashboard", {
            path: "/dashboard",
            end: true,
          }, location, collapsed)}

        {menuItem(<FlightIcon sx={{ fontSize: 23 }} />, "Flight", {
          dropdown: true,
          isOpen: expandedMenu === "flight",
          onClick: () => handleMainMenuClick("flight", "/dashboard/bookings"),
          onToggleClick: () => handleToggle("flight"),
          activePaths: ["/dashboard/bookings", "/dashboard/flightinfo", "/dashboard/reschedulepax"],
        }, location, collapsed)}
        <Collapse in={expandedMenu === "flight"} timeout="auto" unmountOnExit>
          <Box
            sx={{
              position: "relative",
              pl: 0,
              pr: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                left: collapsed ? "50%" : 49,
                transform: collapsed ? "translateX(-50%)" : "none",
                top: 16,
                bottom: 16,
                width: 2,
                bgcolor: SUBMENU_ICON_BORDER,
              },
            }}
          >
            <SubMenuItem collapsed={collapsed} text="Bookings" path="/dashboard/bookings" location={location} />
            <SubMenuItem collapsed={collapsed} text="Ticketed" path="/dashboard/bookings/ticketed" location={location} />
            <SubMenuItem collapsed={collapsed} text="Cancelled" path="/dashboard/bookings/cancelled" location={location} />
            <SubMenuItem collapsed={collapsed} text="Reissue" path="/dashboard/bookings/reissue" location={location} />
            <SubMenuItem collapsed={collapsed} text="Refunds" path="/dashboard/bookings/refund" location={location} />
            <SubMenuItem collapsed={collapsed} text="Flight Info" path="/dashboard/flightinfo" location={location} />
            <SubMenuItem collapsed={collapsed} text="Reschedule Pax" path="/dashboard/reschedulepax" location={location} />
          </Box>
        </Collapse>

        {menuItem(<HotelIcon sx={{ fontSize: 23 }} />, "Hotel", {
          dropdown: true,
          isOpen: expandedMenu === "hotel",
          onClick: () => handleMainMenuClick("hotel", "/dashboard/hotel/bookings"),
          onToggleClick: () => handleToggle("hotel"),
          activePaths: [
            "/dashboard/hotel/search",
            "/dashboard/hotel/bookings",
            "/dashboard/hotel/confirmed",
            "/dashboard/hotel/cancelled",
          ],
        }, location, collapsed)}
        <Collapse in={expandedMenu === "hotel"} timeout="auto" unmountOnExit>
          <Box
            sx={{
              position: "relative",
              pl: 0,
              pr: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                left: collapsed ? "50%" : 49,
                transform: collapsed ? "translateX(-50%)" : "none",
                top: 16,
                bottom: 16,
                width: 2,
                bgcolor: SUBMENU_ICON_BORDER,
              },
            }}
          >
           
            <SubMenuItem collapsed={collapsed} text="Search Hotels" path="/dashboard/hotel/search" location={location} />
            <SubMenuItem collapsed={collapsed} text="All Bookings" path="/dashboard/hotel/bookings" location={location} />
            <SubMenuItem collapsed={collapsed} text="Confirmed Booking" path="/dashboard/hotel/confirmed" location={location} />
            <SubMenuItem collapsed={collapsed} text="Cancelled Booking" path="/dashboard/hotel/cancelled" location={location} />
          </Box>
        </Collapse>

        {menuItem(<ExploreIcon sx={{ fontSize: 23 }} />, "Tour", {
          dropdown: true,
          isOpen: expandedMenu === "tour",
          onClick: () => handleMainMenuClick("tour", "/dashboard/tour/bookings"),
          onToggleClick: () => handleToggle("tour"),
          activePaths: ["/dashboard/tour/bookings", "/dashboard/tour/confirmed", "/dashboard/tour/cancelled", "/dashboard/tour/refunds"],
        }, location, collapsed)}
        <Collapse in={expandedMenu === "tour"} timeout="auto" unmountOnExit>
          <Box
            sx={{
              position: "relative",
              pl: 0,
              pr: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                left: collapsed ? "50%" : 49,
                transform: collapsed ? "translateX(-50%)" : "none",
                top: 16,
                bottom: 16,
                width: 2,
                bgcolor: SUBMENU_ICON_BORDER,
              },
            }}
          >
            <SubMenuItem collapsed={collapsed} text="All Bookings" path="/dashboard/tour/bookings" location={location} />
            <SubMenuItem collapsed={collapsed} text="Confirmed Booking" path="/dashboard/tour/confirmed" location={location} />
            <SubMenuItem collapsed={collapsed} text="Cancelled Booking" path="/dashboard/tour/cancelled" location={location} />
            <SubMenuItem collapsed={collapsed} text="Refunds Booking" path="/dashboard/tour/refunds" location={location} />
          </Box>
        </Collapse>

        {menuItem(<BadgeIcon sx={{ fontSize: 23 }} />, "Visa", {
          dropdown: true,
          isOpen: expandedMenu === "visa",
          onClick: () => handleMainMenuClick("visa", "/dashboard/visa/bookings"),
          onToggleClick: () => handleToggle("visa"),
          activePaths: ["/dashboard/visa/bookings", "/dashboard/visa/confirmed", "/dashboard/visa/cancelled", "/dashboard/visa/refunds"],
        }, location, collapsed)}
        <Collapse in={expandedMenu === "visa"} timeout="auto" unmountOnExit>
          <Box
            sx={{
              position: "relative",
              pl: 0,
              pr: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                left: collapsed ? "50%" : 49,
                transform: collapsed ? "translateX(-50%)" : "none",
                top: 16,
                bottom: 16,
                width: 2,
                bgcolor: SUBMENU_ICON_BORDER,
              },
            }}
          >
            <SubMenuItem collapsed={collapsed} text="All Bookings" path="/dashboard/visa/bookings" location={location} />
            <SubMenuItem collapsed={collapsed} text="Confirmed Booking" path="/dashboard/visa/confirmed" location={location} />
            <SubMenuItem collapsed={collapsed} text="Cancelled Booking" path="/dashboard/visa/cancelled" location={location} />
            <SubMenuItem collapsed={collapsed} text="Refunds Booking" path="/dashboard/visa/refunds" location={location} />
          </Box>
        </Collapse>

        {menuItem(<WalletIcon sx={{ fontSize: 23 }} />, "Wallet", {
          dropdown: true,
          isOpen: expandedMenu === "wallet",
          onClick: () => handleMainMenuClick("wallet", "/dashboard/agentdeposit"),
          onToggleClick: () => handleToggle("wallet"),
          activePaths: ["/dashboard/wallet", "/dashboard/agentdeposit", "/dashboard/agentdeposit/add"],
        }, location, collapsed)}
        <Collapse in={expandedMenu === "wallet"} timeout="auto" unmountOnExit>
          <Box
            sx={{
              position: "relative",
              pl: 0,
              pr: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                left: collapsed ? "50%" : 49,
                transform: collapsed ? "translateX(-50%)" : "none",
                top: 16,
                bottom: 16,
                width: 2,
                bgcolor: SUBMENU_ICON_BORDER,
              },
            }}
          >
            {/* <SubMenuItem text="Wallet Overview" path="/dashboard/wallet" location={location} /> */}
            <SubMenuItem collapsed={collapsed} text="Agent Deposit" path="/dashboard/agentdeposit" location={location} />
            <SubMenuItem collapsed={collapsed} text="Deposit Request" path="/dashboard/agentdeposit/add" location={location} />
          </Box>
        </Collapse>

        {menuItem(<AccountIcon sx={{ fontSize: 23 }} />, "Account", {
          dropdown: true,
          isOpen: expandedMenu === "account",
          onClick: () => handleMainMenuClick("account", "/dashboard/account"),
          onToggleClick: () => handleToggle("account"),
          activePaths: ["/dashboard/account", "/dashboard/account/activitylog", "/dashboard/account/alltraveler", "/dashboard/account/addtraveler"],
        }, location, collapsed)}
        <Collapse in={expandedMenu === "account"} timeout="auto" unmountOnExit>
          <Box
            sx={{
              position: "relative",
              pl: 0,
              pr: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                left: collapsed ? "50%" : 49,
                transform: collapsed ? "translateX(-50%)" : "none",
                top: 16,
                bottom: 16,
                width: 2,
                bgcolor: SUBMENU_ICON_BORDER,
              },
            }}
          >
            <SubMenuItem collapsed={collapsed} text="Profile" path="/dashboard/account" location={location} />
            <SubMenuItem collapsed={collapsed} text="Activity Log" path="/dashboard/account/activitylog" location={location} />
            <SubMenuItem collapsed={collapsed} text="All Traveler" path="/dashboard/account/alltraveler" location={location} />
          </Box>
        </Collapse>

        {menuItem(<GroupIcon sx={{ fontSize: 23 }} />, "Sub Users", {
          dropdown: true,
          isOpen: expandedMenu === "subUsers",
          onClick: () => handleMainMenuClick("subUsers", "/dashboard/sub-users/sub-user-list"),
          onToggleClick: () => handleToggle("subUsers"),
          activePaths: ["/dashboard/sub-users"],
        }, location, collapsed)}
        <Collapse in={expandedMenu === "subUsers"} timeout="auto" unmountOnExit>
          <Box
            sx={{
              position: "relative",
              pl: 0,
              pr: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                left: collapsed ? "50%" : 49,
                transform: collapsed ? "translateX(-50%)" : "none",
                top: 16,
                bottom: 16,
                width: 2,
                bgcolor: SUBMENU_ICON_BORDER,
              },
            }}
          >
            <SubMenuItem collapsed={collapsed} text="Sub User List" path="/dashboard/sub-users/sub-user-list" location={location} />
            <SubMenuItem collapsed={collapsed} text="Add User" path="/dashboard/sub-users/add-user" location={location} />
          </Box>
        </Collapse>

        {/* {menuItem(<ManageIcon sx={{ fontSize: 23 }} />, "Manage", {
          path: "/dashboard/manage",
        }, location, collapsed)} */}

        {menuItem(<ReportIcon sx={{ fontSize: 23 }} />, "Reports", {
          dropdown: true,
          isOpen: expandedMenu === "reports",
          onClick: () => handleMainMenuClick("reports", "/dashboard/ledgerreport"),
          onToggleClick: () => handleToggle("reports"),
          activePaths: ["/dashboard/ledgerreport", "/dashboard/salesreport", "/dashboard/searchreport"],
        }, location, collapsed)}
        <Collapse in={expandedMenu === "reports"} timeout="auto" unmountOnExit>
          <Box
            sx={{
              position: "relative",
              pl: 0,
              pr: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                left: collapsed ? "50%" : 49,
                transform: collapsed ? "translateX(-50%)" : "none",
                top: 16,
                bottom: 16,
                width: 2,
                bgcolor: SUBMENU_ICON_BORDER,
              },
            }}
          >
            <SubMenuItem collapsed={collapsed} text="Ledger Report" path="/dashboard/ledgerreport" location={location} />
            {/* <SubMenuItem text="Sales Report" path="/dashboard/salesreport" location={location} /> */}
            <SubMenuItem collapsed={collapsed} text="Search Report" path="/dashboard/searchreport" location={location} />
          </Box>
        </Collapse>

        {menuItem(<HeadsetMicIcon sx={{ fontSize: 23 }} />, "Support", {
          path: "/dashboard/support",
        }, location, collapsed)}

        {menuItem(<LogoutIcon sx={{ fontSize: 23 }} />, "Logout", {
          onClick: handleLogout,
        }, location, collapsed)}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
