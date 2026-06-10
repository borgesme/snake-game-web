interface ScorePanelProps {
  score: number;
  bestScore: number;
}

export function ScorePanel({ score, bestScore }: ScorePanelProps) {
  return (
    <section
      aria-label="Score"
      className="grid w-full grid-cols-2 gap-2 rounded-md border border-[var(--color-grid)] bg-[var(--color-surface)] p-3"
    >
      <ScoreItem label="Score" value={score} />
      <ScoreItem label="Best" value={bestScore} />
    </section>
  );
}

function ScoreItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0">
      <div className="text-xs font-medium uppercase text-[var(--color-text-muted)]">{label}</div>
      <div className="truncate text-2xl font-semibold tabular-nums text-[var(--color-text)]">
        {value}
      </div>
    </div>
  );
}
