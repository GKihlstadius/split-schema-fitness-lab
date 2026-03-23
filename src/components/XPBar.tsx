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

  const formatNumber = (n: number): string => {
    return n.toLocaleString('sv-SE');
  };

  return (
    <div className="w-full rounded-2xl bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
            <span className="text-xl font-bold text-white">{level}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Nivå {level}</p>
            <p className="text-base font-semibold text-white">{title}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-400">Total XP: {formatNumber(xp)}</p>
          <p className="text-base font-semibold text-white">
            {formatNumber(currentXP)} / {formatNumber(nextLevelXP)} XP
          </p>
        </div>
      </div>

      <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out"
          style={{ width: `${clampedProgress * 100}%` }}
        />
      </div>
    </div>
  );
};

// exported as named above
