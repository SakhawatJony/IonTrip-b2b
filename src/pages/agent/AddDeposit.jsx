import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Tabs,
  Tab,
  Input,
  IconButton,
  Select,
  FormControl,
  MenuItem,
  CircularProgress,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MoneyIcon from "@mui/icons-material/Money";
import DescriptionIcon from "@mui/icons-material/Description";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const secondaryColor = "var(--secondary-color, #024DAF)";

// Screenshot-matching palette
const PAGE_BG = "#FFFFFF";
const PANEL_BG = "#F5F6FF";
const CARD_BORDER = "#E6E9F5";
const FIELD_BG = "#F1F3FF";
const FIELD_BORDER = "#C9CDE2";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#6B7280";
const TAB_INACTIVE_BG = "#ECEFFA";

const tabInactiveSx = {
  textTransform: "none",
  fontSize: 12,
  fontWeight: 600,
  minHeight: 40,
  px: 2,
  borderRadius: "999px",
  color: "#374151",
  backgroundColor: TAB_INACTIVE_BG,
  "&.Mui-selected": {
    color: "#FFFFFF",
    backgroundColor: secondaryColor,
  },
};

const labelSx = {
  fontSize: 11.5,
  fontWeight: 500,
  color: "#374151",
  mb: 0.75,
};

const requiredStarSx = { color: "#DC2626", ml: 0.25 };

const inputBoxSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 12.5,
    color: "#111827",
    backgroundColor: FIELD_BG,
    borderRadius: 1.25,
    height: 40,
    minHeight: 40,
    "& fieldset": { borderColor: FIELD_BORDER },
    "&:hover fieldset": { borderColor: FIELD_BORDER },
    "&.Mui-focused fieldset": { borderColor: secondaryColor, borderWidth: "1px" },
  },
  "& .MuiInputBase-input::placeholder": { color: TEXT_MUTED, opacity: 1 },
};

const selectBoxSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 12.5,
    color: "#111827",
    backgroundColor: FIELD_BG,
    borderRadius: 1.25,
    height: 40,
    minHeight: 40,
    "& fieldset": { borderColor: FIELD_BORDER },
    "&:hover fieldset": { borderColor: FIELD_BORDER },
    "&.Mui-focused fieldset": { borderColor: secondaryColor, borderWidth: "1px" },
    "& .MuiSelect-select": { py: 0.75 },
  },
  "& .MuiSelect-icon": { color: `${secondaryColor} !important` },
};

const BANK_OPTIONS = [
  "RHB BANK",
  "MAYBANK",
  "CIMB Bank",
  "Public Bank",
  "Hong Leong Bank",
  "AmBank",
  "Other",
];

const BRANCH_OPTIONS = [
  "Kuala Lumpur",
  "Selangor",
  "Penang",
  "Johor Bahru",
  "Melaka",
  "Other",
];

const BANK_INFO = [
  {
    name: "RHB BANK",
    accountNumber: "2121 6000 1234 5678",
    accountName: "IonTrip Sdn Bhd",
    swiftCode: "RHBBMYKL",
    branch: "Kuala Lumpur Main",
    branchAddress: "No. 1, Jalan Bukit Bintang, 55100 Kuala Lumpur",
  },
  {
    name: "MAYBANK",
    accountNumber: "5642 1234 5678",
    accountName: "IonTrip Sdn Bhd",
    swiftCode: "MBBEMYKL",
    branch: "Menara Maybank",
    branchAddress: "100, Jalan Tun Perak, 50050 Kuala Lumpur",
  },
];

const TAB_LABELS = [
  { label: "Fund Transfer", icon: <AccountBalanceWalletIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
  { label: "Bank Deposit", icon: <AccountBalanceIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
  { label: "Cash Deposit", icon: <MoneyIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
  { label: "Cheque Deposit", icon: <DescriptionIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
  { label: "Online Top Up", icon: <CreditCardIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
];

const PAYMENT_METHODS = ["Bank Transfer", "Bank Transfer", "Cash", "Cheque", "Mobile Transfer"];

const AddDeposit = () => {
  const { agentToken, agentData } = useAuth();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production-2d3b.up.railway.app";
  const agentEmail = agentData?.email || "";
  const agentDisplayName = agentData?.name || agentData?.fullName || agentEmail || "Agent";
  const walletBalance = Number(agentData?.walletBalance ?? agentData?.balance ?? 0);

  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    issueDate: null,
    transferTime: "",
    bankName: "",
    depositBankLocation: "",
    branchName: "",
    referenceId: "",
    beneficiaryName: "",
    beneficiaryAccountNumber: "",
    recipientReference: "",
    cashPaymentTo: "",
    amount: "",
    documentFile: null,
    documentPreview: null,
    chequeNumber: "",
    chequeFrom: "",
    depositedInAccount: "",
    chequeBank: "",
    chequeIssueDate: null,
  });
  const [loading, setLoading] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Online Top Up state (UI only)
  const [topUpMethod, setTopUpMethod] = useState("card"); // card | fpx | ewallet
  const [topUpAmount, setTopUpAmount] = useState("0");
  const [topUpFee, setTopUpFee] = useState("0");
  const [topUpBank, setTopUpBank] = useState("");
  const [topUpAck, setTopUpAck] = useState(false);
  const totalTopUp = (Number(topUpAmount || 0) + Number(topUpFee || 0)).toFixed(2);

  const handleTabChange = (e, v) => setSelectedTab(v);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({ ...prev, issueDate: newValue, chequeIssueDate: newValue }));
  };

  const processFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        documentFile: file,
        documentPreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      documentFile: null,
      documentPreview: null,
    }));
  };

  const handleSubmit = async () => {
    if (selectedTab === 4) {
      if (!topUpAck) {
        toast.error("Please accept the terms & conditions to proceed.");
        return;
      }
      toast.info("Online Top Up is UI only for now.");
      return;
    }

    const token = agentToken || localStorage.getItem("agentToken") || "";
    if (!token || !agentEmail) {
      toast.error("Please login again.");
      return;
    }

    const paymentMethod = PAYMENT_METHODS[selectedTab];
    const isCheque = paymentMethod === "Cheque";
    const needDoc = true; // matches the UI (Upload Attachments *) for all tabs
    const isBankDeposit = selectedTab === 1;
    const isCashDeposit = selectedTab === 2;
    const isChequeDepositTab = selectedTab === 3;

    if (isBankDeposit) {
      if (!formData.issueDate || !formData.transferTime || !formData.bankName || !formData.referenceId || !formData.depositBankLocation || !formData.amount) {
        toast.error("Please fill in all required fields for Bank Deposit.");
        return;
      }
    } else if (isCashDeposit) {
      if (!formData.issueDate || !formData.branchName || !formData.amount || !formData.referenceId) {
        toast.error("Please fill in all required fields for Cash Deposit.");
        return;
      }
    } else if (isChequeDepositTab) {
      if (!formData.issueDate || !formData.bankName || !formData.chequeNumber || !formData.chequeFrom || !formData.depositedInAccount || !formData.referenceId || !formData.amount) {
        toast.error("Please fill in all required fields for Cheque Deposit.");
        return;
      }
    } else {
      if (!formData.referenceId || !formData.beneficiaryName || !formData.amount) {
        toast.error("Please fill in required fields (Reference Id, Beneficiary Name, Amount).");
        return;
      }
    }
    if (needDoc && !formData.documentFile) {
      toast.error("Please upload a document for this payment method.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("email", agentEmail);
      fd.append("amount", parseFloat(formData.amount));
      fd.append("currency", "MYR");
      fd.append("paymentMethod", paymentMethod);
      fd.append("reference", formData.referenceId);
      // If Bank Deposit tab doesn't collect beneficiary name, use agent display name to keep payload valid.
      fd.append("receiverName", formData.beneficiaryName || agentDisplayName);
      fd.append("depositerName", formData.beneficiaryName || agentDisplayName);
      if (formData.bankName) fd.append("chequeBankName", formData.bankName);
      if (formData.chequeNumber) fd.append("chequeNumber", formData.chequeNumber);
      if (formData.chequeIssueDate) fd.append("chequeIssueDate", formData.chequeIssueDate.format("YYYY-MM-DD"));
      if (formData.documentFile) fd.append("file", formData.documentFile);
      if (isBankDeposit) {
        fd.append("issueDate", dayjs(formData.issueDate).format("YYYY-MM-DD"));
        fd.append("transferTime", String(formData.transferTime || ""));
        fd.append("depositBankLocation", String(formData.depositBankLocation || ""));
      }
      if (isCashDeposit) {
        fd.append("issueDate", dayjs(formData.issueDate).format("YYYY-MM-DD"));
        fd.append("branchName", String(formData.branchName || ""));
        if (formData.cashPaymentTo) fd.append("cashPaymentTo", String(formData.cashPaymentTo || ""));
      }
      if (isChequeDepositTab) {
        fd.append("issueDate", dayjs(formData.issueDate).format("YYYY-MM-DD"));
        fd.append("chequeNumber", String(formData.chequeNumber || ""));
        fd.append("chequeFrom", String(formData.chequeFrom || ""));
        fd.append("depositedInAccount", String(formData.depositedInAccount || ""));
      }

      await axios.post(`${baseUrl}/deposit`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      toast.success("Deposit request submitted successfully!");
      setFormData({
        issueDate: null,
        transferTime: "",
        bankName: "",
        depositBankLocation: "",
        branchName: "",
        referenceId: "",
        beneficiaryName: "",
        beneficiaryAccountNumber: "",
        recipientReference: "",
        cashPaymentTo: "",
        amount: "",
        documentFile: null,
        documentPreview: null,
        chequeNumber: "",
        chequeFrom: "",
        depositedInAccount: "",
        chequeBank: "",
        chequeIssueDate: null,
      });
      setSelectedTab(0);
      setTimeout(() => navigate("/dashboard/agentdeposit"), 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to submit.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: PAGE_BG,
          px: { xs: 2, md: 3 },
          py: 3,
          my: "20px",
          mx: { xs: 1, md: "20px" },
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, mb: 1.25 }}>
          Deposit Request
        </Typography>

        {/* Pill Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": { display: "none" },
              "& .MuiTabs-flexContainer": { gap: 1 },
              "& .MuiTab-root": tabInactiveSx,
              backgroundColor: PANEL_BG,
              border: `1px solid ${CARD_BORDER}`,
              borderRadius: 2,
              px: 1,
              py: 0.75,
            }}
          >
            {TAB_LABELS.map((t, i) => (
              <Tab key={i} value={i} disableRipple label={t.label} icon={t.icon} iconPosition="start" />
            ))}
          </Tabs>
        </Box>

        <Grid container spacing={3}>
          {/* Left: Form Card */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                backgroundColor: PANEL_BG,
                borderRadius: 2,
                border: `1px solid ${CARD_BORDER}`,
                boxShadow: "none",
                p: 3,
              }}
            >
              {selectedTab === 4 ? (
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, mb: 1.5 }}>
                    Wallet Balance:{" "}
                    <Box component="span" sx={{ color: secondaryColor }}>
                      MYR {walletBalance.toFixed(2)}
                    </Box>
                  </Typography>

                  <Divider sx={{ borderColor: CARD_BORDER, mb: 2 }} />

                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, mb: 1.5 }}>
                    Online Payment
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                    {/* Card */}
                    <Box sx={{ border: `1px solid ${FIELD_BORDER}`, borderRadius: 1.5, overflow: "hidden" }}>
                      <Box sx={{ px: 1.5, py: 1, backgroundColor: FIELD_BG }}>
                        <FormControlLabel
                          control={<Radio checked={topUpMethod === "card"} onChange={() => setTopUpMethod("card")} />}
                          label={<Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>Debit / Credit Card</Typography>}
                        />
                      </Box>
                      {topUpMethod === "card" && (
                        <Box sx={{ p: 1.5, backgroundColor: PANEL_BG }}>
                          <Grid container spacing={1.5}>
                            <Grid item xs={12} sm={4}>
                              <Typography sx={labelSx}>
                                Amount <Box component="span" sx={requiredStarSx}>*</Box>
                              </Typography>
                              <TextField
                                fullWidth
                                type="number"
                                variant="outlined"
                                value={topUpAmount}
                                onChange={(e) => setTopUpAmount(e.target.value)}
                                sx={inputBoxSx}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography sx={labelSx}>
                                Transaction Fee <Box component="span" sx={requiredStarSx}>*</Box>
                              </Typography>
                              <TextField
                                fullWidth
                                type="number"
                                variant="outlined"
                                value={topUpFee}
                                onChange={(e) => setTopUpFee(e.target.value)}
                                sx={inputBoxSx}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography sx={labelSx}>
                                Total Amount <Box component="span" sx={requiredStarSx}>*</Box>
                              </Typography>
                              <TextField fullWidth variant="outlined" value={totalTopUp} sx={inputBoxSx} inputProps={{ readOnly: true }} />
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Box>

                    {/* FPX */}
                    <Box sx={{ border: `1px solid ${FIELD_BORDER}`, borderRadius: 1.5, overflow: "hidden" }}>
                      <Box sx={{ px: 1.5, py: 1, backgroundColor: FIELD_BG, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <FormControlLabel
                          control={<Radio checked={topUpMethod === "fpx"} onChange={() => setTopUpMethod("fpx")} />}
                          label={<Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>FPX</Typography>}
                        />
                        <Box sx={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 700 }}>FPX</Box>
                      </Box>
                      {topUpMethod === "fpx" && (
                        <Box sx={{ p: 1.5, backgroundColor: PANEL_BG }}>
                          <Grid container spacing={1.5}>
                            <Grid item xs={12} sm={4}>
                              <Typography sx={labelSx}>
                                Amount <Box component="span" sx={requiredStarSx}>*</Box>
                              </Typography>
                              <TextField
                                fullWidth
                                type="number"
                                variant="outlined"
                                value={topUpAmount}
                                onChange={(e) => setTopUpAmount(e.target.value)}
                                sx={inputBoxSx}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography sx={labelSx}>
                                Transaction Fee <Box component="span" sx={requiredStarSx}>*</Box>
                              </Typography>
                              <TextField
                                fullWidth
                                type="number"
                                variant="outlined"
                                value={topUpFee}
                                onChange={(e) => setTopUpFee(e.target.value)}
                                sx={inputBoxSx}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography sx={labelSx}>
                                Total Amount <Box component="span" sx={requiredStarSx}>*</Box>
                              </Typography>
                              <TextField fullWidth variant="outlined" value={totalTopUp} sx={inputBoxSx} inputProps={{ readOnly: true }} />
                            </Grid>

                            <Grid item xs={12}>
                              <Typography sx={labelSx}>
                                Select Bank <Box component="span" sx={requiredStarSx}>*</Box>
                              </Typography>
                              <FormControl fullWidth variant="outlined" sx={selectBoxSx}>
                                <Select
                                  value={topUpBank}
                                  onChange={(e) => setTopUpBank(e.target.value)}
                                  displayEmpty
                                  renderValue={(v) => v || "Select Bank"}
                                >
                                  <MenuItem value="">Select Bank</MenuItem>
                                  {BANK_OPTIONS.map((b) => (
                                    <MenuItem key={`fpx-${b}`} value={b}>{b}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Box>

                    {/* eWallet */}
                    <Box sx={{ border: `1px solid ${FIELD_BORDER}`, borderRadius: 1.5, overflow: "hidden" }}>
                      <Box sx={{ px: 1.5, py: 1, backgroundColor: FIELD_BG, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <FormControlLabel
                          control={<Radio checked={topUpMethod === "ewallet"} onChange={() => setTopUpMethod("ewallet")} />}
                          label={<Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>eWallet</Typography>}
                        />
                        <Box sx={{ width: 18, height: 12, borderRadius: 0.5, backgroundColor: secondaryColor }} />
                      </Box>
                      {topUpMethod === "ewallet" && (
                        <Box sx={{ p: 1.5, backgroundColor: PANEL_BG }}>
                          <Grid container spacing={1.5}>
                            <Grid item xs={12} sm={4}>
                              <Typography sx={labelSx}>
                                Amount <Box component="span" sx={requiredStarSx}>*</Box>
                              </Typography>
                              <TextField
                                fullWidth
                                type="number"
                                variant="outlined"
                                value={topUpAmount}
                                onChange={(e) => setTopUpAmount(e.target.value)}
                                sx={inputBoxSx}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography sx={labelSx}>
                                Transaction Fee <Box component="span" sx={requiredStarSx}>*</Box>
                              </Typography>
                              <TextField
                                fullWidth
                                type="number"
                                variant="outlined"
                                value={topUpFee}
                                onChange={(e) => setTopUpFee(e.target.value)}
                                sx={inputBoxSx}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography sx={labelSx}>
                                Total Amount <Box component="span" sx={requiredStarSx}>*</Box>
                              </Typography>
                              <TextField fullWidth variant="outlined" value={totalTopUp} sx={inputBoxSx} inputProps={{ readOnly: true }} />
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, mt: 2 }}>
                    <Checkbox checked={topUpAck} onChange={(e) => setTopUpAck(e.target.checked)} />
                    <Typography sx={{ fontSize: 11.5, color: "#374151", mt: 0.6 }}>
                      I acknowledge that I have read and accepted the{" "}
                      <Box component="span" sx={{ color: secondaryColor, textDecoration: "underline", cursor: "pointer" }}>
                        Terms & Conditions
                      </Box>
                      ,{" "}
                      <Box component="span" sx={{ color: secondaryColor, textDecoration: "underline", cursor: "pointer" }}>
                        Privacy Policy
                      </Box>
                      , and{" "}
                      <Box component="span" sx={{ color: secondaryColor, textDecoration: "underline", cursor: "pointer" }}>
                        Refund Policy
                      </Box>
                      .
                    </Typography>
                  </Box>

                  <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: TEXT_DARK, mt: 2, mb: 1 }}>
                    Accepted Payment Gateways
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {["VISA", "MasterCard", "JCB", "GPay", "PayPal", "FPX", "ApplePay"].map((g) => (
                      <Box
                        key={g}
                        sx={{
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 1.25,
                          border: `1px solid ${CARD_BORDER}`,
                          backgroundColor: "#FFFFFF",
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#111827",
                        }}
                      >
                        {g}
                      </Box>
                    ))}
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    disabled={!topUpAck}
                    sx={{
                      textTransform: "none",
                      fontSize: 13,
                      fontWeight: 700,
                      py: 1.25,
                      borderRadius: 1.5,
                      backgroundColor: secondaryColor,
                      boxShadow: "none",
                      "&:hover": { backgroundColor: secondaryColor, opacity: 0.9, boxShadow: "none" },
                      "&:disabled": { backgroundColor: "#B9C4E6", color: "#FFFFFF" },
                    }}
                  >
                    Proceed to Pay
                  </Button>

                  <Typography sx={{ fontSize: 10.5, color: TEXT_MUTED, mt: 1.5 }}>
                    For any inquiries regarding payment or balance issues, please contact our finance department.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={labelSx}>
                    Issue Date <Box component="span" sx={requiredStarSx}>*</Box>
                  </Typography>
                  <DatePicker
                    value={formData.issueDate || formData.chequeIssueDate}
                    onChange={handleDateChange}
                    open={dateOpen}
                    onOpen={() => setDateOpen(true)}
                    onClose={() => setDateOpen(false)}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        placeholder: "Select date",
                        sx: inputBoxSx,
                        onClick: () => setDateOpen(true),
                        inputProps: { readOnly: true },
                      },
                      openPickerIcon: { sx: { color: TEXT_MUTED } },
                    }}
                  />
                </Grid>

                {selectedTab === 1 && (
                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelSx}>
                      Transfer Time <Box component="span" sx={requiredStarSx}>*</Box>
                    </Typography>
                    <TextField
                      fullWidth
                      type="time"
                      variant="outlined"
                      value={formData.transferTime}
                      onChange={handleInputChange("transferTime")}
                      sx={inputBoxSx}
                      inputProps={{ step: 60 }}
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <Typography sx={labelSx}>
                    {selectedTab === 2 ? (
                      <>
                        Branch Name <Box component="span" sx={requiredStarSx}>*</Box>
                      </>
                    ) : (
                      <>
                        Bank Name <Box component="span" sx={requiredStarSx}>*</Box>
                      </>
                    )}
                  </Typography>
                  {selectedTab === 2 ? (
                    <FormControl fullWidth variant="outlined" sx={selectBoxSx}>
                      <Select
                        value={formData.branchName}
                        onChange={handleInputChange("branchName")}
                        displayEmpty
                        renderValue={(v) => v || "Select Branch"}
                      >
                        <MenuItem value="">Select Branch</MenuItem>
                        {BRANCH_OPTIONS.map((b) => (
                          <MenuItem key={b} value={b}>{b}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <FormControl fullWidth variant="outlined" sx={selectBoxSx}>
                      <Select
                        value={formData.bankName || formData.chequeBank}
                        onChange={(e) => setFormData((p) => ({ ...p, bankName: e.target.value, chequeBank: e.target.value }))}
                        displayEmpty
                        renderValue={(v) => v || "Select Bank"}
                      >
                        <MenuItem value="">Select Bank</MenuItem>
                        {BANK_OPTIONS.map((b) => (
                          <MenuItem key={b} value={b}>{b}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={labelSx}>
                    Reference Id <Box component="span" sx={requiredStarSx}>*</Box>
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter reference id"
                    value={formData.referenceId}
                    onChange={handleInputChange("referenceId")}
                    sx={inputBoxSx}
                  />
                </Grid>

                {selectedTab === 1 ? (
                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelSx}>
                      Amount <Box component="span" sx={requiredStarSx}>*</Box>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      variant="outlined"
                      placeholder="Amount"
                      value={formData.amount}
                      onChange={handleInputChange("amount")}
                      sx={inputBoxSx}
                    />
                  </Grid>
                ) : selectedTab === 2 || selectedTab === 3 ? null : (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={labelSx}>
                        Beneficiary Name <Box component="span" sx={requiredStarSx}>*</Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter beneficiary name"
                        value={formData.beneficiaryName}
                        onChange={handleInputChange("beneficiaryName")}
                        sx={inputBoxSx}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography sx={labelSx}>
                        Beneficiary Account Number <Box component="span" sx={requiredStarSx}>*</Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter account number"
                        value={formData.beneficiaryAccountNumber}
                        onChange={handleInputChange("beneficiaryAccountNumber")}
                        sx={inputBoxSx}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={labelSx}>Recipient Reference (optional)</Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Optional"
                        value={formData.recipientReference}
                        onChange={handleInputChange("recipientReference")}
                        sx={inputBoxSx}
                      />
                    </Grid>
                  </>
                )}

                {selectedTab === 2 && (
                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelSx}>Cash Payment To (optional)</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Cash Payment To"
                      value={formData.cashPaymentTo}
                      onChange={handleInputChange("cashPaymentTo")}
                      sx={inputBoxSx}
                    />
                  </Grid>
                )}

                {selectedTab === 1 && (
                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelSx}>
                      Deposit Bank Location <Box component="span" sx={requiredStarSx}>*</Box>
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Deposit Bank Location"
                      value={formData.depositBankLocation}
                      onChange={handleInputChange("depositBankLocation")}
                      sx={inputBoxSx}
                    />
                  </Grid>
                )}

                {selectedTab === 3 && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={labelSx}>
                        Cheque No <Box component="span" sx={requiredStarSx}>*</Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Cheque No"
                        value={formData.chequeNumber}
                        onChange={handleInputChange("chequeNumber")}
                        sx={inputBoxSx}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={labelSx}>
                        Cheque From <Box component="span" sx={requiredStarSx}>*</Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Cheque From"
                        value={formData.chequeFrom}
                        onChange={handleInputChange("chequeFrom")}
                        sx={inputBoxSx}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography sx={labelSx}>
                        Deposited In A/c <Box component="span" sx={requiredStarSx}>*</Box>
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Deposited in A/c"
                        value={formData.depositedInAccount}
                        onChange={handleInputChange("depositedInAccount")}
                        sx={inputBoxSx}
                      />
                    </Grid>
                  </>
                )}
                {selectedTab !== 1 && (
                  <Grid item xs={12} sm={6}>
                    <Typography sx={labelSx}>
                      Amount <Box component="span" sx={requiredStarSx}>*</Box>
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      variant="outlined"
                      placeholder="Amount"
                      value={formData.amount}
                      onChange={handleInputChange("amount")}
                      sx={inputBoxSx}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography sx={labelSx}>
                    Upload Attachments <Box component="span" sx={requiredStarSx}>*</Box>
                  </Typography>
                  <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    sx={{
                      display: "block",
                      width: "100%",
                      minWidth: 0,
                      boxSizing: "border-box",
                      border: "2px dotted",
                      borderColor: dragOver ? secondaryColor : "#111827",
                      borderRadius: 2,
                      backgroundColor: dragOver ? "rgba(2, 77, 175, 0.04)" : PANEL_BG,
                      py: 3.25,
                      px: 2.5,
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                    component="label"
                  >
                    <Input
                      type="file"
                      sx={{ display: "none" }}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/jpg,image/png,image/jfif,application/pdf"
                    />
                    {formData.documentPreview ? (
                      <Box sx={{ position: "relative", display: "inline-block" }}>
                        <img
                          src={formData.documentPreview}
                          alt="Preview"
                          style={{ maxHeight: 120, borderRadius: 8 }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveFile(); }}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "rgba(0,0,0,0.5)",
                            color: "#fff",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <>
                        <Typography sx={{ fontSize: 12.5, color: "#1F2937", fontWeight: 500 }}>
                          Upload file or drag & drop
                        </Typography>
                        <Typography sx={{ fontSize: 10.5, color: TEXT_MUTED, mt: 0.35 }}>
                          JPG, PNG, PDF | Max 5MB
                        </Typography>
                      </>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : null}
                      sx={{
                        textTransform: "none",
                        fontSize: 12.5,
                        fontWeight: 600,
                        px: 5,
                        py: 1.1,
                        borderRadius: 1.5,
                        backgroundColor: secondaryColor,
                        boxShadow: "none",
                        "&:hover": { backgroundColor: secondaryColor, opacity: 0.9, boxShadow: "none" },
                        "&:disabled": { backgroundColor: "#9CA3AF" },
                      }}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  </Box>
                </Grid>
                </Grid>
              )}
            </Box>
          </Grid>

          {/* Right: Bank Information */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: PANEL_BG,
                borderRadius: 2,
                border: `1px solid ${CARD_BORDER}`,
                overflow: "hidden",
                boxShadow: "none",
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827", p: 2, pb: 0 }}>
                Bank Information
              </Typography>
              {BANK_INFO.map((bank, i) => (
                <Accordion
                  key={bank.name}
                  defaultExpanded={i === 0}
                  disableGutters
                  sx={{
                    "&:before": { display: "none" },
                    boxShadow: "none",
                    borderBottom: "1px solid rgba(2, 77, 175, 0.12)",
                    "&.Mui-expanded": { margin: 0 },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: secondaryColor }} />}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#1F2937" }}>{bank.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                    {[
                      { label: "Account Number", value: bank.accountNumber },
                      { label: "Account Name", value: bank.accountName },
                      { label: "Swift Code", value: bank.swiftCode },
                      { label: "Branch", value: bank.branch },
                      { label: "Branch Address", value: bank.branchAddress },
                    ].map((row) => (
                      <Box key={row.label} sx={{ mb: 1.5 }}>
                        <Typography sx={{ fontSize: 11, color: "#6B7280", mb: 0.25 }}>{row.label}</Typography>
                        <Box
                          sx={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#111827",
                            backgroundColor: FIELD_BG,
                            borderRadius: 1,
                            border: `1px solid ${FIELD_BORDER}`,
                            p: 1,
                          }}
                        >
                          {row.value}
                        </Box>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default AddDeposit;
