import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import SubUserTable from "./SubUserTable";

const SubUserList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <Box sx={{ minHeight: "100vh", pb: 3 }}>
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 3 }}>
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderRadius: 1,
            p: { xs: 2, md: 3 },
            border: "1px solid #E5E7EB",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "flex-end",
              gap: 1.5,
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                gap: 1.5,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <TextField
                size="small"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ fontSize: 18, color: "var(--secondary-color, #024DAF)", mr: 0.75 }} />
                  ),
                }}
                sx={{
                  width: { xs: "100%", sm: 280 },
                  flexShrink: 0,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#F8FAFC",
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "#D0D5DD" },
                    "&:hover fieldset": { borderColor: "#D0D5DD" },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--secondary-color, #024DAF)",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/dashboard/sub-users/add-user")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  bgcolor: "var(--secondary-color, #024DAF)",
                  color: "#fff",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "var(--secondary-color, #024DAF)", opacity: 0.92, boxShadow: "none" },
                  "& .MuiButton-startIcon": { color: "#fff" },
                }}
              >
                Add Staff
              </Button>
            </Box>
          </Box>

          <SubUserTable searchQuery={search} />
        </Box>
      </Box>
    </Box>
  );
};

export default SubUserList;
