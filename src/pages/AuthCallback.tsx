import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [message, setMessage] = useState('Loggar in...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 AuthCallback: Hanterar inloggning');
        console.log('📍 URL:', window.location.href);
        
        // Kontrollera om vi har tokens i olika format
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(location.search);
        
        // Hämta tokens från olika källor
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        const type = hashParams.get('type') || queryParams.get('type');
        
        console.log('🔑 Tokens hittade:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken, 
          type 
        });
        
        // Om vi har access token, försök att sätta den manuellt
        if (accessToken) {
          console.log('🔒 Försöker sätta session manuellt med token');
          
          try {
            // För email bekräftelse, försök sätta session direkt
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (sessionError) {
              console.error('❌ Fel vid sätta session:', sessionError);
            } else if (sessionData.session) {
              console.log('✅ Session satt manuellt!');
            }
          } catch (tokenError) {
            console.error('❌ Token error:', tokenError);
          }
          
          // Vänta lite för att Supabase ska hantera tokens
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        // Kontrollera om det är lösenordsåterställning
        const isPasswordReset = type === 'recovery';
        if (isPasswordReset && accessToken) {
          // Lösenordsåterställning - gå till reset password
          console.log('🔑 Detta är en lösenordsåterställning');
          navigate('/auth/reset-password#access_token=' + accessToken + 
                  (refreshToken ? '&refresh_token=' + refreshToken : '') + 
                  '&type=recovery', 
                  { replace: true });
          return;
        }
        
        // Kontrollera session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log('✅ Session hittad:', data.session.user.email);
          setMessage('Inloggad! Omdirigerar...');
          
          // Rensa URL och gå till huvudsidan
          window.history.replaceState({}, document.title, '/');
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 800);
          return;
        } else {
          console.log('⚠️ Ingen session efter första försök, väntar...');
          
          // Vänta lite till och försök igen
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: retryData } = await supabase.auth.getSession();
          if (retryData.session) {
            console.log('✅ Session hittad efter väntan!');
            setMessage('Inloggad! Omdirigerar...');
            window.history.replaceState({}, document.title, '/');
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 500);
            return;
          }
          
          console.log('❌ Fortfarande ingen session, försöker med getUser');
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData.user) {
            console.log('✅ Användare hittad via getUser!');
            setMessage('Konto verifierat! Omdirigerar...');
            window.history.replaceState({}, document.title, '/');
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 500);
            return;
          }
          
          // Sista försök - gå till huvudsidan och låt ProtectedRoute hantera det
          console.log('⚠️ Inga fler försök, går till huvudsidan');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('💥 Auth callback error:', error);
        // Vid fel, gå bara till huvudsidan (ProtectedRoute hanterar resten)
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

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