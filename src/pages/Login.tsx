import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dumbbell, Mail, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, resendConfirmationEmail } from '@/utils/supabaseAuth';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kontrollera om vi kom från ProtectedRoute med needsEmailConfirmation
    if (location.state?.needsEmailConfirmation) {
      setNeedsEmailConfirmation(true);
      setError('Din e-postadress är inte bekräftad. Vänligen kontrollera din e-post eller skicka ett nytt bekräftelsemail.');
    }
    
    // Kontrollera om vi har email i URL:en (från EmailConfirmation)
    const queryParams = new URLSearchParams(location.search);
    const emailFromQuery = queryParams.get('email');
    if (emailFromQuery) {
      setFormData(prev => ({ ...prev, email: emailFromQuery }));
    }
  }, [location]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validera formuläret
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Vänligen fyll i alla fält');
      return;
    }

    if (isRegistering && formData.password !== formData.confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    setNeedsEmailConfirmation(false);

    try {
      console.log('🔍 Försöker autentisera:', { isRegistering, email: formData.email });
      
      if (isRegistering) {
        const result = await signUpWithEmail(formData.email, formData.password);
        console.log('📧 Registreringsresultat:', result);
        
        if (result.success) {
          setSuccess('Konto skapat! Kontrollera din e-post för att verifiera ditt konto innan du kan logga in.');
          setNeedsEmailConfirmation(true);
          // Rensa lösenordsfälten
          setFormData(prev => ({ 
            ...prev, 
            password: '', 
            confirmPassword: '' 
          }));
          // Växla till inloggning
          setIsRegistering(false);
        } else {
          console.error('❌ Registreringsfel:', result.error);
          
          // Kontrollera om felet är att användaren redan finns
          if (result.error.includes('already registered')) {
            setError('Det finns redan ett konto med denna e-postadress. Försök logga in istället.');
            setNeedsEmailConfirmation(true);
          } else {
            setError(result.error || 'Ett fel uppstod vid registrering');
          }
        }
      } else {
        const result = await signInWithEmail(formData.email, formData.password);
        console.log('🔑 Inloggningsresultat:', result);
        
        if (result.success) {
          navigate('/');
        } else {
          console.error('❌ Inloggningsfel:', result.error);
          
          // Kontrollera om emailen behöver bekräftas
          if (result.needsEmailConfirmation || result.error.includes('not confirmed')) {
            setNeedsEmailConfirmation(true);
            setError('E-postadressen är inte bekräftad. Vänligen kontrollera din e-post för bekräftelselänk eller skicka ett nytt bekräftelsemail.');
          } else {
            setError(result.error || 'Felaktigt e-post eller lösenord');
          }
        }
      }
    } catch (error) {
      console.error('💥 E-post autentisering misslyckades:', error);
      setError(`Nätverksfel: ${error.message || 'Kontrollera din internetanslutning'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!formData.email) {
      setError('Vänligen ange din e-postadress först');
      return;
    }
    
    setIsResending(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await resendConfirmationEmail(formData.email);
      
      if (result.success) {
        setSuccess('Ett nytt bekräftelsemail har skickats till din e-postadress. Kontrollera din inkorg (och skräppost).');
      } else {
        setError(result.error || 'Kunde inte skicka bekräftelsemail. Försök igen senare.');
      }
    } catch (error) {
      console.error('💥 Resend confirmation error:', error);
      setError(`Nätverksfel: ${error.message || 'Kontrollera din internetanslutning'}`);
    } finally {
      setIsResending(false);
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

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSuccess('');
    setNeedsEmailConfirmation(false);
    setFormData({ email: '', password: '', confirmPassword: '' });
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
              {isRegistering ? 'Skapa konto' : 'Logga in'}
            </CardTitle>
            <CardDescription>
              {isRegistering ? 'Skapa ett nytt konto för att komma igång' : 'Logga in på ditt befintliga konto'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="ml-2">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 ml-2">{success}</AlertDescription>
              </Alert>
            )}

            {/* E-post formulär */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-postadress</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="din@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Lösenord</Label>
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

              {isRegistering && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Upprepa lösenord"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              )}

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Bearbetar...' : (isRegistering ? 'Skapa konto' : 'Logga in')}
              </Button>
            </form>

            {/* Skicka nytt bekräftelsemail knapp */}
            {needsEmailConfirmation && (
              <div className="mt-4">
                <Button 
                  onClick={handleResendConfirmation}
                  variant="outline"
                  className="w-full"
                  disabled={isResending}
                >
                  {isResending ? 'Skickar...' : 'Skicka nytt bekräftelsemail'}
                </Button>
              </div>
            )}

            {/* Glömt lösenord länk - visas bara för inloggning */}
            {!isRegistering && (
              <div className="text-center">
                <Button
                  asChild
                  variant="link"
                  className="text-sm text-muted-foreground"
                  disabled={isLoading}
                >
                  <Link to="/forgot-password">
                    Glömt lösenord?
                  </Link>
                </Button>
              </div>
            )}

            {/* Information för nya användare */}
            {isRegistering && (
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                <p className="font-medium mb-1">📧 Viktigt att veta:</p>
                <p>Efter registrering får du ett verifieringsmail. Klicka på länken i mailet för att aktivera ditt konto innan du kan logga in.</p>
              </div>
            )}

            {/* Växla mellan inloggning och registrering */}
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={toggleAuthMode}
                disabled={isLoading}
                className="text-sm"
              >
                {isRegistering 
                  ? 'Har du redan ett konto? Logga in' 
                  : 'Har du inget konto? Skapa ett nu'
                }
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Login; 