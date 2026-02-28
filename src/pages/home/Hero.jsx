import { Box, Container, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import googleMaps from "../../assets/Home/googleMaps.svg";
import SocailIcons from "../../components/layout/SocailIcons";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: "relative", bgcolor: "#1F2838", color: "#fff",width:"94%" ,minHeight:"500px"}}>
      <Container sx={{ px: { xs: 6, md: 10 } ,py:"50px"}}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box>
              <Typography
                sx={{
                  fontWeight: 400,
                  color: "var(--white)",
                  fontSize: { xs: "28px", md: "35px" },
                }}
              >
                Start Your Travel Business <br /> & Grow more
              </Typography>

            <Typography
              sx={{
                opacity: 0.85,
                mb: 3,
                fontSize: "18px",
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
                onClick={() => navigate("/register")}
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
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <img
              src={googleMaps}
              style={{ height: "auto", width: "100%", display: "block" }}
              alt="map"
            />
          </Grid>
        </Grid>
      </Container>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          left: { xs: 0, md: 0 },
          top: "25%",
        }}
      >
        <SocailIcons />
      </Box>
    </Box>
  );
}
