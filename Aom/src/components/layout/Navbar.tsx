import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Bot,
  Trophy,
  FileText,
  User,
  Award,
  Bookmark,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Flame,
  Bell,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useUIStore } from "../../stores/uiStore";
import { getStreak } from "../../hooks/useStreak";
import i18n from "../../i18n";

export function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { language, setLanguage, darkMode, toggleDarkMode } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const streak = getStreak();

  const navLinks = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={16} />,
      label: t("dashboard"),
    },
    {
      to: "/practice/select",
      icon: <BookOpen size={16} />,
      label: t("practice"),
    },
    {
      to: "/exam/select",
      icon: <ClipboardList size={16} />,
      label: t("mockTest"),
    },
    { to: "/ai-chat", icon: <Bot size={16} />, label: t("aiChat") },
    { to: "/leaderboard", icon: <Trophy size={16} />, label: t("leaderboard") },
    {
      to: "/formula-sheet",
      icon: <FileText size={16} />,
      label: t("formulaSheet"),
    },
  ];

  function switchLang() {
    const next = language === "th" ? "en" : "th";
    setLanguage(next);
    i18n.changeLanguage(next);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  const active = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg-primary/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="font-heading font-extrabold text-xl text-accent-gold tracking-tight"
        >
          ENGI-Mock Pro
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${active(l.to) ? "text-accent-gold bg-accent-gold/10" : "text-text-muted hover:text-text-primary"}`}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Lang */}
          <button
            onClick={switchLang}
            className="px-2 py-1 rounded-lg text-xs font-mono font-bold text-text-muted hover:text-text-primary border border-white/10 hover:border-accent-gold/30 transition-colors"
          >
            {language === "th" ? "EN" : "TH"}
          </button>

          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary transition-colors"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
            <Flame size={14} className="text-orange-400" />
            <span className="font-mono text-xs text-text-primary font-bold">
              {streak.count}
            </span>
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-lg text-text-muted hover:text-text-primary transition-colors hidden sm:block">
            <Bell size={16} />
          </button>

          {/* User avatar dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropOpen(!dropOpen)}
              className="w-8 h-8 rounded-full bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center text-accent-gold font-bold text-sm overflow-hidden"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                (user?.username?.[0]?.toUpperCase() ?? "U")
              )}
            </button>

            {dropOpen && (
              <div className="absolute right-0 top-10 w-48 glass-card py-2 border border-white/10">
                <DropItem
                  icon={<User size={14} />}
                  label={t("profile")}
                  to="/profile"
                  onClick={() => setDropOpen(false)}
                />
                <DropItem
                  icon={<Award size={14} />}
                  label={t("achievements")}
                  to="/achievements"
                  onClick={() => setDropOpen(false)}
                />
                <DropItem
                  icon={<Bookmark size={14} />}
                  label={t("bookmarks")}
                  to="/bookmark"
                  onClick={() => setDropOpen(false)}
                />
                <hr className="my-1 border-white/10" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent-red hover:bg-accent-red/10 transition-colors"
                >
                  <LogOut size={14} />
                  {t("logout")}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-bg-secondary border-t border-white/5 py-2 px-4">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${active(l.to) ? "text-accent-gold bg-accent-gold/10" : "text-text-muted"}`}
            >
              {l.icon}
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

function DropItem({
  icon,
  label,
  to,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  onClick: () => void;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate(to);
        onClick();
      }}
      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}
