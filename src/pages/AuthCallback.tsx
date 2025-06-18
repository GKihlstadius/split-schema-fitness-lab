import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [message, setMessage] = useState('Loggar in...');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 AuthCallback: Hanterar inloggning');
        
        // Kontrollera om vi har tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasHashTokens = hashParams.has('access_token');
        const isPasswordReset = hashParams.get('type') === 'recovery';
        
        if (hasHashTokens) {
          // Vänta lite för att Supabase ska hantera tokens
          await new Promise(resolve => setTimeout(resolve, 1000));
        
          if (isPasswordReset) {
            // Lösenordsåterställning - gå till reset password
            navigate('/auth/reset-password' + window.location.hash, { replace: true });
            return;
          }
          
          // Kontrollera session
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            console.log('✅ Inloggning lyckades');
            setMessage('Klar! Omdirigerar...');
          
            // Rensa URL och gå till huvudsidan
            window.history.replaceState({}, document.title, window.location.pathname);
          setTimeout(() => {
              navigate('/', { replace: true });
            }, 500);
          return;
          }
        }

        // Fallback: kolla befintlig session
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          console.log('✅ Session hittad');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 500);
        } else {
          console.log('⚠️ Ingen session, retry om 2 sekunder');
          // En till försök efter kort delay
          setTimeout(async () => {
            const { data: retryData } = await supabase.auth.getSession();
            if (retryData.session) {
              navigate('/', { replace: true });
            } else {
              // Om ingen session efter retry, gå bara till huvudsidan ändå
              // (ProtectedRoute kommer hantera omdirigering till login)
              navigate('/', { replace: true });
            }
          }, 2000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        // Vid fel, gå bara till huvudsidan (ProtectedRoute hanterar resten)
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <h1 className="text-xl font-medium">Gym Janne</h1>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback; 