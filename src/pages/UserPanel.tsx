import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, User, Mail, Calendar, Shield, CheckCircle, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function UserPanel() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#020810] bg-[#020810] p-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between ios-blur p-6 rounded-[32px] ios-shadow border border-border/40">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Account</h1>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Personal Identity Hub</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/')} className="ios-button rounded-full border-border/50">
            <ArrowLeft className="h-4 w-4 mr-2" /> Exit
          </Button>
        </div>

        <div className="grid gap-8">
          <div className="ios-card p-8 border-none ios-shadow bg-[#0a0f1a] rounded-[40px]">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <Avatar className="h-32 w-32 rounded-[40px] shadow-2xl">
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-blue-600 text-white font-bold">
                    {profile?.username?.[0]?.toUpperCase() || 'Q'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-success rounded-full border-4 border-white dark:border-[#1C1C1E] flex items-center justify-center text-white">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Full Identity</p>
                    <p className="text-2xl font-bold tracking-tight">{profile?.username}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Contact Node</p>
                    <p className="text-xl font-bold tracking-tight truncate">{profile?.email || 'unlinked_account'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Access Level</p>
                    <div className="flex justify-center md:justify-start">
                      <Badge className={`rounded-full px-4 py-1 border-none text-[10px] font-bold uppercase tracking-widest ${
                        profile?.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {profile?.role} MEMBER
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Activation Date</p>
                    <p className="text-lg font-bold tracking-tight">
                      {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="ios-card p-8 border-none bg-[#0a0f1a] rounded-[40px]">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                <Lock className="w-4 h-4" /> Control Center
              </h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full ios-button h-14 text-base border-border/50 hover:bg-muted/50 rounded-2xl" onClick={() => toast.info('Password reset link sent')}>
                  Update Credentials
                </Button>
                <Button variant="ghost" className="w-full ios-button h-14 text-base text-destructive hover:bg-destructive/10 rounded-2xl font-bold" onClick={handleSignOut}>
                  Sign Out Session
                </Button>
              </div>
            </div>

            <div className="ios-card p-8 border-none bg-primary/10 rounded-[40px] relative overflow-hidden group">
              <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-primary/5 group-hover:scale-150 transition-transform duration-1000" />
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-primary">
                JARVIS AI Intelligence
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'AI Conversations',
                  'Visual Studio',
                  'Film Generation',
                  'Resume Analysis',
                  'Interview Prep',
                  'Smart Summary'
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-primary/80">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    {f}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-primary/60 mt-8 font-bold italic tracking-wider">
                LIFETIME UNLIMITED ACCESS ENABLED
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
