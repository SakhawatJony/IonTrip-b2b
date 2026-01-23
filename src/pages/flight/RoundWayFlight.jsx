import React, { useState } from "react";
import { Box, Button, Collapse, Divider, Grid, Typography, Tooltip } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightIcon from "@mui/icons-material/Flight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RoundwayFlightDetails from "./RoundwayFlightDetails";
import OnewayBrandedFare from "./OnewayBrandedFare";



const RoundWayFlight = ({ flight }) => {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [brandedOpen, setBrandedOpen] = useState(false);
    const data = flight || {
        segments: [
            {
                airline: "Biman Bangladesh",
                flightNo: "BG 458 | BG 542 | BG 542",
                departTime: "23:30",
                departDate: "11 Apr 2028",
                departCode: "DXB",
                arriveTime: "18:00",
                arriveDate: "11 Apr 2028",
                arriveCode: "DAC",
                duration: "35h 40m",
                stops: "3 Stops",
            },
            {
                airline: "Biman Bangladesh",
                flightNo: "BG 458 | BG 542 | BG 542",
                departTime: "23:30",
                departDate: "11 Apr 2028",
                departCode: "LAX",
                arriveTime: "18:00",
                arriveDate: "11 Apr 2028",
                arriveCode: "DAC",
                duration: "35h 40m",
                stops: "3 Stops",
            },
        ],
        price: "BDT 286,121",
        seats: "6 Seat available",
        baggage: "Baggage 30KG",
        refundable: "Refundable",
    };

    const handleToggleDetails = () => {
        setDetailsOpen((prev) => !prev);
    };

    const handleToggleBranded = () => {
        setBrandedOpen((prev) => !prev);
    };

    return (
        <Box
            sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: 2,
                p: 2,
                border: "1px solid #E8EAEE",
                boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.06)",
            }}
        >
            <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={12} md={8.9}>

                    {data.segments.map((segment, index) => (
                        <Box
                            key={`${segment.flightNo}-${index}`}
                            sx={{
                                py: 1.5,
                                borderBottom:
                                    index === data.segments.length - 1 ? "none" : "1px solid #E6E6E6",
                            }}
                        >
                            <Grid container spacing={2} alignItems="center" wrap="nowrap">
                            {/* Airline */}
                            <Grid item md={3.9}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                    <Box
                                        sx={{
                                            height: 35,
                                            width: 35,
                                            borderRadius: "50%",
                                            backgroundColor: "#E53935",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <FlightTakeoffIcon sx={{ color: "#FFFFFF", fontSize: 20 }} />
                                    </Box>

                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography noWrap sx={{ fontSize: 13, fontWeight: 700, color: "var(--marku)" }}>
                                            {segment.airline}
                                        </Typography>
                                        <Typography noWrap sx={{ fontSize: 11, color: "var(--sub)" }}>
                                            {segment.flightNo}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Date */}
                            <Grid item md={1.6}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 0.4,
                                    }}
                                >
                                    <FlightIcon sx={{ color: "var(--primary-color)", fontSize: 20, rotate: "90deg" }} />
                                    <Typography sx={{ fontSize: 11, color: "var(--sub)", fontWeight: 600 }}>
                                        {segment.departDate}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Departure */}
                            <Grid item md={1.4}>
                                <Box textAlign="right">
                                    <Typography sx={{ fontSize: 19, color: "var(--primary-light)", fontWeight: 500 }}>
                                        {segment.departTime}
                                    </Typography>
                                    <Typography sx={{ fontSize: 15, color: "var(--sub)", fontWeight: 500 }}>
                                        {segment.departCode}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Timeline */}
                            <Grid item md={1.6}>
                                <Box display="flex" justifyContent="center" alignItems="center" sx={{ px: 0.8 }}>
                                    {[0, 1, 2].map((dot) => (
                                        <Box
                                            key={dot}
                                            sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: "50%",
                                                border: "1px solid #8FB3E0",
                                                mx: 0.4,
                                            }}
                                        />
                                    ))}
                                    <Box sx={{ fontSize: 16, color: "#9AA4B2", ml: 0.4 }}>→</Box>
                                </Box>
                            </Grid>

                            {/* Arrival */}
                            <Grid item md={1.4}>
                                <Box textAlign="left">
                                    <Typography sx={{ fontSize: 19, color: "var(--primary-light)", fontWeight: 500 }}>
                                        {segment.arriveTime}
                                    </Typography>
                                    <Typography sx={{ fontSize: 15, color: "var(--sub)", fontWeight: 500 }}>
                                        {segment.arriveCode}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Duration */}
                            <Grid item md={2.1}>
                                <Box textAlign="left">
                                    <Typography sx={{ fontSize: 13, color: "#74757C" }}>{segment.duration}</Typography>
                                    <Typography sx={{ fontSize: 13, color: "#53555D" }}>{segment.stops}</Typography>
                                </Box>
                            </Grid>
                            </Grid>
                        </Box>
                    ))}

                </Grid>

                {/* Price + actions */}
                <Grid item xs={12} md={3.1} sx={{ borderLeft: { xs: "none", md: "1px solid #E6E6E6" } }}>
                    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                        <Box display="flex" alignItems="center" gap={0.5} justifyContent="flex-start">
                            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "var(--primary-light)" }}>
                                {data.price}
                            </Typography>
                            <Tooltip title="Branded Fare" arrow placement="top">
                                <Box
                                    onClick={handleToggleBranded}
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        backgroundColor: "#FFAF00",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                    }}
                                >
                                    <KeyboardArrowDownIcon
                                        sx={{
                                            color: "var(--white)",
                                            fontSize: 14,
                                            transform: brandedOpen ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.2s ease",
                                        }}
                                    />
                                </Box>
                            </Tooltip>
                        </Box>

                        <Typography sx={{ fontSize: 12, color: "#A2A6A9", textAlign: "left" }}>
                            {data.seats}
                        </Typography>

                        <Typography sx={{ fontSize: 12, color: "#A2A6A9", textAlign: "left" }}>
                            {data.baggage}{" "}
                            <Box component="span" sx={{ color: "#8DB163", fontWeight: 600 }}>
                                | {data.refundable}
                            </Box>
                        </Typography>

                        <Box display="flex" justifyContent="flex-end" width="100%" gap={1} mt="auto">
                        <Button
                            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 10 }} />}
                            onClick={handleToggleDetails}
                            sx={{
                                textTransform: "none",
                                border: "1px solid #D0D5DD",
                                fontSize: 10.5,
                                height: 30,
                                borderRadius: 1,
                                width: "160px",
                                color: "#344054",
                                fontWeight: 600,
                                backgroundColor: "#FFFFFF",
                                "&:hover": { backgroundColor: "#F8FAFC", borderColor: "#D0D5DD" },
                            }}
                        >
                            Flight Details
                        </Button>
                        <Button
                            sx={{
                                textTransform: "none",
                                backgroundColor: "#0F2F56",
                                color: "#fff",
                                fontSize: 11,
                                height: 30,
                                borderRadius: 1,
                                width: "100px",
                                fontWeight: 600,
                                "&:hover": { backgroundColor: "#0B2442" },
                            }}
                        >
                            Book Now
                        </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Collapse in={brandedOpen} timeout="auto" unmountOnExit>
                <OnewayBrandedFare />
            </Collapse>

            <Collapse in={detailsOpen} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2 }}>
                    <RoundwayFlightDetails data={data} />
                </Box>
            </Collapse>
        </Box>
    );
};

export default RoundWayFlight;
