import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
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

const cardSx = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: 1.5,
  px: { xs: 2, md: 3 },
  py: { xs: 2, md: 2.5 },
  transition: "background-color 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "#FFF1F2",
  },
};

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

const balanceSx = {
  fontSize: 12.5,
  fontWeight: 600,
  color: "#0F2F56",
};

const ledgerCards = [
  {
    type: "Deposit",
    id: "FFB 1001",
    balance: "BDT45,000",
    rows: [
      {
        label: "Remarks",
        value:
          "BDT 20,000 Dhaka Bank to Datch Bangla Bank Trx: 525656264562",
      },
      { label: "Status", value: "Approve at 22 Feb 2022" },
    ],
  },
  {
    type: "Reissue",
    id: "FFB 1001",
    balance: "BDT45,000",
    rows: [
      {
        label: "Remarks",
        value:
          "Dhaka - Dubai, Oneway Airticket By Biman Bangladesh at 22 Feb 2022",
      },
      { label: "Status", value: "Reissue at 22 Feb 2022" },
    ],
  },
];

const LedgerReport = () => {
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
          <Typography sx={headerTitleSx}>Ledger Report</Typography>
          <Typography sx={headerSubtitleSx}>
            Basic info, for a faster booking experience
          </Typography>
        </Box>

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
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {ledgerCards.map((card, index) => (
          <Box key={`${card.type}-${index}`} sx={cardSx}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Typography fontSize={15} fontWeight={700} color="#0F2F56">
                {card.type} ID #{card.id}
              </Typography>
              <Typography sx={balanceSx}>
                Remaining Balance: {card.balance}
              </Typography>
            </Box>
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

export default LedgerReport;
