import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../../components/ui/Button";

export default function RegisterStep1() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setRegData } = useAuthStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = t("errorRequired");
    if (!form.lastName.trim()) e.lastName = t("errorRequired");
    if (!form.dob) {
      e.dob = t("errorRequired");
    } else {
      const age =
        (Date.now() - new Date(form.dob).getTime()) /
        (365.25 * 24 * 3600 * 1000);
      if (age < 18) e.dob = t("errorMinAge");
    }
    if (!form.email.trim()) e.email = t("errorRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = t("errorEmailFormat");
    if (!form.phone.trim()) e.phone = t("errorRequired");
    else if (!/^\d{10}$/.test(form.phone.replace(/[-\s]/g, "")))
      e.phone = t("errorPhoneFormat");
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setRegData(form);
    navigate("/auth/register/account");
  }

  const field = (id: keyof typeof form, label: string, type = "text") => (
    <div>
      <label htmlFor={id} className="block text-sm text-text-muted mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="input-field"
        value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
      />
      {errors[id] && (
        <p className="text-accent-red text-xs mt-1">{errors[id]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-accent-gold mb-2">
            ENGI-Mock Pro
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-8 h-8 rounded-full bg-accent-gold flex items-center justify-center text-bg-primary font-bold text-sm">
              1
            </div>
            <div className="w-16 h-0.5 bg-white/10" />
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-text-muted text-sm">
              2
            </div>
          </div>
        </div>
        <div className="glass-card p-8">
          <h2 className="font-heading text-xl font-bold text-text-primary mb-6">
            {t("register")} — ข้อมูลส่วนตัว
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {field("firstName", t("firstName"))}
              {field("lastName", t("lastName"))}
            </div>
            {field("dob", t("dob"), "date")}
            {field("email", t("email"), "email")}
            {field("phone", t("phone"), "tel")}
            <Button type="submit" variant="gold" className="w-full mt-2">
              {t("next")}
            </Button>
          </form>
          <p className="text-center text-sm text-text-muted mt-4">
            {t("hasAccount")}{" "}
            <Link
              to="/auth/login"
              className="text-accent-gold hover:underline font-medium"
            >
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
