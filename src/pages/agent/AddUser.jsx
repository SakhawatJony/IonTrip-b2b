import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

const shellSx = {
  display: "flex",
  alignItems: "center",
  border: "1px solid var(--secondary-color, #024DAF)",
  borderRadius: "4px",
  px: 1.5,
  py: 0.5,
  "&:focus-within": {
    border: "2px solid var(--secondary-color, #024DAF)",
  },
};

const labelSx = {
  fontSize: "14px",
  color: "var(--primary-color)",
  fontWeight: 500,
  mb: 1,
};

const iconSx = {
  color: "var(--secondary-color, #024DAF)",
  mr: 2,
  fontSize: "20px",
};

const inputStyle = {
  border: "none",
  outline: "none",
  flex: 1,
  fontSize: "16px",
  padding: "8px 0",
  color: "#202124",
  backgroundColor: "transparent",
  boxShadow: "none",
};

const ROLE_OPTIONS = [
  { value: "Manager", label: "Manager" },
  { value: "Reservation Officer", label: "Reservation Officer" },
  { value: "Accountant", label: "Accountant" },
  { value: "Support", label: "Support" },
];

const AddUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    role: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard/sub-users/sub-user-list");
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: 3 }}>
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            bgcolor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            p: { xs: 2, md: 3 },
            maxWidth: 960,
            mx: "auto",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 17, md: 18 },
              fontWeight: 600,
              color: "var(--primary-color)",
              mb: 2.5,
            }}
          >
            Sub-User Contact Information
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 0 }}>
                <Typography sx={labelSx}>First Name</Typography>
                <Box sx={shellSx}>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    autoComplete="given-name"
                    style={inputStyle}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography sx={labelSx}>Last Name</Typography>
                <Box sx={shellSx}>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    autoComplete="family-name"
                    style={inputStyle}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography sx={labelSx}>Phone Number</Typography>
                <Box sx={shellSx}>
                  <PhoneIcon sx={iconSx} />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    autoComplete="tel"
                    inputMode="tel"
                    style={inputStyle}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography sx={labelSx}>Select Role</Typography>
                <Box sx={shellSx}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Select
                      name="role"
                      value={form.role}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, role: e.target.value }))
                      }
                      displayEmpty
                      fullWidth
                      variant="standard"
                      disableUnderline
                      sx={{
                        fontSize: 16,
                        color: form.role ? "#202124" : "#9CA3AF",
                        "& .MuiSelect-select": {
                          py: 1,
                          px: 0,
                          display: "flex",
                          alignItems: "center",
                        },
                        "& .MuiSelect-icon": {
                          color: "var(--secondary-color, #024DAF)",
                        },
                      }}
                      renderValue={(selected) =>
                        selected ? (
                          selected
                        ) : (
                          <Box component="span" sx={{ color: "#9CA3AF" }}>
                            Select Role
                          </Box>
                        )
                      }
                    >
                      <MenuItem value="" disabled>
                        <em>Select Role</em>
                      </MenuItem>
                      {ROLE_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Typography
            sx={{
              fontSize: { xs: 17, md: 18 },
              fontWeight: 600,
              color: "var(--primary-color)",
              mt: 3,
              mb: 2.5,
            }}
          >
            Sub-User Login Information
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography sx={labelSx}>Email Address</Typography>
                <Box sx={shellSx}>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    autoComplete="email"
                    style={inputStyle}
                  />
                  <EmailIcon sx={{ ...iconSx, mr: 0, ml: 0.5 }} />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography sx={labelSx}>Password</Typography>
                <Box sx={shellSx}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    autoComplete="new-password"
                    style={inputStyle}
                  />
                  <IconButton
                    type="button"
                    size="small"
                    onClick={() => setShowPassword((p) => !p)}
                    sx={{ color: "var(--secondary-color, #024DAF)", ml: 0.5 }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <VisibilityIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-start" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                minWidth: 160,
                px: 3,
                py: 1.25,
                borderRadius: "4px",
                color: "var(--white, #FFFFFF)",
                bgcolor: "var(--secondary-color, #024DAF)",
                boxShadow: "none",
                "&:hover": {
                  color: "var(--white, #FFFFFF)",
                  bgcolor: "var(--secondary-color, #024DAF)",
                  opacity: 0.92,
                  boxShadow: "none",
                },
              }}
            >
              Add Staff
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddUser;
