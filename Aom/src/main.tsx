import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import { initAppData } from "./utils/initApp";
import "./index.css";
import App from "./App.tsx";

initAppData();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
