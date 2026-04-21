import { Building2, Zap, Cog, Factory, FlaskConical, Leaf } from "lucide-react";
import type { BranchId } from "../../types";

const map: Record<
  BranchId,
  React.ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>
> = {
  civil: Building2,
  electrical: Zap,
  mechanical: Cog,
  industrial: Factory,
  chemical: FlaskConical,
  environmental: Leaf,
};

interface Props {
  id: BranchId;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function BranchIcon({ id, size = 18, className, strokeWidth }: Props) {
  const Icon = map[id] ?? Building2;
  return <Icon size={size} className={className} strokeWidth={strokeWidth} />;
}
