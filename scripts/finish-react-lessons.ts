/**
 * This script completes Lessons 1-4 and creates 1-5
 * - Updates Lesson 1-4 to "React State with useState"
 * - Creates new Lesson 1-5: "Event Handlers & User Interaction"
 *
 * Run with: npx tsx scripts/finish-react-lessons.ts
 */

import "dotenv/config";
import { db } from "../server/db";
import { lessons, challenges, userProgress, userAnswers } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

async function finishReactLessons() {
  console.log("Finishing React lessons 1-4 and 1-5...\n");

  try {
    await db.transaction(async (tx) => {
      // Step 1: Delete user progress
      console.log("Deleting user progress and answers...");
      await tx.delete(userAnswers);
      await tx.delete(userProgress);
      console.log("✅ Deleted");

      // Step 2: Delete old challenges for lesson 1-4
      console.log("\nDeleting old challenges for lesson 1-4...");
      await tx.delete(challenges).where(eq(challenges.lessonId, "1-4"));
      console.log("✅ Deleted");

      // Step 3: Update Lesson 1-4 - React State with useState
      console.log("\nUpdating Lesson 1-4: React State with useState...");

      const lesson14Content = String.raw`
    <h3>Making Components Interactive with State</h3>
    <p>So far, our components have been static. Now let's make them <strong>interactive</strong> using React's <code>useState</code> hook!</p>

    <h3>What is State?</h3>
    <p>State is data that can <strong>change over time</strong>. When state changes, React automatically re-renders your component to show the new data.</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);  // State variable

  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;+&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

    <h3>Type Inference with useState</h3>
    <p>TypeScript automatically infers the type from your initial value:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>const [count, setCount] = useState(0);        // TypeScript knows count is number
const [name, setName] = useState("Alice");    // TypeScript knows name is string
const [isOpen, setIsOpen] = useState(false);  // TypeScript knows isOpen is boolean</code></pre>

    <p>You don't need to explicitly type useState in these simple cases! TypeScript is smart enough to figure it out.</p>

    <h3>Naming Convention</h3>
    <p>Always name your state setter function with "set" + your state variable name:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>const [count, setCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);
const [username, setUsername] = useState("");</code></pre>

    <h3>Updating State</h3>
    <p>Call the setter function to update state. React will re-render your component automatically!</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    &lt;button onClick={() => setIsOn(!isOn)}&gt;
      {isOn ? 'ON' : 'OFF'}
    &lt;/button&gt;
  );
}</code></pre>

    <h3>State with Numbers</h3>
    <p>Perfect for counters, scores, quantities, etc:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;Increment&lt;/button&gt;
      &lt;button onClick={() => setCount(count - 1)}&gt;Decrement&lt;/button&gt;
      &lt;button onClick={() => setCount(0)}&gt;Reset&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

    <h3>State with Strings</h3>
    <p>Great for form inputs, text fields, etc:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function Greeting() {
  const [name, setName] = useState("");

  return (
    &lt;div&gt;
      &lt;input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      /&gt;
      &lt;p&gt;Hello, {name || "stranger"}!&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>

    <h3>State with Booleans</h3>
    <p>Perfect for toggles, visibility, loading states:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function Accordion() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    &lt;div&gt;
      &lt;button onClick={() => setIsExpanded(!isExpanded)}&gt;
        {isExpanded ? 'Collapse' : 'Expand'}
      &lt;/button&gt;
      {isExpanded && (
        &lt;p&gt;This content is now visible!&lt;/p&gt;
      )}
    &lt;/div&gt;
  );
}</code></pre>

    <h3>Key Takeaways</h3>
    <ul>
      <li>Use <code>useState</code> to add interactive state to components</li>
      <li>TypeScript infers types from initial values automatically</li>
      <li>Always destructure as <code>[value, setValue]</code></li>
      <li>Call the setter function to update state and trigger re-render</li>
      <li>State can be numbers, strings, booleans, and more complex types!</li>
    </ul>

    <p><em>Next lesson: We'll handle user interactions with event handlers!</em></p>
      `;

      await tx.update(lessons)
        .set({
          title: "React State with useState",
          description: "Make components interactive with useState hook",
          content: lesson14Content,
          xpReward: 25
        })
        .where(eq(lessons.id, "1-4"));
      console.log("✅ Updated");

      // Add challenges for 1-4
      console.log("Adding 6 challenges for Lesson 1-4...");
      const lesson14Challenges = [
        // Challenge 1: MC
        {
          id: "1-4-1",
          lessonId: "1-4",
          title: "Understanding useState",
          prompt: "What does the useState hook return?",
          type: "multiple-choice" as const,
          order: 1,
          xpReward: 10,
          choices: [
            "Just the current state value",
            "Just the setter function",
            "An array with [currentValue, setterFunction]",
            "An object with state and setState properties"
          ],
          correctAnswer: 2,
          explanation: "useState returns an array with exactly two elements: [currentValue, setterFunction]. We use array destructuring to get both: const [count, setCount] = useState(0);"
        },
        // Challenge 2: Code - Counter
        {
          id: "1-4-2",
          lessonId: "1-4",
          title: "Create a Simple Counter",
          prompt: "Create a Counter component with useState.\n\nThe component should:\n- Import useState from 'react'\n- Create a state variable `count` initialized to 0\n- Return a div containing:\n  - A paragraph showing the count\n  - A button that increments the count when clicked\n\nExample:\n```typescript\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n    </div>\n  );\n}\n```",
          type: "code" as const,
          order: 2,
          xpReward: 10,
          starterCode: "import { useState } from 'react';\n\n// Create your Counter component here\n",
          solution: "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n    </div>\n  );\n}",
          testCode: `
const result = Counter();
if (!result) throw new Error('Counter should return JSX');
return true;
          `
        },
        // Challenge 3: Code - Toggle
        {
          id: "1-4-3",
          lessonId: "1-4",
          title: "Create a Toggle Component",
          prompt: "Create a Toggle component that switches between ON and OFF.\n\nThe component should:\n- Use useState with a boolean initialized to false\n- Return a button that toggles the state when clicked\n- Display 'ON' when true, 'OFF' when false\n\nExample:\n```typescript\nimport { useState } from 'react';\n\nfunction Toggle() {\n  const [isOn, setIsOn] = useState(false);\n\n  return (\n    <button onClick={() => setIsOn(!isOn)}>\n      {isOn ? 'ON' : 'OFF'}\n    </button>\n  );\n}\n```",
          type: "code" as const,
          order: 3,
          xpReward: 10,
          starterCode: "import { useState } from 'react';\n\n// Create your Toggle component here\n",
          solution: "import { useState } from 'react';\n\nfunction Toggle() {\n  const [isOn, setIsOn] = useState(false);\n\n  return (\n    <button onClick={() => setIsOn(!isOn)}>\n      {isOn ? 'ON' : 'OFF'}\n    </button>\n  );\n}",
          testCode: `
const result = Toggle();
if (!result) throw new Error('Toggle should return JSX');
return true;
          `
        },
        // Challenge 4: MC - Type Inference
        {
          id: "1-4-4",
          lessonId: "1-4",
          title: "Type Inference with useState",
          prompt: "Given `const [count, setCount] = useState(0);`, what type does TypeScript infer for `count`?",
          type: "multiple-choice" as const,
          order: 4,
          xpReward: 10,
          choices: [
            "any",
            "unknown",
            "number",
            "string"
          ],
          correctAnswer: 2,
          explanation: "TypeScript automatically infers the type from the initial value. Since we passed 0 (a number), TypeScript knows that count is of type number!"
        },
        // Challenge 5: Code - Text Input
        {
          id: "1-4-5",
          lessonId: "1-4",
          title: "Create a Name Input",
          prompt: "Create a NameInput component that displays what the user types.\n\nThe component should:\n- Use useState with a string initialized to an empty string\n- Return a div containing:\n  - An input element with value={name}\n  - An onChange handler that updates the state\n  - A paragraph that displays the name\n\nExample:\n```typescript\nimport { useState } from 'react';\n\nfunction NameInput() {\n  const [name, setName] = useState(\"\");\n\n  return (\n    <div>\n      <input value={name} onChange={(e) => setName(e.target.value)} />\n      <p>Hello, {name}!</p>\n    </div>\n  );\n}\n```",
          type: "code" as const,
          order: 5,
          xpReward: 10,
          starterCode: "import { useState } from 'react';\n\n// Create your NameInput component here\n",
          solution: "import { useState } from 'react';\n\nfunction NameInput() {\n  const [name, setName] = useState(\"\");\n\n  return (\n    <div>\n      <input value={name} onChange={(e) => setName(e.target.value)} />\n      <p>Hello, {name}!</p>\n    </div>\n  );\n}",
          testCode: `
const result = NameInput();
if (!result) throw new Error('NameInput should return JSX');
return true;
          `
        },
        // Challenge 6: Code - Counter with Reset
        {
          id: "1-4-6",
          lessonId: "1-4",
          title: "Counter with Multiple Buttons",
          prompt: "Create a Counter component with increment, decrement, and reset buttons.\n\nThe component should:\n- Use useState with count initialized to 0\n- Return a div containing:\n  - A paragraph showing the count\n  - A button to increment (count + 1)\n  - A button to decrement (count - 1)\n  - A button to reset (set to 0)\n\nExample:\n```typescript\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n      <button onClick={() => setCount(count - 1)}>-</button>\n      <button onClick={() => setCount(0)}>Reset</button>\n    </div>\n  );\n}\n```",
          type: "code" as const,
          order: 6,
          xpReward: 10,
          starterCode: "import { useState } from 'react';\n\n// Create your Counter component here\n",
          solution: "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n      <button onClick={() => setCount(count - 1)}>-</button>\n      <button onClick={() => setCount(0)}>Reset</button>\n    </div>\n  );\n}",
          testCode: `
const result = Counter();
if (!result) throw new Error('Counter should return JSX');
return true;
          `
        }
      ];

      for (const challenge of lesson14Challenges) {
        await tx.insert(challenges).values(challenge);
      }
      console.log("✅ Added 6 challenges");

      // Step 4: Create Lesson 1-5 - Event Handlers
      console.log("\nCreating Lesson 1-5: Event Handlers & User Interaction...");

      const lesson15Content = String.raw`
    <h3>Handling User Interactions</h3>
    <p>Now let's learn how to respond to user actions like clicks, form submissions, and keyboard input!</p>

    <h3>onClick Events</h3>
    <p>The most common event! Use it for buttons, divs, and other clickable elements:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function Button() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return &lt;button onClick={handleClick}&gt;Click me&lt;/button&gt;;
}

// Or inline:
function Button() {
  return (
    &lt;button onClick={() => console.log('Clicked!')}&gt;
      Click me
    &lt;/button&gt;
  );
}</code></pre>

    <h3>Typing Event Handlers</h3>
    <p>For simple handlers, you don't need explicit types:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// TypeScript infers this automatically!
const handleClick = () => {
  console.log('Clicked');
};

// If you need the type, it's: () => void
const handleClick: () => void = () => {
  console.log('Clicked');
};</code></pre>

    <h3>Events with Parameters</h3>
    <p>Pass data to your event handlers:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function ProductList() {
  const handleDelete = (id: number) => {
    console.log('Delete product:', id);
  };

  return (
    &lt;div&gt;
      &lt;button onClick={() => handleDelete(1)}&gt;Delete Product 1&lt;/button&gt;
      &lt;button onClick={() => handleDelete(2)}&gt;Delete Product 2&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

    <h3>Parent-Child Communication</h3>
    <p>Pass callback functions as props to let children communicate with parents:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface DeleteButtonProps {
  productId: number;
  onDelete: (id: number) => void;  // Callback prop
}

function DeleteButton({ productId, onDelete }: DeleteButtonProps) {
  return (
    &lt;button onClick={() => onDelete(productId)}&gt;
      Delete
    &lt;/button&gt;
  );
}

// Parent component
function ProductPage() {
  const handleDelete = (id: number) => {
    console.log('Deleting:', id);
  };

  return &lt;DeleteButton productId={1} onDelete={handleDelete} /&gt;;
}</code></pre>

    <h3>onChange Events</h3>
    <p>Handle form input changes:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    &lt;input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    /&gt;
  );
}</code></pre>

    <h3>Callback Prop Types</h3>
    <p>Common patterns for typing callback props:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface Props {
  onClick: () => void;                    // No parameters
  onSubmit: (data: string) => void;       // With parameter
  onSave: (id: number, name: string) => void;  // Multiple parameters
}</code></pre>

    <h3>Key Takeaways</h3>
    <ul>
      <li>Use <code>onClick</code> for button and element clicks</li>
      <li>Use <code>onChange</code> for form inputs</li>
      <li>Pass callbacks as props for parent-child communication</li>
      <li>Type callbacks as <code>(params) => void</code></li>
      <li>Use arrow functions to pass parameters: <code>onClick={() => handler(id)}</code></li>
    </ul>

    <p><em>Congratulations! You've completed Level 1 and learned the fundamentals of TypeScript + React!</em></p>
      `;

      await tx.insert(lessons).values({
        id: "1-5",
        levelId: "1",
        title: "Event Handlers & User Interaction",
        description: "Handle user interactions with typed event handlers",
        content: lesson15Content,
        order: 5,
        xpReward: 25
      });
      console.log("✅ Created");

      // Add challenges for 1-5
      console.log("Adding 6 challenges for Lesson 1-5...");
      const lesson15Challenges = [
        // Challenge 1: MC
        {
          id: "1-5-1",
          lessonId: "1-5",
          title: "Understanding onClick",
          prompt: "What is the correct way to attach a click handler to a button in React?",
          type: "multiple-choice" as const,
          order: 1,
          xpReward: 10,
          choices: [
            "<button onclick={handleClick}>Click</button>",
            "<button onClick={handleClick()}>Click</button>",
            "<button onClick={handleClick}>Click</button>",
            "<button click={handleClick}>Click</button>"
          ],
          correctAnswer: 2,
          explanation: "Use onClick (camelCase) and pass the function reference without calling it: onClick={handleClick}. Don't use onclick (lowercase) or call the function with ()."
        },
        // Challenge 2: Code
        {
          id: "1-5-2",
          lessonId: "1-5",
          title: "Create a Click Handler",
          prompt: "Create an AlertButton component that shows an alert when clicked.\n\nThe component should:\n- Define a handleClick function that calls alert('Button clicked!')\n- Return a button with onClick={handleClick}\n- Display 'Click Me' as the button text\n\nExample:\n```typescript\nfunction AlertButton() {\n  const handleClick = () => {\n    alert('Button clicked!');\n  };\n\n  return <button onClick={handleClick}>Click Me</button>;\n}\n```",
          type: "code" as const,
          order: 2,
          xpReward: 10,
          starterCode: "// Create your AlertButton component here\n",
          solution: "function AlertButton() {\n  const handleClick = () => {\n    alert('Button clicked!');\n  };\n\n  return <button onClick={handleClick}>Click Me</button>;\n}",
          testCode: `
const result = AlertButton();
if (!result) throw new Error('AlertButton should return JSX');
return true;
          `
        },
        // Challenge 3: Code
        {
          id: "1-5-3",
          lessonId: "1-5",
          title: "Event Handler with Parameter",
          prompt: "Create a GreetButton component that takes a name prop and shows an alert.\n\nThe component interface should have:\n- A name property of type string\n\nThe component should:\n- Accept props typed with GreetButtonProps\n- Define handleClick that shows alert with 'Hello, {name}!'\n- Return a button with onClick={handleClick}\n\nExample:\n```typescript\ninterface GreetButtonProps {\n  name: string;\n}\n\nfunction GreetButton({ name }: GreetButtonProps) {\n  const handleClick = () => {\n    alert('Hello, ' + name + '!');\n  };\n\n  return <button onClick={handleClick}>Greet</button>;\n}\n```",
          type: "code" as const,
          order: 3,
          xpReward: 10,
          starterCode: "// Create your GreetButtonProps and GreetButton component here\n",
          solution: "interface GreetButtonProps {\n  name: string;\n}\n\nfunction GreetButton({ name }: GreetButtonProps) {\n  const handleClick = () => {\n    alert('Hello, ' + name + '!');\n  };\n\n  return <button onClick={handleClick}>Greet</button>;\n}",
          testCode: `
const result = GreetButton({ name: "Alice" });
if (!result) throw new Error('GreetButton should return JSX');
return true;
          `
        },
        // Challenge 4: MC
        {
          id: "1-5-4",
          lessonId: "1-5",
          title: "Callback Prop Types",
          prompt: "How do you type a callback prop that takes a number and returns nothing?",
          type: "multiple-choice" as const,
          order: 4,
          xpReward: 10,
          choices: [
            "onDelete: number => void",
            "onDelete: (id: number) => void",
            "onDelete: function(id: number)",
            "onDelete: void(number)"
          ],
          correctAnswer: 1,
          explanation: "Callback props are typed as arrow functions: (param: Type) => void. The parentheses around the parameter are required when specifying types!"
        },
        // Challenge 5: Code
        {
          id: "1-5-5",
          lessonId: "1-5",
          title: "Create a Delete Button with Callback",
          prompt: "Create a DeleteButton component that calls a callback when clicked.\n\nThe DeleteButtonProps interface should have:\n- A productId property of type number\n- An onDelete property of type (id: number) => void\n\nThe component should:\n- Accept props typed with DeleteButtonProps\n- Return a button that calls onDelete(productId) when clicked\n- Display 'Delete' as the button text\n\nExample:\n```typescript\ninterface DeleteButtonProps {\n  productId: number;\n  onDelete: (id: number) => void;\n}\n\nfunction DeleteButton({ productId, onDelete }: DeleteButtonProps) {\n  return (\n    <button onClick={() => onDelete(productId)}>\n      Delete\n    </button>\n  );\n}\n```",
          type: "code" as const,
          order: 5,
          xpReward: 10,
          starterCode: "// Create your DeleteButtonProps and DeleteButton component here\n",
          solution: "interface DeleteButtonProps {\n  productId: number;\n  onDelete: (id: number) => void;\n}\n\nfunction DeleteButton({ productId, onDelete }: DeleteButtonProps) {\n  return (\n    <button onClick={() => onDelete(productId)}>\n      Delete\n    </button>\n  );\n}",
          testCode: `
const mockDelete = (id: number) => {};
const result = DeleteButton({ productId: 1, onDelete: mockDelete });
if (!result) throw new Error('DeleteButton should return JSX');
return true;
          `
        },
        // Challenge 6: Code
        {
          id: "1-5-6",
          lessonId: "1-5",
          title: "Search Input with onChange",
          prompt: "Create a SearchInput component with state and onChange handler.\n\nThe component should:\n- Import useState from 'react'\n- Use useState with query initialized to empty string\n- Return an input element with:\n  - value={query}\n  - onChange handler that updates query with e.target.value\n  - placeholder=\"Search...\"\n\nExample:\n```typescript\nimport { useState } from 'react';\n\nfunction SearchInput() {\n  const [query, setQuery] = useState(\"\");\n\n  return (\n    <input\n      value={query}\n      onChange={(e) => setQuery(e.target.value)}\n      placeholder=\"Search...\"\n    />\n  );\n}\n```",
          type: "code" as const,
          order: 6,
          xpReward: 10,
          starterCode: "import { useState } from 'react';\n\n// Create your SearchInput component here\n",
          solution: "import { useState } from 'react';\n\nfunction SearchInput() {\n  const [query, setQuery] = useState(\"\");\n\n  return (\n    <input\n      value={query}\n      onChange={(e) => setQuery(e.target.value)}\n      placeholder=\"Search...\"\n    />\n  );\n}",
          testCode: `
const result = SearchInput();
if (!result) throw new Error('SearchInput should return JSX');
return true;
          `
        }
      ];

      for (const challenge of lesson15Challenges) {
        await tx.insert(challenges).values(challenge);
      }
      console.log("✅ Added 6 challenges");

      console.log("\n✅ All React lessons complete!");
    });

    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

finishReactLessons()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
