import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Cpu, Lock, User } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020810] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000510] via-[#020c1a] to-[#000510]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00c8ff] opacity-[0.04] blur-[100px]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,255,0.015) 2px, rgba(0,200,255,0.015) 4px)',
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md fade-in">
        <div className="relative p-8 rounded-2xl border border-[#00c8ff20] bg-[#00050f] overflow-hidden">
          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#00c8ff50] rounded-tl" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#00c8ff50] rounded-tr" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#00c8ff50] rounded-bl" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#00c8ff50] rounded-br" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00c8ff] to-[#0050a0] flex items-center justify-center arc-glow">
                <Cpu className="w-7 h-7 text-white" />
              </div>
              <div className="absolute inset-[-4px] rounded-full border border-dashed border-[#00c8ff50] animate-hud-spin" />
            </div>
            <h1 className="text-2xl font-black tracking-[0.2em] uppercase jarvis-gradient-text mb-1">
              J.A.R.V.I.S
            </h1>
            <p className="text-[9px] tracking-[0.35em] text-[#00c8ff60] uppercase">
              Authentication Required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert className="rounded-lg border border-red-800/50 bg-red-950/20 text-red-400">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#00c8ff70] flex items-center gap-1.5"
              >
                <User className="w-3 h-3" />
                Agent ID
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter agent username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="h-11 ios-input text-white/90 placeholder:text-white/25 focus-visible:ring-[#00c8ff50] focus-visible:ring-1"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#00c8ff70] flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3" />
                  Access Code
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-[9px] font-semibold tracking-widest uppercase text-[#00c8ff70] hover:text-[#00c8ff] transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter access code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-11 ios-input text-white/90 placeholder:text-white/25 focus-visible:ring-[#00c8ff50] focus-visible:ring-1"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 rounded-lg bg-gradient-to-r from-[#00c8ff] to-[#0080ff] text-black font-bold tracking-[0.2em] uppercase text-sm arc-glow-sm hover:from-[#00d4ff] hover:to-[#0090ff] transition-all"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Initialize Session'
              )}
            </Button>

            <p className="text-xs text-center text-[#00c8ff50] pt-2 tracking-widest">
              No account?{' '}
              <Link
                to="/register"
                className="text-[#00c8ff] font-bold hover:text-[#00d4ff] transition-colors"
              >
                Register Agent
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
