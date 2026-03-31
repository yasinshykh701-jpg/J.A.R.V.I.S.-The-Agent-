import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithUsername } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const { error } = await signUpWithUsername(username, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Auto login after successful registration
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F2F2F7] dark:bg-[#000000]">
      <div className="w-full max-w-md ios-card ios-shadow border-none p-8 fade-in">
        <div className="space-y-2 mb-8 text-center">
          <div className="w-16 h-16 bg-primary rounded-[20px] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg shadow-primary/20">
            Q
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-muted-foreground font-medium">Join Qazyen AI today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="rounded-2xl border-none bg-destructive/10 text-destructive">
              <AlertDescription className="font-medium text-sm">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Pick a unique username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="ios-input h-12 focus-visible:ring-primary/30"
            />
            <p className="text-[10px] text-muted-foreground/60 ml-1 font-medium italic">
              *Letters, numbers, and underscores only
            </p>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="ios-input h-12 focus-visible:ring-primary/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="ios-input h-12 focus-visible:ring-primary/30"
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full ios-button h-12 text-lg mt-4 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
          </Button>
          
          <div className="text-sm text-center text-muted-foreground pt-4 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
