interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Průběh</span>
        <span>{percentage}%</span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: '8px', backgroundColor: '#374151' }}
      >
        <div
          className="h-full rounded-full transition-all duration-150"
          style={{
            width: `${percentage}%`,
            backgroundColor: '#8b5cf6',
          }}
        />
      </div>
    </div>
  );
}
