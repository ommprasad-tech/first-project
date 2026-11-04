import {
  UserProfile,
  Goal,
  RoutineActivity,
  TaskItem,
  SubjectItem,
  CalendarEvent,
  ProblemHistoryItem,
  SkillItem,
  JobOpportunity,
  SavedJobTracker,
  ProjectItem,
  ResumeData,
  AchievementBadge,
} from '../types';

export const BRANCH_LABELS: Record<string, string> = {
  CSE_IT: 'Computer Science & IT',
  MECHANICAL: 'Mechanical Engineering',
  ELECTRICAL: 'Electrical & Electronics (EEE/ECE)',
  CIVIL: 'Civil Engineering',
  CHEMICAL: 'Chemical Engineering',
  SCIENCE: 'Science (Physics, Chem, Math, Bio)',
  COMMERCE: 'Commerce & Business (B.Com, BBA)',
  ARTS_HUMANITIES: 'Arts & Humanities (BA, Social Sciences)',
  DIPLOMA: 'Diploma & Polytechnic',
  COMPETITIVE_EXAMS: 'Competitive Examination Aspirants (GATE, CAT, UPSC)',
};

export const INITIAL_STUDENT_PROFILE: UserProfile = {
  uid: 'user_std_001',
  publicId: 'GF-STD-8849',
  fullName: 'Alex River',
  email: 'alex.river@student.edu',
  phone: '+1 (555) 234-5678',
  avatarUrl: '/src/assets/images/avatar_student_male_1793523544507.jpg',
  createdAt: '2026-01-15T08:00:00Z',
  institution: 'Apex Institute of Technology & Engineering',
  course: 'B.Tech Computer Science',
  branch: 'CSE_IT',
  semesterYear: 'Semester 6 (3rd Year)',
  graduationYear: 2027,
  cgpa: 8.75,
  skills: ['Python', 'Java', 'React', 'Data Structures & Algorithms', 'TypeScript', 'SQL', 'Git'],
  interests: ['Full-Stack Web Development', 'AI System Integration', 'Cloud Architecture'],
  careerGoal: 'Software Development Engineer (SDE-1)',
  currentLearningLevel: 'intermediate',
  githubUrl: 'https://github.com/alexriver-dev',
  linkedinUrl: 'https://linkedin.com/in/alexriver-dev',
  portfolioUrl: 'https://alexriver.dev',
  placementReadinessScore: 84,
};

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal_001',
    userId: 'user_std_001',
    title: 'Master Data Structures & Algorithms (DSA)',
    description: 'Solve 150 LeetCode problems (Array, Trees, Dynamic Programming, Graphs) to excel in technical interviews.',
    targetDate: '2026-12-15',
    priority: 'high',
    currentLevel: 'Intermediate (75 solved)',
    targetLevel: 'Advanced (150+ solved)',
    category: 'Placement Prep',
    progressPercentage: 68,
    status: 'active',
    createdAt: '2026-09-01T10:00:00Z',
    aiRoadmapGenerated: true,
    aiPlanSummary: 'Phase 1: Binary Search & Trees (Week 1-3). Phase 2: Dynamic Programming & Graphs (Week 4-6). Phase 3: Mock Technical Timed Rounds.',
    dailyTasks: [
      { id: 'dt_1', title: 'Solve 2 LeetCode Tree Traversals', completed: true, type: 'daily' },
      { id: 'dt_2', title: 'Review Sliding Window Pattern notes', completed: false, type: 'daily' },
    ],
    weeklyTasks: [
      { id: 'wt_1', title: 'Complete 1 weekend contest on LeetCode', completed: true, type: 'weekly' },
      { id: 'wt_2', title: 'Mock interview session with peer', completed: false, type: 'weekly' },
    ],
    milestones: [
      { id: 'm_1', title: 'Array & Strings Mastery', targetDate: '2026-09-30', completed: true, tasks: [] },
      { id: 'm_2', title: 'Trees & Graphs Deep-Dive', targetDate: '2026-10-31', completed: false, tasks: [] },
      { id: 'm_3', title: 'Dynamic Programming & System Design Basics', targetDate: '2026-11-30', completed: false, tasks: [] },
    ],
  },
  {
    id: 'goal_002',
    userId: 'user_std_001',
    title: 'Build Full-Stack AI Resume Screener Project',
    description: 'Develop React + Node.js application utilizing Gemini API to match resume keywords with job descriptions.',
    targetDate: '2026-11-20',
    priority: 'urgent',
    currentLevel: 'Backend API ready',
    targetLevel: 'Deploys on Cloud Run with GitHub repo',
    category: 'Projects',
    progressPercentage: 80,
    status: 'active',
    createdAt: '2026-10-01T10:00:00Z',
    aiRoadmapGenerated: true,
    aiPlanSummary: 'Architecture breakdown completed. Frontend UI finalized. Integrating PDF parser & server-side Gemini prompt endpoint.',
    dailyTasks: [
      { id: 'dt_3', title: 'Fix PDF drag-and-drop parsing edge case', completed: true, type: 'daily' },
      { id: 'dt_4', title: 'Write README documentation for GitHub repo', completed: false, type: 'daily' },
    ],
    weeklyTasks: [
      { id: 'wt_3', title: 'Deploy prototype to Vercel/Cloud Run', completed: false, type: 'weekly' },
    ],
    milestones: [
      { id: 'm_4', title: 'Backend API & Gemini Setup', targetDate: '2026-10-15', completed: true, tasks: [] },
      { id: 'm_5', title: 'Frontend UI & Responsive Design', targetDate: '2026-10-28', completed: true, tasks: [] },
      { id: 'm_6', title: 'Production Build & Demo Video', targetDate: '2026-11-15', completed: false, tasks: [] },
    ],
  },
];

export const INITIAL_ROUTINE_ACTIVITIES: RoutineActivity[] = [
  { id: 'ra_1', startTime: '06:30', endTime: '07:15', title: 'Morning Workout & Hydration', category: 'exercise', completed: true },
  { id: 'ra_2', startTime: '07:15', endTime: '08:00', title: 'Breakfast & Daily Review', category: 'meal', completed: true },
  { id: 'ra_3', startTime: '08:00', endTime: '09:00', title: 'DSA Practice: Binary Trees', category: 'coding', completed: true },
  { id: 'ra_4', startTime: '09:00', endTime: '13:00', title: 'College Classes: OS & DBMS Lab', category: 'college', completed: true },
  { id: 'ra_5', startTime: '13:00', endTime: '14:00', title: 'Lunch & Relax', category: 'meal', completed: true },
  { id: 'ra_6', startTime: '14:00', endTime: '16:30', title: 'Compiler Design Lecture', category: 'college', completed: false },
  { id: 'ra_7', startTime: '17:00', endTime: '19:00', title: 'Full-Stack AI Project Coding', category: 'coding', completed: false },
  { id: 'ra_8', startTime: '19:30', endTime: '20:30', title: 'Dinner & Relaxation', category: 'personal', completed: false },
  { id: 'ra_9', startTime: '20:30', endTime: '22:00', title: 'Study Planner: Compiler Design Revision', category: 'study', completed: false },
  { id: 'ra_10', startTime: '22:00', endTime: '22:30', title: 'Daily Check-In & AI Reflection', category: 'other', completed: false },
  { id: 'ra_11', startTime: '22:30', endTime: '06:30', title: 'Rest & Night Sleep', category: 'wake', completed: false },
];

export const INITIAL_TASKS: TaskItem[] = [
  { id: 'task_1', userId: 'user_std_001', title: 'Solve 2 Tree Traversal questions on LeetCode', dueDate: new Date().toISOString().split('T')[0], priority: 'high', status: 'completed', category: 'coding', assignedGoalId: 'goal_001', createdAt: '2026-10-30T10:00:00Z' },
  { id: 'task_2', userId: 'user_std_001', title: 'Write unit tests for PDF parser module', dueDate: new Date().toISOString().split('T')[0], priority: 'medium', status: 'pending', category: 'coding', assignedGoalId: 'goal_002', createdAt: '2026-10-31T10:00:00Z' },
  { id: 'task_3', userId: 'user_std_001', title: 'Revise Compiler Design Lexical Analysis parsing tables', dueDate: '2026-11-04', priority: 'high', status: 'pending', category: 'academic', createdAt: '2026-10-31T12:00:00Z' },
  { id: 'task_4', userId: 'user_std_001', title: 'Submit DBMS Stored Procedures Assignment', dueDate: '2026-11-03', priority: 'urgent', status: 'pending', category: 'academic', createdAt: '2026-10-29T10:00:00Z' },
];

export const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'subj_1',
    userId: 'user_std_001',
    name: 'Compiler Design',
    code: 'CS601',
    examDate: '2026-11-05',
    targetRevisionHours: 15,
    completedRevisionHours: 9,
    topics: [
      { id: 'top_1', title: 'Lexical Analysis & DFA State Machines', completed: true },
      { id: 'top_2', title: 'LL(1) & LR(0) Parsing Tables', completed: true },
      { id: 'top_3', title: 'Syntax Directed Translation', completed: false, revisionScheduledDate: '2026-11-03' },
      { id: 'top_4', title: 'Code Generation & Optimization', completed: false, revisionScheduledDate: '2026-11-04' },
    ],
    aiStudyPlan: 'Focus on LR(1) parsing table construction and intermediate code generation. 2 hours daily recommended until exam.',
  },
  {
    id: 'subj_2',
    userId: 'user_std_001',
    name: 'Database Management Systems (DBMS)',
    code: 'CS602',
    examDate: '2026-11-12',
    targetRevisionHours: 12,
    completedRevisionHours: 7,
    topics: [
      { id: 'top_5', title: 'Relational Algebra & Tuple Calculus', completed: true },
      { id: 'top_6', title: 'SQL Joins, Subqueries & Indexes', completed: true },
      { id: 'top_7', title: 'Normal Forms (1NF, 2NF, 3NF, BCNF)', completed: false, revisionScheduledDate: '2026-11-08' },
      { id: 'top_8', title: 'Transactions, ACID & Concurrency Control', completed: false, revisionScheduledDate: '2026-11-10' },
    ],
    aiStudyPlan: 'Review BCNF decomposition rules and 2PL locking protocols.',
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'ce_1', userId: 'user_std_001', title: 'Compiler Design Mid-Term Exam', date: '2026-11-05', startTime: '10:00', endTime: '12:00', category: 'exam', description: 'Covers Lexical Analysis & Parsing Tables (Hall B)', isUrgent: true },
  { id: 'ce_2', userId: 'user_std_001', title: 'DBMS Lab Assignment Submission', date: '2026-11-03', startTime: '23:59', category: 'exam', description: 'SQL Triggers & Stored Procedures script upload' },
  { id: 'ce_3', userId: 'user_std_001', title: 'Lumina Tech - Online Coding Assessment', date: '2026-11-08', startTime: '14:00', endTime: '16:00', category: 'interview', description: '90-min coding test + 30-min MCQs', isUrgent: true },
  { id: 'ce_4', userId: 'user_std_001', title: 'AI Screener Project Demo Session', date: '2026-11-12', startTime: '16:00', category: 'project', description: 'Present project demo to professor' },
];

export const INITIAL_PROBLEM_HISTORY: ProblemHistoryItem[] = [
  {
    id: 'prob_001',
    userId: 'user_std_001',
    category: 'React & Vite',
    query: 'Uncaught ReferenceError: process is not defined when accessing process.env.API_KEY in Vite React component',
    codeSnippet: 'const apiKey = process.env.API_KEY;\nfetch(`/api/data?key=${apiKey}`);',
    errorMessage: 'ReferenceError: process is not defined',
    language: 'TypeScript / React',
    createdAt: '2026-10-28T14:20:00Z',
    solution: {
      summary: 'Vite does not expose node.js process.env by default on the client browser runtime.',
      likelyCause: 'Direct client-side reference to Node environment variable process.env in a Vite application.',
      whyItHappened: 'Vite runs client bundles in strict browser ES module mode where Node process object is unavailable.',
      steps: [
        {
          stepNumber: 1,
          title: 'Migrate API key access to Server-Side API endpoint',
          details: 'Per security constraints, never expose API keys on client browser code. Proxy the request through Express server.ts.',
        },
        {
          stepNumber: 2,
          title: 'Update client code to call local server endpoint',
          details: 'Replace client-side direct fetch with clean endpoint call without passing raw keys.',
          codeOrCommand: 'const res = await fetch("/api/ai/solve-problem", { method: "POST" });',
          executionLocation: 'src/components/MyComponent.tsx',
          verificationMethod: 'Verify request succeeds without ReferenceError in browser console.',
        },
      ],
      correctedCode: '// Server-side (server.ts)\napp.post("/api/data", async (req, res) => {\n  const apiKey = process.env.GEMINI_API_KEY;\n  // call SDK securely\n});',
      alternativeApproach: 'If using Vite client env vars (non-secret), prefix with VITE_ and use import.meta.env.VITE_VAR.',
    },
  },
];

export const INITIAL_SKILLS: SkillItem[] = [
  { id: 'sk_1', userId: 'user_std_001', name: 'Python Programming', category: 'technical', level: 'Advanced', certified: true, certificationName: 'Python Core Institute Cert' },
  { id: 'sk_2', userId: 'user_std_001', name: 'Java & Object Oriented Programming', category: 'technical', level: 'Intermediate' },
  { id: 'sk_3', userId: 'user_std_001', name: 'Data Structures & Algorithms', category: 'technical', level: 'Intermediate' },
  { id: 'sk_4', userId: 'user_std_001', name: 'React & TypeScript', category: 'technical', level: 'Advanced', certified: true, certificationName: 'Meta Front-End Developer' },
  { id: 'sk_5', userId: 'user_std_001', name: 'Database Management (SQL/PostgreSQL)', category: 'technical', level: 'Intermediate' },
  { id: 'sk_6', userId: 'user_std_001', name: 'Git & GitHub Version Control', category: 'tool', level: 'Advanced' },
  { id: 'sk_7', userId: 'user_std_001', name: 'Public Speaking & Technical Communication', category: 'soft_skill', level: 'Intermediate' },
];

export const INITIAL_JOB_OPPORTUNITIES: JobOpportunity[] = [
  {
    id: 'opp_1',
    companyName: 'Lumina Tech Solutions',
    companyLogoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=LuminaTech',
    title: 'Software Development Engineer Intern (SDE Intern)',
    type: 'Internship',
    location: 'Bangalore / Hybrid',
    ctcOrStipend: '₹45,000 / month stipend + PPO up to ₹16 LPA',
    description: 'Looking for passionate CSE/IT undergrads skilled in React, Python, Node.js and DSA.',
    requirements: ['Solid DSA foundation', 'React & TypeScript proficiency', 'REST API design', 'Git & CI/CD basics'],
    applyUrl: 'https://careers.luminatech.example.com/sde-intern',
    deadline: '2026-11-20',
    isSaved: true,
  },
  {
    id: 'opp_2',
    companyName: 'Vertex Cloud Systems',
    companyLogoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=VertexCloud',
    title: 'Junior Graduate Engineer Trainee (GET - Full-Stack)',
    type: 'Full-Time',
    location: 'Hyderabad / On-site',
    ctcOrStipend: '₹12.5 LPA Full-Time Package',
    description: 'Enterprise Cloud SDE role focusing on backend scalability, SQL database optimization, and high-throughput APIs.',
    requirements: ['SQL & Database Design', 'Java / Python / C++', 'Object Oriented Architecture'],
    applyUrl: 'https://vertexcloud.example.com/careers/get',
    deadline: '2026-11-25',
    isSaved: false,
  },
];

export const INITIAL_SAVED_TRACKERS: SavedJobTracker[] = [
  {
    id: 'tr_1',
    userId: 'user_std_001',
    jobId: 'opp_1',
    title: 'Software Development Engineer Intern (SDE Intern)',
    companyName: 'Lumina Tech Solutions',
    status: 'Interview Scheduled',
    appliedDate: '2026-10-26',
    interviewDate: '2026-11-08 at 14:00 IST',
    notes: 'Online coding assessment on Lumina Portal followed by technical interview.',
  },
];

export const INITIAL_RESUME_DATA: ResumeData = {
  userId: 'user_std_001',
  fullName: 'Alex River',
  email: 'alex.river@student.edu',
  phone: '+1 (555) 234-5678',
  location: 'Apex Tech Campus, Bangalore',
  summary: 'Motivated 3rd-year Computer Science undergrad passionate about full-stack engineering, scalable Web/AI applications, and data structures. Demonstrated project experience with React, TypeScript, Node.js, and Gemini API.',
  education: [
    { institution: 'Apex Institute of Technology & Engineering', degree: 'B.Tech Computer Science & Engineering', year: '2023 - 2027', gpa: '8.75 / 10 CGPA' },
  ],
  skills: ['Python', 'Java', 'React.js', 'TypeScript', 'Node.js', 'SQL / PostgreSQL', 'Git & GitHub', 'REST APIs', 'DSA'],
  experience: [
    { company: 'Tech Innovation Club', role: 'Student Technical Lead', duration: '2025 - Present', description: 'Led 15+ student developers building open-source campus web applications.' },
  ],
  projects: [
    { title: 'GoalForge AI - Student Ecosystem', tech: 'React, TypeScript, Express, Gemini API', description: 'Full-stack AI platform unifying goal roadmaps, time-blocking, and technical problem solving.', githubUrl: 'https://github.com/alexriver-dev/goalforge-ai' },
  ],
  achievements: [
    'Unlocked GoalForge Pioneer Badge (Created 3 active goals)',
    'Solved 75+ LeetCode DSA questions',
  ],
  githubUrl: 'https://github.com/alexriver-dev',
  linkedinUrl: 'https://linkedin.com/in/alexriver-dev',
  portfolioUrl: 'https://alexriver.dev',
};

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj_001',
    userId: 'user_std_001',
    title: 'GoalForge AI - Student Ecosystem',
    description: 'Unified AI-powered platform for academic goal tracking, daily schedule optimization, skill-gap analysis, and student career management.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Gemini API', 'Firebase', 'Express'],
    githubUrl: 'https://github.com/alexriver-dev/goalforge-ai',
    liveUrl: 'https://goalforge.ai-demo.app',
    deadline: '2026-11-20',
    progressPercentage: 85,
    status: 'in_progress',
    tasks: [
      { id: 'pt_1', title: 'Implement AI Problem Solver diagnostic parser', completed: true },
      { id: 'pt_2', title: 'Add SkillTrack gap analysis UI', completed: true },
      { id: 'pt_3', title: 'Add Resume PDF export feature', completed: true },
    ],
    notes: 'Architecture uses server-side Gemini 3.8 Flash calls on Express backend.',
    aiDocumentation: 'GoalForge AI unifies goal roadmaps, daily routine planning, and AI problem solving into one PWA.',
    createdAt: '2026-09-10T10:00:00Z',
  },
];

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  { id: 'ach_1', title: 'GoalForge Pioneer', description: 'Created 3 independent active goals', iconName: 'Target', unlocked: true, unlockedAt: '2026-09-15' },
  { id: 'ach_2', title: 'Problem Solver', description: 'Solved 10 programming issues using AI Solver', iconName: 'Terminal', unlocked: true, unlockedAt: '2026-10-20' },
  { id: 'ach_3', title: 'Routine Master', description: 'Completed 100% of daily scheduled routine for 5 consecutive days', iconName: 'Clock', unlocked: true, unlockedAt: '2026-10-25' },
  { id: 'ach_4', title: 'Placement Ready', description: 'Reached 80%+ Placement Readiness Score', iconName: 'Award', unlocked: true, unlockedAt: '2026-10-28' },
  { id: 'ach_5', title: 'Skill Builder', description: 'Verified 5 technical skills on SkillTrack', iconName: 'Zap', unlocked: true, unlockedAt: '2026-10-29' },
];
