interface ImportMetaEnvShape {
  VITE_API_BASE_URL?: string;
  VITE_API_TOKEN?: string;
}

const meta = import.meta.env as unknown as ImportMetaEnvShape;

export const env = {
  apiBaseUrl: meta.VITE_API_BASE_URL ?? "http://localhost:4000",
  apiToken: meta.VITE_API_TOKEN ?? "dev-token",
};
