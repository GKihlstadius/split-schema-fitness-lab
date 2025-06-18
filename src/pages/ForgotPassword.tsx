import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dumbbell, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { resetPassword } from '@/utils/supabaseAuth';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Vänligen ange din e-postadress');
      return;
    }

    // Grundläggande e-post validering
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Vänligen ange en giltig e-postadress');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔄 Skickar lösenordsåterställning för:', email);
      
      const result = await resetPassword(email);
      
      if (result.success) {
        setSuccess('Vi har skickat instruktioner för lösenordsåterställning till din e-post. Kontrollera din inkorg (och skräppost).');
        setEmail(''); // Rensa formuläret
      } else {
        console.error('❌ Reset password fel:', result.error);
        setError(result.error || 'Ett fel uppstod vid skickandet av återställningsmail');
      }
    } catch (error) {
      console.error('💥 Lösenordsåterställning misslyckades:', error);
      setError(`Nätverksfel: ${error.message || 'Kontrollera din internetanslutning'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Rensa meddelanden när användaren börjar skriva
    if (error) setError('');
    if (success) setSuccess('');
  };

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
              Glömt lösenord?
            </CardTitle>
            <CardDescription>
              Ange din e-postadress så skickar vi instruktioner för att återställa ditt lösenord
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

            {/* Återställningsformulär */}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-postadress</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="din@email.com"
                    value={email}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Skickar...' : 'Skicka återställningslänk'}
              </Button>
            </form>

            {/* Information */}
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <p className="font-medium mb-1">📧 Vad händer nu?</p>
              <p>Du kommer att få ett e-mail med en länk för att återställa ditt lösenord. Länken är giltig i 1 timme.</p>
            </div>

            {/* Tillbaka till inloggning */}
            <div className="text-center">
              <Button
                asChild
                variant="link"
                disabled={isLoading}
                className="text-sm"
              >
                <Link to="/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tillbaka till inloggning
                </Link>
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ForgotPassword; 