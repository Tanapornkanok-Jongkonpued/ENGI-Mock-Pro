interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  color?: string;
  showPercent?: boolean;
}

export function ProgressBar({
  value,
  label,
  color = "bg-accent-gold",
  showPercent = false,
}: ProgressBarProps) {
  return (
    <div>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-text-muted">{label}</span>
          {showPercent && (
            <span className="text-xs font-mono text-text-muted">{value}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
