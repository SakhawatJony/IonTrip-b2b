import React from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { bgcolor, Box } from "@mui/system";
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
const SocailIcons = () => {
  return (
    <Box>
      <Box
        sx={{
          bgcolor: "var(--primary-color)",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <WhatsAppIcon sx={{ color: "var(--white)",fontSize:"30px",cursor:"pointer" }} />
      </Box>
      <Box
        sx={{
          bgcolor: "var(--primary-color)",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt:"1px"
        }}
      >
        <FacebookIcon sx={{ color: "var(--white)",fontSize:"30px",cursor:"pointer" }} />
      </Box>
      <Box
        sx={{
          bgcolor: "var(--primary-color)",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt:"1px"
        }}
      >
        <EmailIcon sx={{ color: "var(--white)",fontSize:"30px",cursor:"pointer" }} />
        
      </Box>
      <Box
        sx={{
          bgcolor: "var(--primary-color)",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          mt:"1px"
        }}
      >
        <LinkedInIcon sx={{ color: "var(--white)",fontSize:"30px" ,cursor:"pointer"}} />

      </Box>
    </Box>
  );
};

export default SocailIcons;
