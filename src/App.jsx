import { Routes, Route } from "react-router-dom";

// Layouts
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Regstion from "./pages/auth/Regstion";
import Contact from "./pages/home/Contact";
import Features from "./pages/home/Features";
import Dashboard from "./pages/dashboard/Dashboard";
import OneWaySearchResult from "./pages/flight/OneWaySearchResult";
import RoundWaySearchResult from "./pages/flight/RoundWaySearchResult";
import FlightBooking from "./pages/flight/flightbooking/FlightBooking";
import BookingQueDetails from "./pages/flight/bookingqueuedetails/BookingQueDetails";
import AgentProfile from "./pages/agent/AgentProfile";
import AgentFlightBooking from "./pages/agent/AgentFlightBooking";
import AgentAllDeposit from "./pages/agent/AgentAllDeposit";
import AddDeposit from "./pages/agent/AddDeposit";
import LedgerReport from "./pages/agent/LedgerReport";
import SalesReport from "./pages/agent/SalesReport";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Regstion />} />
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
        <Route path="agentflightbooking" element={<AgentFlightBooking />} />
        <Route path="settings" element={<Dashboard />} />
        <Route path="wallet" element={<Dashboard />} />
        <Route path="agentdeposit" element={<AgentAllDeposit />} />
        <Route path="adddeposit" element={<AddDeposit />} />
        <Route path="account" element={<AgentProfile />} />
        <Route path="manage" element={<Dashboard />} />
        <Route path="ledgerreport" element={<LedgerReport />} />
        <Route path="salesreport" element={<SalesReport />} />
      </Route>
    </Routes>
  );
}
