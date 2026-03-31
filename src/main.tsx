import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

// Get root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Create root and render app
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="qazyen-theme">
      <AppWrapper>
        <App />
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>
);

// Mark app as ready (removes loading spinner)
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('app-ready');
  });
}
