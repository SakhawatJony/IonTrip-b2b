import React, { useState, useEffect } from "react";
import { Box, IconButton, Grid, Typography, Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Slider 1, 2, 3 – pictures from src/assets/Home (slide1.jpg, slide2.jpg, slide3.jpg)
import slide1 from "../../assets/Home/slide1.jpg";
import slide2 from "../../assets/Home/slide2.jpg";
import slide3 from "../../assets/Home/slide3.jpg";

const slides = [
  { image: slide1, title: "Discover Your Next Adventure", description: "Book flights, hotels & tours in one place. Best prices guaranteed." },
  { image: slide2, title: "Exclusive Travel Deals", description: "Save more on your next trip with our limited-time offers." },
  { image: slide3, title: "Travel Smarter", description: "Compare options and get the best value for your journey." },
];

const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

const Promotion = () => {
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setIndex((i) => (i + 1) % slides.length);

  useEffect(() => {
    const timer = setInterval(goNext, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // Show 3 columns: rotated by index so auto-slide shifts the order
  const visibleSlides = [
    slides[index % slides.length],
    slides[(index + 1) % slides.length],
    slides[(index + 2) % slides.length],
  ];

  return (
    <Box
      sx={{
        mb: 5,
        mx: { xs: 1, sm: "60px" },
        position: "relative",
        px: 4,
      }}
    >
      {/* Previous – far left, circular light grey */}
      <IconButton
        onClick={goPrev}
        aria-label="Previous"
        sx={{
          position: "absolute",
          left: { xs: -5, sm: 6 },
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          width: 30,
          height: 30,
          backgroundColor: "rgba(200, 200, 200, 0.9)",
          color: "#555",
          "&:hover": {
            backgroundColor: "rgba(220, 220, 220, 0.95)",
            color: "#333",
          },
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {/* 3 columns side-by-side, auto-slide rotates order */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ height: 150 }}>
        {visibleSlides.map((slide, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                minHeight: 150,
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderBottom: "4px solid var(--secondary-color, #024DAF)",
                transition: "opacity 0.4s ease",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                  pointerEvents: "none",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.75,
                  zIndex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 14, sm: 15 },
                    fontWeight: 700,
                    color: "#FFFFFF",
                    lineHeight: 1.2,
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 11, sm: 12 },
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1.3,
                  }}
                >
                  {slide.description}
                </Typography>

              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Next – far right */}
      <IconButton
        onClick={goNext}
        aria-label="Next"
        sx={{
          position: "absolute",
          right: { xs: -4, sm: 6 },
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          width: 30,
          height: 30,
          backgroundColor: "rgba(200, 200, 200, 0.9)",
          color: "#555",
          "&:hover": {
            backgroundColor: "rgba(220, 220, 220, 0.95)",
            color: "#333",
          },
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default Promotion;
