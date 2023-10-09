import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SWRConfig } from "swr";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SWRConfig>
        <App />
      </SWRConfig>
    </BrowserRouter>
  </React.StrictMode>,
);
