import { storage } from "../utils/storage";
import { achievementDefs } from "../data/achievements";
import type { Achievement, ExamSession } from "../types";
import { getHistory } from "./useExamHistory";
import { getStreak } from "./useStreak";

export function getAchievements(): Achievement[] {
  const saved =
    storage.get<Record<string, { earned: boolean; date: string | null }>>(
      "achievements",
    ) ?? {};
  return achievementDefs.map((a) => ({
    ...a,
    earned: saved[a.id]?.earned ?? false,
    date: saved[a.id]?.date ?? null,
  }));
}

export function earnAchievement(id: string): void {
  const saved =
    storage.get<Record<string, { earned: boolean; date: string | null }>>(
      "achievements",
    ) ?? {};
  saved[id] = { earned: true, date: new Date().toISOString() };
  storage.set("achievements", saved);
}

export function checkAchievements(latestSession?: ExamSession): string[] {
  const history = getHistory();
  const streak = getStreak();
  const achievements = getAchievements();
  const newlyEarned: string[] = [];

  const earn = (id: string) => {
    const a = achievements.find((a) => a.id === id);
    if (a && !a.earned) {
      earnAchievement(id);
      newlyEarned.push(id);
    }
  };

  if (history.length >= 1) earn("first_attempt");
  if (history.length >= 10) earn("ten_exams");

  const totalQs = history.reduce((s, h) => s + h.totalQuestions, 0);
  if (totalQs >= 100) earn("centurion");

  if (streak.count >= 3) earn("streak_3");
  if (streak.count >= 7) earn("streak_7");
  if (streak.count >= 30) earn("streak_30");

  if (latestSession) {
    if (latestSession.passed) earn("first_pass");
    if (latestSession.score >= 80) earn("high_achiever");
    if (latestSession.score >= 90) earn("elite");
    if (latestSession.score >= 100) earn("perfect");

    // Branch mastery
    const branchHistory = history.filter(
      (h) => h.branch === latestSession.branch,
    );
    if (branchHistory.length >= 5) {
      const avg =
        branchHistory.reduce((s, h) => s + h.score, 0) / branchHistory.length;
      if (avg >= 70) earn(`master_${latestSession.branch}`);
    }
  }

  // Bookmarks
  const bookmarks = storage.get<Record<string, unknown>>("bookmarks") ?? {};
  if (Object.keys(bookmarks).length >= 20) earn("bookworm");

  return newlyEarned;
}
