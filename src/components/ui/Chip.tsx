export function Chip({
  tone = 'default',
  children,
}: {
  tone?: 'default' | 'good' | 'warn' | 'muted';
  children: React.ReactNode;
}) {
  const toneStyles = {
    default: 'bg-white/10 text-white',
    good: 'bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30',
    warn: 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30',
    muted: 'bg-white/10 text-white/70',
  }[tone];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${toneStyles}`}
    >
      {children}
    </span>
  );
}
