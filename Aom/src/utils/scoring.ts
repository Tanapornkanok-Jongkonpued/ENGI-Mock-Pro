import type { ExamSession } from "../types";

export function calcScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 1000) / 10;
}

export function isPassed(score: number): boolean {
  return score >= 60;
}

export function percentRank(scores: number[], userScore: number): number {
  if (scores.length === 0) return 50;
  const below = scores.filter((s) => s < userScore).length;
  return Math.round((below / scores.length) * 100);
}

export function calcReadiness(
  userAvg: number,
  communityScores: { avgScore: number }[],
): number {
  const scores = communityScores.map((c) => c.avgScore);
  const rank = percentRank(scores, userAvg);
  return Math.min(100, Math.round(rank * 1.2));
}

export function calcUserAvg(history: ExamSession[]): number {
  const last10 = history.slice(-10);
  if (last10.length === 0) return 0;
  return Math.round(
    last10.reduce((sum, h) => sum + h.score, 0) / last10.length,
  );
}

export function subcategoryStats(
  history: ExamSession[],
): Record<string, { correct: number; total: number }> {
  const stats: Record<string, { correct: number; total: number }> = {};
  for (const session of history) {
    for (const q of session.questions) {
      if (!stats[q.subcategory])
        stats[q.subcategory] = { correct: 0, total: 0 };
      stats[q.subcategory].total++;
      if (q.userAnswer === q.correctAnswer) stats[q.subcategory].correct++;
    }
  }
  return stats;
}
