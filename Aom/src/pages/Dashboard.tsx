import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { Flame, Target, BookOpen, Trophy, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useUIStore } from "../stores/uiStore";
import { getHistory } from "../hooks/useExamHistory";
import { getStreak, updateStreak } from "../hooks/useStreak";
import { storage } from "../utils/storage";
import { calcUserAvg, calcReadiness, subcategoryStats } from "../utils/scoring";
import { formatDate } from "../utils/dateUtils";
import { daysUntil } from "../utils/dateUtils";
import { getBranchById } from "../data/branches";
import { BranchIcon } from "../components/icons/BranchIcon";
import type { ExamSession } from "../types";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { addToast } = useUIStore();
  const [history, setHistory] = useState<ExamSession[]>([]);
  const [streak, setStreak] = useState(getStreak());

  useEffect(() => {
    const h = getHistory();
    setHistory(h);
    const s = updateStreak();
    setStreak(s);
  }, []);

  const avgScore = calcUserAvg(history);
  const communityScores =
    storage.get<{ avgScore: number }[]>("community_scores") ?? [];
  const readiness = calcReadiness(avgScore, communityScores);
  const communityPct = Math.round(
    (communityScores.filter((c) => c.avgScore < avgScore).length /
      Math.max(communityScores.length, 1)) *
      100,
  );

  // Weekly chart data
  const last7: { day: string; score: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayHistory = history.filter((h) => h.date.startsWith(dateStr));
    const avg = dayHistory.length
      ? Math.round(
          dayHistory.reduce((s, h) => s + h.score, 0) / dayHistory.length,
        )
      : 0;
    last7.push({
      day: d.toLocaleDateString("th-TH", { weekday: "short" }),
      score: avg,
    });
  }

  // Weak points
  const subStats = subcategoryStats(history);
  const weakPoints = Object.entries(subStats)
    .map(([sub, s]) => ({ sub, pct: Math.round((s.correct / s.total) * 100) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 5);

  const daysLeft = user?.examTargetDate ? daysUntil(user.examTargetDate) : null;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-text-primary">
            {t("welcome", { name: user?.username ?? "นักศึกษา" })}
          </h1>
          {daysLeft !== null && (
            <p className="text-accent-gold text-sm mt-1 font-medium">
              <Target size={13} className="inline mr-1 -mt-0.5" />{" "}
              {t("daysUntilExam", { days: daysLeft })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            className="input-field text-sm py-2 w-auto"
            value={user?.examTargetDate ?? ""}
            onChange={(e) => {
              updateUser({ examTargetDate: e.target.value });
              addToast({ type: "success", message: "บันทึกวันสอบแล้ว" });
            }}
            title={t("setExamDate")}
          />
          <Link
            to="/exam/select"
            className="btn-gold text-sm py-2 px-4 whitespace-nowrap"
          >
            {t("startExam")}
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t("totalExams")}
          value={history.length.toString()}
          icon={<BookOpen size={20} />}
        />
        <KPICard
          title={t("avgScore")}
          value={`${avgScore}%`}
          icon={<Target size={20} />}
          valueColor={avgScore >= 60 ? "text-accent-green" : "text-accent-red"}
        />
        <KPICard
          title={t("studyStreak")}
          value={`${streak.count} วัน`}
          icon={<Flame size={20} className="text-orange-400" />}
        />
        <KPICard
          title={t("readinessScore")}
          value={`${readiness}%`}
          icon={<Trophy size={20} />}
          sub={
            communityScores.length > 0
              ? `Top ${100 - communityPct}% ของผู้ใช้`
              : ""
          }
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="section-title mb-4">{t("weeklyProgress")}</h2>
          {last7.some((d) => d.score > 0) ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={last7}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#7C8BA1", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#7C8BA1", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0F1729",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    color: "#EFF4FF",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#F5C842"
                  strokeWidth={2}
                  dot={{ fill: "#F5C842", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-text-muted text-sm">
              {t("noData")}
            </div>
          )}
        </div>

        {/* Readiness gauge */}
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <h2 className="section-title mb-4">{t("readinessScore")}</h2>
          <div className="relative w-32 h-32">
            <ResponsiveContainer width={128} height={128}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="100%"
                data={[{ value: readiness, fill: "#F5C842" }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  background={{ fill: "rgba(255,255,255,0.05)" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-2xl font-bold text-accent-gold">
                {readiness}%
              </span>
            </div>
          </div>
          {communityScores.length > 0 && (
            <p className="text-text-muted text-xs text-center mt-3">
              Top {100 - communityPct}% ของผู้ใช้ทั้งหมด
            </p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weak Points */}
        <div className="glass-card p-6">
          <h2 className="section-title mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-accent-red" />
            {t("weakPoints")}
          </h2>
          {weakPoints.length > 0 ? (
            <div className="space-y-3">
              {weakPoints.map((wp) => (
                <div key={wp.sub} className="flex items-center gap-3">
                  <span className="text-sm text-text-muted flex-1 truncate">
                    {wp.sub}
                  </span>
                  <div className="w-24 bg-white/5 rounded-full h-1.5">
                    <div
                      className="bg-accent-red h-full rounded-full"
                      style={{ width: `${wp.pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-text-muted w-10 text-right">
                    {wp.pct}%
                  </span>
                  <button
                    className="text-xs text-accent-gold hover:underline whitespace-nowrap"
                    onClick={() => navigate("/practice/select")}
                  >
                    {t("practicMore")}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">{t("noData")}</p>
          )}
        </div>

        {/* Recent History */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">{t("recentHistory")}</h2>
            <Link
              to="/bookmark"
              className="text-xs text-accent-gold hover:underline"
            >
              ดูทั้งหมด
            </Link>
          </div>
          {history.length > 0 ? (
            <div className="space-y-2">
              {history
                .slice(-5)
                .reverse()
                .map((h) => {
                  const branch = getBranchById(h.branch);
                  return (
                    <div
                      key={h.id}
                      className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
                    >
                      <span className="text-accent-gold">
                        <BranchIcon id={branch.id} size={18} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary font-medium truncate">
                          {branch.nameTH}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatDate(h.date)}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-sm font-bold ${h.passed ? "text-accent-green" : "text-accent-red"}`}
                      >
                        {h.score}%
                      </span>
                      <span className={h.passed ? "badge-green" : "badge-red"}>
                        {h.passed ? t("passed") : t("failed")}
                      </span>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen size={32} className="text-text-muted mx-auto mb-2" />
              <p className="text-text-muted text-sm">{t("noHistory")}</p>
              <Link
                to="/exam/select"
                className="btn-gold text-sm mt-3 inline-block"
              >
                {t("startExam")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  icon,
  valueColor = "text-accent-gold",
  sub,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  valueColor?: string;
  sub?: string;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-text-muted text-sm">{title}</p>
        <span className="text-text-muted">{icon}</span>
      </div>
      <p className={`font-mono text-2xl font-bold ${valueColor}`}>{value}</p>
      {sub && <p className="text-text-muted text-xs mt-1">{sub}</p>}
    </div>
  );
}
