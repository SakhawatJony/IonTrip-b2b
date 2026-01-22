import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

const Promotion = () => {
  const promoImages = [
    "https://images.unsplash.com/photo-1504198458649-3128b932f49b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80",
  ];
  const [promoIndex, setPromoIndex] = useState(0);
  const [brokenIndexes, setBrokenIndexes] = useState(new Set());

  const getNextIndex = (currentIndex) => {
    if (promoImages.length === 0) return 0;
    for (let step = 1; step <= promoImages.length; step += 1) {
      const nextIndex = (currentIndex + step) % promoImages.length;
      if (!brokenIndexes.has(nextIndex)) return nextIndex;
    }
    return 0;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => getNextIndex(prev));
    }, 4000);
    return () => clearInterval(timer);
  }, [promoImages.length, brokenIndexes]);

  return (
    <Box
      sx={{

     
        borderRadius: "10px",
        overflow: "hidden",
        height: { xs: "90px", sm: "110px", md: "200px" },
        position: "relative",
        backgroundColor: "#E8EDF4",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        component="img"
        src={promoImages[promoIndex]}
        alt="promotion"
        onError={() => {
          setBrokenIndexes((prev) => new Set(prev).add(promoIndex));
          setPromoIndex((prev) => getNextIndex(prev));
        }}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: 12,
          bottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 0.6,
          backgroundColor: "rgba(0,0,0,0.15)",
          borderRadius: "999px",
          px: 0.8,
          py: 0.4,
        }}
      >
        {promoImages.map((_, index) => (
          <Box
            key={index}
            onClick={() => setPromoIndex(index)}
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor:
                index === promoIndex ? "#FFFFFF" : "rgba(255,255,255,0.6)",
              border: "1px solid rgba(0,0,0,0.15)",
              cursor: "pointer",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Promotion;
