/**
 * This script restructures Level 1 to add a new Lesson 1-1 "TypeScript Fundamentals"
 * and renumber all existing lessons (1-1→1-2, 1-2→1-3, 1-3→1-4, 1-4→1-5)
 *
 * Run with: npx tsx scripts/restructure-level-1.ts
 */

import "dotenv/config";
import { db } from "../server/db";
import { lessons, challenges, userProgress, userAnswers } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

// New Lesson 1-1: TypeScript Fundamentals
const newLesson11 = {
  id: "1-0-temp",  // Temporary ID to avoid conflicts
  levelId: "1",
  title: "TypeScript Fundamentals",
  description: "Learn the core TypeScript concepts you'll use every day",
  order: 0,  // Will be 1 after renumbering
  xpReward: 25,
  content: `
    <h3>Welcome to TypeScript!</h3>
    <p>Before we jump into React, let's learn the TypeScript fundamentals you'll use constantly. This lesson covers the essential building blocks.</p>

    <h3>What is TypeScript?</h3>
    <p>TypeScript is JavaScript with <strong>type safety</strong>. It helps you catch errors before your code runs by letting you specify what type of data your variables, functions, and objects should contain.</p>

    <p><strong>JavaScript (no types):</strong></p>
    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>let name = "Alice";
name = 42;  // Allowed! But probably a bug...</code></pre>

    <p><strong>TypeScript (with types):</strong></p>
    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>let name: string = "Alice";
name = 42;  // ❌ Error! Type 'number' is not assignable to type 'string'</code></pre>

    <h3>Basic Types</h3>
    <p>TypeScript has several primitive types you'll use constantly:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// String - text data
let username: string = "Alice";
let email: string = "alice@example.com";

// Number - numeric data (integers and decimals)
let age: number = 25;
let price: number = 19.99;

// Boolean - true or false
let isActive: boolean = true;
let hasAccess: boolean = false;</code></pre>

    <h3>Type Annotations</h3>
    <p>The <code>: type</code> syntax is called a <strong>type annotation</strong>. It tells TypeScript what type a variable should be:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>let score: number = 100;
//         ^^^^^^^ type annotation

let message: string = "Hello";
//          ^^^^^^^ type annotation</code></pre>

    <h3>Interfaces: Defining Object Shapes</h3>
    <p>An <strong>interface</strong> defines the structure (shape) of an object. It specifies what properties the object must have and what types they should be:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface User {
  id: number;
  name: string;
  email: string;
}

// This object matches the User interface ✓
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// This would error - missing email property ✗
const badUser: User = {
  id: 2,
  name: "Bob"
  // ❌ Error: Property 'email' is missing
};</code></pre>

    <h3>Optional Properties</h3>
    <p>Use <code>?</code> to make a property optional (it can be included or skipped):</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface Product {
  id: number;
  name: string;
  description?: string;  // Optional - can be undefined
  price: number;
}

// Both of these are valid:
const laptop: Product = {
  id: 1,
  name: "Laptop",
  description: "High-performance laptop",  // description included
  price: 999
};

const mouse: Product = {
  id: 2,
  name: "Mouse",
  price: 25  // description skipped - that's OK!
};</code></pre>

    <h3>Union Types: This OR That</h3>
    <p>Use <code>|</code> (pipe) to say a value can be one of several types or values:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// Can be string OR number
let id: string | number;
id = "abc123";  // ✓ OK
id = 456;       // ✓ OK
id = true;      // ❌ Error

// Can be one of specific string values
let status: 'pending' | 'approved' | 'rejected';
status = 'pending';   // ✓ OK
status = 'approved';  // ✓ OK
status = 'done';      // ❌ Error - 'done' is not an allowed value</code></pre>

    <h3>Type Aliases: Naming Types</h3>
    <p>Use <code>type</code> to create a reusable name for a type:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>type ID = string | number;
type Status = 'active' | 'inactive' | 'pending';

// Now you can reuse these types:
let userId: ID = "user_123";
let productId: ID = 456;
let accountStatus: Status = 'active';</code></pre>

    <h3>Arrays</h3>
    <p>Add <code>[]</code> after a type to make it an array of that type:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// Array of strings
let names: string[] = ["Alice", "Bob", "Charlie"];

// Array of numbers
let scores: number[] = [95, 87, 92];

// Array of User objects
let users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" }
];</code></pre>

    <h3>Key Takeaways</h3>
    <ul>
      <li><strong>Basic types:</strong> <code>string</code>, <code>number</code>, <code>boolean</code></li>
      <li><strong>Type annotations:</strong> <code>let x: type = value</code></li>
      <li><strong>Interfaces:</strong> Define object shapes with <code>interface Name { ... }</code></li>
      <li><strong>Optional properties:</strong> Use <code>?</code> to make properties optional</li>
      <li><strong>Union types:</strong> Use <code>|</code> for "this OR that"</li>
      <li><strong>Type aliases:</strong> Use <code>type</code> to name reusable types</li>
      <li><strong>Arrays:</strong> Use <code>Type[]</code> syntax</li>
    </ul>

    <p><em>Next lesson: You'll use all of these concepts to build React components!</em></p>
  `
};

async function restructure() {
  console.log("Starting Level 1 restructure...\n");

  try {
    await db.transaction(async (tx) => {
      // Step 0: Temporarily disable foreign key constraints by dropping them
      console.log("Temporarily dropping foreign key constraints...");
      await tx.execute(sql`ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_lesson_id_lessons_id_fk`);

      // Step 1: Delete all user progress data (user gave permission)
      console.log("Deleting all user progress and answers...");
      await tx.delete(userAnswers);
      await tx.delete(userProgress);
      console.log("✅ User progress and answers deleted");

      // Step 2: Fetch all Level 1 lessons
      console.log("\nFetching existing Level 1 lessons...");
      const level1Lessons = await tx.query.lessons.findMany({
        where: eq(lessons.levelId, "1"),
        orderBy: lessons.order
      });

      console.log(`Found ${level1Lessons.length} existing lessons`);
      level1Lessons.forEach(l => console.log(`  - ${l.id}: ${l.title}`));

      // Step 2: Fetch all Level 1 challenges
      console.log("\nFetching existing Level 1 challenges...");
      const level1Challenges = await tx.query.challenges.findMany({
        where: (challenges, { like }) => like(challenges.lessonId, "1-%")
      });

      console.log(`Found ${level1Challenges.length} existing challenges`);

      // Step 3: Update challenge IDs ONLY (don't touch lessonId yet)
      console.log("\nRenumbering challenge IDs (step 1 - just IDs, keeping lessonId)...");
      for (const challenge of level1Challenges) {
        const [_, lessonNum, challengeNum] = challenge.id.split("-");
        const newLessonNum = parseInt(lessonNum) + 1;
        const newChallengeId = `1-${newLessonNum}-temp-${challengeNum}`;

        console.log(`  ${challenge.id} → ${newChallengeId}`);
        await tx.update(challenges)
          .set({ id: newChallengeId })
          .where(eq(challenges.id, challenge.id));
      }

      // Step 4: Now update lesson IDs
      console.log("\nRenumbering lessons (step 2 - temp IDs)...");
      for (const lesson of level1Lessons) {
        const currentNum = parseInt(lesson.id.split("-")[1]);
        const newNum = currentNum + 1;
        const tempId = `1-${newNum}-temp`;

        console.log(`  ${lesson.id} → ${tempId} (temp)`);
        await tx.update(lessons)
          .set({ id: tempId, order: newNum + 100 })  // Add 100 to avoid conflicts
          .where(eq(lessons.id, lesson.id));
      }

      // Step 5: Update challenge lessonIds to match new lesson IDs
      console.log("\nUpdating challenge lessonIds to match...");
      const tempChallengesForLessonUpdate = await tx.query.challenges.findMany({
        where: (challenges, { like }) => like(challenges.id, "1-%-temp-%")
      });

      for (const challenge of tempChallengesForLessonUpdate) {
        const [_, lessonNum] = challenge.id.split("-");
        const newLessonId = `1-${lessonNum}-temp`;

        console.log(`  ${challenge.id} lessonId → ${newLessonId}`);
        await tx.update(challenges)
          .set({ lessonId: newLessonId })
          .where(eq(challenges.id, challenge.id));
      }

      // Step 6: Remove -temp suffix from lessons
      console.log("\nFinalizing lesson IDs (removing temp suffix)...");
      const tempLessons = await tx.query.lessons.findMany({
        where: (lessons, { like }) => like(lessons.id, "1-%-temp")
      });

      for (const lesson of tempLessons) {
        const finalId = lesson.id.replace("-temp", "");
        const finalOrder = lesson.order - 100;  // Remove the 100 we added

        console.log(`  ${lesson.id} → ${finalId}`);
        await tx.update(lessons)
          .set({ id: finalId, order: finalOrder })
          .where(eq(lessons.id, lesson.id));
      }

      // Step 7: Remove -temp suffix from challenges
      console.log("\nFinalizing challenge IDs (removing temp suffix)...");
      const tempChallenges = await tx.query.challenges.findMany({
        where: (challenges, { like }) => like(challenges.id, "1-%-temp-%")
      });

      for (const challenge of tempChallenges) {
        const finalId = challenge.id.replace("-temp", "");
        const finalLessonId = challenge.lessonId.replace("-temp", "");

        await tx.update(challenges)
          .set({
            id: finalId,
            lessonId: finalLessonId
          })
          .where(eq(challenges.id, challenge.id));
      }

      // Step 8: Insert new Lesson 1-1
      console.log("\nInserting new Lesson 1-1: TypeScript Fundamentals...");
      await tx.insert(lessons).values({
        ...newLesson11,
        id: "1-1",
        order: 1
      });

      // Step 9: Insert challenges for new Lesson 1-1
      console.log("\nInserting 10 challenges for Lesson 1-1...");
      const newChallenges = [
        // Challenge 1: MC - Basic Types
        {
          id: "1-1-1",
          lessonId: "1-1",
          title: "Understanding Basic Types",
          prompt: "Which of the following is NOT a basic TypeScript primitive type?",
          type: "multiple-choice" as const,
          order: 1,
          xpReward: 10,
          options: [
            "string",
            "number",
            "boolean",
            "array"
          ],
          correctAnswer: 3,  // index of "array"
          explanation: "While arrays are a fundamental data structure, they are not a primitive type in TypeScript. The three primitive types are string, number, and boolean. Arrays are typed using the Type[] syntax (e.g., string[], number[])."
        },

        // Challenge 2: Code - Type Annotations
        {
          id: "1-1-2",
          lessonId: "1-1",
          title: "Adding Type Annotations",
          prompt: `Add type annotations to the following variables.

The code should:
- Declare a variable \`username\` with type \`string\` and value \`"Alice"\`
- Declare a variable \`age\` with type \`number\` and value \`25\`
- Declare a variable \`isActive\` with type \`boolean\` and value \`true\`

Example:
\`\`\`typescript
let username: string = "Alice";
let age: number = 25;
let isActive: boolean = true;
\`\`\`

Your code will be tested to ensure the type annotations are correct.`,
          type: "code" as const,
          order: 2,
          xpReward: 10,
          starterCode: `let username = "Alice";\nlet age = 25;\nlet isActive = true;`,
          sampleSolution: `let username: string = "Alice";\nlet age: number = 25;\nlet isActive: boolean = true;`,
          validationPatterns: [
            "username: string",
            "age: number",
            "isactive: boolean"
          ]
        },

        // Challenge 3: Code - Basic Interface
        {
          id: "1-1-3",
          lessonId: "1-1",
          title: "Creating Your First Interface",
          prompt: `Create an interface called \`User\` that defines the shape of a user object.

The interface should have:
- An \`id\` property of type \`number\`
- A \`name\` property of type \`string\`
- An \`email\` property of type \`string\`

Example usage:
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};
\`\`\``,
          type: "code" as const,
          order: 3,
          xpReward: 10,
          starterCode: `// Create your User interface here\n`,
          sampleSolution: `interface User {\n  id: number;\n  name: string;\n  email: string;\n}`,
          validationPatterns: [
            "interface user",
            "id: number",
            "name: string",
            "email: string"
          ]
        },

        // Challenge 4: MC - Optional Properties
        {
          id: "1-1-4",
          lessonId: "1-1",
          title: "Understanding Optional Properties",
          prompt: "What does the `?` symbol mean when used in an interface property?",
          type: "multiple-choice" as const,
          order: 4,
          xpReward: 10,
          options: [
            "The property is required",
            "The property is optional (can be included or omitted)",
            "The property is deprecated",
            "The property is a question type"
          ],
          correctAnswer: 1,  // index of "The property is optional..."
          explanation: "The `?` symbol makes a property optional in TypeScript. This means when creating an object that implements the interface, you can choose to include that property or leave it out. For example, `description?: string` means description can be a string or undefined."
        },

        // Challenge 5: Code - Optional Properties
        {
          id: "1-1-5",
          lessonId: "1-1",
          title: "Adding Optional Properties",
          prompt: `Create a \`Product\` interface with both required and optional properties.

The interface should have:
- An \`id\` property of type \`number\` (required)
- A \`name\` property of type \`string\` (required)
- A \`description\` property of type \`string\` (optional - use \`?\`)
- A \`price\` property of type \`number\` (required)

Example usage:
\`\`\`typescript
const laptop: Product = {
  id: 1,
  name: "Laptop",
  description: "High-performance laptop",
  price: 999
};

const mouse: Product = {
  id: 2,
  name: "Mouse",
  price: 25  // description omitted - that's OK!
};
\`\`\``,
          type: "code" as const,
          order: 5,
          xpReward: 10,
          starterCode: `// Create your Product interface here\n`,
          sampleSolution: `interface Product {\n  id: number;\n  name: string;\n  description?: string;\n  price: number;\n}`,
          validationPatterns: [
            "interface product",
            "id: number",
            "name: string",
            "description?: string || description? : string",
            "price: number"
          ]
        },

        // Challenge 6: MC - Union Types
        {
          id: "1-1-6",
          lessonId: "1-1",
          title: "Understanding Union Types",
          prompt: "What does the following type annotation mean: `let id: string | number;`?",
          type: "multiple-choice" as const,
          order: 6,
          xpReward: 10,
          options: [
            "id must be both a string AND a number",
            "id can be either a string OR a number",
            "id is a string that contains numbers",
            "id is an error - invalid syntax"
          ],
          correctAnswer: 1,  // index of "id can be either a string OR a number"
          explanation: "The pipe symbol `|` in TypeScript creates a union type, meaning the variable can be one type OR another. In this case, `id` can hold either a string value (like 'abc123') or a number value (like 456), but not both at the same time."
        },

        // Challenge 7: Code - Union Types
        {
          id: "1-1-7",
          lessonId: "1-1",
          title: "Using Union Types",
          prompt: `Create a type alias called \`Status\` that can be one of three specific string values.

The type should allow these values:
- \`'pending'\`
- \`'approved'\`
- \`'rejected'\`

Then create a variable \`currentStatus\` with type \`Status\` and assign it the value \`'pending'\`.

Example:
\`\`\`typescript
type Status = 'pending' | 'approved' | 'rejected';
let currentStatus: Status = 'pending';
\`\`\`

This is called a "string literal union type" - it restricts the variable to only specific string values.`,
          type: "code" as const,
          order: 7,
          xpReward: 10,
          starterCode: `// Create your Status type and currentStatus variable here\n`,
          sampleSolution: `type Status = 'pending' | 'approved' | 'rejected';\nlet currentStatus: Status = 'pending';`,
          validationPatterns: [
            "type status",
            "'pending' || \"pending\"",
            "'approved' || \"approved\"",
            "'rejected' || \"rejected\"",
            "currentstatus: status"
          ]
        },

        // Challenge 8: Code - Type Aliases
        {
          id: "1-1-8",
          lessonId: "1-1",
          title: "Creating Type Aliases",
          prompt: `Create a type alias called \`ID\` that can be either a string or a number.

Then create two variables:
- \`userId\` of type \`ID\` with value \`"user_123"\`
- \`productId\` of type \`ID\` with value \`456\`

Example:
\`\`\`typescript
type ID = string | number;
let userId: ID = "user_123";
let productId: ID = 456;
\`\`\`

Type aliases let you create reusable names for complex types!`,
          type: "code" as const,
          order: 8,
          xpReward: 10,
          starterCode: `// Create your ID type and variables here\n`,
          sampleSolution: `type ID = string | number;\nlet userId: ID = "user_123";\nlet productId: ID = 456;`,
          validationPatterns: [
            "type id",
            "string | number || number | string",
            "userid: id",
            "productid: id"
          ]
        },

        // Challenge 9: Code - Array Types
        {
          id: "1-1-9",
          lessonId: "1-1",
          title: "Typing Arrays",
          prompt: `Create three typed arrays:

1. \`names\` - an array of strings containing \`["Alice", "Bob", "Charlie"]\`
2. \`scores\` - an array of numbers containing \`[95, 87, 92]\`
3. \`flags\` - an array of booleans containing \`[true, false, true]\`

Use the \`Type[]\` syntax to specify array types.

Example:
\`\`\`typescript
let names: string[] = ["Alice", "Bob", "Charlie"];
let scores: number[] = [95, 87, 92];
let flags: boolean[] = [true, false, true];
\`\`\``,
          type: "code" as const,
          order: 9,
          xpReward: 10,
          starterCode: `// Create your typed arrays here\n`,
          sampleSolution: `let names: string[] = ["Alice", "Bob", "Charlie"];\nlet scores: number[] = [95, 87, 92];\nlet flags: boolean[] = [true, false, true];`,
          validationPatterns: [
            "names: string[]",
            "scores: number[]",
            "flags: boolean[]"
          ]
        },

        // Challenge 10: Code - Complex Interface with Arrays
        {
          id: "1-1-10",
          lessonId: "1-1",
          title: "Combining Interfaces and Arrays",
          prompt: `Create an interface called \`Team\` that represents a team with members.

The interface should have:
- A \`name\` property of type \`string\`
- A \`members\` property that is an array of strings (use \`string[]\`)
- A \`maxSize\` property of type \`number\` (optional)

Example usage:
\`\`\`typescript
interface Team {
  name: string;
  members: string[];
  maxSize?: number;
}

const devTeam: Team = {
  name: "Development",
  members: ["Alice", "Bob", "Charlie"],
  maxSize: 5
};
\`\`\``,
          type: "code" as const,
          order: 10,
          xpReward: 10,
          starterCode: `// Create your Team interface here\n`,
          sampleSolution: `interface Team {\n  name: string;\n  members: string[];\n  maxSize?: number;\n}`,
          validationPatterns: [
            "interface team",
            "name: string",
            "members: string[]",
            "maxsize?: number || maxsize? : number"
          ]
        }
      ];

      for (const challenge of newChallenges) {
        await tx.insert(challenges).values(challenge);
      }

      console.log(`✅ Inserted ${newChallenges.length} challenges for Lesson 1-1`);
      console.log("✅ Level 1 restructure complete!");

      // Verify
      console.log("\n📋 Final Level 1 structure:");
      const finalLessons = await tx.query.lessons.findMany({
        where: eq(lessons.levelId, "1"),
        orderBy: lessons.order
      });

      finalLessons.forEach(l => console.log(`  ${l.order}. ${l.id}: ${l.title}`));

      // Step 10: Re-add the foreign key constraint
      console.log("\nRe-adding foreign key constraint...");
      await tx.execute(sql`
        ALTER TABLE challenges
        ADD CONSTRAINT challenges_lesson_id_lessons_id_fk
        FOREIGN KEY (lesson_id) REFERENCES lessons(id)
      `);
      console.log("✅ Foreign key constraint re-added");
    });

    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error during restructure:", error);
    throw error;
  }
}

restructure()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
