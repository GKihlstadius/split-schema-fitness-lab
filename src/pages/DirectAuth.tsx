import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const DirectAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('🔍 DirectAuth: Hanterar URL:', window.location.href);
    
    // Kontrollera om vi är på en auth-relaterad sida med tokens
    const isAuthCallback = location.pathname.includes('/auth/callback');
    const isResetPassword = location.pathname.includes('/reset-password');
    
    // Kontrollera tokens i olika format
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(location.search);
    
    // Hämta tokens från olika källor
    const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
    const type = hashParams.get('type') || queryParams.get('type');
    
    // Supabase email template format
    const hasEmailToken = location.pathname.includes('/auth/callback#access_token=') || 
                         location.search.includes('access_token=');
    
    console.log('🔑 Token info:', { 
      hasAccessToken: !!accessToken, 
      hasRefreshToken: !!refreshToken, 
      type,
      hasEmailToken,
      pathname: location.pathname
    });
    
    if (accessToken) {
      // Om vi har tokens, skicka till auth callback
      console.log('🔑 DirectAuth: Hittade tokens, omdirigerar till AuthCallback');
      
      // Bygg callback URL med tokens
      const callbackUrl = '/auth/callback#access_token=' + accessToken +
                         (refreshToken ? '&refresh_token=' + refreshToken : '') +
                         (type ? '&type=' + type : '');
                         
      navigate(callbackUrl, { replace: true });
    } else if (hasEmailToken) {
      // Om vi har email token format, skicka till auth callback
      console.log('🔑 DirectAuth: Hittade email token format, omdirigerar');
      navigate('/auth/callback' + location.hash + location.search, { replace: true });
    } else if (isAuthCallback || isResetPassword) {
      // Om vi är på en auth-relaterad sida utan tokens, försök igen med tokens från URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || urlParams.get('access_token');
      
      if (token) {
        console.log('🔑 DirectAuth: Hittade token i URL params');
        // Konvertera till hash format och skicka till auth callback
        navigate('/auth/callback#access_token=' + token, { replace: true });
      } else {
        // Ingen token, gå till login
        console.log('❌ DirectAuth: Inga tokens hittades, går till login');
        navigate('/login', { replace: true });
      }
    } else {
      // Ingen auth-relaterad sida, gå till login
      console.log('🔄 DirectAuth: Ingen auth-sida, går till login');
      navigate('/login', { replace: true });
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Omdirigerar...</p>
      </div>
    </div>
  );
};

export default DirectAuth; 