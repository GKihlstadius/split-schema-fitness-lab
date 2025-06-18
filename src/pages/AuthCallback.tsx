import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Behandlar inloggning...');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 AuthCallback: Börjar hantera auth callback');
        console.log('🔍 Current URL:', window.location.href);
        console.log('🔍 Current origin:', window.location.origin);
        
        // Kontrollera om vi har hash-baserade tokens (typiskt för email auth)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasHashTokens = hashParams.has('access_token');
        const isPasswordReset = hashParams.get('type') === 'recovery';
        
        console.log('🔑 Hash tokens detected:', hasHashTokens);
        console.log('🔓 Is password reset:', isPasswordReset);
        
        if (hasHashTokens) {
          console.log('🔑 Hittade tokens i URL hash, hanterar...');
          
          // Vänta lite för att Supabase ska hantera tokens
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Kontrollera session efter token hantering
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ Auth callback error från hash:', error);
            setStatus('error');
            setMessage('Inloggningen misslyckades. Försök igen.');
            
            setTimeout(() => {
              navigate('/login');
            }, 3000);
            return;
          }

          if (data.session) {
            console.log('✅ Session skapad från hash tokens');
            console.log('👤 User info:', {
              id: data.session.user.id,
              email: data.session.user.email,
              email_verified: data.session.user.email_confirmed_at
            });
            
            if (isPasswordReset) {
              console.log('🔑 Detta är en lösenordsåterställning, omdirigerar till reset password');
              setStatus('success');
              setMessage('Omdirigerar till lösenordsåterställning...');
              
              // Behåll hash för reset password sidan
              setTimeout(() => {
                navigate('/auth/reset-password' + window.location.hash, { replace: true });
              }, 1000);
            } else {
              setStatus('success');
              setMessage('Inloggning lyckades! Omdirigerar...');
              
              // Rensa URL hash och omdirigera
              window.history.replaceState({}, document.title, window.location.pathname);
              setTimeout(() => {
                navigate('/', { replace: true });
              }, 1500);
            }
            return;
          } else {
            console.log('❌ Ingen session skapades från hash tokens');
            // Försök med getUser istället
            const { data: userData, error: userError } = await supabase.auth.getUser();
            
            if (userData.user && !userError) {
              console.log('✅ Användare hittad via getUser:', userData.user.email);
              setStatus('success');
              setMessage('Inloggning lyckades! Omdirigerar...');
              
              window.history.replaceState({}, document.title, window.location.pathname);
              setTimeout(() => {
                navigate('/', { replace: true });
              }, 1500);
              return;
            }
          }
        }

        // Fallback: Kontrollera befintlig session
        console.log('🔍 Kontrollerar befintlig session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Auth callback error:', error);
          setStatus('error');
          setMessage('Inloggningen misslyckades. Försök igen.');
          
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        if (data.session) {
          console.log('✅ Befintlig session hittad');
          setStatus('success');
          setMessage('Inloggning lyckades! Omdirigerar...');
          
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        } else {
          console.log('❌ Ingen session hittades');
          setStatus('error');
          setMessage('Ingen aktiv session hittades. Försöker automatisk inloggning...');
          
          // En sista försök med en kort fördröjning
          setTimeout(async () => {
            const { data: retryData } = await supabase.auth.getSession();
            if (retryData.session) {
              console.log('✅ Session hittad efter retry');
              setStatus('success');
              setMessage('Inloggning lyckades! Omdirigerar...');
              setTimeout(() => {
                navigate('/', { replace: true });
              }, 1000);
            } else {
              console.log('❌ Inga sessions efter retry, omdirigerar till login');
              setTimeout(() => {
                navigate('/login');
              }, 2000);
            }
          }, 2000);
        }
      } catch (error) {
        console.error('💥 Unexpected error during auth callback:', error);
        setStatus('error');
        setMessage('Ett oväntat fel uppstod.');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          {getIcon()}
        </div>
        <h1 className="text-2xl font-bold">Autentisering pågår</h1>
        <p className={`text-lg ${getStatusColor()}`}>
          {message}
        </p>
        {status === 'loading' && (
          <p className="text-sm text-muted-foreground">
            Detta kan ta några sekunder...
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm text-muted-foreground">
            Du omdirigeras automatiskt till inloggningssidan
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback; 