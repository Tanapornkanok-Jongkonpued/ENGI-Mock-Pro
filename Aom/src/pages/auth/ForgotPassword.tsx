import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { storage } from "../../utils/storage";
import { useUIStore } from "../../stores/uiStore";
import { Button } from "../../components/ui/Button";
import type { User } from "../../types";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const MOCK_OTP = "123456";

  function step1Submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const user = storage.get<User>("user");
    if (!user || user.email !== email) {
      setError("ไม่พบอีเมลในระบบ");
      return;
    }
    setStep(2);
  }

  function step2Submit(e: React.FormEvent) {
    e.preventDefault();
    if (otp !== MOCK_OTP) {
      setError("OTP ไม่ถูกต้อง");
      return;
    }
    setStep(3);
  }

  function step3Submit(e: React.FormEvent) {
    e.preventDefault();
    if (newPw.length < 8) {
      setError(t("errorPasswordMin"));
      return;
    }
    if (newPw !== confirmPw) {
      setError(t("errorPasswordMatch"));
      return;
    }
    const user = storage.get<User>("user");
    if (user) {
      storage.set("user", { ...user, passwordHash: btoa(newPw) });
    }
    addToast({ type: "success", message: t("resetSuccess") });
    setStep(4);
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-accent-gold mb-2">
            ENGI-Mock Pro
          </h1>
        </div>
        <div className="glass-card p-8">
          <h2 className="font-heading text-xl font-bold text-text-primary mb-6">
            {t("forgotPassword")}
          </h2>

          {step === 1 && (
            <form onSubmit={step1Submit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-1.5">
                  {t("email")}
                </label>
                <input
                  className="input-field"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-accent-red text-sm">{error}</p>}
              <Button type="submit" variant="gold" className="w-full">
                {t("submit")}
              </Button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-accent-green text-sm">
                {t("otpSent")} (ใช้ 123456 สำหรับ demo)
              </p>
              <form onSubmit={step2Submit} className="space-y-4">
                <div>
                  <label className="block text-sm text-text-muted mb-1.5">
                    {t("enterOTP")}
                  </label>
                  <input
                    className="input-field font-mono tracking-widest text-center text-xl"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-accent-red text-sm">{error}</p>}
                <Button type="submit" variant="gold" className="w-full">
                  {t("confirm")}
                </Button>
              </form>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={step3Submit} className="space-y-4">
              <h3 className="text-text-muted text-sm">{t("setNewPassword")}</h3>
              <div>
                <label className="block text-sm text-text-muted mb-1.5">
                  {t("newPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    className="input-field pr-10"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
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
              <div>
                <label className="block text-sm text-text-muted mb-1.5">
                  {t("confirmPassword")}
                </label>
                <input
                  type="password"
                  className="input-field"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                />
              </div>
              {error && <p className="text-accent-red text-sm">{error}</p>}
              <Button type="submit" variant="gold" className="w-full">
                {t("submit")}
              </Button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="text-5xl">✅</div>
              <p className="text-accent-green font-medium">
                {t("resetSuccess")}
              </p>
              <Button
                variant="gold"
                className="w-full"
                onClick={() => navigate("/auth/login")}
              >
                {t("login")}
              </Button>
            </div>
          )}

          <p className="text-center text-sm text-text-muted mt-6">
            <Link to="/auth/login" className="text-accent-gold hover:underline">
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
