import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dumbbell, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { updatePassword } from '@/utils/supabaseAuth';
import { supabase } from '@/lib/supabase';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isValidSession, setIsValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Kontrollera om användaren har en giltig session för lösenordsåterställning
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsValidSession(true);
        } else {
          // Kolla om vi har tokens i URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          if (hashParams.has('access_token')) {
            setIsValidSession(true);
          } else {
            setError('Sessionen har gått ut. Vänligen begär en ny återställningslänk.');
            setTimeout(() => {
              navigate('/forgot-password');
            }, 3000);
          }
        }
      } catch (error) {
        console.error('Fel vid kontroll av session:', error);
        setError('Ett fel uppstod. Vänligen försök igen.');
      }
    };

    checkSession();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password.trim()) {
      setError('Vänligen ange ett nytt lösenord');
      return;
    }

    if (formData.password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken långt');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔄 Uppdaterar lösenord');
      
      const result = await updatePassword(formData.password);
      
      if (result.success) {
        setSuccess('Ditt lösenord har uppdaterats! Du omdirigeras till inloggningssidan...');
        
        // Omdirigera till login efter 3 sekunder
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        console.error('❌ Update password fel:', result.error);
        setError(result.error || 'Ett fel uppstod vid uppdatering av lösenord');
      }
    } catch (error) {
      console.error('💥 Lösenordsuppdatering misslyckades:', error);
      setError(`Nätverksfel: ${error.message || 'Kontrollera din internetanslutning'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Rensa meddelanden när användaren börjar skriva
    if (error) setError('');
    if (success) setSuccess('');
  };

  if (!isValidSession && !error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Dumbbell className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifierar session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Sätt nytt lösenord
            </CardTitle>
            <CardDescription>
              Ange ditt nya lösenord
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 ml-2">{success}</AlertDescription>
              </Alert>
            )}

            {/* Lösenordsformulär */}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nytt lösenord</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minst 6 tecken"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Bekräfta nytt lösenord</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Upprepa lösenord"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pr-10"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Uppdaterar...' : 'Uppdatera lösenord'}
              </Button>
            </form>

            {/* Information */}
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <p className="font-medium mb-1">🔒 Säkerhetstips:</p>
              <p>Använd ett starkt lösenord med minst 6 tecken som innehåller både bokstäver och siffror.</p>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ResetPassword; 