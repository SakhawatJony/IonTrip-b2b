import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  IconButton,
  Link,
  Slider,
  Typography,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const SECONDARY = "var(--secondary-color, #024DAF)";

const PANEL = {
  borderBottom: "1px solid #E5E7EB",
  pb: 1.5,
  mb: 1.5,
};

const TEXT_HEADING = SECONDARY;
const TEXT_BODY = "var(--secondary-color, #024DAF)";
const TEXT_MUTED = "#6B7280";
const BORDER_SUBTLE = "#D1D5DB";

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={PANEL}>
      <Box
        onClick={() => setOpen((o) => !o)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
          mb: open ? 1.25 : 0,
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: TEXT_HEADING, textTransform: "capitalize" }}>
          {title}
        </Typography>
        <IconButton size="small" sx={{ color: TEXT_MUTED, p: 0.25 }}>
          {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Box>
      <Collapse in={open}>{children}</Collapse>
    </Box>
  );
}

const defaultAmenities = [
  { id: "pool", label: "Swimming Pool" },
  { id: "gym", label: "Gym" },
  { id: "parking", label: "Parking" },
  { id: "spa", label: "Spa" },
];

const defaultLocations = [
  { id: "banani", label: "Banani" },
  { id: "gulshan", label: "Gulshan" },
  { id: "dhanmondi", label: "Dhanmondi" },
];

const roomTypes = ["Standard", "Deluxe", "Suite", "Family"];
const fareTypes = ["Refundable", "Non-refundable", "Breakfast included"];

export const createDefaultHotelFilters = () => ({
  priceRange: [5500, 55500],
  roomTypes: [],
  fareTypes: [],
  starMin: 0,
  amenities: [],
  locations: [],
});

/**
 * Left sidebar filters — white panel, secondary accents (controlled).
 */
const HotelFilter = ({ filters, onChange }) => {
  const patch = (partial) => onChange({ ...filters, ...partial });

  const handleReset = () => onChange(createDefaultHotelFilters());

  return (
    <Box
      sx={{
      
        flexShrink: 0,
        bgcolor: "#FFFFFF",
        border: `1px solid ${BORDER_SUBTLE}`,
        borderRadius: "12px",
        p: 2,
        position: { md: "sticky" },
        top: { md: 16 },
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          pb: 1.5,
          borderBottom: `2px solid ${SECONDARY}`,
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 800, color: TEXT_HEADING, letterSpacing: 0.08 }}>
          FILTER
        </Typography>
        <Link
          component="button"
          type="button"
          onClick={handleReset}
          underline="hover"
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: SECONDARY,
            cursor: "pointer",
            "&:hover": { opacity: 0.85 },
          }}
        >
          Reset
        </Link>
      </Box>

      <FilterSection title="View Map">
        <Button
          fullWidth
          variant="outlined"
          sx={{
            borderColor: SECONDARY,
            color: SECONDARY,
            textTransform: "none",
            py: 1,
            borderRadius: 1,
            "&:hover": {
              borderColor: SECONDARY,
              bgcolor: "rgba(2, 77, 175, 0.06)",
              color: SECONDARY,
            },
          }}
        >
          VIEW
        </Button>
      </FilterSection>

      <FilterSection title="Price Range">
        <Slider
          value={filters.priceRange}
          onChange={(_, v) => patch({ priceRange: v })}
          valueLabelDisplay="auto"
          min={3000}
          max={80000}
          step={500}
          sx={{
            color: SECONDARY,
            "& .MuiSlider-thumb": {
              bgcolor: SECONDARY,
              "&:hover, &.Mui-focusVisible": { boxShadow: "0 0 0 8px rgba(2, 77, 175, 0.22)" },
            },
            "& .MuiSlider-track": { bgcolor: SECONDARY },
            "& .MuiSlider-rail": { bgcolor: "#E5E7EB" },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
          <Typography sx={{ fontSize: 12, color: TEXT_MUTED }}>৳ {filters.priceRange[0].toLocaleString()}</Typography>
          <Typography sx={{ fontSize: 12, color: TEXT_MUTED }}>৳ {filters.priceRange[1].toLocaleString()}</Typography>
        </Box>
      </FilterSection>

      <FilterSection title="Room Type">
        <FormGroup>
          {roomTypes.map((rt) => (
            <FormControlLabel
              key={rt}
              control={
                <Checkbox
                  size="small"
                  checked={filters.roomTypes.includes(rt)}
                  onChange={() => {
                    const next = filters.roomTypes.includes(rt)
                      ? filters.roomTypes.filter((x) => x !== rt)
                      : [...filters.roomTypes, rt];
                    patch({ roomTypes: next });
                  }}
                  sx={{
                    color: BORDER_SUBTLE,
                    "&.Mui-checked": { color: SECONDARY },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: 13, color: TEXT_BODY }}>{rt}</Typography>}
            />
          ))}
        </FormGroup>
      </FilterSection>

      <FilterSection title="Fare Type">
        <FormGroup>
          {fareTypes.map((ft) => (
            <FormControlLabel
              key={ft}
              control={
                <Checkbox
                  size="small"
                  checked={filters.fareTypes.includes(ft)}
                  onChange={() => {
                    const next = filters.fareTypes.includes(ft)
                      ? filters.fareTypes.filter((x) => x !== ft)
                      : [...filters.fareTypes, ft];
                    patch({ fareTypes: next });
                  }}
                  sx={{
                    color: BORDER_SUBTLE,
                    "&.Mui-checked": { color: SECONDARY },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: 13, color: TEXT_BODY }}>{ft}</Typography>}
            />
          ))}
        </FormGroup>
      </FilterSection>

      <FilterSection title="Star Rating">
        {[5, 4, 3].map((stars) => {
          const selected = filters.starMin === stars;
          return (
            <Box
              key={stars}
              onClick={() => patch({ starMin: selected ? 0 : stars })}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                py: 0.75,
                cursor: "pointer",
                borderRadius: 1,
                px: 0.5,
                bgcolor: selected ? "rgba(2, 77, 175, 0.08)" : "transparent",
              }}
            >
              {[1, 2, 3, 4, 5].map((i) =>
                i <= stars ? (
                  <StarIcon key={i} sx={{ fontSize: 20, color: "#FBBF24" }} />
                ) : (
                  <StarBorderIcon key={i} sx={{ fontSize: 20, color: "#9CA3AF" }} />
                )
              )}
            </Box>
          );
        })}
      </FilterSection>

      <FilterSection title="Amenities">
        <FormGroup>
          {defaultAmenities.map((a) => (
            <FormControlLabel
              key={a.id}
              control={
                <Checkbox
                  size="small"
                  checked={filters.amenities.includes(a.id)}
                  onChange={() => {
                    const next = filters.amenities.includes(a.id)
                      ? filters.amenities.filter((x) => x !== a.id)
                      : [...filters.amenities, a.id];
                    patch({ amenities: next });
                  }}
                  sx={{
                    color: BORDER_SUBTLE,
                    "&.Mui-checked": { color: SECONDARY },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: 13, color: TEXT_BODY }}>{a.label}</Typography>}
            />
          ))}
        </FormGroup>
        <Link
          href="#"
          onClick={(e) => e.preventDefault()}
          sx={{ fontSize: 12, color: SECONDARY, mt: 0.5, display: "block", fontWeight: 600 }}
        >
          view all
        </Link>
      </FilterSection>

      <FilterSection title="Locations">
        <FormGroup>
          {defaultLocations.map((l) => (
            <FormControlLabel
              key={l.id}
              control={
                <Checkbox
                  size="small"
                  checked={filters.locations.includes(l.id)}
                  onChange={() => {
                    const next = filters.locations.includes(l.id)
                      ? filters.locations.filter((x) => x !== l.id)
                      : [...filters.locations, l.id];
                    patch({ locations: next });
                  }}
                  sx={{
                    color: BORDER_SUBTLE,
                    "&.Mui-checked": { color: SECONDARY },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: 13, color: TEXT_BODY }}>{l.label}</Typography>}
            />
          ))}
        </FormGroup>
        <Link
          href="#"
          onClick={(e) => e.preventDefault()}
          sx={{ fontSize: 12, color: SECONDARY, mt: 0.5, display: "block", fontWeight: 600 }}
        >
          view all
        </Link>
      </FilterSection>
    </Box>
  );
};

export default HotelFilter;
