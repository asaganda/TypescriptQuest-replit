import { 
  type User, 
  type InsertUser,
  type Level,
  type InsertLevel,
  type Lesson,
  type InsertLesson,
  type Challenge,
  type InsertChallenge,
  type UserProgress,
  type InsertUserProgress,
  type UserStats,
  type InsertUserStats,
  type Badge,
  type InsertBadge,
  type UserBadge,
  type InsertUserBadge
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Level methods
  getAllLevels(): Promise<Level[]>;
  getLevel(id: string): Promise<Level | undefined>;
  
  // Lesson methods
  getLessonsByLevel(levelId: string): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  
  // Challenge methods
  getChallengesByLesson(lessonId: string): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  
  // Progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  hasCompletedLesson(userId: string, lessonId: string): Promise<boolean>;
  hasCompletedChallenge(userId: string, challengeId: string): Promise<boolean>;
  createProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // User Stats methods
  getUserStats(userId: string): Promise<UserStats | undefined>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
  updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats>;
  
  // Badge methods
  getAllBadges(): Promise<Badge[]>;
  getUserBadges(userId: string): Promise<UserBadge[]>;
  awardBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private levels: Map<string, Level>;
  private lessons: Map<string, Lesson>;
  private challenges: Map<string, Challenge>;
  private userProgress: Map<string, UserProgress>;
  private userStats: Map<string, UserStats>;
  private badges: Map<string, Badge>;
  private userBadges: Map<string, UserBadge>;

  constructor() {
    this.users = new Map();
    this.levels = new Map();
    this.lessons = new Map();
    this.challenges = new Map();
    this.userProgress = new Map();
    this.userStats = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed levels
    const levelsData: InsertLevel[] = [
      {
        id: "1",
        name: "TypeScript Basics",
        description: "Learn fundamental types, interfaces, and type annotations to build a strong foundation",
        order: 1,
        xpRequired: 0
      },
      {
        id: "2",
        name: "Functions & Generics",
        description: "Master function types, generics, and advanced type features for flexible code",
        order: 2,
        xpRequired: 200
      },
      {
        id: "3",
        name: "React + TypeScript",
        description: "Build type-safe React applications with TypeScript for better component design",
        order: 3,
        xpRequired: 500
      }
    ];

    levelsData.forEach(level => this.levels.set(level.id, level as Level));

    // Seed lessons for Level 1
    const lessonsData: InsertLesson[] = [
      {
        id: "1-1",
        levelId: "1",
        title: "Introduction to Types",
        description: "Learn about basic TypeScript types",
        content: `
          <p>TypeScript extends JavaScript by adding types to the language. Types provide a way to describe the shape of an object, providing better documentation and allowing TypeScript to validate your code.</p>
          
          <h3>Basic Types</h3>
          <p>TypeScript has several basic types you should know:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>let isDone: boolean = false;
let count: number = 42;
let name: string = "TypeScript";
let list: number[] = [1, 2, 3];</code></pre>
          
          <p>These type annotations help catch errors at compile time rather than runtime.</p>
          
          <h3>Key Concepts</h3>
          <ul>
            <li><strong>Type Safety:</strong> Catch errors before runtime</li>
            <li><strong>Better IDE Support:</strong> Autocomplete and inline documentation</li>
            <li><strong>Code Documentation:</strong> Types serve as inline documentation</li>
          </ul>
        `,
        order: 1,
        xpReward: 20
      },
      {
        id: "1-2",
        levelId: "1",
        title: "Interfaces & Type Aliases",
        description: "Define custom types and interfaces",
        content: `
          <p>Interfaces and type aliases allow you to define custom types for your objects and functions.</p>
          
          <h3>Interfaces</h3>
          <p>Interfaces define the structure of an object:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Optional property
}

const user: User = {
  id: 1,
  name: "Alex",
  email: "alex@example.com"
};</code></pre>
          
          <h3>Type Aliases</h3>
          <p>Type aliases work similarly but can also define unions and other complex types:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>type Status = "active" | "inactive" | "pending";
type ID = string | number;

let userStatus: Status = "active";</code></pre>
        `,
        order: 2,
        xpReward: 20
      },
      {
        id: "1-3",
        levelId: "1",
        title: "Union & Intersection Types",
        description: "Combine types in powerful ways",
        content: `
          <p>Union and intersection types allow you to create complex types from simpler ones.</p>
          
          <h3>Union Types</h3>
          <p>A union type can be one of several types:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function printId(id: string | number) {
  console.log("ID:", id);
}

printId(101);      // OK
printId("202");    // OK</code></pre>
          
          <h3>Intersection Types</h3>
          <p>An intersection type combines multiple types:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface Person {
  name: string;
}

interface Employee {
  employeeId: number;
}

type Staff = Person & Employee;

const staff: Staff = {
  name: "Alex",
  employeeId: 123
};</code></pre>
        `,
        order: 3,
        xpReward: 20
      }
    ];

    lessonsData.forEach(lesson => this.lessons.set(lesson.id, lesson as Lesson));

    // Seed challenges
    const challengesData: InsertChallenge[] = [
      // Lesson 1-1 challenges
      {
        id: "1-1-1",
        lessonId: "1-1",
        type: "multiple-choice",
        prompt: "What is the primary benefit of using TypeScript over JavaScript?",
        order: 1,
        xpReward: 30,
        options: [
          "Faster runtime performance",
          "Type safety and better tooling",
          "Smaller bundle sizes",
          "Native browser support"
        ],
        correctAnswer: 1,
        explanation: "TypeScript adds static type checking, which helps catch errors at compile time and provides better IDE support with autocomplete and inline documentation.",
        starterCode: null,
        validationPatterns: null,
        hint: null
      },
      {
        id: "1-1-2",
        lessonId: "1-1",
        type: "code",
        prompt: "Add type annotations to all three variables below",
        order: 2,
        xpReward: 30,
        options: null,
        correctAnswer: null,
        explanation: null,
        starterCode: `let username = "Alex";\nlet age = 25;\nlet isPremium = true;`,
        validationPatterns: ["string", "number", "boolean"],
        hint: "Use the colon syntax to add types: let name: type = value"
      },
      // Lesson 1-2 challenges
      {
        id: "1-2-1",
        lessonId: "1-2",
        type: "multiple-choice",
        prompt: "Which keyword is used to define an interface in TypeScript?",
        order: 1,
        xpReward: 30,
        options: [
          "class",
          "interface",
          "type",
          "struct"
        ],
        correctAnswer: 1,
        explanation: "The 'interface' keyword is used to define object shapes in TypeScript.",
        starterCode: null,
        validationPatterns: null,
        hint: null
      },
      {
        id: "1-2-2",
        lessonId: "1-2",
        type: "code",
        prompt: "Create an interface named 'Product' with properties: id (number), name (string), and price (number)",
        order: 2,
        xpReward: 30,
        options: null,
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your Product interface here\n`,
        validationPatterns: ["interface", "Product", "id", "number", "name", "string", "price"],
        hint: "Use the interface keyword followed by the name and curly braces with property definitions"
      },
      // Lesson 1-3 challenges
      {
        id: "1-3-1",
        lessonId: "1-3",
        type: "multiple-choice",
        prompt: "What does the | symbol represent in TypeScript types?",
        order: 1,
        xpReward: 30,
        options: [
          "Intersection type",
          "Union type",
          "Optional property",
          "Type assertion"
        ],
        correctAnswer: 1,
        explanation: "The | symbol creates a union type, meaning a value can be one of several types.",
        starterCode: null,
        validationPatterns: null,
        hint: null
      }
    ];

    challengesData.forEach(challenge => this.challenges.set(challenge.id, challenge as Challenge));

    // Seed badges
    const badgesData: InsertBadge[] = [
      { id: "first-lesson", name: "First Steps", description: "Complete your first lesson", icon: "book" },
      { id: "five-challenges", name: "Problem Solver", description: "Solve 5 challenges", icon: "zap" },
      { id: "no-hints", name: "Pure Skill", description: "Complete a lesson without using hints", icon: "trophy" },
      { id: "perfect-score", name: "Perfectionist", description: "Get 100% on all challenges in a lesson", icon: "star" },
      { id: "speed-demon", name: "Speed Demon", description: "Complete a challenge quickly", icon: "target" },
      { id: "level-master", name: "Level Master", description: "Complete all lessons in a level", icon: "trophy" }
    ];

    badgesData.forEach(badge => this.badges.set(badge.id, badge as Badge));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    
    // Initialize user stats
    await this.createUserStats({ userId: id, totalXP: 0, currentLevel: 1, lessonsCompleted: 0, challengesCompleted: 0 });
    
    return user;
  }

  // Level methods
  async getAllLevels(): Promise<Level[]> {
    return Array.from(this.levels.values()).sort((a, b) => a.order - b.order);
  }

  async getLevel(id: string): Promise<Level | undefined> {
    return this.levels.get(id);
  }

  // Lesson methods
  async getLessonsByLevel(levelId: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.levelId === levelId)
      .sort((a, b) => a.order - b.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  // Challenge methods
  async getChallengesByLesson(lessonId: string): Promise<Challenge[]> {
    return Array.from(this.challenges.values())
      .filter(challenge => challenge.lessonId === lessonId)
      .sort((a, b) => a.order - b.order);
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  // Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId);
  }

  async hasCompletedLesson(userId: string, lessonId: string): Promise<boolean> {
    return Array.from(this.userProgress.values())
      .some(progress => progress.userId === userId && progress.lessonId === lessonId);
  }

  async hasCompletedChallenge(userId: string, challengeId: string): Promise<boolean> {
    return Array.from(this.userProgress.values())
      .some(progress => progress.userId === userId && progress.challengeId === challengeId);
  }

  async createProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = {
      id,
      userId: insertProgress.userId,
      lessonId: insertProgress.lessonId ?? null,
      challengeId: insertProgress.challengeId ?? null,
      completedAt: new Date(),
      usedHint: insertProgress.usedHint ?? false
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  // User Stats methods
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    return this.userStats.get(userId);
  }

  async createUserStats(stats: InsertUserStats): Promise<UserStats> {
    const userStats: UserStats = {
      userId: stats.userId,
      totalXP: stats.totalXP ?? 0,
      currentLevel: stats.currentLevel ?? 1,
      lessonsCompleted: stats.lessonsCompleted ?? 0,
      challengesCompleted: stats.challengesCompleted ?? 0
    };
    this.userStats.set(stats.userId, userStats);
    return userStats;
  }

  async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats> {
    const current = this.userStats.get(userId);
    if (!current) {
      throw new Error("User stats not found");
    }
    const updated = { ...current, ...updates };
    this.userStats.set(userId, updated);
    return updated;
  }

  // Badge methods
  async getAllBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return Array.from(this.userBadges.values())
      .filter(ub => ub.userId === userId);
  }

  async awardBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    // Check if badge already awarded
    const existing = Array.from(this.userBadges.values())
      .find(ub => ub.userId === insertUserBadge.userId && ub.badgeId === insertUserBadge.badgeId);
    
    if (existing) {
      return existing;
    }

    const id = randomUUID();
    const userBadge: UserBadge = {
      ...insertUserBadge,
      id,
      earnedAt: new Date()
    };
    this.userBadges.set(id, userBadge);
    return userBadge;
  }
}

export const storage = new MemStorage();
