import { Button, Grid, Typography } from "@mui/material";
import { bgcolor, Box, color, Container } from "@mui/system";
import React from "react";

const Subscribe = () => {
  return (
    <Box
      sx={{
        bgcolor: "#F5F7FA",
        height: "150px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Box>
              <Typography
                sx={{
                  color: "var(--primary-color)",
                  fontSize: "28px",
                  fontWeight: "700px",
                }}
              >
                Save money & Save Time
              </Typography>
              <Typography
                sx={{
                  color: "#333333",
                  fontSize: "18px",
                  fontWeight: "700px",
                }}
              >
                Subscribe our latest newsletter for all upcoming updates
              </Typography>
            </Box>
          </Grid>
          <Grid item md={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Enter Your Email"
                style={{
                  background: "var(--white)",
                  height: "40px",
                  width: "60%",
                  outline: "none",
                  border: "none",
                  paddingLeft: "5px",
                }}
              />
              <Button
                sx={{
                  bgcolor: "#202124",
                  color: "var(--white)",
                  textTransform: "capitalize",
                  ":hover": {
                    bgcolor: "#202124",
                    color: "var(--white)",
                    textTransform: "capitalize",
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Subscribe;
