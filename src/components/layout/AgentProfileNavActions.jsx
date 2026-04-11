import React, { useState, useEffect } from "react";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production-2d3b.up.railway.app";

const NAVY_BORDER = "var(--primary-color, #024DAF)";

function resolveAvatarUrl(agentData) {
  if (!agentData || typeof agentData !== "object") return null;
  const raw =
    agentData.profileImage ||
    agentData.profilePhoto ||
    agentData.image ||
    agentData.photo ||
    agentData.logoUrl ||
    agentData.logo;
  if (!raw || typeof raw !== "string") return null;
  return raw.startsWith("http") ? raw : `${API_BASE}/${raw.replace(/^\//, "")}`;
}

/**
 * Profile avatar + menu (My Profile, Logout).
 * When includeUtilityIcons: also show Support + Notifications (agent dashboard top bar).
 */
export default function AgentProfileNavActions({
  accountPath = "/dashboard/account",
  supportPath = "/dashboard/support",
  /** Support + bell before profile (DashboardNavbar only). Public Navbar omits these. */
  includeUtilityIcons = false,
}) {
  const navigate = useNavigate();
  const { agentData, clearAuthSession } = useAuth();
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [imgError, setImgError] = useState(false);

  const avatarUrl = resolveAvatarUrl(agentData);

  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const handleProfileClose = () => setProfileAnchor(null);

  const handleMyProfile = () => {
    handleProfileClose();
    navigate(accountPath);
  };

  const handleLogout = () => {
    handleProfileClose();
    clearAuthSession();
    navigate("/login");
  };

  const circleBtnSx = {
    width: 40,
    height: 40,
    bgcolor: "#FFFFFF",
    border: `1px solid ${NAVY_BORDER}`,
    "&:hover": { bgcolor: "#F9FAFB", borderColor: NAVY_BORDER },
  };

  const utilityIconSx = { fontSize: 20, color: NAVY_BORDER };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: includeUtilityIcons ? 1.5 : 0, flexShrink: 0 }}>
        {includeUtilityIcons ? (
          <>
            <IconButton aria-label="Support" onClick={() => navigate(supportPath)} sx={circleBtnSx}>
              <HeadsetMicIcon sx={utilityIconSx} />
            </IconButton>
            <IconButton aria-label="Notifications" sx={circleBtnSx}>
              <NotificationsNoneIcon sx={utilityIconSx} />
            </IconButton>
          </>
        ) : null}
        <IconButton aria-label="Profile" onClick={(e) => setProfileAnchor(e.currentTarget)} sx={circleBtnSx}>
          <Box
            sx={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              bgcolor: avatarUrl ? "transparent" : NAVY_BORDER,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {avatarUrl && !imgError ? (
              <Box
                component="img"
                src={avatarUrl}
                alt=""
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={() => setImgError(true)}
              />
            ) : (
              <PersonIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
            )}
          </Box>
        </IconButton>
      </Box>

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
              minWidth: 200,
              py: 1,
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              zIndex: (t) => t.zIndex.drawer + 2,
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
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 1.25,
            color: "#374151",
          }}
        >
          <PersonIcon sx={{ fontSize: 20, color: "#6B7280" }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>My Profile</Typography>
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            mx: 1,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 1.25,
            color: "#374151",
          }}
        >
          <ExitToAppIcon sx={{ fontSize: 20, color: "#6B7280" }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
