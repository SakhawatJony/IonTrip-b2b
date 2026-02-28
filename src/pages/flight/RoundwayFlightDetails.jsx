import React, { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import RoundwayFareDetails from "./RoundwayFareDetails";

const RoundwayFlightDetails = ({ data }) => {
    const [tab, setTab] = useState(0);
    const [logoErrors, setLogoErrors] = useState({});
    const bulletRowSx = {
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        pl: 1,
    };
    const bulletDotSx = {
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: "#D1D5DB",
        flexShrink: 0,
        mt: "4px",
    };
    const formatTime = (value) => {
        if (!value) return "";
        if (String(value).includes("T")) {
            const time = String(value).split("T")[1];
            return time ? time.slice(0, 5) : String(value);
        }
        const match = String(value).match(/(\d{1,2}):(\d{2})/);
        if (!match) return String(value);
        return `${String(match[1]).padStart(2, "0")}:${match[2]}`;
    };

    const formatDate = (value) => {
        if (!value) return "";
        if (String(value).includes("T")) {
            const date = new Date(value);
            if (!Number.isNaN(date.valueOf())) {
                return date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                });
            }
        }
        return String(value);
    };

    const normalizeSegments = (segments = [], fallback = {}) =>
        (segments || []).map((segment) => ({
            departTime: formatTime(segment?.departTime || segment?.departureTime || segment?.departure?.at),
            departDate: formatDate(
                segment?.departDate || segment?.departureDate || segment?.departureTime || segment?.departure?.at
            ),
            arriveTime: formatTime(segment?.arriveTime || segment?.arrivalTime || segment?.arrival?.at),
            arriveDate: formatDate(
                segment?.arriveDate || segment?.arrivalDate || segment?.arrivalTime || segment?.arrival?.at
            ),
            fromCode:
                segment?.fromCode ||
                segment?.departure ||
                segment?.departure?.iataCode ||
                fallback?.departCode ||
                "",
            fromName: segment?.fromName || segment?.departureAirport || segment?.departureLocation || "",
            toCode:
                segment?.toCode ||
                segment?.arrival ||
                segment?.arrival?.iataCode ||
                fallback?.arriveCode ||
                "",
            toName: segment?.toName || segment?.arrivalAirport || segment?.arrivalLocation || "",
            airline:
                segment?.airline ||
                segment?.marketingcareerName ||
                segment?.operatingCarrierName ||
                fallback?.airline ||
                "Airline",
            carrierCode:
                segment?.carrierCode ||
                segment?.marketingcareer ||
                segment?.operatingcareer ||
                fallback?.carrierCode ||
                data?.carrierCode ||
                data?.career ||
                "",
            flight:
                segment?.flight ||
                `${segment?.marketingcareer || segment?.carrierCode || ""} ${segment?.marketingflight || segment?.number || ""}`.trim(),
            aircraft: segment?.aircraft || segment?.aircraft?.code || "N/A",
            cabin: segment?.cabin || segment?.class || data?.class || data?.cabinClass || "",
            bookingClass:
                segment?.bookingClass ||
                (segment?.bookingcode ? `${segment.bookingcode} Class` : ""),
            baggage:
                segment?.baggage ||
                segment?.bags ||
                data?.checkedBaggage ||
                data?.pricebreakdown?.[0]?.CheckInBags ||
                "",
            duration:
                segment?.duration ||
                segment?.flightduration ||
                fallback?.duration ||
                "",
            transit: segment?.transit || segment?.transit?.transit1 || "",
        }));

    const outboundRaw = data?.details?.outboundSegments?.length
        ? data.details.outboundSegments
        : data?.segments?.go || [];
    const returnRaw = data?.details?.returnSegments?.length
        ? data.details.returnSegments
        : data?.segments?.back || [];

    const outboundSummary = data?.segments?.[0] || {};
    const returnSummary = data?.segments?.[1] || {};

    const outboundSegments = normalizeSegments(outboundRaw, outboundSummary);
    const returnSegments = normalizeSegments(returnRaw, returnSummary);

    const outboundRoute = outboundSegments.length
        ? `${outboundSegments[0]?.fromCode || "—"} → ${outboundSegments[outboundSegments.length - 1]?.toCode || "—"}`
        : `${outboundSummary?.departCode || "—"} → ${outboundSummary?.arriveCode || "—"}`;
    const returnRoute = returnSegments.length
        ? `${returnSegments[0]?.fromCode || "—"} → ${returnSegments[returnSegments.length - 1]?.toCode || "—"}`
        : `${returnSummary?.departCode || "—"} → ${returnSummary?.arriveCode || "—"}`;

    const renderSegments = (segments) => (
        <Box sx={{ px: 2.5, py: 2 }}>
            {segments.map((segment, i) => {
                const nextSegment = segments[i + 1];
                const logoCode = String(segment?.carrierCode || "").toUpperCase();
                const logoKey = `${logoCode}-${i}`;
                const logoUrl = logoCode
                    ? `https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/airlines-logo/${logoCode}.png`
                    : "";
                const hasLogo = Boolean(logoUrl) && !logoErrors[logoKey];
                const layoverAirportCode = segment?.toCode || "";
                const layoverAirportName = segment?.toName || "";
                const layoverDuration = segment?.transit || "";

                return (
                <Box key={`${segment.flight}-${i}`}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Box
                            sx={{
                                width: 24,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    backgroundColor: "#E6EEF7",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                }}
                            >
                                {hasLogo ? (
                                    <Box
                                        component="img"
                                        src={logoUrl}
                                        alt={segment?.airline || "Airline"}
                                        sx={{ width: 18, height: 18, objectFit: "contain" }}
                                        onError={() =>
                                            setLogoErrors((prev) => ({
                                                ...prev,
                                                [logoKey]: true,
                                            }))
                                        }
                                    />
                                ) : (
                                    <FlightIcon sx={{ color: "#6B7A90", fontSize: 14 }} />
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ flex: 1, pb: i < segments.length - 1 ? 2 : 0 }}>
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <Typography fontSize={13} fontWeight={600}>
                                    {segment.departTime}
                                </Typography>
                                <Typography fontSize={11} color="#6B7280">
                                    {segment.departDate}
                                </Typography>
                                <Typography fontSize={12} color="#6B7280">
                                    →
                                </Typography>
                                <Typography fontSize={13} fontWeight={600}>
                                    {segment.arriveTime}
                                </Typography>
                                <Typography fontSize={11} color="#6B7280">
                                    {segment.arriveDate}
                                </Typography>
                            </Box>

                            <Box sx={{ ...bulletRowSx, mt: 0.75 }}>
                                <Box sx={bulletDotSx} />
                                <Typography fontSize={11} color="#6B7280">
                                    {segment.fromCode} - {segment.fromName} to {segment.toCode} - {segment.toName}
                                </Typography>
                            </Box>

                            <Box sx={{ ...bulletRowSx, mt: 0.75 }}>
                                <Box sx={bulletDotSx} />
                                <Typography fontSize={11} color="#6B7280">
                                    {segment.airline} - {segment.flight} / {segment.aircraft} · Duration{" "}
                                    {segment.duration}
                                </Typography>
                            </Box>

                            <Box sx={{ ...bulletRowSx, mt: 0.75 }}>
                                <Box sx={bulletDotSx} />
                                <Typography fontSize={11} color="#6B7280">
                                    {segment.cabin} / {segment.bookingClass} · Baggage {segment.baggage}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {i < segments.length - 1 && (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "40px 1fr",
                                alignItems: "center",
                                mt: 0.5,
                                mb: 1.5,
                            }}
                        >
                            <Box />
                            <Box sx={{ ...bulletRowSx, mt: 0.1 }}>
                                <Box
                                    sx={{
                                        ...bulletDotSx,
                                        backgroundColor: "var(--primary-color)",
                                    }}
                                />
                                <Typography fontSize={11} color="#6B7280">
                                    Stops {Math.max(1, segments.length - 1)} /{" "}
                                    {layoverAirportCode || layoverAirportName
                                        ? `Layover at ${layoverAirportCode}${
                                            layoverAirportName ? ` - ${layoverAirportName}` : ""
                                        }${layoverDuration ? ` (${layoverDuration})` : ""}`
                                        : nextSegment?.fromCode
                                            ? `Layover at ${nextSegment.fromCode}${
                                                nextSegment?.fromName ? ` - ${nextSegment.fromName}` : ""
                                            }`
                                            : layoverDuration
                                                ? `Layover ${layoverDuration}`
                                                : "Layover info"}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            )})}
        </Box>
    );

    return (
        <Box
            sx={{
                borderRadius: 2,
                backgroundColor: "#fff",
                overflow: "hidden",
            }}
        >
            <Tabs
                value={tab}
                onChange={(e, v) => setTab(v)}
                variant="fullWidth"
                sx={{
                    minHeight: 52,
                    borderTop: "2px solid #D9D9D9",
                    borderBottom: "2px solid #D9D9D9",
                    
                    
                    "& .MuiTabs-indicator": {
                        backgroundColor: "var(--primary-color)",
                        height: 3,
                    },
                    "& .MuiTab-root": {
                        borderRight: "2px solid #D9D9D9",
                        minHeight: 52,
                    },
                    "& .MuiTab-root:last-of-type": {
                        borderRight: "none",
                    },
                }}
            >
                <Tab
                    disableRipple
                    sx={{ alignItems: "flex-start", textTransform: "none" }}
                    label={
                        <Box>
                            <Typography fontSize={10} color="#6B7280">
                                Departure
                            </Typography>
                            <Typography fontSize={13} fontWeight={600} color="#111827">
                                {outboundRoute}
                            </Typography>
                        </Box>
                    }
                />
                <Tab
                    disableRipple
                    sx={{ alignItems: "flex-start", textTransform: "none" }}
                    label={
                        <Box>
                            <Typography fontSize={10} color="#6B7280">
                                Onward
                            </Typography>
                            <Typography fontSize={13} fontWeight={600} color="#111827">
                                {returnRoute}
                            </Typography>
                        </Box>
                    }
                />
                <Tab
                    disableRipple
                    sx={{ alignItems: "flex-start", textTransform: "none" }}
                    label={
                        <Box>
                            <Typography fontSize={10} color="#6B7280">
                                Fare Details &
                            </Typography>
                            <Typography fontSize={13} fontWeight={600} color="#111827">
                                Fare Policy
                            </Typography>
                        </Box>
                    }
                />
            </Tabs>

            {tab === 0 && renderSegments(outboundSegments)}
            {tab === 1 && renderSegments(returnSegments)}
            {tab === 2 && <RoundwayFareDetails data={data} />}
        </Box>
    );
};

export default RoundwayFlightDetails;
