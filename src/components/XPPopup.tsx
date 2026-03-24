import React, { useEffect } from 'react';

interface XPPopupProps {
  amount: number;
  description: string;
  onComplete: () => void;
}

const XPPopup: React.FC<XPPopupProps> = ({ amount, description, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed left-1/2 top-8 z-50 -translate-x-1/2 pointer-events-none"
      style={{ animation: 'xpPopupSlideUp 2s ease-out forwards' }}
    >
      <div className="flex flex-col items-center rounded-2xl bg-card border border-border px-6 py-3 shadow-lg">
        <span className="text-2xl font-bold text-primary">+{amount} XP</span>
        <span className="mt-0.5 text-xs text-muted-foreground">{description}</span>
      </div>

      <style>{`
        @keyframes xpPopupSlideUp {
          0% { opacity: 1; transform: translateX(-50%) translateY(0); }
          70% { opacity: 1; transform: translateX(-50%) translateY(-30px); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-50px); }
        }
      `}</style>
    </div>
  );
};

export default XPPopup;
