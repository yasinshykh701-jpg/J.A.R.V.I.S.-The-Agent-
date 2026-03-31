import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithUsername } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      setLoading(false);
      return;
    }

    const { error } = await signInWithUsername(username, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F2F2F7] dark:bg-[#000000]">
      <div className="w-full max-w-md ios-card ios-shadow border-none p-8 fade-in">
        <div className="space-y-2 mb-8 text-center">
          <div className="w-16 h-16 bg-primary rounded-[20px] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg shadow-primary/20">
            Q
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground font-medium">Sign in to continue to Qazyen AI</p>
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
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="ios-input h-12 focus-visible:ring-primary/30"
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </Button>
          
          <div className="text-sm text-center text-muted-foreground pt-4 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
