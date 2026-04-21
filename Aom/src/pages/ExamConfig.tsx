import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { branches, generalCategory, getBranchCategory } from "../data/branches";
import { useExamStore } from "../stores/examStore";
import { useUIStore } from "../stores/uiStore";
import {
  generateQuestions,
  checkRateLimit,
  recordGeneration,
} from "../api/gemini";
import { Button } from "../components/ui/Button";
import { BranchIcon } from "../components/icons/BranchIcon";
import { ProgressBar } from "../components/ui/ProgressBar";
import { BookOpen, Target } from "lucide-react";
import type { BranchId, ExamMode, QuestionWithAnswer } from "../types";

interface ExamConfigPageProps {
  defaultMode?: ExamMode;
}

export default function ExamConfig({
  defaultMode = "mock",
}: ExamConfigPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setConfig, setQuestions, setLoading } = useExamStore();
  const { addToast } = useUIStore();

  const [selectedBranch, setSelectedBranch] = useState<BranchId | null>(null);
  const [selectedGeneral, setSelectedGeneral] = useState<string[]>([]);
  const [selectedSpecific, setSelectedSpecific] = useState<string[]>([]);
  const [mode, setMode] = useState<ExamMode>(defaultMode);
  const [questionCount, setQuestionCount] = useState(20);
  const [timeLimit, setTimeLimit] = useState(60);
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState("");

  const branchCategory = selectedBranch
    ? getBranchCategory(selectedBranch)
    : null;

  function toggleSub(
    id: string,
    list: string[],
    setter: (v: string[]) => void,
  ) {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  async function handleStart() {
    if (!selectedBranch) {
      addToast({ type: "error", message: "กรุณาเลือกสาขา" });
      return;
    }
    if (selectedGeneral.length === 0 && selectedSpecific.length === 0) {
      addToast({
        type: "error",
        message: "กรุณาเลือกหมวดวิชาอย่างน้อย 1 หมวด",
      });
      return;
    }
    if (checkRateLimit()) {
      addToast({ type: "info", message: t("throttleWarning") });
      return;
    }

    const config = {
      branch: selectedBranch,
      categories: [
        ...(selectedGeneral.length > 0 ? ["general"] : []),
        ...(selectedSpecific.length > 0 ? ["branch"] : []),
      ],
      subcategories: [...selectedGeneral, ...selectedSpecific],
      mode,
      questionCount,
      timeLimit,
    };

    setConfig(config);
    setGenerating(true);
    setLoading(true, t("generating"));
    recordGeneration();

    try {
      const questions = await generateQuestions(config, (msg) => {
        setGenProgress(msg);
        setLoading(true, msg);
      });
      const withAnswers: QuestionWithAnswer[] = questions.map((q) => ({
        ...q,
        userAnswer: undefined,
        isBookmarked: false,
      }));
      setQuestions(withAnswers);
      navigate(mode === "mock" ? "/exam/session" : "/practice/session");
    } catch {
      addToast({ type: "error", message: t("examError") });
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-text-primary">
          {t("selectBranch")}
        </h1>
        <p className="text-text-muted text-sm mt-1">
          เลือกสาขาวิศวกรรมและหมวดวิชาที่ต้องการฝึก
        </p>
      </div>

      {/* Branch Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {branches.map((b) => (
          <motion.button
            key={b.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSelectedBranch(b.id);
              setSelectedSpecific([]);
            }}
            className={`glass-card p-4 text-left transition-all duration-200 ${selectedBranch === b.id ? "border-accent-gold/60 bg-accent-gold/5" : ""}`}
          >
            <div className="mb-2 text-accent-gold">
              <BranchIcon id={b.id} size={24} />
            </div>
            <p className="font-medium text-sm text-text-primary">{b.nameTH}</p>
            <p className="text-xs text-text-muted">{b.nameEN}</p>
          </motion.button>
        ))}
      </div>

      {/* General Category */}
      <div className="glass-card p-6">
        <h2 className="font-heading font-bold text-text-primary mb-1">
          {generalCategory.nameTH}
        </h2>
        <p className="text-text-muted text-xs mb-4">{generalCategory.nameEN}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {generalCategory.subcategories.map((s) => (
            <label
              key={s.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="accent-accent-gold w-4 h-4"
                checked={selectedGeneral.includes(s.id)}
                onChange={() =>
                  toggleSub(s.id, selectedGeneral, setSelectedGeneral)
                }
              />
              <div>
                <p className="text-sm text-text-primary group-hover:text-accent-gold transition-colors">
                  {s.nameTH}
                </p>
                <p className="text-xs text-text-muted">{s.nameEN}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Branch Specific */}
      {branchCategory && (
        <div className="glass-card p-6">
          <h2 className="font-heading font-bold text-text-primary mb-1">
            {branchCategory.nameTH}
          </h2>
          <p className="text-text-muted text-xs mb-4">
            {branchCategory.nameEN}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {branchCategory.subcategories.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="accent-accent-gold w-4 h-4"
                  checked={selectedSpecific.includes(s.id)}
                  onChange={() =>
                    toggleSub(s.id, selectedSpecific, setSelectedSpecific)
                  }
                />
                <div>
                  <p className="text-sm text-text-primary group-hover:text-accent-gold transition-colors">
                    {s.nameTH}
                  </p>
                  <p className="text-xs text-text-muted">{s.nameEN}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Mode & Params */}
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          onClick={() => setMode("practice")}
          className={`glass-card p-5 text-left transition-all duration-200 ${mode === "practice" ? "border-accent-gold/60 bg-accent-gold/5" : ""}`}
        >
          <div className="mb-2 text-accent-gold">
            <BookOpen size={24} />
          </div>
          <p className="font-heading font-bold text-text-primary">
            {t("practiceMode")}
          </p>
          <p className="text-xs text-text-muted mt-1">{t("practiceDesc")}</p>
        </button>
        <button
          onClick={() => setMode("mock")}
          className={`glass-card p-5 text-left transition-all duration-200 ${mode === "mock" ? "border-accent-gold/60 bg-accent-gold/5" : ""}`}
        >
          <div className="mb-2 text-accent-gold">
            <Target size={24} />
          </div>
          <p className="font-heading font-bold text-text-primary">
            {t("mockTestMode")}
          </p>
          <p className="text-xs text-text-muted mt-1">{t("mockTestDesc")}</p>
        </button>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-text-muted">
              {t("questionCount")}
            </label>
            <span className="font-mono text-accent-gold font-bold">
              {questionCount}
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={questionCount}
            onChange={(e) => {
              setQuestionCount(+e.target.value);
              setTimeLimit(Math.round(+e.target.value * 3));
            }}
            className="w-full accent-accent-gold"
          />
          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>10</span>
            <span>100</span>
          </div>
        </div>

        {mode === "mock" && (
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-text-muted">
                {t("timeLimit")}
              </label>
              <span className="font-mono text-accent-gold font-bold">
                {timeLimit} นาที
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={180}
              step={5}
              value={timeLimit}
              onChange={(e) => setTimeLimit(+e.target.value)}
              className="w-full accent-accent-gold"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>15</span>
              <span>180</span>
            </div>
          </div>
        )}
      </div>

      {generating && (
        <div className="glass-card p-6 text-center space-y-3">
          <p className="text-accent-gold font-medium">
            {genProgress || t("generating")}
          </p>
          <ProgressBar value={50} />
        </div>
      )}

      <Button
        variant="gold"
        onClick={handleStart}
        loading={generating}
        className="w-full text-lg py-4"
      >
        {t("startExam")}
      </Button>
    </div>
  );
}
