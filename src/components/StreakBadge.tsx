import React from 'react';

interface StreakBadgeProps {
  streak: number;
  longestStreak: number;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, longestStreak }) => {
  const isHot = streak >= 7;
  const isOnFire = streak >= 30;

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🔥</span>
          <span className="text-xs text-muted-foreground">Streak</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-2xl font-bold ${
              isHot
                ? 'bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent'
                : 'text-foreground'
            }`}
          >
            {streak}
          </span>
          <span className="text-xs text-muted-foreground">dagar</span>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-[10px] text-muted-foreground">
          Längsta: {longestStreak} dagar
        </p>
        {isOnFire && (
          <span className="inline-block mt-1 text-[10px] font-medium text-orange-400 bg-orange-500/10 rounded-full px-2 py-0.5">
            Ostoppbar!
          </span>
        )}
      </div>
    </div>
  );
};

export default StreakBadge;
