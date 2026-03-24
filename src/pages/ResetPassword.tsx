import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dumbbell, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { updatePassword } from '@/utils/supabaseAuth';
import { supabase } from '@/lib/supabase';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [isValidSession, setIsValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsValidSession(true);
        } else {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          if (hashParams.has('access_token')) {
            setIsValidSession(true);
          } else {
            setError('Sessionen har gått ut. Du omdirigeras...');
            setTimeout(() => navigate('/forgot-password'), 3000);
          }
        }
      } catch {
        setError('Ett fel uppstod. Försök igen.');
      }
    };
    checkSession();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password.trim()) { setError('Ange ett nytt lösenord'); return; }
    if (formData.password.length < 6) { setError('Lösenordet måste vara minst 6 tecken'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Lösenorden matchar inte'); return; }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updatePassword(formData.password);
      if (result.success) {
        setSuccess('Lösenordet har uppdaterats! Du omdirigeras...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(result.error || 'Kunde inte uppdatera lösenordet');
      }
    } catch (err: any) {
      setError(`Nätverksfel: ${err.message || 'Kontrollera din internetanslutning'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  if (!isValidSession && !error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Verifierar session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sätt nytt lösenord</h1>
          <p className="text-sm text-muted-foreground mt-2">Ange ditt nya lösenord nedan</p>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-5">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-primary/20 bg-primary/10">
              <CheckCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-primary ml-2">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">Nytt lösenord</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minst 6 tecken"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pr-10 bg-muted border-border rounded-xl h-11"
                  disabled={isLoading}
                  required
                />
                <Button type="button" variant="ghost" size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">Bekräfta lösenord</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Upprepa lösenord"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pr-10 bg-muted border-border rounded-xl h-11"
                  disabled={isLoading}
                  required
                />
                <Button type="button" variant="ghost" size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium"
              size="lg"
            >
              {isLoading ? 'Uppdaterar...' : 'Uppdatera lösenord'}
            </Button>
          </form>

          <div className="text-sm text-muted-foreground bg-muted border border-border p-3 rounded-xl">
            <p>Använd minst 6 tecken med både bokstäver och siffror.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
