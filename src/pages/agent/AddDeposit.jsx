import React, { useState } from "react";
import { Box, Button, Typography, TextField, Tabs, Tab, Input, IconButton, Select, FormControl, MenuItem, CircularProgress } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const headerTitleSx = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
};

const headerSubtitleSx = {
  fontSize: 12,
  color: "#94A3B8",
  mt: 0.4,
};

const tabSx = {
  textTransform: "none",
  fontSize: 13,
  fontWeight: 600,
  minHeight: 32,
  px: 2.5,
  borderRadius: 1,
  color: "#FFFFFF",
  "&.Mui-selected": {
    color: "#0F2F56",
    backgroundColor: "#FFFFFF",
  },
};

const formRowSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "200px 1fr" },
  gap: { xs: 0.5, sm: 3 },
  alignItems: "center",
  py: 1.4,
  borderBottom: "1px solid #E5E7EB",
};

const labelSx = {
  fontSize: 12.5,
  color: "#9CA3AF",
};

const AddDeposit = () => {
  const { agentToken, agentData } = useAuth();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
  const agentEmail = agentData?.email || "";

  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    senderName: "",
    receiverName: "",
    reference: "",
    amount: "",
    currency: "USD",
    cashInput: "",
    documentFile: null,
    documentPreview: null,
    // Cheque specific fields
    chequeNumber: "",
    chequeBank: "",
    chequeIssueDate: null,
  });
  const [loading, setLoading] = useState(false);
  const [chequeDateOpen, setChequeDateOpen] = useState(false);

  // Map tab index to payment method
  const paymentMethods = ["Cash", "Cheque", "Bank Transfer", "Mobile Transfer"];

  // Currency options with flag codes
  const currencies = [
    { code: "USD", label: "USD", flagCode: "us" },
    { code: "BDT", label: "BDT", flagCode: "bd" },
    { code: "CHF", label: "CHF", flagCode: "ch" },
    { code: "MYR", label: "MYR", flagCode: "my" },
    { code: "EUR", label: "EUR", flagCode: "eu" },
    { code: "GBP", label: "GBP", flagCode: "gb" },
    { code: "AED", label: "AED", flagCode: "ae" },
    { code: "SAR", label: "SAR", flagCode: "sa" },
  ];

  const getFlagUrl = (flagCode) => `https://flagcdn.com/w20/${flagCode}.png`;

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          documentFile: file,
          documentPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePreview = () => {
    setFormData((prev) => ({
      ...prev,
      documentFile: null,
      documentPreview: null,
    }));
  };

  const handleDateChange = (field) => (newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleSubmit = async () => {
    const token = agentToken || localStorage.getItem("agentToken") || "";

    if (!token || !agentEmail) {
      toast.error("Agent token or email missing. Please login again.");
      return;
    }

    const paymentMethod = paymentMethods[selectedTab];

    // Validation based on payment method
    if (paymentMethod === "Cheque") {
      if (!formData.chequeNumber || !formData.chequeBank || !formData.chequeIssueDate || !formData.amount || !formData.currency || !formData.reference) {
        toast.error("Please fill in all required fields for Cheque payment.");
        return;
      }
      if (!formData.documentFile) {
        toast.error("Please upload a cheque photo.");
        return;
      }
    } else {
      if (!formData.senderName || !formData.receiverName || !formData.reference || !formData.amount || !formData.currency) {
        toast.error("Please fill in all required fields.");
        return;
      }
    // For Cash, no document file should be sent
    // For other payment methods, document file is required
    if (paymentMethod !== "Cash" && !formData.documentFile) {
        toast.error("Please upload a document for this payment method.");
      return;
      }
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add required fields for all payment methods
      formDataToSend.append("email", agentEmail);
      formDataToSend.append("amount", parseFloat(formData.amount));
      formDataToSend.append("currency", formData.currency);
      formDataToSend.append("paymentMethod", paymentMethod);

      // Add fields based on payment method
      if (paymentMethod === "Cheque") {
        // Cheque specific fields
        if (formData.chequeNumber) {
          formDataToSend.append("chequeNumber", formData.chequeNumber);
        }
        if (formData.chequeBank) {
          formDataToSend.append("chequeBankName", formData.chequeBank);
        }
        if (formData.chequeIssueDate) {
          formDataToSend.append("chequeIssueDate", formData.chequeIssueDate.format("YYYY-MM-DD"));
        }
        if (formData.reference) {
          formDataToSend.append("reference", formData.reference);
        }
      } else {
        // Cash and other payment methods
        if (formData.senderName) {
          formDataToSend.append("depositerName", formData.senderName);
        }
        if (formData.receiverName) {
          formDataToSend.append("receiverName", formData.receiverName);
        }
        if (formData.reference) {
          formDataToSend.append("reference", formData.reference);
        }
      }

      // Add document file if provided (optional for Cash, required for others)
      if (formData.documentFile) {
        formDataToSend.append("file", formData.documentFile);
      }

      const response = await axios.post(`${baseUrl}/deposit`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Deposit request submitted successfully!");

      // Reset form
      setFormData({
        senderName: "",
        receiverName: "",
        reference: "",
        amount: "",
        currency: "USD",
        cashInput: "",
        documentFile: null,
        documentPreview: null,
        chequeNumber: "",
        chequeBank: "",
        chequeIssueDate: null,
      });
      setSelectedTab(0);

      // Navigate to agent deposit page after a short delay
      setTimeout(() => {
        navigate("/dashboard/agentdeposit");
      }, 1000);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to submit deposit request.";
      toast.error(errorMessage);
      console.error("Submit deposit failed:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        px: { xs: 2, md: 9.5 },
        my: "30px",
        mx: "80px",
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Header */}
      <Box>
        <Typography sx={headerTitleSx}>My Wallet</Typography>
        <Typography sx={headerSubtitleSx}>
          Basic info, for a faster booking experience
        </Typography>
      </Box>

      {/* Tab Bar */}
      <Box
        sx={{
          borderRadius: 1.5,
          backgroundColor: "#0F2F56",
          overflow: "hidden",
          width: "fit-content",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTabs-indicator": {
              display: "none",
            },
            "& .MuiTabs-flexContainer": {
              gap: 0.5,
            },
            minHeight: 40,
            p: 0.5,
          }}
        >
          <Tab disableRipple label="Cash" sx={tabSx} />
          <Tab disableRipple label="Cheque" sx={tabSx} />
          <Tab disableRipple label="Bank Tranasfer" sx={tabSx} />
          <Tab disableRipple label="Mobile Trnasfer" sx={tabSx} />
        </Tabs>
      </Box>

      {/* Form Section */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Common fields for all payment methods */}
        {selectedTab !== 1 && (
          <>
        <Box sx={formRowSx}>
          <Typography sx={labelSx}>Sender Name</Typography>
          <TextField
            fullWidth
            variant="standard"
            value={formData.senderName}
            onChange={handleInputChange("senderName")}
            sx={{
              "& .MuiInput-root": {
                fontSize: 13.5,
                "&:before": {
                  borderBottom: "none !important",
                },
                "&:hover:before": {
                  borderBottom: "none !important",
                },
                "&:after": {
                  borderBottom: "none !important",
                },
                "&.Mui-focused:after": {
                  borderBottom: "none !important",
                },
              },
            }}
          />
        </Box>
        <Box sx={formRowSx}>
          <Typography sx={labelSx}>Receiver Name</Typography>
          <TextField
            fullWidth
            variant="standard"
            value={formData.receiverName}
            onChange={handleInputChange("receiverName")}
            sx={{
              "& .MuiInput-root": {
                fontSize: 13.5,
                "&:before": {
                  borderBottom: "none !important",
                },
                "&:hover:before": {
                  borderBottom: "none !important",
                },
                "&:after": {
                  borderBottom: "none !important",
                },
                "&.Mui-focused:after": {
                  borderBottom: "none !important",
                },
              },
            }}
          />
        </Box>
        <Box sx={formRowSx}>
          <Typography sx={labelSx}>Refference</Typography>
          <TextField
            fullWidth
            variant="standard"
            value={formData.reference}
            onChange={handleInputChange("reference")}
            sx={{
              "& .MuiInput-root": {
                fontSize: 13.5,
                "&:before": {
                  borderBottom: "none !important",
                },
                "&:hover:before": {
                  borderBottom: "none !important",
                },
                "&:after": {
                  borderBottom: "none !important",
                },
                "&.Mui-focused:after": {
                  borderBottom: "none !important",
                },
              },
            }}
          />
        </Box>
        <Box sx={formRowSx}>
          <Typography sx={labelSx}>Enter Amount</Typography>
          <TextField
            fullWidth
            type="number"
            variant="standard"
            value={formData.amount}
            onChange={handleInputChange("amount")}
            sx={{
              "& .MuiInput-root": {
                fontSize: 13.5,
                "&:before": {
                  borderBottom: "none !important",
                },
                "&:hover:before": {
                  borderBottom: "none !important",
                },
                "&:after": {
                  borderBottom: "none !important",
                },
                "&.Mui-focused:after": {
                  borderBottom: "none !important",
                },
              },
            }}
          />
        </Box>
          </>
        )}

        {/* Cheque specific fields */}
        {selectedTab === 1 && (
          <>
            <Box sx={formRowSx}>
              <Typography sx={labelSx}>Cheque Number</Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Cheque Number"
                value={formData.chequeNumber}
                onChange={handleInputChange("chequeNumber")}
                sx={{
                  "& .MuiInput-root": {
                    fontSize: 13.5,
                    "&:before": {
                      borderBottom: "none !important",
                    },
                    "&:hover:before": {
                      borderBottom: "none !important",
                    },
                    "&:after": {
                      borderBottom: "none !important",
                    },
                    "&.Mui-focused:after": {
                      borderBottom: "none !important",
                    },
                  },
                }}
              />
            </Box>
            <Box sx={formRowSx}>
              <Typography sx={labelSx}>Cheque Issue from Bank</Typography>
              <FormControl fullWidth variant="standard">
                <Select
                  value={formData.chequeBank}
                  onChange={handleInputChange("chequeBank")}
                  displayEmpty
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
                      style: {
                        maxHeight: 300,
                      },
                    },
                  }}
                  sx={{
                    fontSize: 13.5,
                    backgroundColor: "transparent",
                    "& .MuiSelect-select": {
                      py: 0.5,
                      backgroundColor: "transparent",
                    },
                    "&:before": {
                      borderBottom: "none !important",
                    },
                    "&:hover:before": {
                      borderBottom: "none !important",
                    },
                    "&:after": {
                      borderBottom: "none !important",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "transparent",
                      outline: "none",
                      "&:after": {
                        borderBottom: "none !important",
                      },
                    },
                    "&:focus": {
                      outline: "none",
                      backgroundColor: "transparent",
                    },
                    "& .MuiSelect-icon": {
                      color: "#111827",
                    },
                  }}
                  disableUnderline
                >
                  <MenuItem value="" disabled>
                    <Box component="span" sx={{ color: "#9CA3AF", fontSize: 13.5 }}>
                      Select Bank
                    </Box>
                  </MenuItem>
                  <MenuItem value="Sonali Bank">Sonali Bank</MenuItem>
                  <MenuItem value="Janata Bank">Janata Bank</MenuItem>
                  <MenuItem value="Agrani Bank">Agrani Bank</MenuItem>
                  <MenuItem value="Rupali Bank">Rupali Bank</MenuItem>
                  <MenuItem value="Bangladesh Development Bank">Bangladesh Development Bank</MenuItem>
                  <MenuItem value="BASIC Bank">BASIC Bank</MenuItem>
                  <MenuItem value="Dutch-Bangla Bank">Dutch-Bangla Bank</MenuItem>
                  <MenuItem value="BRAC Bank">BRAC Bank</MenuItem>
                  <MenuItem value="Eastern Bank">Eastern Bank</MenuItem>
                  <MenuItem value="Dhaka Bank">Dhaka Bank</MenuItem>
                  <MenuItem value="IFIC Bank">IFIC Bank</MenuItem>
                  <MenuItem value="Islami Bank Bangladesh">Islami Bank Bangladesh</MenuItem>
                  <MenuItem value="Jamuna Bank">Jamuna Bank</MenuItem>
                  <MenuItem value="Mercantile Bank">Mercantile Bank</MenuItem>
                  <MenuItem value="Mutual Trust Bank">Mutual Trust Bank</MenuItem>
                  <MenuItem value="National Bank">National Bank</MenuItem>
                  <MenuItem value="One Bank">One Bank</MenuItem>
                  <MenuItem value="Prime Bank">Prime Bank</MenuItem>
                  <MenuItem value="Pubali Bank">Pubali Bank</MenuItem>
                  <MenuItem value="Shahjalal Islami Bank">Shahjalal Islami Bank</MenuItem>
                  <MenuItem value="Social Islami Bank">Social Islami Bank</MenuItem>
                  <MenuItem value="Southeast Bank">Southeast Bank</MenuItem>
                  <MenuItem value="Standard Bank">Standard Bank</MenuItem>
                  <MenuItem value="Trust Bank">Trust Bank</MenuItem>
                  <MenuItem value="United Commercial Bank">United Commercial Bank</MenuItem>
                  <MenuItem value="Uttara Bank">Uttara Bank</MenuItem>
                  <MenuItem value="City Bank">City Bank</MenuItem>
                  <MenuItem value="First Security Islami Bank">First Security Islami Bank</MenuItem>
                  <MenuItem value="Meghna Bank">Meghna Bank</MenuItem>
                  <MenuItem value="Midland Bank">Midland Bank</MenuItem>
                  <MenuItem value="NRB Bank">NRB Bank</MenuItem>
                  <MenuItem value="NRB Commercial Bank">NRB Commercial Bank</MenuItem>
                  <MenuItem value="NRB Global Bank">NRB Global Bank</MenuItem>
                  <MenuItem value="Shimanto Bank">Shimanto Bank</MenuItem>
                  <MenuItem value="South Bangla Agriculture and Commerce Bank">South Bangla Agriculture and Commerce Bank</MenuItem>
                  <MenuItem value="Union Bank">Union Bank</MenuItem>
                  <MenuItem value="Standard Chartered Bank">Standard Chartered Bank</MenuItem>
                  <MenuItem value="HSBC Bank">HSBC Bank</MenuItem>
                  <MenuItem value="Citibank N.A.">Citibank N.A.</MenuItem>
                  <MenuItem value="Commercial Bank of Ceylon">Commercial Bank of Ceylon</MenuItem>
                  <MenuItem value="State Bank of India">State Bank of India</MenuItem>
                  <MenuItem value="Woori Bank">Woori Bank</MenuItem>
                  <MenuItem value="Bank Al-Falah">Bank Al-Falah</MenuItem>
                  <MenuItem value="Habib Bank">Habib Bank</MenuItem>
                  <MenuItem value="National Bank of Pakistan">National Bank of Pakistan</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={formRowSx}>
              <Typography sx={labelSx}>Cheque Issue Date</Typography>
              <DatePicker
                value={formData.chequeIssueDate}
                onChange={handleDateChange("chequeIssueDate")}
                open={chequeDateOpen}
                onOpen={() => setChequeDateOpen(true)}
                onClose={() => setChequeDateOpen(false)}
                format="DD MMM YYYY"
                slots={{ openPickerIcon: CalendarTodayIcon }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "standard",
                    placeholder: "Cheque Issue Date",
                    sx: {
                      "& .MuiInput-root": {
                        fontSize: 13.5,
                        "&:before": {
                          borderBottom: "none !important",
                        },
                        "&:hover:before": {
                          borderBottom: "none !important",
                        },
                        "&:after": {
                          borderBottom: "none !important",
                        },
                        "&.Mui-focused:after": {
                          borderBottom: "none !important",
                        },
                      },
                    },
                    onClick: () => setChequeDateOpen(true),
                    inputProps: { readOnly: true },
                  },
                  openPickerIcon: {
                    sx: { fontSize: 18, color: "#9CA3AF" },
                  },
                }}
              />
            </Box>
            <Box sx={formRowSx}>
              <Typography sx={labelSx}>Amount</Typography>
              <TextField
                fullWidth
                type="number"
                variant="standard"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleInputChange("amount")}
                sx={{
                  "& .MuiInput-root": {
                    fontSize: 13.5,
                    "&:before": {
                      borderBottom: "none !important",
                    },
                    "&:hover:before": {
                      borderBottom: "none !important",
                    },
                    "&:after": {
                      borderBottom: "none !important",
                    },
                    "&.Mui-focused:after": {
                      borderBottom: "none !important",
                    },
                  },
                }}
              />
            </Box>
            <Box sx={formRowSx}>
              <Typography sx={labelSx}>Currency</Typography>
              <FormControl fullWidth variant="standard">
                <Select
                  value={formData.currency}
                  onChange={handleInputChange("currency")}
                  renderValue={(value) => {
                    const selected = currencies.find((item) => item.code === value);
                    return (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                        <Box
                          component="img"
                          src={selected ? getFlagUrl(selected.flagCode) : ""}
                          alt={selected?.label || "Flag"}
                          sx={{ width: 18, height: 12, borderRadius: "2px" }}
                        />
                        <Box component="span" sx={{ fontSize: 13.5 }}>
                          {selected?.label || value}
                        </Box>
                      </Box>
                    );
                  }}
                  sx={{
                    fontSize: 13.5,
                    backgroundColor: "transparent",
                    "& .MuiSelect-select": {
                      py: 0.5,
                      backgroundColor: "transparent",
                    },
                    "&:before": {
                      borderBottom: "none !important",
                    },
                    "&:hover:before": {
                      borderBottom: "none !important",
                    },
                    "&:after": {
                      borderBottom: "none !important",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "transparent",
                      outline: "none",
                      "&:after": {
                        borderBottom: "none !important",
                      },
                    },
                    "&:focus": {
                      outline: "none",
                      backgroundColor: "transparent",
                    },
                    "& .MuiSelect-icon": {
                      color: "#111827",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                      outline: "none",
                    },
                  }}
                  disableUnderline
                >
                  {currencies.map((item) => (
                    <MenuItem key={item.code} value={item.code}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                        <Box
                          component="img"
                          src={getFlagUrl(item.flagCode)}
                          alt={`${item.label} flag`}
                          sx={{ width: 18, height: 12, borderRadius: "2px" }}
                        />
                        <Box component="span" sx={{ fontSize: 13.5 }}>
                          {item.label}
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={formRowSx}>
              <Typography sx={labelSx}>Reference (Reference No etc)</Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Reference"
                value={formData.reference}
                onChange={handleInputChange("reference")}
                sx={{
                  "& .MuiInput-root": {
                    fontSize: 13.5,
                    "&:before": {
                      borderBottom: "none !important",
                    },
                    "&:hover:before": {
                      borderBottom: "none !important",
                    },
                    "&:after": {
                      borderBottom: "none !important",
                    },
                    "&.Mui-focused:after": {
                      borderBottom: "none !important",
                    },
                  },
                }}
              />
            </Box>
          </>
        )}
        {/* Currency field - only for non-Cheque tabs */}
        {selectedTab !== 1 && (
        <Box sx={formRowSx}>
          <Typography sx={labelSx}>Currency</Typography>
          <FormControl fullWidth variant="standard">
            <Select
              value={formData.currency}
              onChange={handleInputChange("currency")}
              renderValue={(value) => {
                const selected = currencies.find((item) => item.code === value);
                return (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <Box
                      component="img"
                      src={selected ? getFlagUrl(selected.flagCode) : ""}
                      alt={selected?.label || "Flag"}
                      sx={{ width: 18, height: 12, borderRadius: "2px" }}
                    />
                    <Box component="span" sx={{ fontSize: 13.5 }}>
                      {selected?.label || value}
                    </Box>
                  </Box>
                );
              }}
              sx={{
                fontSize: 13.5,
                backgroundColor: "transparent",
                "& .MuiSelect-select": {
                  py: 0.5,
                  backgroundColor: "transparent",
                },
                "&:before": {
                  borderBottom: "none !important",
                },
                "&:hover:before": {
                  borderBottom: "none !important",
                },
                "&:after": {
                  borderBottom: "none !important",
                },
                "&.Mui-focused": {
                  backgroundColor: "transparent",
                  outline: "none",
                  "&:after": {
                  borderBottom: "none !important",
                  },
                },
                "&:focus": {
                  outline: "none",
                  backgroundColor: "transparent",
                },
                "& .MuiSelect-icon": {
                  color: "#111827",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                  outline: "none",
                },
              }}
              disableUnderline
            >
              {currencies.map((item) => (
                <MenuItem key={item.code} value={item.code}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <Box
                      component="img"
                      src={getFlagUrl(item.flagCode)}
                      alt={`${item.label} flag`}
                      sx={{ width: 18, height: 12, borderRadius: "2px" }}
                    />
                    <Box component="span" sx={{ fontSize: 13.5 }}>
                      {item.label}
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        )}
        
        {/* Document Upload for All Payment Methods */}
        <Box sx={formRowSx}>
          <Typography sx={labelSx}>
            {selectedTab === 1 ? "Cheque Photo" : "Upload Document"}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              sx={{
                fontSize: 12.5,
                color: "#111827",
                mb: 0.5,
              }}
            >
              {selectedTab === 1 
                ? "Cheque Photo (Max 5MB, PDF/JPG/PNG/JFIF)"
                : "Document of Proof (Max 5MB, JPG/PNG/JFIF)"}
            </Typography>
            {formData.documentPreview && (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: 500,
                  mb: 1,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid #E5E7EB",
                }}
              >
                <IconButton
                  onClick={handleRemovePreview}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "#FFFFFF",
                    width: 32,
                    height: 32,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <img
                  src={formData.documentPreview}
                  alt="Document preview"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </Box>
            )}
            <Button
              component="label"
              variant="contained"
              startIcon={<AttachFileIcon />}
              sx={{
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: "var(--primary-color, #123D6E)",
                color: "#FFFFFF",
                width: "fit-content",
                px: 2.5,
                py: 1,
                "&:hover": {
                  backgroundColor: "var(--primary-color, #0F2F56)",
                  opacity: 0.9,
                },
                "& .MuiSvgIcon-root": {
                  color: "#FFFFFF",
                },
              }}
            >
              Choose File
              <Input
                type="file"
                sx={{ display: "none" }}
                onChange={handleFileChange}
                accept={selectedTab === 1 
                  ? "image/jpeg,image/jpg,image/png,image/jfif,application/pdf"
                  : "image/jpeg,image/jpg,image/png,image/jfif"}
              />
            </Button>
            <Typography
              sx={{
                fontSize: 12,
                color: formData.documentFile ? "#6B7280" : "#9CA3AF",
                fontStyle: "italic",
                mt: 0.5,
              }}
            >
              {formData.documentFile ? `Selected: ${formData.documentFile.name}` : "No file chosen"}
            </Typography>
          </Box>
        </Box>
      </Box>
      </LocalizationProvider>

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} sx={{ color: "#FFFFFF" }} /> : null}
          sx={{
            textTransform: "none",
            fontSize: 13,
            fontWeight: 600,
            px: 3,
            py: 1.2,
            backgroundColor: "#2F2F2F",
            "&:hover": { backgroundColor: "#1F1F1F" },
            "&:disabled": {
              backgroundColor: "#9CA3AF",
            },
          }}
        >
          {loading ? "Submitting..." : "Submit Deposit Request"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddDeposit;
