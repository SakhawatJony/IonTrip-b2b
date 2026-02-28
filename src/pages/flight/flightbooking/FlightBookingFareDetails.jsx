import React from "react";
import { Box, Divider, Typography } from "@mui/material";

const parseNum = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const formatAmount = (currency, value) => {
  return `${currency} ${parseNum(value).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const toTitleCase = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getPaxTypeLabel = (value) => {
  const normalized = String(value || "")
    .replace(/_/g, " ")
    .trim()
    .toUpperCase();

  if (["ADT", "ADULT"].includes(normalized)) return "Adult";
  if (["CHD", "CHILD"].includes(normalized)) return "Child";
  if (["INF", "INFT", "INFANT", "HELD INFANT", "HELD_INFANT"].includes(normalized)) {
    return "Infant";
  }
  return toTitleCase(normalized);
};

const FlightBookingFareDetails = ({ data }) => {
  const currency =
    data?.farecurrency ||
    data?.pricebreakdown?.[0]?.currency ||
    data?.AirFareData?.data?.flightOffers?.[0]?.price?.currency ||
    "USD";

  // Build rows for each passenger type entry from pricebreakdown
  const rows = [];
  let travelerIndex = 0;
  
  (data?.pricebreakdown || []).forEach((row) => {
    const paxCount = parseNum(row?.PaxCount || 1) || 1;
    const paxType = getPaxTypeLabel(row?.PaxType || "TRAVELER");
    
    // Values in pricebreakdown are per-person fares
    const baseFarePerPax = parseNum(row?.BaseFare);
    const taxPerPax = parseNum(row?.Tax);
    const otherChargesPerPax = parseNum(row?.OtherCharges);
    const serviceFeePerPax = parseNum(row?.ServiceFee);
    const discountPerPax = parseNum(row?.Discount);
    
    // Calculate per-person total fare
    const farePerPax = baseFarePerPax + taxPerPax + otherChargesPerPax + serviceFeePerPax - discountPerPax;
    
    // Create individual entries for each passenger
    for (let i = 0; i < paxCount; i++) {
      travelerIndex++;
      rows.push({
        label: `Traveler ${travelerIndex} : ${paxType}`,
        value: formatAmount(currency, farePerPax),
      });
    }
  });

  // Calculate totals from pricebreakdown
  // BaseFare, Tax, etc. are per-person, so multiply by PaxCount to get totals
  const totals = (data?.pricebreakdown || []).reduce(
    (acc, row) => {
      const paxCount = parseNum(row?.PaxCount || 1) || 1;
      const baseFarePerPax = parseNum(row?.BaseFare);
      const taxPerPax = parseNum(row?.Tax);
      const otherChargesPerPax = parseNum(row?.OtherCharges);
      const serviceFeePerPax = parseNum(row?.ServiceFee);
      const discountPerPax = parseNum(row?.Discount);
      
      // Multiply per-person values by count to get totals
      acc.base += baseFarePerPax * paxCount;
      acc.taxFee += (taxPerPax + otherChargesPerPax + serviceFeePerPax) * paxCount;
      acc.discount += discountPerPax * paxCount;
      return acc;
    },
    { base: 0, taxFee: 0, discount: 0 }
  );
  
  // If no pricebreakdown, try to get totals from top-level fields
  if ((data?.pricebreakdown || []).length === 0) {
    const baseFromData = parseNum(data?.basePrice || data?.BaseFare || 0);
    const taxFromData = parseNum(data?.taxes || data?.Tax || 0);
    totals.base = baseFromData;
    totals.taxFee = taxFromData;
    totals.discount = 0;
  }

  const summaryRows = [
    { label: "Total Base Fare", value: formatAmount(currency, totals.base) },
    { label: "Total Tax & Fee", value: formatAmount(currency, totals.taxFee) },
    { label: "Discount", value: formatAmount(currency, totals.discount) },
  ];

  // Calculate grand total from pricebreakdown totals
  const calculatedTotal = totals.base + totals.taxFee - totals.discount;
  
  // Prioritize calculated total from pricebreakdown, then fallback to explicit values
  const grandTotalRaw =
    calculatedTotal > 0 ? calculatedTotal :
    data?.clientFare ??
    data?.netPrice ??
    data?.agentFare ??
    data?.AirFareData?.data?.flightOffers?.[0]?.price?.grandTotal ??
    data?.AirFareData?.data?.flightOffers?.[0]?.price?.total ??
    0;

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: 1.5,
        border: "1px solid #E5E7EB",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, gap: 1 }}>
        <Typography fontSize={12} color="#64748B" fontWeight={600}>
          Fare Breakdown
        </Typography>
        <Typography fontSize={11} color="#64748B" sx={{ textAlign: "right" }}>
          Price as shown in {currency}
        </Typography>
      </Box>

      {(rows.length > 0
        ? rows
        : [{ label: "Traveler 1 : Adult", value: formatAmount(currency, grandTotalRaw) }]
      ).map((row, index) => (
        <Box
          key={`${row.label}-${index}`}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
            py: 0.35,
          }}
        >
          <Typography
            fontSize={11}
            color="#475569"
            sx={{ flex: "1 1 auto", pr: 1, lineHeight: 1.4 }}
          >
            {row.label}
          </Typography>
          <Typography
            fontSize={11}
            color="#0F172A"
            fontWeight={600}
            sx={{ minWidth: 92, textAlign: "right", flexShrink: 0, whiteSpace: "nowrap" }}
          >
            {row.value}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 1 }} />

      {summaryRows.map((row) => (
        <Box
          key={row.label}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            py: 0.35,
          }}
        >
          <Typography fontSize={11} color="#475569" sx={{ flex: "1 1 auto", pr: 1 }}>
            {row.label}
          </Typography>
          <Typography
            fontSize={11}
            color="#0F172A"
            fontWeight={600}
            sx={{ minWidth: 92, textAlign: "right", flexShrink: 0, whiteSpace: "nowrap" }}
          >
            {row.value}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Typography fontSize={12} fontWeight={700} color="#0F172A">
          Grand Total
        </Typography>
        <Typography
          fontSize={12}
          fontWeight={700}
          color="#0F2F56"
          sx={{ minWidth: 92, textAlign: "right", whiteSpace: "nowrap" }}
        >
          {formatAmount(currency, grandTotalRaw)}
        </Typography>
      </Box>
    </Box>
  );
};

export default FlightBookingFareDetails;
