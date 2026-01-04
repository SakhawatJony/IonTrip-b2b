import { Box, Container, Grid, Typography, Button } from "@mui/material";
import googleMaps from "../../assets/Home/googleMaps.svg";
import SocailIcons from "../../components/layout/SocailIcons";

export default function Hero() {
  return (
    <Box sx={{position:"relative",display:"flex"}}>
      <Box sx={{ bgcolor: "#1F2838", color: "#fff", py: 10, width: "97%" }}>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} pl={2}>
            <Typography
              sx={{ fontWeight: 400, color: "var(--white)", fontSize: "40px" }}
            >
              Start Your Travel Business <br /> & Grow more
            </Typography>

            <Typography
              sx={{
                opacity: 0.85,
                mb: 3,
                fontSize: "20px",
                color: "var(--white)",
              }}
            >
              Start your Journey with Us.
            </Typography>
            <Typography
              sx={{
                opacity: 0.85,
                mb: 3,
                fontSize: "13px",
                color: "#A3A1A1",
              }}
            >
              Lorem ipsum dolor sit amet consectetur. Ultricies velit egestas
              euismod rhoncus amet. Morbi egestas nulla ultricies semper. Vel
              gravida quis risus scelerisque posuere commodo massa ac. In
              convallis enim nibh vitae pellentesque nulla mi. Non semper nunc
              pellentesque facilisis elementum sollicitudin ut vestibulum
              egestas. Faucibus amet mattis vel laoreet laoreet tristique
              faucibus aliquet. Ut vitae sit pharetra commodo velit nisi et
              volutpat. Etiam amet ipsum egestas et et vel feugiat id consequat.
              Diam feugiat dui adipiscing platea nascetur purus quis.
            </Typography>

            <Button
              sx={{
                mt: 2,
                bgcolor: "var(--primary-color)",
                color: "var(--white)",
                fontSize: "14px",
                textTransform: "capitalize",
                fontWeight: 700,
                width: "180px",
                ":hover": {
                  bgcolor: "var(--primary-color)",
                  color: "var(--white)",
                },
              }}
            >
              Register as Agent
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <img
              src={googleMaps}
              style={{ height: "100%", width: "100%" }}
              alt="map"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
    <Box sx={{display:"flex",position:"absolute",top:"30%"}}>
      <SocailIcons />
    </Box>
    </Box>
  );
}
