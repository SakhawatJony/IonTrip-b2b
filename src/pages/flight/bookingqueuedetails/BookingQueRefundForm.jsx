import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BookingQueDetailsCard from "./BookingQueDetailsCard";
import BookingQuePassengerList from "./BookingQuePassengerList";
import BookingQueFareDetails from "./BookingQueFareDetails";

const REFUND_FORM_STYLES = {
  sectionHeader: { color: "var(--primary-color)", fontSize: "14px", fontWeight: 700 },
  card: {
    bgcolor: "#FFFFFF",
    borderRadius: 1,
    border: "1px solid #E5E7EB",
    p: 1,
  },
};

const checkboxSx = { color: "var(--primary-color)", "&.Mui-checked": { color: "var(--primary-color)" } };

const BookingQueRefundForm = ({ data, sending = false, onSendRefundRequest }) => {
  const [refundType, setRefundType] = useState("voluntary");
  const [remarks, setRemarks] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [departureSelected, setDepartureSelected] = useState(true);
  const [returnSelected, setReturnSelected] = useState(true);
  const travellers = data?.travellers || [];
  const [selectedPassengers, setSelectedPassengers] = useState([]);

  useEffect(() => {
    if (travellers.length > 0) {
      setSelectedPassengers(travellers.map((_, i) => i));
    } else {
      setSelectedPassengers([]);
    }
  }, [travellers.length]);

  const handleRefundTypeChange = (type) => () => setRefundType(type);

  const handlePassengerSelection = (index, checked) => {
    setSelectedPassengers((prev) =>
      checked ? [...prev, index].sort((a, b) => a - b) : prev.filter((i) => i !== index)
    );
  };

  const handleSelectAllPassengers = (checked) => {
    setSelectedPassengers(checked ? travellers.map((_, i) => i) : []);
  };

  const handleSubmit = () => {
    if (!termsAccepted) return;
    onSendRefundRequest?.({ refundType, remarks, departureSelected, returnSelected, selectedPassengers });
  };

  if (!data) return null;

  return (
    <Grid container spacing={3}>
      {/* Left column - Refund details */}
      <Grid item xs={12} lg={9}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Refund Information */}
          <Box sx={REFUND_FORM_STYLES.card}>
            <Typography sx={{ ...REFUND_FORM_STYLES.sectionHeader, mb: 2 }}>
              Refund Information
            </Typography>

            {/* Voluntary / In-voluntary reissue description boxes */}
            <Grid container spacing={1} sx={{ mb: 1 }}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    border: "1px solid #E5E7EB",
                    bgcolor: "#F9FAFB",
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 15, color: "var(--primary-color)" }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "var(--primary-color)" }}>
                      Voluntary reissue
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: "#6B7280", lineHeight: 1 }}>
                    Change of mind, Change of itinerary, Personal purpose
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    border: "1px solid #E5E7EB",
                    bgcolor: "#F9FAFB",
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75 }}>
                    <InfoOutlinedIcon sx={{ fontSize: 15, color: "var(--primary-color)" }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "var(--primary-color)" }}>
                      In-voluntary reissue
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: "#6B7280", lineHeight: 1 }}>
                    Flight cancellations, Denied boarding, Schedule changes, Travel restrictions
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={refundType === "voluntary"}
                    onChange={handleRefundTypeChange("voluntary")}
                    sx={{ color: "var(--primary-color)", "&.Mui-checked": { color: "var(--primary-color)" } }}
                  />
                }
                label="Voluntary"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={refundType === "involuntary"}
                    onChange={handleRefundTypeChange("involuntary")}
                    sx={{ color: "var(--primary-color)", "&.Mui-checked": { color: "var(--primary-color)" } }}
                  />
                }
                label="In-Voluntary"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={refundType === "others"}
                    onChange={handleRefundTypeChange("others")}
                    sx={{ color: "var(--primary-color)", "&.Mui-checked": { color: "var(--primary-color)" } }}
                  />
                }
                label="Others"
              />
            </Box>
            <TextField
              label="Remarks"
              multiline
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              fullWidth
              placeholder="Enter refund reason or remarks..."
              InputLabelProps={{ sx: { color: "var(--primary-color)" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#E3F0FF",
                  borderRadius: "5px",
                  "& fieldset": { borderColor: "var(--primary-color)" },
                  "&:hover fieldset": { borderColor: "var(--primary-color)", borderWidth: "1px" },
                  "&.Mui-focused fieldset": { borderColor: "var(--primary-color)", borderWidth: "1px" },
                },
              }}
            />
          </Box>

          {/* Selected Flight Information */}
          <Box sx={REFUND_FORM_STYLES.card}>
            <Typography sx={{ ...REFUND_FORM_STYLES.sectionHeader, mb: 2 }}>
              Selected Flight Information
            </Typography>

            {/* Flight info banner - inside flight information */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.5,
                p: 0.5,
                mb: 2,
                borderRadius: "5px",
                bgcolor: "#FFF4E6",
                border: "1px solid #FFE0B2",
              }}
            >
              <InfoOutlinedIcon
                sx={{
                  fontSize: 14,
                  color: "#E65100",
                  flexShrink: 0,
                  mt: 0.25,
                }}
              />
              <Typography sx={{ fontSize: 11, color: "#5D4037", }}>
                You have the option to choose one or multiple Itinerary at once. Reissue this ticket will only impact the selected itinerary based on the airline's policy.
              </Typography>
            </Box>

            <BookingQueDetailsCard
              data={data}
              hideTitle
              showSelectionCheckboxes
              departureChecked={departureSelected}
              returnChecked={returnSelected}
              onDepartureCheckChange={setDepartureSelected}
              onReturnCheckChange={setReturnSelected}
            />
          </Box>

          {/* Select Passenger Information */}
          <Box sx={REFUND_FORM_STYLES.card}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Typography sx={{ ...REFUND_FORM_STYLES.sectionHeader }}>
                Select Passenger Information
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPassengers.length === travellers.length && travellers.length > 0}
                    indeterminate={selectedPassengers.length > 0 && selectedPassengers.length < travellers.length}
                    onChange={(e) => handleSelectAllPassengers(e.target.checked)}
                    sx={checkboxSx}
                  />
                }
                label="Select"
              />
            </Box>

            {/* Refund passenger info banner - inside passenger information */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: 1.5,
                mb: 2,
                borderRadius: "8px",
                bgcolor: "#FFF4E6",
                border: "1px solid #FFE0B2",
              }}
            >
              <InfoOutlinedIcon
                sx={{
                  fontSize: 15,
                  color: "#E65100",
                  flexShrink: 0,
                  mt: 0.25,
                }}
              />
              <Typography sx={{ fontSize: 11, color: "#5D4037", lineHeight: 1 }}>
                You have the option to choose multiple travelers at once. Refund this ticket will only impact the selected travelers based on the airline's policy.
              </Typography>
            </Box>

            <BookingQuePassengerList
              data={data}
              hideTitle
              hideBaggage
              selectable
              selectedPassengerIndices={selectedPassengers}
              onPassengerSelectionChange={handlePassengerSelection}
            />
          </Box>

          {/* Terms & Send Refund Request */}
          <Box sx={REFUND_FORM_STYLES.card}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  sx={{ color: "var(--primary-color)", "&.Mui-checked": { color: "var(--primary-color)" } }}
                />
              }
              label="By creating this Request you agree to our Terms & Conditions"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={!termsAccepted || sending}
              sx={{
                mt: 1.5,
                py: 0.5,
                bgcolor: "var(--primary-color)",
                color: "white",
                textTransform: "capitalize",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: "5px",
                "&:hover": { bgcolor: "var(--primary-color)", opacity: 0.9 },
                "&:disabled": { bgcolor: "#9CA3AF", color: "#fff" },
              }}
            >
              {sending ? "Sending..." : "Send Refund Request"}
            </Button>
          </Box>
        </Box>
      </Grid>

      {/* Right column - Fare details */}
      <Grid item xs={12} lg={3}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <BookingQueFareDetails data={data} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default BookingQueRefundForm;
