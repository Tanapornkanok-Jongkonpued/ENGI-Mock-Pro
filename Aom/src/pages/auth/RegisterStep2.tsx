import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useUIStore } from "../../stores/uiStore";
import { Button } from "../../components/ui/Button";
import type { User } from "../../types";

export default function RegisterStep2() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { regData, login } = useAuthStore();
  const { addToast } = useUIStore();
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.username.trim()) e.username = t("errorRequired");
    else if (!/^[a-z0-9_]{4,20}$/i.test(form.username))
      e.username = t("errorUsernameFormat");
    if (!form.password) e.password = t("errorRequired");
    else if (form.password.length < 8) e.password = t("errorPasswordMin");
    else if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password))
      e.password = t("errorPasswordStrength");
    if (form.confirm !== form.password) e.confirm = t("errorPasswordMatch");
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      ...(regData as Omit<
        User,
        | "id"
        | "username"
        | "passwordHash"
        | "avatar"
        | "joinDate"
        | "language"
        | "examTargetDate"
        | "darkMode"
      >),
      username: form.username,
      passwordHash: btoa(form.password),
      avatar: "",
      joinDate: new Date().toISOString(),
      language: "th",
      examTargetDate: null,
      darkMode: true,
    };
    login(user);
    addToast({ type: "success", message: t("registerSuccess") });
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-accent-gold mb-2">
            ENGI-Mock Pro
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-8 h-8 rounded-full bg-accent-gold/30 flex items-center justify-center text-accent-gold font-bold text-sm">
              ✓
            </div>
            <div className="w-16 h-0.5 bg-accent-gold/30" />
            <div className="w-8 h-8 rounded-full bg-accent-gold flex items-center justify-center text-bg-primary font-bold text-sm">
              2
            </div>
          </div>
        </div>
        <div className="glass-card p-8">
          <h2 className="font-heading text-xl font-bold text-text-primary mb-6">
            {t("register")} — ตั้งค่าบัญชี
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm text-text-muted mb-1.5"
              >
                {t("username")}
              </label>
              <input
                id="username"
                className="input-field"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              {errors.username && (
                <p className="text-accent-red text-xs mt-1">
                  {errors.username}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="pw"
                className="block text-sm text-text-muted mb-1.5"
              >
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="pw"
                  type={showPw ? "text" : "password"}
                  className="input-field pr-10"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-accent-red text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirm"
                className="block text-sm text-text-muted mb-1.5"
              >
                {t("confirmPassword")}
              </label>
              <input
                id="confirm"
                type="password"
                className="input-field"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
              {errors.confirm && (
                <p className="text-accent-red text-xs mt-1">{errors.confirm}</p>
              )}
            </div>
            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/auth/register")}
                className="flex-1"
              >
                {t("back")}
              </Button>
              <Button type="submit" variant="gold" className="flex-1">
                {t("register")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
