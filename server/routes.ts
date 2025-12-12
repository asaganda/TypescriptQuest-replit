import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import { z } from "zod";
import { calculateLevel } from "@shared/xp-utils";

// Extend session data
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "typescript-quest-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
    })
  );

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // ============= AUTH ROUTES =============
  
  // Signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      // Create initial user stats only if they don't exist
      const existingStats = await storage.getUserStats(user.id);
      if (!existingStats) {
        await storage.createUserStats({
          userId: user.id,
          totalXP: 0,
          currentLevel: 1,
          lessonsCompleted: 0,
          challengesCompleted: 0,
        });
      }

      // Set session and save it before responding
      req.session.userId = user.id;
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set session and save it before responding
      req.session.userId = user.id;
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  // Get current user
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= LEVELS ROUTES =============
  
  app.get("/api/levels", requireAuth, async (req, res) => {
    try {
      const levels = await storage.getAllLevels();
      res.json(levels);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/levels/:id", requireAuth, async (req, res) => {
    try {
      const level = await storage.getLevel(req.params.id);
      if (!level) {
        return res.status(404).json({ error: "Level not found" });
      }
      res.json(level);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= LESSONS ROUTES =============
  
  app.get("/api/levels/:levelId/lessons", requireAuth, async (req, res) => {
    try {
      const lessons = await storage.getLessonsByLevel(req.params.levelId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/lessons/:id", requireAuth, async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= CHALLENGES ROUTES =============
  
  app.get("/api/lessons/:lessonId/challenges", requireAuth, async (req, res) => {
    try {
      const challenges = await storage.getChallengesByLesson(req.params.lessonId);
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/challenges/:id", requireAuth, async (req, res) => {
    try {
      const challenge = await storage.getChallenge(req.params.id);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= PROGRESS ROUTES =============
  
  app.get("/api/progress", requireAuth, async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.session.userId!);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Complete a lesson
  app.post("/api/progress/lesson/:lessonId", requireAuth, async (req, res) => {
    try {
      const { lessonId } = req.params;
      const { usedHint } = z.object({ usedHint: z.boolean().optional() }).parse(req.body);
      const userId = req.session.userId!;

      // Check if already completed
      const alreadyCompleted = await storage.hasCompletedLesson(userId, lessonId);
      if (alreadyCompleted) {
        return res.json({ message: "Already completed", xpEarned: 0 });
      }

      // Get lesson for XP reward
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      // Create progress record
      await storage.createProgress({
        userId,
        lessonId,
        challengeId: null,
        usedHint: usedHint || false,
      });

      // Update user stats
      const stats = await storage.getUserStats(userId);
      if (stats) {
        const newTotalXP = stats.totalXP + lesson.xpReward;
        const newCurrentLevel = calculateLevel(newTotalXP);
        
        await storage.updateUserStats(userId, {
          totalXP: newTotalXP,
          currentLevel: newCurrentLevel,
          lessonsCompleted: stats.lessonsCompleted + 1,
        });

        // Check for badge: first lesson
        if (stats.lessonsCompleted === 0) {
          await storage.awardBadge({ userId, badgeId: "first-lesson" });
        }

        // Check for badge: no hints used in lesson
        if (!usedHint) {
          const userBadges = await storage.getUserBadges(userId);
          const hasNoHintBadge = userBadges.some(ub => ub.badgeId === "no-hints");
          if (!hasNoHintBadge) {
            await storage.awardBadge({ userId, badgeId: "no-hints" });
          }
        }
      }

      res.json({ success: true, xpEarned: lesson.xpReward });
    } catch (error) {
      console.error("Error completing lesson:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Complete a challenge
  app.post("/api/progress/challenge/:challengeId", requireAuth, async (req, res) => {
    try {
      const { challengeId } = req.params;
      const { usedHint } = z.object({ usedHint: z.boolean().optional() }).parse(req.body);
      const userId = req.session.userId!;

      // Check if already completed
      const alreadyCompleted = await storage.hasCompletedChallenge(userId, challengeId);
      if (alreadyCompleted) {
        return res.json({ message: "Already completed", xpEarned: 0 });
      }

      // Get challenge for XP reward
      const challenge = await storage.getChallenge(challengeId);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }

      // Create progress record
      await storage.createProgress({
        userId,
        lessonId: null,
        challengeId,
        usedHint: usedHint || false,
      });

      // Update user stats
      const stats = await storage.getUserStats(userId);
      if (stats) {
        const newTotalXP = stats.totalXP + challenge.xpReward;
        const newCurrentLevel = calculateLevel(newTotalXP);
        
        await storage.updateUserStats(userId, {
          totalXP: newTotalXP,
          currentLevel: newCurrentLevel,
          challengesCompleted: stats.challengesCompleted + 1,
        });

        // Check for badge: 5 challenges
        if (stats.challengesCompleted + 1 >= 5) {
          const userBadges = await storage.getUserBadges(userId);
          const hasFiveChallengesBadge = userBadges.some(ub => ub.badgeId === "five-challenges");
          if (!hasFiveChallengesBadge) {
            await storage.awardBadge({ userId, badgeId: "five-challenges" });
          }
        }
      }

      res.json({ success: true, xpEarned: challenge.xpReward });
    } catch (error) {
      console.error("Error completing challenge:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= USER STATS ROUTES =============
  
  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      let stats = await storage.getUserStats(req.session.userId!);
      
      // Auto-create stats for users who don't have them yet
      if (!stats) {
        try {
          stats = await storage.createUserStats({
            userId: req.session.userId!,
            totalXP: 0,
            currentLevel: 1,
            lessonsCompleted: 0,
            challengesCompleted: 0,
          });
        } catch (createError: any) {
          // If stats creation fails (e.g., duplicate key), try fetching again
          // This handles race conditions where stats were created between checks
          stats = await storage.getUserStats(req.session.userId!);
          if (!stats) {
            throw createError; // Re-throw if stats still don't exist
          }
        }
      }
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= BADGES ROUTES =============
  
  app.get("/api/badges", requireAuth, async (req, res) => {
    try {
      const allBadges = await storage.getAllBadges();
      const userBadges = await storage.getUserBadges(req.session.userId!);
      
      // Combine badges with earned status
      const badgesWithStatus = allBadges.map(badge => ({
        ...badge,
        earned: userBadges.some(ub => ub.badgeId === badge.id),
        earnedAt: userBadges.find(ub => ub.badgeId === badge.id)?.earnedAt,
      }));

      res.json(badgesWithStatus);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= SUBSCRIPTION ROUTES =============

  // Get user subscription status
  app.get("/api/subscription", requireAuth, async (req, res) => {
    try {
      const subscription = await storage.getSubscription(req.session.userId!);
      res.json(subscription || { status: "inactive", planType: "free" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create Stripe checkout session
  app.post("/api/subscription/create-checkout", requireAuth, async (req, res) => {
    try {
      const { priceId, planType } = z.object({
        priceId: z.string(),
        planType: z.string(),
      }).parse(req.body);

      // TODO: When Stripe API key is available, create checkout session
      // For now, return a placeholder response
      res.json({ 
        message: "Stripe integration pending - API key not configured yet",
        checkoutUrl: null,
        requiresSetup: true 
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Stripe webhook handler
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      // TODO: When Stripe API key is available, verify webhook signature
      // For now, just acknowledge receipt
      res.json({ received: true });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Cancel subscription
  app.post("/api/subscription/cancel", requireAuth, async (req, res) => {
    try {
      const subscription = await storage.getSubscription(req.session.userId!);
      if (!subscription) {
        return res.status(404).json({ error: "No active subscription" });
      }

      // TODO: When Stripe API key is available, cancel in Stripe
      // For now, update local status
      await storage.updateSubscription(req.session.userId!, {
        cancelAtPeriodEnd: true,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= PASSWORD RESET ROUTES =============

  // Request password reset
  app.post("/api/auth/reset-password/request", async (req, res) => {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists - security best practice
        return res.json({ success: true, message: "If an account exists, a reset link will be sent" });
      }

      // Generate secure token
      const token = await bcrypt.hash(user.id + Date.now(), 10);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await storage.createPasswordResetToken({
        userId: user.id,
        token,
        expiresAt,
        usedAt: null,
      });

      // TODO: Send email with reset link
      // For now, log the token (in production, this would be emailed)
      console.log(`Password reset token for ${email}: ${token}`);
      console.log(`Reset link: /reset-password?token=${encodeURIComponent(token)}`);

      res.json({ success: true, message: "If an account exists, a reset link will be sent" });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Reset password with token
  app.post("/api/auth/reset-password/confirm", async (req, res) => {
    try {
      const { token, newPassword } = z.object({
        token: z.string(),
        newPassword: z.string().min(6),
      }).parse(req.body);

      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      if (resetToken.usedAt) {
        return res.status(400).json({ error: "Reset token already used" });
      }

      if (new Date() > resetToken.expiresAt) {
        return res.status(400).json({ error: "Reset token expired" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await storage.updateUserPassword(resetToken.userId, hashedPassword);

      // Mark token as used
      await storage.markPasswordResetTokenUsed(token);

      res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.error("Password reset confirm error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
