import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Hash } from "lucide-react";
import { branches } from "../data/branches";
import { BranchIcon } from "../components/icons/BranchIcon";
import { getFormulasByBranch } from "../data/formulaSheet";
import type { BranchId } from "../types";

export default function FormulaSheet() {
  const { t } = useTranslation();
  const [selectedBranch, setSelectedBranch] = useState<BranchId>("civil");
  const sections = getFormulasByBranch(selectedBranch);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-extrabold text-text-primary">
        {t("formulaBookTitle")}
      </h1>

      {/* Branch tabs */}
      <div className="flex flex-wrap gap-2">
        {branches.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedBranch(b.id)}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${selectedBranch === b.id ? "bg-accent-gold text-bg-primary font-bold" : "bg-white/5 text-text-muted hover:text-text-primary"}`}
          >
            <BranchIcon id={b.id} size={14} /> {b.nameTH}
          </button>
        ))}
      </div>

      {/* Formula sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="glass-card p-6">
            <h2 className="font-heading font-bold text-lg text-text-primary mb-4 flex items-center gap-2">
              <Hash size={16} className="text-accent-gold" /> {section.title}
            </h2>
            <div className="space-y-4">
              {section.formulas.map((f) => (
                <div
                  key={f.id}
                  className="border-b border-white/5 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {f.nameEN}
                      </p>
                      <p className="text-xs text-text-muted">{f.nameTH}</p>
                    </div>
                    {f.unit && (
                      <span className="badge-blue text-xs">{f.unit}</span>
                    )}
                  </div>
                  <code className="block font-mono text-sm bg-white/5 rounded-lg px-3 py-2 text-accent-gold border border-white/5">
                    {f.formula}
                  </code>
                  {f.variables && (
                    <p className="text-xs text-text-muted mt-2 leading-relaxed">
                      {f.variables}
                    </p>
                  )}
                  {f.notes && (
                    <p className="text-xs text-text-muted mt-1 italic">
                      {f.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
