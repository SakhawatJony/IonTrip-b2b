import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  Typography,
} from "@mui/material";

export default function Navbar() {
  // Get CSS variable values
  const getCSSVariable = (variableName) => {
    if (typeof window !== "undefined") {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
    }
    return "";
  };

  const primaryColor = getCSSVariable("--primary-color") || "#123D6E";
  const whiteColor = getCSSVariable("--white") || "#FFFFFF";
  const primaryTextColor = getCSSVariable("--primary-text-color") || "#202124";

  return (
    <Container maxWidth="lg">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography fontWeight="bold" fontSize={22} color="#123d6e">
          IonTrip
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          {["Home", "About Us", "Support", "QuickTickets"].map((item) => (
            <Typography
              key={item}
              sx={{
                color: primaryTextColor,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "16px",
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </Typography>
          ))}
          <Button
            sx={{
              backgroundColor: primaryColor,
              color: whiteColor,
              borderRadius: "17px",
              width: "100px",
              textTransform: "capitalize",

              "&:hover": {
                backgroundColor: primaryColor,
                opacity: 0.9,
              },
            }}
          >
            Sign In
          </Button>
        </Box>
      </Toolbar>
    </Container>
  );
}
