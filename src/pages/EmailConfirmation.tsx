import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmailConfirmation = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifierar din e-postadress...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        console.log('🔍 EmailConfirmation: Hanterar URL:', window.location.href);
        
        // Hämta token från URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(location.search);
        
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        const type = hashParams.get('type') || queryParams.get('type');
        
        console.log('🔑 Token info:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken, 
          type 
        });
        
        if (!accessToken) {
          console.error('❌ Ingen access token hittad i URL');
          setStatus('error');
          setMessage('Ingen verifieringslänk hittad. Vänligen kontrollera din URL.');
          return;
        }
        
        // Enkel metod: Försök sätta session med tokens
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        });
        
        if (error) {
          console.error('❌ Fel vid sätta session:', error);
          setStatus('error');
          setMessage('Kunde inte verifiera din e-post. Länken kan ha gått ut.');
          return;
        }
        
        if (data.session) {
          console.log('✅ Session skapad, email verifierad!');
          setStatus('success');
          setMessage('Din e-post har verifierats! Du kommer att omdirigeras till huvudsidan.');
          
          // Omdirigera till huvudsidan efter 3 sekunder
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        } else {
          console.log('⚠️ Ingen session efter setSession');
          setStatus('error');
          setMessage('Något gick fel vid verifiering. Vänligen försök logga in manuellt.');
        }
      } catch (error) {
        console.error('💥 Email confirmation error:', error);
        setStatus('error');
        setMessage('Ett oväntat fel uppstod. Vänligen försök logga in manuellt.');
      }
    };

    handleConfirmation();
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            {status === 'loading' && (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            )}
            {status === 'success' && (
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="h-10 w-10 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {status === 'loading' && 'Verifierar e-post'}
              {status === 'success' && 'E-post verifierad!'}
              {status === 'error' && 'Verifiering misslyckades'}
            </h1>
            
            <p className="text-muted-foreground">
              {message}
            </p>
          </div>
          
          {status === 'error' && (
            <Button 
              onClick={() => navigate('/login')}
              className="mt-4"
            >
              Gå till inloggning
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation; 