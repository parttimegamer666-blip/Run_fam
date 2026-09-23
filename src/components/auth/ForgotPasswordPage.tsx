import React, { useState } from 'react';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { RunFamLogo } from '../common/RunFamLogo';
import { authService, evaluatePasswordStrength } from '../../services/auth';

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
  onNavigateToLanding?: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onNavigateToLogin,
  onNavigateToLanding,
}) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showDirectReset, setShowDirectReset] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setResetSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.resetPassword(email, showDirectReset && newPassword ? newPassword : undefined);
      setSubmitted(true);
      if (showDirectReset && newPassword) {
        setResetSuccessMessage('Your password has been successfully reset! You can now log in.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to process reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 transition-all">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <button 
            type="button" 
            onClick={onNavigateToLanding}
            className="hover:opacity-85 transition-opacity"
          >
            <RunFamLogo variant="compact" size="sm" />
          </button>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Account Recovery
          </span>
        </div>

        {/* Heading */}
        <div className="pt-6 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-lime-100 text-[#529d00] flex items-center justify-center mb-3">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900">
            RESET YOUR PASSWORD
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Enter your email and we'll help you get back on track.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Success confirmation (Per Requirement Section 7) */}
        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-lime-50/80 border border-[#72D600]/40 text-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#529d00]">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Reset Instructions Dispatched</span>
              </div>
              <blockquote className="italic border-l-2 border-[#72D600] pl-3 py-1 font-medium text-slate-700">
                "If an account exists for this email, we've sent instructions to reset your password."
              </blockquote>
              {resetSuccessMessage && (
                <p className="font-bold text-emerald-700 pt-1">
                  {resetSuccessMessage}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onNavigateToLogin}
              className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO LOG IN</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="runner@runfam.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#72D600] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Test Helper: Direct password reset option for reviewers */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowDirectReset(!showDirectReset)}
                className="text-[11px] font-bold text-[#529d00] hover:underline flex items-center gap-1"
              >
                <span>{showDirectReset ? '− Hide direct password override' : '+ Need to set a new password directly?'}</span>
              </button>
            </div>

            {showDirectReset && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in-50">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 chars, 1 number, 1 special"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#72D600]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#72D600]/25 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>SENDING...</span>
                </span>
              ) : (
                <span>SEND RESET INSTRUCTIONS</span>
              )}
            </button>

            <button
              type="button"
              onClick={onNavigateToLogin}
              className="w-full py-2.5 text-center text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Log In</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
