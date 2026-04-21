import FlightIcon from "@mui/icons-material/Flight";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useState } from "react";
import { SECTION_CONTAINER_SX, SECTION_MAX_WIDTH } from "../../constants/sectionLayout";
import airAstraLogo from "../../assets/airlines/air-astra.svg";

/**
 * Kiwi.com airline logo CDN (64×64). Optional `localLogo` when IATA is missing or CDN omits the logo (e.g. 2A).
 */
const AIRLINES = [
  { name: "US-Bangla Airlines", iata: "BS" },
  { name: "Air Astra", iata: "2A", localLogo: airAstraLogo },
  { name: "Novo Air", iata: "VQ" },
  { name: "Biman Bangladesh Airlines", iata: "BG" },
  { name: "Qatar Airways", iata: "QR" },
  { name: "Emirates", iata: "EK" },
  { name: "Singapore Airlines", iata: "SQ" },
  { name: "Malaysia Airlines", iata: "MH" },
  { name: "Turkish Airlines", iata: "TK" },
  { name: "Air India", iata: "AI" },
  { name: "Cathay Pacific", iata: "CX" },
  { name: "IndiGo", iata: "6E" },
];

function AirlineLogo({ iata, localLogo }) {
  const theme = useTheme();
  const [failed, setFailed] = useState(false);
  const kiwiUrl = iata ? `https://images.kiwi.com/airlines/64x64/${encodeURIComponent(iata)}.png` : null;

  if (localLogo) {
    return (
      <Box
        component="img"
        src={localLogo}
        alt=""
        sx={{
          width: 48,
          height: 48,
          objectFit: "contain",
          flexShrink: 0,
        }}
      />
    );
  }

  if (!kiwiUrl || failed) {
    return (
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1,
          flexShrink: 0,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FlightIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={kiwiUrl}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      sx={{
        width: 48,
        height: 48,
        objectFit: "contain",
        flexShrink: 0,
      }}
    />
  );
}

export default function TrustedAirlineAlliances() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 5, md: 6 },
        bgcolor: "transparent",
      }}
    >
      <Container maxWidth={SECTION_MAX_WIDTH} disableGutters sx={SECTION_CONTAINER_SX}>
        <Box sx={{ textAlign: "center", maxWidth: 720, mx: "auto", mb: { xs: 4, md: 5 } }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.35rem", sm: "1.5rem", md: "1.75rem" },
              color: "text.primary",
              lineHeight: 1.25,
              mb: 1.5,
            }}
          >
            Travel Beyond Expectations with Our Trusted Airline Alliances
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.9rem", md: "1rem" },
              color: "var(--primary-color)",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            With IonTrip, your journey begins with the best names in the sky
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {AIRLINES.map((airline) => (
            <Grid item xs={6} sm={6} md={3} key={airline.name}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.75,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  borderRadius: 0.9,
                  bgcolor: "#ffffff",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.1)",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.14)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <AirlineLogo iata={airline.iata} localLogo={airline.localLogo} />
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    color: "text.primary",
                    lineHeight: 1.35,
                  }}
                >
                  {airline.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
