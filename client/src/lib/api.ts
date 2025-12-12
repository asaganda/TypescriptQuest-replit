// API helper functions
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

// Stats
export interface UserStats {
  userId: string;
  totalXP: number;
  currentLevel: number;
  lessonsCompleted: number;
  challengesCompleted: number;
}

export async function getUserStats(): Promise<UserStats> {
  return apiRequest<UserStats>("/api/stats");
}

// Levels
export interface Level {
  id: string;
  name: string;
  description: string;
  order: number;
  xpRequired: number;
}

export async function getLevels(): Promise<Level[]> {
  return apiRequest<Level[]>("/api/levels");
}

// Lessons
export interface Lesson {
  id: string;
  levelId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  xpReward: number;
}

export async function getLessonsByLevel(levelId: string): Promise<Lesson[]> {
  return apiRequest<Lesson[]>(`/api/levels/${levelId}/lessons`);
}

export async function getLesson(id: string): Promise<Lesson> {
  return apiRequest<Lesson>(`/api/lessons/${id}`);
}

// Documentation Links
export interface DocumentationLink {
  title: string;
  url: string;
}

export function parseDocumentationLinks(links?: string[] | null): DocumentationLink[] {
  if (!links) return [];
  return links.map(link => {
    try {
      return JSON.parse(link);
    } catch {
      return null;
    }
  }).filter(Boolean) as DocumentationLink[];
}

// Challenges
export interface Challenge {
  id: string;
  lessonId: string;
  type: "multiple-choice" | "code";
  prompt: string;
  order: number;
  xpReward: number;
  options?: string[] | null;
  correctAnswer?: number | null;
  explanation?: string | null;
  starterCode?: string | null;
  validationPatterns?: string[] | null;
  hint?: string | null;
  sampleSolution?: string | null;
  documentationLinks?: string[] | null;
}

export async function getChallengesByLesson(lessonId: string): Promise<Challenge[]> {
  return apiRequest<Challenge[]>(`/api/lessons/${lessonId}/challenges`);
}

// Progress
export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string | null;
  challengeId: string | null;
  completedAt: string;
  usedHint: boolean | null;
}

export async function getUserProgress(): Promise<UserProgress[]> {
  return apiRequest<UserProgress[]>("/api/progress");
}

export async function completeLesson(lessonId: string, usedHint: boolean = false) {
  return apiRequest(`/api/progress/lesson/${lessonId}`, {
    method: "POST",
    body: JSON.stringify({ usedHint }),
  });
}

export async function completeChallenge(challengeId: string, usedHint: boolean = false) {
  return apiRequest(`/api/progress/challenge/${challengeId}`, {
    method: "POST",
    body: JSON.stringify({ usedHint }),
  });
}

// Badges
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned?: boolean;
  earnedAt?: string;
}

export async function getBadges(): Promise<Badge[]> {
  return apiRequest<Badge[]>("/api/badges");
}
