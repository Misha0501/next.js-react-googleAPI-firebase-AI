type Props = {
  className?: string;
};

/*
 * Intentionally has no default color/rounding classes. Tailwind utilities
 * live in a cascade layer, so two conflicting classes (e.g. a baked-in
 * bg-slate-200 here and a caller's bg-slate-100) don't resolve by source
 * order - the winner depends on Tailwind's internal utility order, not
 * which one appears later in the className string. Every call site must
 * specify its own bg-* and rounded-* explicitly to avoid that ambiguity.
 */
export const Skeleton = ({ className = "" }: Props) => (
  <div className={`animate-pulse ${className}`} />
);
