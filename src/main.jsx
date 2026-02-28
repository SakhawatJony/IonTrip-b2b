import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {  CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <>
   <BrowserRouter>
      <AuthProvider>
        <CssBaseline />
        <App />
      </AuthProvider>
      </BrowserRouter>
   
  </>
);
