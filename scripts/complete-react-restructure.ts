/**
 * This script completes the React-first restructure of Level 1
 * - Updates Lessons 1-2, 1-3, 1-4 with React content
 * - Adds new Lesson 1-5: Event Handlers
 * - Creates all challenges for these lessons
 *
 * Run with: npx tsx scripts/complete-react-restructure.ts
 */

import "dotenv/config";
import { db } from "../server/db";
import { lessons, challenges, userProgress, userAnswers } from "@shared/schema";
import { eq, sql, inArray } from "drizzle-orm";

async function completeReactRestructure() {
  console.log("Starting complete React restructure of Level 1...\n");

  try {
    await db.transaction(async (tx) => {
      // Step 1: Delete user progress
      console.log("Deleting user progress and answers...");
      await tx.delete(userAnswers);
      await tx.delete(userProgress);
      console.log("✅ Deleted");

      // Step 2: Delete old challenges for lessons 1-2, 1-3, 1-4
      console.log("\nDeleting old challenges for lessons 1-2, 1-3, 1-4...");
      await tx.delete(challenges).where(inArray(challenges.lessonId, ["1-2", "1-3", "1-4"]));
      console.log("✅ Deleted");

      // Step 3: Update Lesson 1-2 - Your First Typed Component
      console.log("\nUpdating Lesson 1-2: Your First Typed Component...");
      await tx.update(lessons)
        .set({
          title: "Your First Typed Component",
          description: "Build React components with TypeScript props",
          content: `
    <h3>Welcome to React + TypeScript!</h3>
    <p>Now that you know TypeScript fundamentals, let's use them to build <strong>real React components</strong>. This is where TypeScript truly shines - catching bugs before your users see them!</p>

    <h3>Why TypeScript in React?</h3>
    <p>Imagine building a Button component. Without types:</p>
    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// JavaScript - What props does this take? 🤔
function Button(props) {
  return &lt;button&gt;{props.label}&lt;/button&gt;;
}</code></pre>

    <p>With TypeScript, it's crystal clear:</p>
    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// TypeScript - Props are documented!
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
}

function Button({ label, variant = 'primary' }: ButtonProps) {
  return &lt;button className={variant}&gt;{label}&lt;/button&gt;;
}</code></pre>

    <h3>Typing Component Props</h3>
    <p>Props are just objects, so we use <strong>interfaces</strong> to define their shape:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface GreetingProps {
  name: string;        // Required prop
  age?: number;        // Optional prop
}

function Greeting({ name, age }: GreetingProps) {
  return (
    &lt;div&gt;
      &lt;h1&gt;Hello, {name}!&lt;/h1&gt;
      {age && &lt;p&gt;You are {age} years old&lt;/p&gt;}
    &lt;/div&gt;
  );
}

// Usage:
&lt;Greeting name="Alice" /&gt;          // ✓ OK
&lt;Greeting name="Bob" age={25} /&gt;  // ✓ OK
&lt;Greeting age={30} /&gt;              // ❌ Error - name is required!</code></pre>

    <h3>Optional Props with Default Values</h3>
    <p>Use <code>?</code> for optional props and provide defaults in the destructuring:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface CardProps {
  title: string;
  description?: string;
  highlighted?: boolean;
}

function Card({ title, description, highlighted = false }: CardProps) {
  return (
    &lt;div className={highlighted ? 'bg-yellow' : 'bg-white'}&gt;
      &lt;h2&gt;{title}&lt;/h2&gt;
      {description && &lt;p&gt;{description}&lt;/p&gt;}
    &lt;/div&gt;
  );
}</code></pre>

    <h3>Union Types for Variants</h3>
    <p>Use union types to restrict props to specific values:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface BadgeProps {
  text: string;
  status: 'success' | 'warning' | 'error';  // Only these 3 values!
}

function Badge({ text, status }: BadgeProps) {
  const colors = {
    success: 'green',
    warning: 'yellow',
    error: 'red'
  };

  return &lt;span className={colors[status]}&gt;{text}&lt;/span&gt;;
}

// Usage:
&lt;Badge text="Active" status="success" /&gt;  // ✓ OK
&lt;Badge text="Failed" status="danger" /&gt;   // ❌ Error - "danger" is not allowed!</code></pre>

    <h3>Key Takeaways</h3>
    <ul>
      <li>Use <strong>interfaces</strong> to define component props</li>
      <li>Mark optional props with <code>?</code></li>
      <li>Provide default values in destructuring: <code>{ prop = 'default' }</code></li>
      <li>Use <strong>union types</strong> for variants: <code>'primary' | 'secondary'</code></li>
      <li>TypeScript will catch missing or invalid props immediately!</li>
    </ul>

    <p><em>Next lesson: We'll render lists of data with typed arrays!</em></p>
          `,
          xpReward: 25
        })
        .where(eq(lessons.id, "1-2"));
      console.log("✅ Updated");

      console.log("Adding 6 challenges for Lesson 1-2...");
      const lesson12Challenges = [
        // Challenge 1: MC
        {
          id: "1-2-1",
          lessonId: "1-2",
          title: "Understanding Component Props",
          prompt: "In React with TypeScript, how do you define the shape of a component's props?",
          type: "multiple-choice" as const,
          order: 1,
          xpReward: 10,
          choices: [
            "Using an interface or type alias",
            "Using a class",
            "Props are automatically typed",
            "Using PropTypes from prop-types package"
          ],
          correctAnswer: 0,
          explanation: "In TypeScript React, you define component props using an interface or type alias. This provides compile-time type checking and excellent IDE support."
        },
        // Challenge 2: Code - Basic Props
        {
          id: "1-2-2",
          lessonId: "1-2",
          title: "Create a Greeting Component",
          prompt: `Create a \`GreetingProps\` interface and a \`Greeting\` component.

The interface should have:
- A \`name\` property of type \`string\` (required)

The component should:
- Accept props typed with \`GreetingProps\`
- Return a \`<h1>\` element with the text "Hello, {name}!"

Example:
\`\`\`typescript
interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\``,
          type: "code" as const,
          order: 2,
          xpReward: 10,
          starterCode: `// Create your GreetingProps interface and Greeting component here\n`,
          solution: `interface GreetingProps {\n  name: string;\n}\n\nfunction Greeting({ name }: GreetingProps) {\n  return <h1>Hello, {name}!</h1>;\n}`,
          testCode: `
// Test the component
const TestGreeting = Greeting({ name: "Alice" });
if (!TestGreeting) throw new Error('Component should return JSX');
return true;
          `
        },
        // Challenge 3: Code - Optional Props
        {
          id: "1-2-3",
          lessonId: "1-2",
          title: "Add Optional Props",
          prompt: `Create a \`CardProps\` interface and a \`Card\` component with optional props.

The interface should have:
- A \`title\` property of type \`string\` (required)
- A \`description\` property of type \`string\` (optional - use \`?\`)

The component should:
- Accept props typed with \`CardProps\`
- Return a \`<div>\` containing an \`<h2>\` with the title
- If description is provided, also render a \`<p>\` with the description

Example:
\`\`\`typescript
interface CardProps {
  title: string;
  description?: string;
}

function Card({ title, description }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
\`\`\``,
          type: "code" as const,
          order: 3,
          xpReward: 10,
          starterCode: `// Create your CardProps interface and Card component here\n`,
          solution: `interface CardProps {\n  title: string;\n  description?: string;\n}\n\nfunction Card({ title, description }: CardProps) {\n  return (\n    <div>\n      <h2>{title}</h2>\n      {description && <p>{description}</p>}\n    </div>\n  );\n}`,
          testCode: `
// Test with and without optional prop
const card1 = Card({ title: "Test", description: "Desc" });
const card2 = Card({ title: "Test" });
if (!card1 || !card2) throw new Error('Component should work with and without optional props');
return true;
          `
        },
        // Challenge 4: MC - Union Types
        {
          id: "1-2-4",
          lessonId: "1-2",
          title: "Understanding Union Type Props",
          prompt: "What does the type `variant: 'primary' | 'secondary'` mean for a component prop?",
          type: "multiple-choice" as const,
          order: 4,
          xpReward: 10,
          choices: [
            "variant can be any string",
            "variant must be exactly 'primary' or 'secondary'",
            "variant must be both 'primary' and 'secondary'",
            "variant is optional"
          ],
          correctAnswer: 1,
          explanation: "The pipe symbol `|` creates a union type. This means variant must be one of the specific string literals: either 'primary' or 'secondary'. This provides type safety and prevents typos!"
        },
        // Challenge 5: Code - Union Type Props
        {
          id: "1-2-5",
          lessonId: "1-2",
          title: "Create a Button with Variants",
          prompt: `Create a \`ButtonProps\` interface and \`Button\` component with a union type prop.

The interface should have:
- A \`label\` property of type \`string\` (required)
- A \`variant\` property that can only be \`'primary'\` or \`'secondary'\` (required)

The component should:
- Accept props typed with \`ButtonProps\`
- Return a \`<button>\` element with the label as its content

Example:
\`\`\`typescript
interface ButtonProps {
  label: string;
  variant: 'primary' | 'secondary';
}

function Button({ label, variant }: ButtonProps) {
  return <button>{label}</button>;
}
\`\`\``,
          type: "code" as const,
          order: 5,
          xpReward: 10,
          starterCode: `// Create your ButtonProps interface and Button component here\n`,
          solution: `interface ButtonProps {\n  label: string;\n  variant: 'primary' | 'secondary';\n}\n\nfunction Button({ label, variant }: ButtonProps) {\n  return <button>{label}</button>;\n}`,
          testCode: `
// Test with both variants
const btn1 = Button({ label: "Click", variant: "primary" });
const btn2 = Button({ label: "Click", variant: "secondary" });
if (!btn1 || !btn2) throw new Error('Button should work with both variants');
return true;
          `
        },
        // Challenge 6: Code - Default Values
        {
          id: "1-2-6",
          lessonId: "1-2",
          title: "Add Default Prop Values",
          prompt: `Create a \`BadgeProps\` interface and \`Badge\` component with a default value.

The interface should have:
- A \`text\` property of type \`string\` (required)
- A \`color\` property of type \`string\` (optional)

The component should:
- Provide a default value of \`"blue"\` for the \`color\` prop in the destructuring
- Return a \`<span>\` element with the text

Example:
\`\`\`typescript
interface BadgeProps {
  text: string;
  color?: string;
}

function Badge({ text, color = "blue" }: BadgeProps) {
  return <span>{text}</span>;
}
\`\`\``,
          type: "code" as const,
          order: 6,
          xpReward: 10,
          starterCode: `// Create your BadgeProps interface and Badge component here\n`,
          solution: `interface BadgeProps {\n  text: string;\n  color?: string;\n}\n\nfunction Badge({ text, color = "blue" }: BadgeProps) {\n  return <span>{text}</span>;\n}`,
          testCode: `
// Test with and without color
const badge1 = Badge({ text: "New", color: "red" });
const badge2 = Badge({ text: "New" });
if (!badge1 || !badge2) throw new Error('Badge should work with and without color prop');
return true;
          `
        }
      ];

      for (const challenge of lesson12Challenges) {
        await tx.insert(challenges).values(challenge);
      }
      console.log("✅ Added 6 challenges");

      // Step 4: Update Lesson 1-3 - Lists, Arrays & Rendering Data
      console.log("\nUpdating Lesson 1-3: Lists, Arrays & Rendering Data...");

      const lesson13Content = String.raw`
    <h3>Rendering Lists in React</h3>
    <p>One of the most common tasks in React is rendering lists of data. TypeScript makes this safe and predictable!</p>

    <h3>Array Types Recap</h3>
    <p>Remember from Lesson 1-1: arrays are typed with <code>Type[]</code>:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>const names: string[] = ["Alice", "Bob", "Charlie"];
const ages: number[] = [25, 30, 35];</code></pre>

    <h3>Arrays of Objects</h3>
    <p>For complex data, combine interfaces with arrays:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" }
];</code></pre>

    <h3>Typing Array Props</h3>
    <p>Pass arrays as props using the same syntax:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface UserListProps {
  users: User[];  // Array of User objects
}

function UserList({ users }: UserListProps) {
  return (
    &lt;ul&gt;
      {users.map(user =&gt; (
        &lt;li key={user.id}&gt;{user.name}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>

    <h3>The map() Function</h3>
    <p>Use <code>map()</code> to transform arrays into JSX elements:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// TypeScript knows item is a string!
const names: string[] = ["Alice", "Bob"];

const listItems = names.map(name =&gt; (
  &lt;li&gt;{name}&lt;/li&gt;  // name is typed as string
));</code></pre>

    <h3>The key Prop</h3>
    <p>React needs a unique <code>key</code> prop for each item in a list. Use IDs from your data:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface Product {
  id: number;
  name: string;
  price: number;
}

function ProductList({ products }: { products: Product[] }) {
  return (
    &lt;div&gt;
      {products.map(product =&gt; (
        &lt;div key={product.id}&gt;  {/* Use unique ID as key */}
          &lt;h3&gt;{product.name}&lt;/h3&gt;
          &lt;p&gt;$` + '${product.price}' + `&lt;/p&gt;
        &lt;/div&gt;
      ))}
    &lt;/div&gt;
  );
}</code></pre>

    <h3>Type Safety with map()</h3>
    <p>TypeScript infers the type of each item automatically:</p>

    <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>const products: Product[] = [/* your products */];

products.map(product =&gt; {
  product.name  // ✓ TypeScript knows this is a string
  product.price // ✓ TypeScript knows this is a number
  product.foo   // ❌ Error - Property 'foo' does not exist on type 'Product'
});</code></pre>

    <h3>Key Takeaways</h3>
    <ul>
      <li>Type arrays with <code>Type[]</code> syntax</li>
      <li>Create arrays of objects using interfaces: <code>User[]</code></li>
      <li>Pass arrays as props to components</li>
      <li>Use <code>map()</code> to render lists</li>
      <li>Always add a unique <code>key</code> prop to list items</li>
      <li>TypeScript automatically infers types inside <code>map()</code>!</li>
    </ul>

    <p><em>Next lesson: We'll add state to make our components interactive!</em></p>
      `;

      await tx.update(lessons)
        .set({
          title: "Lists, Arrays & Rendering Data",
          description: "Render lists of typed data in React",
          content: lesson13Content,
          xpReward: 25
        })
        .where(eq(lessons.id, "1-3"));
      console.log("✅ Updated");

      console.log("Adding 6 challenges for Lesson 1-3...");
      const lesson13Challenges = [
        // Challenge 1: MC
        {
          id: "1-3-1",
          lessonId: "1-3",
          title: "Typing Arrays",
          prompt: "How do you type an array of User objects in TypeScript?",
          type: "multiple-choice" as const,
          order: 1,
          xpReward: 10,
          choices: [
            "User[]",
            "Array<User>",
            "Both User[] and Array<User>",
            "[User]"
          ],
          correctAnswer: 2,
          explanation: "Both `User[]` and `Array<User>` are valid syntax for typing arrays in TypeScript. User[] is more common and concise."
        },
        // Challenge 2: Code
        {
          id: "1-3-2",
          lessonId: "1-3",
          title: "Create a Product Interface",
          prompt: `Create a \`Product\` interface for use in an array.

The interface should have:
- An \`id\` property of type \`number\`
- A \`name\` property of type \`string\`
- A \`price\` property of type \`number\`

Then declare a variable \`products\` as an array of \`Product\` (you can leave it as an empty array).

Example:
\`\`\`typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [];
\`\`\``,
          type: "code" as const,
          order: 2,
          xpReward: 10,
          starterCode: `// Create your Product interface and products array here\n`,
          solution: `interface Product {\n  id: number;\n  name: string;\n  price: number;\n}\n\nconst products: Product[] = [];`,
          testCode: `
const products: Product[] = [
  { id: 1, name: "Laptop", price: 999 }
];
if (!Array.isArray(products)) throw new Error('products should be an array');
return true;
          `
        },
        // Challenge 3: Code
        {
          id: "1-3-3",
          lessonId: "1-3",
          title: "Type a List Component",
          prompt: `Create a \`UserListProps\` interface and \`UserList\` component that renders a list.

First, define this User interface (already provided):
\`\`\`typescript
interface User {
  id: number;
  name: string;
}
\`\`\`

The \`UserListProps\` interface should have:
- A \`users\` property of type \`User[]\`

The \`UserList\` component should:
- Accept props typed with \`UserListProps\`
- Return a \`<ul>\` element
- Use \`map()\` to render each user as an \`<li>\` with \`key={user.id}\`

Example:
\`\`\`typescript
interface UserListProps {
  users: User[];
}

function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
\`\`\``,
          type: "code" as const,
          order: 3,
          xpReward: 10,
          starterCode: `interface User {\n  id: number;\n  name: string;\n}\n\n// Create your UserListProps interface and UserList component here\n`,
          solution: `interface User {\n  id: number;\n  name: string;\n}\n\ninterface UserListProps {\n  users: User[];\n}\n\nfunction UserList({ users }: UserListProps) {\n  return (\n    <ul>\n      {users.map(user => (\n        <li key={user.id}>{user.name}</li>\n      ))}\n    </ul>\n  );\n}`,
          testCode: `
const testUsers: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];
const list = UserList({ users: testUsers });
if (!list) throw new Error('Component should return JSX');
return true;
          `
        },
        // Challenge 4: MC
        {
          id: "1-3-4",
          lessonId: "1-3",
          title: "Understanding the key Prop",
          prompt: "Why does React require a unique 'key' prop for each item in a list?",
          type: "multiple-choice" as const,
          order: 4,
          xpReward: 10,
          choices: [
            "To make the code look professional",
            "To help React identify which items have changed, been added, or removed",
            "To prevent TypeScript errors",
            "Keys are optional and not required"
          ],
          correctAnswer: 1,
          explanation: "React uses keys to identify which items in a list have changed, been added, or removed. This helps React update the DOM efficiently. Always use unique, stable IDs (like database IDs) as keys!"
        },
        // Challenge 5: Code
        {
          id: "1-3-5",
          lessonId: "1-3",
          title: "Render a Product List",
          prompt: "Create a `ProductListProps` interface and `ProductList` component.\n\nThe Product interface is already defined:\n```typescript\ninterface Product {\n  id: number;\n  name: string;\n  price: number;\n}\n```\n\nThe `ProductListProps` interface should have:\n- A `products` property of type `Product[]`\n\nThe `ProductList` component should:\n- Accept props typed with `ProductListProps`\n- Return a `<div>` containing mapped products\n- Each product should render as a `<div>` with `key={product.id}`\n- Display the product name in an `<h3>` and price in a `<p>`\n\nExample:\n```typescript\ninterface ProductListProps {\n  products: Product[];\n}\n\nfunction ProductList({ products }: ProductListProps) {\n  return (\n    <div>\n      {products.map(product => (\n        <div key={product.id}>\n          <h3>{product.name}</h3>\n          <p>Price: $" + "{product.price}</p>\n        </div>\n      ))}\n    </div>\n  );\n}\n```",
          type: "code" as const,
          order: 5,
          xpReward: 10,
          starterCode: `interface Product {\n  id: number;\n  name: string;\n  price: number;\n}\n\n// Create your ProductListProps interface and ProductList component here\n`,
          solution: "interface Product {\n  id: number;\n  name: string;\n  price: number;\n}\n\ninterface ProductListProps {\n  products: Product[];\n}\n\nfunction ProductList({ products }: ProductListProps) {\n  return (\n    <div>\n      {products.map(product => (\n        <div key={product.id}>\n          <h3>{product.name}</h3>\n          <p>Price: $" + "{product.price}</p>\n        </div>\n      ))}\n    </div>\n  );\n}",
          testCode: `
const testProducts: Product[] = [
  { id: 1, name: "Laptop", price: 999 }
];
const list = ProductList({ products: testProducts });
if (!list) throw new Error('Component should return JSX');
return true;
          `
        },
        // Challenge 6: Code
        {
          id: "1-3-6",
          lessonId: "1-3",
          title: "Type Inference in map()",
          prompt: `Create a \`TodoListProps\` interface and \`TodoList\` component that demonstrates type inference.

The Todo interface is already defined:
\`\`\`typescript
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
\`\`\`

The \`TodoListProps\` interface should have:
- A \`todos\` property of type \`Todo[]\`

The \`TodoList\` component should:
- Accept props typed with \`TodoListProps\`
- Return a \`<ul>\`
- Map over todos and render each as an \`<li>\` with \`key={todo.id}\`
- Display the todo text and " (completed)" if \`todo.completed\` is true

Example:
\`\`\`typescript
interface TodoListProps {
  todos: Todo[];
}

function TodoList({ todos }: TodoListProps) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}{todo.completed && " (completed)"}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

TypeScript will automatically infer that \`todo\` inside map() is of type \`Todo\`!`,
          type: "code" as const,
          order: 6,
          xpReward: 10,
          starterCode: `interface Todo {\n  id: number;\n  text: string;\n  completed: boolean;\n}\n\n// Create your TodoListProps interface and TodoList component here\n`,
          solution: `interface Todo {\n  id: number;\n  text: string;\n  completed: boolean;\n}\n\ninterface TodoListProps {\n  todos: Todo[];\n}\n\nfunction TodoList({ todos }: TodoListProps) {\n  return (\n    <ul>\n      {todos.map(todo => (\n        <li key={todo.id}>\n          {todo.text}{todo.completed && " (completed)"}\n        </li>\n      ))}\n    </ul>\n  );\n}`,
          testCode: `
const testTodos: Todo[] = [
  { id: 1, text: "Learn TypeScript", completed: true }
];
const list = TodoList({ todos: testTodos });
if (!list) throw new Error('Component should return JSX');
return true;
          `
        }
      ];

      for (const challenge of lesson13Challenges) {
        await tx.insert(challenges).values(challenge);
      }
      console.log("✅ Added 6 challenges");

      console.log("\n✅ React lessons 1-2 and 1-3 updated!");
      console.log("⏳ Still need: Update 1-4, Create 1-5");
    });

    console.log("\n✅ Lessons 1-2 and 1-3 complete!");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

completeReactRestructure()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
