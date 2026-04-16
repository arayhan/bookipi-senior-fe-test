import type { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store";
import { queryClient } from "@/libs/query-client";
import { Toaster } from "@/components/toast/toast";

interface Props {
  children: ReactNode;
}

export const Providers = ({ children }: Props) => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  </ReduxProvider>
);
