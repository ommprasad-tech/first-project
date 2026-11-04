import React, { useState } from 'react';
import { GoalForgeProvider, useGoalForgeStore } from './lib/store';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

import { StudentDashboard } from './components/student/StudentDashboard';
import { GoalManager } from './components/student/GoalManager';
import { DailyRoutine } from './components/student/DailyRoutine';
import { StudyPlanner } from './components/student/StudyPlanner';
import { SmartCalendar } from './components/student/SmartCalendar';
import { TaskManager } from './components/student/TaskManager';
import { AIProblemSolver } from './components/student/AIProblemSolver';
import { LearningCenter } from './components/student/LearningCenter';
import { SkillTrackStudent } from './components/student/SkillTrackStudent';
import { CareerRoadmap } from './components/student/CareerRoadmap';
import { CampusLinkJobs } from './components/student/CampusLinkJobs';
import { ResumePortfolio } from './components/student/ResumePortfolio';
import { ProjectManager } from './components/student/ProjectManager';
import { ProgressAnalytics } from './components/student/ProgressAnalytics';
import { ProfilePage } from './components/student/ProfilePage';
import { SettingsPage } from './components/student/SettingsPage';
import { NotificationCenter } from './components/student/NotificationCenter';

const MainAppContent: React.FC = () => {
  const { isAuthenticated } = useGoalForgeStore();

  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeView, setActiveView] = useState('dashboard');

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Goal Creation helper shortcut
  const handleOpenCreateGoal = () => {
    setActiveView('goals');
  };

  // If unauthenticated, display Login or Register screen
  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginPage onNavigateRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onNavigateLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0B0F] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-[#007BA7] selection:text-white transition-colors duration-200">
      {/* Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
      />

      {/* Main Body */}
      <div className="flex flex-1">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          mobileOpen={mobileNavOpen}
          setMobileOpen={setMobileNavOpen}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeView === 'dashboard' && (
            <StudentDashboard
              setActiveView={setActiveView}
              onOpenCreateGoalModal={handleOpenCreateGoal}
            />
          )}
          {activeView === 'profile' && <ProfilePage />}
          {activeView === 'goals' && <GoalManager />}
          {activeView === 'routine' && <DailyRoutine />}
          {activeView === 'study_planner' && <StudyPlanner />}
          {activeView === 'calendar' && <SmartCalendar />}
          {activeView === 'tasks' && <TaskManager />}
          {activeView === 'problem_solver' && <AIProblemSolver />}
          {activeView === 'learning_center' && <LearningCenter />}
          {activeView === 'skills' && <SkillTrackStudent />}
          {activeView === 'career_roadmap' && <CareerRoadmap />}
          {activeView === 'jobs' && <CampusLinkJobs />}
          {activeView === 'resume_portfolio' && <ResumePortfolio />}
          {activeView === 'projects' && <ProjectManager />}
          {activeView === 'analytics' && <ProgressAnalytics />}
          {activeView === 'achievements' && <ProgressAnalytics />}
          {activeView === 'notifications' && (
            <StudentDashboard
              setActiveView={setActiveView}
              onOpenCreateGoalModal={handleOpenCreateGoal}
            />
          )}
          {activeView === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Notifications Drawer */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <GoalForgeProvider>
      <MainAppContent />
    </GoalForgeProvider>
  );
}
