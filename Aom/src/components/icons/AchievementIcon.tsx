import {
  Target,
  BookOpen,
  Award,
  Flame,
  CheckCircle,
  Star,
  Trophy,
  Crown,
  Building2,
  Zap,
  Cog,
  Factory,
  FlaskConical,
  Leaf,
  Bookmark,
  Bot,
} from "lucide-react";

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

const map: Record<string, IconComponent> = {
  "🎯": Target,
  "📚": BookOpen,
  "💯": Award,
  "🔥": Flame,
  "✅": CheckCircle,
  "⭐": Star,
  "🏆": Trophy,
  "👑": Crown,
  "🏗️": Building2,
  "⚡": Zap,
  "⚙️": Cog,
  "🏭": Factory,
  "🧪": FlaskConical,
  "🌿": Leaf,
  "🔖": Bookmark,
  "🤖": Bot,
};

interface Props {
  icon: string;
  size?: number;
  className?: string;
}

export function AchievementIcon({ icon, size = 24, className }: Props) {
  const Icon = map[icon] ?? Award;
  return <Icon size={size} className={className} />;
}
