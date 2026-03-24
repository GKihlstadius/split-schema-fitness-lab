import React from 'react';
import { MapPin, Check, Loader2 } from 'lucide-react';

interface CheckInButtonProps {
  onCheckIn: () => void;
  isNearGym: boolean;
  gymName: string | null;
  distance: number | null;
  isCheckedIn: boolean;
  isLoading: boolean;
}

const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

const CheckInButton: React.FC<CheckInButtonProps> = ({
  onCheckIn,
  isNearGym,
  gymName,
  distance,
  isCheckedIn,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          disabled
          className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary"
        >
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </button>
        <p className="text-sm text-muted-foreground">Söker gym...</p>
      </div>
    );
  }

  if (isCheckedIn) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-500">
          <Check className="h-10 w-10 text-green-400" />
        </div>
        <p className="text-base font-semibold text-green-400">Incheckad!</p>
        {gymName && <p className="text-sm text-muted-foreground">{gymName}</p>}
      </div>
    );
  }

  if (isNearGym) {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onCheckIn}
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="flex flex-col items-center">
            <MapPin className="h-7 w-7 text-primary-foreground" />
            <span className="mt-0.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
              Check in
            </span>
          </div>
        </button>
        {gymName && (
          <p className="text-sm font-medium text-foreground">{gymName}</p>
        )}
        {distance !== null && (
          <p className="text-xs text-muted-foreground">{formatDistance(distance)} bort</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        disabled
        className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary ring-1 ring-border"
      >
        <MapPin className="h-7 w-7 text-muted-foreground" />
      </button>
      <p className="text-sm text-muted-foreground">Inget gym i närheten</p>
      {distance !== null && (
        <p className="text-xs text-muted-foreground">
          Närmaste gym: {formatDistance(distance)}
        </p>
      )}
    </div>
  );
};

export default CheckInButton;
