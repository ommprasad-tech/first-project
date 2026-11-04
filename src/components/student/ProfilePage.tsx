import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { BranchCategory } from '../../types';
import { BRANCH_LABELS } from '../../lib/constants';
import { User, Mail, Phone, School, GraduationCap, Compass, Save, CheckCircle2, Clock, Sparkles, Image as ImageIcon, BookOpen, Zap } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useGoalForgeStore();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [course, setCourse] = useState(currentUser.course || '');
  const [branch, setBranch] = useState<BranchCategory>(currentUser.branch || 'CSE_IT');
  const [semesterYear, setSemesterYear] = useState(currentUser.semesterYear || '');
  const [careerGoal, setCareerGoal] = useState(currentUser.careerGoal || '');
  const [cgpa, setCgpa] = useState(currentUser.cgpa || 8.5);

  const [subjectsStr, setSubjectsStr] = useState((currentUser.subjects || ['Data Structures', 'Operating Systems', 'Web Dev', 'Database Systems']).join(', '));
  const [skillsStr, setSkillsStr] = useState((currentUser.skills || ['JavaScript', 'React', 'Java', 'Python', 'SQL']).join(', '));
  const [interestsStr, setInterestsStr] = useState((currentUser.interests || ['Open Source', 'Competitive Coding', 'AI/ML', 'System Design']).join(', '));

  const [dailyStudyHours, setDailyStudyHours] = useState(currentUser.dailyStudyHours || 4);
  const [wakeTime, setWakeTime] = useState(currentUser.wakeTime || '06:30');
  const [sleepTime, setSleepTime] = useState(currentUser.sleepTime || '22:30');
  const [preferredStudyTime, setPreferredStudyTime] = useState(currentUser.preferredStudyTime || 'Evening (6 PM - 10 PM)');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const PRESET_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedSubjects = subjectsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedSkills = skillsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedInterests = interestsStr.split(',').map((s) => s.trim()).filter(Boolean);

    updateProfile({
      fullName,
      email,
      phone,
      avatarUrl,
      institution,
      course,
      branch,
      semesterYear,
      careerGoal,
      cgpa,
      subjects: parsedSubjects,
      skills: parsedSkills,
      interests: parsedInterests,
      dailyStudyHours,
      wakeTime,
      sleepTime,
      preferredStudyTime,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={avatarUrl}
            alt={fullName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#007BA7] shadow-lg shrink-0"
          />
          <div>
            <h1 className="text-xl font-bold text-white">{fullName}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Student ID: <span className="font-mono text-[#007BA7]">{currentUser.publicId}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {course} ({BRANCH_LABELS[branch]}) · {semesterYear}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs flex items-center gap-2 font-semibold shadow-md animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile & AI Agents Synchronized!</span>
          </div>
        )}
      </div>

      {/* Info Banner about AI Sync */}
      <div className="p-4 bg-gradient-to-r from-[#007BA7]/10 to-[#FF3B81]/10 border border-[#007BA7]/20 rounded-2xl flex items-center gap-3 text-xs text-slate-300">
        <Sparkles className="w-5 h-5 text-[#FF3B81] shrink-0" />
        <div>
          <strong className="text-white font-semibold">Automatic AI Synchronization: </strong>
          Updating your profile immediately updates AI Goal Planner recommendations, Daily Routine time-blocks, Study Planner schedules, and Career Roadmaps while leaving completed history safe!
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
        {/* Card 1: Personal Details & Avatar */}
        <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#007BA7]" /> Personal Details & Profile Photo
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:border-[#007BA7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 focus:border-[#007BA7] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono focus:border-[#007BA7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Profile Photo URL</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono text-[11px] focus:border-[#007BA7] focus:outline-none"
              />
            </div>
          </div>

          {/* Preset Avatar Selection */}
          <div>
            <label className="block text-slate-400 mb-2 font-medium">Choose Preset Avatar</label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {PRESET_AVATARS.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Preset ${i}`}
                  onClick={() => setAvatarUrl(url)}
                  className={`w-12 h-12 rounded-xl object-cover cursor-pointer transition-all ${
                    avatarUrl === url ? 'ring-2 ring-[#007BA7] scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Academic Profile */}
        <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" /> Academic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">College / Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Course</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Branch / Stream</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as BranchCategory)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
              >
                {Object.keys(BRANCH_LABELS).map((key) => (
                  <option key={key} value={key}>
                    {BRANCH_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Semester / Year</label>
              <input
                type="text"
                value={semesterYear}
                onChange={(e) => setSemesterYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Current CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Career Goal / Ambition</label>
            <input
              type="text"
              placeholder="e.g. Software Engineer at Top Tech Company"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Enrolled Subjects (Comma-separated)</label>
              <input
                type="text"
                value={subjectsStr}
                onChange={(e) => setSubjectsStr(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium font-medium">Skills (Comma-separated)</label>
              <input
                type="text"
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Daily Routine & Life Schedule Preferences */}
        <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" /> Daily Schedule & Life Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Daily Available Study Hours ({dailyStudyHours} hrs)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={dailyStudyHours}
                onChange={(e) => setDailyStudyHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Wake-Up Time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Sleep Time</label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Preferred Study Time Window</label>
              <select
                value={preferredStudyTime}
                onChange={(e) => setPreferredStudyTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
              >
                <option value="Early Morning (5 AM - 8 AM)">Early Morning (5 AM - 8 AM)</option>
                <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                <option value="Evening (6 PM - 10 PM)">Evening (6 PM - 10 PM)</option>
                <option value="Late Night (10 PM - 2 AM)">Late Night (10 PM - 2 AM)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Personal Interests & Hobbies</label>
              <input
                type="text"
                placeholder="e.g. Open Source, Gaming, Fitness, Robotics"
                value={interestsStr}
                onChange={(e) => setInterestsStr(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0F] border border-slate-800 rounded-xl text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-[#007BA7] to-[#FF3B81] hover:from-[#00688e] hover:to-[#e02e6e] text-white font-extrabold rounded-xl flex items-center gap-2 shadow-xl shadow-[#007BA7]/20 transition-all text-sm"
          >
            <Save className="w-5 h-5" /> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};

