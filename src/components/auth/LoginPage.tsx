import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

interface LoginPageProps {
  onNavigateRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateRegister }) => {
  const { login } = useGoalForgeStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);

  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    const success = await login(email, password, rememberSession);
    setIsSubmitting(false);
    if (!success) {
      setErrorMsg('Invalid email or password. Please try again.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setForgotModalOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-slate-100 flex items-center justify-center p-4 selection:bg-[#007BA7] selection:text-white">
      <div className="w-full max-w-md bg-[#15151D] border border-slate-800 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#007BA7] to-[#FF3B81] p-0.5 mx-auto flex items-center justify-center shadow-xl shadow-[#007BA7]/20">
            <div className="w-full h-full bg-[#0B0B0F] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#FF3B81]" />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            GoalForge <span className="text-[#FF3B81]">AI</span>
          </h1>
          <p className="text-xs text-slate-400">
            Student Career, Academic & Goal Management Ecosystem
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-center">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@institution.edu"
                className="w-full pl-9 pr-3 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-slate-300 font-medium">Password</label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[11px] text-[#007BA7] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="rounded border-slate-700 text-[#007BA7] focus:ring-0"
              />
              <span>Remember session</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#007BA7] to-[#FF3B81] hover:from-[#00688e] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#007BA7]/20 flex items-center justify-center gap-2 text-xs"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Create Account Link */}
        <div className="pt-2 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="text-[#007BA7] font-semibold hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#15151D] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#007BA7]" />
                <h3 className="text-sm font-bold text-white">Reset Password</h3>
              </div>
              <button onClick={() => setForgotModalOpen(false)} className="text-slate-400 hover:text-white font-mono">
                ✕
              </button>
            </div>

            {!forgotSent ? (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-slate-400">Enter your email address to receive password reset instructions.</p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="student@institution.edu"
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#007BA7] text-white font-semibold rounded-xl"
                >
                  Send Reset Link
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                <div className="font-bold">Reset Email Sent!</div>
                <p className="text-[11px] text-slate-300">Check your inbox for password recovery instructions.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
