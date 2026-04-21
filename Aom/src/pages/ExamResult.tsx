import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CheckCircle,
  XCircle,
  MinusCircle,
  Printer,
  Clock,
  Calendar,
} from "lucide-react";
import { BranchIcon } from "../components/icons/BranchIcon";
import { useExamStore } from "../stores/examStore";
import { useUIStore } from "../stores/uiStore";
import { saveSession } from "../hooks/useExamHistory";
import { updateStreak } from "../hooks/useStreak";
import { checkAchievements } from "../hooks/useAchievements";
import { calcScore, isPassed } from "../utils/scoring";
import { formatTime, formatDate } from "../utils/dateUtils";
import { getBranchById } from "../data/branches";
import { achievementDefs } from "../data/achievements";
import type { ExamSession as Session } from "../types";

export default function ExamResult() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { config, questions, startTime, reset } = useExamStore();
  const { language, addToast } = useUIStore();
  const [session, setSession] = useState<Session | null>(null);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  useEffect(() => {
    if (!config || questions.length === 0) {
      navigate("/dashboard");
      return;
    }

    const correct = questions.filter(
      (q) => q.userAnswer === q.correctAnswer,
    ).length;
    const score = calcScore(correct, questions.length);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const sess: Session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      branch: config.branch,
      categories: config.categories,
      mode: config.mode,
      score,
      totalQuestions: questions.length,
      correctCount: correct,
      timeTaken,
      questions,
      passed: isPassed(score),
    };
    saveSession(sess);
    updateStreak();
    const newBadges = checkAchievements(sess);
    newBadges.forEach((id) => {
      const def = achievementDefs.find((a) => a.id === id);
      if (def)
        addToast({
          type: "achievement",
          message: t("achievementUnlocked", {
            name: language === "th" ? def.titleTH : def.titleEN,
          }),
          duration: 5000,
        });
    });
    setSession(sess);
  }, []);

  if (!session) return null;

  const branch = getBranchById(session.branch);
  const unanswered = questions.filter((q) => !q.userAnswer).length;

  // Subcategory chart
  const subMap: Record<string, { correct: number; total: number }> = {};
  for (const q of questions) {
    if (!subMap[q.subcategory])
      subMap[q.subcategory] = { correct: 0, total: 0 };
    subMap[q.subcategory].total++;
    if (q.userAnswer === q.correctAnswer) subMap[q.subcategory].correct++;
  }
  const chartData = Object.entries(subMap).map(([name, s]) => ({
    name: name.slice(0, 12),
    pct: Math.round((s.correct / s.total) * 100),
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Score card */}
      <div className="glass-card p-8 text-center">
        <p
          className={`font-mono text-6xl font-extrabold mb-2 ${session.passed ? "text-accent-green" : "text-accent-red"}`}
        >
          {session.score}%
        </p>
        <div
          className={`badge text-base px-4 py-1 mb-4 ${session.passed ? "badge-green" : "badge-red"}`}
        >
          {session.passed ? t("passed") : t("failed")}
        </div>
        <div className="flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-1.5 text-accent-green">
            <CheckCircle size={16} />
            {session.correctCount} {t("correct")}
          </div>
          <div className="flex items-center gap-1.5 text-accent-red">
            <XCircle size={16} />
            {session.totalQuestions - session.correctCount - unanswered}{" "}
            {t("incorrect")}
          </div>
          <div className="flex items-center gap-1.5 text-text-muted">
            <MinusCircle size={16} />
            {unanswered} {t("unanswered")}
          </div>
        </div>
        <div className="flex justify-center gap-6 text-xs text-text-muted mt-4">
          <span className="flex items-center gap-1">
            <BranchIcon id={branch.id} size={14} /> {branch.nameTH}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {formatTime(session.timeTaken)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {formatDate(session.date)}
          </span>
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <Link to="/exam/select" className="btn-gold text-sm">
            {t("newExam")}
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-outline text-sm flex items-center gap-1.5"
          >
            <Printer size={14} /> {t("printResult")}
          </button>
        </div>
      </div>

      {/* Subcategory chart */}
      {chartData.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="section-title mb-4">ผลตามหมวดวิชา</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} layout="vertical">
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "#7C8BA1", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#7C8BA1", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  background: "#0F1729",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  color: "#EFF4FF",
                }}
              />
              <Bar dataKey="pct" fill="#F5C842" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Question review */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="section-title">ตรวจสอบคำตอบ</h2>
        {questions.map((q, i) => {
          const correct = q.userAnswer === q.correctAnswer;
          const isOpen = expandedQ === q.id;
          return (
            <div
              key={q.id}
              className={`border rounded-xl p-4 transition-all ${correct ? "border-accent-green/30 bg-accent-green/5" : "border-accent-red/30 bg-accent-red/5"}`}
            >
              <button
                className="w-full text-left"
                onClick={() => setExpandedQ(isOpen ? null : q.id)}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${correct ? "bg-accent-green" : "bg-accent-red"}`}
                  >
                    {correct ? (
                      <CheckCircle size={14} className="text-white" />
                    ) : (
                      <XCircle size={14} className="text-white" />
                    )}
                  </span>
                  <p className="text-sm text-text-primary flex-1">
                    <span className="font-bold text-text-muted mr-1">
                      ข้อ {i + 1}.
                    </span>
                    {language === "th" ? q.questionTH : q.questionEN}
                  </p>
                </div>
              </button>

              {isOpen && (
                <div className="mt-4 pl-9 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {(["A", "B", "C", "D"] as const).map((key) => (
                      <div
                        key={key}
                        className={`text-xs px-3 py-2 rounded-lg border ${key === q.correctAnswer ? "border-accent-green/50 bg-accent-green/10 text-accent-green" : key === q.userAnswer && !correct ? "border-accent-red/50 bg-accent-red/10 text-accent-red" : "border-white/10 text-text-muted"}`}
                      >
                        <span className="font-bold mr-1">{key}.</span>
                        {language === "th"
                          ? q.options[key].th
                          : q.options[key].en}
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-accent-gold font-semibold mb-1">
                      {t("explanation")}
                    </p>
                    <p className="text-xs text-text-muted">
                      {language === "th" ? q.explanationTH : q.explanationEN}
                    </p>
                    {q.formula && (
                      <p className="text-xs font-mono text-accent-blue mt-1">
                        {q.formula}
                      </p>
                    )}
                    {q.reference && (
                      <p className="text-xs text-text-muted mt-1">
                        📌 {q.reference}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button onClick={reset} className="btn-ghost text-sm">
          {t("newExam")}
        </button>
      </div>
    </div>
  );
}
