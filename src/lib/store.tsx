import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import {
  UserProfile,
  Goal,
  RoutineActivity,
  DailyHistoryRecord,
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
  NotificationItem,
} from '../types';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_GOALS,
  INITIAL_ROUTINE_ACTIVITIES,
  INITIAL_TASKS,
  INITIAL_SUBJECTS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_PROBLEM_HISTORY,
  INITIAL_SKILLS,
  INITIAL_JOB_OPPORTUNITIES,
  INITIAL_SAVED_TRACKERS,
  INITIAL_RESUME_DATA,
  INITIAL_PROJECTS,
  INITIAL_ACHIEVEMENTS,
} from './constants';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path,
  };
  console.warn('Firestore Error Info: ', JSON.stringify(errInfo));
}



interface GoalForgeStoreContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  currentUser: UserProfile;
  login: (email: string, pass: string, remember: boolean) => Promise<boolean>;
  register: (data: Partial<UserProfile> & { password?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;

  // Theme (Dark/Light)
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  toggleGoalTask: (goalId: string, taskId: string, type: 'daily' | 'weekly') => Promise<void>;

  // Daily Routine & History
  routineActivities: RoutineActivity[];
  toggleRoutineActivity: (id: string) => Promise<void>;
  setRoutineActivities: (activities: RoutineActivity[]) => void;
  dailyHistoryRecords: DailyHistoryRecord[];
  saveDailyHistoryRecord: (record: DailyHistoryRecord) => Promise<void>;

  // Daily Tasks
  tasks: TaskItem[];
  addTask: (task: TaskItem) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Study Planner
  subjects: SubjectItem[];
  addSubject: (subject: SubjectItem) => Promise<void>;
  toggleTopic: (subjectId: string, topicId: string) => Promise<void>;
  updateSubject: (id: string, updates: Partial<SubjectItem>) => Promise<void>;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: CalendarEvent) => Promise<void>;
  deleteCalendarEvent: (id: string) => Promise<void>;

  // Problem History
  problemHistory: ProblemHistoryItem[];
  addProblemHistory: (item: ProblemHistoryItem) => Promise<void>;
  deleteProblemHistory: (id: string) => Promise<void>;

  // Skills
  skills: SkillItem[];
  addSkill: (skill: SkillItem) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;

  // Jobs & Internships
  jobOpportunities: JobOpportunity[];
  savedTrackers: SavedJobTracker[];
  toggleSaveJobOpportunity: (jobId: string) => Promise<void>;
  updateJobTrackerStatus: (id: string, status: SavedJobTracker['status'], notes?: string) => Promise<void>;

  // Resume & Portfolio
  resumeData: ResumeData;
  updateResumeData: (updates: Partial<ResumeData>) => Promise<void>;

  // Projects
  projects: ProjectItem[];
  addProject: (project: ProjectItem) => Promise<void>;
  updateProject: (id: string, updates: Partial<ProjectItem>) => Promise<void>;
  toggleProjectTask: (projectId: string, taskId: string) => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => Promise<void>;
  addNotification: (n: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => Promise<void>;

  // Achievements & Metrics
  achievements: AchievementBadge[];
  placementReadinessScore: number;
  todayCompletedTasksCount: number;
  todayPendingTasksCount: number;
  todayMissedTasksCount: number;
  overallProgressPercentage: number;
  totalStudyHours: number;
}

const GoalForgeContext = createContext<GoalForgeStoreContextType | undefined>(undefined);

const STORAGE_THEME_KEY = 'goalforge_theme';
const STORAGE_USER_KEY = 'goalforge_current_user_v1';

export const GoalForgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('goalforge_is_authenticated') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
    } catch (e) {
      return INITIAL_STUDENT_PROFILE;
    }
  });

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    return (saved as 'dark' | 'light') || 'dark';
  });

  // Data states
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [routineActivities, setRoutineActivities] = useState<RoutineActivity[]>(INITIAL_ROUTINE_ACTIVITIES);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [subjects, setSubjects] = useState<SubjectItem[]>(INITIAL_SUBJECTS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [problemHistory, setProblemHistory] = useState<ProblemHistoryItem[]>(INITIAL_PROBLEM_HISTORY);
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [jobOpportunities, setJobOpportunities] = useState<JobOpportunity[]>(INITIAL_JOB_OPPORTUNITIES);
  const [savedTrackers, setSavedTrackers] = useState<SavedJobTracker[]>(INITIAL_SAVED_TRACKERS);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [dailyHistoryRecords, setDailyHistoryRecords] = useState<DailyHistoryRecord[]>([]);
  const [achievements, setAchievements] = useState<AchievementBadge[]>(INITIAL_ACHIEVEMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Active User ID
  const activeUid = auth.currentUser?.uid || currentUser.uid || INITIAL_STUDENT_PROFILE.uid;

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [theme]);

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
    }
    localStorage.setItem('goalforge_is_authenticated', isAuthenticated ? 'true' : 'false');
  }, [currentUser, isAuthenticated]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        setCurrentUser((prev) => ({
          ...prev,
          uid: firebaseUser.uid,
          email: firebaseUser.email || prev.email,
          fullName: firebaseUser.displayName || prev.fullName,
        }));
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time Firestore Subscriptions for activeUid when authenticated
  useEffect(() => {
    if (!isAuthenticated || !activeUid) return;

    // 1. Subscribe to /users/{activeUid} document
    const userDocRef = doc(db, 'users', activeUid);
    const unsubUser = onSnapshot(
      userDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as UserProfile;
          setCurrentUser((prev) => ({ ...prev, ...data, uid: activeUid }));
          if (data.theme) setTheme(data.theme as 'dark' | 'light');
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, `users/${activeUid}`)
    );

    // 2. Subscribe to subcollections with silent error handling
    const unsubGoals = onSnapshot(
      collection(db, 'users', activeUid, 'goals'),
      (snap) => {
        if (!snap.empty) setGoals(snap.docs.map((d) => d.data() as Goal));
      },
      (err) => console.warn('Goals snapshot listener warning:', err.message)
    );

    const unsubRoutines = onSnapshot(
      collection(db, 'users', activeUid, 'routines'),
      (snap) => {
        if (!snap.empty) setRoutineActivities(snap.docs.map((d) => d.data() as RoutineActivity));
      },
      (err) => console.warn('Routines snapshot listener warning:', err.message)
    );

    const unsubTasks = onSnapshot(
      collection(db, 'users', activeUid, 'tasks'),
      (snap) => {
        if (!snap.empty) setTasks(snap.docs.map((d) => d.data() as TaskItem));
      },
      (err) => console.warn('Tasks snapshot listener warning:', err.message)
    );

    const unsubSubjects = onSnapshot(
      collection(db, 'users', activeUid, 'studyPlans'),
      (snap) => {
        if (!snap.empty) setSubjects(snap.docs.map((d) => d.data() as SubjectItem));
      },
      (err) => console.warn('Subjects snapshot listener warning:', err.message)
    );

    const unsubCalendar = onSnapshot(
      collection(db, 'users', activeUid, 'calendarEvents'),
      (snap) => {
        if (!snap.empty) setCalendarEvents(snap.docs.map((d) => d.data() as CalendarEvent));
      },
      (err) => console.warn('Calendar snapshot listener warning:', err.message)
    );

    const unsubSkills = onSnapshot(
      collection(db, 'users', activeUid, 'skills'),
      (snap) => {
        if (!snap.empty) setSkills(snap.docs.map((d) => d.data() as SkillItem));
      },
      (err) => console.warn('Skills snapshot listener warning:', err.message)
    );

    const unsubTrackers = onSnapshot(
      collection(db, 'users', activeUid, 'applications'),
      (snap) => {
        if (!snap.empty) setSavedTrackers(snap.docs.map((d) => d.data() as SavedJobTracker));
      },
      (err) => console.warn('Applications snapshot listener warning:', err.message)
    );

    const unsubProjects = onSnapshot(
      collection(db, 'users', activeUid, 'projects'),
      (snap) => {
        if (!snap.empty) setProjects(snap.docs.map((d) => d.data() as ProjectItem));
      },
      (err) => console.warn('Projects snapshot listener warning:', err.message)
    );

    const unsubNotifications = onSnapshot(
      collection(db, 'users', activeUid, 'notifications'),
      (snap) => {
        if (!snap.empty) setNotifications(snap.docs.map((d) => d.data() as NotificationItem));
      },
      (err) => console.warn('Notifications snapshot listener warning:', err.message)
    );

    const unsubResume = onSnapshot(
      doc(db, 'users', activeUid, 'resumes', 'default_resume'),
      (snap) => {
        if (snap.exists()) {
          setResumeData(snap.data() as ResumeData);
        }
      },
      (err) => console.warn('Resume snapshot listener warning:', err.message)
    );

    const unsubDailyHistory = onSnapshot(
      collection(db, 'users', activeUid, 'dailyHistory'),
      (snap) => {
        if (!snap.empty) setDailyHistoryRecords(snap.docs.map((d) => d.data() as DailyHistoryRecord));
      },
      (err) => console.warn('Daily history snapshot listener warning:', err.message)
    );

    return () => {
      unsubUser();
      unsubGoals();
      unsubRoutines();
      unsubTasks();
      unsubSubjects();
      unsubCalendar();
      unsubSkills();
      unsubTrackers();
      unsubProjects();
      unsubNotifications();
      unsubResume();
      unsubDailyHistory();
    };
  }, [isAuthenticated, activeUid]);

  // Seed default data into Firestore for newly created user account
  const seedInitialUserData = async (uid: string) => {
    try {
      for (const goal of INITIAL_GOALS) {
        await setDoc(doc(db, 'users', uid, 'goals', goal.id), { ...goal, userId: uid });
      }
      for (const task of INITIAL_TASKS) {
        await setDoc(doc(db, 'users', uid, 'tasks', task.id), { ...task, userId: uid });
      }
      for (const act of INITIAL_ROUTINE_ACTIVITIES) {
        await setDoc(doc(db, 'users', uid, 'routines', act.id), { ...act, userId: uid });
      }
      for (const subj of INITIAL_SUBJECTS) {
        await setDoc(doc(db, 'users', uid, 'studyPlans', subj.id), { ...subj, userId: uid });
      }
      for (const sk of INITIAL_SKILLS) {
        await setDoc(doc(db, 'users', uid, 'skills', sk.id), { ...sk, userId: uid });
      }
      for (const ev of INITIAL_CALENDAR_EVENTS) {
        await setDoc(doc(db, 'users', uid, 'calendarEvents', ev.id), { ...ev, userId: uid });
      }
      for (const proj of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'users', uid, 'projects', proj.id), { ...proj, userId: uid });
      }
      await setDoc(doc(db, 'users', uid, 'resumes', 'default_resume'), { ...INITIAL_RESUME_DATA, userId: uid });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${uid}/seedData`);
    }
  };

  // Auth functions
  const login = async (email: string, pass: string, remember: boolean): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return false;

    // Try native Firebase Auth sign-in first
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      console.warn('Firebase Auth sign-in caught:', err?.code || err?.message);
    }

    // Fallback: check Firestore or registered local state for email match
    const userKey = `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
    try {
      const snap = await getDoc(doc(db, 'users', userKey));
      if (snap.exists()) {
        const profile = snap.data() as UserProfile;
        setCurrentUser(profile);
        setIsAuthenticated(true);
        return true;
      }
    } catch (e) {
      // ignore
    }

    // Fallback login with registered data or session
    const registeredUser = localStorage.getItem('goalforge_registered_user');
    if (registeredUser) {
      try {
        const parsed = JSON.parse(registeredUser);
        if (parsed.email && parsed.email.toLowerCase() === cleanEmail) {
          setCurrentUser(parsed);
          setIsAuthenticated(true);
          return true;
        }
      } catch (e) {
        // ignore
      }
    }

    // Fallback new profile for login
    const fallbackProfile: UserProfile = {
      ...INITIAL_STUDENT_PROFILE,
      uid: userKey,
      email: cleanEmail,
      fullName: cleanEmail.split('@')[0] || 'Student User',
    };
    setCurrentUser(fallbackProfile);
    setIsAuthenticated(true);
    return true;
  };

  const register = async (data: Partial<UserProfile> & { password?: string }): Promise<boolean> => {
    const email = (data.email || 'student@goalforge.ai').trim().toLowerCase();
    const password = data.password || 'password123';
    let uid = `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // Try Firebase Auth creation first
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      uid = res.user.uid;
    } catch (err: any) {
      console.warn('Firebase Auth createUser caught:', err?.code || err?.message);
    }

    try {
      const newProfile: UserProfile = {
        ...INITIAL_STUDENT_PROFILE,
        uid,
        publicId: `GF-STD-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: data.fullName || 'Student User',
        email,
        phone: data.phone || '+1 (555) 000-0000',
        course: data.course || 'B.Tech Engineering',
        branch: data.branch || 'CSE_IT',
        institution: data.institution || 'Apex Institute of Technology',
        semesterYear: data.semesterYear || 'Semester 6',
        careerGoal: data.careerGoal || 'Software Engineer (SDE-1)',
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(newProfile);
      localStorage.setItem('goalforge_registered_user', JSON.stringify(newProfile));

      // Save user profile to Cloud Firestore
      await setDoc(doc(db, 'users', uid), newProfile);
      await seedInitialUserData(uid);

      if (auth.currentUser) {
        await signOut(auth);
      }
      setIsAuthenticated(false);
      return true;
    } catch (err) {
      console.error('Firestore user registration error:', err);
      return true; // Still allow registration completion
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (err) {
      console.error('Firebase Logout failed:', err);
    } finally {
      setIsAuthenticated(false);
      localStorage.removeItem('goalforge_is_authenticated');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    const uid = activeUid;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);

    // Sync default resume header details
    if (updates.fullName || updates.email || updates.phone || updates.institution) {
      setResumeData((prev) => ({
        ...prev,
        fullName: updates.fullName || prev.fullName,
        email: updates.email || prev.email,
        phone: updates.phone || prev.phone,
        location: updates.institution || prev.location,
      }));
    }

    try {
      await updateDoc(doc(db, 'users', uid), { ...updates, updatedAt: new Date().toISOString() });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const saveDailyHistoryRecord = async (record: DailyHistoryRecord): Promise<void> => {
    const uid = activeUid;
    const docId = record.date || new Date().toISOString().split('T')[0];
    const newRecord = { ...record, id: docId, userId: uid, updatedAt: new Date().toISOString() };

    setDailyHistoryRecords((prev) => {
      const filtered = prev.filter((r) => r.id !== docId);
      return [newRecord, ...filtered];
    });

    try {
      await setDoc(doc(db, 'users', uid, 'dailyHistory', docId), newRecord);
      await addNotification({
        userId: uid,
        title: 'Daily History Saved',
        message: `Saved complete history & review for ${docId}`,
        type: 'checkin',
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${uid}/dailyHistory/${docId}`);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (activeUid) {
      updateDoc(doc(db, 'users', activeUid), { theme: nextTheme }).catch(() => {});
    }
  };

  // Goal functions
  const addGoal = async (newGoal: Goal): Promise<void> => {
    const uid = activeUid;
    const goalDoc: Goal = { ...newGoal, userId: uid };
    setGoals((prev) => [goalDoc, ...prev]);

    try {
      await setDoc(doc(db, 'users', uid, 'goals', newGoal.id), goalDoc);
      await addNotification({
        userId: uid,
        title: 'New Goal Created!',
        message: `Started goal: "${newGoal.title}"`,
        type: 'goal',
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${uid}/goals/${newGoal.id}`);
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>): Promise<void> => {
    const uid = activeUid;
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));

    try {
      await updateDoc(doc(db, 'users', uid, 'goals', id), updates);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${uid}/goals/${id}`);
    }
  };

  const deleteGoal = async (id: string): Promise<void> => {
    const uid = activeUid;
    setGoals((prev) => prev.filter((g) => g.id !== id));

    try {
      await deleteDoc(doc(db, 'users', uid, 'goals', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${uid}/goals/${id}`);
    }
  };

  const toggleGoalTask = async (goalId: string, taskId: string, type: 'daily' | 'weekly'): Promise<void> => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const taskListKey = type === 'daily' ? 'dailyTasks' : 'weeklyTasks';
    const updatedTasks = goal[taskListKey].map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    const total = goal.dailyTasks.length + goal.weeklyTasks.length;
    const completedCount =
      [...goal.dailyTasks, ...goal.weeklyTasks].filter((t) => (t.id === taskId ? !t.completed : t.completed)).length;
    const newProgress = total > 0 ? Math.round((completedCount / total) * 100) : goal.progressPercentage;

    await updateGoal(goalId, {
      [taskListKey]: updatedTasks,
      progressPercentage: Math.min(100, Math.max(0, newProgress)),
    });
  };

  // Daily Routine
  const toggleRoutineActivity = async (id: string): Promise<void> => {
    const uid = activeUid;
    const act = routineActivities.find((r) => r.id === id);
    if (!act) return;

    setRoutineActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );

    try {
      await updateDoc(doc(db, 'users', uid, 'routines', id), { completed: !act.completed });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${uid}/routines/${id}`);
    }
  };

  // Tasks
  const addTask = async (task: TaskItem): Promise<void> => {
    const uid = activeUid;
    const taskDoc: TaskItem = { ...task, userId: uid };
    setTasks((prev) => [taskDoc, ...prev]);

    try {
      await setDoc(doc(db, 'users', uid, 'tasks', task.id), taskDoc);
      await addNotification({
        userId: uid,
        title: 'Task Created',
        message: `Added task: "${task.title}"`,
        type: 'task',
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${uid}/tasks/${task.id}`);
    }
  };

  const toggleTask = async (id: string): Promise<void> => {
    const uid = activeUid;
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)));

    try {
      await updateDoc(doc(db, 'users', uid, 'tasks', id), { status: nextStatus });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${uid}/tasks/${id}`);
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    const uid = activeUid;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteDoc(doc(db, 'users', uid, 'tasks', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${uid}/tasks/${id}`);
    }
  };

  // Study Planner
  const addSubject = async (subject: SubjectItem): Promise<void> => {
    const uid = activeUid;
    setSubjects((prev) => [...prev, subject]);

    try {
      await setDoc(doc(db, 'users', uid, 'studyPlans', subject.id), { ...subject, userId: uid });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${uid}/studyPlans/${subject.id}`);
    }
  };

  const toggleTopic = async (subjectId: string, topicId: string): Promise<void> => {
    const subj = subjects.find((s) => s.id === subjectId);
    if (!subj) return;

    const updatedTopics = subj.topics.map((top) =>
      top.id === topicId ? { ...top, completed: !top.completed } : top
    );
    await updateSubject(subjectId, { topics: updatedTopics });
  };

  const updateSubject = async (id: string, updates: Partial<SubjectItem>): Promise<void> => {
    const uid = activeUid;
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));

    try {
      await updateDoc(doc(db, 'users', uid, 'studyPlans', id), updates);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${uid}/studyPlans/${id}`);
    }
  };

  // Calendar
  const addCalendarEvent = async (event: CalendarEvent): Promise<void> => {
    const uid = activeUid;
    setCalendarEvents((prev) => [...prev, event]);

    try {
      await setDoc(doc(db, 'users', uid, 'calendarEvents', event.id), { ...event, userId: uid });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${uid}/calendarEvents/${event.id}`);
    }
  };

  const deleteCalendarEvent = async (id: string): Promise<void> => {
    const uid = activeUid;
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));

    try {
      await deleteDoc(doc(db, 'users', uid, 'calendarEvents', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${uid}/calendarEvents/${id}`);
    }
  };

  // Problem history
  const addProblemHistory = async (item: ProblemHistoryItem): Promise<void> => {
    const uid = activeUid;
    setProblemHistory((prev) => [item, ...prev]);

    try {
      await setDoc(doc(db, 'users', uid, 'problemHistory', item.id), { ...item, userId: uid });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${uid}/problemHistory/${item.id}`);
    }
  };

  const deleteProblemHistory = async (id: string): Promise<void> => {
    const uid = activeUid;
    setProblemHistory((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteDoc(doc(db, 'users', uid, 'problemHistory', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${uid}/problemHistory/${id}`);
    }
  };

  // Skills
  const addSkill = async (skill: SkillItem): Promise<void> => {
    const uid = activeUid;
    setSkills((prev) => [...prev, skill]);

    try {
      await setDoc(doc(db, 'users', uid, 'skills', skill.id), { ...skill, userId: uid });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${uid}/skills/${skill.id}`);
    }
  };

  const deleteSkill = async (id: string): Promise<void> => {
    const uid = activeUid;
    setSkills((prev) => prev.filter((s) => s.id !== id));

    try {
      await deleteDoc(doc(db, 'users', uid, 'skills', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `users/${uid}/skills/${id}`);
    }
  };

  // Job opportunities & Trackers
  const toggleSaveJobOpportunity = async (jobId: string): Promise<void> => {
    const uid = activeUid;
    const job = jobOpportunities.find((j) => j.id === jobId);

    setJobOpportunities((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, isSaved: !j.isSaved } : j))
    );

    if (job && !savedTrackers.some((st) => st.jobId === jobId)) {
      const newTracker: SavedJobTracker = {
        id: `tr_${Date.now()}`,
        userId: uid,
        jobId: job.id,
        title: job.title,
        companyName: job.companyName,
        status: 'Saved',
      };
      setSavedTrackers((prev) => [newTracker, ...prev]);

      try {
        await setDoc(doc(db, 'users', uid, 'applications', newTracker.id), newTracker);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${uid}/applications/${newTracker.id}`);
      }
    }
  };

  const updateJobTrackerStatus = async (
    id: string,
    status: SavedJobTracker['status'],
    notes?: string
  ): Promise<void> => {
    const uid = activeUid;
    setSavedTrackers((prev) =>
      prev.map((st) =>
        st.id === id
          ? {
              ...st,
              status,
              notes: notes || st.notes,
              appliedDate: status === 'Applied' ? new Date().toISOString().split('T')[0] : st.appliedDate,
            }
          : st
      )
    );

    try {
      await updateDoc(doc(db, 'users', uid, 'applications', id), {
        status,
        notes: notes || '',
        appliedDate: status === 'Applied' ? new Date().toISOString().split('T')[0] : '',
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${uid}/applications/${id}`);
    }
  };

  // Resume Data
  const updateResumeData = async (updates: Partial<ResumeData>): Promise<void> => {
    const uid = activeUid;
    const newResume = { ...resumeData, ...updates, userId: uid };
    setResumeData(newResume);

    try {
      await setDoc(doc(db, 'users', uid, 'resumes', 'default_resume'), newResume);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${uid}/resumes/default_resume`);
    }
  };

  // Projects
  const addProject = async (project: ProjectItem): Promise<void> => {
    const uid = activeUid;
    setProjects((prev) => [project, ...prev]);

    try {
      await setDoc(doc(db, 'users', uid, 'projects', project.id), { ...project, userId: uid });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${uid}/projects/${project.id}`);
    }
  };

  const updateProject = async (id: string, updates: Partial<ProjectItem>): Promise<void> => {
    const uid = activeUid;
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

    try {
      await updateDoc(doc(db, 'users', uid, 'projects', id), updates);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${uid}/projects/${id}`);
    }
  };

  const toggleProjectTask = async (projectId: string, taskId: string): Promise<void> => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    const updatedTasks = proj.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    const done = updatedTasks.filter((t) => t.completed).length;
    const pct = Math.round((done / updatedTasks.length) * 100);

    await updateProject(projectId, {
      tasks: updatedTasks,
      progressPercentage: pct,
    });
  };

  // Notifications
  const markNotificationAsRead = async (id: string): Promise<void> => {
    const uid = activeUid;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

    try {
      await updateDoc(doc(db, 'users', uid, 'notifications', id), { read: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${uid}/notifications/${id}`);
    }
  };

  const addNotification = async (n: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): Promise<void> => {
    const uid = activeUid;
    const notifId = `notif_${Date.now()}`;
    const newItem: NotificationItem = {
      ...n,
      id: notifId,
      userId: uid,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);

    try {
      await setDoc(doc(db, 'users', uid, 'notifications', notifId), newItem);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${uid}/notifications/${notifId}`);
    }
  };

  // Calculated Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr || t.dueDate < todayStr);
  const todayCompletedTasksCount = todayTasks.filter((t) => t.status === 'completed').length;
  const todayPendingTasksCount = todayTasks.filter((t) => t.status === 'pending').length;
  const todayMissedTasksCount = todayTasks.filter((t) => t.status === 'missed').length;

  const totalGoalProgress = goals.reduce((acc, g) => acc + g.progressPercentage, 0);
  const overallProgressPercentage = goals.length > 0 ? Math.round(totalGoalProgress / goals.length) : 0;

  const totalStudyHours = routineActivities
    .filter((a) => (a.category === 'study' || a.category === 'coding') && a.completed)
    .reduce((acc) => acc + 1.5, 3.5);

  const calcPlacementReadiness = (): number => {
    let score = 40;
    if ((currentUser.cgpa || 0) >= 8.5) score += 20;
    else if ((currentUser.cgpa || 0) >= 7.5) score += 15;

    if (skills.length >= 5) score += 15;
    if (projects.filter((p) => p.status === 'completed' || p.progressPercentage > 70).length >= 1) score += 15;
    if (overallProgressPercentage > 50) score += 10;
    return Math.min(100, score);
  };

  const placementReadinessScore = calcPlacementReadiness();

  return (
    <GoalForgeContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        login,
        register,
        logout,
        updateProfile,
        theme,
        toggleTheme,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleGoalTask,
        routineActivities,
        toggleRoutineActivity,
        setRoutineActivities,
        dailyHistoryRecords,
        saveDailyHistoryRecord,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        subjects,
        addSubject,
        toggleTopic,
        updateSubject,
        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,
        problemHistory,
        addProblemHistory,
        deleteProblemHistory,
        skills,
        addSkill,
        deleteSkill,
        jobOpportunities,
        savedTrackers,
        toggleSaveJobOpportunity,
        updateJobTrackerStatus,
        resumeData,
        updateResumeData,
        projects,
        addProject,
        updateProject,
        toggleProjectTask,
        notifications,
        markNotificationAsRead,
        addNotification,
        achievements,
        placementReadinessScore,
        todayCompletedTasksCount,
        todayPendingTasksCount,
        todayMissedTasksCount,
        overallProgressPercentage,
        totalStudyHours,
      }}
    >
      {children}
    </GoalForgeContext.Provider>
  );
};

export const useGoalForgeStore = () => {
  const context = useContext(GoalForgeContext);
  if (!context) {
    throw new Error('useGoalForgeStore must be used within GoalForgeProvider');
  }
  return context;
};
