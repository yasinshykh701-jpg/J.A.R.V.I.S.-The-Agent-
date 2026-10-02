import re

with open('src/components/AuthPage.tsx', 'r') as f:
    code = f.read()

imports = """import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { setDoc, doc } from 'firebase/firestore';
"""
code = code.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\n" + imports)

# replace handleSubmit
new_handleSubmit = """
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
"""

code = re.sub(r'const handleSubmit = async \(e: React\.FormEvent\) => \{.*?\n  \};\n', new_handleSubmit, code, flags=re.DOTALL)

# Add Google Sign in button before "Need a backend identity profile"
google_btn = """
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
"""

code = code.replace('<div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/50">', google_btn + '\n          <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/50">')

with open('src/components/AuthPage.tsx', 'w') as f:
    f.write(code)
