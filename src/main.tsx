import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./components/app";
import ReactGA from "react-ga4";
import "./index.css";

const trackingId = import.meta.env.VITE_GA_TRACKING_ID;
if (trackingId) {
  ReactGA.initialize(trackingId);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
