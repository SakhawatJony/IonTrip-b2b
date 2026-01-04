import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

export default function Contact() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: 320,
              // borderRadius: 2,
              borderRight:"5px solid var(--primary-color)",
              overflow: "hidden",
            }}
          >
            <iframe
              title="map"
              width="100%"
              height="100%"
              frameBorder="0"
              src="https://maps.google.com/maps?q=Dhaka&t=&z=13&ie=UTF8&iwloc=&output=embed"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography sx={{ fontSize: "35px", color: "#202124" }}>
            Get In Touch
          </Typography>

          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#5F6368",
                  }}
                >
                  First Name
                </label>
                <input
                  placeholder="Your First Name"
                  style={{
                    outline: "none",
                    border: "none",
                    marginTop: "10px",
                    borderBottom: "1px solid #B6B6CC",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#5F6368",
                  }}
                >
                  Last Name
                </label>
                <input
                  placeholder="Your Last Name"
                  style={{
                    outline: "none",
                    border: "none",
                    marginTop: "10px",
                    borderBottom: "1px solid #B6B6CC",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#5F6368",
                  }}
                >
                  Email
                </label>
                <input
                  placeholder="Your Email"
                  style={{
                    outline: "none",
                    border: "none",
                    marginTop: "10px",
                    borderBottom: "1px solid #B6B6CC",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#5F6368",
                  }}
                >
                  Phone Number
                </label>
                <input
                  placeholder="Your Phone Number"
                  style={{
                    outline: "none",
                    border: "none",
                    marginTop: "10px",
                    borderBottom: "1px solid #B6B6CC",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#5F6368",
                  }}
                >
                  Message
                </label>
                <textarea
                  placeholder="Your Message"
                  style={{
                    outline: "none",
                    border: "none",
                    marginTop: "10px",
                    borderBottom: "1px solid #B6B6CC",
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Button
            sx={{
              mt: 3,
              width: "200px",
              bgcolor: "var(--primary-color)",
              color: "var(--white)",
              textTransform:"capitalize",
              height: "45px",
              fontSize: "15px",
              ":hover":{
                 bgcolor: "var(--primary-color)",
              color: "var(--white)",
              }
            }}
          >
            Send Message
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
