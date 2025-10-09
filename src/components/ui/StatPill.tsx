export function StatPill({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="relative rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 shadow-[0_6px_24px_rgba(0,0,0,0.35)]">
      <div className="text-xs uppercase tracking-wider text-white/60">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
      {hint && <div className="mt-1 text-xs text-white/50">{hint}</div>}
    </div>
  );
}
