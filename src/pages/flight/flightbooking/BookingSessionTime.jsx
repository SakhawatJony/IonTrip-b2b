import React, { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BookingSessionTime = () => {
  const navigate = useNavigate();
  const totalSeconds = 20 * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      navigate("/dashboard", { replace: true });
    }
  }, [secondsLeft, navigate]);

  const timeLabel = useMemo(() => {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const progressValue = useMemo(
    () => (secondsLeft / totalSeconds) * 100,
    [secondsLeft, totalSeconds]
  );

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        p: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <Box>
        <Typography fontSize={12} color="#0F172A" fontWeight={700}>
          Time Remaining {timeLabel}
        </Typography>
        <Typography fontSize={10} color="#64748B">
          For security reason your session will close automatically
        </Typography>
      </Box>
      <CircularProgress
        variant="determinate"
        value={progressValue}
        size={32}
        thickness={5}
        sx={{ color: "#0F2F56" }}
      />
    </Box>
  );
};

export default BookingSessionTime;
