import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from "react-router-dom";
import AppProvider from "./utils/ContextPanel.jsx";
import { baselightTheme } from "./utils/theme/DefaultColors.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter >
      <AppProvider>
        <ThemeProvider theme={baselightTheme} >
          <App />
        </ThemeProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
