import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { pool } from "./db";
import { z } from "zod";
import { getStripe, isStripeConfigured, getStripePublishableKey, getStripePriceId } from "./stripe";
import { PAYWALL_CONFIG, PRICING_CONFIG } from "@shared/config";
import { checkLevelAccess } from "./middleware/access-control";
import type Stripe from "stripe";
import {
  getGithubAuthUrl,
  exchangeGithubCode,
  getGithubUser,
  getGoogleAuthUrl,
  exchangeGoogleCode,
  getGoogleUser,
} from "./oauth";
import { randomUUID } from "crypto";

/**
 * Calculate the current level based on level completion (not XP).
 * A user is on level N if they have completed all challenges in levels 1 through N-1.
 * Level 1 is always available.
 */
async function calculateCurrentLevel(userId: string): Promise<number> {
  // Check if user is admin - admins bypass level restrictions
  const user = await storage.getUser(userId);
  if (user?.isAdmin) {
    return 4; // Max level - admins can access everything
  }

  const allLevels = await storage.getAllLevels();
  const sortedLevels = [...allLevels].sort((a, b) => a.order - b.order);
  const userProgress = await storage.getUserProgress(userId);

  let currentLevel = 1;

  for (const level of sortedLevels) {
    // Get all lessons for this level
    const lessons = await storage.getLessonsByLevel(level.id);

    // Get all challenges for all lessons in this level
    let totalChallenges = 0;
    let completedChallenges = 0;

    for (const lesson of lessons) {
      const challenges = await storage.getChallengesByLesson(lesson.id);
      totalChallenges += challenges.length;

      for (const challenge of challenges) {
        if (userProgress.some(p => p.challengeId === challenge.id)) {
          completedChallenges++;
        }
      }
    }

    // If this level is completed (all challenges done), user can access the next level
    if (totalChallenges > 0 && completedChallenges === totalChallenges) {
      currentLevel = level.order + 1;
    } else {
      // Level not completed, stop here
      break;
    }
  }

  // Cap at max level (4)
  return Math.min(currentLevel, sortedLevels.length);
}

// Extend session data
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for AWS Elastic Beanstalk
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Session middleware with PostgreSQL store
  const PgStore = pgSession(session);
  app.use(
    session({
      store: new PgStore({
        pool: pool,
        tableName: "user_sessions",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || (process.env.NODE_ENV === "production"
        ? (() => { throw new Error("SESSION_SECRET environment variable is required in production"); })()
        : "typescript-quest-dev-secret-key"),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: "lax",
        domain: process.env.NODE_ENV === "production" ? ".typescriptquest.com" : undefined,
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

      // Password is required for email/password signup
      if (!data.password) {
        return res.status(400).json({ error: "Password is required" });
      }

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

      // Check if user has a password (OAuth-only users don't)
      if (!user.password) {
        return res.status(401).json({ error: "Please sign in using GitHub or Google" });
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

  // ============= OAUTH ROUTES =============

  // Determine frontend URL for redirects
  const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

  // GitHub OAuth - Initiate
  app.get("/api/auth/github", (req, res) => {
    const authUrl = getGithubAuthUrl();
    res.redirect(authUrl);
  });

  // GitHub OAuth - Callback
  app.get("/api/auth/github/callback", async (req, res) => {
    try {
      const { code } = req.query;
      if (!code || typeof code !== 'string') {
        return res.redirect(`${getFrontendUrl()}/?error=missing_code`);
      }

      // Exchange code for access token
      const accessToken = await exchangeGithubCode(code);

      // Get user profile from GitHub
      const githubUser = await getGithubUser(accessToken);

      if (!githubUser.email) {
        return res.redirect(`${getFrontendUrl()}/?error=no_email`);
      }

      const githubId = String(githubUser.id);

      // Check if user exists by GitHub ID
      let user = await storage.getUserByGithubId(githubId);

      if (!user) {
        // Check if user exists by email (link accounts)
        user = await storage.getUserByEmail(githubUser.email);

        if (user) {
          // Link GitHub to existing account
          await storage.updateUserOAuthId(user.id, 'github', githubId);
        } else {
          // Create new user
          user = await storage.createUser({
            email: githubUser.email,
            password: null,
            displayName: githubUser.name || githubUser.login,
            githubId: githubId,
            googleId: null,
            isAdmin: false,
            hasPremiumAccess: false,
          });
        }
      }

      // Set session
      req.session.userId = user.id;

      // Redirect to dashboard
      res.redirect(`${getFrontendUrl()}/dashboard`);
    } catch (error) {
      console.error("GitHub OAuth error:", error);
      res.redirect(`${getFrontendUrl()}/?error=oauth_failed`);
    }
  });

  // Google OAuth - Initiate
  app.get("/api/auth/google", (req, res) => {
    const authUrl = getGoogleAuthUrl();
    res.redirect(authUrl);
  });

  // Google OAuth - Callback
  app.get("/api/auth/google/callback", async (req, res) => {
    try {
      const { code } = req.query;
      if (!code || typeof code !== 'string') {
        return res.redirect(`${getFrontendUrl()}/?error=missing_code`);
      }

      // Exchange code for access token
      const accessToken = await exchangeGoogleCode(code);

      // Get user profile from Google
      const googleUser = await getGoogleUser(accessToken);

      if (!googleUser.email) {
        return res.redirect(`${getFrontendUrl()}/?error=no_email`);
      }

      const googleId = googleUser.id;

      // Check if user exists by Google ID
      let user = await storage.getUserByGoogleId(googleId);

      if (!user) {
        // Check if user exists by email (link accounts)
        user = await storage.getUserByEmail(googleUser.email);

        if (user) {
          // Link Google to existing account
          await storage.updateUserOAuthId(user.id, 'google', googleId);
        } else {
          // Create new user
          user = await storage.createUser({
            email: googleUser.email,
            password: null,
            displayName: googleUser.name,
            githubId: null,
            googleId: googleId,
            isAdmin: false,
            hasPremiumAccess: false,
          });
        }
      }

      // Set session
      req.session.userId = user.id;

      // Redirect to dashboard
      res.redirect(`${getFrontendUrl()}/dashboard`);
    } catch (error) {
      console.error("Google OAuth error:", error);
      res.redirect(`${getFrontendUrl()}/?error=oauth_failed`);
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

  // Check access to a specific level
  app.get("/api/access/level/:levelId", requireAuth, async (req, res) => {
    try {
      const level = await storage.getLevel(req.params.levelId);
      if (!level) {
        return res.status(404).json({ error: "Level not found" });
      }

      const accessCheck = await checkLevelAccess(req.session.userId!, level.order);
      res.json({
        levelId: level.id,
        levelOrder: level.order,
        ...accessCheck,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= LESSONS ROUTES =============
  
  app.get("/api/levels/:levelId/lessons", requireAuth, async (req, res) => {
    try {
      // Check access based on level
      const level = await storage.getLevel(req.params.levelId);
      if (level) {
        const accessCheck = await checkLevelAccess(req.session.userId!, level.order);
        if (!accessCheck.hasAccess) {
          return res.status(403).json({
            error: "Subscription required",
            requiresSubscription: true,
            levelOrder: level.order,
          });
        }
      }

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

      // Check access based on level
      const level = await storage.getLevel(lesson.levelId);
      if (level) {
        const accessCheck = await checkLevelAccess(req.session.userId!, level.order);
        if (!accessCheck.hasAccess) {
          return res.status(403).json({
            error: "Subscription required",
            requiresSubscription: true,
            levelOrder: level.order,
          });
        }
      }

      res.json(lesson);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= CHALLENGES ROUTES =============
  
  app.get("/api/lessons/:lessonId/challenges", requireAuth, async (req, res) => {
    try {
      // Check access based on level (lesson -> level)
      const lesson = await storage.getLesson(req.params.lessonId);
      if (lesson) {
        const level = await storage.getLevel(lesson.levelId);
        if (level) {
          const accessCheck = await checkLevelAccess(req.session.userId!, level.order);
          if (!accessCheck.hasAccess) {
            return res.status(403).json({
              error: "Subscription required",
              requiresSubscription: true,
              levelOrder: level.order,
            });
          }
        }
      }

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

      // Check access based on level (challenge -> lesson -> level)
      const lesson = await storage.getLesson(challenge.lessonId);
      if (lesson) {
        const level = await storage.getLevel(lesson.levelId);
        if (level) {
          const accessCheck = await checkLevelAccess(req.session.userId!, level.order);
          if (!accessCheck.hasAccess) {
            return res.status(403).json({
              error: "Subscription required",
              requiresSubscription: true,
              levelOrder: level.order,
            });
          }
        }
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
        const newCurrentLevel = await calculateCurrentLevel(userId);

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
      const { usedHint, answerData, isCorrect } = z.object({
        usedHint: z.boolean().optional(),
        answerData: z.object({
          selectedAnswer: z.number().optional(),
          code: z.string().optional(),
        }),
        isCorrect: z.boolean(),
      }).parse(req.body);
      const userId = req.session.userId!;

      // Save the user's answer (whether correct or not)
      await storage.createUserAnswer({
        userId,
        challengeId,
        answerData: JSON.stringify(answerData),
        isCorrect,
      });

      // Only mark as complete and award XP if the answer is correct
      if (isCorrect) {
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
          const newCurrentLevel = await calculateCurrentLevel(userId);

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
      } else {
        // Answer was incorrect - saved but no XP awarded
        res.json({ success: true, xpEarned: 0 });
      }
    } catch (error) {
      console.error("Error completing challenge:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get user's answer for a specific challenge
  app.get("/api/challenges/:challengeId/answer", requireAuth, async (req, res) => {
    try {
      const { challengeId } = req.params;
      const userId = req.session.userId!;

      const answer = await storage.getUserAnswer(userId, challengeId);

      if (!answer) {
        return res.status(404).json({ error: "No answer found" });
      }

      res.json({
        answerData: JSON.parse(answer.answerData),
        isCorrect: answer.isCorrect,
        submittedAt: answer.submittedAt,
      });
    } catch (error) {
      console.error("Error fetching user answer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= USER STATS ROUTES =============
  
  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      let stats = await storage.getUserStats(userId);

      // Auto-create stats for users who don't have them yet
      if (!stats) {
        try {
          stats = await storage.createUserStats({
            userId,
            totalXP: 0,
            currentLevel: 1,
            lessonsCompleted: 0,
            challengesCompleted: 0,
          });
        } catch (createError: any) {
          // If stats creation fails (e.g., duplicate key), try fetching again
          // This handles race conditions where stats were created between checks
          stats = await storage.getUserStats(userId);
          if (!stats) {
            throw createError; // Re-throw if stats still don't exist
          }
        }
      }

      // Always recalculate currentLevel based on completion to ensure accuracy
      const correctLevel = await calculateCurrentLevel(userId);
      if (stats.currentLevel !== correctLevel) {
        stats = await storage.updateUserStats(userId, { currentLevel: correctLevel });
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

  // Get Stripe configuration status (for frontend)
  app.get("/api/subscription/config", async (req, res) => {
    res.json({
      isConfigured: isStripeConfigured(),
      publishableKey: getStripePublishableKey(),
      pricing: PRICING_CONFIG,
      paywallLevel: PAYWALL_CONFIG.paywallStartsAtLevel,
    });
  });

  // Get user subscription status
  app.get("/api/subscription", requireAuth, async (req, res) => {
    try {
      const subscription = await storage.getSubscription(req.session.userId!);
      const user = await storage.getUser(req.session.userId!);

      res.json({
        ...(subscription || { status: "inactive", planType: "free" }),
        hasPremiumAccess: user?.hasPremiumAccess || false,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create Stripe checkout session
  app.post("/api/subscription/create-checkout", requireAuth, async (req, res) => {
    try {
      const { planType } = z.object({
        planType: z.enum(["monthly", "annual"]),
      }).parse(req.body);

      const stripe = getStripe();
      if (!stripe) {
        return res.status(503).json({
          error: "Payment processing unavailable",
          requiresSetup: true,
        });
      }

      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const priceId = getStripePriceId(planType);
      if (!priceId) {
        return res.status(500).json({ error: "Price not configured" });
      }

      // Get or create Stripe customer
      let subscription = await storage.getSubscription(userId);
      let customerId = subscription?.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId },
        });
        customerId = customer.id;

        // Create or update subscription record with customer ID
        if (subscription) {
          await storage.updateSubscription(userId, { stripeCustomerId: customerId });
        } else {
          await storage.createSubscription({
            userId,
            stripeCustomerId: customerId,
            status: "inactive",
          });
        }
      }

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${frontendUrl}/level/2/lesson/2-1?subscription=success`,
        cancel_url: `${frontendUrl}/dashboard?subscription=canceled`,
        metadata: {
          userId,
          planType,
        },
      });

      res.json({ checkoutUrl: session.url });
    } catch (error) {
      console.error("Checkout creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Stripe webhook handler
  app.post("/api/webhooks/stripe", async (req, res) => {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ error: "Stripe not configured" });
    }

    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody as Buffer, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutComplete(session, stripe);
          break;
        }
        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionUpdated(subscription);
          break;
        }
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionDeleted(subscription);
          break;
        }
        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          await handlePaymentFailed(invoice);
          break;
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook handler error:", error);
      res.status(500).json({ error: "Webhook handler failed" });
    }
  });

  // Webhook handler functions
  async function handleCheckoutComplete(session: Stripe.Checkout.Session, stripe: Stripe) {
    const userId = session.metadata?.userId;
    const planType = session.metadata?.planType as "monthly" | "annual";

    if (!userId) {
      console.error("No userId in checkout session metadata");
      return;
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string);

    // Get period end from the first subscription item
    const periodEnd = stripeSubscription.items.data[0].current_period_end;

    await storage.updateSubscription(userId, {
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0].price.id,
      status: "active",
      planType,
      currentPeriodEnd: new Date(periodEnd * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    });
  }

  async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const dbSubscription = await storage.getSubscriptionByStripeSubscriptionId(subscription.id);
    if (!dbSubscription) {
      console.error("No subscription found for Stripe subscription:", subscription.id);
      return;
    }

    let status: string = "active";
    if (subscription.status === "canceled") status = "canceled";
    else if (subscription.status === "past_due") status = "past_due";
    else if (subscription.status === "unpaid") status = "inactive";

    // Get period end from the first subscription item
    const periodEnd = subscription.items.data[0].current_period_end;

    await storage.updateSubscription(dbSubscription.userId, {
      status,
      currentPeriodEnd: new Date(periodEnd * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  }

  async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const dbSubscription = await storage.getSubscriptionByStripeSubscriptionId(subscription.id);
    if (!dbSubscription) {
      console.error("No subscription found for Stripe subscription:", subscription.id);
      return;
    }

    await storage.updateSubscription(dbSubscription.userId, {
      status: "inactive",
      stripeSubscriptionId: null,
    });
  }

  async function handlePaymentFailed(invoice: Stripe.Invoice) {
    // Get subscription from the parent subscription_details (new Stripe API structure)
    const subscriptionId = invoice.parent?.subscription_details?.subscription;
    if (!subscriptionId) return;

    const stripeSubscriptionId = typeof subscriptionId === 'string' ? subscriptionId : subscriptionId.id;
    const dbSubscription = await storage.getSubscriptionByStripeSubscriptionId(stripeSubscriptionId);
    if (!dbSubscription) {
      console.error("No subscription found for invoice subscription:", stripeSubscriptionId);
      return;
    }

    // Immediate block - no grace period
    await storage.updateSubscription(dbSubscription.userId, {
      status: "past_due",
    });
  }

  // Cancel subscription
  app.post("/api/subscription/cancel", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const subscription = await storage.getSubscription(userId);

      if (!subscription?.stripeSubscriptionId) {
        return res.status(404).json({ error: "No active subscription" });
      }

      const stripe = getStripe();
      if (!stripe) {
        return res.status(503).json({ error: "Payment processing unavailable" });
      }

      // Cancel at period end (user keeps access until subscription ends)
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      await storage.updateSubscription(userId, {
        cancelAtPeriodEnd: true,
      });

      res.json({
        success: true,
        message: "Subscription will cancel at end of billing period",
        cancelAt: subscription.currentPeriodEnd,
      });
    } catch (error) {
      console.error("Cancel subscription error:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // Create customer portal session (for managing billing)
  app.post("/api/subscription/portal", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const subscription = await storage.getSubscription(userId);

      if (!subscription?.stripeCustomerId) {
        return res.status(404).json({ error: "No billing account found" });
      }

      const stripe = getStripe();
      if (!stripe) {
        return res.status(503).json({ error: "Payment processing unavailable" });
      }

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${frontendUrl}/profile`,
      });

      res.json({ portalUrl: session.url });
    } catch (error) {
      console.error("Portal session error:", error);
      res.status(500).json({ error: "Failed to create portal session" });
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
