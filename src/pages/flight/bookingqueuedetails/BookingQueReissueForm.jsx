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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import BookingQueDetailsCard from "./BookingQueDetailsCard";
import BookingQuePassengerList from "./BookingQuePassengerList";
import BookingQueFareDetails from "./BookingQueFareDetails";

const REISSUE_FORM_STYLES = {
  sectionHeader: { color: "var(--primary-color)", fontSize: "14px", fontWeight: 700 },
  card: {
    bgcolor: "#FFFFFF",
    borderRadius: 1,
    border: "1px solid #E5E7EB",
    p: 1,
  },
};

const checkboxSx = { color: "var(--primary-color)", "&.Mui-checked": { color: "var(--primary-color)" } };

const BookingQueReissueForm = ({ data, sending = false, onSendReissueRequest }) => {
  const [reissueType, setReissueType] = useState("voluntary");
  const [remarks, setRemarks] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [departureSelected, setDepartureSelected] = useState(true);
  const [returnSelected, setReturnSelected] = useState(true);
  const [departureReissueDate, setDepartureReissueDate] = useState(null);
  const travellers = data?.travellers || [];
  const [selectedPassengers, setSelectedPassengers] = useState([]);

  useEffect(() => {
    if (travellers.length > 0) {
      setSelectedPassengers(travellers.map((_, i) => i));
    } else {
      setSelectedPassengers([]);
    }
  }, [travellers.length]);

  const handleReissueTypeChange = (type) => () => setReissueType(type);

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
    onSendReissueRequest?.({
      reissueType,
      remarks,
      departureSelected,
      returnSelected,
      departureReissueDate,
      selectedPassengers,
    });
  };

  if (!data) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={9}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Reissue Information */}
          <Box sx={REISSUE_FORM_STYLES.card}>
            <Typography sx={{ ...REISSUE_FORM_STYLES.sectionHeader, mb: 2 }}>
              Reissue Information
            </Typography>

            <Grid container spacing={1} sx={{ mb: 1 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 1, borderRadius: 1, border: "1px solid #E5E7EB", bgcolor: "#F9FAFB", height: "100%" }}>
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
                <Box sx={{ p: 1, borderRadius: 1, border: "1px solid #E5E7EB", bgcolor: "#F9FAFB", height: "100%" }}>
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
                control={<Checkbox checked={reissueType === "voluntary"} onChange={handleReissueTypeChange("voluntary")} sx={checkboxSx} />}
                label="Voluntary"
              />
              <FormControlLabel
                control={<Checkbox checked={reissueType === "involuntary"} onChange={handleReissueTypeChange("involuntary")} sx={checkboxSx} />}
                label="In-Voluntary"
              />
              <FormControlLabel
                control={<Checkbox checked={reissueType === "others"} onChange={handleReissueTypeChange("others")} sx={checkboxSx} />}
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
              placeholder="Enter reissue reason or remarks..."
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
          <Box sx={REISSUE_FORM_STYLES.card}>
            <Typography sx={{ ...REISSUE_FORM_STYLES.sectionHeader, mb: 2 }}>
              Selected Flight Information
            </Typography>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, p: 0.5, mb: 2, borderRadius: "5px", bgcolor: "#FFF4E6", border: "1px solid #FFE0B2" }}>
              <InfoOutlinedIcon sx={{ fontSize: 14, color: "#E65100", flexShrink: 0, mt: 0.25 }} />
              <Typography sx={{ fontSize: 11, color: "#5D4037" }}>
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

            {/* Select new Journey Date - when departure selected */}
            {departureSelected && (() => {
              const goSegments = data?.segments?.go || [];
              const firstSeg = goSegments[0];
              const lastSeg = goSegments[goSegments.length - 1];
              const fromCode = data?.godeparture || firstSeg?.departure || firstSeg?.departureAirport || "—";
              const toCode = data?.goarrival || lastSeg?.arrival || lastSeg?.arrivalAirport || "—";
              const fromCity = firstSeg?.departureCityName || firstSeg?.departureAirportName || fromCode;
              const toCity = lastSeg?.arrivalCityName || lastSeg?.arrivalAirportName || toCode;
              const fromAirport = firstSeg?.departureAirportName || `${fromCode} Airport`;
              const toAirport = lastSeg?.arrivalAirportName || `${toCode} Airport`;
              return (
                <Box sx={{ mt: 2, p: 2, borderRadius: 1, border: "1px solid #E5E7EB", bgcolor: "#FAFAFA" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <CalendarMonthIcon sx={{ fontSize: 20, color: "var(--primary-color)" }} />
                    <Typography sx={{ ...REISSUE_FORM_STYLES.sectionHeader }}>
                      Select new Journey Date ({fromCode} - {toCode})
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ fontSize: 12, color: "#6B7280", mb: 0.5 }}>From</Typography>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                        <RadioButtonCheckedIcon sx={{ fontSize: 18, color: "var(--primary-color)", mt: 0.25 }} />
                        <Box>
                          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{fromCity}, {fromCode}</Typography>
                          <Typography sx={{ fontSize: 12, color: "#6B7280" }}>{fromAirport}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ fontSize: 12, color: "#6B7280", mb: 0.5 }}>To</Typography>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                        <ExpandMoreIcon sx={{ fontSize: 18, color: "#6B7280", mt: 0.25 }} />
                        <Box>
                          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{toCity}, {toCode}</Typography>
                          <Typography sx={{ fontSize: 12, color: "#6B7280" }}>{toAirport}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography sx={{ fontSize: 12, color: "#6B7280", mb: 0.5 }}>Reissue Date</Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={departureReissueDate}
                          onChange={(newValue) => setDepartureReissueDate(newValue)}
                          minDate={dayjs()}
                          format="DD MMM, YYYY"
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              sx: {
                                "& .MuiOutlinedInput-root": {
                                  bgcolor: "#FFFFFF",
                                  "& fieldset": { borderColor: "#E65100" },
                                  "&:hover fieldset": { borderColor: "#E65100" },
                                  "&.Mui-focused fieldset": { borderWidth: "2px", borderColor: "#E65100" },
                                },
                              },
                            },
                          }}
                          slots={{ openPickerIcon: CalendarMonthIcon }}
                        />
                        {departureReissueDate && (
                          <Typography sx={{ fontSize: 12, color: "#6B7280", mt: 0.5 }}>
                            {dayjs(departureReissueDate).format("dddd")}
                          </Typography>
                        )}
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Box>
              );
            })()}
          </Box>

          {/* Select Passenger Information */}
          <Box sx={REISSUE_FORM_STYLES.card}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Typography sx={REISSUE_FORM_STYLES.sectionHeader}>Select Passenger Information</Typography>
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

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, p: 1.5, mb: 2, borderRadius: "8px", bgcolor: "#FFF4E6", border: "1px solid #FFE0B2" }}>
              <InfoOutlinedIcon sx={{ fontSize: 15, color: "#E65100", flexShrink: 0, mt: 0.25 }} />
              <Typography sx={{ fontSize: 11, color: "#5D4037", lineHeight: 1 }}>
                You have the option to choose multiple travelers at once. Reissue this ticket will only impact the selected travelers based on the airline's policy.
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

          {/* Terms & Send Reissue Request */}
          <Box sx={REISSUE_FORM_STYLES.card}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  sx={checkboxSx}
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
              {sending ? "Sending..." : "Send Reissue Request"}
            </Button>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} lg={3}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <BookingQueFareDetails data={data} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default BookingQueReissueForm;
