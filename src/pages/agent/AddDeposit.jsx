import React, { useState } from "react";
import { Box, Button, Typography, TextField, Tabs, Tab } from "@mui/material";

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

const tabSx = {
  textTransform: "none",
  fontSize: 13,
  fontWeight: 600,
  minHeight: 32,
  px: 2.5,
  borderRadius: 1,
  color: "#FFFFFF",
  "&.Mui-selected": {
    color: "#0F2F56",
    backgroundColor: "#FFFFFF",
  },
};

const formRowSx = {
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

const AddDeposit = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [formData, setFormData] = useState({
    senderName: "Dhaka Bank",
    receiverName: "Bangladesh Bank",
    reference: "ADA84851561",
    amount: "50000",
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Submit deposit request", formData);
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
      {/* Header */}
      <Box>
        <Typography sx={headerTitleSx}>My Wallet</Typography>
        <Typography sx={headerSubtitleSx}>
          Basic info, for a faster booking experience
        </Typography>
      </Box>

      {/* Tab Bar */}
      <Box
        sx={{
          borderRadius: 1.5,
          backgroundColor: "#0F2F56",
          overflow: "hidden",
          width: "fit-content",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTabs-indicator": {
              display: "none",
            },
            "& .MuiTabs-flexContainer": {
              gap: 0.5,
            },
            minHeight: 40,
            p: 0.5,
          }}
        >
          <Tab disableRipple label="Cash" sx={tabSx} />
          <Tab disableRipple label="Cheque" sx={tabSx} />
          <Tab disableRipple label="Bank Tranasfer" sx={tabSx} />
          <Tab disableRipple label="Mobile Trnasfer" sx={tabSx} />
        </Tabs>
      </Box>

      {/* Form Section */}
      <Box>
        <Box sx={formRowSx}>
          <Typography sx={labelSx}>Sender Name</Typography>
          <Typography sx={valueSx}>{formData.senderName}</Typography>
        </Box>
        <Box sx={formRowSx}>
          <Typography sx={labelSx}>Receiver Name</Typography>
          <Typography sx={valueSx}>{formData.receiverName}</Typography>
        </Box>
        <Box sx={formRowSx}>
          <Typography sx={labelSx}>Refference</Typography>
          <Typography sx={valueSx}>{formData.reference}</Typography>
        </Box>
        <Box sx={{ ...formRowSx, borderBottom: "none" }}>
          <Typography sx={labelSx}>Enter Amount</Typography>
          <Typography sx={valueSx}>{formData.amount}</Typography>
        </Box>
      </Box>

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            textTransform: "none",
            fontSize: 13,
            fontWeight: 600,
            px: 3,
            py: 1.2,
            backgroundColor: "#2F2F2F",
            "&:hover": { backgroundColor: "#1F1F1F" },
          }}
        >
          Submit Deposit Request
        </Button>
      </Box>
    </Box>
  );
};

export default AddDeposit;
