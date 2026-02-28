import {
  Toolbar,
  Container,
  Box,
  Button,
  Typography,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { currency, setCurrency } = useAuth();
  const currencies = useMemo(
    () => [
      { code: "MYR", label: "MYR", flagCode: "my" },
      { code: "BDT", label: "BDT", flagCode: "bd" },
      { code: "USD", label: "USD", flagCode: "us" },
      { code: "GBP", label: "GBP", flagCode: "gb" },
      { code: "INR", label: "INR", flagCode: "in" },
      { code: "PKR", label: "PKR", flagCode: "pk" },
      { code: "EUR", label: "EUR", flagCode: "eu" },
    ],
    []
  );
  const getFlagUrl = (flagCode) =>
    `https://flagcdn.com/w20/${flagCode}.png`;


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
    <Container >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography fontWeight="bold" fontSize={22} color="#123d6e" sx={{pl:"20px"}}>
          IonTrip
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          {["Home", "About Us", "Support"].map((item) => (
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
          {/* <FormControl variant="standard" sx={{ minWidth: 72 }}>
            <Select
              value={currency}
              onChange={(event) => {
                const nextCurrency = event.target.value;
                setCurrency(nextCurrency);
              }}
              renderValue={(value) => {
                const selected = currencies.find(
                  (item) => item.code === value
                );
                return (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                    <Box
                      component="img"
                      src={selected ? getFlagUrl(selected.flagCode) : ""}
                      alt={selected?.label || "Flag"}
                      sx={{ width: 18, height: 12, borderRadius: "2px" }}
                    />
                    <Box component="span">{selected?.label}</Box>
                  </Box>
                );
              }}
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: primaryTextColor,
                "&:before": { borderBottom: "none" },
                "&:after": { borderBottom: "none" },
                "& .MuiSelect-icon": { color: primaryTextColor },
              }}
              disableUnderline
            >
              {currencies.map((item) => (
                <MenuItem key={item.code} value={item.code}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <Box
                      component="img"
                      src={getFlagUrl(item.flagCode)}
                      alt={`${item.label} flag`}
                      sx={{ width: 18, height: 12, borderRadius: "2px" }}
                    />
                    <Box component="span">{item.label}</Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <Button
            onClick={() => navigate("/login")}
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
