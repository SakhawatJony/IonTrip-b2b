import React, { useId } from "react";
import { Box } from "@mui/material";

const WORLD_MAP_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg";
/** Real aircraft photo (Unsplash — free to use). Bundled in /public for reliability. */
const AIRPLANE_SRC = "/images/hero-airplane.jpg";

/**
 * Hero right: dotted globe + arcs + large airplane in front (matches reference layout).
 */
export default function HeroRightVisual() {
  const uid = useId().replace(/:/g, "");
  const filterId = `hero-arc-${uid}`;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: 380, md: 520 },
        overflow: "visible",
      }}
    >
      {/* Ambient particles */}
      <Box
        sx={{
          position: "absolute",
          inset: "-4%",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.5,
          backgroundImage:
            "radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.85) 50%, transparent 50%), radial-gradient(1.2px 1.2px at 78% 18%, rgba(186,230,253,0.9) 50%, transparent 50%), radial-gradient(1px 1px at 55% 88%, rgba(255,255,255,0.6) 50%, transparent 50%), radial-gradient(1px 1px at 92% 62%, rgba(147,197,253,0.75) 50%, transparent 50%)",
          backgroundSize: "130% 100%",
        }}
      />

      {/* Blue glow behind globe */}
      <Box
        sx={{
          position: "absolute",
          right: { xs: "0", md: "4%" },
          top: "50%",
          transform: "translateY(-50%)",
          width: { xs: "min(100%, 360px)", md: "min(100%, 440px)" },
          aspectRatio: "1",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 48% 40%, rgba(0,86,179,0.5) 0%, rgba(37,99,235,0.14) 48%, transparent 72%)",
          filter: "blur(4px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Positioning context: globe + airplane share this box */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: { xs: 360, md: 480 },
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-end" },
          pr: { md: 1 },
        }}
      >
        {/* Globe + arcs (no airplane inside — avoids clipping) */}
        <Box
          sx={{
            position: "relative",
            width: { xs: "min(100%, 320px)", md: "min(100%, 400px)" },
            aspectRatio: "1",
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow:
                "0 0 100px rgba(0,86,179,0.45), inset 0 -28px 70px rgba(0,0,0,0.5), inset 0 0 50px rgba(120,190,255,0.14)",
              background:
                "radial-gradient(circle at 35% 30%, #2563a8 0%, #0f3468 42%, #061428 78%, #000814 100%)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                opacity: 0.35,
                backgroundImage:
                  "radial-gradient(1px 1px at center, rgba(147,197,253,0.55) 50%, transparent 51%)",
                backgroundSize: "4px 4px",
                pointerEvents: "none",
              }}
            />
            <Box
              component="img"
              src={WORLD_MAP_IMAGE}
              alt=""
              sx={{
                position: "absolute",
                inset: "-8%",
                width: "116%",
                height: "116%",
                objectFit: "cover",
                opacity: 0.9,
                filter: "invert(1) brightness(1.15) contrast(1.1)",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                opacity: 0.38,
                backgroundImage:
                  "radial-gradient(1px 1px at center, rgba(255,255,255,0.95) 50%, transparent 51%)",
                backgroundSize: "5px 5px",
                mixBlendMode: "overlay",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 50% 48%, transparent 50%, rgba(0,6,18,0.72) 100%)",
                pointerEvents: "none",
              }}
            />
          </Box>

          <Box
            component="svg"
            viewBox="0 0 400 400"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 2,
              overflow: "visible",
            }}
            aria-hidden
          >
            <defs>
              <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 48 218 Q 175 95 340 175"
              fill="none"
              stroke="rgba(224,242,254,0.95)"
              strokeWidth="1.35"
              filter={`url(#${filterId})`}
            />
            <path
              d="M 72 275 Q 205 155 328 235"
              fill="none"
              stroke="rgba(147,197,253,0.85)"
              strokeWidth="1.15"
              filter={`url(#${filterId})`}
            />
            <path
              d="M 118 108 Q 238 38 292 95"
              fill="none"
              stroke="rgba(186,230,253,0.75)"
              strokeWidth="1"
              filter={`url(#${filterId})`}
            />
            {[
              [48, 218],
              [340, 175],
              [72, 275],
              [328, 235],
              [118, 108],
              [292, 95],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="3.5" fill="#f0f9ff" opacity={0.95} filter={`url(#${filterId})`} />
            ))}
          </Box>
        </Box>

        {/* Abstract shapes — reference-style layered wing / UI motif over globe */}
        <Box
          sx={{
            position: "absolute",
            left: { xs: "2%", md: "6%" },
            top: { xs: "2%", md: "0%" },
            width: { xs: 100, md: 140 },
            height: { xs: 160, md: 220 },
            borderRadius: "28px",
            bgcolor: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            transform: "rotate(-22deg)",
            zIndex: 5,
            pointerEvents: "none",
            backdropFilter: "blur(2px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: { xs: "18%", md: "22%" },
            top: { xs: "8%", md: "6%" },
            width: { xs: 56, md: 72 },
            height: { xs: 56, md: 72 },
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.85)",
            boxShadow: "0 0 24px rgba(186,230,253,0.35)",
            zIndex: 5,
            pointerEvents: "none",
          }}
        />

        {/* Real airplane photo — composited over globe + arcs */}
        <Box
          component="img"
          src={AIRPLANE_SRC}
          alt="Commercial aircraft"
          sx={{
            position: "absolute",
            right: { xs: "-8%", md: "-4%" },
            top: { xs: "0%", md: "-2%" },
            width: { xs: "min(100vw, 400px)", md: "min(58vw, 540px)" },
            maxWidth: 580,
            height: "auto",
            objectFit: "contain",
            zIndex: 8,
            transform: "rotate(-22deg)",
            transformOrigin: "center center",
            filter:
              "saturate(1.08) contrast(1.05) brightness(1.03) drop-shadow(0 32px 56px rgba(0,0,0,0.6)) drop-shadow(0 -8px 24px rgba(120,190,255,0.15))",
            pointerEvents: "none",
            userSelect: "none",
            display: "block",
          }}
        />
      </Box>
    </Box>
  );
}
