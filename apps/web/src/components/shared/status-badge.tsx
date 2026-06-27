type StatusBadgeProps = {
  label: string;
  tone?: 'neutral' | 'success' | 'warning';
};

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  const toneClass =
    tone === 'success'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : tone === 'warning'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-neutral-100 text-neutral-700 border-neutral-200';

  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${toneClass}`}>{label}</span>;
}
