import React, { useState, useCallback, useEffect, memo } from "react";
import { Box, Typography, Button, Checkbox, Grid, IconButton, Select, MenuItem, FormControl } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PublicLayout from "../../components/layout/PublicLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CustomInputField = memo(
  ({
    label,
    icon: Icon,
    value,
    onChange,
    type = "text",
    placeholder,
    name,
    startAdornment,
    endAdornment,
    errorText,
  }) => (
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
        {Icon && (
          <Icon
            sx={{
              color: "#9E9E9E",
              mr: 2,
              fontSize: "20px",
            }}
          />
        )}
        {startAdornment}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="registration-input"
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            fontSize: "16px",
            padding: "8px 0",
            color: "#202124",
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        />
        {endAdornment}
      </Box>
      {errorText ? (
        <Typography sx={{ mt: 0.5, fontSize: 11, color: "#d32f2f" }}>
          {errorText}
        </Typography>
      ) : null}
      <style>{`
        .registration-input {
          background: transparent !important;
          box-shadow: none !important;
          -webkit-appearance: none;
          appearance: none;
        }
        .registration-input:focus {
          outline: none !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        .registration-input::selection {
          background: transparent;
        }
        .registration-input::-moz-selection {
          background: transparent;
        }
        .registration-input:-webkit-autofill,
        .registration-input:-webkit-autofill:hover,
        .registration-input:-webkit-autofill:focus,
        .registration-input:-webkit-autofill:active {
          background-color: transparent !important;
          -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
          box-shadow: 0 0 0 1000px transparent inset !important;
          -webkit-text-fill-color: #202124 !important;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </Box>
  )
);

const CustomSelectField = memo(
  ({ label, icon: Icon, value, onChange, options, placeholder, name, errorText }) => (
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
        {Icon && (
          <Icon
            sx={{
              color: "#9E9E9E",
              mr: 2,
              fontSize: "20px",
            }}
          />
        )}
        <Box sx={{ flex: 1 }}>
          <select
            name={name}
            value={value}
            onChange={onChange}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "16px",
              color: "#202124",
              backgroundColor: "transparent",
              padding: "8px 0",
            }}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Box>
      </Box>
      {errorText ? (
        <Typography sx={{ mt: 0.5, fontSize: 11, color: "#d32f2f" }}>
          {errorText}
        </Typography>
      ) : null}
    </Box>
  )
);

const Regstion = () => {
  const navigate = useNavigate();
  const mobileCodeOptions = [
    { value: "+60", label: "Malaysia", flagCode: "my" },
    { value: "+880", label: "Bangladesh", flagCode: "bd" },
    { value: "+971", label: "UAE", flagCode: "ae" },
    { value: "+966", label: "Saudi Arabia", flagCode: "sa" },
    { value: "+974", label: "Qatar", flagCode: "qa" },
    { value: "+1", label: "USA", flagCode: "us" },
    { value: "+44", label: "UK", flagCode: "gb" },
    { value: "+91", label: "India", flagCode: "in" },
    { value: "+92", label: "Pakistan", flagCode: "pk" },
    { value: "+62", label: "Indonesia", flagCode: "id" },
    { value: "+65", label: "Singapore", flagCode: "sg" },
    { value: "+66", label: "Thailand", flagCode: "th" },
  ];

  const getFlagUrl = (flagCode) => `https://flagcdn.com/w20/${flagCode}.png`;

  // Format mobile number based on country code
  const formatMobileNumber = (value, countryCode) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    
    // Apply formatting based on country code
    if (countryCode === "+1") {
      // USA/Canada: (XXX) XXX-XXXX
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (countryCode === "+44") {
      // UK: XXXX XXXXXX
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)} ${digits.slice(4, 10)}`;
    } else if (countryCode === "+60") {
      // Malaysia: XXX-XXX XXXX
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    } else if (countryCode === "+880") {
      // Bangladesh: XXXX-XXXXXX
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)}-${digits.slice(4, 10)}`;
    } else {
      // Default: just digits
      return digits;
    }
  };
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    companyAddress: "",
    email: "",
    businessType: "",
    mobileCode: "+60",
    mobile: "",
    password: "",
    termsAndConditions: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [documents, setDocuments] = useState({
    tinCopy: null,
    nidCopy: null,
    civilAviationCopy: null,
  });
  const [documentPreviews, setDocumentPreviews] = useState({
    tinCopy: "",
    nidCopy: "",
    civilAviationCopy: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});


  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Handle mobile code change
    if (name === "mobileCode") {
      setFormData((prevData) => {
        // Reformat mobile number with new country code
        const formatted = prevData.mobile ? formatMobileNumber(prevData.mobile, value) : "";
        return { ...prevData, [name]: value, mobile: formatted };
      });
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }
    
    // Handle mobile number change with formatting
    if (name === "mobile") {
      const formatted = formatMobileNumber(value, formData.mobileCode);
      setFormData((prevData) => ({ ...prevData, [name]: formatted }));
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }
    
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }, [formData.mobileCode]);

  const handleSubmit = async () => {
    const notifyError = (message) => {
      toast.error(message || "An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    };
    const notifySuccess = (message) => {
      toast.success(message || "Success", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    };

    const requiredFields = [
      "name",
      "companyName",
      "companyAddress",
      "email",
      "businessType",
      "mobile",
      "password",
    ];
    const missing = requiredFields.filter((field) => !formData[field]);
    const nextErrors = missing.reduce((acc, field) => {
      acc[field] = "This field is required.";
      return acc;
    }, {});
    if (!formData.termsAndConditions) {
      nextErrors.termsAndConditions = "You must agree to Terms & Conditions.";
    }
    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      notifyError("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const normalizedMobile = String(formData.mobile || "").trim();
      const mobileDigits = normalizedMobile.replace(/\D/g, "");
      const countryCodeDigits = String(formData.mobileCode || "").replace(/\D/g, "");
      const localMobileDigits = mobileDigits.startsWith("0")
        ? mobileDigits.slice(1)
        : mobileDigits;
      const mobileWithCode = normalizedMobile.startsWith("+")
        ? `+${mobileDigits}`
        : `+${countryCodeDigits}${localMobileDigits}`;
      const payload = {
        ...formData,
        mobile: mobileWithCode,
      };
      delete payload.mobileCode;
      const formPayload = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formPayload.append(key, String(value ?? ""));
      });
      if (documents.tinCopy) {
        formPayload.append("tinCopy", documents.tinCopy);
      }
      if (documents.nidCopy) {
        formPayload.append("nidCopy", documents.nidCopy);
      }
      if (documents.civilAviationCopy) {
        formPayload.append("civilAviationCopy", documents.civilAviationCopy);
      }
      const response = await axios.post(
        `${baseUrl}/agent/signup`,
        formPayload
      );
      // Extract success message from response
      const successMessage =
        response?.data?.message ||
        response?.data?.agent?.name
          ? `Agent ${response.data.agent.name} registered successfully.`
          : "Registration successful.";
      notifySuccess(successMessage);
      
      // Store email for OTP verification
      const emailToVerify = formData.email || response?.data?.agent?.email;
      if (emailToVerify) {
        localStorage.setItem("verificationEmail", emailToVerify);
        
        // Navigate to OTP verification page after a short delay
        setTimeout(() => {
          try {
            navigate("/verify-otp", { state: { email: emailToVerify } });
          } catch (navError) {
            console.error("Navigation error:", navError);
            // Fallback: try without state
            navigate("/verify-otp");
          }
        }, 1500);
      } else {
        console.error("No email found for OTP verification");
      }
      
      setFormData({
        name: "",
        companyName: "",
        companyAddress: "",
        email: "",
        businessType: "",
        mobileCode: "+60",
        mobile: "",
        password: "",
        termsAndConditions: false,
      });
      setFieldErrors({});
      setDocuments({
        tinCopy: null,
        nidCopy: null,
        civilAviationCopy: null,
      });
      setDocumentPreviews((prev) => {
        Object.values(prev).forEach((url) => {
          if (url) URL.revokeObjectURL(url);
        });
        return { tinCopy: "", nidCopy: "", civilAviationCopy: "" };
      });
    } catch (error) {
      const apiResponse = error?.response?.data;
      const apiMessage = apiResponse?.message;
      const apiError = apiResponse?.error;
      const statusCode = error?.response?.status;
      
      // Handle different error response formats
      let errorMessage = "";
      if (Array.isArray(apiMessage)) {
        errorMessage = apiMessage.join(", ");
        const nextApiErrors = {};
        apiMessage.forEach((item) => {
          if (/mobile/i.test(item)) {
            nextApiErrors.mobile = item;
          } else if (/email/i.test(item)) {
            nextApiErrors.email = item;
          } else if (/terms/i.test(item)) {
            nextApiErrors.termsAndConditions = item;
          }
        });
        if (Object.keys(nextApiErrors).length) {
          setFieldErrors((prev) => ({ ...prev, ...nextApiErrors }));
        }
      } else if (typeof apiMessage === "string" && apiMessage.trim()) {
        errorMessage = apiMessage;
        // Set field-specific errors for common cases
        if (/email.*exist/i.test(apiMessage) || statusCode === 409) {
          setFieldErrors((prev) => ({ ...prev, email: apiMessage }));
        } else if (/mobile/i.test(apiMessage)) {
          setFieldErrors((prev) => ({ ...prev, mobile: apiMessage }));
        }
      } else if (typeof apiError === "string" && apiError.trim()) {
        errorMessage = apiError;
      } else if (typeof apiResponse === "string" && apiResponse.trim()) {
        errorMessage = apiResponse;
      } else if (statusCode === 409) {
        // Handle 409 Conflict specifically
        errorMessage = apiMessage || "Email already exists. Please use a different email address.";
        setFieldErrors((prev) => ({ ...prev, email: errorMessage }));
      } else {
        errorMessage = error?.message || "Registration failed. Please try again.";
      }
      
      // Always show error toast - ensure it's called
      if (errorMessage) {
        notifyError(errorMessage);
      } else {
        notifyError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (field) => (event) => {
    const file = event.target.files?.[0] || null;
    setDocuments((prev) => ({ ...prev, [field]: file }));
    setDocumentPreviews((prev) => {
      if (prev[field]) {
        URL.revokeObjectURL(prev[field]);
      }
      return { ...prev, [field]: file ? URL.createObjectURL(file) : "" };
    });
  };

  useEffect(() => {
    return () => {
      Object.values(documentPreviews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [documentPreviews]);

  const isImageFile = (file) => Boolean(file?.type?.startsWith("image/"));

  const getCompactFileName = (file, fallback) => {
    const name = file?.name;
    if (!name) return fallback;
    if (name.length <= 28) return name;
    const extensionIndex = name.lastIndexOf(".");
    const extension = extensionIndex > -1 ? name.slice(extensionIndex) : "";
    const base = extensionIndex > -1 ? name.slice(0, extensionIndex) : name;
    return `${base.slice(0, 18)}...${extension}`;
  };

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

          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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
                errorText={fieldErrors.name}
              />
              <CustomInputField
                label="Company Name"
                name="companyName"
                icon={LockIcon}
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                errorText={fieldErrors.companyName}
              />
              <CustomInputField
                label="Company Address"
                name="companyAddress"
                icon={LockIcon}
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="Enter company address"
                errorText={fieldErrors.companyAddress}
              />
              <CustomInputField
                label="Email"
                name="email"
                icon={EmailIcon}
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email"
                errorText={fieldErrors.email}
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
                errorText={fieldErrors.businessType}
              />
              <CustomInputField
                label="Mobile"
                name="mobile"
                icon={PhoneIcon}
                errorText={fieldErrors.mobile}
                value={formData.mobile}
                onChange={handleChange}
                type="tel"
                placeholder="Enter mobile number"
                startAdornment={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1 }}>
                    <FormControl
                      variant="standard"
                      sx={{
                        minWidth: 120,
                        border: "none",
                        outline: "none",
                        backgroundColor: "transparent",
                        "& .MuiInput-root": {
                          border: "none",
                          outline: "none",
                          backgroundColor: "transparent",
                          "&:before": {
                            borderBottom: "none !important",
                            display: "none",
                          },
                          "&:hover:before": {
                            borderBottom: "none !important",
                            display: "none",
                          },
                          "&:after": {
                            borderBottom: "none !important",
                            display: "none",
                          },
                          "&.Mui-focused:before": {
                            borderBottom: "none !important",
                            display: "none",
                          },
                          "&.Mui-focused:after": {
                            borderBottom: "none !important",
                            display: "none",
                          },
                        },
                      }}
                    >
                      <Select
                        name="mobileCode"
                        value={formData.mobileCode}
                        onChange={handleChange}
                        renderValue={(selected) => {
                          const option = mobileCodeOptions.find((opt) => opt.value === selected);
                          return (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              {option && (
                                <>
                                  <Box
                                    component="img"
                                    src={getFlagUrl(option.flagCode)}
                                    alt={`${option.label} flag`}
                                    sx={{ width: 18, height: 12, borderRadius: "2px" }}
                                  />
                                  <Box component="span" sx={{ fontSize: 13, fontWeight: 500 }}>
                                    {selected}
                                  </Box>
                                </>
                              )}
                            </Box>
                          );
                        }}
                        sx={{
                          fontSize: 13,
                          height: 30,
                          border: "none !important",
                          outline: "none !important",
                          backgroundColor: "transparent !important",
                          boxShadow: "none !important",
                          "& .MuiSelect-select": {
                            py: 0.5,
                            display: "flex",
                            alignItems: "center",
                            border: "none !important",
                            outline: "none !important",
                            backgroundColor: "transparent !important",
                            boxShadow: "none !important",
                          },
                          "& .MuiSelect-icon": {
                            fontSize: 18,
                            color: "#5F6368",
                          },
                          "&:before": {
                            borderBottom: "none !important",
                            display: "none",
                          },
                          "&:hover:before": {
                            borderBottom: "none !important",
                            display: "none",
                          },
                          "&:after": {
                            borderBottom: "none !important",
                            display: "none",
                          },
                          "&.Mui-focused": {
                            borderBottom: "none !important",
                            outline: "none !important",
                            backgroundColor: "transparent !important",
                            boxShadow: "none !important",
                          },
                          "&.Mui-focused:before": {
                            borderBottom: "none !important",
                            display: "none",
                          },
                          "&.Mui-focused:after": {
                            borderBottom: "none !important",
                            display: "none",
                          },
                          "&:hover": {
                            borderBottom: "none !important",
                            backgroundColor: "transparent !important",
                          },
                        }}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                          },
                          PaperProps: {
                            sx: {
                              maxHeight: 300,
                              mt: 0.5,
                            },
                          },
                        }}
                      >
                        {mobileCodeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box
                                component="img"
                                src={getFlagUrl(option.flagCode)}
                                alt={`${option.label} flag`}
                                sx={{ width: 20, height: 14, borderRadius: "2px" }}
                              />
                              <Box component="span" sx={{ fontSize: 13 }}>
                                {option.value} - {option.label}
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                }
              />
              <CustomInputField
                label="Password"
                name="password"
                icon={LockIcon}
                value={formData.password}
                onChange={handleChange}
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                errorText={fieldErrors.password}
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={() => setPasswordVisible((prev) => !prev)}
                    sx={{ color: "#5F6368", ml: 1 }}
                  >
                    {passwordVisible ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                }
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
                  title={documents.tinCopy?.name || "Choose TIN Copy"}
                  sx={{
                    borderColor: "var(--primary-color)",
                    color: "var(--primary-color)",
                    textTransform: "none",
                    height:"40px",
                    py: 1.5,
                    borderRadius: "4px",
                    justifyContent: "flex-start",
                    overflow: "hidden",
                    "& .MuiButton-startIcon": {
                      mr: 0.75,
                    },
                    "&:hover": {
                      borderColor: "var(--primary-color)",
                      bgcolor: "rgba(18, 61, 110, 0.04)",
                    },
                  }}
                  component="label"
                >
                  <Box
                    component="span"
                    sx={{
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    {getCompactFileName(documents.tinCopy, "Choose TIN Copy")}
                  </Box>
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange("tinCopy")}
                  />
                </Button>
                {documents.tinCopy && documentPreviews.tinCopy && isImageFile(documents.tinCopy) ? (
                  <Box
                    component="img"
                    src={documentPreviews.tinCopy}
                    alt="TIN Preview"
                    sx={{
                      mt: 1,
                      width: "100%",
                      height: 150,
                      objectFit: "contain",
                      borderRadius: "4px",
                      border: "1px solid #E0E0E0",
                      bgcolor: "#fff",
                    }}
                  />
                ) : null}
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  title={documents.nidCopy?.name || "Choose NID Copy"}
                  sx={{
                    borderColor: "var(--primary-color)",
                    color: "var(--primary-color)",
                    textTransform: "none",
                    py: 1.5,
                    height:"40px",
                    borderRadius: "4px",
                    justifyContent: "flex-start",
                    overflow: "hidden",
                    "& .MuiButton-startIcon": {
                      mr: 0.75,
                    },
                    "&:hover": {
                      borderColor: "var(--primary-color)",
                      bgcolor: "rgba(18, 61, 110, 0.04)",
                    },
                  }}
                  component="label"
                >
                  <Box
                    component="span"
                    sx={{
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    {getCompactFileName(documents.nidCopy, "Choose NID Copy")}
                  </Box>
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange("nidCopy")}
                  />
                </Button>
                {documents.nidCopy && documentPreviews.nidCopy && isImageFile(documents.nidCopy) ? (
                  <Box
                    component="img"
                    src={documentPreviews.nidCopy}
                    alt="NID Preview"
                    sx={{
                      mt: 1,
                      width: "100%",
                      height: 150,
                      objectFit: "contain",
                      borderRadius: "4px",
                      border: "1px solid #E0E0E0",
                      bgcolor: "#fff",
                    }}
                  />
                ) : null}
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  title={documents.civilAviationCopy?.name || "Choose Civil Aviation Copy"}
                  sx={{
                    borderColor: "var(--primary-color)",
                    color: "var(--primary-color)",
                    textTransform: "none",
                    py: 1.5,
                    height:"40px",
                    borderRadius: "4px",
                    justifyContent: "flex-start",
                    overflow: "hidden",
                    "& .MuiButton-startIcon": {
                      mr: 0.75,
                    },
                    "&:hover": {
                      borderColor: "var(--primary-color)",
                      bgcolor: "rgba(18, 61, 110, 0.04)",
                    },
                  }}
                  component="label"
                >
                  <Box
                    component="span"
                    sx={{
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    {getCompactFileName(documents.civilAviationCopy, "Choose Civil Aviation Copy")}
                  </Box>
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange("civilAviationCopy")}
                  />
                </Button>
                {documents.civilAviationCopy &&
                documentPreviews.civilAviationCopy &&
                isImageFile(documents.civilAviationCopy) ? (
                  <Box
                    component="img"
                    src={documentPreviews.civilAviationCopy}
                    alt="Civil Aviation Preview"
                    sx={{
                      mt: 1,
                      width: "100%",
                      height: 150,
                      objectFit: "contain",
                      borderRadius: "4px",
                      border: "1px solid #E0E0E0",
                      bgcolor: "#fff",
                    }}
                  />
                ) : null}
              </Grid>
            </Grid>
            </Box>

            {/* Terms & Conditions */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Checkbox
              checked={formData.termsAndConditions}
              onChange={(e) => {
                setFormData((prevData) => ({ ...prevData, termsAndConditions: e.target.checked }));
                setFieldErrors((prev) => ({ ...prev, termsAndConditions: "" }));
              }}
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
            {fieldErrors.termsAndConditions ? (
              <Typography sx={{ mt: -2, mb: 3, fontSize: 11, color: "#d32f2f" }}>
                {fieldErrors.termsAndConditions}
              </Typography>
            ) : null}

            {/* Register Button */}
            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
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
              {isSubmitting ? "Submitting..." : "Register as a Agent"}
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
      </Box>
    </PublicLayout>
  );
};

export default Regstion;