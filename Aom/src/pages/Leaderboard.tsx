import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Medal, Flame } from "lucide-react";
import { storage } from "../utils/storage";
import { useAuthStore } from "../stores/authStore";
import { branches } from "../data/branches";
import { BranchIcon } from "../components/icons/BranchIcon";
import { formatDate } from "../utils/dateUtils";
import type { LeaderboardEntry } from "../types";

export default function Leaderboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [branchFilter, setBranchFilter] = useState("all");

  const leaderboard = storage.get<LeaderboardEntry[]>("leaderboard") ?? [];

  // Add current user if they have history
  const history =
    storage.get<{ score: number; branch: string; totalQuestions: number }[]>(
      "history",
    ) ?? [];
  let data = [...leaderboard];
  if (user && history.length > 0) {
    const userAvg = Math.round(
      history.reduce((s, h) => s + h.score, 0) / history.length,
    );
    const favBranch = history.reduce(
      (acc, h) => {
        acc[h.branch] = (acc[h.branch] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const fav =
      Object.entries(favBranch).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "civil";
    const existing = data.findIndex((d) => d.username === user.username);
    const entry: LeaderboardEntry = {
      username: user.username,
      avatar: user.avatar,
      avgScore: userAvg,
      totalExams: history.length,
      bestScore: Math.max(...history.map((h) => h.score)),
      streak: storage.get<{ count: number }>("streak")?.count ?? 0,
      branch: fav,
    };
    if (existing >= 0) data[existing] = entry;
    else data.push(entry);
  }

  const filtered =
    branchFilter === "all"
      ? data
      : data.filter((d) => d.branch === branchFilter);
  const sorted = [...filtered].sort((a, b) => b.avgScore - a.avgScore);

  const medalIcon = (rank: number) => {
    if (rank === 1) return <Medal size={18} className="text-yellow-400" />;
    if (rank === 2) return <Medal size={18} className="text-gray-300" />;
    if (rank === 3) return <Medal size={18} className="text-amber-600" />;
    return (
      <span className="font-mono text-sm text-text-muted w-[18px] text-center">
        {rank}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-heading text-2xl font-extrabold text-text-primary">
          {t("leaderboard")}
        </h1>
        <p className="text-xs text-text-muted">
          {t("updatedAt")}: {formatDate(new Date().toISOString())}
        </p>
      </div>

      {/* Branch filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setBranchFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${branchFilter === "all" ? "bg-accent-gold text-bg-primary font-bold" : "bg-white/5 text-text-muted hover:text-text-primary"}`}
        >
          {t("overall")}
        </button>
        {branches.map((b) => (
          <button
            key={b.id}
            onClick={() => setBranchFilter(b.id)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${branchFilter === b.id ? "bg-accent-gold text-bg-primary font-bold" : "bg-white/5 text-text-muted hover:text-text-primary"}`}
          >
            <BranchIcon id={b.id} size={14} /> {b.nameTH}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs text-text-muted font-medium">
                  {t("rank")}
                </th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-medium">
                  {t("username")}
                </th>
                <th className="text-right px-4 py-3 text-xs text-text-muted font-medium">
                  {t("avgScore")}
                </th>
                <th className="text-right px-4 py-3 text-xs text-text-muted font-medium hidden sm:table-cell">
                  {t("totalExams")}
                </th>
                <th className="text-right px-4 py-3 text-xs text-text-muted font-medium hidden md:table-cell">
                  {t("bestScore")}
                </th>
                <th className="text-right px-4 py-3 text-xs text-text-muted font-medium hidden lg:table-cell">
                  {t("streak")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, i) => {
                const isMe = entry.username === user?.username;
                return (
                  <tr
                    key={entry.username}
                    className={`border-b border-white/5 transition-colors ${isMe ? "bg-accent-gold/5 border-accent-gold/20" : "hover:bg-white/3"}`}
                  >
                    <td className="px-4 py-3 w-10">
                      <div className="flex items-center justify-center">
                        {medalIcon(i + 1)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent-gold/20 border border-accent-gold/20 flex items-center justify-center text-xs font-bold text-accent-gold overflow-hidden shrink-0">
                          {entry.avatar ? (
                            <img
                              src={entry.avatar}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            entry.username[0]?.toUpperCase()
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${isMe ? "text-accent-gold" : "text-text-primary"}`}
                        >
                          {entry.username}
                          {isMe ? " (คุณ)" : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-mono text-sm font-bold ${entry.avgScore >= 60 ? "text-accent-green" : "text-accent-red"}`}
                      >
                        {entry.avgScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-text-muted hidden sm:table-cell">
                      {entry.totalExams}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-text-muted hidden md:table-cell">
                      {entry.bestScore}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-text-muted hidden lg:table-cell">
                      <Flame size={13} className="inline text-orange-400" />{" "}
                      {entry.streak}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
