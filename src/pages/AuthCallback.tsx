import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('Bearbetar autentisering...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 AuthCallback: Hanterar inloggning');
        console.log('📍 URL:', window.location.href);
        
        // Extrahera tokens från både hash och query parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(location.search);

        // Kontrollera om detta är en email bekräftelse
        const isEmailConfirmation = location.hash.includes('type=signup') || 
                                   location.search.includes('type=signup');

        console.log('📊 Auth params:', { 
          hash: Object.fromEntries(hashParams.entries()),
          query: Object.fromEntries(queryParams.entries()),
          isEmailConfirmation
        });

        // Hämta tokens från antingen hash eller query
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        const type = hashParams.get('type') || queryParams.get('type');
        
        // Om detta är en email bekräftelse, skicka till EmailConfirmation
        if (isEmailConfirmation) {
          console.log('📧 Detta är en email bekräftelse, omdirigerar till EmailConfirmation');
          
          // Skapa en URL med tokens för EmailConfirmation
          const redirectUrl = `/email-confirmation${location.search}${location.hash}`;
          navigate(redirectUrl, { replace: true });
          return;
        }

        // Om detta är en lösenordsåterställning, skicka till ResetPassword
        if (type === 'recovery') {
          console.log('🔑 Detta är en lösenordsåterställning');
          navigate('/auth/reset-password', { 
            replace: true,
            state: { accessToken, refreshToken }
          });
          return;
        }

        // Kontrollera om token bara är ett ID-nummer (inte en JWT)
        const isTokenOnlyId = accessToken && !accessToken.includes('.') && !isNaN(Number(accessToken));
        
        if (isTokenOnlyId) {
          console.log('⚠️ Token är bara ett ID-nummer, inte en JWT');
          
          // För detta fall, vi kan inte använda setSession
          // Istället omdirigerar vi till login
          setMessage('Autentisering slutförd. Omdirigerar till inloggning...');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
          return;
        }

        // För alla andra fall, försök sätta session
        if (accessToken) {
          console.log('🔑 Tokens hittade, försöker sätta session');
          
          // Försök sätta session med tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (error) {
            console.error('❌ Fel vid sätta session:', error);
            setMessage('Autentisering misslyckades. Omdirigerar...');
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 2000);
            return;
          }

          if (data.session) {
            console.log('✅ Session skapad, omdirigerar till startsidan');
            navigate('/', { replace: true });
            return;
          }
        }

        // Om vi inte har tokens eller session, försök hämta session
        console.log('⚠️ Inga tokens eller ingen session, försöker getSession');
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Fel vid hämtning av session:', error);
          navigate('/login', { replace: true });
          return;
        }
        
        if (data?.session) {
          console.log('✅ Session hittad, omdirigerar till startsidan');
          navigate('/', { replace: true });
        } else {
          console.log('⚠️ Ingen session hittad, omdirigerar till login');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('💥 Oväntat fel i AuthCallback:', error);
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback; 