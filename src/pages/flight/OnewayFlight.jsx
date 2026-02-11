import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Collapse, Grid, Typography, Tooltip } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightIcon from "@mui/icons-material/Flight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import OnewayFlightDetails from "./OnewayFlightDetails";
import OnewayBrandedFare from "./OnewayBrandedFare";
import dayjs from "dayjs";
import durationIcon from "../../assets/duration icons.svg";

const OnewayFlight = ({ flight }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [brandedOpen, setBrandedOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();
  const data = flight;
  const logoUrl = data?.carrierCode
    ? `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${data.carrierCode}.png`
    : "";
  const handleToggleDetails = () => {
    setDetailsOpen((prev) => !prev);
  };

  const handleToggleBranded = () => {
    setBrandedOpen((prev) => !prev);
  };

  const formatDate = (value) => {
    if (!value) return "";
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format("DD MMM, YYYY") : value;
  };

  const formatTime = (value) => {
    if (!value) return "";
    const parsed = dayjs(value);
    if (parsed.isValid()) {
      return parsed.format("HH:mm");
    }
    const match = String(value).match(/(\d{1,2}):(\d{2})/);
    if (!match) return value;
    const hours = String(match[1]).padStart(2, "0");
    return `${hours}:${match[2]}`;
  };

  const formatTitleCase = (value) => {
    if (!value) return "";
    return String(value)
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const stopCount = useMemo(() => {
    const rawStops = String(data?.stops || "").toLowerCase();
    if (!rawStops) return 0;
    if (rawStops.includes("non")) return 0;
    const match = rawStops.match(/\d+/);
    if (match) return Number(match[0]);
    return 0;
  }, [data?.stops]);

  const timelineDots = useMemo(() => {
    const count = Math.max(2, stopCount + 2);
    return Array.from({ length: count }, (_, index) => index);
  }, [stopCount]);

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 2,
        p: 1.75,
        border: "1px solid #E8EAEE",
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Grid
        container
        spacing={1.5}
        alignItems="center"
        wrap="nowrap"
      >
        {/* Airline */}
        <Grid item md={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                height: 30,
                width: 30,
                borderRadius: "50%",
                backgroundColor: "#E6EEF7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {logoUrl && !logoError ? (
                <img
                  src={logoUrl}
                  alt={data?.airline || "Airline"}
                  style={{ width: 35, height: 35 }}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <FlightTakeoffIcon sx={{ fontSize: 20, color: "#6B7A90" }} />
              )}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Tooltip title={formatTitleCase(data.airline)} arrow placement="top">
                <Typography
                  noWrap
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--marku)",
                    textTransform: "capitalize",
                  }}
                >
                  {formatTitleCase(data.airline)}
                </Typography>
              </Tooltip>
              <Typography noWrap sx={{ fontSize: 10.5, color: "var(--sub)" }}>
                {data.flightNo}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Date */}
        <Grid item md={1.1}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.4,
            }}
          >
            <FlightIcon
              sx={{
                color: "var(--primary-color)",
                fontSize: 18,
                rotate: "90deg",
              }}
            />
            <Typography sx={{ fontSize: 11, color: "var(--sub)", fontWeight: 600, textWrap: "nowrap" }}>
              {formatDate(data.departDate)}
            </Typography>
          </Box>
        </Grid>

        {/* Departure */}
        <Grid item md={1.1}>
          <Box textAlign="right">
            <Typography
              sx={{ fontSize: 18, color: "var(--primary-light)", fontWeight: 600 }}
            >
              {formatTime(data.departTime)}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "var(--sub)", fontWeight: 500 }}>
              {data.departCode}
            </Typography>
          </Box>
        </Grid>

        {/* Timeline */}
        <Grid item md={1.6}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box
              component="img"
              src={durationIcon}
              alt="Duration"
              sx={{ width: "85%", height: "100%", }}
            />
          </Box>




        </Grid>

        {/* Arrival */}
        <Grid item md={1.1}>
          <Box textAlign="left">
            <Typography
              sx={{ fontSize: 18, color: "var(--primary-light)", fontWeight: 600 }}
            >
              {formatTime(data.arriveTime)}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "var(--sub)", fontWeight: 500 }}>
              {data.arriveCode}
            </Typography>
          </Box>
        </Grid>

        {/* Duration */}
        <Grid item md={1.1}>
          <Box textAlign="left">
            <Typography sx={{ fontSize: 12, color: "#74757C", fontWeight: 400 }}>
              {data.duration}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "#53555D", fontWeight: 600 }}>
              {data.stops}
            </Typography>
          </Box>
        </Grid>

        {/* Price */}
        <Grid
          item
          md={3}
          sx={{
            borderLeft: "1px solid #E6E6E6",
            pl: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={0.5} justifyContent="flex-start">
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: "var(--primary-light)" }}>
              {data.price}
            </Typography>
            
          </Box>

          <Typography
            sx={{
              fontSize: 11,
              color: "#A2A6A9",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 0.4,
              textWrap: "nowrap",
            }}
          >
            <EventSeatIcon sx={{ fontSize: 12, color: "#A2A6A9" }} />
            {data.seats}
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              color: "#A2A6A9",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 0.4,
            }}
          >
            <WorkOutlineIcon sx={{ fontSize: 12, color: "#A2A6A9" }} />
            {data.baggage}{" "}
            <Box component="span" sx={{ color: "#8DB163", fontWeight: 600 }}>
              | {data.refundable}
            </Box>
          </Typography>

          <Box display="flex" justifyContent="flex-end" width="100%" gap={1} mt={1}>
            <Button
              endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 10 }} />}
              onClick={handleToggleDetails}
              sx={{
                textTransform: "none",
                backgroundColor: "#0F2F56",
                color: "#fff",
                fontSize: 11,
                height: 28,
                borderRadius: 1,
                width: "100%",
                textWrap: "nowrap",

                fontWeight: 600,
                "&:hover": { backgroundColor: "#0B2442" },
              }}
            >
              Flight Details
            </Button>
            <Button
             
              onClick={handleToggleBranded}
              sx={{
                textTransform: "none",
                backgroundColor: "#0F2F56",
                color: "#fff",
                fontSize: 11,
                height: 28,
                borderRadius: 1,
                width: "100px",

                fontWeight: 600,
                "&:hover": { backgroundColor: "#0B2442" },
              }}
            >
              Select
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Collapse in={brandedOpen} timeout="auto" unmountOnExit>
        <OnewayBrandedFare />
      </Collapse>

      <Collapse in={detailsOpen} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <OnewayFlightDetails data={data} />
        </Box>
      </Collapse>
    </Box>
  );
};

export default OnewayFlight;
