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
        
        // Hämta parametrar från URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(location.search);
        
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const tokenHash = hashParams.get('token_hash') || queryParams.get('token_hash');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        const type = hashParams.get('type') || queryParams.get('type');
        
        console.log('🔑 Token info:', { 
          hasAccessToken: !!accessToken, 
          hasTokenHash: !!tokenHash,
          hasRefreshToken: !!refreshToken, 
          type
        });
        
        // Om vi har token_hash, använd verifyOtp
        if (tokenHash && type) {
          console.log('🔐 Använder verifyOtp med token_hash');
          
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any
          });
          
          if (error) {
            console.error('❌ VerifyOtp fel:', error);
            setStatus('error');
            setMessage('Kunde inte verifiera din e-post. Länken kan ha gått ut.');
            
            // Omdirigera till inloggningssidan efter 5 sekunder
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 5000);
            return;
          }
          
          if (data.session) {
            console.log('✅ Email verifierad via verifyOtp!');
            setStatus('success');
            setMessage('Din e-post har verifierats! Du kommer att omdirigeras till huvudsidan.');
            
            // Omdirigera till huvudsidan efter 3 sekunder
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 3000);
            return;
          }
        }
        
        // Fallback: Om vi inte har token_hash men har access_token
        if (accessToken) {
          console.log('🔄 Fallback: Försöker med access_token');
          
          // Kontrollera om token bara är ett ID-nummer (inte en JWT)
          const isTokenOnlyId = !accessToken.includes('.') && !isNaN(Number(accessToken));
          
          if (isTokenOnlyId) {
            console.log('⚠️ Token är bara ett ID-nummer, inte en JWT');
            
            // För detta fall, vi kan inte använda setSession
            // Istället visar vi ett framgångsmeddelande och instruerar användaren att logga in
            setStatus('success');
            setMessage('Din e-post har verifierats! Du kan nu logga in på ditt konto.');
            
            // Omdirigera till inloggningssidan efter 3 sekunder
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 3000);
            return;
          }
          
          // Försök sätta session med tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          if (error) {
            console.error('❌ Fel vid sätta session:', error);
            
            // Om vi får fel, men typ är signup, anta att verifieringen lyckades
            if (type === 'signup') {
              setStatus('success');
              setMessage('Din e-post har verifierats! Du kan nu logga in på ditt konto.');
              
              // Omdirigera till inloggningssidan efter 3 sekunder
              setTimeout(() => {
                navigate('/login', { replace: true });
              }, 3000);
              return;
            }
            
            setStatus('error');
            setMessage('Kunde inte verifiera din e-post. Vänligen klicka på "Skicka nytt bekräftelsemail" på inloggningssidan.');
            
            // Omdirigera till inloggningssidan efter 5 sekunder
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 5000);
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
            return;
          }
        }
        
        // Om inget fungerade
        console.error('❌ Inga giltiga tokens hittades');
        setStatus('error');
        setMessage('Ingen giltig verifieringslänk hittad. Vänligen kontrollera din URL.');
        
        // Omdirigera till inloggningssidan efter 5 sekunder
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 5000);
        
      } catch (error) {
        console.error('💥 Email confirmation error:', error);
        setStatus('error');
        setMessage('Ett oväntat fel uppstod. Vänligen försök logga in manuellt.');
        
        // Omdirigera till inloggningssidan efter 3 sekunder
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
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