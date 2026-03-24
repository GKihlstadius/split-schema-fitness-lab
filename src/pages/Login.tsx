import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dumbbell, Mail, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { signInWithEmail, signUpWithEmail } from '@/utils/supabaseAuth';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromQuery = queryParams.get('email');
    if (emailFromQuery) {
      setFormData(prev => ({ ...prev, email: emailFromQuery }));
    }
  }, [location]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

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

    try {
      if (isRegistering) {
        const result = await signUpWithEmail(formData.email, formData.password);
        if (result.success) {
          setSuccess('Konto skapat! Du kan nu logga in.');
          setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
          setIsRegistering(false);
        } else {
          if (result.error?.includes('already registered')) {
            setError('Det finns redan ett konto med denna e-postadress.');
          } else {
            setError(result.error || 'Ett fel uppstod vid registrering');
          }
        }
      } else {
        const result = await signInWithEmail(formData.email, formData.password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error || 'Felaktigt e-post eller lösenord');
        }
      }
    } catch (error: any) {
      setError(`Nätverksfel: ${error.message || 'Kontrollera din internetanslutning'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSuccess('');
    setFormData({ email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">GymQuest</h1>
          <p className="text-sm text-muted-foreground mt-1">Nivå upp din träning</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
          <div className="text-center mb-2">
            <h2 className="text-xl font-semibold text-foreground">
              {isRegistering ? 'Skapa konto' : 'Logga in'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isRegistering ? 'Skapa ditt konto och börja träna' : 'Välkommen tillbaka'}
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle className="h-4 w-4 text-emerald-700" />
              <AlertDescription className="text-emerald-700 ml-2">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">E-postadress</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="din@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-emerald-300 rounded-xl h-11"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">Lösenord</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minst 6 tecken"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pr-10 bg-gray-50 border-gray-200 focus:border-emerald-300 rounded-xl h-11"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">Bekräfta lösenord</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Upprepa lösenord"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-gray-50 border-gray-200 focus:border-emerald-300 rounded-xl h-11"
                  disabled={isLoading}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium"
              size="lg"
            >
              {isLoading ? 'Bearbetar...' : (isRegistering ? 'Skapa konto' : 'Logga in')}
            </Button>
          </form>

          {!isRegistering && (
            <div className="text-center">
              <Button asChild variant="link" className="text-sm text-muted-foreground hover:text-emerald-600">
                <Link to="/forgot-password">Glömt lösenord?</Link>
              </Button>
            </div>
          )}

          <div className="text-center pt-2 border-t border-gray-100">
            <Button
              type="button"
              variant="link"
              onClick={toggleAuthMode}
              disabled={isLoading}
              className="text-sm text-emerald-600 hover:text-emerald-500"
            >
              {isRegistering
                ? 'Har du redan ett konto? Logga in'
                : 'Har du inget konto? Skapa ett nu'
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
