import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DirectAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Om vi kommer hit med tokens i hashen, omdirigera till AuthCallback
    if (window.location.hash.includes('access_token')) {
      console.log('🔄 DirectAuth: Omdirigerar till AuthCallback med tokens');
      navigate('/auth/callback' + window.location.hash, { replace: true });
    } else {
      // Ingen tokens, gå till login
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Omdirigerar...</p>
      </div>
    </div>
  );
};

export default DirectAuth; 