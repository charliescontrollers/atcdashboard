import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CatProvider } from "./context/CatContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CatProvider>
      <App />
    </CatProvider>
  </React.StrictMode>
);
