import { storage } from "../utils/storage";
import { achievementDefs } from "../data/achievements";
import { generateSeedLeaderboard } from "../data/seedLeaderboard";

export function initAppData(): void {
  // Seed leaderboard if not present
  if (!storage.get("leaderboard")) {
    storage.set("leaderboard", generateSeedLeaderboard());
  }

  // Seed community scores
  if (!storage.get("community_scores")) {
    const scores = generateSeedLeaderboard().map((u) => ({
      username: u.username,
      avgScore: u.avgScore,
    }));
    storage.set("community_scores", scores);
  }

  // Init achievements if not present
  if (!storage.get("achievements")) {
    const ach: Record<string, { earned: boolean; date: string | null }> = {};
    for (const a of achievementDefs) {
      ach[a.id] = { earned: false, date: null };
    }
    storage.set("achievements", ach);
  }

  // Apply dark mode class
  const user = storage.get<{ darkMode: boolean }>("user");
  if (user?.darkMode !== false) {
    document.documentElement.classList.add("dark");
  }
}
