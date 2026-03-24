import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, TrendingUp, User } from 'lucide-react';

const tabs = [
  { path: '/', icon: Home, label: 'Hem' },
  { path: '/workouts', icon: Dumbbell, label: 'Träning' },
  { path: '/progress', icon: TrendingUp, label: 'Framsteg' },
  { path: '/profile', icon: User, label: 'Profil' },
];

const HIDDEN_PATHS = ['/login', '/forgot-password', '/reset-password', '/onboarding'];
const HIDDEN_PREFIXES = ['/auth/'];

export function BottomNav() {
  const { pathname } = useLocation();

  const isHidden =
    HIDDEN_PATHS.includes(pathname) ||
    HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isHidden) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive =
            path === '/' ? pathname === '/' : pathname.startsWith(path);

          return (
            <Link
              key={path}
              to={path}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors duration-200 ${
                isActive ? 'text-[#3B82F6]' : 'text-gray-500'
              }`}
            >
              {/* Active indicator bar */}
              <span
                className={`absolute -top-2 h-0.5 w-6 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#3B82F6] opacity-100'
                    : 'bg-transparent opacity-0'
                }`}
              />

              <Icon
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
                size={22}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
              <span className="text-[10px] font-medium leading-tight">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
