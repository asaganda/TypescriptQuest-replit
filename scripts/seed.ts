import { db } from "../server/db";
import { 
  levels, 
  lessons, 
  challenges, 
  badges,
  type InsertLevel,
  type InsertLesson,
  type InsertChallenge,
  type InsertBadge
} from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Starting database seed...");

  try {
    await db.transaction(async (tx) => {
      // Check and seed each table independently for idempotence

      // Seed levels (check if already seeded)
      const existingLevels = await tx.select().from(levels);
      if (existingLevels.length === 0) {
        console.log("Seeding levels...");
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

        await tx.insert(levels).values(levelsData);
        console.log("✓ Levels seeded");
      } else {
        console.log("✓ Levels already seeded, skipping");
      }

      // Seed lessons (check if already seeded)
      const existingLessons = await tx.select().from(lessons);
      if (existingLessons.length === 0) {
        console.log("Seeding lessons...");
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

        await tx.insert(lessons).values(lessonsData);
        console.log("✓ Lessons seeded");
      } else {
        console.log("✓ Lessons already seeded, skipping");
      }

      // Seed challenges (check if already seeded)
      const existingChallenges = await tx.select().from(challenges);
      if (existingChallenges.length === 0) {
        console.log("Seeding challenges...");
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
          validationPatterns: [],
          hint: null
        },
        {
          id: "1-1-2",
          lessonId: "1-1",
          type: "code",
          prompt: "Add type annotations to all three variables below",
          order: 2,
          xpReward: 30,
          options: [],
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
          validationPatterns: [],
          hint: null
        },
        {
          id: "1-2-2",
          lessonId: "1-2",
          type: "code",
          prompt: "Create an interface named 'Product' with properties: id (number), name (string), and price (number)",
          order: 2,
          xpReward: 30,
          options: [],
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
          validationPatterns: [],
          hint: null
        }
      ];

        await tx.insert(challenges).values(challengesData);
        console.log("✓ Challenges seeded");
      } else {
        console.log("✓ Challenges already seeded, skipping");
      }

      // Seed badges (check if already seeded)
      const existingBadges = await tx.select().from(badges);
      if (existingBadges.length === 0) {
        console.log("Seeding badges...");
        const badgesData: InsertBadge[] = [
        { id: "first-lesson", name: "First Steps", description: "Complete your first lesson", icon: "book" },
        { id: "five-challenges", name: "Problem Solver", description: "Solve 5 challenges", icon: "zap" },
        { id: "no-hints", name: "Pure Skill", description: "Complete a lesson without using hints", icon: "trophy" },
        { id: "perfect-score", name: "Perfectionist", description: "Get 100% on all challenges in a lesson", icon: "star" },
        { id: "speed-demon", name: "Speed Demon", description: "Complete a challenge quickly", icon: "target" },
        { id: "level-master", name: "Level Master", description: "Complete all lessons in a level", icon: "trophy" }
      ];

        await tx.insert(badges).values(badgesData);
        console.log("✓ Badges seeded");
      } else {
        console.log("✓ Badges already seeded, skipping");
      }
    });

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seed();
