import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import FlightPassenger from "./FlightPassenger";
import FlightBookingDetails from "./FlightBookingDetails";
import FlightBookingFareDetails from "./FlightBookingFareDetails";
import Support from "./Support";
import BookingSessionTime from "./BookingSessionTime";
import useAuth from "../../../hooks/useAuth";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 38,
    backgroundColor: "#FFFFFF",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#D1D5DB",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#9CA3AF",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#0F2F56",
    },
  },
};

const inputLabelSx = {
  fontSize: 12,
  color: "#111827",
  mb: 0.5,
};

const PHONE_COUNTRY_OPTIONS = [
  { code: "bd", dial: "+880", label: "Bangladesh" },
  { code: "my", dial: "+60", label: "Malaysia" },
  { code: "in", dial: "+91", label: "India" },
  { code: "pk", dial: "+92", label: "Pakistan" },
  { code: "id", dial: "+62", label: "Indonesia" },
  { code: "sg", dial: "+65", label: "Singapore" },
  { code: "th", dial: "+66", label: "Thailand" },
  { code: "ae", dial: "+971", label: "UAE" },
  { code: "sa", dial: "+966", label: "Saudi Arabia" },
  { code: "gb", dial: "+44", label: "UK" },
  { code: "us", dial: "+1", label: "USA" },
  { code: "ca", dial: "+1", label: "Canada" },
  { code: "au", dial: "+61", label: "Australia" },
];

// Mapping nationality names to country codes (uppercase)
const NATIONALITY_TO_CODE = {
  "Bangladeshi": "BD",
  "Malaysian": "MY",
  "Indian": "IN",
  "Pakistani": "PK",
  "Indonesian": "ID",
  "Singaporean": "SG",
  "Thai": "TH",
  "Emirati": "AE",
  "Saudi Arabian": "SA",
  "British": "GB",
  "American": "US",
  "Canadian": "CA",
  "Australian": "AU",
};

const FlightBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { agentToken } = useAuth();
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://iontrip-backend-production.up.railway.app";
  const selectedFlight =
    location.state?.selectedFlight || location.state?.data || null;
  const [offerPriceData, setOfferPriceData] = useState(null);
  const [offerPriceError, setOfferPriceError] = useState("");
  const [contactPhoneCode, setContactPhoneCode] = useState("+60");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const bookingData = useMemo(
    () => offerPriceData || selectedFlight || null,
    [offerPriceData, selectedFlight]
  );
  const passengers = useMemo(() => {
    const breakdown = bookingData?.pricebreakdown || [];

    const getPaxTypeLabel = (value) => {
      const normalized = String(value || "")
        .replace(/_/g, " ")
        .trim()
        .toUpperCase();
      if (["ADT", "ADULT"].includes(normalized)) return "Adult";
      if (["CHD", "CHILD"].includes(normalized)) return "Child";
      if (["INF", "INFT", "INFANT", "HELD INFANT", "HELD_INFANT"].includes(normalized)) {
        return "Infant";
      }
      return "Traveler";
    };

    const list = breakdown.flatMap((row) => {
      const count = Number(row?.PaxCount || 0);
      const safeCount = Number.isFinite(count) && count > 0 ? count : 0;
      const type = getPaxTypeLabel(row?.PaxType);
      return Array.from({ length: safeCount }, () => ({ type }));
    });

    return list.length ? list : [{ type: "Adult" }];
  }, [bookingData]);
  const [passengerForms, setPassengerForms] = useState([]);

  useEffect(() => {
    setPassengerForms((prev) =>
      passengers.map((passenger, index) => ({
        firstName: prev[index]?.firstName || "",
        lastName: prev[index]?.lastName || "",
        gender: prev[index]?.gender || "Male",
        dateOfBirth: prev[index]?.dateOfBirth || "",
        nationality: prev[index]?.nationality || "Malaysian",
        passportNumber: prev[index]?.passportNumber || "",
        passportExpiry: prev[index]?.passportExpiry || "",
        title:
          prev[index]?.title ||
          (passenger.type === "Adult" ? "Mr" : passenger.type === "Child" ? "Miss" : "Miss"),
      }))
    );
  }, [passengers]);

  const handlePassengerFieldChange = (passengerIndex, field, value) => {
    setPassengerForms((prev) =>
      prev.map((item, idx) => (idx === passengerIndex ? { ...item, [field]: value } : item))
    );
  };

  useEffect(() => {
    const fetchOfferPrice = async () => {
      if (!selectedFlight) {
        setOfferPriceError("No selected flight data found.");
        return;
      }

      const token = agentToken || localStorage.getItem("agentToken") || "";
      if (!token) {
        setOfferPriceError("Agent token missing. Please login again.");
        return;
      }

      try {
        setOfferPriceError("");
        const response = await axios.post(
          `${baseUrl}/flight/offerPrice`,
           selectedFlight ,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setOfferPriceData(response?.data || null);
      } catch (error) {
        const apiMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Offer price API failed.";
        setOfferPriceError(apiMessage);
        console.error("Offer price API failed:", error?.response?.data || error);
      }
    };

    fetchOfferPrice();
  }, [selectedFlight, agentToken, baseUrl]);

  const getPhoneFlagUrl = (code) => `https://flagcdn.com/w20/${code}.png`;
  const handleOpenReviewDialog = () => setOpenReviewDialog(true);
  const handleCloseReviewDialog = () => setOpenReviewDialog(false);

  const handleCompleteBooking = async () => {
    const token = agentToken || localStorage.getItem("agentToken") || "";
    if (!token) {
      setBookingError("Agent token missing. Please login again.");
      return;
    }

    // Map passengerForms to travelers array with proper formatting
    const travellers = passengerForms.map((passenger) => {
      // Format gender to uppercase (MALE/FEMALE)
      const formattedGender = passenger.gender 
        ? passenger.gender.toUpperCase() 
        : "";
      
      // Remove + from country calling code
      const formattedCountryCode = contactPhoneCode 
        ? contactPhoneCode.replace("+", "") 
        : "60";
      
      // Get country code from nationality name
      const nationalityCode = passenger.nationality 
        ? (NATIONALITY_TO_CODE[passenger.nationality] || passenger.nationality.toUpperCase().substring(0, 2))
        : "MY";
      
      // Ensure dates are in YYYY-MM-DD format (they should already be from date picker)
      const formattedDateOfBirth = passenger.dateOfBirth || "";
      const formattedPassportExpiry = passenger.passportExpiry || "";
      
      return {
        firstName: passenger.firstName || "",
        lastName: passenger.lastName || "",
        gender: formattedGender,
        emailAddress: contactEmail || "",
        countryCallingCode: formattedCountryCode,
        phonenumber: contactPhone || "",
        dateOfBirth: formattedDateOfBirth,
        passportNumber: passenger.passportNumber || "",
        passportExpireDate: formattedPassportExpiry,
        issuanceCountry: nationalityCode,
        validityCountry: nationalityCode,
        nationality: nationalityCode,
      };
    });

    const requestBody = {
      travellers,
      data:{...offerPriceData},
    };

    setBookingLoading(true);
    setBookingError("");

    try {
      const response = await axios.post(`${baseUrl}/flight/bookFlight`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Show success toast and navigate
      toast.success("Booking completed successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard/");
      }, 1000);
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Booking failed. Please try again.";
      setBookingError(apiMessage);
      
      // Show error toast
      toast.error(apiMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      console.error("Booking failed:", error?.response?.data || error);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <Box sx={{  minHeight: "100vh", px:9.5,py:4 }}>
      <Typography fontSize={17} fontWeight={700} color="#222222" mb={2}>
        Enter Passenger Details
      </Typography>
      {offerPriceData?.message ? (
        <Typography fontSize={12} color="#64748B" mb={1}>
          {offerPriceData.message}
        </Typography>
      ) : null}
      {offerPriceError ? (
        <Typography fontSize={12} color="#d32f2f" mb={1}>
          {offerPriceError}
        </Typography>
      ) : null}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {passengers.map((passenger, index) => (
              <FlightPassenger
                key={`${passenger.type}-${index + 1}`}
                index={index + 1}
                type={passenger.type}
                values={passengerForms[index] || {}}
                onFieldChange={(field, value) =>
                  handlePassengerFieldChange(index, field, value)
                }
              />
            ))}

            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: 1.5,
                border: "1px solid #E5E7EB",
                p: 2,
              }}
            >
              <Typography fontSize={13} fontWeight={600} mb={2} color="#111827">
                Passenger Contact Information
              </Typography>
              <Grid container spacing={2}>
               
               
                <Grid item xs={12} md={6}>
                  <Typography sx={inputLabelSx}>Email</Typography>
                  <TextField
                    size="small"
                    fullWidth
                    sx={fieldSx}
                    placeholder="Enter email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    inputProps={{ "aria-label": "Email" }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={inputLabelSx}>Phone number</Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <TextField
                      select
                      size="small"
                      sx={{ ...fieldSx, width: 150 }}
                      value={contactPhoneCode}
                      onChange={(event) => setContactPhoneCode(event.target.value)}
                      SelectProps={{
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
                          const option = PHONE_COUNTRY_OPTIONS.find((item) => item.dial === selected);
                          return (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {option?.code ? (
                                <Box
                                  component="img"
                                  src={getPhoneFlagUrl(option.code)}
                                  alt={`${option.label} flag`}
                                  sx={{ width: 18, height: 12, borderRadius: "2px", objectFit: "cover" }}
                                />
                              ) : null}
                              <Box component="span">{selected}</Box>
                            </Box>
                          );
                        },
                      }}
                    >
                      {PHONE_COUNTRY_OPTIONS.map((item) => (
                        <MenuItem key={`${item.code}-${item.dial}`} value={item.dial}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              component="img"
                              src={getPhoneFlagUrl(item.code)}
                              alt={`${item.label} flag`}
                              sx={{ width: 18, height: 12, borderRadius: "2px", objectFit: "cover" }}
                            />
                            <Box component="span">{item.dial}</Box>
                            <Typography sx={{ fontSize: 12, color: "#64748B" }}>
                              {item.label}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      size="small"
                      fullWidth
                      sx={fieldSx}
                      placeholder="Enter phone number"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      inputProps={{ "aria-label": "Phone number" }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FlightBookingDetails data={bookingData} />
            <FlightBookingFareDetails data={bookingData} />
            <Support />
            <BookingSessionTime />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Button
          fullWidth
          onClick={handleOpenReviewDialog}
          sx={{
            height: 46,
            backgroundColor: "#0F2F56",
            color: "#FFFFFF",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { backgroundColor: "#0B2442" },
          }}
        >
          Book This Flight
        </Button>
      </Box>

      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 0,
            backgroundColor: "#0F2F56",
            color: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography fontSize={14} fontWeight={600}>
              Review Details
            </Typography>
            <Typography fontSize={11} sx={{ opacity: 0.95 }}>
              Traveler details must match the passport or photo ID.
            </Typography>
            <IconButton size="small" onClick={handleCloseReviewDialog} sx={{ color: "#FFFFFF" }}>
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mx: 4, px: 2.5, py: 2 }}>
          <Box
            sx={{
              backgroundColor: "#FFF3F3",
              border: "1px solid #FFD3D3",
              borderRadius: 1,
              px: 4,
              my: 4,
              height: "60px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              flexDirection: "column",
              mb: 2,
              
            }}
          >
            <Typography fontSize={11} fontWeight={700} color="#8C2D2D">
              Important
            </Typography>
            <Typography fontSize={11} color="#8C2D2D">
              Please recheck the traveler name and details with your passport before completing
              booking.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography fontSize={14} fontWeight={600} color="var(--primary-color)">
              Traveler Details
            </Typography>
            <Typography fontSize={11} color="#6B7280">
              {passengers.length} Travelers
            </Typography>
          </Box>

          <Box sx={{ border: "1px solid #E5E7EB", borderRadius: 1 }}>
            {passengerForms.map((passenger, idx) => (
              <Box
                key={`review-traveler-${idx}`}
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderBottom: idx < passengerForms.length - 1 ? "1px solid #E5E7EB" : "none",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75 }}>
                  <PersonIcon sx={{ fontSize: 16, color: "var(--primary-color)" }} />
                  <Typography fontSize={12} fontWeight={600} color="var(--primary-color)">
                    Traveler {idx + 1}
                  </Typography>
                </Box>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={2.4}>
                    <Typography fontSize={10} color="#6B7280">
                      First & middle name
                    </Typography>
                    <Typography fontSize={11} color="var(--primary-color)" fontWeight={600}>
                      {passenger.firstName || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2.4}>
                    <Typography fontSize={10} color="#6B7280">
                      Last name
                    </Typography>
                    <Typography fontSize={11} color="var(--primary-color)" fontWeight={600}>
                      {passenger.lastName || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2.4}>
                    <Typography fontSize={10} color="#6B7280">
                      Date of birth
                    </Typography>
                    <Typography fontSize={11} color="var(--primary-color)" fontWeight={600}>
                      {passenger.dateOfBirth || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2.4}>
                    <Typography fontSize={10} color="#6B7280">
                      Passport number
                    </Typography>
                    <Typography fontSize={11} color="var(--primary-color)" fontWeight={600}>
                      {passenger.passportNumber || "-"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2.4}>
                    <Typography fontSize={10} color="#6B7280">
                      Passport expiry date
                    </Typography>
                    <Typography fontSize={11} color="var(--primary-color)" fontWeight={600}>
                      {passenger.passportExpiry || "-"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2.25, pt: 0, justifyContent: "flex-end" }}>
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
            {bookingError ? (
              <Typography fontSize={11} color="#d32f2f" sx={{ alignSelf: "flex-start" }}>
                {bookingError}
              </Typography>
            ) : null}
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Button
                  variant="outlined"
                  onClick={handleCloseReviewDialog}
                  startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderColor: "#D1D5DB",
                    color: "#374151",
                    textTransform: "none",
                    fontSize: 11,
                    px: 2,
                  }}
                >
                  Edit Details
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCompleteBooking}
                  disabled={bookingLoading}
                  startIcon={bookingLoading ? <CircularProgress size={14} sx={{ color: "#FFFFFF" }} /> : null}
                  sx={{
                    backgroundColor: "#0F2F56",
                    textTransform: "none",
                    fontSize: 11,
                    px: 2,
                    "&:hover": { backgroundColor: "#0B2442" },
                    "&:disabled": { backgroundColor: "#9CA3AF" },
                  }}
                >
                  {bookingLoading ? "Processing..." : "Complete Booking"}
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FlightBooking;
