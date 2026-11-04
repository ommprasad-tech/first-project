export type BranchCategory =
  | 'CSE_IT'
  | 'MECHANICAL'
  | 'ELECTRICAL'
  | 'CIVIL'
  | 'CHEMICAL'
  | 'SCIENCE'
  | 'COMMERCE'
  | 'ARTS_HUMANITIES'
  | 'DIPLOMA'
  | 'COMPETITIVE_EXAMS';

export interface UserProfile {
  uid: string;
  publicId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  createdAt: string;

  // Academic & Student details
  institution?: string;
  course?: string;
  branch?: BranchCategory;
  semesterYear?: string;
  graduationYear?: number;
  cgpa?: number;
  skills?: string[];
  subjects?: string[];
  interests?: string[];
  careerGoal?: string;
  currentLearningLevel?: 'beginner' | 'intermediate' | 'advanced';

  // Schedule Preferences
  dailyStudyHours?: number;
  wakeTime?: string;
  sleepTime?: string;
  preferredStudyTime?: string;

  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  placementReadinessScore?: number; // 0-100
  theme?: 'dark' | 'light';
}

export interface GoalTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  estimatedMinutes?: number;
  actualMinutesSpent?: number;
  status?: 'pending' | 'completed' | 'skipped';
  type: 'daily' | 'weekly' | 'milestone';
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
  tasks: GoalTask[];
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  currentLevel: string;
  targetLevel: string;
  category: string;
  availableHoursPerDay?: number;
  progressPercentage: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  milestones: Milestone[];
  dailyTasks: GoalTask[];
  weeklyTasks: GoalTask[];
  requiredSkills?: string[];
  recommendedResources?: string[];
  practiceActivities?: string[];
  completionCriteria?: string;
  aiRoadmapGenerated?: boolean;
  aiPlanSummary?: string;
}

export interface RoutineActivity {
  id: string;
  startTime: string; // e.g. "07:00"
  endTime: string;   // e.g. "08:00"
  title: string;
  category: 'wake' | 'college' | 'study' | 'coding' | 'meal' | 'exercise' | 'personal' | 'break' | 'night' | 'other';
  completed: boolean;
  skipped?: boolean;
  rescheduledTime?: string;
  notes?: string;
  missedReason?: string;
}

export interface DailyHistoryRecord {
  id: string; // YYYY-MM-DD
  userId: string;
  date: string; // YYYY-MM-DD
  routineSnapshot: RoutineActivity[];
  completedActivitiesCount: number;
  totalActivitiesCount: number;
  routineCompletionPercentage: number;
  studyHours: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  missedTasksCount: number;
  eveningReview?: {
    completedSummary: string;
    missedSummary: string;
    difficulties: string;
    studyHoursLogged: number;
    goalTasksDone: boolean;
    productivityRating: number; // 1-5 or %
    aiImprovementSuggestions: string[];
    encouragement: string;
  };
  productivityScore: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime?: string;
  deadline?: string;
  dueDate: string; // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'missed';
  assignedGoalId?: string;
  assignedProjectId?: string;
  category: 'academic' | 'coding' | 'personal' | 'career';
  actualMinutesSpent?: number;
  createdAt: string;
}

export interface SubjectTopic {
  id: string;
  title: string;
  completed: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  revisionScheduledDate?: string;
  notes?: string;
}

export interface SubjectItem {
  id: string;
  userId: string;
  name: string;
  code?: string;
  examDate?: string;
  targetRevisionHours: number;
  completedRevisionHours: number;
  topics: SubjectTopic[];
  aiStudyPlan?: string;
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  category: 'goal' | 'task' | 'study' | 'exam' | 'project' | 'interview' | 'reminder' | 'event' | 'routine';
  isUrgent?: boolean;
}

export interface ProblemSolutionStep {
  stepNumber: number;
  title: string;
  details: string;
  codeOrCommand?: string;
  executionLocation?: string;
  verificationMethod?: string;
  warnings?: string;
}

export interface ProblemHistoryItem {
  id: string;
  userId: string;
  category: string;
  query: string;
  codeSnippet?: string;
  errorMessage?: string;
  screenshotUrl?: string;
  language?: string;
  solution: {
    summary: string;
    likelyCause: string;
    whyItHappened: string;
    steps: ProblemSolutionStep[];
    correctedCode?: string;
    alternativeApproach?: string;
    destructiveWarning?: string;
  };
  createdAt: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'course' | 'video' | 'article' | 'practice';
  url?: string;
  completed: boolean;
}

export interface SkillItem {
  id: string;
  userId: string;
  name: string;
  category: 'technical' | 'soft_skill' | 'language' | 'tool';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  targetLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  progressPercentage?: number;
  certified?: boolean;
  certificationName?: string;
  certificateFileUrl?: string;
  lastAssessedDate?: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string;
  type: 'Full-Time' | 'Internship' | 'Apprenticeship';
  location: string;
  ctcOrStipend: string;
  description: string;
  requirements: string[];
  applyUrl: string;
  deadline: string;
  isSaved?: boolean;
}

export interface SavedJobTracker {
  id: string;
  userId: string;
  jobId: string;
  title: string;
  companyName: string;
  status: 'Saved' | 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected';
  appliedDate?: string;
  interviewDate?: string;
  notes?: string;
}

export interface ResumeData {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: { institution: string; degree: string; year: string; gpa: string }[];
  skills: string[];
  experience: { company: string; role: string; duration: string; description: string }[];
  projects: { title: string; tech: string; description: string; githubUrl?: string }[];
  achievements: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface SkillGapAnalysisResult {
  currentLevelSummary: string;
  recommendedSkillsToLearn: { name: string; category: string; priority: 'high' | 'medium' | 'low'; reason: string }[];
  missingCoreSkills: string[];
  suggestedProjectsToBuild: string[];
  learningTimelineWeeks: number;
}

export interface ProjectItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  techStack: string[];
  teamMembers?: string[];
  githubUrl?: string;
  liveUrl?: string;
  deadline?: string;
  progressPercentage: number;
  status: 'planning' | 'in_progress' | 'completed';
  tasks: { id: string; title: string; completed: boolean }[];
  notes?: string;
  aiDocumentation?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task' | 'goal' | 'study' | 'exam' | 'project' | 'interview' | 'checkin' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

