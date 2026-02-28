import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const titleButtonSx = (active) => ({
  textTransform: "none",
  minWidth: 54,
  height: 30,
  borderRadius: 1,
  fontSize: 12,
  fontWeight: 600,
  border: active ? "1px solid #0F2F56" : "1px solid #E5E7EB",
  backgroundColor: active ? "#0F2F56" : "#FFFFFF",
  color: active ? "#FFFFFF" : "#111827",
  "&:hover": {
    backgroundColor: active ? "#0B2442" : "#F8FAFC",
  },
});

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 38,
    backgroundColor: "#FFFFFF",
    "& fieldset": {
      borderColor: "#E5E7EB",
    },
    "&:hover fieldset": {
      borderColor: "#E5E7EB",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#E5E7EB",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "8px 12px",
    fontSize: 12,
  },
};

const inputLabelSx = {
  fontSize: 12,
  color: "#0F2F56",
  mb: 0.5,
  fontWeight: 500,
};

const pickerPopperSx = {
  "& .MuiPickersDay-root.Mui-selected": {
    backgroundColor: "#0F2F56 !important",
    color: "#fff",
  },
  "& .MuiPickersDay-root.Mui-selected:hover": {
    backgroundColor: "#0F2F56 !important",
  },
  "& .MuiPickersDay-root.MuiPickersDay-today": {
    borderColor: "#0F2F56 !important",
  },
  "& .MuiPickersArrowSwitcher-button": {
    color: "#0F2F56 !important",
  },
  "& .MuiPickersYear-yearButton.Mui-selected": {
    backgroundColor: "#0F2F56",
  },
};

const NATIONALITY_OPTIONS = [
  { value: "Bangladeshi", label: "Bangladeshi", code: "bd" },
  { value: "Malaysian", label: "Malaysian", code: "my" },
  { value: "Indian", label: "Indian", code: "in" },
  { value: "Pakistani", label: "Pakistani", code: "pk" },
  { value: "Indonesian", label: "Indonesian", code: "id" },
  { value: "Singaporean", label: "Singaporean", code: "sg" },
  { value: "Thai", label: "Thai", code: "th" },
  { value: "Emirati", label: "Emirati", code: "ae" },
  { value: "Saudi Arabian", label: "Saudi Arabian", code: "sa" },
  { value: "British", label: "British", code: "gb" },
  { value: "American", label: "American", code: "us" },
  { value: "Canadian", label: "Canadian", code: "ca" },
  { value: "Australian", label: "Australian", code: "au" },
];

const headerTitleSx = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
};

const AddTraveler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { agentToken, agentData } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
  
  const travelerId = location.state?.travelerId || null;
  const isEditMode = !!travelerId;
  
  const [formData, setFormData] = useState({
    title: "Mr",
    type: "Adult",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "Malaysian",
    gender: "Male",
    passportNumber: "",
    passportExpiryDate: "",
  });

  const [dateOfBirthOpen, setDateOfBirthOpen] = useState(false);
  const [passportExpiryOpen, setPassportExpiryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const parseDateValue = (value) => {
    if (!value) return null;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  };

  const handleDateChange = (field) => (newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue && newValue.isValid() ? newValue.format("YYYY-MM-DD") : "",
    }));
  };

  const getNationalityOption = (value) => {
    return NATIONALITY_OPTIONS.find((opt) => opt.value === value || opt.label === value);
  };

  const getFlagUrl = (code) => `https://flagcdn.com/w20/${code}.png`;

  // Get date of birth validation rules based on traveler type
  const getDobRulesByType = (passengerType) => {
    const today = dayjs().startOf("day");
    
    if (passengerType === "Adult") {
      return {
        minDate: today.subtract(120, "year"),
        maxDate: today.subtract(12, "year"),
        helper: "Adult: 12+ years",
      };
    }

    if (passengerType === "Child") {
      return {
        minDate: today.subtract(12, "year").add(1, "day"),
        maxDate: today.subtract(2, "year"),
        helper: "Child: 2 to less than 12 years",
      };
    }

    if (passengerType === "Infant") {
      return {
        minDate: today.subtract(2, "year").add(1, "day"),
        maxDate: today,
        helper: "Infant: 0 to 23 months",
      };
    }

    return {
      minDate: null,
      maxDate: today,
      helper: "Select valid date of birth",
    };
  };

  const dobRules = getDobRulesByType(formData.type);
  const dateOfBirthValue = parseDateValue(formData.dateOfBirth);
  const isDateOfBirthInvalid = Boolean(
    dateOfBirthValue &&
      ((dobRules.minDate && dateOfBirthValue.isBefore(dobRules.minDate, "day")) ||
        (dobRules.maxDate && dateOfBirthValue.isAfter(dobRules.maxDate, "day")))
  );

  // Fetch traveler data if in edit mode
  useEffect(() => {
    const fetchTravelerData = async () => {
      if (!isEditMode || !travelerId) return;

      const token = agentToken || localStorage.getItem("agentToken") || "";
      const agentEmail = agentData?.email || "";

      if (!token || !agentEmail) {
        toast.error("Agent token or email missing. Please login again.");
        return;
      }

      setFetching(true);
      try {
        const response = await axios.get(
          `${baseUrl}/passenger/agent/${travelerId}?email=${encodeURIComponent(agentEmail)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const traveler = response?.data?.data || response?.data;
        if (traveler) {
          setFormData({
            title: traveler.title || "Mr",
            type: traveler.type || traveler.passengerType || "Adult",
            firstName: traveler.firstName || "",
            lastName: traveler.lastName || "",
            dateOfBirth: traveler.dateOfBirth || "",
            nationality: traveler.nationality || "Malaysian",
            gender: traveler.gender === "MALE" ? "Male" : traveler.gender === "FEMALE" ? "Female" : (traveler.gender || "Male"),
            passportNumber: traveler.passportNumber || "",
            passportExpiryDate: traveler.passportExpiryDate || "",
          });
        }
      } catch (err) {
        const apiMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load traveler data.";
        toast.error(apiMessage);
        console.error("Fetch traveler failed:", err?.response?.data || err);
      } finally {
        setFetching(false);
      }
    };

    fetchTravelerData();
  }, [isEditMode, travelerId, agentToken, agentData, baseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = agentToken || localStorage.getItem("agentToken") || "";
    const agentEmail = agentData?.email || "";

    if (!token || !agentEmail) {
      toast.error("Agent token or email missing. Please login again.");
      setLoading(false);
      return;
    }

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || 
        !formData.passportNumber || !formData.passportExpiryDate) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Validate date of birth based on traveler type
    if (isDateOfBirthInvalid) {
      toast.error(`Date of birth must match: ${dobRules.helper}`);
      setLoading(false);
      return;
    }

    try {
      let payload;
      if (isEditMode) {
        // For edit mode, don't include email in body (only in query param)
        payload = {
          title: formData.title,
          type: formData.type,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          gender: formData.gender,
          passportNumber: formData.passportNumber,
          passportExpiryDate: formData.passportExpiryDate,
        };
      } else {
        // For add mode, include email in body
        payload = {
          email: agentEmail,
          title: formData.title,
          type: formData.type,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality,
          gender: formData.gender,
          passportNumber: formData.passportNumber,
          passportExpiryDate: formData.passportExpiryDate,
        };
      }

      let response;
      if (isEditMode) {
        // Update existing traveler
        response = await axios.patch(
          `${baseUrl}/passenger/agent/${travelerId}?email=${encodeURIComponent(agentEmail)}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Create new traveler
        response = await axios.post(
          `${baseUrl}/passenger`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data) {
        toast.success(isEditMode ? "Traveler updated successfully!" : "Traveler added successfully!");
        // Reset form if not in edit mode
        if (!isEditMode) {
          setFormData({
            title: "Mr",
            type: "Adult",
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            nationality: "Malaysian",
            gender: "Male",
            passportNumber: "",
            passportExpiryDate: "",
          });
        }
        // Navigate to All Traveler page after a short delay
        setTimeout(() => {
          navigate("/dashboard/account/alltraveler");
        }, 1000);
      }
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to add traveler.";
      toast.error(apiMessage);
      console.error("Add traveler failed:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 7 },
        py: 4,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: 2,
          border: "1px solid #E5E7EB",
          px: { xs: 2, md: 3 },
          py: { xs: 2.5, md: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Typography sx={headerTitleSx}>{isEditMode ? "Edit Traveler" : "Add Traveler"}</Typography>

        {fetching && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} sx={{ color: "#0F2F56" }} />
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: fetching ? "none" : "block" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Button
              sx={titleButtonSx(formData.title === "Mr")}
              onClick={() => setFormData((prev) => ({ ...prev, title: "Mr" }))}
              type="button"
            >
              Mr
            </Button>
            <Button
              sx={titleButtonSx(formData.title === "Mrs")}
              onClick={() => setFormData((prev) => ({ ...prev, title: "Mrs" }))}
              type="button"
            >
              Mrs
            </Button>
            <Button
              sx={titleButtonSx(formData.title === "Miss")}
              onClick={() => setFormData((prev) => ({ ...prev, title: "Miss" }))}
              type="button"
            >
              Miss
            </Button>
          </Box>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography sx={inputLabelSx}>First name</Typography>
                <TextField
                  placeholder="Enter first name"
                  size="small"
                  fullWidth
                  required
                  sx={fieldSx}
                  value={formData.firstName}
                  onChange={handleChange("firstName")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={inputLabelSx}>Last name</Typography>
                <TextField
                  placeholder="Enter last name"
                  size="small"
                  fullWidth
                  required
                  sx={fieldSx}
                  value={formData.lastName}
                  onChange={handleChange("lastName")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={inputLabelSx}>Type</Typography>
                <TextField
                  size="small"
                  fullWidth
                  sx={fieldSx}
                  select
                  value={formData.type}
                  onChange={handleChange("type")}
                >
                  <MenuItem value="Adult">Adult</MenuItem>
                  <MenuItem value="Child">Child</MenuItem>
                  <MenuItem value="Infant">Infant</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={inputLabelSx}>Gender</Typography>
                <TextField
                  size="small"
                  fullWidth
                  sx={fieldSx}
                  select
                  value={formData.gender}
                  onChange={handleChange("gender")}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={inputLabelSx}>Date of birth</Typography>
                <DatePicker
                  value={parseDateValue(formData.dateOfBirth)}
                  onChange={handleDateChange("dateOfBirth")}
                  open={dateOfBirthOpen}
                  onOpen={() => setDateOfBirthOpen(true)}
                  onClose={() => setDateOfBirthOpen(false)}
                  format="DD MMM YYYY"
                  minDate={dobRules.minDate || undefined}
                  maxDate={dobRules.maxDate || undefined}
                  slots={{ openPickerIcon: CalendarTodayIcon }}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      required: true,
                      sx: fieldSx,
                      inputProps: { readOnly: true },
                      onClick: () => setDateOfBirthOpen(true),
                      error: isDateOfBirthInvalid,
                      helperText: isDateOfBirthInvalid
                        ? `Date of birth must match: ${dobRules.helper}`
                        : "",
                    },
                    openPickerIcon: {
                      sx: { fontSize: 18, color: "#93A3B8" },
                    },
                    popper: {
                      sx: pickerPopperSx,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={inputLabelSx}>Nationality</Typography>
                <TextField
                  size="small"
                  fullWidth
                  sx={fieldSx}
                  select
                  value={formData.nationality}
                  onChange={handleChange("nationality")}
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: {
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
                          mt: 0.5,
                          maxHeight: 280,
                        },
                      },
                    },
                    renderValue: (selected) => {
                      if (!selected) return "Select Nationality";
                      const selectedOption = getNationalityOption(selected);
                      return (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {selectedOption?.code ? (
                            <Box
                              component="img"
                              src={getFlagUrl(selectedOption.code)}
                              alt={`${selectedOption.label} flag`}
                              sx={{ width: 18, height: 12, borderRadius: "2px", objectFit: "cover" }}
                            />
                          ) : null}
                          <Box component="span">{selectedOption?.label || selected}</Box>
                        </Box>
                      );
                    },
                  }}
                >
                  {NATIONALITY_OPTIONS.map((country) => (
                    <MenuItem key={country.value} value={country.value}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          component="img"
                          src={getFlagUrl(country.code)}
                          alt={`${country.label} flag`}
                          sx={{ width: 18, height: 12, borderRadius: "2px", objectFit: "cover" }}
                        />
                        <Box component="span">{country.label}</Box>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={inputLabelSx}>Passport number</Typography>
                <TextField
                  placeholder="Enter passport number"
                  size="small"
                  fullWidth
                  required
                  sx={fieldSx}
                  value={formData.passportNumber}
                  onChange={handleChange("passportNumber")}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={inputLabelSx}>Passport expiry</Typography>
                <DatePicker
                  value={parseDateValue(formData.passportExpiryDate)}
                  onChange={handleDateChange("passportExpiryDate")}
                  open={passportExpiryOpen}
                  onOpen={() => setPassportExpiryOpen(true)}
                  onClose={() => setPassportExpiryOpen(false)}
                  format="DD MMM YYYY"
                  minDate={dayjs()}
                  slots={{ openPickerIcon: CalendarTodayIcon }}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      required: true,
                      sx: fieldSx,
                      inputProps: { readOnly: true },
                      onClick: () => setPassportExpiryOpen(true),
                    },
                    openPickerIcon: {
                      sx: { fontSize: 18, color: "#93A3B8" },
                    },
                    popper: {
                      sx: pickerPopperSx,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                textTransform: "none",
                fontSize: 12,
                fontWeight: 600,
                px: 3,
                height: 36,
                backgroundColor: "#0F2F56",
                "&:hover": { backgroundColor: "#0B2442" },
                "&:disabled": {
                  backgroundColor: "#9CA3AF",
                },
              }}
            >
              {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Traveler" : "Add Traveler")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddTraveler;
