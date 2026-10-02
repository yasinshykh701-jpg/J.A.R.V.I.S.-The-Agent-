import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/db/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/types';
import { clearStoredSession, getStoredLocalSession, signInWithSQLite, signUpWithSQLite } from '@/services/sqliteAuth';

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signInWithUsername: async () => ({ error: new Error('AuthProvider not initialized') }),
  signUpWithUsername: async () => ({ error: new Error('AuthProvider not initialized') }),
  signOut: async () => {},
  refreshProfile: async () => {}
});

function buildLocalUser(username: string): User {
  const now = new Date().toISOString();
  return {
    id: `local-${username}`,
    aud: 'authenticated',
    role: 'authenticated',
    email: `${username}@local`,
    email_confirmed_at: now,
    phone: '',
    confirmed_at: now,
    last_sign_in_at: now,
    app_metadata: { provider: 'sqlite' },
    user_metadata: { username },
    created_at: now,
    updated_at: now,
    identities: [],
    factors: [],
  } as User;
}

function buildLocalProfile(username: string): Profile {
  const now = new Date().toISOString();
  return {
    id: `local-${username}`,
    username,
    email: `${username}@local`,
    role: 'user',
    created_at: now,
    updated_at: now,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const profileData = await getProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const localSession = getStoredLocalSession();
    if (localSession?.username) {
      const localUser = buildLocalUser(localSession.username);
      const localProfile = buildLocalProfile(localSession.username);
      if (mounted) {
        setUser(localUser);
        setProfile(localProfile);
        setLoading(false);
      }
    }

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          getProfile(session.user.id).then((profileData) => {
            if (mounted) {
              setProfile(profileData);
            }
          }).catch((error) => {
            console.error('Error loading profile:', error);
            if (mounted) {
              setProfile(null);
            }
          });
        } else if (!localSession?.username) {
          setUser(null);
          setProfile(null);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error getting session:', error);
        if (mounted) {
          setUser(localSession?.username ? buildLocalUser(localSession.username) : null);
          setProfile(localSession?.username ? buildLocalProfile(localSession.username) : null);
          setLoading(false);
        }
      });

    // In this function, do NOT use any await calls. Use `.then()` instead to avoid deadlocks.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        if (session?.user) {
          getProfile(session.user.id).then((profileData) => {
            if (mounted) {
              setProfile(profileData);
            }
          }).catch((error) => {
            console.error('Error loading profile on auth change:', error);
            if (mounted) {
              setProfile(null);
            }
          });
        } else {
          setProfile(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithUsername = async (username: string, password: string) => {
    try {
      const sqliteResult = await signInWithSQLite(username, password);
      if (sqliteResult.success) {
        const localUser = buildLocalUser(username);
        const localProfile = buildLocalProfile(username);
        setUser(localUser);
        setProfile(localProfile);
        return { error: null };
      }

      const email = `${username}@miaoda.com`;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUpWithUsername = async (username: string, password: string) => {
    try {
      const sqliteResult = await signUpWithSQLite(username, password);
      if (sqliteResult.success) {
        const localUser = buildLocalUser(username);
        const localProfile = buildLocalProfile(username);
        setUser(localUser);
        setProfile(localProfile);
        return { error: null };
      }

      const email = `${username}@miaoda.com`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    clearStoredSession();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithUsername, signUpWithUsername, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
