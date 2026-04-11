export const attemptKeys = {
  all: ["attempts"] as const,
  detail: (id: number | string) => [...attemptKeys.all, "detail", String(id)] as const,
};
