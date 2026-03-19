import React from "react";
import { Box } from "@mui/material";

const iconWrap = {
  width: 34,
  height: 34,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

/** Real-world travel-related tab icons (colorful, readable at small size) */

export function FlightTabIcon() {
  return (
    <Box sx={iconWrap} aria-hidden>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Airliner side view — fuselage + main wing + tail */}
        <path
          d="M4 17.5 L15 12.5 L15 9 L18.5 9 L19.5 12.5 L30 15.5 L30 19.5 L19.5 22.5 L18.5 26 L15 26 L15 22.5 L4 17.5 Z"
          fill="#2563EB"
        />
        <path d="M15 13 L22 17.5 L15 22 L15 13 Z" fill="#1D4ED8" opacity="0.95" />
        <ellipse cx="11" cy="17.5" rx="2.8" ry="1.6" fill="#93C5FD" />
        <path d="M27 16.5 L30 17.5 L27 18.5 Z" fill="#1E3A8A" />

        {/* Extra plane silhouette (keeps the icon clearly "airplane") */}
        <path
          d="M9.5 8.2 L13.8 12.1 L12.1 13.2 L7.9 10.7 L5.5 10.1 L7.7 8.9 L9.5 8.2 Z"
          fill="#93C5FD"
          opacity="0.9"
        />
        <path
          d="M13.6 12.0 L20.2 16.0 L19.6 18.0 L13.1 14.9 L13.6 12.0 Z"
          fill="#1D4ED8"
          opacity="0.8"
        />
      </svg>
    </Box>
  );
}

export function HotelTabIcon() {
  return (
    <Box sx={iconWrap} aria-hidden>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hotel — awning + multi-floor windows + entrance */}
        <rect x="7" y="14" width="20" height="16" rx="1.2" fill="#1E40AF" />
        <path d="M6 14 L17 8 L28 14 V16 H6 V14Z" fill="#B91C1C" />
        <rect x="10" y="11" width="14" height="2.5" rx="0.4" fill="#FCA5A5" />
        <rect x="9" y="17" width="3.2" height="3.2" rx="0.35" fill="#BFDBFE" />
        <rect x="13.9" y="17" width="3.2" height="3.2" rx="0.35" fill="#BFDBFE" />
        <rect x="18.8" y="17" width="3.2" height="3.2" rx="0.35" fill="#BFDBFE" />
        <rect x="23.7" y="17" width="3.2" height="3.2" rx="0.35" fill="#BFDBFE" />
        <rect x="9" y="21.5" width="3.2" height="3.2" rx="0.35" fill="#BFDBFE" />
        <rect x="13.9" y="21.5" width="3.2" height="3.2" rx="0.35" fill="#BFDBFE" />
        <rect x="18.8" y="21.5" width="3.2" height="3.2" rx="0.35" fill="#BFDBFE" />
        <rect x="23.7" y="21.5" width="3.2" height="3.2" rx="0.35" fill="#BFDBFE" />
        <rect x="14" y="25" width="6" height="5" rx="0.5" fill="#172554" />
        <circle cx="17" cy="27.5" r="0.6" fill="#FBBF24" />
      </svg>
    </Box>
  );
}

export function TourTabIcon() {
  return (
    <Box sx={iconWrap} aria-hidden>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Globe (destinations) + rolling suitcase = tour package */}
        <circle cx="13" cy="13" r="7" fill="#0EA5E9" />
        <path
          d="M6 13a7 7 0 1014 0M13 6a10 10 0 000 14M8 8.5c2 4 6 4 10 0M8 17.5c2-4 6-4 10 0"
          stroke="#E0F2FE"
          strokeWidth="0.9"
          fill="none"
        />
        <ellipse cx="13" cy="13" rx="2.5" ry="7" stroke="#0369A1" strokeWidth="0.6" fill="none" />
        <rect x="17" y="15" width="14" height="11" rx="1.8" fill="#DB2777" />
        <rect x="19" y="12" width="10" height="4.5" rx="1" fill="#F472B6" />
        <path d="M20.5 12v-2a1.3 1.3 0 012.6 0v2" stroke="#9D174D" strokeWidth="0.9" fill="none" />
        <circle cx="27.5" cy="18.5" r="2.2" fill="#FBCFE8" />
        <path d="M26 17.8c.5.35 1.2.35 1.7 0" stroke="#BE185D" strokeWidth="0.65" fill="none" strokeLinecap="round" />
        <rect x="19.5" y="21" width="9" height="1.6" rx="0.35" fill="#FDA4AF" />
      </svg>
    </Box>
  );
}

export function VisaTabIcon() {
  return (
    <Box sx={iconWrap} aria-hidden>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Passport + red “VISA” stamp */}
        <rect x="5" y="7" width="22" height="19" rx="2" fill="#F1F5F9" stroke="#64748B" strokeWidth="1" />
        <rect x="5" y="7" width="22" height="6" rx="2" fill="#0F766E" />
        <rect x="8" y="9.2" width="4" height="2.2" rx="0.3" fill="#FDE68A" />
        <rect x="13" y="9.2" width="4" height="2.2" rx="0.3" fill="#FDE68A" />
        <rect x="18" y="9.2" width="4" height="2.2" rx="0.3" fill="#FDE68A" />
        <rect x="8" y="15" width="16" height="1.3" rx="0.3" fill="#CBD5E1" />
        <rect x="8" y="17.5" width="12" height="1.3" rx="0.3" fill="#CBD5E1" />
        <rect x="8" y="20" width="14" height="1.3" rx="0.3" fill="#CBD5E1" />
        {/* Red ink “stamp” + star = visa approved */}
        <g transform="translate(16 22) rotate(-10)">
          <rect x="0" y="0" width="11" height="5" rx="0.5" fill="#FECACA" stroke="#DC2626" strokeWidth="0.7" />
          <path
            d="M5.5 1.2l.6 1.2 1.3.2-1 .9.3 1.3-1.2-.7-1.2.7.3-1.3-1-.9 1.3-.2.6-1.2z"
            fill="#B91C1C"
          />
        </g>
        <circle cx="11" cy="25" r="2.2" fill="#334155" />
        <path d="M11 23.2v1.6l1 .6" stroke="#94A3B8" strokeWidth="0.5" fill="none" />
      </svg>
    </Box>
  );
}
