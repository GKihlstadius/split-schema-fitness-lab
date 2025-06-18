import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 ProtectedRoute: Kontrollerar autentisering');
        
        // Kontrollera om vi har en session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Fel vid hämtning av session:', error);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        if (data?.session) {
          console.log('✅ Session hittad för:', data.session.user.email);
          setIsAuthenticated(true);
        } else {
          console.log('⚠️ Ingen session hittad');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('💥 Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Lyssna på auth ändringar
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state ändrad:', event);
      
      if (session) {
        console.log('✅ Ny session:', session.user.email);
        setIsAuthenticated(true);
      } else {
        console.log('⚠️ Ingen session efter auth ändring');
        setIsAuthenticated(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Visa laddning medan vi kontrollerar autentisering
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Kontrollerar inloggning...</p>
        </div>
      </div>
    );
  }

  // Om användaren inte är autentiserad, omdirigera till login
  if (!isAuthenticated) {
    console.log('🔄 Omdirigerar till login från:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Om användaren är autentiserad, visa skyddad route
  return <>{children}</>;
}; 