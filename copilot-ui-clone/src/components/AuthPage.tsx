import React, { useState } from 'react';
import { Mail, Lock, User, AtSign, Phone, Loader2, ArrowRight, CheckCircle2, ShieldCheck, KeyRound, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { setDoc, doc } from 'firebase/firestore';


interface AuthPageProps {
  onSuccess: (token: string, user: { email: string; username: string }) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        onSuccess(await userCredential.user.getIdToken(), { email: userCredential.user.email || '', username: userCredential.user.displayName || formData.email.split('@')[0] });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await setDoc(doc(db, "users", userCredential.user.uid), { email: formData.email, username: formData.username, name: formData.name });
        onSuccess(await userCredential.user.getIdToken(), { email: userCredential.user.email || '', username: formData.username });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", userCredential.user.uid), { email: userCredential.user.email, username: userCredential.user.displayName }, { merge: true });
      onSuccess(await userCredential.user.getIdToken(), { email: userCredential.user.email || '', username: userCredential.user.displayName || '' });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg bg-black/85 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* Top visual banner */}
        <div className="relative h-32 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 flex flex-col justify-end p-6">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <span className="text-white/80 text-[10px] uppercase tracking-widest font-bold font-mono">Secure Gateway</span>
            <h1 className="text-white text-2xl font-black uppercase tracking-tight flex items-center gap-1.5">
              <ShieldCheck className="w-6 h-6 text-amber-200" />
              ZarZayn ID
            </h1>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isLogin ? 'Authentication Required' : 'Register New Account'}
            </h2>
            <p className="text-white/60 text-xs mt-1 leading-relaxed">
              {isLogin 
                ? 'Sign in to sync your active workspace, secure backups, and unlock unrestricted access.' 
                : 'Create a permanent identity mapped directly to our Spring Boot security database.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 text-xs flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs flex items-start gap-2.5"
              >
                <KeyRound className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="leading-normal">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <>
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold pl-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                      <User size={16} />
                    </div>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Jane Doe" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold pl-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                      <AtSign size={16} />
                    </div>
                    <input 
                      type="text" 
                      name="username"
                      placeholder="janedoe_creator" 
                      value={formData.username}
                      onChange={handleChange}
                      required
                      minLength={4}
                      maxLength={20}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold pl-1">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                      <Smartphone size={16} />
                    </div>
                    <input 
                      type="tel" 
                      name="mobile"
                      placeholder="9876543210" 
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      pattern="^[6-9]\d{9}$"
                      title="10-digit mobile number starting with 6, 7, 8, or 9"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold pl-1">
                {isLogin ? 'Username or Email' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                  <Mail size={16} />
                </div>
                <input 
                  type="text" 
                  name="email"
                  placeholder={isLogin ? "username@example.com" : "jane.doe@example.com"}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold pl-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-2xl py-4 mt-4 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In to Account' : 'Register Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          
          <button 
              type="button" 
              onClick={handleGoogleSignIn}
              className="w-full bg-white text-black font-bold rounded-2xl py-4 mt-4 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
          </button>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/50">
            {isLogin ? "Need a backend identity profile? " : "Already verified? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
              className="text-amber-400 hover:text-amber-300 font-bold tracking-tight cursor-pointer focus:outline-none"
            >
              {isLogin ? 'Create one now' : 'Log in here'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
