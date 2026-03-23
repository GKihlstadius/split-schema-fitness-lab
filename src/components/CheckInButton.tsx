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
          className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-700"
        >
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </button>
        <p className="text-sm text-gray-400">Söker gym...</p>
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
        {gymName && <p className="text-sm text-gray-400">{gymName}</p>}
      </div>
    );
  }

  if (isNearGym) {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onCheckIn}
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-blue-500/30" />
          <div className="flex flex-col items-center">
            <MapPin className="h-7 w-7 text-white" />
            <span className="mt-0.5 text-xs font-bold uppercase tracking-wider text-white">
              Check in
            </span>
          </div>
        </button>
        {gymName && (
          <p className="text-sm font-medium text-white">{gymName}</p>
        )}
        {distance !== null && (
          <p className="text-xs text-gray-400">{formatDistance(distance)} bort</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        disabled
        className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-800 ring-1 ring-gray-700"
      >
        <MapPin className="h-7 w-7 text-gray-500" />
      </button>
      <p className="text-sm text-gray-500">Inget gym i närheten</p>
      {distance !== null && (
        <p className="text-xs text-gray-600">
          Närmaste gym: {formatDistance(distance)}
        </p>
      )}
    </div>
  );
};

export default CheckInButton;
