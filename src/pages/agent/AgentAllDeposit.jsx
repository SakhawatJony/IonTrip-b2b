import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Typography } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const headerTitleSx = {
  fontSize: 22,
  fontWeight: 700,
  color: "#0F172A",
};

const headerSubtitleSx = {
  fontSize: 12,
  color: "#94A3B8",
  mt: 0.4,
};

const cardSx = (highlighted) => ({
  backgroundColor: highlighted ? "#FFF1F2" : "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: 1.5,
  px: { xs: 2, md: 3 },
  py: { xs: 2, md: 2.5 },
  transition: "background-color 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "#FFF1F2",
  },
});

const rowSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "200px 1fr" },
  gap: { xs: 0.5, sm: 3 },
  alignItems: "center",
  py: 1.4,
  borderBottom: "1px solid #E5E7EB",
};

const labelSx = {
  fontSize: 12.5,
  color: "#9CA3AF",
};

const valueSx = {
  fontSize: 13.5,
  color: "#111827",
};

const depositCards = [
  {
    id: "FFB 1001",
    highlighted: false,
    rows: [
      {
        label: "Remarks",
        value:
          "Dhaka - Dubai, Oneway Airticket By Biman Bangladesh at 22 Feb 2022",
      },
      { label: "Status", value: "Hold at 22 Feb 2022" },
      { label: "Attachment", value: "view" },
    ],
  },
  {
    id: "FFB 1001",
    highlighted: false,
    rows: [
      {
        label: "Remarks",
        value:
          "Dhaka - Dubai, Oneway Airticket By Biman Bangladesh at 22 Feb 2022",
      },
      { label: "Status", value: "Hold at 22 Feb 2022" },
      { label: "Attachment", value: "view" },
    ],
  },
];

const AgentAllDeposit = () => {
  const navigate = useNavigate();

  const handleAddDeposit = () => {
    navigate("/dashboard/adddeposit");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        px: { xs: 2, md: 9.5 },
        my: "30px",
        mx: "80px",
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography sx={headerTitleSx}>All Deposit</Typography>
          <Typography sx={headerSubtitleSx}>
            Basic info, for a faster booking experience
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              backgroundColor: "#0F2F56",
              color: "#FFFFFF",
              "&:hover": { backgroundColor: "#0B2442" },
            }}
          >
            <SearchOutlinedIcon fontSize="small" />
          </IconButton>
          <Button
            variant="contained"
            onClick={handleAddDeposit}
            sx={{
              textTransform: "none",
              fontSize: 13,
              fontWeight: 600,
              px: 2.5,
              backgroundColor: "#2F2F2F",
              "&:hover": { backgroundColor: "#1F1F1F" },
            }}
          >
            Add Deposit
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {depositCards.map((card, index) => (
          <Box key={`${card.id}-${index}`} sx={cardSx(card.highlighted)}>
            <Typography fontSize={15} fontWeight={700} color="#0F2F56" mb={1.5}>
              Deposit ID #{card.id}
            </Typography>
            <Box>
              {card.rows.map((row) => (
                <Box key={row.label} sx={rowSx}>
                  <Typography sx={labelSx}>{row.label}</Typography>
                  <Typography sx={valueSx}>{row.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AgentAllDeposit;
