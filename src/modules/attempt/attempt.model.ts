import type { QuestionType } from "@/modules/quiz/quiz.model";

export interface PlayerQuestion {
  id: number;
  type: QuestionType;
  prompt: string;
  options: string[] | null;
  position: number;
}

export interface AttemptQuiz {
  id: number;
  title: string;
  description: string;
  timeLimitSeconds: number | null;
  questions: PlayerQuestion[];
}

export interface Attempt {
  id: number;
  quizId: number;
  startedAt: string;
  submittedAt: string | null;
  answers: Array<{ questionId: number; value: string }>;
  quiz: AttemptQuiz;
}

export interface SubmitResult {
  score: number;
  details: Array<{ questionId: number; correct: boolean; expected: string }>;
}

export type AntiCheatEventName = "tab_blur" | "tab_focus" | "paste";

export interface AntiCheatRecord {
  event: AntiCheatEventName;
  timestamp: number;
}

export interface AttemptState {
  attemptId: number | null;
  quizId: number | null;
  currentIndex: number;
  answers: Record<number, string>;
  antiCheat: {
    tabSwitches: number;
    pastes: number;
    events: AntiCheatRecord[];
  };
  lastResult: SubmitResult | null;
}
