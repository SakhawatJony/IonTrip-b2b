import React from "react";
import { Box, Button, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const sectionTitleSx = {
  fontSize: 22,
  fontWeight: 600,
  color: "#111827",
};

const sectionSubtitleSx = {
  mt: 0.5,
  fontSize: 12.5,
  color: "#94A3B8",
};

const rowSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "260px 1fr" },
  gap: { xs: 0.5, sm: 4 },
  alignItems: "center",
  py: 1.6,
  borderBottom: "1px solid #E5E7EB",
};

const labelSx = {
  fontSize: 13.5,
  color: "#9CA3AF",
};

const valueSx = {
  fontSize: 13.5,
  color: "#111827",
};

const sectionCardSx = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: 1.5,
  px: { xs: 2, md: 3 },
  py: { xs: 2, md: 2.5 },
};

const Section = ({ title, subtitle, fields }) => {
  return (
    <Box sx={sectionCardSx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={sectionTitleSx}>{title}</Typography>
          <Typography sx={sectionSubtitleSx}>{subtitle}</Typography>
        </Box>
        <Button
          variant="text"
          startIcon={<EditOutlinedIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "#2563EB",
            px: 0,
            minWidth: "auto",
            "& .MuiButton-startIcon": { mr: 0.7 },
          }}
        >
          Edit
        </Button>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        {fields.map((field) => (
          <Box key={field.label} sx={rowSx}>
            <Typography sx={labelSx}>{field.label}</Typography>
            <Typography sx={valueSx}>{field.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const AgentProfile = () => {
  const companyInformation = [
    { label: "Company Name", value: "Syed Afridi" },
    { label: "Agent Name", value: "Male" },
    { label: "Present Address", value: "Syed Afridi" },
    { label: "Permanent Address", value: "Male" },
    { label: "Date of Birth", value: "Syed Afridi" },
    { label: "Passport Number", value: "Male" },
    { label: "Passport Expiry Date", value: "Syed Afridi" },
    { label: "National ID", value: "Male" },
    { label: "Nationality", value: "Male" },
    { label: "Phone Number", value: "Syed Afridi" },
    { label: "Emergency Contact", value: "Syed Afridi" },
  ];

  const loginCredentials = [
    { label: "Email", value: "Male" },
    { label: "Password", value: "Syed Afridi" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 9.5 },
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Section
        title="Company Information"
        subtitle="Basic info, for a faster booking experience"
        fields={companyInformation}
      />
      <Section
        title="Login Credentials"
        subtitle="Manage your email address, mobile number and password"
        fields={loginCredentials}
      />
    </Box>
  );
};

export default AgentProfile;
