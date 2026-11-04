import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { BranchCategory } from '../../types';
import { BRANCH_LABELS } from '../../lib/constants';
import { Sparkles, User, Mail, Phone, Lock, School, GraduationCap, Compass, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface RegisterPageProps {
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateLogin }) => {
  const { register } = useGoalForgeStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [course, setCourse] = useState('');
  const [branch, setBranch] = useState<BranchCategory>('CSE_IT');
  const [institution, setInstitution] = useState('');
  const [semesterYear, setSemesterYear] = useState('');
  const [careerGoal, setCareerGoal] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    register({
      fullName,
      email,
      phone,
      course,
      branch,
      institution,
      semesterYear,
      careerGoal,
    });

    // Directly navigate to login page after completing registration
    onNavigateLogin();
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-slate-100 flex items-center justify-center p-4 selection:bg-[#007BA7] selection:text-white my-8">
      <div className="w-full max-w-xl bg-[#15151D] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#007BA7] to-[#FF3B81] p-0.5 mx-auto flex items-center justify-center shadow-xl shadow-[#007BA7]/20">
            <div className="w-full h-full bg-[#0B0B0F] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FF3B81]" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Student Account</h1>
          <p className="text-xs text-slate-400">Join GoalForge AI to automate your goals, study routine & career</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your valid gmail id"
                    className="w-full pl-9 pr-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-[#007BA7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Academic & Career Details */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2. Academic & Career Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">College / Institution</label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Enter your college / institution name"
                    className="w-full pl-9 pr-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Degree Course</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech / B.E / B.Sc / Diploma / MCA"
                    className="w-full pl-9 pr-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Branch / Stream</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as BranchCategory)}
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-medium focus:outline-none focus:border-[#007BA7]"
                >
                  {Object.keys(BRANCH_LABELS).map((key) => (
                    <option key={key} value={key}>
                      {BRANCH_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Semester / Year</label>
                <input
                  type="text"
                  value={semesterYear}
                  onChange={(e) => setSemesterYear(e.target.value)}
                  placeholder="e.g. Semester 6 / Year 3"
                  className="w-full px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Career Goal / Ambition</label>
              <div className="relative">
                <Compass className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Software Engineer / Data Scientist / Civil Services"
                  className="w-full pl-9 pr-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#007BA7]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#007BA7] to-[#FF3B81] hover:from-[#00688e] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#007BA7]/20 flex items-center justify-center gap-2 text-xs"
          >
            <span>Complete Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-[#007BA7] font-semibold hover:underline"
            >
              Sign In Instead
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
