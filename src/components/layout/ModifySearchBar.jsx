import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Collapse, Typography } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import dayjs from "dayjs";
import FlightSearchBox from "../../pages/flight/FlightSearchBox";

function parseAirport(label, fallbackCode) {
  if (!label) return { city: "", code: (fallbackCode || "").toUpperCase() };
  const m = String(label).match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (m) {
    return { city: m[1].trim(), code: m[2].trim().toUpperCase() };
  }
  return { city: String(label).trim(), code: (fallbackCode || "").toUpperCase() };
}

function formatDepartureDate(departureDateISO, travelDate) {
  if (departureDateISO && dayjs(departureDateISO).isValid()) {
    return dayjs(departureDateISO).format("D MMM YYYY");
  }
  if (travelDate) {
    const fromDisplay = dayjs(travelDate, "ddd, DD MMM YY");
    if (fromDisplay.isValid()) return fromDisplay.format("D MMM YYYY");
    const fuzzy = dayjs(travelDate);
    if (fuzzy.isValid()) return fuzzy.format("D MMM YYYY");
  }
  return "—";
}

function formatReturnDate(returnDateISO, returnDate) {
  if (returnDateISO && dayjs(returnDateISO).isValid()) {
    return dayjs(returnDateISO).format("D MMM YYYY");
  }
  if (returnDate) {
    const parsed = dayjs(returnDate, "ddd, DD MMM YY");
    if (parsed.isValid()) return parsed.format("D MMM YYYY");
  }
  return "";
}

function cabinLabel(travelClass) {
  const t = String(travelClass || "Economy").trim();
  if (/class/i.test(t)) return t;
  return `${t} Class`;
}

function totalPassengers(passengerCounts = {}) {
  const a = Number(passengerCounts.adults) || 0;
  const c = Number(passengerCounts.children) || 0;
  const i = Number(passengerCounts.infants) || 0;
  return Math.max(1, a + c + i);
}

/* Palette aligned with user reference (#001b48 / #218c53 / #757575) */
const COL = {
  primaryNavy: "#001B48",
  labelGray: "#757575",
  taxBlueGray: "#757575",
  cityGray: "#757575",
  divider: "#E5E7EB",
  border: "#E5E7EB",
  greenAvail: "#218C53",
  arrowGray: "#CED4DA",
  iconGray: "#212529",
  buttonNavy: "#001B48",
};

const metaLabelSx = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: 0,
  color: COL.labelGray,
  lineHeight: 1.2,
};

const metaValueSx = {
  fontSize: 14,
  fontWeight: 700,
  color: COL.primaryNavy,
  lineHeight: 1.2,
  fontFamily: "inherit",
};

const codeSx = {
  fontSize: 15,
  fontWeight: 700,
  color: COL.primaryNavy,
  lineHeight: 1.15,
  letterSpacing: 0.4,
};

const citySx = {
  fontSize: 12,
  fontWeight: 400,
  color: COL.cityGray,
  lineHeight: 1.2,
  mt: "3px",
};

/** 1px rule, fixed height — avoids stretch+wrap drawing a full-width gray band */
const DIVIDER_H = 48;

/**
 * Summary row + inline expand panel (no modal) for results pages.
 * Visual match: white bar, single row, green availability, blue-gray tax line, navy values.
 */
const ModifySearchBar = ({ searchParams = {}, flightCount = 0, loading = false }) => {
  const [expanded, setExpanded] = useState(false);

  const {
    from,
    to,
    fromCode,
    toCode,
    travelDate,
    departureDateISO,
    returnDate,
    returnDateISO,
    passengerCounts,
    travelClass,
    tripType,
  } = searchParams;

  const origin = useMemo(() => parseAirport(from, fromCode), [from, fromCode]);
  const dest = useMemo(() => parseAirport(to, toCode), [to, toCode]);
  const depFormatted = useMemo(
    () => formatDepartureDate(departureDateISO, travelDate),
    [departureDateISO, travelDate]
  );
  const retFormatted = useMemo(
    () => formatReturnDate(returnDateISO, returnDate),
    [returnDateISO, returnDate]
  );
  const isRoundTrip = /round/i.test(String(tripType || ""));

  const pax = totalPassengers(passengerCounts);
  const cabin = cabinLabel(travelClass);

  const flightSearchInitial = useMemo(
    () => ({
      ...searchParams,
      tripType: isRoundTrip ? "round-way" : tripType || "one-way",
    }),
    [searchParams, tripType, isRoundTrip]
  );

  const availabilityLine = loading
    ? "Searching flights…"
    : `${flightCount} Flights Available`;

  useEffect(() => {
    setExpanded(false);
  }, [searchParams]);

  return (
    <Box
      sx={{
        borderRadius: "5px",
        overflow: expanded ? "visible" : "hidden",
       
       
        bgcolor: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          px: { xs: 2, sm: "10px" },
          py: { xs: 2, sm: "10px" },
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: { xs: 1.5, sm: 2, md: 3 },
          width: "100%",
          
          boxSizing: "border-box",
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: 0,
          },
        }}
      >
        {/* Left cluster: flight status + route (never squeezed off) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
            columnGap: { xs: 1.5, sm: "28px", md: "40px" },
            flex: "0 1 auto",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, md: 0.5 },
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                border: `1px solid var(--secondary-color)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FlightIcon
                sx={{
                  fontSize: 20,
                  color: "var(--secondary-color)",
                  transform: "rotate(45deg)",
                }}
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="div"
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: loading ? COL.labelGray : "var(--secondary-color)",
                  lineHeight: 1.2,
                }}
              >
                {availabilityLine}
              </Typography>
              <Typography
                component="div"
                sx={{
                  fontSize: 11,
                  fontWeight: 400,
                  color: COL.taxBlueGray,
                  lineHeight: 1.25,
                  mt: "4px",
                }}
              >
                Price includes Vat & Tax
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.25, md: 1 },
              flexShrink: 0,
            }}
          >
            <Box sx={{ textAlign: "left", minWidth: 40 }}>
              <Typography sx={codeSx}>{origin.code || "—"}</Typography>
              <Typography sx={citySx} noWrap title={origin.city}>
                {origin.city || "—"}
              </Typography>
            </Box>
            <Typography
              component="span"
              sx={{
                fontSize: 15,
                lineHeight: 1,
                color: COL.arrowGray,
                flexShrink: 0,
                userSelect: "none",
                alignSelf: "center",
              }}
              aria-hidden
            >
              →
            </Typography>
            <Box sx={{ textAlign: "left", minWidth: 56 }}>
              <Typography sx={codeSx}>{dest.code || "—"}</Typography>
              <Typography sx={citySx} noWrap title={dest.city}>
                {dest.city || "—"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right cluster: divider + travel data + modify (always visible; no flex-grow “empty” zone) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
            columnGap: { xs: 2, sm: "20px", md: "20px" },
            flex: "0 0 auto",
            justifyContent: "flex-end",
          }}
        >
          <Box
            aria-hidden
            sx={{
              width: "1px",
              height: DIVIDER_H,
              flexShrink: 0,
              alignSelf: "center",
              bgcolor: COL.divider,
              display: { xs: "none", sm: "block" },
              mx: { sm: 0.5, md: 1 },
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              columnGap: { xs: 2.5, sm: "24px", md: "30px" },
              flexShrink: 0,
            }}
          >
            <Box sx={{ width: { xs: "auto", sm: 108 }, flexShrink: 0 }}>
              <Typography sx={metaLabelSx}>Departure</Typography>
              <Typography sx={{ ...metaValueSx, mt: "6px" }}>{depFormatted}</Typography>
            </Box>
            {isRoundTrip && retFormatted ? (
              <Box sx={{ width: { xs: "auto", sm: 108 }, flexShrink: 0 }}>
                <Typography sx={metaLabelSx}>Return</Typography>
                <Typography sx={{ ...metaValueSx, mt: "6px" }}>{retFormatted}</Typography>
              </Box>
            ) : null}
            <Box sx={{ width: { xs: "auto", sm: 72 }, flexShrink: 0 }}>
              <Typography sx={metaLabelSx}>Passenger</Typography>
              <Typography sx={{ ...metaValueSx, mt: "6px" }}>{pax}</Typography>
            </Box>
            <Box
              sx={{
                width: { xs: "auto", sm: 120 },
                maxWidth: 140,
                flexShrink: 0,
              }}
            >
              <Typography sx={metaLabelSx}>Cabin</Typography>
              <Typography
                sx={{
                  ...metaValueSx,
                  mt: "6px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
                title={cabin}
              >
                {cabin}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            disableElevation
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: 13,
              lineHeight: 1.2,
              borderRadius: "5px",
              px: 1,
              py: "8px",
              minHeight: 35,
              
              flexShrink: 0,
              alignSelf: "center",
              backgroundColor: COL.buttonNavy,
              color: "#FFFFFF",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#002a6b",
                boxShadow: "none",
              },
            }}
          >
            {expanded ? "Close" : "Modify Search"}
          </Button>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box
          sx={{
            borderTop: `1px solid ${COL.border}`,
            backgroundColor: "#FFFFFF",
            overflow: "visible",
          }}
        >
          <FlightSearchBox embedded initialSearchParams={flightSearchInitial} />
        </Box>
      </Collapse>
    </Box>
  );
};

export default ModifySearchBar;
