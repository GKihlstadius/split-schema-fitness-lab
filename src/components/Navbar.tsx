import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Utensils, LogOut, User as UserIcon, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, signOut, onAuthStateChange } from '@/utils/supabaseAuth';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Navbar = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Uppdatera användarstatus när sidan laddas eller auth ändras
  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await getCurrentUser();
        setCurrentUser(result.success ? result.user : null);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Lyssna på auth state changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setCurrentUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        setCurrentUser(null);
        navigate('/login');
      } else {
        console.error('Error signing out:', result.error);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Visa inte navbar på login-sidan eller auth callback
  if (location.pathname === '/login' || location.pathname === '/auth/callback') {
    return null;
  }

  // Visa loading state
  if (loading) {
    return (
      <nav>
        <div className="container flex h-16 items-center px-4">
        </div>
      </nav>
    );
  }

  return (
    <nav>
      <div className="container flex h-16 items-center px-4">
        <div className="ml-auto flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Activity className="h-4 w-4" />
            <span>Träning</span>
          </Link>
          <Link to="/nutrition" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Utensils className="h-4 w-4" />
            <span>Kost</span>
          </Link>
          
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium">
                      {currentUser.user_metadata?.full_name || 'Användare'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {currentUser.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <UserIcon className="h-4 w-4" />
                    <span>Min profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logga ut</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}; 