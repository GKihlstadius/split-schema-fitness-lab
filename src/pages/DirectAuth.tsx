import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Denna komponent hanterar direkta autentiseringslänkar som kommer från Supabase
// t.ex. magiska länkar eller lösenordsåterställning
const DirectAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('Bearbetar autentisering...');

  useEffect(() => {
    const handleDirectAuth = async () => {
      try {
        // Kontrollera om vi är på en auth-relaterad sida med tokens
        const isAuthCallback = location.pathname.includes('/auth/callback');
        const isResetPassword = location.pathname.includes('/reset-password');

        // Extrahera tokens från både hash och query parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(location.search);

        // Hämta tokens från antingen hash eller query
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        const type = hashParams.get('type') || queryParams.get('type');

        if (accessToken) {
          // Om vi har tokens, skicka till auth callback
          const callbackUrl = '/auth/callback#access_token=' + accessToken +
                             (refreshToken ? '&refresh_token=' + refreshToken : '') +
                             (type ? '&type=' + type : '');

          navigate(callbackUrl, { replace: true });
        } else if (isAuthCallback || isResetPassword) {
          // Om vi är på en auth-relaterad sida utan tokens, försök igen med tokens från URL
          const urlParams = new URLSearchParams(window.location.search);
          const token = urlParams.get('token') || urlParams.get('access_token');

          if (token) {
            // Konvertera till hash format och skicka till auth callback
            navigate('/auth/callback#access_token=' + token, { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Unexpected error in DirectAuth:', error);
        setMessage('Ett fel uppstod. Omdirigerar...');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    handleDirectAuth();
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

export default DirectAuth; 