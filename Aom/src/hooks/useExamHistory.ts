import { storage } from "../utils/storage";
import type { ExamSession } from "../types";

export function getHistory(): ExamSession[] {
  return storage.get<ExamSession[]>("history") ?? [];
}

export function saveSession(session: ExamSession): void {
  const history = getHistory();
  history.push(session);
  storage.set("history", history);
}

export function clearHistory(): void {
  storage.remove("history");
}
