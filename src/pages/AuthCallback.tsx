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
        
        // Kontrollera om vi har hash-baserade tokens (typiskt för email auth)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasHashTokens = hashParams.has('access_token');
        
        if (hasHashTokens) {
          console.log('🔑 Hittade tokens i URL hash, hanterar...');
          // Supabase kommer automatiskt att hantera hash-baserade tokens
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
            setStatus('success');
            setMessage('Registrering lyckades! Omdirigerar...');
            
            // Rensa URL hash och omdirigera
            window.history.replaceState({}, document.title, window.location.pathname);
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 1500);
            return;
          }
        }

        // Fallback: Kontrollera befintlig session
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
          setMessage('Ingen aktiv session hittades.');
          
          setTimeout(() => {
            navigate('/login');
          }, 3000);
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