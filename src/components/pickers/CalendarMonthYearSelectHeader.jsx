import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import dayjs from "dayjs";

const CalendarMonthYearSelectHeader = ({
  currentMonth,
  onMonthChange,
  minDate,
  maxDate,
}) => {
  const [monthMenuPosition, setMonthMenuPosition] = useState(null);
  const [yearMenuPosition, setYearMenuPosition] = useState(null);
  const [monthMenuWidth, setMonthMenuWidth] = useState(86);
  const [yearMenuWidth, setYearMenuWidth] = useState(92);
  const baseMonth = currentMonth || dayjs();
  const minAllowed = minDate ? dayjs(minDate) : null;
  const maxAllowed = maxDate ? dayjs(maxDate) : null;

  const monthOptions = Array.from({ length: 12 }, (_, monthIndex) => {
    const optionDate = baseMonth.month(monthIndex).startOf("month");
    const disabled =
      (minAllowed && optionDate.endOf("month").isBefore(minAllowed, "day")) ||
      (maxAllowed && optionDate.startOf("month").isAfter(maxAllowed, "day"));
    return {
      value: monthIndex,
      label: optionDate.format("MMM"),
      disabled,
    };
  });

  const nowYear = dayjs().year();
  const minYear = minAllowed ? minAllowed.year() : nowYear - 80;
  const maxYear = maxAllowed ? maxAllowed.year() : nowYear + 20;
  const yearOptions = [];
  for (let year = minYear; year <= maxYear; year += 1) {
    yearOptions.push(year);
  }

  const handleMonthSelect = (monthIndex) => {
    onMonthChange(baseMonth.month(monthIndex), "left");
    setMonthMenuPosition(null);
  };

  const handleYearSelect = (year) => {
    onMonthChange(baseMonth.year(year), "left");
    setYearMenuPosition(null);
  };

  return (
    <Box sx={{ px: 1, pt: 0.75, pb: 0.25 }}>
      <Box sx={{ display: "flex", gap: 0.75 }}>
        <Button
          size="small"
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setMonthMenuPosition({ top: Math.round(rect.top), left: Math.round(rect.left) });
            setMonthMenuWidth(Math.round(rect.width) || 86);
          }}
          sx={{
            minWidth: 86,
            justifyContent: "space-between",
            textTransform: "none",
            fontSize: 13,
            fontWeight: 600,
            color: "#1F2A44",
            borderColor: "rgba(31,42,68,0.3)",
            px: 1.25,
          }}
        >
          {baseMonth.format("MMM")}
        </Button>
        <Menu
          open={Boolean(monthMenuPosition)}
          onClose={() => setMonthMenuPosition(null)}
          anchorReference="anchorPosition"
          anchorPosition={monthMenuPosition}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
          slotProps={{
            paper: {
              sx: {
                maxHeight: 280,
                mt: 0.5,
                minWidth: monthMenuWidth,
                zIndex: 2000,
              },
            },
          }}
        >
          {monthOptions.map((monthOption) => (
            <MenuItem
              key={monthOption.value}
              selected={monthOption.value === baseMonth.month()}
              disabled={monthOption.disabled}
              onClick={() => handleMonthSelect(monthOption.value)}
            >
              {monthOption.label}
            </MenuItem>
          ))}
        </Menu>

        <Button
          size="small"
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setYearMenuPosition({ top: Math.round(rect.top), left: Math.round(rect.left) });
            setYearMenuWidth(Math.round(rect.width) || 92);
          }}
          sx={{
            minWidth: 92,
            justifyContent: "space-between",
            textTransform: "none",
            fontSize: 13,
            fontWeight: 600,
            color: "#1F2A44",
            borderColor: "rgba(31,42,68,0.3)",
            px: 1.25,
          }}
        >
          {baseMonth.year()}
        </Button>
        <Menu
          open={Boolean(yearMenuPosition)}
          onClose={() => setYearMenuPosition(null)}
          anchorReference="anchorPosition"
          anchorPosition={yearMenuPosition}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
          slotProps={{
            paper: {
              sx: {
                maxHeight: 280,
                mt: 0.5,
                minWidth: yearMenuWidth,
                zIndex: 2000,
              },
            },
          }}
        >
          {yearOptions.map((year) => (
            <MenuItem
              key={year}
              selected={year === baseMonth.year()}
              onClick={() => handleYearSelect(year)}
            >
              {year}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default CalendarMonthYearSelectHeader;
