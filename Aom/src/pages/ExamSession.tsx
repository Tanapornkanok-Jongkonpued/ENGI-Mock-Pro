import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Bookmark,
  FileText,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useExamStore } from "../stores/examStore";
import { useUIStore } from "../stores/uiStore";
import { storage } from "../utils/storage";
import { formatTime } from "../utils/dateUtils";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

export default function ExamSession() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    config,
    questions,
    currentIndex,
    startTime,
    setCurrentIndex,
    setAnswer,
    submit,
  } = useExamStore();
  const { language, addToast } = useUIStore();
  const [elapsed, setElapsed] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [formulaOpen, setFormulaOpen] = useState(false);

  const isPractice = config?.mode === "practice";
  const timeLimit = (config?.timeLimit ?? 60) * 60;

  useEffect(() => {
    if (!config || questions.length === 0) {
      navigate("/exam/select");
    }
  }, [config, questions, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const secs = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(secs);
      if (!isPractice && secs >= timeLimit) {
        handleSubmit(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, timeLimit, isPractice]);

  const question = questions[currentIndex];
  const remaining = Math.max(0, timeLimit - elapsed);
  const answeredCount = questions.filter((q) => q.userAnswer).length;
  const allAnswered = answeredCount === questions.length;

  function handleSubmit(auto = false) {
    if (auto) addToast({ type: "info", message: t("timeUp") });
    submit();
    navigate("/exam/result");
  }

  function toggleBookmark() {
    if (!question) return;
    const bookmarks = storage.get<Record<string, unknown>>("bookmarks") ?? {};
    if (bookmarks[question.id]) {
      delete bookmarks[question.id];
    } else {
      bookmarks[question.id] = {
        question,
        note: "",
        date: new Date().toISOString(),
        branch: config?.branch,
        subcategory: question.subcategory,
      };
    }
    storage.set("bookmarks", bookmarks);
  }

  function saveNote() {
    if (!question) return;
    const notes = storage.get<Record<string, string>>("notes") ?? {};
    notes[question.id] = noteText;
    storage.set("notes", notes);
    setNoteOpen(false);
    addToast({ type: "success", message: t("saveSuccess") });
  }

  function openNote() {
    if (!question) return;
    const notes = storage.get<Record<string, string>>("notes") ?? {};
    setNoteText(notes[question.id] ?? "");
    setNoteOpen(true);
  }

  if (!question || !config) return null;

  const bookmarks = storage.get<Record<string, unknown>>("bookmarks") ?? {};
  const isBookmarked = !!bookmarks[question.id];

  const optionLabels: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="badge-gold font-heading font-bold">
            {t("question")} {currentIndex + 1} {t("of")} {questions.length}
          </span>
          <span className={`badge ${isPractice ? "badge-blue" : "badge-red"}`}>
            {isPractice ? t("practiceMode") : t("mockTestMode")}
          </span>
        </div>
        <div
          className={`flex items-center gap-2 font-mono font-bold text-sm ${!isPractice && remaining < 300 ? "text-accent-red" : "text-text-muted"}`}
        >
          <Clock size={16} />
          {isPractice ? formatTime(elapsed) : formatTime(remaining)}
        </div>
      </div>

      {/* Question */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-lg text-text-primary leading-relaxed font-medium">
              {language === "th" ? question.questionTH : question.questionEN}
            </p>
            {question.formula && (
              <p className="mt-2 text-xs font-mono bg-white/5 rounded px-2 py-1 text-text-muted inline-block">
                {question.formula}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleBookmark}
              title={t("bookmark")}
              className={`p-2 rounded-lg transition-colors ${isBookmarked ? "text-accent-gold" : "text-text-muted hover:text-text-primary"}`}
            >
              <Bookmark
                size={16}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={openNote}
              title={t("note")}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary transition-colors"
            >
              <FileText size={16} />
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {optionLabels.map((key) => {
            const opt = question.options[key];
            const selected = question.userAnswer === key;
            return (
              <button
                key={key}
                onClick={() => setAnswer(question.id, key)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 ${
                  selected
                    ? "border-accent-gold bg-accent-gold/10 text-text-primary"
                    : "border-white/10 hover:border-accent-gold/40 text-text-muted hover:text-text-primary"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border ${selected ? "border-accent-gold bg-accent-gold text-bg-primary" : "border-white/20"}`}
                >
                  {key}
                </span>
                <span className="text-sm">
                  {language === "th" ? opt.th : opt.en}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        {isPractice ? (
          <Button
            variant="ghost"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={16} /> {t("back")}
          </Button>
        ) : (
          <div />
        )}

        {/* Dot grid */}
        <div className="flex flex-wrap gap-1.5 justify-center flex-1">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => isPractice && setCurrentIndex(i)}
              className={`w-6 h-6 rounded-full text-xs font-mono transition-all ${
                i === currentIndex
                  ? "ring-2 ring-accent-gold ring-offset-1 ring-offset-bg-primary bg-accent-gold text-bg-primary"
                  : q.userAnswer
                    ? "bg-accent-gold/40 text-accent-gold"
                    : "bg-white/10 text-text-muted"
              } ${!isPractice ? "cursor-default" : "cursor-pointer"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentIndex < questions.length - 1 ? (
          <Button
            variant="gold"
            onClick={() => setCurrentIndex(currentIndex + 1)}
          >
            {t("next")} <ChevronRight size={16} />
          </Button>
        ) : (
          <Button
            variant="gold"
            onClick={() => setConfirmOpen(true)}
            disabled={!allAnswered}
          >
            {t("submitExam")}
          </Button>
        )}
      </div>

      {/* Formula overlay (practice only) */}
      {isPractice && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setFormulaOpen(!formulaOpen)}
            className="btn-gold rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            title={t("formulaOverlay")}
          >
            Σ
          </button>
        </div>
      )}

      {formulaOpen && (
        <div className="fixed right-0 top-0 h-full w-80 z-30 bg-bg-secondary border-l border-white/10 overflow-y-auto scrollbar-thin p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-text-primary">
              {t("formulaOverlay")}
            </h3>
            <button
              onClick={() => setFormulaOpen(false)}
              className="text-text-muted hover:text-text-primary"
            >
              ✕
            </button>
          </div>
          <p className="text-text-muted text-xs">
            ดูสูตรได้ที่{" "}
            <a
              href="/formula-sheet"
              target="_blank"
              className="text-accent-gold hover:underline"
            >
              /formula-sheet
            </a>
          </p>
        </div>
      )}

      {/* Confirm submit modal */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t("submitExam")}
      >
        <p className="text-text-muted text-sm mb-6">
          {t("confirmSubmit", { n: answeredCount })}
        </p>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setConfirmOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="gold"
            className="flex-1"
            onClick={() => handleSubmit()}
          >
            {t("confirm")}
          </Button>
        </div>
      </Modal>

      {/* Note modal */}
      <Modal
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        title={t("note")}
      >
        <textarea
          className="input-field h-32 resize-none"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="จดโน้ตสำหรับข้อนี้..."
        />
        <div className="flex gap-3 mt-4">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setNoteOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button variant="gold" className="flex-1" onClick={saveNote}>
            {t("save")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
