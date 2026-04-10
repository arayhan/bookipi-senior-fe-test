import hotToast, { Toaster as HotToaster } from "react-hot-toast";

export const toast = {
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  info: (message: string) => hotToast(message),
};

export const Toaster = () => (
  <HotToaster
    position="top-right"
    toastOptions={{
      duration: 3500,
      style: {
        borderRadius: "10px",
        background: "#0f172a",
        color: "#f8fafc",
        fontSize: "14px",
      },
    }}
  />
);
