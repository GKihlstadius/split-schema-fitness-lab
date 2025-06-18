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
        const isEmailConfirmation = hashParams.get('type') === 'signup' || window.location.href.includes('type=signup');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        console.log('🔍 Auth callback tokens:', {
          hasHashTokens,
          isPasswordReset,
          isEmailConfirmation,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken
        });
        
        if (hasHashTokens) {
          if (isPasswordReset) {
            // Lösenordsåterställning - gå till reset password
            navigate('/auth/reset-password' + window.location.hash, { replace: true });
            return;
          }
          
          // ENKEL LÖSNING: Använd bara setSession för alla tokens
          setMessage('Bekräftar inloggning...');
          
          try {
            console.log('🔄 Setting session with tokens');
            
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (error) {
              console.error('❌ Session error:', error);
              setMessage('Inloggning misslyckades. Försök igen.');
              setTimeout(() => navigate('/login'), 3000);
              return;
            }
            
            console.log('✅ Session satt framgångsrikt:', data.session?.user?.email);
            setMessage('Klar! Omdirigerar...');
            
          } catch (sessionError) {
            console.error('❌ Session error:', sessionError);
            setMessage('Inloggning misslyckades. Försök igen.');
            setTimeout(() => navigate('/login'), 3000);
            return;
          }
          
          // Kontrollera slutlig session
          const { data: sessionData } = await supabase.auth.getSession();
          
          if (sessionData.session) {
            console.log('✅ Session bekräftad, användare inloggad');
            
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