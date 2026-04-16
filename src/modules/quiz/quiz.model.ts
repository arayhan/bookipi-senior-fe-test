export type QuestionType = "mcq" | "short";

export interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimitSeconds: number | null;
  isPublished: boolean;
  createdAt: string;
}

export interface Question {
  id: number;
  quizId: number;
  type: QuestionType;
  prompt: string;
  options: string[] | null;
  correctAnswer: string | number | null;
  position: number;
  codeSnippet?: string | null;
}
