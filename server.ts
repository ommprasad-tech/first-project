import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini Client setup per Skill guidelines
const apiKey = process.env.GEMINI_API_KEY || 'MY_GEMINI_API_KEY';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for structured AI responses
async function generateAiJson(prompt: string, schema: any, systemInstruction?: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'You are GoalForge AI, an expert student career, academic, and technical automation assistant.',
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });
    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

// 1. AI Problem Solver Endpoint
app.post('/api/ai/solve-problem', async (req, res) => {
  try {
    const { query, codeSnippet, errorMessage, category, language } = req.body;

    const prompt = `
Analyze and solve the following technical/academic problem for a student:
- Category: ${category || 'General'}
- Language/Framework: ${language || 'N/A'}
- Problem Description: ${query}
- Code Snippet: ${codeSnippet || 'None'}
- Error Message: ${errorMessage || 'None'}

Produce a thorough, step-by-step diagnostic solution. Follow these exact guidelines:
1. Identify the problem clearly.
2. Explain the root cause.
3. Provide step-by-step resolution steps.
4. Provide corrected code or terminal commands.
5. Specify exactly where to execute (e.g. file path or terminal).
6. Explain how to verify the fix.
7. Provide alternative approach if applicable.
8. Mention any destructive or risky operations to avoid.
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        likelyCause: { type: Type.STRING },
        whyItHappened: { type: Type.STRING },
        steps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              stepNumber: { type: Type.INTEGER },
              title: { type: Type.STRING },
              details: { type: Type.STRING },
              codeOrCommand: { type: Type.STRING },
              executionLocation: { type: Type.STRING },
              verificationMethod: { type: Type.STRING },
              warnings: { type: Type.STRING },
            },
          },
        },
        correctedCode: { type: Type.STRING },
        alternativeApproach: { type: Type.STRING },
        destructiveWarning: { type: Type.STRING },
      },
      required: ['summary', 'likelyCause', 'whyItHappened', 'steps'],
    };

    const result = await generateAiJson(prompt, schema);
    res.json(result);
  } catch (err: any) {
    console.error('Error in solve-problem:', err);
    res.status(500).json({ error: err.message || 'AI Problem Solver failed' });
  }
});

// 2. AI Goal Roadmap Generator Endpoint
app.post('/api/ai/generate-roadmap', async (req, res) => {
  try {
    const { goalTitle, description, currentLevel, targetLevel, targetDate, category, branch } = req.body;

    const prompt = `
Generate a structured learning & execution roadmap for a student with goal: "${goalTitle}".
- Goal Category: ${category || 'Career'}
- Student Branch: ${branch || 'Engineering'}
- Current Level: ${currentLevel}
- Target Level: ${targetLevel}
- Target Date: ${targetDate}
- Description: ${description || ''}

Generate yearly/monthly milestones, weekly tasks, daily micro-tasks, and an overall summary strategy.
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        aiPlanSummary: { type: Type.STRING },
        milestones: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              targetDate: { type: Type.STRING },
              completed: { type: Type.BOOLEAN },
            },
          },
        },
        dailyTasks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              completed: { type: Type.BOOLEAN },
              type: { type: Type.STRING },
            },
          },
        },
        weeklyTasks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              completed: { type: Type.BOOLEAN },
              type: { type: Type.STRING },
            },
          },
        },
      },
      required: ['aiPlanSummary', 'milestones', 'dailyTasks', 'weeklyTasks'],
    };

    const result = await generateAiJson(prompt, schema);
    res.json(result);
  } catch (err: any) {
    console.error('Error in generate-roadmap:', err);
    res.status(500).json({ error: err.message || 'Roadmap generation failed' });
  }
});

// 3. AI Routine Generator Endpoint
app.post('/api/ai/generate-routine', async (req, res) => {
  try {
    const { wakeTime, sleepTime, collegeStartTime, collegeEndTime, studyTargetHours, activeGoalTitles } = req.body;

    const prompt = `
Design a realistic time-blocked daily routine for a student:
- Wake Up: ${wakeTime}
- Sleep Time: ${sleepTime}
- College Timings: ${collegeStartTime} to ${collegeEndTime}
- Target Study Hours: ${studyTargetHours} hours
- Active Goals: ${JSON.stringify(activeGoalTitles || [])}

Break down the full 24-hour cycle into time slots covering wake, exercise, meals, college, coding, deep study, relaxation, and rest.
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        routine: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              startTime: { type: Type.STRING },
              endTime: { type: Type.STRING },
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              completed: { type: Type.BOOLEAN },
              notes: { type: Type.STRING },
            },
          },
        },
        summary: { type: Type.STRING },
      },
      required: ['routine'],
    };

    const result = await generateAiJson(prompt, schema);
    res.json(result);
  } catch (err: any) {
    console.error('Error in generate-routine:', err);
    res.status(500).json({ error: err.message || 'Routine generation failed' });
  }
});

// 4. AI Study Plan Generator Endpoint
app.post('/api/ai/generate-study-plan', async (req, res) => {
  try {
    const { subjectName, examDate, targetRevisionHours, topics } = req.body;

    const prompt = `
Create an optimized study plan for subject "${subjectName}":
- Exam Date: ${examDate}
- Target Revision Hours: ${targetRevisionHours} hours
- Uncompleted Topics: ${JSON.stringify(topics || [])}

Provide topic revision schedule suggestions and key exam tips.
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        aiStudyPlan: { type: Type.STRING },
        suggestedDailyHours: { type: Type.INTEGER },
        highPriorityTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['aiStudyPlan', 'suggestedDailyHours', 'highPriorityTopics'],
    };

    const result = await generateAiJson(prompt, schema);
    res.json(result);
  } catch (err: any) {
    console.error('Error in generate-study-plan:', err);
    res.status(500).json({ error: err.message || 'Study plan generation failed' });
  }
});

// 5. AI Skill Gap Analysis Endpoint
app.post('/api/ai/skill-gap', async (req, res) => {
  try {
    const { studentSkills, targetRole } = req.body;

    const prompt = `
Perform a detailed skill-gap analysis for a student targeting the role: "${targetRole}".
Student Current Skills: ${JSON.stringify(studentSkills || [])}

Compare student skills against industry requirements. Output matched skills, missing skills, recommended courses/topics, and a 4-step action plan.
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        targetRole: { type: Type.STRING },
        matchPercentage: { type: Type.INTEGER },
        matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendedCourses: { type: Type.ARRAY, items: { type: Type.STRING } },
        actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['targetRole', 'matchPercentage', 'matchedSkills', 'missingSkills', 'recommendedCourses', 'actionPlan'],
    };

    const result = await generateAiJson(prompt, schema);
    res.json(result);
  } catch (err: any) {
    console.error('Error in skill-gap:', err);
    res.status(500).json({ error: err.message || 'Skill gap analysis failed' });
  }
});

// 6. AI Resume Suggestions Endpoint
app.post('/api/ai/resume-suggestions', async (req, res) => {
  try {
    const { summary, experience, projects, skills, careerGoal } = req.body;

    const prompt = `
Act as an ATS Resume Expert and analyze this student resume targeting "${careerGoal || 'Software Engineer'}":
- Summary: ${summary}
- Skills: ${JSON.stringify(skills)}
- Experience: ${JSON.stringify(experience)}
- Projects: ${JSON.stringify(projects)}

Provide 3 high-impact bullet point improvements and ATS optimization suggestions.
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        improvedSummary: { type: Type.STRING },
        actionableSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        atsKeywordsToAdd: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['improvedSummary', 'actionableSuggestions', 'atsKeywordsToAdd'],
    };

    const result = await generateAiJson(prompt, schema);
    res.json(result);
  } catch (err: any) {
    console.error('Error in resume-suggestions:', err);
    res.status(500).json({ error: err.message || 'Resume analysis failed' });
  }
});

// 7. AI Next Goal Recommendation Endpoint
app.post('/api/ai/recommend-next-goal', async (req, res) => {
  try {
    const { completedGoalTitles, skills, careerGoal, branch } = req.body;

    const prompt = `
Recommend 3 high-impact next goals for a student based on:
- Branch: ${branch}
- Career Goal: ${careerGoal}
- Current Skills: ${JSON.stringify(skills)}
- Previously Completed Goals: ${JSON.stringify(completedGoalTitles)}

Suggest non-obvious, high-value career and academic milestones.
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        recommendations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              estimatedWeeks: { type: Type.INTEGER },
              priority: { type: Type.STRING },
            },
          },
        },
      },
      required: ['recommendations'],
    };

    const result = await generateAiJson(prompt, schema);
    res.json(result);
  } catch (err: any) {
    console.error('Error in recommend-next-goal:', err);
    res.status(500).json({ error: err.message || 'Next goal recommendation failed' });
  }
});

// 8. AI Project Assistant Endpoint
app.post('/api/ai/project-assistant', async (req, res) => {
  try {
    const { title, description, techStack, action } = req.body;

    const prompt = `
Act as a Lead Software Architect and assist with student project: "${title}".
Tech Stack: ${JSON.stringify(techStack)}
Description: ${description}
Requested Action: ${action}

Produce clean, technical markdown documentation, task list, architecture advice, or code review depending on requested action.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are GoalForge AI Lead Software Architect.',
      },
    });

    res.json({ output: response.text });
  } catch (err: any) {
    console.error('Error in project-assistant:', err);
    res.status(500).json({ error: err.message || 'Project assistant failed' });
  }
});

// 9. AI Daily Check-In Analysis Endpoint
app.post('/api/ai/daily-checkin', async (req, res) => {
  try {
    const { completedTasks, pendingTasks, learnedToday, studyHours, challenges } = req.body;

    const prompt = `
Analyze a student's daily check-in reflection:
- Tasks Completed: ${JSON.stringify(completedTasks)}
- Tasks Pending: ${JSON.stringify(pendingTasks)}
- Study Hours: ${studyHours} hours
- Key Learnings: ${learnedToday}
- Challenges Faced: ${challenges}

Provide 3 actionable, encouraging AI routine recommendations for tomorrow to optimize productivity and eliminate burnout.
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        encouragement: { type: Type.STRING },
        suggestedFocusArea: { type: Type.STRING },
      },
      required: ['recommendations', 'encouragement', 'suggestedFocusArea'],
    };

    const result = await generateAiJson(prompt, schema);
    res.json(result);
  } catch (err: any) {
    console.error('Error in daily-checkin:', err);
    res.status(500).json({ error: err.message || 'Daily checkin analysis failed' });
  }
});

// Start dev server with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`GoalForge AI server running on port ${PORT}`);
  });
}

startServer();
