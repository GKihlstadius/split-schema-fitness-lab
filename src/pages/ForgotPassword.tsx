import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Vänligen ange en giltig e-postadress');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await resetPassword(email);

      if (result.success) {
        setSuccess('Instruktioner har skickats till din e-post. Kontrollera din inkorg och skräppost.');
        setEmail('');
      } else {
        setError(result.error || 'Ett fel uppstod');
      }
    } catch (err: any) {
      setError(`Nätverksfel: ${err.message || 'Kontrollera din internetanslutning'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Glömt lösenord?</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Ange din e-post så skickar vi en återställningslänk
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-5">
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-emerald-500/20 bg-emerald-500/10">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <AlertDescription className="text-emerald-300 ml-2">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">E-postadress</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="din@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                    if (success) setSuccess('');
                  }}
                  className="pl-10 bg-white/5 border-white/10 rounded-xl h-11"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium"
              size="lg"
            >
              {isLoading ? 'Skickar...' : 'Skicka återställningslänk'}
            </Button>
          </form>

          <div className="text-sm text-muted-foreground bg-white/5 border border-white/10 p-3 rounded-xl">
            <p>Du får ett e-mail med en länk som är giltig i 1 timme.</p>
          </div>

          <div className="text-center pt-2 border-t border-white/10">
            <Button asChild variant="link" className="text-sm text-blue-400 hover:text-blue-300">
              <Link to="/login">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Tillbaka till inloggning
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
