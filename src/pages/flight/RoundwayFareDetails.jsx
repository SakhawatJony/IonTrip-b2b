import React from "react";
import { Box, Typography } from "@mui/material";

const RoundwayFareDetails = ({ data }) => {
  const rawPriceRows = Array.isArray(data?.pricebreakdown) ? data.pricebreakdown : [];
  const fallbackPriceRow = {
    PaxType: "ADULT",
    PaxCount: Number(data?.adult || 1),
    BaseFare: Number(data?.basePrice || 0),
    Tax: Number(data?.taxes || 0),
    ServiceFee: Number(data?.serviceFee || 0),
    OtherCharges: Number(data?.otherCharges || 0),
    Discount: Number(data?.discount || 0),
    currency: data?.farecurrency || data?.currency || "MYR",
  };
  const priceRows = rawPriceRows.length ? rawPriceRows : [fallbackPriceRow];

  const paxTypes = priceRows
    .map((row) => String(row?.PaxType || "").toUpperCase())
    .filter(Boolean);
  const uniquePaxTypes = Array.from(new Set(paxTypes));

  const groupedByPax = uniquePaxTypes.reduce((acc, type) => {
    const rows = priceRows.filter(
      (row) => String(row?.PaxType || "").toUpperCase() === type
    );
    const sum = (key) =>
      rows.reduce((total, row) => total + Number(row?.[key] || 0), 0);
    acc[type] = {
      PaxCount: sum("PaxCount") || rows.length || 0,
      BaseFare: sum("BaseFare"),
      Tax: sum("Tax"),
      ServiceFee: sum("ServiceFee"),
      OtherCharges: sum("OtherCharges"),
      Discount: sum("Discount"),
    };
    return acc;
  }, {});

  const paxLabelMap = {
    ADULT: "Adult",
    CHILD: "Child",
    HELD_INFANT: "Infant",
    INFANT: "Infant",
  };

  const getPax = (type) => groupedByPax[type] || null;

  const currency =
    priceRows[0]?.currency ||
    data?.farecurrency ||
    data?.AirFareData?.price?.currency ||
    "MYR";

  const formatAmount = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return `${currency} ${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const getAmount = (row, key) => (row?.[key] !== undefined ? row[key] : "");
  const calcSubtotal = (row) => {
    if (!row) return "";
    const base = Number(row.BaseFare || 0);
    const tax = Number(row.Tax || 0);
    const other = Number(row.OtherCharges || 0);
    const service = Number(row.ServiceFee || 0);
    const discount = Number(row.Discount || 0);
    const total = base + tax + other + service - discount;
    return total || "";
  };

  const makeRow = (label, key, formatter = formatAmount) => ({
    label,
    values: uniquePaxTypes.map((type) => {
      const row = getPax(type);
      const value = key === "subtotal" ? calcSubtotal(row) : getAmount(row, key);
      return formatter(value);
    }),
  });

  const fareRows = [
    makeRow(
      "Pax Count",
      "PaxCount",
      (value) => (value === null || value === undefined || value === "" ? "-" : value)
    ),
    makeRow("Base Fare", "BaseFare"),
    makeRow("TAX", "Tax"),
    makeRow("Service Fee", "ServiceFee"),
    makeRow("Other Charges", "OtherCharges"),
    makeRow("Discount", "Discount"),
    makeRow("Subtotal", "subtotal"),
  ];

  const totalDiscount = uniquePaxTypes.reduce(
    (sum, type) => sum + Number(groupedByPax[type]?.Discount || 0),
    0
  );

  const summaryRows = [
    {
      label: "Grand Total or Customer Total",
      value: formatAmount(
        data?.clientFare ||
          data?.agentFare ||
          data?.netPrice ||
          data?.basePrice ||
          data?.AirFareData?.price?.grandTotal
      ),
    },
    { label: "Discount", value: formatAmount(totalDiscount) },
    {
      label: "Agent Payable",
      value: formatAmount(
        data?.agentFare ||
          data?.netPrice ||
          data?.clientFare ||
          data?.basePrice ||
          data?.AirFareData?.price?.total
      ),
    },
  ];

  const notes = [
    "Cancellation charge will be: Refund Amount = Paid Amount - Airline Cancellation Fee",
    "Refund charge will be: Refund Fee = Airline's Fee + Fare Difference",
    "Re-Issue charge will be: Re-issue Fee = Airline's Fee + Fare Difference",
    "Void charge will be: Void Fee = Airline's Fee + Fare Difference",
  ];

  const rowSx = {
    display: "grid",
    gridTemplateColumns: `1.2fr repeat(${Math.max(uniquePaxTypes.length, 1)}, 1fr)`,
    alignItems: "stretch",
  };

  const leftHeaderCellSx = {
    backgroundColor: "#1F2838",
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: 600,
    px: 2,
    py: 1,
    borderRight: "1px solid #0F172A",
  };

  const headerCellSx = {
    backgroundColor: "var(--secondary-color, #024DAF)",
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: 600,
    px: 2,
    py: 1,
    textAlign: "center",
  };

  const leftCellSx = {
    backgroundColor: "#1F2838",
    color: "#FFFFFF",
    fontSize: 12,
    px: 2,
    py: 1,
    borderTop: "1px solid #ffffff",
  };

  const valueCellSx = {
    fontSize: 12,
    color: "#111827",
    px: 2,
    py: 1,
    borderTop: "1px solid #E5E7EB",
    textAlign: "center",
  };

  return (
    <Box sx={{ px: 2.5, py: 2 }}>
      <Box
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Box sx={rowSx}>
          <Box sx={leftHeaderCellSx}>Pax Type</Box>
          {(uniquePaxTypes.length ? uniquePaxTypes : [""]).map((type, index) => (
            <Box key={`${type}-${index}`} sx={headerCellSx}>
              {paxLabelMap[type] || (type ? type.replace("_", " ") : "-")}
            </Box>
          ))}
        </Box>

        {fareRows.map((row) => (
          <Box key={row.label} sx={rowSx}>
            <Box sx={leftCellSx}>{row.label}</Box>
            {(row.values.length ? row.values : ["-"]).map((value, index) => (
              <Box key={`${row.label}-${index}`} sx={valueCellSx}>
                {value}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 1.5 }}>
        {summaryRows.map((row) => (
          <Box
            key={row.label}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 0.35,
            }}
          >
            <Typography fontSize={11} color="#111827">
              {row.label}
            </Typography>
            <Typography fontSize={11} color="#111827">
              {row.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 1.5, borderTop: "1px solid #E5E7EB", pt: 1.25 }}>
        {notes.map((note) => (
          <Box
            key={note}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              mt: 0.5,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: "1px solid #D1D5DB",
                mt: "2px",
                flexShrink: 0,
              }}
            />
            <Typography fontSize={10} color="#6B7280">
              {note}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RoundwayFareDetails;
