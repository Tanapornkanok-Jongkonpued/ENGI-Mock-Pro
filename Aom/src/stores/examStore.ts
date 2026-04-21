import { create } from "zustand";
import type { ExamConfig, QuestionWithAnswer } from "../types";

interface ExamState {
  config: ExamConfig | null;
  questions: QuestionWithAnswer[];
  currentIndex: number;
  startTime: number;
  isLoading: boolean;
  loadingProgress: string;
  isSubmitted: boolean;
  setConfig: (config: ExamConfig) => void;
  setQuestions: (qs: QuestionWithAnswer[]) => void;
  setCurrentIndex: (i: number) => void;
  setAnswer: (qId: string, answer: "A" | "B" | "C" | "D") => void;
  setLoading: (loading: boolean, progress?: string) => void;
  submit: () => void;
  reset: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
  config: null,
  questions: [],
  currentIndex: 0,
  startTime: 0,
  isLoading: false,
  loadingProgress: "",
  isSubmitted: false,

  setConfig(config) {
    set({
      config,
      questions: [],
      currentIndex: 0,
      isSubmitted: false,
      startTime: Date.now(),
    });
  },
  setQuestions(qs) {
    set({ questions: qs, startTime: Date.now() });
  },
  setCurrentIndex(i) {
    set({ currentIndex: i });
  },
  setAnswer(qId, answer) {
    set((s) => ({
      questions: s.questions.map((q) =>
        q.id === qId ? { ...q, userAnswer: answer } : q,
      ),
    }));
  },
  setLoading(loading, progress = "") {
    set({ isLoading: loading, loadingProgress: progress });
  },
  submit() {
    set({ isSubmitted: true });
  },
  reset() {
    set({
      config: null,
      questions: [],
      currentIndex: 0,
      isSubmitted: false,
      isLoading: false,
      loadingProgress: "",
      startTime: 0,
    });
  },
}));
