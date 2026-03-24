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
        // Extrahera tokens från både hash och query parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(location.search);

        // Hämta tokens från antingen hash eller query
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        const type = hashParams.get('type') || queryParams.get('type');

        // Om detta är en lösenordsåterställning, skicka till ResetPassword
        if (type === 'recovery') {
          navigate('/auth/reset-password', {
            replace: true,
            state: { accessToken, refreshToken }
          });
          return;
        }

        // Kontrollera om token bara är ett ID-nummer (inte en JWT)
        const isTokenOnlyId = accessToken && !accessToken.includes('.') && !isNaN(Number(accessToken));

        if (isTokenOnlyId) {
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
          // Försök sätta session med tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (error) {
            setMessage('Autentisering misslyckades. Omdirigerar...');
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 2000);
            return;
          }

          if (data.session) {
            navigate('/', { replace: true });
            return;
          }
        }

        // Om vi inte har tokens eller session, försök hämta session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          navigate('/login', { replace: true });
          return;
        }

        if (data?.session) {
          navigate('/', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Unexpected error in AuthCallback:', error);
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