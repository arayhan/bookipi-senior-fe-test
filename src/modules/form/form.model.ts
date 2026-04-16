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
