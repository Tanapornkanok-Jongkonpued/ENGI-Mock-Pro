import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, Trophy } from "lucide-react";
import { useUIStore } from "../../stores/uiStore";
import type { Toast } from "../../types";

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useUIStore((s) => s.removeToast);
  const icons = {
    success: <CheckCircle size={18} className="text-accent-green" />,
    error: <AlertCircle size={18} className="text-accent-red" />,
    info: <Info size={18} className="text-accent-blue" />,
    achievement: <Trophy size={18} className="text-accent-gold" />,
  };
  const borders = {
    success: "border-accent-green/30",
    error: "border-accent-red/30",
    info: "border-accent-blue/30",
    achievement: "border-accent-gold/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      className={`glass-card flex items-start gap-3 px-4 py-3 min-w-[280px] max-w-sm border ${borders[toast.type]}`}
    >
      <span className="mt-0.5">{icons[toast.type]}</span>
      <p className="flex-1 text-sm text-text-primary leading-snug">
        {toast.message}
      </p>
      <button
        onClick={() => remove(toast.id)}
        className="text-text-muted hover:text-text-primary mt-0.5"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
