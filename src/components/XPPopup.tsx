import React, { useEffect, useState } from 'react';

interface XPPopupProps {
  amount: number;
  description: string;
  onComplete: () => void;
}

const XPPopup: React.FC<XPPopupProps> = ({ amount, description, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 50);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed left-1/2 top-8 z-50 -translate-x-1/2 pointer-events-none"
      style={{
        animation: 'xpPopupSlideUp 2s ease-out forwards',
      }}
    >
      <div className="flex flex-col items-center rounded-xl bg-gray-900/90 px-6 py-3 shadow-2xl backdrop-blur-sm">
        <span className="text-3xl font-extrabold text-green-400">
          +{amount} XP
        </span>
        <span className="mt-1 text-sm text-gray-300">{description}</span>
      </div>

      <style>{`
        @keyframes xpPopupSlideUp {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          70% {
            opacity: 1;
            transform: translateX(-50%) translateY(-40px);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-60px);
          }
        }
      `}</style>
    </div>
  );
};

export default XPPopup;
