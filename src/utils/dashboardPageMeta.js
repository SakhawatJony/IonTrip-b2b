/**
 * Titles and back targets for the global dashboard heading (pathname-based).
 */

function normalizePath(pathname) {
  const p = pathname.replace(/\/+$/, "") || "/dashboard";
  return p;
}

const EXACT_TITLES = {
  "/dashboard": "Dashboard",
  "/dashboard/bookings": "Bookings History",
  "/dashboard/bookings/confirmed": "Confirmed Booking",
  "/dashboard/bookings/refund": "Refund Booking",
  "/dashboard/bookings/ticketed": "Ticketed",
  "/dashboard/bookings/cancelled": "Cancelled",
  "/dashboard/bookings/reissue": "Reissue Booking",
  "/dashboard/flightinfo": "Flight Info",
  "/dashboard/reschedulepax": "Reschedule Pax",
  "/dashboard/hotel/search": "Hotel Search",
  "/dashboard/hotel/bookings": "Hotel All Bookings",
  "/dashboard/hotel/confirmed": "Hotel Confirmed Booking",
  "/dashboard/hotel/cancelled": "Hotel Cancelled Booking",
  "/dashboard/tour/bookings": "Tour All Bookings",
  "/dashboard/tour/confirmed": "Tour Confirmed Booking",
  "/dashboard/tour/cancelled": "Tour Cancelled Booking",
  "/dashboard/tour/refunds": "Tour Refunds Booking",
  "/dashboard/visa/bookings": "Visa All Bookings",
  "/dashboard/visa/confirmed": "Visa Confirmed Booking",
  "/dashboard/visa/cancelled": "Visa Cancelled Booking",
  "/dashboard/visa/refunds": "Visa Refunds Booking",
  "/dashboard/onewaysearchresult": "One Way Search Results",
  "/dashboard/roundwaysearchresult": "Round Trip Search Results",
  "/dashboard/flightbooking": "Flight Booking",
  "/dashboard/bookingqueuedetails": "Booking Queue Details",
  "/dashboard/bookingqueuerefund": "Booking Queue Refund",
  "/dashboard/bookingqueuereissue": "Booking Queue Reissue",
  "/dashboard/bookingqueueinvoice": "Booking Queue Invoice",
  "/dashboard/agentflightbooking": "Bookings History",
  "/dashboard/settings": "Settings",
  "/dashboard/wallet": "Wallet",
  "/dashboard/agentdeposit": "Agent Deposit",
  "/dashboard/agentdeposit/add": "Deposit Request",
  "/dashboard/adddeposit": "Deposit Request",
  "/dashboard/account": "Profile",
  "/dashboard/account/activitylog": "Activity Log",
  "/dashboard/account/alltraveler": "All Traveler",
  "/dashboard/account/addtraveler": "Add Traveler",
  "/dashboard/sub-users/sub-user-list": "Sub-User List",
  "/dashboard/sub-users/add-user": "Add Staff",
  "/dashboard/manage": "Manage",
  "/dashboard/ledgerreport": "Ledger Report",
  "/dashboard/salesreport": "Sales Report",
  "/dashboard/searchreport": "Search Report",
  "/dashboard/support": "Support",
};

/** Longest-prefix titles for nested paths (e.g. detail IDs). */
const PREFIX_TITLES = [
  ["/dashboard/bookingqueuedetails", "Booking Queue Details"],
  ["/dashboard/bookingqueuerefund", "Booking Queue Refund"],
  ["/dashboard/bookingqueuereissue", "Booking Queue Reissue"],
  ["/dashboard/bookingqueueinvoice", "Booking Queue Invoice"],
  ["/dashboard/onewaysearchresult", "One Way Search Results"],
  ["/dashboard/roundwaysearchresult", "Round Trip Search Results"],
  ["/dashboard/flightbooking", "Flight Booking"],
].sort((a, b) => b[0].length - a[0].length);

export function getDashboardPageTitle(pathname) {
  const p = normalizePath(pathname);
  if (EXACT_TITLES[p]) return EXACT_TITLES[p];
  for (const [prefix, title] of PREFIX_TITLES) {
    if (p.startsWith(prefix + "/") || p === prefix) return title;
  }
  return "Dashboard";
}

const EXACT_BACK = {
  "/dashboard/sub-users/add-user": "/dashboard/sub-users/sub-user-list",
  "/dashboard/hotel/search": "/dashboard",
};

const PREFIX_BACK = [
  ["/dashboard/bookingqueue", "/dashboard/bookings"],
  ["/dashboard/bookingqueuedetails", "/dashboard/bookings"],
  ["/dashboard/onewaysearchresult", "/dashboard/bookings"],
  ["/dashboard/roundwaysearchresult", "/dashboard/bookings"],
  ["/dashboard/flightbooking", "/dashboard/bookings"],
];

export function getDashboardBackTo(pathname) {
  const p = normalizePath(pathname);
  if (p === "/dashboard") return "/dashboard";
  if (EXACT_BACK[p]) return EXACT_BACK[p];
  for (const [prefix, to] of PREFIX_BACK) {
    if (p.startsWith(prefix)) return to;
  }
  return "/dashboard";
}

export function isDashboardRootPath(pathname) {
  const p = normalizePath(pathname);
  return p === "/dashboard";
}

/** Routes that use the main content area without the global blue heading bar. */
const DASHBOARD_PATHS_WITHOUT_HEADING = new Set([
  "/dashboard",
  "/dashboard/reschedulepax",
]);

export function shouldShowDashboardPageHeading(pathname) {
  const p = normalizePath(pathname);
  return !DASHBOARD_PATHS_WITHOUT_HEADING.has(p);
}
