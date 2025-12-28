import "dotenv/config";

import { db } from "../server/db";
import { 
  levels, 
  lessons, 
  challenges, 
  badges,
  userBadges,
  userProgress,
  userStats,
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
      // Clear existing data in correct order (respecting foreign keys)
      console.log("Clearing existing data...");
      await tx.delete(userBadges);     // References badges and users
      await tx.delete(userProgress);   // References challenges, lessons, and users
      await tx.delete(userStats);      // References users (reset stats when curriculum changes)
      await tx.delete(challenges);     // References lessons
      await tx.delete(lessons);        // References levels
      await tx.delete(levels);         // No dependencies
      await tx.delete(badges);         // No dependencies
      console.log("✓ Existing data cleared");

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
          name: "React + TypeScript Fundamentals",
          description: "Build type-safe React applications with component typing, state management, and hooks",
          order: 3,
          xpRequired: 500
        },
        {
          id: "4",
          name: "Advanced React + TypeScript",
          description: "Master generic components, custom hooks, Context API, and advanced React patterns",
          order: 4,
          xpRequired: 800
        }
      ];

      await tx.insert(levels).values(levelsData);
      console.log("✓ Levels seeded");

      // Seed lessons
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

          <h3>Extending Interfaces</h3>
          <p>You can extend an existing interface to create a new interface that inherits all properties from the base interface:</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface BaseUser {
  id: number;
  name: string;
}

// AdminUser inherits id and name from BaseUser
interface AdminUser extends BaseUser {
  permissions: string[];
  role: string;
}

const admin: AdminUser = {
  id: 1,
  name: "Alice",
  permissions: ["read", "write", "delete"],
  role: "superadmin"
};</code></pre>

          <p>This is useful when you want to build specialized versions of a base type while keeping all the original properties.</p>

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
        },
        // LEVEL 2: Functions & Generics
        {
          id: "2-1",
          levelId: "2",
          title: "Typing Functions",
          description: "Master function parameters, return types, and optional parameters",
          content: `
          <p>Functions are the building blocks of any application. TypeScript allows you to specify the types of both the input parameters and the return value of functions.</p>
          
          <h3>Parameter Type Annotations</h3>
          <p>Add type annotations after each parameter:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function greet(name: string): void {
  console.log("Hello, " + name);
}

function add(a: number, b: number): number {
  return a + b;
}</code></pre>
          
          <h3>Optional Parameters</h3>
          <p>Use the <code>?</code> symbol to mark parameters as optional:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function buildName(firstName: string, lastName?: string): string {
  if (lastName) {
    return firstName + " " + lastName;
  }
  return firstName;
}

buildName("Alice");           // OK
buildName("Alice", "Smith");  // OK</code></pre>
          
          <h3>Default Parameters</h3>
          <p>Provide default values for parameters:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function pow(value: number, exponent: number = 2): number {
  return value ** exponent;
}

pow(10);      // 100 (uses default exponent of 2)
pow(10, 3);   // 1000</code></pre>
          
          <p class="mt-4"><strong>Why this matters for React:</strong> You'll use these patterns constantly when defining component props and event handlers.</p>
        `,
          order: 1,
          xpReward: 20
        },
        {
          id: "2-2",
          levelId: "2",
          title: "Function Types in Interfaces",
          description: "Define function signatures for callback props",
          content: `
          <h3>What Are Function Types?</h3>
          <p>A <strong>function type</strong> describes what a function should look like: what parameters it takes and what it returns. Think of it like a recipe that tells you what ingredients (parameters) you need and what dish (return value) you'll make.</p>

          <p><strong>Why do we need this?</strong> When you pass functions as props in React (like onClick handlers), TypeScript needs to know what that function should look like to catch errors before they happen.</p>

          <h3>Basic Function Type Syntax</h3>
          <p>The basic pattern is: <code>(parameters) => returnType</code></p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// Simple function type: takes no parameters, returns nothing
type SimpleClick = () => void;

// Function type: takes a number, returns a number
type DoubleNumber = (num: number) => number;

// Function type: takes two numbers, returns a number
type MathOperation = (a: number, b: number) => number;</code></pre>

          <p><strong>Breaking it down:</strong></p>
          <ul>
            <li><code>()</code> - parameters the function takes (empty means no parameters)</li>
            <li><code>=></code> - separates parameters from return type</li>
            <li><code>void</code> - means the function doesn't return anything</li>
          </ul>

          <h3>Using Function Types</h3>
          <p>Once you define a function type, you can use it to enforce that functions match that shape:</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>type MathOperation = (a: number, b: number) => number;

// These match the MathOperation type ✓
const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

// This would error - wrong return type ✗
// const broken: MathOperation = (a, b) => "wrong";</code></pre>

          <h3>Function Types in Interfaces</h3>
          <p>Now here's where it gets useful for React: you can put function types <strong>inside interfaces</strong> to describe component props that include functions.</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface ButtonProps {
  label: string;              // regular property
  onClick: () => void;        // function property (no params, no return)
  onHover?: (isHovered: boolean) => void;  // optional function
}

// Creating props that match the interface
function handleClick() {
  console.log("Button clicked!");
}

const myButton: ButtonProps = {
  label: "Submit",
  onClick: handleClick       // matches () => void
  // onHover is optional, so we can skip it
};</code></pre>

          <h3>Real-World React Example</h3>
          <p>Here's how you'd use this in an actual React component:</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface FormProps {
  onSubmit: (data: string) => void;
  onChange: (value: string) => void;
}

function MyForm({ onSubmit, onChange }: FormProps) {
  const [input, setInput] = useState("");

  return (
    &lt;form onSubmit={() => onSubmit(input)}&gt;
      &lt;input onChange={(e) => onChange(e.target.value)} /&gt;
    &lt;/form&gt;
  );
}</code></pre>

          <h3>Common Patterns You'll See</h3>
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface CommonHandlers {
  onClick: () => void;                    // Click, no data needed
  onClose: () => void;                    // Close/cancel, no data
  onSubmit: (data: FormData) => void;     // Submit with data
  onChange: (value: string) => void;      // Input changed
  onError: (error: string) => void;       // Error occurred
  onSuccess: () => Promise&lt;void&gt;;         // Async success handler
}</code></pre>

          <p class="mt-4"><strong>Key Takeaway:</strong> Function types in interfaces let you describe exactly what functions your component expects as props. This catches bugs early - if someone passes the wrong type of function, TypeScript will warn them immediately!</p>
        `,
          order: 2,
          xpReward: 20
        },
        {
          id: "2-3",
          levelId: "2",
          title: "Introduction to Generics",
          description: "Learn the foundational generic syntax and patterns",
          content: `
          <p>Generics provide a way to create reusable components that work over a variety of types rather than a single one, while preserving type information.</p>
          
          <h3>The Generic Syntax</h3>
          <p>Use angle brackets <code>&lt;T&gt;</code> to define a type parameter:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function identity&lt;T&gt;(arg: T): T {
  return arg;
}

// Type is inferred
let output = identity("hello");  // output: string

// Or specify explicitly
let num = identity&lt;number&gt;(42);  // num: number</code></pre>
          
          <h3>Generic Functions</h3>
          <p>Create flexible, reusable functions:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function firstElement&lt;Type&gt;(arr: Type[]): Type | undefined {
  return arr[0];
}

const s = firstElement(["a", "b", "c"]);  // s: string
const n = firstElement([1, 2, 3]);        // n: number</code></pre>
          
          <h3>Generic Constraints</h3>
          <p>Limit what types can be used with <code>extends</code>:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function longest&lt;Type extends { length: number }&gt;(
  a: Type,
  b: Type
): Type {
  if (a.length >= b.length) {
    return a;
  }
  return b;
}

longest("alice", "bob");      // Works: strings have .length
longest([1, 2], [1, 2, 3]);  // Works: arrays have .length</code></pre>
          
          <p class="mt-4"><strong>Coming up:</strong> You'll use generics extensively with React hooks like <code>useState&lt;T&gt;</code> and <code>useContext&lt;T&gt;</code>.</p>
        `,
          order: 3,
          xpReward: 20
        },
        {
          id: "2-4",
          levelId: "2",
          title: "Generics with Arrays & Promises",
          description: "Apply generics to arrays and async operations",
          content: `
          <p>Generics are particularly useful when working with arrays and async operations - both common in React applications.</p>
          
          <h3>Generic Arrays</h3>
          <p>Two equivalent syntaxes for typed arrays:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// Bracket syntax
let numbers: number[] = [1, 2, 3];

// Generic syntax
let strings: Array&lt;string&gt; = ["a", "b", "c"];

// Array of custom types
interface User {
  id: number;
  name: string;
}

let users: Array&lt;User&gt; = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];</code></pre>
          
          <h3>Promises with Generics</h3>
          <p>Type async operations with <code>Promise&lt;T&gt;</code>:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>async function fetchUser(id: number): Promise&lt;User&gt; {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

// TypeScript knows user is of type User
const user = await fetchUser(1);</code></pre>
          
          <h3>Multiple Type Parameters</h3>
          <p>Use multiple generics when needed:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function createPair&lt;S, T&gt;(v1: S, v2: T): [S, T] {
  return [v1, v2];
}

const pair = createPair("user", 123);  // ["user", 123]
// Type: [string, number]</code></pre>
          
          <p class="mt-4"><strong>React Application:</strong> You'll see <code>useState&lt;User[]&gt;([]) </code> and <code>Promise&lt;ApiResponse&gt;</code> everywhere in React apps.</p>
        `,
          order: 4,
          xpReward: 20
        },
        // LEVEL 3: React + TypeScript Fundamentals
        {
          id: "3-1",
          levelId: "3",
          title: "Typing React Components & Props",
          description: "Learn to type React function components and their props",
          content: `
          <p>TypeScript transforms React development by adding type safety to your components. Let's learn how to properly type React components and props.</p>
          
          <h3>Basic Component with Props</h3>
          <p>Define an interface for your component props:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    &lt;button onClick={onClick} disabled={disabled}&gt;
      {label}
    &lt;/button&gt;
  );
}</code></pre>
          
          <h3>Props with Children</h3>
          <p>React 18+ requires explicitly typing children:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>import { ReactNode } from 'react';

interface CardProps {
  title: string;
  children?: ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    &lt;div&gt;
      &lt;h2&gt;{title}&lt;/h2&gt;
      {children}
    &lt;/div&gt;
  );
}</code></pre>
          
          <h3>Common Prop Types</h3>
          <p>Essential types you'll use frequently:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface AppProps {
  // Primitives
  title: string;
  count: number;
  isActive: boolean;
  
  // Arrays
  items: string[];
  users: User[];
  
  // String literals (like enums)
  variant: "primary" | "secondary" | "danger";
  
  // Functions
  onClick: () => void;
  onChange: (value: string) => void;
  
  // React types
  children?: ReactNode;
  style?: React.CSSProperties;
}</code></pre>
          
          <p class="mt-4"><strong>Best Practice:</strong> Always define prop interfaces at the top of your component file for clarity.</p>
        `,
          order: 1,
          xpReward: 20
        },
        {
          id: "3-2",
          levelId: "3",
          title: "State Management with useState",
          description: "Type React state with the useState hook",
          content: `
          <p>The useState hook is the foundation of React state management. TypeScript makes state management safer and more predictable.</p>
          
          <h3>Type Inference with useState</h3>
          <p>TypeScript automatically infers simple types:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>import { useState } from 'react';

function Counter() {
  // Type inferred as boolean
  const [isOpen, setIsOpen] = useState(false);
  
  // Type inferred as string
  const [name, setName] = useState("Alice");
  
  // Type inferred as number
  const [count, setCount] = useState(0);
  
  return &lt;div&gt;{count}&lt;/div&gt;;
}</code></pre>
          
          <h3>Explicit Types with Generics</h3>
          <p>Use generics for complex types or nullable states:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile() {
  // Explicitly typed as User | null
  const [user, setUser] = useState&lt;User | null&gt;(null);
  
  // Array state
  const [items, setItems] = useState&lt;string[]&gt;([]);
  
  // Complex object state
  const [formData, setFormData] = useState&lt;User&gt;({
    id: 0,
    name: "",
    email: ""
  });
  
  return &lt;div&gt;{user?.name}&lt;/div&gt;;
}</code></pre>
          
          <h3>Updating State Safely</h3>
          <p>TypeScript ensures you update state correctly:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>const [user, setUser] = useState&lt;User | null&gt;(null);

// ✅ Correct
setUser({ id: 1, name: "Bob", email: "bob@example.com" });

// ❌ Error: Property 'email' is missing
setUser({ id: 1, name: "Bob" });

// ✅ Correct: Using functional update
setUser(prev =&gt; prev ? { ...prev, name: "Bob" } : null);</code></pre>
          
          <p class="mt-4"><strong>Key Takeaway:</strong> Use explicit generics when state can be null/undefined or involves complex types.</p>
        `,
          order: 2,
          xpReward: 20
        },
        {
          id: "3-3",
          levelId: "3",
          title: "Event Handlers & Forms",
          description: "Type event handlers and form interactions",
          content: `
          <p>React event handlers have specific types that provide autocomplete and type safety for all event properties.</p>
          
          <h3>Common Event Types</h3>
          <p>Use React's built-in event types:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>import { ChangeEvent, MouseEvent, FormEvent } from 'react';

function EventExamples() {
  const handleClick = (e: MouseEvent&lt;HTMLButtonElement&gt;) =&gt; {
    console.log(e.currentTarget.value);
  };
  
  const handleChange = (e: ChangeEvent&lt;HTMLInputElement&gt;) =&gt; {
    console.log(e.target.value);
  };
  
  const handleSubmit = (e: FormEvent&lt;HTMLFormElement&gt;) =&gt; {
    e.preventDefault();
    // Form logic
  };
  
  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input onChange={handleChange} /&gt;
      &lt;button onClick={handleClick}&gt;Submit&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
          
          <h3>Inline Event Handlers</h3>
          <p>TypeScript infers types for inline handlers:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function App() {
  return (
    &lt;&gt;
      {/* Type inferred automatically */}
      &lt;button onClick={(e) =&gt; console.log(e.currentTarget)}&gt;
        Click
      &lt;/button&gt;
      
      &lt;input onChange={(e) =&gt; console.log(e.target.value)} /&gt;
    &lt;/&gt;
  );
}</code></pre>
          
          <h3>Form State Management</h3>
          <p>Complete form example with TypeScript:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface FormData {
  email: string;
  password: string;
}

function LoginForm() {
  const [formData, setFormData] = useState&lt;FormData&gt;({
    email: "",
    password: ""
  });
  
  const handleChange = (e: ChangeEvent&lt;HTMLInputElement&gt;) =&gt; {
    const { name, value } = e.target;
    setFormData(prev =&gt; ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: FormEvent) =&gt; {
    e.preventDefault();
    console.log(formData);
  };
  
  return (
    &lt;form onSubmit={handleSubmit}&gt;
      &lt;input name="email" onChange={handleChange} /&gt;
      &lt;input name="password" type="password" onChange={handleChange} /&gt;
      &lt;button type="submit"&gt;Login&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
          
          <p class="mt-4"><strong>Pro Tip:</strong> React's event types give you full autocomplete access to all event properties.</p>
        `,
          order: 3,
          xpReward: 20
        },
        {
          id: "3-4",
          levelId: "3",
          title: "useEffect & Side Effects",
          description: "Type side effects and cleanup functions",
          content: `
          <p>The useEffect hook manages side effects in React. TypeScript ensures your effects and cleanup functions are correctly typed.</p>
          
          <h3>Basic useEffect Typing</h3>
          <p>TypeScript automatically validates effect functions:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>import { useEffect, useState } from 'react';

function DocumentTitle() {
  const [count, setCount] = useState(0);
  
  // No explicit types needed
  useEffect(() =&gt; {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return &lt;button onClick={() =&gt; setCount(count + 1)}&gt;{count}&lt;/button&gt;;
}</code></pre>
          
          <h3>Cleanup Functions</h3>
          <p>TypeScript ensures cleanup functions are properly typed:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() =&gt; {
    const handleResize = () =&gt; {
      setWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // ✅ Correct: return cleanup function
    return () =&gt; {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return &lt;div&gt;Width: {width}px&lt;/div&gt;;
}</code></pre>
          
          <h3>Async Effects with TypeScript</h3>
          <p>Handle async operations properly (effects can't be async):</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface User {
  id: number;
  name: string;
}

function UserData({ userId }: { userId: number }) {
  const [user, setUser] = useState&lt;User | null&gt;(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() =&gt; {
    // Create async function inside effect
    const fetchUser = async () =&gt; {
      setLoading(true);
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data: User = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);
  
  if (loading) return &lt;div&gt;Loading...&lt;/div&gt;;
  return &lt;div&gt;{user?.name}&lt;/div&gt;;
}</code></pre>
          
          <p class="mt-4"><strong>Important:</strong> TypeScript prevents common mistakes like returning non-cleanup values or making the effect function itself async.</p>
        `,
          order: 4,
          xpReward: 20
        },
        // LEVEL 4: Advanced React + TypeScript
        {
          id: "4-1",
          levelId: "4",
          title: "Generic React Components",
          description: "Create reusable components with generics",
          content: `
          <p>Generic components allow you to create highly reusable React components that work with any data type while maintaining full type safety.</p>
          
          <h3>Basic Generic Component</h3>
          <p>Create a component that works with any type:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface ListProps&lt;T&gt; {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List&lt;T&gt;({ items, renderItem }: ListProps&lt;T&gt;) {
  return (
    &lt;ul&gt;
      {items.map((item, index) =&gt; (
        &lt;li key={index}&gt;{renderItem(item)}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}

// Usage with different types
function App() {
  const numbers = [1, 2, 3];
  const users = [{ id: 1, name: "Alice" }];
  
  return (
    &lt;&gt;
      &lt;List items={numbers} renderItem={(n) =&gt; &lt;span&gt;{n}&lt;/span&gt;} /&gt;
      &lt;List items={users} renderItem={(u) =&gt; &lt;span&gt;{u.name}&lt;/span&gt;} /&gt;
    &lt;/&gt;
  );
}</code></pre>
          
          <h3>Generic Component with Constraints</h3>
          <p>Limit generics to specific shapes:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface TableProps&lt;T extends { id: number }&gt; {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
  }[];
}

function Table&lt;T extends { id: number }&gt;({ 
  data, 
  columns 
}: TableProps&lt;T&gt;) {
  return (
    &lt;table&gt;
      &lt;thead&gt;
        &lt;tr&gt;
          {columns.map(col =&gt; (
            &lt;th key={String(col.key)}&gt;{col.label}&lt;/th&gt;
          ))}
        &lt;/tr&gt;
      &lt;/thead&gt;
      &lt;tbody&gt;
        {data.map(item =&gt; (
          &lt;tr key={item.id}&gt;
            {columns.map(col =&gt; (
              &lt;td key={String(col.key)}&gt;
                {String(item[col.key])}
              &lt;/td&gt;
            ))}
          &lt;/tr&gt;
        ))}
      &lt;/tbody&gt;
    &lt;/table&gt;
  );
}</code></pre>
          
          <h3>Generic Form Component</h3>
          <p>Type-safe form handling:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface FormProps&lt;T&gt; {
  initialValues: T;
  onSubmit: (values: T) =&gt; void;
  children: (
    values: T,
    onChange: (key: keyof T, value: any) =&gt; void
  ) =&gt; React.ReactNode;
}

function Form&lt;T&gt;({ initialValues, onSubmit, children }: FormProps&lt;T&gt;) {
  const [values, setValues] = useState(initialValues);
  
  const handleChange = (key: keyof T, value: any) =&gt; {
    setValues(prev =&gt; ({ ...prev, [key]: value }));
  };
  
  return (
    &lt;form onSubmit={(e) =&gt; { e.preventDefault(); onSubmit(values); }}&gt;
      {children(values, handleChange)}
    &lt;/form&gt;
  );
}</code></pre>
          
          <p class="mt-4"><strong>Power of Generics:</strong> Write once, use with any type, maintain full type safety!</p>
        `,
          order: 1,
          xpReward: 20
        },
        {
          id: "4-2",
          levelId: "4",
          title: "Custom Hooks with TypeScript",
          description: "Build reusable custom hooks with proper typing",
          content: `
          <p>Custom hooks let you extract component logic into reusable functions. TypeScript ensures your custom hooks are type-safe and easy to use.</p>
          
          <h3>Basic Custom Hook</h3>
          <p>Create a simple toggle hook:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function useToggle(initialValue: boolean = false): [boolean, () =&gt; void] {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () =&gt; setValue(prev =&gt; !prev);
  
  return [value, toggle];
}

// Usage
function App() {
  const [isOpen, toggleOpen] = useToggle(false);
  
  return (
    &lt;div&gt;
      &lt;button onClick={toggleOpen}&gt;Toggle&lt;/button&gt;
      {isOpen && &lt;p&gt;Content&lt;/p&gt;}
    &lt;/div&gt;
  );
}</code></pre>
          
          <h3>Generic Custom Hook</h3>
          <p>Create hooks that work with any type:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function useLocalStorage&lt;T&gt;(
  key: string,
  initialValue: T
): [T, (value: T) =&gt; void] {
  const [storedValue, setStoredValue] = useState&lt;T&gt;(() =&gt; {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  const setValue = (value: T) =&gt; {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  
  return [storedValue, setValue];
}

// Usage with different types
const [name, setName] = useLocalStorage&lt;string&gt;("name", "");
const [count, setCount] = useLocalStorage&lt;number&gt;("count", 0);</code></pre>
          
          <h3>Data Fetching Hook</h3>
          <p>Type-safe async data fetching:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>interface UseFetchResult&lt;T&gt; {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch&lt;T&gt;(url: string): UseFetchResult&lt;T&gt; {
  const [data, setData] = useState&lt;T | null&gt;(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState&lt;string | null&gt;(null);
  
  useEffect(() =&gt; {
    const fetchData = async () =&gt; {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result: T = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}

// Usage
interface User {
  id: number;
  name: string;
}

function UserProfile() {
  const { data, loading, error } = useFetch&lt;User&gt;('/api/user');
  
  if (loading) return &lt;div&gt;Loading...&lt;/div&gt;;
  if (error) return &lt;div&gt;Error: {error}&lt;/div&gt;;
  return &lt;div&gt;{data?.name}&lt;/div&gt;;
}</code></pre>
          
          <p class="mt-4"><strong>Best Practice:</strong> Always export the return type of your custom hooks for better documentation.</p>
        `,
          order: 2,
          xpReward: 20
        },
        {
          id: "4-3",
          levelId: "4",
          title: "Context API with TypeScript",
          description: "Type-safe global state management with Context",
          content: `
          <p>React Context provides a way to pass data through the component tree without props. TypeScript makes Context completely type-safe.</p>
          
          <h3>Creating Typed Context</h3>
          <p>Define context with proper types:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) =&gt; void;
  logout: () =&gt; void;
}

const AuthContext = createContext&lt;AuthContextType | undefined&gt;(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState&lt;User | null&gt;(null);
  
  const login = (user: User) =&gt; setUser(user);
  const logout = () =&gt; setUser(null);
  
  return (
    &lt;AuthContext.Provider value={{ user, login, logout }}&gt;
      {children}
    &lt;/AuthContext.Provider&gt;
  );
}</code></pre>
          
          <h3>Custom Hook for Context</h3>
          <p>Create a safe hook to access context:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}

// Usage in components
function Profile() {
  const { user, logout } = useAuth();
  
  if (!user) return &lt;div&gt;Please log in&lt;/div&gt;;
  
  return (
    &lt;div&gt;
      &lt;h1&gt;{user.name}&lt;/h1&gt;
      &lt;button onClick={logout}&gt;Logout&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
          
          <h3>Theme Context Example</h3>
          <p>Complete theme provider with TypeScript:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () =&gt; void;
}

const ThemeContext = createContext&lt;ThemeContextType | undefined&gt;(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState&lt;Theme&gt;('light');
  
  const toggleTheme = () =&gt; {
    setTheme(prev =&gt; prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    &lt;ThemeContext.Provider value={{ theme, toggleTheme }}&gt;
      {children}
    &lt;/ThemeContext.Provider&gt;
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}</code></pre>
          
          <p class="mt-4"><strong>Key Pattern:</strong> Always create a custom hook that throws an error if context is used outside its provider.</p>
        `,
          order: 3,
          xpReward: 20
        },
        {
          id: "4-4",
          levelId: "4",
          title: "Advanced Patterns & Utility Types",
          description: "Master advanced React TypeScript patterns",
          content: `
          <p>Advanced TypeScript patterns help you write more flexible and maintainable React code. Let's explore essential utility types and patterns.</p>
          
          <h3>Component Props with Utility Types</h3>
          <p>Extend native HTML element props:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>import { ComponentProps } from 'react';

// Extend button props
type CustomButtonProps = ComponentProps&lt;'button'&gt; & {
  variant: 'primary' | 'secondary';
  isLoading?: boolean;
};

function CustomButton({ variant, isLoading, ...props }: CustomButtonProps) {
  return (
    &lt;button 
      {...props} 
      className={\`btn-\${variant}\`}
      disabled={isLoading || props.disabled}
    &gt;
      {isLoading ? 'Loading...' : props.children}
    &lt;/button&gt;
  );
}</code></pre>
          
          <h3>Discriminated Unions</h3>
          <p>Create type-safe state variants:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>type AsyncState&lt;T&gt; =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function DataDisplay() {
  const [state, setState] = useState&lt;AsyncState&lt;User&gt;&gt;({ 
    status: 'idle' 
  });
  
  // TypeScript knows what properties exist based on status
  if (state.status === 'loading') {
    return &lt;div&gt;Loading...&lt;/div&gt;;
  }
  
  if (state.status === 'error') {
    return &lt;div&gt;Error: {state.error}&lt;/div&gt;;
  }
  
  if (state.status === 'success') {
    return &lt;div&gt;{state.data.name}&lt;/div&gt;;
  }
  
  return &lt;button onClick={fetchData}&gt;Load&lt;/button&gt;;
}</code></pre>
          
          <h3>Polymorphic Components</h3>
          <p>Components that can render as different elements:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>type TextProps&lt;C extends React.ElementType&gt; = {
  as?: C;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef&lt;C&gt;;

function Text&lt;C extends React.ElementType = 'span'&gt;({
  as,
  children,
  ...props
}: TextProps&lt;C&gt;) {
  const Component = as || 'span';
  return &lt;Component {...props}&gt;{children}&lt;/Component&gt;;
}

// Usage - works as any element
function App() {
  return (
    &lt;&gt;
      &lt;Text&gt;Default span&lt;/Text&gt;
      &lt;Text as="h1"&gt;Heading&lt;/Text&gt;
      &lt;Text as="a" href="/about"&gt;Link&lt;/Text&gt;
    &lt;/&gt;
  );
}</code></pre>
          
          <h3>Useful Utility Types</h3>
          <p>TypeScript utilities for React:</p>
          
          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// Extract component prop types
type ButtonProps = ComponentProps&lt;typeof CustomButton&gt;;

// Make all properties optional
type PartialUser = Partial&lt;User&gt;;

// Make all properties required
type RequiredUser = Required&lt;User&gt;;

// Pick specific properties
type UserPreview = Pick&lt;User, 'id' | 'name'&gt;;

// Omit specific properties
type UserWithoutEmail = Omit&lt;User, 'email'&gt;;

// Get return type of function
type FetchResult = ReturnType&lt;typeof fetchUser&gt;;</code></pre>
          
          <p class="mt-4"><strong>Master These:</strong> These patterns solve 90% of advanced React TypeScript scenarios you'll encounter.</p>
        `,
          order: 4,
          xpReward: 20
        }
      ];

      await tx.insert(lessons).values(lessonsData);
      console.log("✓ Lessons seeded");

      // Seed challenges
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
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "TypeScript for JavaScript Programmers", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html" }),
            JSON.stringify({ title: "TypeScript Basics", url: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html" })
          ]
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
          validationPatterns: [
            "username: string",
            "age: number",
            "isPremium: boolean"
          ],
          hint: "Use the colon syntax to add types: let name: type = value",
          sampleSolution: `let username: string = "Alex";
let age: number = 25;
let isPremium: boolean = true;`,
          documentationLinks: [
            JSON.stringify({ title: "Everyday Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" }),
            JSON.stringify({ title: "Type Annotations", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-annotations-on-variables" })
          ]
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
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "Object Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html" }),
            JSON.stringify({ title: "Type Aliases", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases" }),
            JSON.stringify({ title: "Interfaces", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces" })
          ]
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
          validationPatterns: [
            "interface Product",
            "id: number",
            "name: string",
            "price: number"
          ],
          hint: "Use the interface keyword followed by the name and curly braces with property definitions",
          sampleSolution: `interface Product {
  id: number;
  name: string;
  price: number;
}`,
          documentationLinks: [
            JSON.stringify({ title: "Object Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html" }),
            JSON.stringify({ title: "Type Aliases", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases" }),
            JSON.stringify({ title: "Interfaces", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces" })
          ]
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
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "Union Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types" }),
            JSON.stringify({ title: "Intersection Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types" }),
            JSON.stringify({ title: "Literal Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types" })
          ]
        },
        {
          id: "1-3-2",
          lessonId: "1-3",
          type: "code",
          prompt: "Create a type alias called 'ID' that can be either a string or a number",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your ID type here\n`,
          validationPatterns: [
            "type ID =",
            "string | number"
          ],
          hint: "Use the type keyword and the | symbol for union types",
          sampleSolution: `type ID = string | number;`,
          documentationLinks: [
            JSON.stringify({ title: "Union Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types" }),
            JSON.stringify({ title: "Intersection Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types" }),
            JSON.stringify({ title: "Literal Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types" })
          ]
        },
        {
          id: "1-3-3",
          lessonId: "1-3",
          type: "code",
          prompt: "Create an intersection type 'Employee' that combines Person {name: string} and Worker {id: number}",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `interface Person {\n  name: string;\n}\n\ninterface Worker {\n  id: number;\n}\n\n// Create Employee type here\n`,
          validationPatterns: [
            "type Employee =",
            "Person & Worker"
          ],
          hint: "Use the & symbol to combine types",
          sampleSolution: `interface Person {
  name: string;
}

interface Worker {
  id: number;
}

type Employee = Person & Worker;`,
          documentationLinks: [
            JSON.stringify({ title: "Union Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types" }),
            JSON.stringify({ title: "Intersection Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types" }),
            JSON.stringify({ title: "Literal Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types" })
          ]
        },
        // LEVEL 2: Functions & Generics Challenges
        {
          id: "2-1-1",
          lessonId: "2-1",
          type: "multiple-choice",
          prompt: "What symbol is used to mark a parameter as optional in TypeScript?",
          order: 1,
          xpReward: 30,
          options: [
            "!",
            "?",
            "*",
            "&"
          ],
          correctAnswer: 1,
          explanation: "The ? symbol after a parameter name marks it as optional, allowing it to be undefined.",
          starterCode: null,
          validationPatterns: [],
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "Functions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html" }),
            JSON.stringify({ title: "Optional Parameters", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters" }),
            JSON.stringify({ title: "Function Type Expressions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions" })
          ]
        },
        {
          id: "2-1-2",
          lessonId: "2-1",
          type: "code",
          prompt: "Add type annotations to this function: function multiply(a, b) { return a * b; }",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `function multiply(a, b) {\n  return a * b;\n}`,
          validationPatterns: [
            "function multiply",
            "a: number",
            "b: number",
            "): number"
          ],
          hint: "Both parameters should be numbers and the return type is also a number",
          documentationLinks: [
            JSON.stringify({ title: "Functions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html" }),
            JSON.stringify({ title: "Optional Parameters", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters" }),
            JSON.stringify({ title: "Function Type Expressions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions" })
          ]
        },
        {
          id: "2-1-3",
          lessonId: "2-1",
          type: "code",
          prompt: "Create a function 'greetUser' that takes a required 'name' (string) and optional 'greeting' (string with default 'Hello')",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your greetUser function here\n`,
          validationPatterns: [
            "function greetUser",
            "name: string",
            "greeting: string = \"Hello\""
          ],
          hint: "Use ?: for optional parameters or = for default values",
          documentationLinks: [
            JSON.stringify({ title: "Functions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html" }),
            JSON.stringify({ title: "Optional Parameters", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters" }),
            JSON.stringify({ title: "Function Type Expressions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions" })
          ]
        },
        {
          id: "2-2-1",
          lessonId: "2-2",
          type: "multiple-choice",
          prompt: "In a function type signature, what does () => void mean?",
          order: 1,
          xpReward: 30,
          options: [
            "A function that returns nothing",
            "A function that takes void as a parameter",
            "An optional function",
            "An async function"
          ],
          correctAnswer: 0,
          explanation: "() => void describes a function that takes no parameters and returns nothing (void).",
          starterCode: null,
          validationPatterns: [],
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "Call Signatures", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures" }),
            JSON.stringify({ title: "Function Type Expressions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions" }),
            JSON.stringify({ title: "Object Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html" })
          ]
        },
        {
          id: "2-2-2",
          lessonId: "2-2",
          type: "code",
          prompt: "Create an interface 'ButtonProps' with a string 'label' and a function 'onClick' that takes no params and returns void",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your ButtonProps interface here\n`,
          validationPatterns: [
            "interface ButtonProps",
            "label: string",
            "onClick: () => void"
          ],
          hint: "Use the arrow function syntax for the onClick type: () => void",
          documentationLinks: [
            JSON.stringify({ title: "Call Signatures", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures" }),
            JSON.stringify({ title: "Function Type Expressions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions" }),
            JSON.stringify({ title: "Object Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html" })
          ]
        },
        {
          id: "2-2-3",
          lessonId: "2-2",
          type: "code",
          prompt: "Create a type alias 'ChangeHandler' for a function that takes a string parameter 'value' and returns void",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your ChangeHandler type here\n`,
          validationPatterns: [
            "type ChangeHandler =",
            "(value: string) => void"
          ],
          hint: "Type alias syntax: type Name = (param: type) => returnType",
          documentationLinks: [
            JSON.stringify({ title: "Call Signatures", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures" }),
            JSON.stringify({ title: "Function Type Expressions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions" }),
            JSON.stringify({ title: "Object Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html" })
          ]
        },
        {
          id: "2-3-1",
          lessonId: "2-3",
          type: "multiple-choice",
          prompt: "What does the <T> syntax represent in TypeScript?",
          order: 1,
          xpReward: 30,
          options: [
            "A template literal",
            "A type parameter (generic)",
            "An HTML element",
            "A type assertion"
          ],
          correctAnswer: 1,
          explanation: "The <T> syntax defines a type parameter, allowing you to create generic functions and types that work with any type.",
          starterCode: null,
          validationPatterns: [],
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Generic Constraints", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints" }),
            JSON.stringify({ title: "Generic Types", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables" })
          ]
        },
        {
          id: "2-3-2",
          lessonId: "2-3",
          type: "code",
          prompt: "Create a generic function 'getLastItem' that takes an array of type T and returns T | undefined",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your getLastItem function here\n`,
          validationPatterns: [
            "function getLastItem",
            "<T>",
            "(items: T[])",
            ": T | undefined"
          ],
          hint: "Use <T> after the function name and T[] for the array parameter",
          documentationLinks: [
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Generic Constraints", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints" }),
            JSON.stringify({ title: "Generic Types", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables" })
          ]
        },
        {
          id: "2-3-3",
          lessonId: "2-3",
          type: "code",
          prompt: "Create a generic function 'getLength' constrained to types with a length property (use extends { length: number })",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your getLength function here\n`,
          validationPatterns: [
            "function getLength",
            "<T extends { length: number }>",
            ": number"
          ],
          hint: "Use <T extends { length: number }> to constrain the generic type",
          documentationLinks: [
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Generic Constraints", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints" }),
            JSON.stringify({ title: "Generic Types", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables" })
          ]
        },
        {
          id: "2-4-1",
          lessonId: "2-4",
          type: "multiple-choice",
          prompt: "Which syntax is correct for typing an array of strings?",
          order: 1,
          xpReward: 30,
          options: [
            "Both string[] and Array<string> are correct",
            "Only string[] is correct",
            "Only Array<string> is correct",
            "Neither is correct"
          ],
          correctAnswer: 0,
          explanation: "Both string[] and Array<string> are valid and equivalent syntaxes for typing arrays in TypeScript.",
          starterCode: null,
          validationPatterns: [],
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Array Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays" }),
            JSON.stringify({ title: "Async Functions", url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait-support-in-es6-targets-node-v4" })
          ]
        },
        {
          id: "2-4-2",
          lessonId: "2-4",
          type: "code",
          prompt: "Create an async function 'fetchUserData' that returns a Promise<User> where User is { id: number, name: string }",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `interface User {\n  id: number;\n  name: string;\n}\n\n// Define your fetchUserData function here\n`,
          validationPatterns: [
            "async function fetchUserData",
            ": Promise<User>",
            "return"
          ],
          hint: "Async functions automatically return Promises - specify the type with Promise<User>",
          documentationLinks: [
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Array Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays" }),
            JSON.stringify({ title: "Async Functions", url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait-support-in-es6-targets-node-v4" })
          ]
        },
        {
          id: "2-4-3",
          lessonId: "2-4",
          type: "code",
          prompt: "Create a variable 'users' typed as an array of User objects where User has id (number) and email (string)",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `interface User {\n  id: number;\n  email: string;\n}\n\n// Define your users variable here\n`,
          validationPatterns: [
            "const users||let users",
            "users: User[]||users: Array<User>"
          ],
          hint: "Use either User[] or Array<User> syntax",
          documentationLinks: [
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Array Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays" }),
            JSON.stringify({ title: "Async Functions", url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait-support-in-es6-targets-node-v4" })
          ]
        },
        // LEVEL 3: React + TypeScript Fundamentals Challenges
        {
          id: "3-1-1",
          lessonId: "3-1",
          type: "multiple-choice",
          prompt: "In React 18+, how do you type a component's children prop?",
          order: 1,
          xpReward: 30,
          options: [
            "Children are automatically typed",
            "Use children?: ReactNode",
            "Use children: string",
            "Use children?: any"
          ],
          correctAnswer: 1,
          explanation: "React 18+ requires explicitly typing children. Use children?: ReactNode from React to accept any valid React child.",
          starterCode: null,
          validationPatterns: [],
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" }),
            JSON.stringify({ title: "Typing Component Props", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example" }),
            JSON.stringify({ title: "React with TypeScript", url: "https://www.typescriptlang.org/docs/handbook/react.html" })
          ]
        },
        {
          id: "3-1-2",
          lessonId: "3-1",
          type: "code",
          prompt: "Create an interface 'CardProps' with title (string), description (optional string), and children (optional ReactNode)",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { ReactNode } from 'react';\n\n// Define your CardProps interface here\n`,
          validationPatterns: [
            "interface CardProps",
            "title: string",
            "description?: string",
            "children?: ReactNode"
          ],
          hint: "Use ? for optional properties and import ReactNode from 'react'",
          documentationLinks: [
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" }),
            JSON.stringify({ title: "Typing Component Props", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example" }),
            JSON.stringify({ title: "React with TypeScript", url: "https://www.typescriptlang.org/docs/handbook/react.html" })
          ]
        },
        {
          id: "3-1-3",
          lessonId: "3-1",
          type: "code",
          prompt: "Create an interface 'AlertProps' with a variant property that can only be 'success', 'error', or 'warning'",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your AlertProps interface here\n`,
          validationPatterns: [
            "interface AlertProps",
            "variant: \"success\" | \"error\" | \"warning\"||variant: 'success' | 'error' | 'warning'"
          ],
          hint: "Use string literal types with | for the variant: 'success' | 'error' | 'warning'",
          documentationLinks: [
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" }),
            JSON.stringify({ title: "Typing Component Props", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example" }),
            JSON.stringify({ title: "React with TypeScript", url: "https://www.typescriptlang.org/docs/handbook/react.html" })
          ]
        },
        {
          id: "3-2-1",
          lessonId: "3-2",
          type: "multiple-choice",
          prompt: "When should you use explicit generic types with useState?",
          order: 1,
          xpReward: 30,
          options: [
            "Always",
            "Never - TypeScript always infers correctly",
            "When the initial state is null or the type is complex",
            "Only for arrays"
          ],
          correctAnswer: 2,
          explanation: "Use explicit generics with useState when the initial value is null/undefined or when working with complex types that can't be easily inferred.",
          starterCode: null,
          validationPatterns: [],
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "useState Hook", url: "https://react.dev/reference/react/useState" }),
            JSON.stringify({ title: "Hooks with TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-2-2",
          lessonId: "3-2",
          type: "code",
          prompt: "Create a state variable 'user' using useState that can be User (with id, name) or null, initialized to null",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useState } from 'react';\n\ninterface User {\n  id: number;\n  name: string;\n}\n\nfunction UserProfile() {\n  // Define your user state here\n  \n  return <div>{user?.name}</div>;\n}`,
          validationPatterns: [
            "const [user",
            "useState<User | null>(null)"
          ],
          hint: "Use useState<User | null>(null) for nullable state",
          documentationLinks: [
            JSON.stringify({ title: "useState Hook", url: "https://react.dev/reference/react/useState" }),
            JSON.stringify({ title: "Hooks with TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-2-3",
          lessonId: "3-2",
          type: "code",
          prompt: "Create a state variable 'items' for an array of strings, initialized as an empty array",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useState } from 'react';\n\nfunction ItemList() {\n  // Define your items state here\n  \n  return <div>{items.length}</div>;\n}`,
          validationPatterns: [
            "const [items",
            "useState<string[]>([])"
          ],
          hint: "Use useState<string[]>([]) or let TypeScript infer from the empty array",
          documentationLinks: [
            JSON.stringify({ title: "useState Hook", url: "https://react.dev/reference/react/useState" }),
            JSON.stringify({ title: "Hooks with TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-3-1",
          lessonId: "3-3",
          type: "multiple-choice",
          prompt: "What is the correct type for an onChange handler on an input element?",
          order: 1,
          xpReward: 30,
          options: [
            "React.ChangeEvent<HTMLInputElement>",
            "ChangeEvent<Input>",
            "Event<HTMLInputElement>",
            "InputChangeEvent"
          ],
          correctAnswer: 0,
          explanation: "React.ChangeEvent<HTMLInputElement> is the correct type for input change events, providing access to e.target.value.",
          starterCode: null,
          validationPatterns: [],
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "Responding to Events", url: "https://react.dev/learn/responding-to-events" }),
            JSON.stringify({ title: "Event Types in TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-3-2",
          lessonId: "3-3",
          type: "code",
          prompt: "Create a handleClick function with the correct event type for a button click",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { MouseEvent } from 'react';\n\n// Define your handleClick function here\n`,
          validationPatterns: [
            "handleClick",
            "MouseEvent<HTMLButtonElement>"
          ],
          hint: "Use MouseEvent<HTMLButtonElement> for button click events",
          documentationLinks: [
            JSON.stringify({ title: "Responding to Events", url: "https://react.dev/learn/responding-to-events" }),
            JSON.stringify({ title: "Event Types in TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-3-3",
          lessonId: "3-3",
          type: "code",
          prompt: "Create a handleSubmit function for a form with the correct event type that prevents default behavior",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { FormEvent } from 'react';\n\n// Define your handleSubmit function here\n`,
          validationPatterns: [
            "handleSubmit",
            "FormEvent<HTMLFormElement>",
            "preventDefault"
          ],
          hint: "Use FormEvent and call e.preventDefault() to prevent form submission",
          documentationLinks: [
            JSON.stringify({ title: "Responding to Events", url: "https://react.dev/learn/responding-to-events" }),
            JSON.stringify({ title: "Event Types in TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-4-1",
          lessonId: "3-4",
          type: "multiple-choice",
          prompt: "Can a useEffect callback function be async?",
          order: 1,
          xpReward: 30,
          options: [
            "Yes, always use async directly",
            "No, but you can create an async function inside",
            "Yes, but only in React 18+",
            "No, effects cannot be async at all"
          ],
          correctAnswer: 1,
          explanation: "useEffect callbacks cannot be async directly, but you can create an async function inside the effect and call it.",
          starterCode: null,
          validationPatterns: [],
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "useEffect Hook", url: "https://react.dev/reference/react/useEffect" }),
            JSON.stringify({ title: "useEffect with TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-4-2",
          lessonId: "3-4",
          type: "code",
          prompt: "Add a useEffect that logs the count value whenever it changes. Include count in the dependency array",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useState, useEffect } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  // Add your useEffect here\n  \n  return <div>{count}</div>;\n}`,
          validationPatterns: [
            "useEffect",
            "console.log(count)",
            "[count]"
          ],
          hint: "useEffect(() => { console.log(count); }, [count])",
          documentationLinks: [
            JSON.stringify({ title: "useEffect Hook", url: "https://react.dev/reference/react/useEffect" }),
            JSON.stringify({ title: "useEffect with TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-4-3",
          lessonId: "3-4",
          type: "code",
          prompt: "Create a useEffect that adds a window resize listener and returns a cleanup function to remove it",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useEffect } from 'react';\n\nfunction WindowSize() {\n  // Add your useEffect here\n  \n  return <div>Resize the window</div>;\n}`,
          validationPatterns: [
            "useEffect",
            "addEventListener(\"resize\")||addEventListener('resize')",
            "removeEventListener",
            "return () =>"
          ],
          hint: "Return a cleanup function that removes the event listener",
          documentationLinks: [
            JSON.stringify({ title: "useEffect Hook", url: "https://react.dev/reference/react/useEffect" }),
            JSON.stringify({ title: "useEffect with TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        // LEVEL 4: Advanced React + TypeScript Challenges
        {
          id: "4-1-1",
          lessonId: "4-1",
          type: "multiple-choice",
          prompt: "What is the purpose of generic components in React?",
          order: 1,
          xpReward: 30,
          options: [
            "To make components load faster",
            "To create reusable components that work with any data type",
            "To style components generically",
            "To make components compatible with older browsers"
          ],
          correctAnswer: 1,
          explanation: "Generic components allow you to create highly reusable components that maintain type safety while working with any data type.",
          starterCode: null,
          validationPatterns: [],
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "Generic Components", url: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#generic-components" }),
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Advanced Patterns", url: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase" })
          ]
        },
        {
          id: "4-1-2",
          lessonId: "4-1",
          type: "code",
          prompt: "Create a generic ListProps interface with items: T[] and renderItem: (item: T) => ReactNode",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { ReactNode } from 'react';\n\n// Define your ListProps interface here\n`,
          validationPatterns: [
            "interface ListProps<T>",
            "items: T[]",
            "renderItem: (item: T) => ReactNode"
          ],
          hint: "Add <T> after the interface name to make it generic",
          documentationLinks: [
            JSON.stringify({ title: "Generic Components", url: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#generic-components" }),
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Advanced Patterns", url: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase" })
          ]
        },
        {
          id: "4-1-3",
          lessonId: "4-1",
          type: "code",
          prompt: "Create a generic interface TableProps where T must have an id property (use extends { id: number })",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your TableProps interface here\n`,
          validationPatterns: [
            "interface TableProps<T extends { id: number }>",
            "data: T[]"
          ],
          hint: "Use <T extends { id: number }> to constrain the generic type",
          documentationLinks: [
            JSON.stringify({ title: "Generic Components", url: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#generic-components" }),
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Advanced Patterns", url: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase" })
          ]
        },
        {
          id: "4-2-1",
          lessonId: "4-2",
          type: "multiple-choice",
          prompt: "What should a custom hook return?",
          order: 1,
          xpReward: 30,
          options: [
            "Always an array",
            "Always an object",
            "Any value - array, object, primitive, etc.",
            "Only React components"
          ],
          correctAnswer: 2,
          explanation: "Custom hooks can return any value - arrays, objects, primitives, or nothing at all, depending on your needs.",
          starterCode: null,
          validationPatterns: [],
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" }),
            JSON.stringify({ title: "Typing Custom Hooks", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#custom-hooks" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "4-2-2",
          lessonId: "4-2",
          type: "code",
          prompt: "Create a custom hook useCounter that returns [count: number, increment: () => void, decrement: () => void]",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useState } from 'react';\n\n// Define your useCounter hook here\n`,
          validationPatterns: [
            "function useCounter",
            "const [count, setCount] = useState(0)",
            "return [count",
            "increment",
            "decrement"
          ],
          hint: "Use useState(0) and create increment/decrement functions",
          documentationLinks: [
            JSON.stringify({ title: "Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" }),
            JSON.stringify({ title: "Typing Custom Hooks", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#custom-hooks" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "4-2-3",
          lessonId: "4-2",
          type: "code",
          prompt: "Create a generic custom hook useArray<T> that returns [items: T[], addItem: (item: T) => void]",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useState } from 'react';\n\n// Define your useArray hook here\n`,
          validationPatterns: [
            "function useArray",
            "<T>",
            "useState<T[]>([])",
            "addItem",
            "(item: T)",
            "return [items"
          ],
          hint: "Make the function generic with <T> and use T[] for the state type",
          documentationLinks: [
            JSON.stringify({ title: "Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" }),
            JSON.stringify({ title: "Typing Custom Hooks", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#custom-hooks" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "4-3-1",
          lessonId: "4-3",
          type: "multiple-choice",
          prompt: "Why should you create a custom hook to access Context instead of using useContext directly?",
          order: 1,
          xpReward: 30,
          options: [
            "It's faster",
            "To throw an error if used outside the Provider",
            "It's required by React",
            "To make the code shorter"
          ],
          correctAnswer: 1,
          explanation: "A custom hook can check if the context is undefined and throw a helpful error if the hook is used outside its Provider.",
          starterCode: null,
          validationPatterns: [],
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "Context with TypeScript", url: "https://react.dev/learn/typescript#typing-usecontext" }),
            JSON.stringify({ title: "Context API", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context" }),
            JSON.stringify({ title: "useContext Hook", url: "https://react.dev/reference/react/useContext" })
          ]
        },
        {
          id: "4-3-2",
          lessonId: "4-3",
          type: "code",
          prompt: "Create a ThemeContext with createContext<ThemeContextType | undefined>(undefined)",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { createContext } from 'react';\n\ninterface ThemeContextType {\n  theme: string;\n  setTheme: (theme: string) => void;\n}\n\n// Create your context here\n`,
          validationPatterns: [
            "createContext<ThemeContextType | undefined>(undefined)"
          ],
          hint: "Use createContext with a union type and initialize with undefined",
          documentationLinks: [
            JSON.stringify({ title: "Context with TypeScript", url: "https://react.dev/learn/typescript#typing-usecontext" }),
            JSON.stringify({ title: "Context API", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context" }),
            JSON.stringify({ title: "useContext Hook", url: "https://react.dev/reference/react/useContext" })
          ]
        },
        {
          id: "4-3-3",
          lessonId: "4-3",
          type: "code",
          prompt: "Create a custom hook useTheme that throws an error if context is undefined",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useContext } from 'react';\n\n// Assume ThemeContext is already defined\n// Create your useTheme hook here\n`,
          validationPatterns: [
            "function useTheme",
            "useContext(ThemeContext)",
            "const context = useContext||const themeContext = useContext||const theme = useContext",
            "if (!context)||if (!themeContext)||if (!theme",
            "throw new Error"
          ],
          hint: "Check if context === undefined and throw new Error with a helpful message",
          documentationLinks: [
            JSON.stringify({ title: "Context with TypeScript", url: "https://react.dev/learn/typescript#typing-usecontext" }),
            JSON.stringify({ title: "Context API", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context" }),
            JSON.stringify({ title: "useContext Hook", url: "https://react.dev/reference/react/useContext" })
          ]
        },
        {
          id: "4-4-1",
          lessonId: "4-4",
          type: "multiple-choice",
          prompt: "What does the Partial<T> utility type do?",
          order: 1,
          xpReward: 30,
          options: [
            "Makes all properties required",
            "Makes all properties optional",
            "Removes all properties",
            "Picks specific properties"
          ],
          correctAnswer: 1,
          explanation: "Partial<T> creates a new type with all properties of T made optional, useful for partial updates.",
          starterCode: null,
          validationPatterns: [],
          hint: null,
          documentationLinks: [
            JSON.stringify({ title: "Utility Types", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html" }),
            JSON.stringify({ title: "Partial", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype" }),
            JSON.stringify({ title: "Pick", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys" }),
            JSON.stringify({ title: "Omit", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" })
          ]
        },
        {
          id: "4-4-2",
          lessonId: "4-4",
          type: "code",
          prompt: "Create a type UserPreview that picks only 'id' and 'name' from the User interface using Pick",
          order: 2,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `interface User {\n  id: number;\n  name: string;\n  email: string;\n  age: number;\n}\n\n// Create your UserPreview type here\n`,
          validationPatterns: [
            "type UserPreview =",
            "Pick<User",
            "'id' | 'name'||\"id\" | \"name\""
          ],
          hint: "Use Pick<User, 'id' | 'name'> to select specific properties",
          documentationLinks: [
            JSON.stringify({ title: "Utility Types", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html" }),
            JSON.stringify({ title: "Partial", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype" }),
            JSON.stringify({ title: "Pick", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys" }),
            JSON.stringify({ title: "Omit", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" })
          ]
        },
        {
          id: "4-4-3",
          lessonId: "4-4",
          type: "code",
          prompt: "Create a type UserWithoutEmail that omits 'email' from User using Omit",
          order: 3,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\n// Create your UserWithoutEmail type here\n`,
          validationPatterns: [
            "type UserWithoutEmail =",
            "Omit<User",
            "'email'||\"email\""
          ],
          hint: "Use Omit<User, 'email'> to exclude specific properties",
          documentationLinks: [
            JSON.stringify({ title: "Utility Types", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html" }),
            JSON.stringify({ title: "Partial", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype" }),
            JSON.stringify({ title: "Pick", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys" }),
            JSON.stringify({ title: "Omit", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" })
          ]
        },

        // ================= EXTRA CHALLENGES PER LESSON =================

        // Level 1 – Introduction to Types (1-1)
        {
          id: "1-1-3",
          lessonId: "1-1",
          type: "multiple-choice",
          prompt: "Which line correctly declares a boolean variable in TypeScript?",
          order: 3,
          xpReward: 30,
          options: [
            "let isActive = boolean;",
            "let isActive: boolean = true;",
            "boolean isActive = true;",
            "let isActive: Boolean = true;"
          ],
          correctAnswer: 1,
          explanation: "The correct syntax is `let isActive: boolean = true;` using the primitive `boolean` type and colon syntax.",
          starterCode: null,
          validationPatterns: [],
          hint: "Remember the pattern: let name: type = value;",
          documentationLinks: [
            JSON.stringify({ title: "Everyday Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" }),
            JSON.stringify({ title: "Basic Types", url: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html" }),
            JSON.stringify({ title: "Type Annotations", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-annotations-on-variables" })
          ]
        },
        {
          id: "1-1-4",
          lessonId: "1-1",
          type: "code",
          prompt: "Add proper type annotations so this function only accepts a number and returns a string.",
          order: 4,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `function formatScore(score) {\n  return "Score: " + score;\n}\n\nconst result = formatScore(42);`,
          validationPatterns: [
            "function formatScore",
            "score: number",
            "): string",
            "const result = formatScore"
          ],
          hint: "Annotate the parameter and return type: function formatScore(score: number): string { ... }",
          sampleSolution: `function formatScore(score: number): string {
  return "Score: " + score;
}

const result = formatScore(42);`,
          documentationLinks: [
            JSON.stringify({ title: "Everyday Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" }),
            JSON.stringify({ title: "Basic Types", url: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html" }),
            JSON.stringify({ title: "Type Annotations", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-annotations-on-variables" })
          ]
        },
        {
          id: "1-1-5",
          lessonId: "1-1",
          type: "code",
          prompt: "Declare a typed array of numbers called 'scores' with values 10, 20, 30.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Declare your scores array here\n`,
          validationPatterns: [
            "scores: number[]||scores: Array<number>",
            "[10, 20, 30]||[10,20,30]"
          ],
          hint: "Declare a constant with type annotation: const scores: number[] = [10, 20, 30];",
          sampleSolution: `const scores: number[] = [10, 20, 30];`,
          documentationLinks: [
            JSON.stringify({ title: "Everyday Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" }),
            JSON.stringify({ title: "Basic Types", url: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html" }),
            JSON.stringify({ title: "Type Annotations", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-annotations-on-variables" })
          ]
        },

        // Level 1 – Interfaces & Type Aliases (1-2)
        {
          id: "1-2-3",
          lessonId: "1-2",
          type: "multiple-choice",
          prompt: "What is a key difference between an interface and a type alias?",
          order: 3,
          xpReward: 30,
          options: [
            "Interfaces can describe object shapes; type aliases cannot",
            "Type aliases can describe unions and primitives; interfaces generally describe object shapes",
            "Interfaces can only be used with classes",
            "There is absolutely no difference"
          ],
          correctAnswer: 1,
          explanation: "Type aliases can represent unions, primitives, and more, while interfaces primarily describe object shapes and can be merged/extended.",
          starterCode: null,
          validationPatterns: [],
          hint: "Think about which one can describe a union like 'success' | 'error'.",
          documentationLinks: [
            JSON.stringify({ title: "Object Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html" }),
            JSON.stringify({ title: "Type Aliases", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases" }),
            JSON.stringify({ title: "Interfaces", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces" })
          ]
        },
        {
          id: "1-2-4",
          lessonId: "1-2",
          type: "code",
          prompt: "Create a type alias 'UserStatus' that can be 'active', 'inactive', or 'banned'. Then create a User interface with a 'status' property of type UserStatus.",
          order: 4,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your UserStatus type and User interface here\n`,
          validationPatterns: [
            "type UserStatus =",
            "'active'",
            "'inactive'",
            "'banned'",
            "interface User",
            "status: UserStatus"
          ],
          hint: "First: type UserStatus = 'active' | 'inactive' | 'banned'; Then: interface User with a status property using that type.",
          sampleSolution: `type UserStatus = 'active' | 'inactive' | 'banned';

interface User {
  status: UserStatus;
}`,
          documentationLinks: [
            JSON.stringify({ title: "Union Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types" }),
            JSON.stringify({ title: "Type Aliases", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases" }),
            JSON.stringify({ title: "Literal Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types" })
          ]
        },
        {
          id: "1-2-5",
          lessonId: "1-2",
          type: "code",
          prompt: "Extend an existing interface 'BaseUser' with an 'AdminUser' interface that adds a 'permissions: string[]' property.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `interface BaseUser {\n  id: number;\n  name: string;\n}\n\n// Extend BaseUser here\n`,
          validationPatterns: [
            "interface AdminUser extends BaseUser",
            "permissions: string[]||permissions: Array<string>"
          ],
          hint: "Use interface AdminUser extends BaseUser { ... } syntax.",
          sampleSolution: `interface BaseUser {
  id: number;
  name: string;
}

interface AdminUser extends BaseUser {
  permissions: string[];
}`,
          documentationLinks: [
            JSON.stringify({ title: "Object Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html" }),
            JSON.stringify({ title: "Type Aliases", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases" }),
            JSON.stringify({ title: "Interfaces", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces" })
          ]
        },

        // Level 1 – Union & Intersection Types (1-3)
        {
          id: "1-3-4",
          lessonId: "1-3",
          type: "multiple-choice",
          prompt: "Which of these is a valid union type declaration?",
          order: 4,
          xpReward: 30,
          options: [
            "type Id = string & number;",
            "type Id = string | number;",
            "type Id = string || number;",
            "type Id = string, number;"
          ],
          correctAnswer: 1,
          explanation: "The | symbol creates a union type, so type Id = string | number; is correct.",
          starterCode: null,
          validationPatterns: [],
          hint: "Remember: | is for unions, & is for intersections.",
          documentationLinks: [
            JSON.stringify({ title: "Union Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types" }),
            JSON.stringify({ title: "Intersection Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types" }),
            JSON.stringify({ title: "Literal Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types" })
          ]
        },
        {
          id: "1-3-5",
          lessonId: "1-3",
          type: "code",
          prompt: "Create a union type 'ResponseStatus' that can be 200, 404, or 500 and a variable 'status' using that type.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your ResponseStatus type and status variable here\n`,
          validationPatterns: [
            "type ResponseStatus = 200 | 404 | 500",
            "status: ResponseStatus"
          ],
          hint: "Use numeric literal union types for the status values.",
          sampleSolution: `type ResponseStatus = 200 | 404 | 500;
let status: ResponseStatus;`,
          documentationLinks: [
            JSON.stringify({ title: "Union Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types" }),
            JSON.stringify({ title: "Intersection Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types" }),
            JSON.stringify({ title: "Literal Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types" })
          ]
        },
        {
          id: "1-3-6",
          lessonId: "1-3",
          type: "code",
          prompt: "Create an intersection type 'FullProfile' that combines Contact { email: string } and Profile { username: string }.",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `interface Contact {\n  email: string;\n}\n\ninterface Profile {\n  username: string;\n}\n\n// Create your FullProfile type here\n`,
          validationPatterns: [
            "type FullProfile = Contact & Profile"
          ],
          hint: "Use the & operator to combine the two interfaces.",
          documentationLinks: [
            JSON.stringify({ title: "Union Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types" }),
            JSON.stringify({ title: "Intersection Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types" }),
            JSON.stringify({ title: "Literal Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types" })
          ]
        },

        // Level 2 – Typing Functions (2-1)
        {
          id: "2-1-4",
          lessonId: "2-1",
          type: "multiple-choice",
          prompt: "What is the return type of a function that does not explicitly return anything?",
          order: 4,
          xpReward: 30,
          options: [
            "undefined",
            "null",
            "void",
            "any"
          ],
          correctAnswer: 2,
          explanation: "Functions that do not return a value are typically typed as returning void.",
          starterCode: null,
          validationPatterns: [],
          hint: "Think about console.log and event handlers that just perform side effects.",
          documentationLinks: [
            JSON.stringify({ title: "Functions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html" }),
            JSON.stringify({ title: "Optional Parameters", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters" }),
            JSON.stringify({ title: "Function Type Expressions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions" })
          ]
        },
        {
          id: "2-1-5",
          lessonId: "2-1",
          type: "code",
          prompt: "Add parameter and return types to make this function accept two numbers and return a number.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `function subtract(a, b) {\n  return a - b;\n}\n\nconst result = subtract(10, 3);`,
          validationPatterns: [
            "function subtract",
            "a: number",
            "b: number",
            "): number"
          ],
          hint: "Annotate both parameters as number and the return type as number.",
          documentationLinks: [
            JSON.stringify({ title: "Functions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html" }),
            JSON.stringify({ title: "Optional Parameters", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters" }),
            JSON.stringify({ title: "Function Type Expressions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions" })
          ]
        },
        {
          id: "2-1-6",
          lessonId: "2-1",
          type: "code",
          prompt: "Create a function 'logMessage' that takes a message (string) and returns void.",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your logMessage function here\n`,
          validationPatterns: [
            "function logMessage",
            "message: string",
            ": void"
          ],
          hint: "Use : void as the return type when the function only performs side effects.",
          documentationLinks: [
            JSON.stringify({ title: "Functions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html" }),
            JSON.stringify({ title: "Optional Parameters", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters" }),
            JSON.stringify({ title: "Function Type Expressions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions" })
          ]
        },

        // Level 2 – Function Types in Interfaces (2-2)
        {
          id: "2-2-4",
          lessonId: "2-2",
          type: "multiple-choice",
          prompt: "How do you type a callback that receives a boolean and returns nothing?",
          order: 4,
          xpReward: 30,
          options: [
            "(flag: boolean) => void",
            "boolean => void",
            "(flag: boolean): boolean",
            "() => boolean"
          ],
          correctAnswer: 0,
          explanation: "The arrow function syntax (flag: boolean) => void describes a callback that receives a boolean and returns nothing.",
          starterCode: null,
          validationPatterns: [],
          hint: "Remember parameter list in parentheses, type annotation, then => return type.",
          documentationLinks: [
            JSON.stringify({ title: "Call Signatures", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures" }),
            JSON.stringify({ title: "Function Type Expressions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions" }),
            JSON.stringify({ title: "Object Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html" })
          ]
        },
        {
          id: "2-2-5",
          lessonId: "2-2",
          type: "code",
          prompt: "Add a function property 'onValidate' to FormProps that takes a boolean 'isValid' and returns void.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `interface FormProps {\n  onSubmit: () => void;\n  // Add onValidate here\n}\n`,
          validationPatterns: [
            "interface FormProps",
            "onValidate: (isValid: boolean) => void"
          ],
          hint: "Follow the pattern: name: (paramName: type) => returnType.",
          documentationLinks: [
            JSON.stringify({ title: "Call Signatures", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures" }),
            JSON.stringify({ title: "Function Type Expressions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions" }),
            JSON.stringify({ title: "Object Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html" })
          ]
        },
        {
          id: "2-2-6",
          lessonId: "2-2",
          type: "code",
          prompt: "Create a type alias 'ClickHandler' for a function that takes an event label (string) and returns void.",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your ClickHandler type here\n`,
          validationPatterns: [
            "type ClickHandler = (label: string) => void"
          ],
          hint: "Use type Name = (param: type) => void.",
          documentationLinks: [
            JSON.stringify({ title: "Call Signatures", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures" }),
            JSON.stringify({ title: "Function Type Expressions", url: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions" }),
            JSON.stringify({ title: "Object Types", url: "https://www.typescriptlang.org/docs/handbook/2/objects.html" })
          ]
        },

        // Level 2 – Introduction to Generics (2-3)
        {
          id: "2-3-4",
          lessonId: "2-3",
          type: "multiple-choice",
          prompt: "What is the main benefit of using generics in functions?",
          order: 4,
          xpReward: 30,
          options: [
            "They make the code run faster",
            "They allow functions to work with multiple types while preserving type information",
            "They reduce bundle size",
            "They are required for async functions"
          ],
          correctAnswer: 1,
          explanation: "Generics allow a function to work with many types while still preserving and checking the type information.",
          starterCode: null,
          validationPatterns: [],
          hint: "Think of identity<T>(arg: T): T as the classic example.",
          documentationLinks: [
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Generic Constraints", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints" }),
            JSON.stringify({ title: "Generic Types", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables" })
          ]
        },
        {
          id: "2-3-5",
          lessonId: "2-3",
          type: "code",
          prompt: "Create a generic interface 'ApiResponse<T>' with data: T | null and error: string | null.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your ApiResponse interface here\n`,
          validationPatterns: [
            "interface ApiResponse<T>",
            "data: T | null",
            "error: string | null"
          ],
          hint: "Use a generic type parameter <T> and reference it for the data field.",
          documentationLinks: [
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Generic Constraints", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints" }),
            JSON.stringify({ title: "Generic Types", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables" })
          ]
        },
        {
          id: "2-3-6",
          lessonId: "2-3",
          type: "code",
          prompt: "Create a generic function 'wrapInArray' that takes a value of type T and returns an array of T.",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your wrapInArray function here\n`,
          validationPatterns: [
            "function wrapInArray",
            "<T>",
            "(value: T)",
            ": T[]",
            "return [value"
          ],
          hint: "Return [value] and annotate the return type as T[].",
          documentationLinks: [
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Generic Constraints", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints" }),
            JSON.stringify({ title: "Generic Types", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables" })
          ]
        },

        // Level 2 – Generics with Arrays & Promises (2-4)
        {
          id: "2-4-4",
          lessonId: "2-4",
          type: "multiple-choice",
          prompt: "How do you type a Promise that resolves to an array of numbers?",
          order: 4,
          xpReward: 30,
          options: [
            "Promise<number[]>",
            "Promise<Array<number>>",
            "Both A and B",
            "Promise<number>"
          ],
          correctAnswer: 2,
          explanation: "Both Promise<number[]> and Promise<Array<number>> are valid and equivalent ways to type a promise that resolves to an array of numbers.",
          starterCode: null,
          validationPatterns: [],
          hint: "Array<T> and T[] are interchangeable for arrays.",
          documentationLinks: [
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Array Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays" }),
            JSON.stringify({ title: "Async Functions", url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait-support-in-es6-targets-node-v4" })
          ]
        },
        {
          id: "2-4-5",
          lessonId: "2-4",
          type: "code",
          prompt: "Create a generic function 'mapArray' that takes an array of T and a mapper (value: T) => U and returns U[].",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your mapArray function here\n`,
          validationPatterns: [
            "function mapArray",
            "<T, U>",
            "(items: T[])",
            "(value: T) => U",
            ": U[]"
          ],
          hint: "Use two generic parameters <T, U> and return an array of U.",
          documentationLinks: [
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Array Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays" }),
            JSON.stringify({ title: "Async Functions", url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait-support-in-es6-targets-node-v4" })
          ]
        },
        {
          id: "2-4-6",
          lessonId: "2-4",
          type: "code",
          prompt: "Create an async function 'fetchItems' that returns Promise<string[]> and simulate the result with Promise.resolve.",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your fetchItems function here\n`,
          validationPatterns: [
            "async function fetchItems",
            ": Promise<string[]>",
            "Promise.resolve"
          ],
          hint: "Annotate the return type as Promise<string[]> and return Promise.resolve([...]).",
          documentationLinks: [
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Array Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays" }),
            JSON.stringify({ title: "Async Functions", url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait-support-in-es6-targets-node-v4" })
          ]
        },

        // Level 3 – Typing React Components & Props (3-1)
        {
          id: "3-1-4",
          lessonId: "3-1",
          type: "multiple-choice",
          prompt: "What is the recommended way to type props for a React function component?",
          order: 4,
          xpReward: 30,
          options: [
            "Use any for props to avoid errors",
            "Use an interface or type alias and annotate the function parameter",
            "Use the React.FC type only",
            "You don't need to type props at all"
          ],
          correctAnswer: 1,
          explanation: "Defining an interface or type alias for props and annotating the component parameter is the most flexible and explicit approach.",
          starterCode: null,
          validationPatterns: [],
          hint: "Think: interface Props { ... }; function Component(props: Props) { ... }",
          documentationLinks: [
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" }),
            JSON.stringify({ title: "Typing Component Props", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example" }),
            JSON.stringify({ title: "React with TypeScript", url: "https://www.typescriptlang.org/docs/handbook/react.html" })
          ]
        },
        {
          id: "3-1-5",
          lessonId: "3-1",
          type: "code",
          prompt: "Create a React function component 'Badge' that accepts props { label: string; color?: string }.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `// Define your BadgeProps and Badge component here\n`,
          validationPatterns: [
            "interface BadgeProps",
            "label: string",
            "color?: string",
            "function Badge",
            "({ label",
            "}: BadgeProps)"
          ],
          hint: "Define an interface BadgeProps and annotate the component parameter with it.",
          documentationLinks: [
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" }),
            JSON.stringify({ title: "Typing Component Props", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example" }),
            JSON.stringify({ title: "React with TypeScript", url: "https://www.typescriptlang.org/docs/handbook/react.html" })
          ]
        },
        {
          id: "3-1-6",
          lessonId: "3-1",
          type: "code",
          prompt: "Create a generic prop 'items: T[]' on a List component and a 'renderItem: (item: T) => ReactNode' prop.",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { ReactNode } from 'react';\n\n// Define your generic ListProps and List component here\n`,
          validationPatterns: [
            "interface ListProps<T>",
            "items: T[]",
            "renderItem: (item: T) => ReactNode",
            "function List<T>",
            "({ items",
            "}: ListProps<T>)"
          ],
          hint: "Reuse the pattern from the lesson for generic component props.",
          documentationLinks: [
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" }),
            JSON.stringify({ title: "Typing Component Props", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example" }),
            JSON.stringify({ title: "React with TypeScript", url: "https://www.typescriptlang.org/docs/handbook/react.html" })
          ]
        },

        // Level 3 – Typing React State & Hooks (3-2)
        {
          id: "3-2-4",
          lessonId: "3-2",
          type: "multiple-choice",
          prompt: "Which is the best way to type a state that can be either a number or null?",
          order: 4,
          xpReward: 30,
          options: [
            "const [value, setValue] = useState();",
            "const [value, setValue] = useState<number>();",
            "const [value, setValue] = useState<number | null>(null);",
            "const [value, setValue] = useState<any>(0);"
          ],
          correctAnswer: 2,
          explanation: "useState<number | null>(null) makes it clear the state can be a number or null and enforces correct usage.",
          starterCode: null,
          validationPatterns: [],
          hint: "You want both null as the initial value and a strict numeric type later.",
          documentationLinks: [
            JSON.stringify({ title: "useState Hook", url: "https://react.dev/reference/react/useState" }),
            JSON.stringify({ title: "Hooks with TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-2-5",
          lessonId: "3-2",
          type: "code",
          prompt: "Create a state variable 'loading' that is typed as boolean and initialized to false.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useState } from 'react';\n\nfunction Loader() {\n  // Define your loading state here\n  \n  return <div>{loading ? "Loading..." : "Done"}</div>;\n}`,
          validationPatterns: [
            "const [loading",
            "useState<boolean>(false)"
          ],
          hint: "Use useState<boolean>(false) or rely on inference with useState(false).",
          documentationLinks: [
            JSON.stringify({ title: "useState Hook", url: "https://react.dev/reference/react/useState" }),
            JSON.stringify({ title: "Hooks with TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-2-6",
          lessonId: "3-2",
          type: "code",
          prompt: "Create state for 'errors' as an array of strings, initialized to an empty array.",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useState } from 'react';\n\nfunction ErrorList() {\n  // Define your errors state here\n  \n  return <div>{errors.length}</div>;\n}`,
          validationPatterns: [
            "const [errors",
            "useState<string[]>([])"
          ],
          hint: "Use useState<string[]>([]) to ensure items are strings.",
          documentationLinks: [
            JSON.stringify({ title: "useState Hook", url: "https://react.dev/reference/react/useState" }),
            JSON.stringify({ title: "Hooks with TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },

        // Level 3 – Typing Events & Handlers (3-3)
        {
          id: "3-3-4",
          lessonId: "3-3",
          type: "multiple-choice",
          prompt: "Which event type would you use for a form submission handler?",
          order: 4,
          xpReward: 30,
          options: [
            "React.FormEvent<HTMLFormElement>",
            "React.ChangeEvent<HTMLFormElement>",
            "React.MouseEvent<HTMLFormElement>",
            "React.KeyboardEvent<HTMLFormElement>"
          ],
          correctAnswer: 0,
          explanation: "Form submissions use React.FormEvent<HTMLFormElement>, which provides access to submit-related information.",
          starterCode: null,
          validationPatterns: [],
          hint: "You already used FormEvent in one of the earlier challenges.",
          documentationLinks: [
            JSON.stringify({ title: "Responding to Events", url: "https://react.dev/learn/responding-to-events" }),
            JSON.stringify({ title: "Event Types in TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-3-5",
          lessonId: "3-3",
          type: "code",
          prompt: "Type a change handler for a select element that logs the selected value.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { ChangeEvent } from 'react';\n\n// Define your handleSelectChange function here\n`,
          validationPatterns: [
            "handleSelectChange",
            "ChangeEvent<HTMLSelectElement>",
            "e.target.value"
          ],
          hint: "Use ChangeEvent<HTMLSelectElement> as the event type.",
          documentationLinks: [
            JSON.stringify({ title: "Responding to Events", url: "https://react.dev/learn/responding-to-events" }),
            JSON.stringify({ title: "Event Types in TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-3-6",
          lessonId: "3-3",
          type: "code",
          prompt: "Create a keyboard event handler for an input that logs the key pressed.",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { KeyboardEvent } from 'react';\n\n// Define your handleKeyDown function here\n`,
          validationPatterns: [
            "handleKeyDown",
            "KeyboardEvent<HTMLInputElement>",
            "e.key"
          ],
          hint: "Use KeyboardEvent<HTMLInputElement> for key events on inputs.",
          documentationLinks: [
            JSON.stringify({ title: "Responding to Events", url: "https://react.dev/learn/responding-to-events" }),
            JSON.stringify({ title: "Event Types in TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },

        // Level 3 – useEffect & Lifecycle (3-4)
        {
          id: "3-4-4",
          lessonId: "3-4",
          type: "multiple-choice",
          prompt: "What does an empty dependency array [] mean in useEffect?",
          order: 4,
          xpReward: 30,
          options: [
            "The effect never runs",
            "The effect runs on every render",
            "The effect runs only once after the initial render",
            "The effect runs only when props change"
          ],
          correctAnswer: 2,
          explanation: "An empty dependency array means the effect runs only once after the component mounts.",
          starterCode: null,
          validationPatterns: [],
          hint: "Think: when you want 'componentDidMount'-like behavior.",
          documentationLinks: [
            JSON.stringify({ title: "useEffect Hook", url: "https://react.dev/reference/react/useEffect" }),
            JSON.stringify({ title: "useEffect with TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-4-5",
          lessonId: "3-4",
          type: "code",
          prompt: "Create a useEffect that logs 'Mounted' once when the component mounts.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useEffect } from 'react';\n\nfunction Logger() {\n  // Add your useEffect here\n  \n  return <div>Check the console</div>;\n}`,
          validationPatterns: [
            "useEffect",
            "console.log(\"Mounted\")||console.log('Mounted')",
            "[]"
          ],
          hint: "Use useEffect(() => { console.log(\"Mounted\"); }, []);",
          documentationLinks: [
            JSON.stringify({ title: "useEffect Hook", url: "https://react.dev/reference/react/useEffect" }),
            JSON.stringify({ title: "useEffect with TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "3-4-6",
          lessonId: "3-4",
          type: "code",
          prompt: "Create a useEffect that subscribes to a mock 'subscribe()' function and cleans up with 'unsubscribe()'.",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useEffect } from 'react';\n\nfunction Subscription() {\n  // Assume subscribe and unsubscribe functions are available in scope\n  // Add your useEffect here\n  \n  return <div>Subscribed</div>;\n}`,
          validationPatterns: [
            "useEffect",
            "subscribe()",
            "unsubscribe()",
            "return () =>"
          ],
          hint: "Call subscribe() inside the effect and return a cleanup function that calls unsubscribe().",
          documentationLinks: [
            JSON.stringify({ title: "useEffect Hook", url: "https://react.dev/reference/react/useEffect" }),
            JSON.stringify({ title: "useEffect with TypeScript", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },

        // Level 4 – Generic React Components (4-1)
        {
          id: "4-1-4",
          lessonId: "4-1",
          type: "multiple-choice",
          prompt: "How do you declare a generic React component with a type parameter T?",
          order: 4,
          xpReward: 30,
          options: [
            "function List(props: T) {}",
            "function List<T>(props: { items: T[] }) {}",
            "function<T> List(props: { items: T[] }) {}",
            "Generic<T> function List(props: { items: T[] }) {}"
          ],
          correctAnswer: 1,
          explanation: "The typical pattern is function List<T>(props: { items: T[] }) { ... } with <T> after the function name.",
          starterCode: null,
          validationPatterns: [],
          hint: "Place <T> immediately after the component name.",
          documentationLinks: [
            JSON.stringify({ title: "Generic Components", url: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#generic-components" }),
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Advanced Patterns", url: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase" })
          ]
        },
        {
          id: "4-1-5",
          lessonId: "4-1",
          type: "code",
          prompt: "Create a generic BadgeList<T> component that renders items using a renderItem prop.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { ReactNode } from 'react';\n\n// Define your BadgeListProps and BadgeList component here\n`,
          validationPatterns: [
            "interface BadgeListProps<T>",
            "items: T[]",
            "renderItem: (item: T) => ReactNode",
            "function BadgeList<T>"
          ],
          hint: "Mirror the List<T> pattern from earlier lessons.",
          documentationLinks: [
            JSON.stringify({ title: "Generic Components", url: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#generic-components" }),
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Advanced Patterns", url: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase" })
          ]
        },
        {
          id: "4-1-6",
          lessonId: "4-1",
          type: "code",
          prompt: "Create a generic component TableRow<T extends { id: number }> that renders children for a given item.",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { ReactNode } from 'react';\n\n// Define your TableRowProps and TableRow component here\n`,
          validationPatterns: [
            "interface TableRowProps<T extends { id: number }>",
            "function TableRow<T extends { id: number }>",
            "children: (item: T) => ReactNode"
          ],
          hint: "Constrain T with extends { id: number } just like in previous examples.",
          documentationLinks: [
            JSON.stringify({ title: "Generic Components", url: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#generic-components" }),
            JSON.stringify({ title: "Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }),
            JSON.stringify({ title: "Advanced Patterns", url: "https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase" })
          ]
        },

        // Level 4 – Custom Hooks (4-2)
        {
          id: "4-2-4",
          lessonId: "4-2",
          type: "multiple-choice",
          prompt: "Which of these names follows the convention for custom hooks?",
          order: 4,
          xpReward: 30,
          options: [
            "counterHook",
            "useCounter",
            "CounterHook",
            "usecounter"
          ],
          correctAnswer: 1,
          explanation: "Custom hooks should start with 'use' followed by a capitalized name segment, e.g. useCounter.",
          starterCode: null,
          validationPatterns: [],
          hint: "React relies on the 'use' prefix to detect hooks.",
          documentationLinks: [
            JSON.stringify({ title: "Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" }),
            JSON.stringify({ title: "Typing Custom Hooks", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#custom-hooks" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "4-2-5",
          lessonId: "4-2",
          type: "code",
          prompt: "Create a custom hook useToggle that manages a boolean value and returns [value, toggle].",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useState } from 'react';\n\n// Define your useToggle hook here\n`,
          validationPatterns: [
            "function useToggle",
            "const [value, setValue] = useState(false)",
            "return [value",
            "toggle"
          ],
          hint: "Initialize with useState(false) and return the value plus a function that flips it.",
          documentationLinks: [
            JSON.stringify({ title: "Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" }),
            JSON.stringify({ title: "Typing Custom Hooks", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#custom-hooks" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },
        {
          id: "4-2-6",
          lessonId: "4-2",
          type: "code",
          prompt: "Create a generic hook useList<T> that returns [items: T[], add: (item: T) => void, remove: (index: number) => void].",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useState } from 'react';\n\n// Define your useList hook here\n`,
          validationPatterns: [
            "function useList",
            "<T>",
            "useState<T[]>([])",
            "add: (item: T)",
            "remove: (index: number)"
          ],
          hint: "Use a generic type parameter and manage items with useState.",
          documentationLinks: [
            JSON.stringify({ title: "Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks" }),
            JSON.stringify({ title: "Typing Custom Hooks", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#custom-hooks" }),
            JSON.stringify({ title: "React TypeScript", url: "https://react.dev/learn/typescript" })
          ]
        },

        // Level 4 – Context & Custom Hooks (4-3)
        {
          id: "4-3-4",
          lessonId: "4-3",
          type: "multiple-choice",
          prompt: "Why is it helpful to throw an error inside a custom context hook when context is undefined?",
          order: 4,
          xpReward: 30,
          options: [
            "To crash the app as soon as possible",
            "To provide a clear error when the hook is used outside its Provider",
            "It is required by TypeScript",
            "It improves performance"
          ],
          correctAnswer: 1,
          explanation: "Throwing an error when context is undefined gives a clear message that the hook must be used within the appropriate Provider.",
          starterCode: null,
          validationPatterns: [],
          hint: "Think about developer experience when someone forgets to wrap components in the Provider.",
          documentationLinks: [
            JSON.stringify({ title: "Context with TypeScript", url: "https://react.dev/learn/typescript#typing-usecontext" }),
            JSON.stringify({ title: "Context API", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context" }),
            JSON.stringify({ title: "useContext Hook", url: "https://react.dev/reference/react/useContext" })
          ]
        },
        {
          id: "4-3-5",
          lessonId: "4-3",
          type: "code",
          prompt: "Create a UserContextType with user: string | null and setUser: (user: string | null) => void, then create a UserContext.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { createContext } from 'react';\n\n// Define your UserContextType and UserContext here\n`,
          validationPatterns: [
            "interface UserContextType",
            "user: string | null",
            "setUser: (user: string | null) => void",
            "createContext<UserContextType | undefined>(undefined)"
          ],
          hint: "Follow the same pattern as the ThemeContext example.",
          documentationLinks: [
            JSON.stringify({ title: "Context with TypeScript", url: "https://react.dev/learn/typescript#typing-usecontext" }),
            JSON.stringify({ title: "Context API", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context" }),
            JSON.stringify({ title: "useContext Hook", url: "https://react.dev/reference/react/useContext" })
          ]
        },
        {
          id: "4-3-6",
          lessonId: "4-3",
          type: "code",
          prompt: "Implement a custom hook useUser that reads UserContext and throws if it is undefined.",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `import { useContext } from 'react';\n\n// Assume UserContext is already defined\n// Create your useUser hook here\n`,
          validationPatterns: [
            "useContext(UserContext)",
            "const context = useContext||const userContext = useContext||const value = useContext",
            "if (!context)||if (!userContext)||if (!value",
            "throw new Error"
          ],
          hint: "Copy the guard pattern from the useTheme example and adjust names.",
          documentationLinks: [
            JSON.stringify({ title: "Context with TypeScript", url: "https://react.dev/learn/typescript#typing-usecontext" }),
            JSON.stringify({ title: "Context API", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context" }),
            JSON.stringify({ title: "useContext Hook", url: "https://react.dev/reference/react/useContext" })
          ]
        },

        // Level 4 – Utility Types (4-4)
        {
          id: "4-4-4",
          lessonId: "4-4",
          type: "multiple-choice",
          prompt: "What does the Readonly<T> utility type do?",
          order: 4,
          xpReward: 30,
          options: [
            "Makes all properties optional",
            "Prevents properties from being reassigned",
            "Removes all properties",
            "Converts all properties to strings"
          ],
          correctAnswer: 1,
          explanation: "Readonly<T> marks all properties as read-only, so they cannot be reassigned after initialization.",
          starterCode: null,
          validationPatterns: [],
          hint: "Think of it as adding 'readonly' to every property.",
          documentationLinks: [
            JSON.stringify({ title: "Utility Types", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html" }),
            JSON.stringify({ title: "Partial", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype" }),
            JSON.stringify({ title: "Pick", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys" }),
            JSON.stringify({ title: "Omit", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" })
          ]
        },
        {
          id: "4-4-5",
          lessonId: "4-4",
          type: "code",
          prompt: "Create a type ReadonlyUser from User using Readonly<User>.",
          order: 5,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `interface User {\n  id: number;\n  name: string;\n}\n\n// Create your ReadonlyUser type here\n`,
          validationPatterns: [
            "type ReadonlyUser = Readonly<User>"
          ],
          hint: "Use Readonly<User> to create the new type.",
          documentationLinks: [
            JSON.stringify({ title: "Utility Types", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html" }),
            JSON.stringify({ title: "Partial", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype" }),
            JSON.stringify({ title: "Pick", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys" }),
            JSON.stringify({ title: "Omit", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" })
          ]
        },
        {
          id: "4-4-6",
          lessonId: "4-4",
          type: "code",
          prompt: "Create a type RequiredUser that makes all properties of User required using Required<User>.",
          order: 6,
          xpReward: 30,
          options: [],
          correctAnswer: null,
          explanation: null,
          starterCode: `interface User {\n  id?: number;\n  name?: string;\n  email?: string;\n}\n\n// Create your RequiredUser type here\n`,
          validationPatterns: [
            "type RequiredUser = Required<User>"
          ],
          hint: "Use Required<User> to remove optional modifiers from all properties.",
          documentationLinks: [
            JSON.stringify({ title: "Utility Types", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html" }),
            JSON.stringify({ title: "Partial", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype" }),
            JSON.stringify({ title: "Pick", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys" }),
            JSON.stringify({ title: "Omit", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys" })
          ]
        }
      ];

      await tx.insert(challenges).values(challengesData);
      console.log("✓ Challenges seeded");

      // Seed badges
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
