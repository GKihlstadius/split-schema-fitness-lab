import React from 'react';

interface StreakBadgeProps {
  streak: number;
  longestStreak: number;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, longestStreak }) => {
  const isHot = streak >= 7;
  const isOnFire = streak >= 30;

  return (
    <div className="rounded-2xl bg-gray-900 p-4 text-center">
      <div className="relative inline-block">
        {isOnFire && (
          <span className="absolute -top-3 -right-3 text-2xl animate-bounce">
            🔥
          </span>
        )}
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl">🔥</span>
          <span
            className={`text-5xl font-extrabold ${
              isHot
                ? 'bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent'
                : 'text-white'
            }`}
          >
            {streak}
          </span>
        </div>
      </div>

      <p className="mt-1 text-base font-medium text-gray-300">
        dagars streak
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Längsta: {longestStreak} dagar
      </p>

      {isOnFire && (
        <div className="mt-2 inline-block rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 px-3 py-1">
          <span className="text-xs font-semibold text-orange-400">
            🔥 Ostoppbar! 🔥
          </span>
        </div>
      )}
    </div>
  );
};

export default StreakBadge;
