import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import Navbar from "./components/layout/Navbar";
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Regstion from "./pages/auth/Regstion";
import OtpVerification from "./pages/auth/OtpVerification";
import Contact from "./pages/home/Contact";
import Features from "./pages/home/Features";
import Dashboard from "./pages/dashboard/Dashboard";
import OneWaySearchResult from "./pages/flight/OneWaySearchResult";
import RoundWaySearchResult from "./pages/flight/RoundWaySearchResult";
import FlightBooking from "./pages/flight/flightbooking/FlightBooking";
import BookingQueDetails from "./pages/flight/bookingqueuedetails/BookingQueDetails";
import BookingQueInvoice from "./pages/flight/bookingqueuedetails/BookingQueInvoice";
import BookingQueRefund from "./pages/flight/bookingqueuedetails/BookingQueRefund";
import BookingQueReissue from "./pages/flight/bookingqueuedetails/BookingQueReissue";
import AgentProfile from "./pages/agent/AgentProfile";
import AgentFlightBooking from "./pages/agent/AgentFlightBooking";
import AgentAllDeposit from "./pages/agent/AgentAllDeposit";
import AddDeposit from "./pages/agent/AddDeposit";
import LedgerReport from "./pages/agent/LedgerReport";
import SalesReport from "./pages/agent/SalesReport";
import SearchReport from "./pages/agent/SearchReport";
import AllTraveler from "./pages/agent/AllTraveler";
import AddTraveler from "./pages/agent/AddTraveler";
import ActivityLogPage from "./pages/agent/ActivityLogPage";
import Support from "./pages/dashboard/Support";

export default function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Regstion />} />
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/features" element={<Features />} />
   
      {/* Dashboard Routes with Outlet */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route
          path="bookings"
          element={<AgentFlightBooking title="All Booking" buttonLabel="All Booking" />}
        />
        <Route
          path="bookings/confirmed"
          element={<AgentFlightBooking title="Confirmed Booking" buttonLabel="Confirmed Booking" />}
        />
        <Route
          path="bookings/refund"
          element={<AgentFlightBooking title="Refund Booking" buttonLabel="Refund Booking" />}
        />
        <Route
          path="bookings/reissue"
          element={<AgentFlightBooking title="Reissue Booking" buttonLabel="Reissue Booking" />}
        />
        <Route path="onewaysearchresult" element={<OneWaySearchResult />} />
        <Route path="roundwaysearchresult" element={<RoundWaySearchResult />} />
        <Route path="flightbooking" element={<FlightBooking />} />
        <Route path="bookingqueuedetails" element={<BookingQueDetails />} />
        <Route path="bookingqueuerefund" element={<BookingQueRefund />} />
        <Route path="bookingqueuereissue" element={<BookingQueReissue />} />
        <Route path="bookingqueueinvoice" element={<BookingQueInvoice />} />
        <Route path="agentflightbooking" element={<AgentFlightBooking />} />
        <Route path="settings" element={<Dashboard />} />
        <Route path="wallet" element={<Dashboard />} />
        <Route path="agentdeposit" element={<AgentAllDeposit />} />
        <Route path="adddeposit" element={<AddDeposit />} />
        <Route path="account" element={<AgentProfile />} />
        <Route path="account/activitylog" element={<ActivityLogPage />} />
        <Route path="account/alltraveler" element={<AllTraveler />} />
        <Route path="account/addtraveler" element={<AddTraveler />} />
        <Route path="manage" element={<Dashboard />} />
        <Route path="ledgerreport" element={<LedgerReport />} />
        <Route path="salesreport" element={<SalesReport />} />
        <Route path="searchreport" element={<SearchReport />} />
        <Route path="support" element={<Support />} />
      </Route>
    </Routes>
    <ToastContainer />
    </>
  );
}
