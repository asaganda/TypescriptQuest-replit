import "dotenv/config";
import { db } from "../server/db";
import { lessons, challenges } from "@shared/schema";
import { eq } from "drizzle-orm";

async function updateLevel1() {
  console.log("Updating Level 1 lessons and challenges...");

  try {
    await db.transaction(async (tx) => {
      // Update Lesson 1-1 content
      console.log("Updating Lesson 1-1: Your First Typed Component");
      await tx.update(lessons)
        .set({
          title: "Your First Typed Component",
          description: "Build React components with typed props",
          content: `
          <h3>Welcome to TypeScript + React!</h3>
          <p>You're going to build your first typed React component in the next 10 minutes. Ready? Let's go!</p>

          <h3>Why Type Your Props?</h3>
          <p>Without TypeScript, you can pass the wrong props to a component and won't know until it breaks:</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// JavaScript - no error until it breaks!
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

// Oops! Passed a number instead of string - React shows "42" in the button
<Button label={42} onClick={handleClick} />

// Oops! Forgot onClick - app crashes when you click
<Button label="Click me" /></code></pre>

          <p><strong>With TypeScript, you catch these mistakes immediately:</strong></p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// TypeScript - errors caught before you even run the code!
interface ButtonProps {
  label: string;     // Must be a string
  onClick: () => void;  // Must be a function
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ TypeScript error: Type 'number' is not assignable to type 'string'
<Button label={42} onClick={handleClick} />

// ❌ TypeScript error: Property 'onClick' is missing
<Button label="Click me" /></code></pre>

          <h3>Your First Component: Button</h3>
          <p>Here's how you define typed props for a React component:</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface ButtonProps {
  label: string;           // Required: button text
  variant?: 'primary' | 'secondary';  // Optional: button style
  onClick: () => void;     // Required: click handler function
}

function Button({ label, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}</code></pre>

          <h3>Breaking It Down</h3>

          <p><strong>1. The interface defines the "shape" of your props:</strong></p>
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface ButtonProps {
  label: string;     // This prop is required and must be a string
  variant?: string;  // The ? makes this prop optional
  onClick: () => void;  // This prop must be a function
}</code></pre>

          <p><strong>2. Use the interface to type your component props:</strong></p>
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function Button({ label, variant, onClick }: ButtonProps) {
  //                                           ^^^^^^^^^^^^^
  //                        This tells TypeScript what props this component accepts
}</code></pre>

          <h3>Optional Properties</h3>
          <p>The <code>?</code> symbol makes a property optional:</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface CardProps {
  title: string;        // Required - must be provided
  description?: string; // Optional - can be skipped
}

// Both of these work:
<Card title="Hello" description="World" />
<Card title="Hello" />  {/* description is optional */}</code></pre>

          <h3>Basic Types You'll Use Constantly</h3>
          <ul>
            <li><code>string</code> - Text like "hello", "user@example.com"</li>
            <li><code>number</code> - Numbers like 42, 3.14, -10</li>
            <li><code>boolean</code> - true or false</li>
            <li><code>() => void</code> - A function that returns nothing (like onClick handlers)</li>
          </ul>

          <h3>Union Types for Variants</h3>
          <p>Use <code>|</code> to restrict values to specific options:</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  //       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //       Can ONLY be one of these three values
}

// ✅ This works
<Button variant="primary" />

// ❌ TypeScript error - "blue" is not an allowed value
<Button variant="blue" /></code></pre>

          <h3>Key Takeaways</h3>
          <ul>
            <li><strong>Define an interface</strong> to describe your component's props</li>
            <li><strong>Use :</strong> to type your props in the function signature</li>
            <li><strong>Use ?</strong> to make props optional</li>
            <li><strong>Use |</strong> for union types (this OR that)</li>
            <li><strong>TypeScript catches errors before you run your code!</strong></li>
          </ul>
        `
        })
        .where(eq(lessons.id, "1-1"));

      console.log("✓ Updated Lesson 1-1");
    });

    console.log("✓ Level 1 update complete!");
  } catch (error) {
    console.error("❌ Error updating Level 1:", error);
    throw error;
  }
}

updateLevel1()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed:", error);
    process.exit(1);
  });
