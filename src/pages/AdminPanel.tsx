import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, Users, ArrowLeft, Lock, Loader2 } from 'lucide-react';
import type { Profile } from '@/types/types';

const ADMIN_PASSWORD = 'qazyen123';

export default function AdminPanel() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (profile?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [profile, navigate, isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('Admin access granted');
    } else {
      toast.error('Incorrect password');
      setPassword('');
    }
  };

  // Show password prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] flex items-center justify-center p-4">
        <div className="w-full max-w-md ios-card ios-shadow border-none p-8 fade-in text-center">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-[24px] flex items-center justify-center mb-6 shadow-lg shadow-primary/10">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Terminal</h1>
          <p className="text-muted-foreground font-medium mb-8">Secure access required to manage Qazyen AI</p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="ios-input h-12 text-center text-lg tracking-widest"
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <Button type="submit" className="ios-button h-12 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                <Shield className="h-5 w-5 mr-2" />
                Access Console
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/')} className="ios-button h-12 text-muted-foreground font-bold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7] dark:bg-[#000000]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] p-6">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between ios-blur p-6 rounded-[32px] ios-shadow border border-border/40">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Control</h1>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-0.5">System Management Interface</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/')} className="ios-button rounded-full border-border/50">
            <ArrowLeft className="h-4 w-4 mr-2" /> Exit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="ios-card p-6 border-none shadow-md bg-white dark:bg-[#1C1C1E]">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Residents</p>
            <p className="text-4xl font-bold text-primary">{users.length}</p>
          </div>
          <div className="ios-card p-6 border-none shadow-md bg-white dark:bg-[#1C1C1E]">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">System Admins</p>
            <p className="text-4xl font-bold text-blue-500">{users.filter((u) => u.role === 'admin').length}</p>
          </div>
          <div className="ios-card p-6 border-none shadow-md bg-white dark:bg-[#1C1C1E]">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Active Accounts</p>
            <p className="text-4xl font-bold text-success">{users.filter((u) => u.role === 'user').length}</p>
          </div>
        </div>

        <div className="ios-card border-none ios-shadow overflow-hidden bg-white dark:bg-[#1C1C1E] rounded-[32px]">
          <div className="p-6 border-b border-border/40 bg-muted/30">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> User Registry
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-xs uppercase tracking-wider py-4 px-6">Identity</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider py-4">Status</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider py-4">Registration Date</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-right px-6">Authorization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="group border-b border-border/40 hover:bg-muted/20 transition-colors">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-bold text-xs shadow-sm">
                          {user.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{user.username}</p>
                          <p className="text-xs text-muted-foreground font-medium">{user.email || 'No email associated'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`rounded-full px-3 py-0.5 border-none text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      {user.id !== profile?.id ? (
                        <Select
                          value={user.role}
                          onValueChange={(value: 'user' | 'admin') => handleRoleChange(user.id, value)}
                        >
                          <SelectTrigger className="w-28 h-9 rounded-xl text-xs font-bold border-border/50 bg-secondary/30 ml-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-border/50 ios-blur">
                            <SelectItem value="user" className="rounded-xl focus:bg-primary/10">USER</SelectItem>
                            <SelectItem value="admin" className="rounded-xl focus:bg-primary/10">ADMIN</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1.5 rounded-full">Current You</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
