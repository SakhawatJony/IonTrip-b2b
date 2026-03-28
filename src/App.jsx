import { useEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
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
import SubUserList from "./pages/agent/SubUserList";
import AddUser from "./pages/agent/AddUser";
import Support from "./pages/dashboard/Support";
import HotelDashboard from "./pages/hotel/HotelDashboard";
import HotelBookings from "./pages/hotel/HotelBookings";
import HotelConfirmedBooking from "./pages/hotel/HotelConfirmedBooking";
import HotelCancelledBooking from "./pages/hotel/HotelCancelledBooking";
import TourBookings from "./pages/tour/TourBookings";
import TourConfirmedBooking from "./pages/tour/TourConfirmedBooking";
import TourCancelledBooking from "./pages/tour/TourCancelledBooking";
import TourRefundsBooking from "./pages/tour/TourRefundsBooking";
import VisaBookings from "./pages/visa/VisaBookings";
import VisaConfirmedBooking from "./pages/visa/VisaConfirmedBooking";
import VisaCancelledBooking from "./pages/visa/VisaCancelledBooking";
import VisaRefundsBooking from "./pages/visa/VisaRefundsBooking";
import useAuth from "./hooks/useAuth";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { agentToken, tokenExpireIn, clearAuthSession } = useAuth();
  const sessionTimeoutRef = useRef(null);
  const isDashboard = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    if (sessionTimeoutRef.current) {
      window.clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }

    if (!agentToken || !tokenExpireIn) return;

    const expiresAt = new Date(tokenExpireIn).getTime();
    if (Number.isNaN(expiresAt)) return;

    const logoutForExpiry = () => {
      clearAuthSession();
      toast.error("Your session has expired. Please login again.", {
        position: "top-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/login", { replace: true });
    };

    const remainingMs = expiresAt - Date.now();

    if (remainingMs <= 0) {
      logoutForExpiry();
      return;
    }

    sessionTimeoutRef.current = window.setTimeout(logoutForExpiry, remainingMs);

    return () => {
      if (sessionTimeoutRef.current) {
        window.clearTimeout(sessionTimeoutRef.current);
        sessionTimeoutRef.current = null;
      }
    };
  }, [agentToken, tokenExpireIn, clearAuthSession, navigate]);

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
          element={<AgentFlightBooking buttonLabel="Bookings History" />}
        />
        <Route
          path="bookings/confirmed"
          element={<AgentFlightBooking buttonLabel="Confirmed Booking" />}
        />
        <Route
          path="bookings/refund"
          element={
            <AgentFlightBooking
              buttonLabel="Refund Booking"
              defaultStatus="REFUND"
            />
          }
        />
        <Route
          path="bookings/ticketed"
          element={
            <AgentFlightBooking
              buttonLabel="Ticketed"
              defaultStatus=""
              viewMode="TICKETED"
            />
          }
        />
        <Route
          path="bookings/cancelled"
          element={
            <AgentFlightBooking
              buttonLabel="Cancelled"
              defaultStatus=""
              viewMode="CANCELLED"
            />
          }
        />
        <Route
          path="bookings/reissue"
          element={<AgentFlightBooking buttonLabel="Reissue Booking" defaultStatus="REISSUE" />}
        />
        <Route path="flightinfo" element={<Dashboard />} />
        <Route path="reschedulepax" element={<Dashboard />} />
     
        <Route path="hotel/bookings" element={<HotelBookings />} />
        <Route path="hotel/confirmed" element={<HotelConfirmedBooking />} />
        <Route path="hotel/cancelled" element={<HotelCancelledBooking />} />
        <Route path="tour/bookings" element={<TourBookings />} />
        <Route path="tour/confirmed" element={<TourConfirmedBooking />} />
        <Route path="tour/cancelled" element={<TourCancelledBooking />} />
        <Route path="tour/refunds" element={<TourRefundsBooking />} />
        <Route path="visa/bookings" element={<VisaBookings />} />
        <Route path="visa/confirmed" element={<VisaConfirmedBooking />} />
        <Route path="visa/cancelled" element={<VisaCancelledBooking />} />
        <Route path="visa/refunds" element={<VisaRefundsBooking />} />
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
        <Route path="agentdeposit/add" element={<AddDeposit />} />
        <Route path="adddeposit" element={<AddDeposit />} />
        <Route path="account" element={<AgentProfile />} />
        <Route path="account/activitylog" element={<ActivityLogPage />} />
        <Route path="account/alltraveler" element={<AllTraveler />} />
        <Route path="account/addtraveler" element={<AddTraveler />} />
        <Route path="sub-users/sub-user-list" element={<SubUserList />} />
        <Route path="sub-users/add-user" element={<AddUser />} />
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
