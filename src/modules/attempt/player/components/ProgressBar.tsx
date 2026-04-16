interface Props {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: Props) => {
  const pct = total === 0 ? 0 : Math.round(((current + 1) / total) * 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>
          {current + 1} / {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full bg-brand-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
