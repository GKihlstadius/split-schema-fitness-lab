import React from 'react';
import { Lock } from 'lucide-react';

interface AchievementCardProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    unlockedAt: string | null;
  };
}

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  consistency: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
  },
  strength: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
  },
  volume: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
  },
  explorer: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
  },
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const isUnlocked = achievement.unlockedAt !== null;
  const colors = categoryColors[achievement.category] ?? categoryColors.consistency;

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE');
  };

  return (
    <div
      className={`relative rounded-xl border p-4 transition-all ${
        isUnlocked
          ? `${colors.bg} ${colors.border}`
          : 'border-gray-700 bg-gray-800/50 opacity-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-2xl">
          {isUnlocked ? (
            <span>{achievement.icon}</span>
          ) : (
            <Lock className="h-5 w-5 text-gray-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={`text-sm font-semibold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
            {achievement.name}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">{achievement.description}</p>
          {isUnlocked && achievement.unlockedAt && (
            <p className={`mt-1 text-xs ${colors.text}`}>
              Upplåst {formatDate(achievement.unlockedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
