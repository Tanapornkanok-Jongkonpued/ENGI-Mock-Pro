import type { LeaderboardEntry } from "../types";

const thaiFirstNames = [
  "สมชาย",
  "วิชัย",
  "นภา",
  "อรุณ",
  "ปิยะ",
  "กมล",
  "รัชนี",
  "ธนา",
  "มานะ",
  "สุวรรณ",
  "ชาติ",
  "นิรันดร์",
  "พิชัย",
  "วิมล",
  "ศักดิ์ดา",
  "ลดาวัลย์",
  "อนันต์",
  "สุภา",
  "ธีรยุทธ",
  "กัลยา",
];
const thaiLastNames = [
  "สมบูรณ์",
  "วงศ์ทอง",
  "บุญมา",
  "แสงดาว",
  "ภูมิใจ",
  "ดีงาม",
  "ใจดี",
  "มีสุข",
  "โชคดี",
  "เจริญสุข",
  "รักดี",
  "ฉลาดเฉลียว",
  "บุตรดี",
  "พงษ์พิทักษ์",
  "นาคสุวรรณ",
];
const branches = [
  "civil",
  "electrical",
  "mechanical",
  "industrial",
  "chemical",
  "environmental",
];

function randNormal(mean: number, std: number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const n = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.max(0, Math.min(100, mean + n * std));
}

export function generateSeedLeaderboard(): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = [];
  for (let i = 0; i < 50; i++) {
    const fn = thaiFirstNames[i % thaiFirstNames.length];
    thaiLastNames[i % thaiLastNames.length]; // reference to avoid lint
    const avg = Math.round(randNormal(58, 15));
    entries.push({
      username: `${fn.toLowerCase()}${i + 1}`,
      avatar: "",
      avgScore: avg,
      totalExams: Math.floor(Math.random() * 30) + 1,
      bestScore: Math.min(100, avg + Math.floor(Math.random() * 20)),
      streak: Math.floor(Math.random() * 15),
      branch: branches[i % branches.length],
    });
  }
  return entries;
}
