import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { App } from "@/App";
import { store } from "@/app/store";
import { queryClient } from "@/libs/query-client";
import { Toaster } from "@/components/toast/toast";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
      </QueryClientProvider>
    </ReduxProvider>
  </StrictMode>,
);
