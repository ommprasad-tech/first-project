import React, { useState } from 'react';
import { useGoalForgeStore } from '../../lib/store';
import { BranchCategory } from '../../types';
import { BRANCH_LABELS } from '../../lib/constants';
import { BookOpen, Layers, CheckCircle2, ChevronRight, FileText, Play, Award, Sparkles } from 'lucide-react';

export const LearningCenter: React.FC = () => {
  const { currentUser, updateProfile } = useGoalForgeStore();
  const [selectedBranch, setSelectedBranch] = useState<BranchCategory>(currentUser.branch || 'CSE_IT');

  const BRANCH_LEARNING_DATA: Record<BranchCategory, {
    title: string;
    description: string;
    modules: { name: string; topicCount: number; level: string; progress: number }[];
    labsPracticals: string[];
    careerPaths: string[];
  }> = {
    CSE_IT: {
      title: 'Computer Science & Software Engineering Hub',
      description: 'Master Programming, DSA, System Design, Full-Stack Web, AI/ML, OS, DBMS & Git.',
      modules: [
        { name: 'Data Structures & Algorithms (DSA Masterclass)', topicCount: 42, level: 'Advanced', progress: 68 },
        { name: 'Database Management Systems & SQL Indexing', topicCount: 28, level: 'Intermediate', progress: 85 },
        { name: 'Operating Systems & Process Management', topicCount: 20, level: 'Intermediate', progress: 50 },
        { name: 'Computer Networks & HTTP Protocol', topicCount: 18, level: 'Intermediate', progress: 40 },
        { name: 'Full-Stack Web Dev (React, TypeScript, Node.js)', topicCount: 35, level: 'Advanced', progress: 90 },
      ],
      labsPracticals: ['SQL Query Simulator', 'OS Process Scheduler Visualizer', 'Git Branching Sandbox'],
      careerPaths: ['Software Engineer (SDE-1)', 'Frontend Developer', 'Backend Architect', 'AI/ML Engineer'],
    },
    MECHANICAL: {
      title: 'Mechanical & Automation Engineering',
      description: 'Thermodynamics, Fluid Mechanics, CAD/CAM Modeling, Robotics, Automotive Design & Manufacturing.',
      modules: [
        { name: 'Solid Mechanics & Strength of Materials', topicCount: 30, level: 'Core', progress: 45 },
        { name: 'Thermodynamics & Heat Transfer', topicCount: 25, level: 'Core', progress: 60 },
        { name: 'CAD/CAM Modeling (SolidWorks & Fusion 360)', topicCount: 22, level: 'Practical', progress: 75 },
        { name: 'Robotics & Automation Control', topicCount: 18, level: 'Advanced', progress: 30 },
      ],
      labsPracticals: ['CAD Model Analyzer', 'Fluid Flow Calculator', 'Thermal Cycle Simulator'],
      careerPaths: ['Mechanical Design Engineer', 'R&D Automotive Specialist', 'Robotics Technician', 'Plant Manager'],
    },
    ELECTRICAL: {
      title: 'Electrical & Electronics (EEE / ECE)',
      description: 'Circuit Analysis, Microcontrollers, Embedded Systems, Signal Processing & Power Systems.',
      modules: [
        { name: 'Circuit Theory & Analog Electronics', topicCount: 32, level: 'Core', progress: 70 },
        { name: 'Embedded Systems & Arduino/ESP32', topicCount: 24, level: 'Practical', progress: 80 },
        { name: 'Digital Signal Processing (DSP)', topicCount: 20, level: 'Advanced', progress: 40 },
        { name: 'Power Systems & Renewable Energy', topicCount: 18, level: 'Core', progress: 55 },
      ],
      labsPracticals: ['Logic Gate Simulator', 'Circuit Breadboard Tester', 'Oscilloscope Waveform Analyzer'],
      careerPaths: ['Embedded Software Engineer', 'VLSI Design Engineer', 'Robotics Systems Architect'],
    },
    CIVIL: {
      title: 'Civil & Structural Engineering',
      description: 'Structural Analysis, Concrete Technology, AutoCAD, Surveying, Geotechnical & Construction Management.',
      modules: [
        { name: 'Structural Analysis & Design', topicCount: 28, level: 'Core', progress: 50 },
        { name: 'AutoCAD & Building Information Modeling (BIM)', topicCount: 20, level: 'Practical', progress: 85 },
        { name: 'Geotechnical & Foundation Engineering', topicCount: 22, level: 'Core', progress: 40 },
      ],
      labsPracticals: ['Load Stress Calculator', 'AutoCAD Blueprint Viewer', 'Concrete Mix Proportioning'],
      careerPaths: ['Structural Engineer', 'BIM Manager', 'Construction Project Lead', 'Surveyor'],
    },
    CHEMICAL: {
      title: 'Chemical & Process Engineering',
      description: 'Chemical Reaction Engineering, Transport Phenomena, Process Dynamics & Plant Safety.',
      modules: [
        { name: 'Chemical Reaction Engineering', topicCount: 26, level: 'Core', progress: 40 },
        { name: 'Mass Transfer & Distillation Operations', topicCount: 22, level: 'Core', progress: 60 },
      ],
      labsPracticals: ['Reaction Rate Kinetics Tester', 'Distillation Column Simulator'],
      careerPaths: ['Process Engineer', 'Petrochemical Specialist', 'Quality Assurance Manager'],
    },
    SCIENCE: {
      title: 'Pure & Applied Sciences (Physics, Chemistry, Math)',
      description: 'Scientific Computing, Quantum Physics, Organic Synthesis, Applied Mathematics & Research.',
      modules: [
        { name: 'Applied Linear Algebra & Differential Equations', topicCount: 35, level: 'Core', progress: 75 },
        { name: 'Quantum Mechanics & Semiconductor Physics', topicCount: 25, level: 'Advanced', progress: 50 },
        { name: 'Organic Reaction Mechanisms & Lab Analysis', topicCount: 28, level: 'Core', progress: 65 },
      ],
      labsPracticals: ['Molecular Geometry Viewer', 'Matrix Eigenvalue Calculator'],
      careerPaths: ['Research Scientist', 'Data Analyst', 'Academic Educator', 'Biotech Researcher'],
    },
    COMMERCE: {
      title: 'Commerce, Finance & Business Analytics',
      description: 'Corporate Accounting, Financial Modeling, Advanced Excel, Business Economics & Tax Law.',
      modules: [
        { name: 'Financial Accounting & Balance Sheet Analysis', topicCount: 30, level: 'Core', progress: 80 },
        { name: 'Financial Modeling & Advanced Excel (VBA)', topicCount: 25, level: 'Practical', progress: 90 },
        { name: 'Business Analytics & PowerBI Basics', topicCount: 20, level: 'Advanced', progress: 60 },
      ],
      labsPracticals: ['Excel Formula Tester', 'Financial Valuation Spreadsheet'],
      careerPaths: ['Financial Analyst', 'Chartered Accountant Track', 'Business Intelligence Analyst'],
    },
    ARTS_HUMANITIES: {
      title: 'Arts, Humanities & Social Sciences',
      description: 'Public Policy, Corporate Communications, Technical Writing, Digital Media & Research Methodology.',
      modules: [
        { name: 'Technical Writing & Content Architecture', topicCount: 22, level: 'Practical', progress: 85 },
        { name: 'Public Speaking & Corporate Communications', topicCount: 18, level: 'Core', progress: 70 },
        { name: 'Research Methodology & Policy Analysis', topicCount: 20, level: 'Advanced', progress: 50 },
      ],
      labsPracticals: ['Speech Tone Analyzer', 'Article Structural Proofreader'],
      careerPaths: ['Corporate Communications Specialist', 'UX Writer', 'Public Relations Lead', 'Policy Analyst'],
    },
    DIPLOMA: {
      title: 'Diploma & Polytechnic Practical Hub',
      description: 'Hands-on practical training, workshop skills, CAD drafting, and polytechnic syllabus revision.',
      modules: [
        { name: 'Applied Mathematics for Diploma', topicCount: 20, level: 'Core', progress: 60 },
        { name: 'Workshop Technology & Machine Operation', topicCount: 25, level: 'Practical', progress: 80 },
        { name: 'Electrical/Mechanical CAD Fundamentals', topicCount: 18, level: 'Practical', progress: 75 },
      ],
      labsPracticals: ['Machine Operator Simulator', 'Basic Electrical Wiring Board'],
      careerPaths: ['Junior Engineer Trainee', 'Technical Supervisor', 'CAD Draftsman'],
    },
    COMPETITIVE_EXAMS: {
      title: 'Competitive Examination Preparation (GATE, CAT, UPSC)',
      description: 'Syllabus coverage, quantitative aptitude, mock tests, previous year questions (PYQs) & time management.',
      modules: [
        { name: 'Quantitative Aptitude & Speed Math', topicCount: 40, level: 'Core', progress: 85 },
        { name: 'Logical Reasoning & Data Interpretation', topicCount: 32, level: 'Core', progress: 75 },
        { name: 'GATE Core Subject Mock Tests', topicCount: 50, level: 'Advanced', progress: 55 },
      ],
      labsPracticals: ['Timed Mock Test Engine', 'PYQ Question Bank Search'],
      careerPaths: ['PSU Officer (GATE)', 'Top B-School MBA (CAT)', 'Civil Services (UPSC)'],
    },
  };

  const currentBranchData = BRANCH_LEARNING_DATA[selectedBranch] || BRANCH_LEARNING_DATA.CSE_IT;

  const handleSwitchBranch = (branch: BranchCategory) => {
    setSelectedBranch(branch);
    updateProfile({ branch });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Branch-Specific Learning Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tailored learning modules, practical labs, and career roadmaps for all engineering, diploma, science, commerce, and arts branches.
          </p>
        </div>

        {/* Branch Selector Pill */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Selected Stream / Branch
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => handleSwitchBranch(e.target.value as BranchCategory)}
            className="px-3 py-2 bg-[#0B0B0F] border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-[#007BA7] font-semibold"
          >
            {Object.keys(BRANCH_LABELS).map((bKey) => (
              <option key={bKey} value={bKey}>
                {BRANCH_LABELS[bKey]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Branch Hub */}
      <div className="bg-[#15151D] border border-slate-800 rounded-2xl p-6 space-y-6">
        <div>
          <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
            {BRANCH_LABELS[selectedBranch]}
          </span>
          <h2 className="text-xl font-bold text-white mt-2">{currentBranchData.title}</h2>
          <p className="text-xs text-slate-300 mt-1">{currentBranchData.description}</p>
        </div>

        {/* Modules List */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Core Curriculum & Modules ({currentBranchData.modules.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentBranchData.modules.map((mod, i) => (
              <div key={i} className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{mod.name}</h4>
                    <span className="text-[10px] text-slate-400">{mod.topicCount} Topics · {mod.level}</span>
                  </div>
                  <span className="text-xs font-bold text-[#007BA7] tabular-nums">{mod.progress}%</span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#007BA7] to-[#FF3B81] h-full rounded-full"
                    style={{ width: `${mod.progress}%` }}
                  />
                </div>

                <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1">
                  <Play className="w-3 h-3 text-[#007BA7]" /> Resume Module
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Labs & Career Paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          {/* Labs */}
          <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" /> Practical Lab Support & Tools
            </h4>
            <div className="space-y-2">
              {currentBranchData.labsPracticals.map((lab, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-[#15151D] rounded-lg text-xs text-slate-200">
                  <span>{lab}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">READY</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career Paths */}
          <div className="p-4 bg-[#0B0B0F] border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" /> Targeted Career Paths
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentBranchData.careerPaths.map((cp, i) => (
                <span key={i} className="px-3 py-1 bg-slate-800 text-slate-200 text-xs rounded-lg font-medium">
                  {cp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
