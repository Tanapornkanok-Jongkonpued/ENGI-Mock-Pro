// localStorage utility helpers
const PREFIX = "engi_";

export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // storage quota exceeded — ignore silently
    }
  },
  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },
};
