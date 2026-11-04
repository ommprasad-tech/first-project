import { SkillGapAnalysisResult } from '../types';

export async function callAiSolveProblem(payload: {
  query: string;
  codeSnippet?: string;
  errorMessage?: string;
  category?: string;
  language?: string;
}) {
  const response = await fetch('/api/ai/solve-problem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to solve problem with AI');
  }
  return response.json();
}

export async function callAiGenerateRoadmap(payload: {
  goalTitle: string;
  description?: string;
  currentLevel: string;
  targetLevel: string;
  targetDate: string;
  category?: string;
  branch?: string;
}) {
  const response = await fetch('/api/ai/generate-roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to generate AI roadmap');
  }
  return response.json();
}

export async function callAiGenerateRoutine(payload: {
  wakeTime: string;
  sleepTime: string;
  collegeStartTime: string;
  collegeEndTime: string;
  studyTargetHours: number;
  activeGoalTitles: string[];
}) {
  const response = await fetch('/api/ai/generate-routine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to generate daily routine');
  }
  return response.json();
}

export async function callAiGenerateStudyPlan(payload: {
  subjectName: string;
  examDate?: string;
  targetRevisionHours: number;
  topics: string[];
}) {
  const response = await fetch('/api/ai/generate-study-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to generate AI study plan');
  }
  return response.json();
}

export async function callAiAnalyzeSkillGap(payload: {
  studentSkills: string[];
  targetRole: string;
}): Promise<SkillGapAnalysisResult> {
  const response = await fetch('/api/ai/skill-gap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to analyze skill gap');
  }
  return response.json();
}

export async function callAiResumeSuggestions(payload: {
  summary: string;
  skills: string[];
  experience: any[];
  projects: any[];
  careerGoal?: string;
}) {
  const response = await fetch('/api/ai/resume-suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to generate resume suggestions');
  }
  return response.json();
}

export async function callAiRecommendNextGoal(payload: {
  completedGoalTitles: string[];
  skills: string[];
  careerGoal: string;
  branch: string;
}) {
  const response = await fetch('/api/ai/recommend-next-goal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to generate next goal recommendations');
  }
  return response.json();
}

export async function callAiProjectAssistant(payload: {
  title: string;
  description: string;
  techStack: string[];
  action: 'documentation' | 'task_breakdown' | 'architecture_advice' | 'code_review';
}) {
  const response = await fetch('/api/ai/project-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to run AI Project Assistant');
  }
  return response.json();
}

export async function callAiDailyCheckIn(payload: {
  completedTasks: string[];
  pendingTasks: string[];
  learnedToday: string;
  studyHours: number;
  challenges: string;
}) {
  const response = await fetch('/api/ai/daily-checkin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to analyze daily check-in');
  }
  return response.json();
}
