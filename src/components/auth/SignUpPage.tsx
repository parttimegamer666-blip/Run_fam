import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AtSign, 
  ArrowRight, 
  AlertCircle, 
  Check, 
  X, 
  Sparkles,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { RunFamLogo } from '../common/RunFamLogo';
import { authService, evaluatePasswordStrength } from '../../services/auth';
import { User } from '../../types';

interface SignUpPageProps {
  onSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
  onNavigateToLanding?: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
];

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccess,
  onNavigateToLogin,
  onNavigateToLanding,
}) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showGoogleConfigModal, setShowGoogleConfigModal] = useState(false);

  // Evaluate password strength in real time
  const passwordStrength = evaluatePasswordStrength(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!username.trim()) {
      setErrorMessage('Please choose a username.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }
    if (!passwordStrength.isValid) {
      setErrorMessage(`Password requirement not met: ${passwordStrength.errors[0]}`);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter both passwords carefully.');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.signUp({
        name: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        avatarUrl: customAvatarUrl.trim() || selectedAvatar,
      });
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to create account.');
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
      setErrorMessage(err.message || 'Google signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithGoogleDemo = async () => {
    setShowGoogleConfigModal(false);
    try {
      setLoading(true);
      const user = await authService.loginWithGoogle({
        name: 'Omkar Jadhav',
        email: 'omkar.jadhav@gmail.com',
        avatarUrl: PRESET_AVATARS[1],
      });
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
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
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#529d00]">
            City Running Collective
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="pt-6 pb-4">
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900">
            JOIN RUNFAM 🏃
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Your run. Your crew. Your city.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Sign-Up Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Tanmay Kulkarni"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#72D600] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Username *
            </label>
            <div className="relative">
              <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="tanmay_strides"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#72D600] focus:border-transparent transition-all font-mono"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
              Your runner handle: @{username.replace(/^@/, '') || 'username'}
            </span>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="runner@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#72D600] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#72D600] focus:border-transparent transition-all"
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

            {/* Visual Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600">Password Strength:</span>
                  <span
                    className={`font-black uppercase tracking-wider ${
                      passwordStrength.strength === 'strong'
                        ? 'text-emerald-600'
                        : passwordStrength.strength === 'good'
                        ? 'text-[#529d00]'
                        : passwordStrength.strength === 'fair'
                        ? 'text-amber-500'
                        : 'text-rose-500'
                    }`}
                  >
                    {passwordStrength.strength}
                  </span>
                </div>

                {/* Strength Meter Bar */}
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score >= 1
                        ? passwordStrength.strength === 'strong'
                          ? 'bg-emerald-500 w-1/4'
                          : passwordStrength.strength === 'good'
                          ? 'bg-[#72D600] w-1/4'
                          : passwordStrength.strength === 'fair'
                          ? 'bg-amber-400 w-1/4'
                          : 'bg-rose-500 w-1/4'
                        : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score >= 2
                        ? passwordStrength.strength === 'strong'
                          ? 'bg-emerald-500 w-1/4'
                          : passwordStrength.strength === 'good'
                          ? 'bg-[#72D600] w-1/4'
                          : 'bg-amber-400 w-1/4'
                        : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score >= 3
                        ? passwordStrength.strength === 'strong'
                          ? 'bg-emerald-500 w-1/4'
                          : 'bg-[#72D600] w-1/4'
                        : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score >= 4 ? 'bg-emerald-500 w-1/4' : 'bg-transparent'
                    }`}
                  />
                </div>

                {/* Security Criteria Checklist */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-slate-500 pt-1">
                  <span className={`flex items-center gap-1 ${passwordStrength.hasMinLength ? 'text-emerald-700 font-bold' : ''}`}>
                    {passwordStrength.hasMinLength ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 text-slate-300 text-center">•</span>}
                    8+ Characters
                  </span>
                  <span className={`flex items-center gap-1 ${passwordStrength.hasUpper && passwordStrength.hasLower ? 'text-emerald-700 font-bold' : ''}`}>
                    {passwordStrength.hasUpper && passwordStrength.hasLower ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 text-slate-300 text-center">•</span>}
                    Upper & Lowercase
                  </span>
                  <span className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-emerald-700 font-bold' : ''}`}>
                    {passwordStrength.hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 text-slate-300 text-center">•</span>}
                    Number (0-9)
                  </span>
                  <span className={`flex items-center gap-1 ${passwordStrength.hasSpecial ? 'text-emerald-700 font-bold' : ''}`}>
                    {passwordStrength.hasSpecial ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 text-slate-300 text-center">•</span>}
                    Special Symbol (!@#$)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#72D600] focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <p
                className={`text-[10px] mt-1 font-bold flex items-center gap-1 ${
                  passwordsMatch ? 'text-emerald-600' : 'text-rose-500'
                }`}
              >
                {passwordsMatch ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </>
                ) : (
                  <>
                    <X className="w-3 h-3" /> Passwords do not match
                  </>
                )}
              </p>
            )}
          </div>

          {/* Optional Profile Picture Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Profile Picture (Optional)
            </label>
            <div className="flex items-center gap-2">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(url);
                    setCustomAvatarUrl('');
                  }}
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                    selectedAvatar === url && !customAvatarUrl
                      ? 'border-[#72D600] ring-2 ring-[#72D600]/30 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Primary CTA: CREATE ACCOUNT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#72D600]/25 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>CREATING ACCOUNT...</span>
              </span>
            ) : (
              <>
                <span>CREATE ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            OR
          </span>
        </div>

        {/* Google Registration */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={loading}
          className="w-full h-12 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
        >
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

        {/* Switch to Login */}
        <div className="pt-6 text-center text-xs text-slate-600 border-t border-slate-100 mt-6">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-bold text-[#529d00] hover:text-[#438200] transition-colors"
          >
            Log in
          </button>
        </div>

      </div>

      {/* Google OAuth Modal */}
      {showGoogleConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs space-y-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center gap-2 text-slate-900 font-display font-black text-base">
              <Sparkles className="w-5 h-5 text-[#72D600]" />
              <span>Google Registration</span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Google Sign-In uses your Google account credentials via Google Identity Services. To activate production Google OAuth:
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
              <p className="text-slate-400 font-sans text-[10px] uppercase font-bold">Required Environment Variable</p>
              <p className="text-[#529d00] font-bold">VITE_GOOGLE_CLIENT_ID=&lt;your_client_id&gt;.apps.googleusercontent.com</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={handleContinueWithGoogleDemo}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Continue with Demo Google Account
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
