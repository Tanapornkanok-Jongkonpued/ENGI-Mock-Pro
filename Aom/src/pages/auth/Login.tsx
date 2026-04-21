import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useUIStore } from "../../stores/uiStore";
import { storage } from "../../utils/storage";
import { Button } from "../../components/ui/Button";
import type { User } from "../../types";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useUIStore();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const user = storage.get<User>("user");
    if (
      user &&
      (user.username === identifier || user.email === identifier) &&
      user.passwordHash === btoa(password)
    ) {
      login(user);
      addToast({
        type: "success",
        message: `ยินดีต้อนรับกลับ, ${user.username}!`,
      });
      navigate("/dashboard");
    } else {
      setError(t("loginError"));
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-accent-gold mb-2">
            ENGI-Mock Pro
          </h1>
          <p className="text-text-muted text-sm">{t("tagline")}</p>
        </div>
        <div className="glass-card p-8">
          <h2 className="font-heading text-xl font-bold text-text-primary mb-6">
            {t("login")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm text-text-muted mb-1.5"
                htmlFor="identifier"
              >
                {t("username")} / {t("email")}
              </label>
              <input
                id="identifier"
                className="input-field"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm text-text-muted mb-1.5"
                htmlFor="password"
              >
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  className="input-field pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-accent-red text-sm">{error}</p>}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-text-muted cursor-pointer">
                <input type="checkbox" className="accent-accent-gold" />
                {t("rememberMe")}
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-accent-blue hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <Button
              type="submit"
              variant="gold"
              loading={loading}
              className="w-full mt-2"
            >
              {t("login")}
            </Button>
          </form>
          <p className="text-center text-sm text-text-muted mt-6">
            {t("noAccount")}{" "}
            <Link
              to="/auth/register"
              className="text-accent-gold hover:underline font-medium"
            >
              {t("register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
