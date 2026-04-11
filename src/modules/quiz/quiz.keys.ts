export const quizKeys = {
  all: ["quizzes"] as const,
  list: () => [...quizKeys.all, "list"] as const,
  detail: (id: number | string) => [...quizKeys.all, "detail", String(id)] as const,
};
