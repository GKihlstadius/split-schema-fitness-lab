import React from 'react';

interface XPBarProps {
  xp: number;
  level: number;
  title: string;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
}

export const XPBar: React.FC<XPBarProps> = ({
  xp,
  level,
  title,
  currentXP,
  nextLevelXP,
  progress,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const fmt = (n: number) => n.toLocaleString('sv-SE');

  return (
    <div className="w-full rounded-2xl bg-card border border-border shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary shadow-sm">
            <span className="text-lg font-bold text-primary-foreground">{level}</span>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Nivå {level}</p>
            <p className="text-sm font-semibold text-foreground">{title}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium text-muted-foreground">{fmt(xp)} total XP</p>
          <p className="text-sm font-semibold text-foreground">
            {fmt(currentXP)} / {fmt(nextLevelXP)}
          </p>
        </div>
      </div>

      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 left-0 rounded-full kinetic-gradient transition-all duration-700 ease-out"
          style={{ width: `${clampedProgress * 100}%` }}
        />
      </div>
    </div>
  );
};
