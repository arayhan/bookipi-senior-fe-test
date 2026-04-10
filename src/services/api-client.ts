import type { AxiosError } from "axios";
import { createAxiosInstance } from "@/libs/axios-instance";
import { toast } from "@/components/toast/toast";
import { env } from "@/utils/env";

interface ApiErrorBody {
  error?: string;
  message?: string;
}

export const apiClient = createAxiosInstance(env.apiBaseUrl, env.apiToken);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const message =
      error.response?.data?.error ??
      error.response?.data?.message ??
      error.message ??
      "Request failed";
    toast.error(message);
    return Promise.reject(error);
  },
);
