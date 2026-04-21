import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Camera } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useUIStore } from "../stores/uiStore";
import { getHistory } from "../hooks/useExamHistory";
import { getBranchById } from "../data/branches";
import { Button } from "../components/ui/Button";
import { formatDate } from "../utils/dateUtils";

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const { addToast } = useUIStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const history = getHistory();

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    dob: user?.dob ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    username: user?.username ?? "",
  });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwOpen, setPwOpen] = useState(false);

  function saveField(field: string) {
    updateUser({ [field]: (form as Record<string, string>)[field] });
    setEditing(null);
    addToast({ type: "success", message: t("saveSuccess") });
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateUser({ avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  function changePassword() {
    if (!user) return;
    if (user.passwordHash !== btoa(pwForm.current)) {
      setPwError("รหัสผ่านปัจจุบันไม่ถูกต้อง");
      return;
    }
    if (pwForm.next.length < 8) {
      setPwError(t("errorPasswordMin"));
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError(t("errorPasswordMatch"));
      return;
    }
    updateUser({ passwordHash: btoa(pwForm.next) });
    addToast({ type: "success", message: t("passwordChanged") });
    setPwForm({ current: "", next: "", confirm: "" });
    setPwError("");
    setPwOpen(false);
  }

  // Stats
  const avgScore = history.length
    ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)
    : 0;
  const bestScore = history.length
    ? Math.max(...history.map((h) => h.score))
    : 0;
  const favBranch =
    history.length > 0
      ? Object.entries(
          history.reduce(
            (acc, h) => {
              acc[h.branch] = (acc[h.branch] ?? 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          ),
        ).sort((a, b) => b[1] - a[1])[0]?.[0]
      : null;

  const fields: { key: keyof typeof form; label: string; type?: string }[] = [
    { key: "firstName", label: t("firstName") },
    { key: "lastName", label: t("lastName") },
    { key: "dob", label: t("dob"), type: "date" },
    { key: "email", label: t("email"), type: "email" },
    { key: "phone", label: t("phone"), type: "tel" },
    { key: "username", label: t("username") },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="glass-card p-6 flex items-center gap-5">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full bg-accent-gold/20 border-2 border-accent-gold/30 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-heading text-3xl font-extrabold text-accent-gold">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <button
            className="absolute bottom-0 right-0 w-7 h-7 bg-accent-gold rounded-full flex items-center justify-center text-bg-primary"
            onClick={() => fileRef.current?.click()}
          >
            <Camera size={14} />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatar}
          />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            {user?.username}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {t("joinDate")}: {user ? formatDate(user.joinDate) : ""}
          </p>
        </div>
      </div>

      {/* Exam stats */}
      <div className="glass-card p-6">
        <h2 className="section-title mb-4">{t("examStats")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Stat label={t("totalExams")} value={history.length.toString()} />
          <Stat label={t("avgScore")} value={`${avgScore}%`} />
          <Stat label={t("bestScore")} value={`${bestScore}%`} />
          {favBranch && (
            <Stat
              label={t("favBranch")}
              value={getBranchById(favBranch as any).nameTH}
            />
          )}
        </div>
      </div>

      {/* Editable fields */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="section-title mb-2">ข้อมูลส่วนตัว</h2>
        {fields.map(({ key, label, type = "text" }) => (
          <div
            key={key}
            className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
          >
            <div className="flex-1">
              <p className="text-xs text-text-muted">{label}</p>
              {editing === key ? (
                <input
                  type={type}
                  className="input-field mt-1 py-2 text-sm"
                  value={(form as Record<string, string>)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              ) : (
                <p className="text-sm text-text-primary mt-0.5">
                  {(form as Record<string, string>)[key] || "—"}
                </p>
              )}
            </div>
            {editing === key ? (
              <div className="flex gap-2">
                <Button
                  variant="gold"
                  className="text-xs py-1.5 px-3"
                  onClick={() => saveField(key)}
                >
                  {t("save")}
                </Button>
                <Button
                  variant="ghost"
                  className="text-xs py-1.5 px-3"
                  onClick={() => setEditing(null)}
                >
                  {t("cancel")}
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="text-xs py-1.5 px-3"
                onClick={() => setEditing(key)}
              >
                {t("edit")}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Password change */}
      <div className="glass-card p-6">
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setPwOpen(!pwOpen)}
        >
          <h2 className="section-title">{t("changePassword")}</h2>
          <span className="text-text-muted text-sm">{pwOpen ? "▲" : "▼"}</span>
        </button>
        {pwOpen && (
          <div className="mt-4 space-y-3">
            {["current", "next", "confirm"].map((f) => (
              <div key={f}>
                <label className="text-xs text-text-muted block mb-1">
                  {f === "current"
                    ? t("currentPassword")
                    : f === "next"
                      ? t("newPassword")
                      : t("confirmPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    className="input-field pr-10 text-sm py-2"
                    value={(pwForm as Record<string, string>)[f]}
                    onChange={(e) =>
                      setPwForm({ ...pwForm, [f]: e.target.value })
                    }
                  />
                  {f === "current" && (
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                    >
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {pwError && <p className="text-accent-red text-xs">{pwError}</p>}
            <Button
              variant="gold"
              className="w-full text-sm"
              onClick={changePassword}
            >
              {t("save")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="font-mono text-lg font-bold text-accent-gold mt-0.5">
        {value}
      </p>
    </div>
  );
}
