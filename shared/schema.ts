import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Levels table
export const levels = pgTable("levels", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  xpRequired: integer("xp_required").notNull().default(0),
});

export const insertLevelSchema = createInsertSchema(levels);
export type InsertLevel = z.infer<typeof insertLevelSchema>;
export type Level = typeof levels.$inferSelect;

// Lessons table
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey(),
  levelId: varchar("level_id").notNull().references(() => levels.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  xpReward: integer("xp_reward").notNull().default(20),
});

export const insertLessonSchema = createInsertSchema(lessons);
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

// Challenges table
export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey(),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id),
  type: text("type").notNull(), // "multiple-choice" | "code"
  prompt: text("prompt").notNull(),
  order: integer("order").notNull(),
  xpReward: integer("xp_reward").notNull().default(30),
  
  // Multiple choice fields
  options: text("options").array().default([]),
  correctAnswer: integer("correct_answer"),
  explanation: text("explanation"),
  
  // Code challenge fields
  starterCode: text("starter_code"),
  validationPatterns: text("validation_patterns").array().default([]),
  hint: text("hint"),
});

export const insertChallengeSchema = createInsertSchema(challenges);
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

// User Progress table
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  challengeId: varchar("challenge_id").references(() => challenges.id),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  usedHint: boolean("used_hint").default(false),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ 
  id: true, 
  completedAt: true 
});
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// User Stats (aggregated data for each user)
export const userStats = pgTable("user_stats", {
  userId: varchar("user_id").primaryKey().references(() => users.id),
  totalXP: integer("total_xp").notNull().default(0),
  currentLevel: integer("current_level").notNull().default(1),
  lessonsCompleted: integer("lessons_completed").notNull().default(0),
  challengesCompleted: integer("challenges_completed").notNull().default(0),
});

export const insertUserStatsSchema = createInsertSchema(userStats);
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type UserStats = typeof userStats.$inferSelect;

// Badges table
export const badges = pgTable("badges", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
});

export const insertBadgeSchema = createInsertSchema(badges);
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

// User Badges junction table
export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  badgeId: varchar("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ 
  id: true, 
  earnedAt: true 
});
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;
