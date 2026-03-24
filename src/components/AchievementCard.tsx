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
  consistency: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
  strength: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
  volume: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  explorer: { bg: 'bg-emerald-500/10', border: 'border-emerald-200', text: 'text-emerald-600' },
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const isUnlocked = achievement.unlockedAt !== null;
  const colors = categoryColors[achievement.category] ?? categoryColors.consistency;

  return (
    <div
      className={`rounded-2xl border p-3.5 transition-all ${
        isUnlocked
          ? `${colors.bg} ${colors.border}`
          : 'border-gray-100 bg-gray-50 opacity-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${
          isUnlocked ? 'bg-gray-100' : 'bg-gray-50'
        }`}>
          {isUnlocked ? (
            <span>{achievement.icon}</span>
          ) : (
            <Lock className="h-4 w-4 text-muted-foreground/50" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className={`text-sm font-medium ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
            {achievement.name}
          </h3>
          <p className="text-[11px] text-muted-foreground leading-tight">{achievement.description}</p>
        </div>

        {isUnlocked && achievement.unlockedAt && (
          <span className={`text-[10px] ${colors.text} whitespace-nowrap`}>
            {new Date(achievement.unlockedAt).toLocaleDateString('sv-SE')}
          </span>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;
