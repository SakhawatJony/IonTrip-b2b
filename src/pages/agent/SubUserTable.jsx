import React, { useEffect, useMemo, useState } from "react";
import { Box, IconButton, Pagination, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const sampleRows = [
  {
    firstName: "Saiful",
    lastName: "Islam",
    role: "CEO",
    createdDate: "28 Mar 2026",
    email: "saiful.islam@example.com",
  },
  {
    firstName: "Jony",
    lastName: "Khan",
    role: "Managing Director",
    createdDate: "28 Mar 2026",
    email: "jony.khan@example.com",
  },
  {
    firstName: "Haisbul",
    lastName: "Islam",
    role: "Project Manager",
    createdDate: "28 Mar 2026",
    email: "haisbul.islam@example.com",
  },
  {
    firstName: "Sakhwat",
    lastName: "Hosen",
    role: "CTO",
    createdDate: "28 Mar 2026",
    email: "sakhwat.hosen@example.com",
  },
  {
    firstName: "Kabir Ahamed",
    lastName: "Khan",
    role: "Manager",
    createdDate: "27 Mar 2026",
    email: "kabirkhan.09@gmail.com",
  },
  {
    firstName: "Anowar",
    lastName: "Hosan",
    role: "Reservation Officer",
    createdDate: "27 Mar 2026",
    email: "anowar83hosan@gmail.com",
  },
  {
    firstName: "Md Uzzal",
    lastName: "Hasan",
    role: "Reservation Officer",
    createdDate: "27 Mar 2026",
    email: "fastairse@gmail.com",
  },
  {
    firstName: "Hossain",
    lastName: "Ahmed",
    role: "Manager",
    createdDate: "27 Mar 2026",
    email: "ham15101988@gmail.com",
  },
  {
    firstName: "Rahim",
    lastName: "Karim",
    role: "Support",
    createdDate: "28 Mar 2026",
    email: "rahim.karim@example.com",
  },
  {
    firstName: "Sara",
    lastName: "Yasmin",
    role: "Reservation Officer",
    createdDate: "28 Mar 2026",
    email: "sara.yasmin@example.com",
  },
];

const SECONDARY = "var(--secondary-color, #024DAF)";
const ROW_BORDER = "#E5E7EB";

const headerCellSx = {
  fontSize: 13,
  fontWeight: 600,
  color: "#FFFFFF",
};

const rowCellSx = {
  fontSize: 15,
  fontWeight: 500,
  color: "var(--primary-text-color, #202124)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const GRID =
  "minmax(100px, 1.1fr) minmax(100px, 1.1fr) minmax(96px, 1.15fr) minmax(100px, 0.95fr) minmax(140px, 1.6fr) minmax(88px, 96px)";

function filterRows(rows, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) =>
    [row.firstName, row.lastName, row.role, row.createdDate, row.email]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}

const SubUserTable = ({ searchQuery = "" }) => {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => filterRows(sampleRows, searchQuery), [searchQuery]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Box sx={{ minWidth: 900 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: GRID,
              alignItems: "center",
              columnGap: 1.5,
              px: 2.5,
              py: 1.35,
              borderRadius: "8px 8px 0 0",
              bgcolor: SECONDARY,
            }}
          >
            <Typography sx={headerCellSx}>First Name</Typography>
            <Typography sx={headerCellSx}>Last Name</Typography>
            <Typography sx={headerCellSx}>Role</Typography>
            <Typography sx={headerCellSx}>Created Date</Typography>
            <Typography sx={headerCellSx}>Email</Typography>
            <Typography sx={{ ...headerCellSx, textAlign: "center" }}>Action</Typography>
          </Box>

          {pageRows.map((row, index) => (
            <Box
              key={`${row.email}-${index}`}
              sx={{
                display: "grid",
                gridTemplateColumns: GRID,
                alignItems: "center",
                columnGap: 1.5,
                px: 2.5,
                py: 1.5,
                borderBottom: `1px solid ${ROW_BORDER}`,
                "&:last-of-type": {
                  borderBottom: `1px solid ${ROW_BORDER}`,
                },
              }}
            >
              <Typography sx={rowCellSx}>{row.firstName}</Typography>
              <Typography sx={rowCellSx}>{row.lastName}</Typography>
              <Typography sx={rowCellSx}>{row.role}</Typography>
              <Typography sx={rowCellSx}>{row.createdDate}</Typography>
              <Typography sx={rowCellSx} title={row.email}>
                {row.email}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.25,
                }}
              >
                <IconButton
                  size="small"
                  aria-label="Edit"
                  onClick={() => {}}
                  sx={{ color: SECONDARY }}
                >
                  <EditOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label="Delete"
                  onClick={() => {}}
                  sx={{ color: "var(--red-dark, #EB5757)" }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2.5, pr: { xs: 0, sm: 0.5 } }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
          showFirstButton
          showLastButton
          shape="rounded"
          siblingCount={1}
          sx={{
            "& .MuiPaginationItem-root": {
              fontWeight: 600,
              color: SECONDARY,
              border: "1px solid #E5E7EB",
              minWidth: 36,
              height: 36,
            },
            "& .MuiPaginationItem-ellipsis": {
              border: "none",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: `${SECONDARY} !important`,
              color: "#fff !important",
              borderColor: "transparent",
            },
            "& .MuiPaginationItem-root.Mui-selected:hover": {
              backgroundColor: `${SECONDARY} !important`,
              opacity: 0.92,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default SubUserTable;
