// Types for ENGI-Mock Pro

export type Language = "th" | "en";
export type ExamMode = "practice" | "mock";
export type Difficulty = "easy" | "medium" | "hard";

export type BranchId =
  | "civil"
  | "electrical"
  | "mechanical"
  | "industrial"
  | "chemical"
  | "environmental";

export interface Branch {
  id: BranchId;
  nameTH: string;
  nameEN: string;
  icon: string;
  color: string;
}

export interface SubCategory {
  id: string;
  nameTH: string;
  nameEN: string;
}

export interface Category {
  id: string;
  nameTH: string;
  nameEN: string;
  subcategories: SubCategory[];
}

export interface QuestionOption {
  th: string;
  en: string;
}

export interface Question {
  id: string;
  questionTH: string;
  questionEN: string;
  options: {
    A: QuestionOption;
    B: QuestionOption;
    C: QuestionOption;
    D: QuestionOption;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  explanationTH: string;
  explanationEN: string;
  formula?: string;
  reference?: string;
  difficulty: Difficulty;
  subcategory: string;
  tags: string[];
}

export interface QuestionWithAnswer extends Question {
  userAnswer?: "A" | "B" | "C" | "D";
  isBookmarked?: boolean;
  note?: string;
}

export interface ExamSession {
  id: string;
  date: string;
  branch: BranchId;
  categories: string[];
  mode: ExamMode;
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeTaken: number; // seconds
  questions: QuestionWithAnswer[];
  passed: boolean;
}

export interface ExamConfig {
  branch: BranchId;
  categories: string[];
  subcategories: string[];
  mode: ExamMode;
  questionCount: number;
  timeLimit: number; // minutes
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  username: string;
  passwordHash: string;
  avatar: string;
  joinDate: string;
  language: Language;
  examTargetDate: string | null;
  darkMode: boolean;
}

export interface LeaderboardEntry {
  username: string;
  avatar: string;
  avgScore: number;
  totalExams: number;
  bestScore: number;
  streak: number;
  branch: string;
}

export interface Achievement {
  id: string;
  icon: string;
  titleTH: string;
  titleEN: string;
  descTH: string;
  descEN: string;
  category: "progress" | "score" | "branch";
  earned: boolean;
  date: string | null;
}

export interface BookmarkEntry {
  question: QuestionWithAnswer;
  note: string;
  date: string;
  branch: BranchId;
  subcategory: string;
}

export interface Streak {
  count: number;
  lastActive: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "achievement";
  message: string;
  duration?: number;
}

export interface FormulaEntry {
  id: string;
  nameEN: string;
  nameTH: string;
  formula: string;
  variables?: string;
  unit?: string;
  notes?: string;
}

export interface FormulaSection {
  id: string;
  title: string;
  formulas: FormulaEntry[];
}
