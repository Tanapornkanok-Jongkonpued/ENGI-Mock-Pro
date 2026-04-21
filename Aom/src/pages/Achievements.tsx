import { useTranslation } from "react-i18next";
import { Lock } from "lucide-react";
import { getAchievements } from "../hooks/useAchievements";
import { formatDate } from "../utils/dateUtils";
import { AchievementIcon } from "../components/icons/AchievementIcon";

export default function Achievements() {
  const { t } = useTranslation();
  const achievements = getAchievements();

  const categories = [
    { id: "progress", label: "ความก้าวหน้า" },
    { id: "score", label: "คะแนน" },
    { id: "branch", label: "ความเชี่ยวชาญสาขา" },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-text-primary">
          {t("achievements")}
        </h1>
        <p className="text-text-muted text-sm mt-1">
          {achievements.filter((a) => a.earned).length} / {achievements.length}{" "}
          ปลดล็อกแล้ว
        </p>
      </div>

      {categories.map((cat) => {
        const catAch = achievements.filter((a) => a.category === cat.id);
        return (
          <div key={cat.id}>
            <h2 className="section-title mb-4">{cat.label}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {catAch.map((a) => (
                <div
                  key={a.id}
                  className={`glass-card p-4 text-center transition-all ${a.earned ? "border-accent-gold/30" : "opacity-50"}`}
                >
                  <div
                    className={`flex justify-center mb-2 ${!a.earned ? "opacity-40" : "text-accent-gold"}`}
                  >
                    {a.earned ? (
                      <AchievementIcon icon={a.icon} size={28} />
                    ) : (
                      <Lock size={24} className="text-text-muted" />
                    )}
                  </div>
                  <p
                    className={`text-sm font-semibold ${a.earned ? "text-text-primary" : "text-text-muted"}`}
                  >
                    {a.titleTH}
                  </p>
                  <p className="text-xs text-text-muted mt-1 leading-tight">
                    {a.descTH}
                  </p>
                  {a.earned && a.date && (
                    <p className="text-xs text-accent-gold mt-2">
                      {formatDate(a.date)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
