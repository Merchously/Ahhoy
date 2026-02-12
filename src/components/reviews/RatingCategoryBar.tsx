interface RatingCategoryBarProps {
  label: string;
  value: number | null;
}

export function RatingCategoryBar({ label, value }: RatingCategoryBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-navy rounded-full transition-all"
          style={{ width: value != null ? `${(value / 5) * 100}%` : "0%" }}
        />
      </div>
      <span className="text-sm font-medium text-navy w-7 text-right">
        {value != null ? value.toFixed(1) : "--"}
      </span>
    </div>
  );
}
