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

export interface DraftMcqQuestion {
  localId: string;
  type: "mcq";
  prompt: string;
  codeSnippet: string;
  options: string[];
  correctIndex: number;
}

export interface DraftShortQuestion {
  localId: string;
  type: "short";
  prompt: string;
  codeSnippet: string;
  correctAnswer: string;
}

export type DraftQuestion = DraftMcqQuestion | DraftShortQuestion;

export interface BuilderDraft {
  title: string;
  description: string;
  questions: DraftQuestion[];
}

export interface CreateQuizRequest {
  title: string;
  description: string;
}

export interface CreateQuestionRequest {
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string | number;
  position?: number;
}
