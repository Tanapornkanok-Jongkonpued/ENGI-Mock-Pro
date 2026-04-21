import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Trash2,
  BookOpen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "../utils/storage";
import { branches } from "../data/branches";
import { BranchIcon } from "../components/icons/BranchIcon";
import { useExamStore } from "../stores/examStore";
import { formatDate } from "../utils/dateUtils";
import type { BookmarkEntry, BranchId, QuestionWithAnswer } from "../types";

export default function Bookmarks() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setConfig, setQuestions } = useExamStore();

  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function getBookmarks(): Record<string, BookmarkEntry> {
    return storage.get<Record<string, BookmarkEntry>>("bookmarks") ?? {};
  }

  const [bookmarks, setBookmarks] = useState(getBookmarks());

  function removeBookmark(id: string) {
    const updated = { ...bookmarks };
    delete updated[id];
    storage.set("bookmarks", updated);
    setBookmarks(updated);
  }

  const entries = Object.entries(bookmarks)
    .map(([id, b]) => ({ id, ...b }))
    .filter((b) => branchFilter === "all" || b.branch === branchFilter);

  function practiceFromBookmarks() {
    const questions: QuestionWithAnswer[] = entries.map((e) => ({
      ...e.question,
      userAnswer: undefined,
    }));
    setConfig({
      branch: (entries[0]?.branch ?? "civil") as BranchId,
      categories: ["general"],
      subcategories: [],
      mode: "practice",
      questionCount: questions.length,
      timeLimit: questions.length * 3,
    });
    setQuestions(questions);
    navigate("/practice/session");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-heading text-2xl font-extrabold text-text-primary">
          {t("bookmarks")}
        </h1>
        {entries.length > 0 && (
          <button
            onClick={practiceFromBookmarks}
            className="btn-gold text-sm flex items-center gap-1.5"
          >
            <BookOpen size={14} /> {t("createPracticeFromBookmarks")}
          </button>
        )}
      </div>

      {/* Branch filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setBranchFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${branchFilter === "all" ? "bg-accent-gold text-bg-primary font-bold" : "bg-white/5 text-text-muted hover:text-text-primary"}`}
        >
          {t("all")}
        </button>
        {branches.map((b) => (
          <button
            key={b.id}
            onClick={() => setBranchFilter(b.id)}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${branchFilter === b.id ? "bg-accent-gold text-bg-primary font-bold" : "bg-white/5 text-text-muted hover:text-text-primary"}`}
          >
            <BranchIcon id={b.id} size={14} /> {b.nameTH}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Bookmark size={48} className="text-text-muted mx-auto mb-3" />
          <p className="text-text-muted">{t("noBookmarks")}</p>
          <Link
            to="/exam/select"
            className="btn-gold text-sm mt-4 inline-block"
          >
            {t("startExam")}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const isOpen = expandedId === entry.id;
            const q = entry.question;
            const branchData = branches.find((b) => b.id === entry.branch);
            return (
              <div key={entry.id} className="glass-card overflow-hidden">
                <button
                  className="w-full text-left px-5 py-4 flex items-start gap-3"
                  onClick={() => setExpandedId(isOpen ? null : entry.id)}
                >
                  <Bookmark
                    size={16}
                    className="text-accent-gold mt-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary line-clamp-2">
                      {q.questionTH}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="badge-gold text-xs">
                        {branchData && (
                          <BranchIcon
                            id={branchData.id}
                            size={12}
                            className="inline mr-0.5"
                          />
                        )}{" "}
                        {branchData?.nameTH}
                      </span>
                      <span className="text-xs text-text-muted">
                        {entry.subcategory}
                      </span>
                      <span className="text-xs text-text-muted">
                        {formatDate(entry.date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBookmark(entry.id);
                      }}
                      className="p-1.5 rounded-lg text-text-muted hover:text-accent-red transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-text-muted" />
                    ) : (
                      <ChevronDown size={16} className="text-text-muted" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 space-y-3">
                    {(["A", "B", "C", "D"] as const).map((key) => (
                      <div
                        key={key}
                        className={`text-xs px-3 py-2 rounded-lg border ${key === q.correctAnswer ? "border-accent-green/50 bg-accent-green/10 text-accent-green" : "border-white/10 text-text-muted"}`}
                      >
                        <span className="font-bold mr-1">{key}.</span>
                        {q.options[key].th}
                      </div>
                    ))}
                    <div className="bg-white/5 rounded-lg p-3 mt-2">
                      <p className="text-xs text-accent-gold font-semibold mb-1">
                        {t("explanation")}
                      </p>
                      <p className="text-xs text-text-muted">
                        {q.explanationTH}
                      </p>
                    </div>
                    {entry.note && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-accent-blue font-semibold mb-1">
                          {t("note")}
                        </p>
                        <p className="text-xs text-text-muted">{entry.note}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
