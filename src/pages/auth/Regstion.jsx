import React, { useState, useCallback, memo } from "react";
import { Box, Typography, Button, Checkbox, Grid, Select, MenuItem, FormControl } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PublicLayout from "../../components/layout/PublicLayout";
import { useNavigate } from "react-router-dom";

const CustomInputField = memo(({ label, icon: Icon, value, onChange, type = "text", placeholder, name }) => (
    <Box sx={{ mb: 3 }}>
      <Typography
        sx={{
          fontSize: "14px",
          color: "#5F6368",
          fontWeight: 500,
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #E0E0E0",
          pb: 1,
          "&:focus-within": {
            borderBottom: "2px solid var(--primary-color)",
          },
        }}
      >
        <Icon
          sx={{
            color: "#9E9E9E",
            mr: 2,
            fontSize: "20px",
          }}
        />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            fontSize: "16px",
            padding: "8px 0",
            color: "#202124",
          }}
        />
      </Box>
    </Box>
  ));

const CustomSelectField = memo(({ label, icon: Icon, value, onChange, options, placeholder, name }) => (
    <Box sx={{ mb: 3 }}>
      <Typography
        sx={{
          fontSize: "14px",
          color: "#5F6368",
          fontWeight: 500,
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #E0E0E0",
          pb: 1,
          "&:focus-within": {
            borderBottom: "2px solid var(--primary-color)",
          },
        }}
      >
        <Icon
          sx={{
            color: "#9E9E9E",
            mr: 2,
            fontSize: "20px",
          }}
        />
        <FormControl fullWidth sx={{ border: "none" }}>
          <Select
            name={name}
            value={value}
            onChange={onChange}
            displayEmpty
            sx={{
              border: "none",
              outline: "none",
              fontSize: "16px",
              color: "#202124",
              "&:before": {
                display: "none",
              },
              "&:after": {
                display: "none",
              },
              "& .MuiSelect-select": {
                padding: "8px 0",
                paddingRight: "32px !important",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: "4px",
                  mt: 1,
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              <em style={{ color: "#9E9E9E" }}>{placeholder}</em>
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  ));

const Regstion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    companyAddress: "",
    email: "",
    businessType: "",
    mobile: "",
    password: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  return (
    <PublicLayout>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f2f2f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
        }}
      >
        <Box
          sx={{
            bgcolor: "var(--white)",
            width: "100%",
            maxWidth: "900px",
            borderRadius: "8px",
            p: 5,
          }}
        >
          <Typography
            sx={{
              color: "var(--primary-color)",
              fontSize: "28px",
              fontWeight: 600,
              mb: 4,
              textAlign: "center",
            }}
          >
            Agent Sign Up
          </Typography>

          {/* Two Column Input Fields */}
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <CustomInputField
                label="Name"
                name="name"
                icon={EmailIcon}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              <CustomInputField
                label="Company Name"
                name="companyName"
                icon={LockIcon}
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
              />
              <CustomInputField
                label="Company Address"
                name="companyAddress"
                icon={LockIcon}
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="Enter company address"
              />
              <CustomInputField
                label="Email"
                name="email"
                icon={EmailIcon}
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email"
              />
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <CustomSelectField
                label="Business Type"
                name="businessType"
                icon={BusinessIcon}
                value={formData.businessType}
                onChange={handleChange}
                placeholder="Select business type"
                options={[
                  { value: "Partnership", label: "Partnership" },
                  { value: "Corporation", label: "Corporation" },
                  { value: "Sole Proprietorship", label: "Sole Proprietorship" },
                  { value: "Private Individual", label: "Private Individual" },
                ]}
              />
              <CustomInputField
                label="Mobile"
                name="mobile"
                icon={PhoneIcon}
                value={formData.mobile}
                onChange={handleChange}
                type="tel"
                placeholder="Enter mobile number"
              />
              <CustomInputField
                label="Password"
                name="password"
                icon={LockIcon}
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Enter your password"
              />
            </Grid>
          </Grid>

          {/* Required Documents Section */}
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography
              sx={{
                fontSize: "16px",
                color: "#202124",
                fontWeight: 500,
                mb: 2,
              }}
            >
              Required Documents
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderColor: "var(--primary-color)",
                    color: "var(--primary-color)",
                    textTransform: "none",
                    height:"40px",
                    py: 1.5,
                    borderRadius: "4px",
                    "&:hover": {
                      borderColor: "var(--primary-color)",
                      bgcolor: "rgba(18, 61, 110, 0.04)",
                    },
                  }}
                  component="label"
                >
                  Choose TIN Copy
                  <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" />
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderColor: "var(--primary-color)",
                    color: "var(--primary-color)",
                    textTransform: "none",
                    py: 1.5,
                    height:"40px",
                    borderRadius: "4px",
                    "&:hover": {
                      borderColor: "var(--primary-color)",
                      bgcolor: "rgba(18, 61, 110, 0.04)",
                    },
                  }}
                  component="label"
                >
                  Choose NID Copy
                  <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" />
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderColor: "var(--primary-color)",
                    color: "var(--primary-color)",
                    textTransform: "none",
                    py: 1.5,
                    height:"40px",
                    borderRadius: "4px",
                    "&:hover": {
                      borderColor: "var(--primary-color)",
                      bgcolor: "rgba(18, 61, 110, 0.04)",
                    },
                  }}
                  component="label"
                >
                  Choose Civil Aviation Copy
                  <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" />
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Terms & Conditions */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Checkbox
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              sx={{
                color: "var(--primary-color)",
                "&.Mui-checked": {
                  color: "var(--primary-color)",
                },
              }}
            />
            <Typography
              sx={{
                fontSize: "14px",
                color: "#5F6368",
              }}
            >
              By creating an account you agree to our{" "}
              <Typography
                component="span"
                sx={{
                  fontSize: "14px",
                  color: "#1976d2",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Terms & Conditions
              </Typography>
            </Typography>
          </Box>

          {/* Register Button */}
          <Button
            fullWidth
            sx={{
              bgcolor: "var(--primary-color)",
              color: "var(--white)",
              py: 1.5,
              fontSize: "16px",
              fontWeight: 500,
              textTransform: "none",
              height: "40px",
              borderRadius: "4px",
              mb: 3,
              "&:hover": {
                bgcolor: "var(--primary-color)",
                opacity: 0.9,
              },
            }}
          >
            Register as a Agent
          </Button>

          {/* Sign In Link */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#5F6368",
              }}
            >
              Already have an Account?{" "}
              <Typography
                component="span"
                onClick={() => navigate("/login")}
                sx={{
                  fontSize: "14px",
                  color: "#1976d2",
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign In
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </PublicLayout>
  );
};

export default Regstion;