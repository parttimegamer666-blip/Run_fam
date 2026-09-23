import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Zap,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { RunFamLogo } from '../common/RunFamLogo';
import { authService } from '../../services/auth';
import { db } from '../../services/db';
import { User } from '../../types';

interface LoginPageProps {
  onSuccess: (user: User) => void;
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword: () => void;
  onNavigateToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onNavigateToLanding,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showGoogleConfigModal, setShowGoogleConfigModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email or username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.login(email, password);
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (userEmail: string, pass: string = 'runfam123') => {
    setErrorMessage(null);
    try {
      setLoading(true);
      const user = await authService.login(userEmail, pass);
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      setShowGoogleConfigModal(true);
      return;
    }

    try {
      setLoading(true);
      const user = await authService.loginWithGoogle();
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithGoogleDemo = async () => {
    setShowGoogleConfigModal(false);
    try {
      setLoading(true);
      const user = await authService.loginWithGoogle({
        name: 'Tanmay Kulkarni',
        email: 'tanmay.kulkarni@google.com',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      });
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      name: 'Rahul Sharma',
      role: 'Waluj Runners Member',
      email: 'rahul.sharma@runfam.com',
      badge: 'Rank #47',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Priya Patil',
      role: 'CSN Weekend Warriors Lead',
      email: 'priya.patil@runfam.com',
      badge: 'Rank #2',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'RunFam Administrator',
      role: 'Platform Moderator',
      email: 'admin@runfam.com',
      badge: 'Admin Role',
      avatar: '/runfam-icon.svg',
    },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 transition-all">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <button 
            type="button" 
            onClick={onNavigateToLanding}
            className="hover:opacity-85 transition-opacity"
            title="Return to RunFam Home"
          >
            <RunFamLogo variant="compact" size="sm" />
          </button>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Chhatrapati Sambhajinagar
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="pt-6 pb-4">
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900">
            WELCOME BACK 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Your next run is waiting.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="runner@runfam.com or @username"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#72D600] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-xs font-bold text-[#529d00] hover:text-[#438200] transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#72D600] focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary CTA: LOG IN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#72D600]/25 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>SIGNING IN...</span>
              </span>
            ) : (
              <>
                <span>LOG IN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            OR
          </span>
        </div>

        {/* Secondary CTA: CONTINUE WITH GOOGLE */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={loading}
          className="w-full h-12 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
        >
          {/* Official Google 'G' Mark */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>CONTINUE WITH GOOGLE</span>
        </button>

        {/* Switch to Sign Up */}
        <div className="pt-6 text-center text-xs text-slate-600 border-t border-slate-100 mt-6">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={onNavigateToSignUp}
            className="font-bold text-[#529d00] hover:text-[#438200] transition-colors"
          >
            Create one
          </button>
        </div>

        {/* Quick Demo Test Runner Selector */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#72D600]" />
              Quick Demo Accounts
            </span>
            <span className="text-[9px] text-slate-400 font-mono">1-Tap Login</span>
          </div>

          <div className="space-y-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickDemoLogin(acc.email)}
                className="w-full p-2 rounded-xl bg-slate-50 hover:bg-lime-50/50 border border-slate-100 hover:border-[#72D600]/40 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-800 group-hover:text-slate-950 block">
                      {acc.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{acc.role}</span>
                  </div>
                </div>

                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 group-hover:border-[#72D600] group-hover:text-[#529d00]">
                  {acc.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Google OAuth Configuration Guide Modal */}
      {showGoogleConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs space-y-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center gap-2 text-slate-900 font-display font-black text-base">
              <Sparkles className="w-5 h-5 text-[#72D600]" />
              <span>Google OAuth Configuration</span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              To activate live Google Identity Services in your deployment:
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
              <p className="text-slate-400 font-sans text-[10px] uppercase font-bold">Required Environment Variable</p>
              <p className="text-[#529d00] font-bold">VITE_GOOGLE_CLIENT_ID=&lt;your_client_id&gt;.apps.googleusercontent.com</p>
            </div>

            <p className="text-slate-500">
              For testing and previewing right now, you can continue with a test Google profile or use any of the existing Sambhajinagar runners.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={handleContinueWithGoogleDemo}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>Continue with Test Google Account</span>
              </button>
              <button
                type="button"
                onClick={() => setShowGoogleConfigModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
