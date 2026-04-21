import { storage } from "../utils/storage";
import { isToday, isYesterday, todayISO } from "../utils/dateUtils";
import type { Streak } from "../types";

export function getStreak(): Streak {
  return storage.get<Streak>("streak") ?? { count: 0, lastActive: "" };
}

export function updateStreak(): Streak {
  const streak = getStreak();
  const today = todayISO();
  if (streak.lastActive === today) return streak;

  let newCount: number;
  if (isToday(streak.lastActive) || isYesterday(streak.lastActive)) {
    newCount = streak.count + 1;
  } else {
    newCount = 1;
  }

  const updated: Streak = { count: newCount, lastActive: today };
  storage.set("streak", updated);
  return updated;
}
