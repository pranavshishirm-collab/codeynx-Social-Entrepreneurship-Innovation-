import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, LogIn, Sparkles, UserPlus, AlertCircle } from 'lucide-react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign Up Flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        // Create user document in Firestore to prep for Leaderboard
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name,
          email,
          createdAt: new Date()
        });
      } else {
        // Log In Flow
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", result.user.uid), {
        name: result.user.displayName,
        email: result.user.email,
        lastLogin: new Date()
      }, { merge: true });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative flair */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex justify-center mb-8 relative z-10">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-30 animate-pulse"></div>
            <div className="relative bg-slate-800 p-4 rounded-2xl border border-slate-700">
               <Activity className="w-10 h-10 text-indigo-400" />
            </div>
          </div>
        </div>
        
        <div className="text-center mb-8 text-white relative z-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center justify-center gap-2">
            Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Nynx</span> <Sparkles className="w-6 h-6 text-yellow-400" />
          </h1>
          <p className="text-slate-400 text-sm">Reflective Social Entrepreneurship</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm relative z-10"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5 text-white pb-3 relative z-10">
          {isSignUp && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                placeholder="Leader Name"
                required={isSignUp}
              />
            </motion.div>
          )}
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              placeholder="leader@codenynx.app"
              required
            />
          </div>
          <div className="space-y-1">
             <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors mt-2 py-3.5 px-4 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-indigo-500/25"
          >
            {!isLoading && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            )}
            <span>{isLoading ? "Processing..." : (isSignUp ? "Create Protocol" : "Enter Simulation")}</span>
            {!isLoading && (isSignUp ? <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" /> : <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />)}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-4 relative z-10">
          <div className="flex-1 border-t border-slate-700"></div>
          <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">OR</span>
          <div className="flex-1 border-t border-slate-700"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          type="button"
          className="mt-6 w-full relative z-10 group overflow-hidden rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-colors py-3 px-4 flex items-center justify-center gap-3 font-semibold border border-slate-700 shadow-xl"
        >
          <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-white">Sign in with Google</span>
        </button>
        
        <div className="mt-8 text-center text-sm text-slate-500 relative z-10">
          <p>
            {isSignUp ? "Already have an access code?" : "Don't have an account?"} 
            <button 
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium ml-2"
            >
              {isSignUp ? "Log in here" : "Sign up here"}
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
