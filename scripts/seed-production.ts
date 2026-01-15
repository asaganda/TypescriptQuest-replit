import "dotenv/config";
import { db } from "../server/db";
import { levels, lessons, challenges, userAnswers, userProgress } from "@shared/schema";

/**
 * Production seed script - Generated from local database
 * Contains all levels, lessons, and challenges
 *
 * Run with: DATABASE_URL="your-neon-url" npx tsx scripts/seed-production.ts
 */

async function seedProduction() {
  console.log("Starting production seed...");

  try {
    // Clear existing data (preserves users)
    console.log("Clearing existing curriculum data...");
    await db.delete(userAnswers);
    await db.delete(userProgress);
    await db.delete(challenges);
    await db.delete(lessons);
    await db.delete(levels);

    // Insert levels
    console.log("Inserting levels...");
    await db.insert(levels).values([
      {
        id: "1",
        name: "TypeScript Basics",
        description: "Learn fundamental types, interfaces, and type annotations to build a strong foundation",
        order: 1,
        xpRequired: 0,
      },
      {
        id: "2",
        name: "Functions & Generics",
        description: "Master function types, generics, and advanced type features for flexible code",
        order: 2,
        xpRequired: 200,
      },
      {
        id: "3",
        name: "React + TypeScript Fundamentals",
        description: "Build type-safe React applications with component typing, state management, and hooks",
        order: 3,
        xpRequired: 500,
      },
      {
        id: "4",
        name: "Advanced React + TypeScript",
        description: "Master generic components, custom hooks, Context API, and advanced React patterns",
        order: 4,
        xpRequired: 800,
      },
    ]);
    console.log("✓ Inserted 4 levels");

    // Insert lessons
    console.log("Inserting lessons...");
    await db.insert(lessons).values([
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
        xpReward: 20,
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
        xpReward: 20,
      },
      {
        id: "2-3",
        levelId: "2",
        title: "Introduction to Generics",
        description: "Learn the foundational generic syntax and patterns",
        content: `
          <h3>What Are Generics?</h3>
          <p>Imagine you have a box. You want to write a function that tells you what's inside the box. The problem is: you don't know what type of thing will be in the box - it could be a number, a string, an object, anything!</p>

          <p><strong>Generics</strong> let you write code that works with <strong>any type</strong>, while still keeping TypeScript's type safety. Think of them as <strong>type placeholders</strong> or <strong>type variables</strong>.</p>

          <h3>The Problem Without Generics</h3>
          <p>Let's say you want a function that returns whatever you give it:</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// Without generics - we lose type information
function returnWhatYouGiveMe(arg: any): any {
  return arg;
}

const result = returnWhatYouGiveMe("hello");
// result is 'any' - TypeScript doesn't know it's a string!</code></pre>

          <p>The problem: using <code>any</code> means we lose all type safety. TypeScript can't help us anymore.</p>

          <h3>The Solution: Generics!</h3>
          <p>Generics let us say "this function works with any type, but remember what that type was":</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// With generics - we preserve type information!
function returnWhatYouGiveMe&lt;T&gt;(arg: T): T {
  return arg;
}

const result = returnWhatYouGiveMe("hello");
// result is a string! TypeScript remembers the type.</code></pre>

          <p><strong>Breaking down the syntax:</strong></p>
          <ul>
            <li><code>&lt;T&gt;</code> - This is a <strong>type parameter</strong>. Think of it like a variable, but for types!</li>
            <li><code>T</code> can be <strong>any name</strong> (people commonly use T, Type, K, V)</li>
            <li><code>(arg: T)</code> - The parameter is of type T (whatever T ends up being)</li>
            <li><code>: T</code> - The function returns type T (the same type)</li>
          </ul>

          <h3>How TypeScript Figures Out T</h3>
          <p>TypeScript is smart - it usually <strong>infers</strong> (figures out) what T should be:</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>function identity&lt;T&gt;(arg: T): T {
  return arg;
}

// TypeScript infers T = string
let text = identity("hello");  // text: string

// TypeScript infers T = number
let num = identity(42);  // num: number

// You can also be explicit if you want
let explicit = identity&lt;boolean&gt;(true);  // explicit: boolean</code></pre>

          <h3>Real Example: Getting First Element</h3>
          <p>Here's a practical example - a function that gets the first element of any array:</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// Works with ANY type of array!
function firstElement&lt;Type&gt;(arr: Type[]): Type | undefined {
  return arr[0];
}

// With string array - TypeScript knows result is string
const firstWord = firstElement(["hello", "world"]);
// firstWord: string | undefined

// With number array - TypeScript knows result is number
const firstNum = firstElement([1, 2, 3]);
// firstNum: number | undefined

// With object array - TypeScript knows result is that object type
const firstUser = firstElement([{ name: "Alice" }, { name: "Bob" }]);
// firstUser: { name: string } | undefined</code></pre>

          <p><strong>Why this is powerful:</strong> One function works with every type of array, AND you get full type safety!</p>

          <h3>Generic Constraints: Limiting What T Can Be</h3>
          <p>Sometimes you need T to have certain properties. Use <code>extends</code> to add constraints:</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// T must have a 'length' property
function longest&lt;T extends { length: number }&gt;(a: T, b: T): T {
  if (a.length >= b.length) {
    return a;
  }
  return b;
}

// Works - strings have .length
const longestWord = longest("alice", "bob");  // returns "alice"

// Works - arrays have .length
const longestArray = longest([1, 2], [1, 2, 3]);  // returns [1, 2, 3]

// Error - numbers don't have .length
// const wrong = longest(10, 100);  // ✗ Won't compile!</code></pre>

          <p><strong>The constraint <code>T extends { length: number }</code> means:</strong> "T can be any type, as long as it has a length property that's a number"</p>

          <h3>Where You've Already Seen Generics</h3>
          <p>You've actually been using generics already in React!</p>

          <pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>// useState is a generic function!
const [count, setCount] = useState&lt;number&gt;(0);
// TypeScript knows count is a number

const [name, setName] = useState&lt;string&gt;("");
// TypeScript knows name is a string

const [user, setUser] = useState&lt;User | null&gt;(null);
// TypeScript knows user is either User or null</code></pre>

          <p class="mt-4"><strong>Key Takeaway:</strong> Generics let you write flexible, reusable code that works with any type, while keeping full type safety. They're like "fill in the blank" for types - TypeScript fills in the blank based on how you use the function!</p>
        `,
        order: 3,
        xpReward: 20,
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
        xpReward: 20,
      },
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
        xpReward: 20,
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
        xpReward: 20,
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
        xpReward: 20,
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
        xpReward: 20,
      },
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
        xpReward: 20,
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
        xpReward: 20,
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
        xpReward: 20,
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
        xpReward: 20,
      },
      {
        id: "1-3",
        levelId: "1",
        title: "Lists, Arrays & Rendering Data",
        description: "Render lists of typed data in React",
        content: `
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
          &lt;p&gt;$\${product.price}&lt;/p&gt;
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
      `,
        order: 3,
        xpReward: 25,
      },
      {
        id: "1-2",
        levelId: "1",
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
        order: 2,
        xpReward: 25,
      },
      {
        id: "1-1",
        levelId: "1",
        title: "TypeScript Fundamentals",
        description: "Learn the core TypeScript concepts you'll use every day",
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
  `,
        order: 1,
        xpReward: 25,
      },
      {
        id: "1-4",
        levelId: "1",
        title: "React State with useState",
        description: "Make components interactive with useState hook",
        content: `
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
      `,
        order: 4,
        xpReward: 25,
      },
      {
        id: "1-5",
        levelId: "1",
        title: "Event Handlers & User Interaction",
        description: "Handle user interactions with typed event handlers",
        content: `
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
      `,
        order: 5,
        xpReward: 25,
      },
    ]);
    console.log("✓ Inserted 17 lessons");

    // Insert challenges
    console.log("Inserting challenges...");
    await db.insert(challenges).values([
      {
        id: "1-2-1",
        lessonId: "1-2",
        type: "multiple-choice",
        prompt: `In React with TypeScript, how do you define the shape of a component's props?`,
        order: 1,
        xpReward: 10,
        options: ["Using an interface or type alias","Using a class","Props are automatically typed","Using PropTypes from prop-types package"],
        correctAnswer: 0,
        explanation: `In TypeScript React, you define component props using an interface or type alias. This provides compile-time type checking and excellent IDE support.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: null,
      },
      {
        id: "1-2-2",
        lessonId: "1-2",
        type: "code",
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
        order: 2,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your GreetingProps interface and Greeting component here
`,
        validationPatterns: ["interface greetingprops","name: string","function greeting",": greetingprops"],
        hint: null,
        sampleSolution: `interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}`,
        documentationLinks: null,
      },
      {
        id: "1-2-3",
        lessonId: "1-2",
        type: "code",
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
        order: 3,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your CardProps interface and Card component here
`,
        validationPatterns: ["interface cardprops","title: string","description?: string || description? : string","function card",": cardprops"],
        hint: null,
        sampleSolution: `interface CardProps {
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
}`,
        documentationLinks: null,
      },
      {
        id: "1-2-4",
        lessonId: "1-2",
        type: "multiple-choice",
        prompt: `What does the type \`variant: 'primary' | 'secondary'\` mean for a component prop?`,
        order: 4,
        xpReward: 10,
        options: ["variant can be any string","variant must be exactly 'primary' or 'secondary'","variant must be both 'primary' and 'secondary'","variant is optional"],
        correctAnswer: 1,
        explanation: `The pipe symbol \`|\` creates a union type. This means variant must be one of the specific string literals: either 'primary' or 'secondary'. This provides type safety and prevents typos!`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: null,
      },
      {
        id: "1-2-5",
        lessonId: "1-2",
        type: "code",
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
        order: 5,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your ButtonProps interface and Button component here
`,
        validationPatterns: ["interface buttonprops","label: string","'primary' | 'secondary' || \"primary\" | \"secondary\"","function button",": buttonprops"],
        hint: null,
        sampleSolution: `interface ButtonProps {
  label: string;
  variant: 'primary' | 'secondary';
}

function Button({ label, variant }: ButtonProps) {
  return <button>{label}</button>;
}`,
        documentationLinks: null,
      },
      {
        id: "1-2-6",
        lessonId: "1-2",
        type: "code",
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
        order: 6,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your BadgeProps interface and Badge component here
`,
        validationPatterns: ["interface badgeprops","text: string","color?: string || color? : string","function badge","= \"blue\" || = 'blue'"],
        hint: null,
        sampleSolution: `interface BadgeProps {
  text: string;
  color?: string;
}

function Badge({ text, color = "blue" }: BadgeProps) {
  return <span>{text}</span>;
}`,
        documentationLinks: null,
      },
      {
        id: "2-1-1",
        lessonId: "2-1",
        type: "multiple-choice",
        prompt: `What symbol is used to mark a parameter as optional in TypeScript?`,
        order: 1,
        xpReward: 30,
        options: ["!","?","*","&"],
        correctAnswer: 1,
        explanation: `The ? symbol after a parameter name marks it as optional, allowing it to be undefined.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Functions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html\"}","{\"title\":\"Optional Parameters\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters\"}","{\"title\":\"Function Type Expressions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions\"}"],
      },
      {
        id: "2-1-2",
        lessonId: "2-1",
        type: "code",
        prompt: `Add type annotations to this function: function multiply(a, b) { return a * b; }`,
        order: 2,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `function multiply(a, b) {
  return a * b;
}`,
        validationPatterns: ["function multiply","a: number","b: number","): number"],
        hint: `Both parameters should be numbers and the return type is also a number`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Functions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html\"}","{\"title\":\"Optional Parameters\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters\"}","{\"title\":\"Function Type Expressions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions\"}"],
      },
      {
        id: "2-1-3",
        lessonId: "2-1",
        type: "code",
        prompt: `Create a function 'greetUser' that takes a required 'name' (string) and optional 'greeting' (string with default 'Hello')`,
        order: 3,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your greetUser function here
`,
        validationPatterns: ["function greetUser","name: string","greeting: string = \"Hello\""],
        hint: `Use ?: for optional parameters or = for default values`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Functions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html\"}","{\"title\":\"Optional Parameters\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters\"}","{\"title\":\"Function Type Expressions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions\"}"],
      },
      {
        id: "2-2-1",
        lessonId: "2-2",
        type: "multiple-choice",
        prompt: `In a function type signature, what does () => void mean?`,
        order: 1,
        xpReward: 30,
        options: ["A function that returns nothing","A function that takes void as a parameter","An optional function","An async function"],
        correctAnswer: 0,
        explanation: `() => void describes a function that takes no parameters and returns nothing (void).`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Call Signatures\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures\"}","{\"title\":\"Function Type Expressions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions\"}","{\"title\":\"Object Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/objects.html\"}"],
      },
      {
        id: "2-2-2",
        lessonId: "2-2",
        type: "code",
        prompt: `Create an interface 'ButtonProps' with a string 'label' and a function 'onClick' that takes no params and returns void`,
        order: 2,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your ButtonProps interface here
`,
        validationPatterns: ["interface ButtonProps","label: string","onClick: () => void"],
        hint: `Use the arrow function syntax for the onClick type: () => void`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Call Signatures\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures\"}","{\"title\":\"Function Type Expressions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions\"}","{\"title\":\"Object Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/objects.html\"}"],
      },
      {
        id: "2-2-3",
        lessonId: "2-2",
        type: "code",
        prompt: `Create a type alias 'ChangeHandler' for a function that takes a string parameter 'value' and returns void`,
        order: 3,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your ChangeHandler type here
`,
        validationPatterns: ["type ChangeHandler =","(value: string) => void"],
        hint: `Type alias syntax: type Name = (param: type) => returnType`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Call Signatures\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures\"}","{\"title\":\"Function Type Expressions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions\"}","{\"title\":\"Object Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/objects.html\"}"],
      },
      {
        id: "2-3-1",
        lessonId: "2-3",
        type: "multiple-choice",
        prompt: `What does the <T> syntax represent in TypeScript?`,
        order: 1,
        xpReward: 30,
        options: ["A template literal","A type parameter (generic)","An HTML element","A type assertion"],
        correctAnswer: 1,
        explanation: `The <T> syntax defines a type parameter, allowing you to create generic functions and types that work with any type.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Generic Constraints\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints\"}","{\"title\":\"Generic Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables\"}"],
      },
      {
        id: "2-3-2",
        lessonId: "2-3",
        type: "code",
        prompt: `Create a generic function called 'getLastItem' that returns the last element of any array. The function should:
- Accept a parameter called 'items' that is an array of any type (use the generic type T)
- Return the last item in the array, or undefined if the array is empty
- Use the syntax: items[items.length - 1]

Example usage:
getLastItem([1, 2, 3]) should return 3
getLastItem(['a', 'b']) should return 'b'
getLastItem([]) should return undefined`,
        order: 2,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your getLastItem function here
// It should work with any type of array!
`,
        validationPatterns: ["function getLastItem","<T>","(items: T[])",": T | undefined"],
        hint: `Use <T> after the function name and T[] for the array parameter. Return items[items.length - 1]`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Generic Constraints\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints\"}","{\"title\":\"Generic Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables\"}"],
      },
      {
        id: "2-3-3",
        lessonId: "2-3",
        type: "code",
        prompt: `Create a generic function 'getLength' constrained to types with a length property (use extends { length: number })`,
        order: 3,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your getLength function here
`,
        validationPatterns: ["function getLength","<T extends { length: number }>",": number"],
        hint: `Use <T extends { length: number }> to constrain the generic type`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Generic Constraints\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints\"}","{\"title\":\"Generic Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables\"}"],
      },
      {
        id: "2-4-1",
        lessonId: "2-4",
        type: "multiple-choice",
        prompt: `Which syntax is correct for typing an array of strings?`,
        order: 1,
        xpReward: 30,
        options: ["Both string[] and Array<string> are correct","Only string[] is correct","Only Array<string> is correct","Neither is correct"],
        correctAnswer: 0,
        explanation: `Both string[] and Array<string> are valid and equivalent syntaxes for typing arrays in TypeScript.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Array Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays\"}","{\"title\":\"Async Functions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait-support-in-es6-targets-node-v4\"}"],
      },
      {
        id: "2-4-2",
        lessonId: "2-4",
        type: "code",
        prompt: `Create an async function 'fetchUserData' that returns a Promise<User> where User is { id: number, name: string }`,
        order: 2,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `interface User {
  id: number;
  name: string;
}

// Define your fetchUserData function here
`,
        validationPatterns: ["async function fetchUserData",": Promise<User>","return"],
        hint: `Async functions automatically return Promises - specify the type with Promise<User>`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Array Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays\"}","{\"title\":\"Async Functions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait-support-in-es6-targets-node-v4\"}"],
      },
      {
        id: "2-4-3",
        lessonId: "2-4",
        type: "code",
        prompt: `Create a variable 'users' typed as an array of User objects where User has id (number) and email (string)`,
        order: 3,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `interface User {
  id: number;
  email: string;
}

// Define your users variable here
`,
        validationPatterns: ["const users||let users","users: User[]||users: Array<User>"],
        hint: `Use either User[] or Array<User> syntax`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Array Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays\"}","{\"title\":\"Async Functions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait-support-in-es6-targets-node-v4\"}"],
      },
      {
        id: "3-1-1",
        lessonId: "3-1",
        type: "multiple-choice",
        prompt: `In React 18+, how do you type a component's children prop?`,
        order: 1,
        xpReward: 30,
        options: ["Children are automatically typed","Use children?: ReactNode","Use children: string","Use children?: any"],
        correctAnswer: 1,
        explanation: `React 18+ requires explicitly typing children. Use children?: ReactNode from React to accept any valid React child.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}","{\"title\":\"Typing Component Props\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example\"}","{\"title\":\"React with TypeScript\",\"url\":\"https://www.typescriptlang.org/docs/handbook/react.html\"}"],
      },
      {
        id: "3-2-6",
        lessonId: "3-2",
        type: "code",
        prompt: `Create state for 'errors' as an array of strings, initialized to an empty array.`,
        order: 6,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

function ErrorList() {
  // Define your errors state here
  
  return <div>{errors.length}</div>;
}`,
        validationPatterns: ["const [errors","useState<string[]>([])"],
        hint: `Use useState<string[]>([]) to ensure items are strings.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"useState Hook\",\"url\":\"https://react.dev/reference/react/useState\"}","{\"title\":\"Hooks with TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-1-2",
        lessonId: "3-1",
        type: "code",
        prompt: `Create an interface 'CardProps' with title (string), description (optional string), and children (optional ReactNode)`,
        order: 2,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { ReactNode } from 'react';

// Define your CardProps interface here
`,
        validationPatterns: ["interface CardProps","title: string","description?: string","children?: ReactNode"],
        hint: `Use ? for optional properties and import ReactNode from 'react'`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}","{\"title\":\"Typing Component Props\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example\"}","{\"title\":\"React with TypeScript\",\"url\":\"https://www.typescriptlang.org/docs/handbook/react.html\"}"],
      },
      {
        id: "3-1-3",
        lessonId: "3-1",
        type: "code",
        prompt: `Create an interface 'AlertProps' with a variant property that can only be 'success', 'error', or 'warning'`,
        order: 3,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your AlertProps interface here
`,
        validationPatterns: ["interface AlertProps","variant: \"success\" | \"error\" | \"warning\"||variant: 'success' | 'error' | 'warning'"],
        hint: `Use string literal types with | for the variant: 'success' | 'error' | 'warning'`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}","{\"title\":\"Typing Component Props\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example\"}","{\"title\":\"React with TypeScript\",\"url\":\"https://www.typescriptlang.org/docs/handbook/react.html\"}"],
      },
      {
        id: "3-2-1",
        lessonId: "3-2",
        type: "multiple-choice",
        prompt: `When should you use explicit generic types with useState?`,
        order: 1,
        xpReward: 30,
        options: ["Always","Never - TypeScript always infers correctly","When the initial state is null or the type is complex","Only for arrays"],
        correctAnswer: 2,
        explanation: `Use explicit generics with useState when the initial value is null/undefined or when working with complex types that can't be easily inferred.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"useState Hook\",\"url\":\"https://react.dev/reference/react/useState\"}","{\"title\":\"Hooks with TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-2-2",
        lessonId: "3-2",
        type: "code",
        prompt: `Create a state variable 'user' using useState that can be User (with id, name) or null, initialized to null`,
        order: 2,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

interface User {
  id: number;
  name: string;
}

function UserProfile() {
  // Define your user state here
  
  return <div>{user?.name}</div>;
}`,
        validationPatterns: ["const [user","useState<User | null>(null)"],
        hint: `Use useState<User | null>(null) for nullable state`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"useState Hook\",\"url\":\"https://react.dev/reference/react/useState\"}","{\"title\":\"Hooks with TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-2-3",
        lessonId: "3-2",
        type: "code",
        prompt: `Create a state variable 'items' for an array of strings, initialized as an empty array`,
        order: 3,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

function ItemList() {
  // Define your items state here
  
  return <div>{items.length}</div>;
}`,
        validationPatterns: ["const [items","useState<string[]>([])"],
        hint: `Use useState<string[]>([]) or let TypeScript infer from the empty array`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"useState Hook\",\"url\":\"https://react.dev/reference/react/useState\"}","{\"title\":\"Hooks with TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-3-1",
        lessonId: "3-3",
        type: "multiple-choice",
        prompt: `What is the correct type for an onChange handler on an input element?`,
        order: 1,
        xpReward: 30,
        options: ["React.ChangeEvent<HTMLInputElement>","ChangeEvent<Input>","Event<HTMLInputElement>","InputChangeEvent"],
        correctAnswer: 0,
        explanation: `React.ChangeEvent<HTMLInputElement> is the correct type for input change events, providing access to e.target.value.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Responding to Events\",\"url\":\"https://react.dev/learn/responding-to-events\"}","{\"title\":\"Event Types in TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-3-2",
        lessonId: "3-3",
        type: "code",
        prompt: `Create a handleClick function with the correct event type for a button click`,
        order: 2,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { MouseEvent } from 'react';

// Define your handleClick function here
`,
        validationPatterns: ["handleClick","MouseEvent<HTMLButtonElement>"],
        hint: `Use MouseEvent<HTMLButtonElement> for button click events`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Responding to Events\",\"url\":\"https://react.dev/learn/responding-to-events\"}","{\"title\":\"Event Types in TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-3-3",
        lessonId: "3-3",
        type: "code",
        prompt: `Create a handleSubmit function for a form with the correct event type that prevents default behavior`,
        order: 3,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { FormEvent } from 'react';

// Define your handleSubmit function here
`,
        validationPatterns: ["handleSubmit","FormEvent<HTMLFormElement>","preventDefault"],
        hint: `Use FormEvent and call e.preventDefault() to prevent form submission`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Responding to Events\",\"url\":\"https://react.dev/learn/responding-to-events\"}","{\"title\":\"Event Types in TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-4-1",
        lessonId: "3-4",
        type: "multiple-choice",
        prompt: `Can a useEffect callback function be async?`,
        order: 1,
        xpReward: 30,
        options: ["Yes, always use async directly","No, but you can create an async function inside","Yes, but only in React 18+","No, effects cannot be async at all"],
        correctAnswer: 1,
        explanation: `useEffect callbacks cannot be async directly, but you can create an async function inside the effect and call it.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"useEffect Hook\",\"url\":\"https://react.dev/reference/react/useEffect\"}","{\"title\":\"useEffect with TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-4-2",
        lessonId: "3-4",
        type: "code",
        prompt: `Add a useEffect that logs the count value whenever it changes. Include count in the dependency array`,
        order: 2,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  // Add your useEffect here
  
  return <div>{count}</div>;
}`,
        validationPatterns: ["useEffect","console.log(count)","[count]"],
        hint: `useEffect(() => { console.log(count); }, [count])`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"useEffect Hook\",\"url\":\"https://react.dev/reference/react/useEffect\"}","{\"title\":\"useEffect with TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "1-3-1",
        lessonId: "1-3",
        type: "multiple-choice",
        prompt: `How do you type an array of User objects in TypeScript?`,
        order: 1,
        xpReward: 10,
        options: ["User[]","Array<User>","Both User[] and Array<User>","[User]"],
        correctAnswer: 2,
        explanation: `Both \`User[]\` and \`Array<User>\` are valid syntax for typing arrays in TypeScript. User[] is more common and concise.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: null,
      },
      {
        id: "3-4-3",
        lessonId: "3-4",
        type: "code",
        prompt: `Create a useEffect that adds a window resize listener and returns a cleanup function to remove it`,
        order: 3,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useEffect } from 'react';

function WindowSize() {
  // Add your useEffect here
  
  return <div>Resize the window</div>;
}`,
        validationPatterns: ["useEffect","addEventListener(\"resize\")||addEventListener('resize')","removeEventListener","return () =>"],
        hint: `Return a cleanup function that removes the event listener`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"useEffect Hook\",\"url\":\"https://react.dev/reference/react/useEffect\"}","{\"title\":\"useEffect with TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "4-1-1",
        lessonId: "4-1",
        type: "multiple-choice",
        prompt: `What is the purpose of generic components in React?`,
        order: 1,
        xpReward: 30,
        options: ["To make components load faster","To create reusable components that work with any data type","To style components generically","To make components compatible with older browsers"],
        correctAnswer: 1,
        explanation: `Generic components allow you to create highly reusable components that maintain type safety while working with any data type.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generic Components\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#generic-components\"}","{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Advanced Patterns\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase\"}"],
      },
      {
        id: "4-1-2",
        lessonId: "4-1",
        type: "code",
        prompt: `Create a generic ListProps interface with items: T[] and renderItem: (item: T) => ReactNode`,
        order: 2,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { ReactNode } from 'react';

// Define your ListProps interface here
`,
        validationPatterns: ["interface ListProps<T>","items: T[]","renderItem: (item: T) => ReactNode"],
        hint: `Add <T> after the interface name to make it generic`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generic Components\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#generic-components\"}","{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Advanced Patterns\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase\"}"],
      },
      {
        id: "4-1-3",
        lessonId: "4-1",
        type: "code",
        prompt: `Create a generic interface TableProps where T must have an id property (use extends { id: number })`,
        order: 3,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your TableProps interface here
`,
        validationPatterns: ["interface TableProps<T extends { id: number }>","data: T[]"],
        hint: `Use <T extends { id: number }> to constrain the generic type`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generic Components\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#generic-components\"}","{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Advanced Patterns\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase\"}"],
      },
      {
        id: "4-2-1",
        lessonId: "4-2",
        type: "multiple-choice",
        prompt: `What should a custom hook return?`,
        order: 1,
        xpReward: 30,
        options: ["Always an array","Always an object","Any value - array, object, primitive, etc.","Only React components"],
        correctAnswer: 2,
        explanation: `Custom hooks can return any value - arrays, objects, primitives, or nothing at all, depending on your needs.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Custom Hooks\",\"url\":\"https://react.dev/learn/reusing-logic-with-custom-hooks\"}","{\"title\":\"Typing Custom Hooks\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#custom-hooks\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "4-2-2",
        lessonId: "4-2",
        type: "code",
        prompt: `Create a custom hook useCounter that returns [count: number, increment: () => void, decrement: () => void]`,
        order: 2,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

// Define your useCounter hook here
`,
        validationPatterns: ["function useCounter","const [count, setCount] = useState(0)","return [count","increment","decrement"],
        hint: `Use useState(0) and create increment/decrement functions`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Custom Hooks\",\"url\":\"https://react.dev/learn/reusing-logic-with-custom-hooks\"}","{\"title\":\"Typing Custom Hooks\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#custom-hooks\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "4-2-3",
        lessonId: "4-2",
        type: "code",
        prompt: `Create a generic custom hook useArray<T> that returns [items: T[], addItem: (item: T) => void]`,
        order: 3,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

// Define your useArray hook here
`,
        validationPatterns: ["function useArray","<T>","useState<T[]>([])","addItem","(item: T)","return [items"],
        hint: `Make the function generic with <T> and use T[] for the state type`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Custom Hooks\",\"url\":\"https://react.dev/learn/reusing-logic-with-custom-hooks\"}","{\"title\":\"Typing Custom Hooks\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#custom-hooks\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "4-3-1",
        lessonId: "4-3",
        type: "multiple-choice",
        prompt: `Why should you create a custom hook to access Context instead of using useContext directly?`,
        order: 1,
        xpReward: 30,
        options: ["It's faster","To throw an error if used outside the Provider","It's required by React","To make the code shorter"],
        correctAnswer: 1,
        explanation: `A custom hook can check if the context is undefined and throw a helpful error if the hook is used outside its Provider.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Context with TypeScript\",\"url\":\"https://react.dev/learn/typescript#typing-usecontext\"}","{\"title\":\"Context API\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context\"}","{\"title\":\"useContext Hook\",\"url\":\"https://react.dev/reference/react/useContext\"}"],
      },
      {
        id: "4-3-2",
        lessonId: "4-3",
        type: "code",
        prompt: `Create a ThemeContext with createContext<ThemeContextType | undefined>(undefined)`,
        order: 2,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { createContext } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

// Create your context here
`,
        validationPatterns: ["createContext<ThemeContextType | undefined>(undefined)"],
        hint: `Use createContext with a union type and initialize with undefined`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Context with TypeScript\",\"url\":\"https://react.dev/learn/typescript#typing-usecontext\"}","{\"title\":\"Context API\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context\"}","{\"title\":\"useContext Hook\",\"url\":\"https://react.dev/reference/react/useContext\"}"],
      },
      {
        id: "4-3-3",
        lessonId: "4-3",
        type: "code",
        prompt: `Create a custom hook useTheme that throws an error if context is undefined`,
        order: 3,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useContext } from 'react';

// Assume ThemeContext is already defined
// Create your useTheme hook here
`,
        validationPatterns: ["function useTheme","useContext(ThemeContext)","const context = useContext||const themeContext = useContext||const theme = useContext","if (!context)||if (!themeContext)||if (!theme","throw new Error"],
        hint: `Check if context === undefined and throw new Error with a helpful message`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Context with TypeScript\",\"url\":\"https://react.dev/learn/typescript#typing-usecontext\"}","{\"title\":\"Context API\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context\"}","{\"title\":\"useContext Hook\",\"url\":\"https://react.dev/reference/react/useContext\"}"],
      },
      {
        id: "4-4-1",
        lessonId: "4-4",
        type: "multiple-choice",
        prompt: `What does the Partial<T> utility type do?`,
        order: 1,
        xpReward: 30,
        options: ["Makes all properties required","Makes all properties optional","Removes all properties","Picks specific properties"],
        correctAnswer: 1,
        explanation: `Partial<T> creates a new type with all properties of T made optional, useful for partial updates.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Utility Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html\"}","{\"title\":\"Partial\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype\"}","{\"title\":\"Pick\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys\"}","{\"title\":\"Omit\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys\"}"],
      },
      {
        id: "4-4-2",
        lessonId: "4-4",
        type: "code",
        prompt: `Create a type UserPreview that picks only 'id' and 'name' from the User interface using Pick`,
        order: 2,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Create your UserPreview type here
`,
        validationPatterns: ["type UserPreview =","Pick<User","'id' | 'name'||\"id\" | \"name\""],
        hint: `Use Pick<User, 'id' | 'name'> to select specific properties`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Utility Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html\"}","{\"title\":\"Partial\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype\"}","{\"title\":\"Pick\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys\"}","{\"title\":\"Omit\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys\"}"],
      },
      {
        id: "4-4-3",
        lessonId: "4-4",
        type: "code",
        prompt: `Create a type UserWithoutEmail that omits 'email' from User using Omit`,
        order: 3,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `interface User {
  id: number;
  name: string;
  email: string;
}

// Create your UserWithoutEmail type here
`,
        validationPatterns: ["type UserWithoutEmail =","Omit<User","'email'||\"email\""],
        hint: `Use Omit<User, 'email'> to exclude specific properties`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Utility Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html\"}","{\"title\":\"Partial\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype\"}","{\"title\":\"Pick\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys\"}","{\"title\":\"Omit\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys\"}"],
      },
      {
        id: "1-3-2",
        lessonId: "1-3",
        type: "code",
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
        order: 2,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your Product interface and products array here
`,
        validationPatterns: ["interface product","id: number","name: string","price: number","products: product[]"],
        hint: null,
        sampleSolution: `interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [];`,
        documentationLinks: null,
      },
      {
        id: "1-3-3",
        lessonId: "1-3",
        type: "code",
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
        order: 3,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `interface User {
  id: number;
  name: string;
}

// Create your UserListProps interface and UserList component here
`,
        validationPatterns: ["interface userlistprops","users: user[]","function userlist",": userlistprops",".map("],
        hint: null,
        sampleSolution: `interface User {
  id: number;
  name: string;
}

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
}`,
        documentationLinks: null,
      },
      {
        id: "1-3-4",
        lessonId: "1-3",
        type: "multiple-choice",
        prompt: `Why does React require a unique 'key' prop for each item in a list?`,
        order: 4,
        xpReward: 10,
        options: ["To make the code look professional","To help React identify which items have changed, been added, or removed","To prevent TypeScript errors","Keys are optional and not required"],
        correctAnswer: 1,
        explanation: `React uses keys to identify which items in a list have changed, been added, or removed. This helps React update the DOM efficiently. Always use unique, stable IDs (like database IDs) as keys!`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: null,
      },
      {
        id: "1-3-5",
        lessonId: "1-3",
        type: "code",
        prompt: `Create a \`ProductListProps\` interface and \`ProductList\` component.

The Product interface is already defined:
\`\`\`typescript
interface Product {
  id: number;
  name: string;
  price: number;
}
\`\`\`

The \`ProductListProps\` interface should have:
- A \`products\` property of type \`Product[]\`

The \`ProductList\` component should:
- Accept props typed with \`ProductListProps\`
- Return a \`<div>\` containing mapped products
- Each product should render as a \`<div>\` with \`key={product.id}\`
- Display the product name in an \`<h3>\` and price in a \`<p>\`

Example:
\`\`\`typescript
interface ProductListProps {
  products: Product[];
}

function ProductList({ products }: ProductListProps) {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Price: \${product.price}</p>
        </div>
      ))}
    </div>
  );
}
\`\`\``,
        order: 5,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `interface Product {
  id: number;
  name: string;
  price: number;
}

// Create your ProductListProps interface and ProductList component here
`,
        validationPatterns: ["interface productlistprops","products: product[]","function productlist",": productlistprops",".map("],
        hint: null,
        sampleSolution: `interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductListProps {
  products: Product[];
}

function ProductList({ products }: ProductListProps) {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Price: \${product.price}</p>
        </div>
      ))}
    </div>
  );
}`,
        documentationLinks: null,
      },
      {
        id: "1-3-6",
        lessonId: "1-3",
        type: "code",
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
        order: 6,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Create your TodoListProps interface and TodoList component here
`,
        validationPatterns: ["interface todolistprops","todos: todo[]","function todolist",": todolistprops",".map("],
        hint: null,
        sampleSolution: `interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

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
}`,
        documentationLinks: null,
      },
      {
        id: "2-1-4",
        lessonId: "2-1",
        type: "multiple-choice",
        prompt: `What is the return type of a function that does not explicitly return anything?`,
        order: 4,
        xpReward: 30,
        options: ["undefined","null","void","any"],
        correctAnswer: 2,
        explanation: `Functions that do not return a value are typically typed as returning void.`,
        starterCode: null,
        validationPatterns: [],
        hint: `Think about console.log and event handlers that just perform side effects.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Functions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html\"}","{\"title\":\"Optional Parameters\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters\"}","{\"title\":\"Function Type Expressions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions\"}"],
      },
      {
        id: "2-1-5",
        lessonId: "2-1",
        type: "code",
        prompt: `Add parameter and return types to make this function accept two numbers and return a number.`,
        order: 5,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `function subtract(a, b) {
  return a - b;
}

const result = subtract(10, 3);`,
        validationPatterns: ["function subtract","a: number","b: number","): number"],
        hint: `Annotate both parameters as number and the return type as number.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Functions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html\"}","{\"title\":\"Optional Parameters\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters\"}","{\"title\":\"Function Type Expressions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions\"}"],
      },
      {
        id: "2-1-6",
        lessonId: "2-1",
        type: "code",
        prompt: `Create a function 'logMessage' that takes a message (string) and returns void.`,
        order: 6,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your logMessage function here
`,
        validationPatterns: ["function logMessage","message: string",": void"],
        hint: `Use : void as the return type when the function only performs side effects.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Functions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html\"}","{\"title\":\"Optional Parameters\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters\"}","{\"title\":\"Function Type Expressions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions\"}"],
      },
      {
        id: "2-2-4",
        lessonId: "2-2",
        type: "multiple-choice",
        prompt: `How do you type a callback that receives a boolean and returns nothing?`,
        order: 4,
        xpReward: 30,
        options: ["(flag: boolean) => void","boolean => void","(flag: boolean): boolean","() => boolean"],
        correctAnswer: 0,
        explanation: `The arrow function syntax (flag: boolean) => void describes a callback that receives a boolean and returns nothing.`,
        starterCode: null,
        validationPatterns: [],
        hint: `Remember parameter list in parentheses, type annotation, then => return type.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Call Signatures\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures\"}","{\"title\":\"Function Type Expressions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions\"}","{\"title\":\"Object Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/objects.html\"}"],
      },
      {
        id: "2-2-5",
        lessonId: "2-2",
        type: "code",
        prompt: `Add a function property 'onValidate' to FormProps that takes a boolean 'isValid' and returns void.`,
        order: 5,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `interface FormProps {
  onSubmit: () => void;
  // Add onValidate here
}
`,
        validationPatterns: ["interface FormProps","onValidate: (isValid: boolean) => void"],
        hint: `Follow the pattern: name: (paramName: type) => returnType.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Call Signatures\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures\"}","{\"title\":\"Function Type Expressions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions\"}","{\"title\":\"Object Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/objects.html\"}"],
      },
      {
        id: "2-2-6",
        lessonId: "2-2",
        type: "code",
        prompt: `Create a type alias 'ClickHandler' for a function that takes an event label (string) and returns void.`,
        order: 6,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your ClickHandler type here
`,
        validationPatterns: ["type ClickHandler = (label: string) => void"],
        hint: `Use type Name = (param: type) => void.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Call Signatures\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures\"}","{\"title\":\"Function Type Expressions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions\"}","{\"title\":\"Object Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/objects.html\"}"],
      },
      {
        id: "2-3-4",
        lessonId: "2-3",
        type: "multiple-choice",
        prompt: `What is the main benefit of using generics in functions?`,
        order: 4,
        xpReward: 30,
        options: ["They make the code run faster","They allow functions to work with multiple types while preserving type information","They reduce bundle size","They are required for async functions"],
        correctAnswer: 1,
        explanation: `Generics allow a function to work with many types while still preserving and checking the type information.`,
        starterCode: null,
        validationPatterns: [],
        hint: `Think of identity<T>(arg: T): T as the classic example.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Generic Constraints\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints\"}","{\"title\":\"Generic Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables\"}"],
      },
      {
        id: "2-3-5",
        lessonId: "2-3",
        type: "code",
        prompt: `Create a generic interface 'ApiResponse<T>' with data: T | null and error: string | null.`,
        order: 5,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your ApiResponse interface here
`,
        validationPatterns: ["interface ApiResponse<T>","data: T | null","error: string | null"],
        hint: `Use a generic type parameter <T> and reference it for the data field.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Generic Constraints\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints\"}","{\"title\":\"Generic Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables\"}"],
      },
      {
        id: "2-3-6",
        lessonId: "2-3",
        type: "code",
        prompt: `Create a generic function 'wrapInArray' that takes a value of type T and returns an array of T.`,
        order: 6,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your wrapInArray function here
`,
        validationPatterns: ["function wrapInArray","<T>","(value: T)",": T[]","return [value"],
        hint: `Return [value] and annotate the return type as T[].`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Generic Constraints\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints\"}","{\"title\":\"Generic Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html#working-with-generic-type-variables\"}"],
      },
      {
        id: "2-4-4",
        lessonId: "2-4",
        type: "multiple-choice",
        prompt: `How do you type a Promise that resolves to an array of numbers?`,
        order: 4,
        xpReward: 30,
        options: ["Promise<number[]>","Promise<Array<number>>","Both A and B","Promise<number>"],
        correctAnswer: 2,
        explanation: `Both Promise<number[]> and Promise<Array<number>> are valid and equivalent ways to type a promise that resolves to an array of numbers.`,
        starterCode: null,
        validationPatterns: [],
        hint: `Array<T> and T[] are interchangeable for arrays.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Array Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays\"}","{\"title\":\"Async Functions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait-support-in-es6-targets-node-v4\"}"],
      },
      {
        id: "2-4-5",
        lessonId: "2-4",
        type: "code",
        prompt: `Create a generic function 'mapArray' that takes an array of T and a mapper (value: T) => U and returns U[].`,
        order: 5,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your mapArray function here
`,
        validationPatterns: ["function mapArray","<T, U>","(items: T[])","(value: T) => U",": U[]"],
        hint: `Use two generic parameters <T, U> and return an array of U.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Array Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays\"}","{\"title\":\"Async Functions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait-support-in-es6-targets-node-v4\"}"],
      },
      {
        id: "2-4-6",
        lessonId: "2-4",
        type: "code",
        prompt: `Create an async function 'fetchItems' that returns Promise<string[]> and simulate the result with Promise.resolve.`,
        order: 6,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your fetchItems function here
`,
        validationPatterns: ["async function fetchItems",": Promise<string[]>","Promise.resolve"],
        hint: `Annotate the return type as Promise<string[]> and return Promise.resolve([...]).`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Array Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays\"}","{\"title\":\"Async Functions\",\"url\":\"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait-support-in-es6-targets-node-v4\"}"],
      },
      {
        id: "3-1-4",
        lessonId: "3-1",
        type: "multiple-choice",
        prompt: `What is the recommended way to type props for a React function component?`,
        order: 4,
        xpReward: 30,
        options: ["Use any for props to avoid errors","Use an interface or type alias and annotate the function parameter","Use the React.FC type only","You don't need to type props at all"],
        correctAnswer: 1,
        explanation: `Defining an interface or type alias for props and annotating the component parameter is the most flexible and explicit approach.`,
        starterCode: null,
        validationPatterns: [],
        hint: `Think: interface Props { ... }; function Component(props: Props) { ... }`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}","{\"title\":\"Typing Component Props\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example\"}","{\"title\":\"React with TypeScript\",\"url\":\"https://www.typescriptlang.org/docs/handbook/react.html\"}"],
      },
      {
        id: "3-1-5",
        lessonId: "3-1",
        type: "code",
        prompt: `Create a React function component 'Badge' that accepts props { label: string; color?: string }.`,
        order: 5,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Define your BadgeProps and Badge component here
`,
        validationPatterns: ["interface BadgeProps","label: string","color?: string","function Badge","({ label","}: BadgeProps)"],
        hint: `Define an interface BadgeProps and annotate the component parameter with it.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}","{\"title\":\"Typing Component Props\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example\"}","{\"title\":\"React with TypeScript\",\"url\":\"https://www.typescriptlang.org/docs/handbook/react.html\"}"],
      },
      {
        id: "3-1-6",
        lessonId: "3-1",
        type: "code",
        prompt: `Create a generic prop 'items: T[]' on a List component and a 'renderItem: (item: T) => ReactNode' prop.`,
        order: 6,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { ReactNode } from 'react';

// Define your generic ListProps and List component here
`,
        validationPatterns: ["interface ListProps<T>","items: T[]","renderItem: (item: T) => ReactNode","function List<T>","({ items","}: ListProps<T>)"],
        hint: `Reuse the pattern from the lesson for generic component props.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}","{\"title\":\"Typing Component Props\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example\"}","{\"title\":\"React with TypeScript\",\"url\":\"https://www.typescriptlang.org/docs/handbook/react.html\"}"],
      },
      {
        id: "3-2-4",
        lessonId: "3-2",
        type: "multiple-choice",
        prompt: `Which is the best way to type a state that can be either a number or null?`,
        order: 4,
        xpReward: 30,
        options: ["const [value, setValue] = useState();","const [value, setValue] = useState<number>();","const [value, setValue] = useState<number | null>(null);","const [value, setValue] = useState<any>(0);"],
        correctAnswer: 2,
        explanation: `useState<number | null>(null) makes it clear the state can be a number or null and enforces correct usage.`,
        starterCode: null,
        validationPatterns: [],
        hint: `You want both null as the initial value and a strict numeric type later.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"useState Hook\",\"url\":\"https://react.dev/reference/react/useState\"}","{\"title\":\"Hooks with TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-2-5",
        lessonId: "3-2",
        type: "code",
        prompt: `Create a state variable 'loading' that is typed as boolean and initialized to false.`,
        order: 5,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

function Loader() {
  // Define your loading state here
  
  return <div>{loading ? "Loading..." : "Done"}</div>;
}`,
        validationPatterns: ["const [loading","useState<boolean>(false)"],
        hint: `Use useState<boolean>(false) or rely on inference with useState(false).`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"useState Hook\",\"url\":\"https://react.dev/reference/react/useState\"}","{\"title\":\"Hooks with TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-3-4",
        lessonId: "3-3",
        type: "multiple-choice",
        prompt: `Which event type would you use for a form submission handler?`,
        order: 4,
        xpReward: 30,
        options: ["React.FormEvent<HTMLFormElement>","React.ChangeEvent<HTMLFormElement>","React.MouseEvent<HTMLFormElement>","React.KeyboardEvent<HTMLFormElement>"],
        correctAnswer: 0,
        explanation: `Form submissions use React.FormEvent<HTMLFormElement>, which provides access to submit-related information.`,
        starterCode: null,
        validationPatterns: [],
        hint: `You already used FormEvent in one of the earlier challenges.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Responding to Events\",\"url\":\"https://react.dev/learn/responding-to-events\"}","{\"title\":\"Event Types in TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-3-5",
        lessonId: "3-3",
        type: "code",
        prompt: `Type a change handler for a select element that logs the selected value.`,
        order: 5,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { ChangeEvent } from 'react';

// Define your handleSelectChange function here
`,
        validationPatterns: ["handleSelectChange","ChangeEvent<HTMLSelectElement>","e.target.value"],
        hint: `Use ChangeEvent<HTMLSelectElement> as the event type.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Responding to Events\",\"url\":\"https://react.dev/learn/responding-to-events\"}","{\"title\":\"Event Types in TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-3-6",
        lessonId: "3-3",
        type: "code",
        prompt: `Create a keyboard event handler for an input that logs the key pressed.`,
        order: 6,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { KeyboardEvent } from 'react';

// Define your handleKeyDown function here
`,
        validationPatterns: ["handleKeyDown","KeyboardEvent<HTMLInputElement>","e.key"],
        hint: `Use KeyboardEvent<HTMLInputElement> for key events on inputs.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Responding to Events\",\"url\":\"https://react.dev/learn/responding-to-events\"}","{\"title\":\"Event Types in TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-4-4",
        lessonId: "3-4",
        type: "multiple-choice",
        prompt: `What does an empty dependency array [] mean in useEffect?`,
        order: 4,
        xpReward: 30,
        options: ["The effect never runs","The effect runs on every render","The effect runs only once after the initial render","The effect runs only when props change"],
        correctAnswer: 2,
        explanation: `An empty dependency array means the effect runs only once after the component mounts.`,
        starterCode: null,
        validationPatterns: [],
        hint: `Think: when you want 'componentDidMount'-like behavior.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"useEffect Hook\",\"url\":\"https://react.dev/reference/react/useEffect\"}","{\"title\":\"useEffect with TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-4-5",
        lessonId: "3-4",
        type: "code",
        prompt: `Create a useEffect that logs 'Mounted' once when the component mounts.`,
        order: 5,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useEffect } from 'react';

function Logger() {
  // Add your useEffect here
  
  return <div>Check the console</div>;
}`,
        validationPatterns: ["useEffect","console.log(\"Mounted\")||console.log('Mounted')","[]"],
        hint: `Use useEffect(() => { console.log("Mounted"); }, []);`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"useEffect Hook\",\"url\":\"https://react.dev/reference/react/useEffect\"}","{\"title\":\"useEffect with TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "3-4-6",
        lessonId: "3-4",
        type: "code",
        prompt: `Create a useEffect that subscribes to a mock 'subscribe()' function and cleans up with 'unsubscribe()'.`,
        order: 6,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useEffect } from 'react';

function Subscription() {
  // Assume subscribe and unsubscribe functions are available in scope
  // Add your useEffect here
  
  return <div>Subscribed</div>;
}`,
        validationPatterns: ["useEffect","subscribe()","unsubscribe()","return () =>"],
        hint: `Call subscribe() inside the effect and return a cleanup function that calls unsubscribe().`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"useEffect Hook\",\"url\":\"https://react.dev/reference/react/useEffect\"}","{\"title\":\"useEffect with TypeScript\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#useeffect\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "4-1-4",
        lessonId: "4-1",
        type: "multiple-choice",
        prompt: `How do you declare a generic React component with a type parameter T?`,
        order: 4,
        xpReward: 30,
        options: ["function List(props: T) {}","function List<T>(props: { items: T[] }) {}","function<T> List(props: { items: T[] }) {}","Generic<T> function List(props: { items: T[] }) {}"],
        correctAnswer: 1,
        explanation: `The typical pattern is function List<T>(props: { items: T[] }) { ... } with <T> after the function name.`,
        starterCode: null,
        validationPatterns: [],
        hint: `Place <T> immediately after the component name.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generic Components\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#generic-components\"}","{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Advanced Patterns\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase\"}"],
      },
      {
        id: "4-1-5",
        lessonId: "4-1",
        type: "code",
        prompt: `Create a generic BadgeList<T> component that renders items using a renderItem prop.`,
        order: 5,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { ReactNode } from 'react';

// Define your BadgeListProps and BadgeList component here
`,
        validationPatterns: ["interface BadgeListProps<T>","items: T[]","renderItem: (item: T) => ReactNode","function BadgeList<T>"],
        hint: `Mirror the List<T> pattern from earlier lessons.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generic Components\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#generic-components\"}","{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Advanced Patterns\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase\"}"],
      },
      {
        id: "4-1-6",
        lessonId: "4-1",
        type: "code",
        prompt: `Create a generic component TableRow<T extends { id: number }> that renders children for a given item.`,
        order: 6,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { ReactNode } from 'react';

// Define your TableRowProps and TableRow component here
`,
        validationPatterns: ["interface TableRowProps<T extends { id: number }>","function TableRow<T extends { id: number }>","children: (item: T) => ReactNode"],
        hint: `Constrain T with extends { id: number } just like in previous examples.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Generic Components\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#generic-components\"}","{\"title\":\"Generics\",\"url\":\"https://www.typescriptlang.org/docs/handbook/2/generics.html\"}","{\"title\":\"Advanced Patterns\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase\"}"],
      },
      {
        id: "4-2-4",
        lessonId: "4-2",
        type: "multiple-choice",
        prompt: `Which of these names follows the convention for custom hooks?`,
        order: 4,
        xpReward: 30,
        options: ["counterHook","useCounter","CounterHook","usecounter"],
        correctAnswer: 1,
        explanation: `Custom hooks should start with 'use' followed by a capitalized name segment, e.g. useCounter.`,
        starterCode: null,
        validationPatterns: [],
        hint: `React relies on the 'use' prefix to detect hooks.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Custom Hooks\",\"url\":\"https://react.dev/learn/reusing-logic-with-custom-hooks\"}","{\"title\":\"Typing Custom Hooks\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#custom-hooks\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "4-2-5",
        lessonId: "4-2",
        type: "code",
        prompt: `Create a custom hook useToggle that manages a boolean value and returns [value, toggle].`,
        order: 5,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

// Define your useToggle hook here
`,
        validationPatterns: ["function useToggle","const [value, setValue] = useState(false)","return [value","toggle"],
        hint: `Initialize with useState(false) and return the value plus a function that flips it.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Custom Hooks\",\"url\":\"https://react.dev/learn/reusing-logic-with-custom-hooks\"}","{\"title\":\"Typing Custom Hooks\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#custom-hooks\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "4-2-6",
        lessonId: "4-2",
        type: "code",
        prompt: `Create a generic hook useList<T> that returns [items: T[], add: (item: T) => void, remove: (index: number) => void].`,
        order: 6,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

// Define your useList hook here
`,
        validationPatterns: ["function useList","<T>","useState<T[]>([])","add: (item: T)","remove: (index: number)"],
        hint: `Use a generic type parameter and manage items with useState.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Custom Hooks\",\"url\":\"https://react.dev/learn/reusing-logic-with-custom-hooks\"}","{\"title\":\"Typing Custom Hooks\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks#custom-hooks\"}","{\"title\":\"React TypeScript\",\"url\":\"https://react.dev/learn/typescript\"}"],
      },
      {
        id: "4-3-4",
        lessonId: "4-3",
        type: "multiple-choice",
        prompt: `Why is it helpful to throw an error inside a custom context hook when context is undefined?`,
        order: 4,
        xpReward: 30,
        options: ["To crash the app as soon as possible","To provide a clear error when the hook is used outside its Provider","It is required by TypeScript","It improves performance"],
        correctAnswer: 1,
        explanation: `Throwing an error when context is undefined gives a clear message that the hook must be used within the appropriate Provider.`,
        starterCode: null,
        validationPatterns: [],
        hint: `Think about developer experience when someone forgets to wrap components in the Provider.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Context with TypeScript\",\"url\":\"https://react.dev/learn/typescript#typing-usecontext\"}","{\"title\":\"Context API\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context\"}","{\"title\":\"useContext Hook\",\"url\":\"https://react.dev/reference/react/useContext\"}"],
      },
      {
        id: "4-3-5",
        lessonId: "4-3",
        type: "code",
        prompt: `Create a UserContextType with user: string | null and setUser: (user: string | null) => void, then create a UserContext.`,
        order: 5,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { createContext } from 'react';

// Define your UserContextType and UserContext here
`,
        validationPatterns: ["interface UserContextType","user: string | null","setUser: (user: string | null) => void","createContext<UserContextType | undefined>(undefined)"],
        hint: `Follow the same pattern as the ThemeContext example.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Context with TypeScript\",\"url\":\"https://react.dev/learn/typescript#typing-usecontext\"}","{\"title\":\"Context API\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context\"}","{\"title\":\"useContext Hook\",\"url\":\"https://react.dev/reference/react/useContext\"}"],
      },
      {
        id: "4-3-6",
        lessonId: "4-3",
        type: "code",
        prompt: `Implement a custom hook useUser that reads UserContext and throws if it is undefined.`,
        order: 6,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useContext } from 'react';

// Assume UserContext is already defined
// Create your useUser hook here
`,
        validationPatterns: ["useContext(UserContext)","const context = useContext||const userContext = useContext||const value = useContext","if (!context)||if (!userContext)||if (!value","throw new Error"],
        hint: `Copy the guard pattern from the useTheme example and adjust names.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Context with TypeScript\",\"url\":\"https://react.dev/learn/typescript#typing-usecontext\"}","{\"title\":\"Context API\",\"url\":\"https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context\"}","{\"title\":\"useContext Hook\",\"url\":\"https://react.dev/reference/react/useContext\"}"],
      },
      {
        id: "4-4-4",
        lessonId: "4-4",
        type: "multiple-choice",
        prompt: `What does the Readonly<T> utility type do?`,
        order: 4,
        xpReward: 30,
        options: ["Makes all properties optional","Prevents properties from being reassigned","Removes all properties","Converts all properties to strings"],
        correctAnswer: 1,
        explanation: `Readonly<T> marks all properties as read-only, so they cannot be reassigned after initialization.`,
        starterCode: null,
        validationPatterns: [],
        hint: `Think of it as adding 'readonly' to every property.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Utility Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html\"}","{\"title\":\"Partial\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype\"}","{\"title\":\"Pick\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys\"}","{\"title\":\"Omit\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys\"}"],
      },
      {
        id: "4-4-5",
        lessonId: "4-4",
        type: "code",
        prompt: `Create a type ReadonlyUser from User using Readonly<User>.`,
        order: 5,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `interface User {
  id: number;
  name: string;
}

// Create your ReadonlyUser type here
`,
        validationPatterns: ["type ReadonlyUser = Readonly<User>"],
        hint: `Use Readonly<User> to create the new type.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Utility Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html\"}","{\"title\":\"Partial\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype\"}","{\"title\":\"Pick\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys\"}","{\"title\":\"Omit\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys\"}"],
      },
      {
        id: "4-4-6",
        lessonId: "4-4",
        type: "code",
        prompt: `Create a type RequiredUser that makes all properties of User required using Required<User>.`,
        order: 6,
        xpReward: 30,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `interface User {
  id?: number;
  name?: string;
  email?: string;
}

// Create your RequiredUser type here
`,
        validationPatterns: ["type RequiredUser = Required<User>"],
        hint: `Use Required<User> to remove optional modifiers from all properties.`,
        sampleSolution: null,
        documentationLinks: ["{\"title\":\"Utility Types\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html\"}","{\"title\":\"Partial\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype\"}","{\"title\":\"Pick\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys\"}","{\"title\":\"Omit\",\"url\":\"https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys\"}"],
      },
      {
        id: "1-4-1",
        lessonId: "1-4",
        type: "multiple-choice",
        prompt: `What does the useState hook return?`,
        order: 1,
        xpReward: 10,
        options: ["Just the current state value","Just the setter function","An array with [currentValue, setterFunction]","An object with state and setState properties"],
        correctAnswer: 2,
        explanation: `useState returns an array with exactly two elements: [currentValue, setterFunction]. We use array destructuring to get both: const [count, setCount] = useState(0);`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: null,
      },
      {
        id: "1-4-2",
        lessonId: "1-4",
        type: "code",
        prompt: `Create a Counter component with useState.

The component should:
- Import useState from 'react'
- Create a state variable \`count\` initialized to 0
- Return a div containing:
  - A paragraph showing the count
  - A button that increments the count when clicked

Example:
\`\`\`typescript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
\`\`\``,
        order: 2,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

// Create your Counter component here
`,
        validationPatterns: ["function counter","usestate(0)","setcount"],
        hint: null,
        sampleSolution: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}`,
        documentationLinks: null,
      },
      {
        id: "1-4-3",
        lessonId: "1-4",
        type: "code",
        prompt: `Create a Toggle component that switches between ON and OFF.

The component should:
- Use useState with a boolean initialized to false
- Return a button that toggles the state when clicked
- Display 'ON' when true, 'OFF' when false

Example:
\`\`\`typescript
import { useState } from 'react';

function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}
\`\`\``,
        order: 3,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

// Create your Toggle component here
`,
        validationPatterns: ["function toggle","usestate(false)","setison"],
        hint: null,
        sampleSolution: `import { useState } from 'react';

function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}`,
        documentationLinks: null,
      },
      {
        id: "1-4-4",
        lessonId: "1-4",
        type: "multiple-choice",
        prompt: `Given \`const [count, setCount] = useState(0);\`, what type does TypeScript infer for \`count\`?`,
        order: 4,
        xpReward: 10,
        options: ["any","unknown","number","string"],
        correctAnswer: 2,
        explanation: `TypeScript automatically infers the type from the initial value. Since we passed 0 (a number), TypeScript knows that count is of type number!`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: null,
      },
      {
        id: "1-4-5",
        lessonId: "1-4",
        type: "code",
        prompt: `Create a NameInput component that displays what the user types.

The component should:
- Use useState with a string initialized to an empty string
- Return a div containing:
  - An input element with value={name}
  - An onChange handler that updates the state
  - A paragraph that displays the name

Example:
\`\`\`typescript
import { useState } from 'react';

function NameInput() {
  const [name, setName] = useState("");

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Hello, {name}!</p>
    </div>
  );
}
\`\`\``,
        order: 5,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

// Create your NameInput component here
`,
        validationPatterns: ["function nameinput","usestate(\"\")","setname","onchange"],
        hint: null,
        sampleSolution: `import { useState } from 'react';

function NameInput() {
  const [name, setName] = useState("");

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Hello, {name}!</p>
    </div>
  );
}`,
        documentationLinks: null,
      },
      {
        id: "1-4-6",
        lessonId: "1-4",
        type: "code",
        prompt: `Create a Counter component with increment, decrement, and reset buttons.

The component should:
- Use useState with count initialized to 0
- Return a div containing:
  - A paragraph showing the count
  - A button to increment (count + 1)
  - A button to decrement (count - 1)
  - A button to reset (set to 0)

Example:
\`\`\`typescript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
\`\`\``,
        order: 6,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

// Create your Counter component here
`,
        validationPatterns: ["function counter","usestate(0)","setcount(count + 1) || setcount(count+1)","setcount(count - 1) || setcount(count-1)","setcount(0)"],
        hint: null,
        sampleSolution: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`,
        documentationLinks: null,
      },
      {
        id: "1-5-1",
        lessonId: "1-5",
        type: "multiple-choice",
        prompt: `What is the correct way to attach a click handler to a button in React?`,
        order: 1,
        xpReward: 10,
        options: ["<button onclick={handleClick}>Click</button>","<button onClick={handleClick()}>Click</button>","<button onClick={handleClick}>Click</button>","<button click={handleClick}>Click</button>"],
        correctAnswer: 2,
        explanation: `Use onClick (camelCase) and pass the function reference without calling it: onClick={handleClick}. Don't use onclick (lowercase) or call the function with ().`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: null,
      },
      {
        id: "1-5-2",
        lessonId: "1-5",
        type: "code",
        prompt: `Create an AlertButton component that shows an alert when clicked.

The component should:
- Define a handleClick function that calls alert('Button clicked!')
- Return a button with onClick={handleClick}
- Display 'Click Me' as the button text

Example:
\`\`\`typescript
function AlertButton() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return <button onClick={handleClick}>Click Me</button>;
}
\`\`\``,
        order: 2,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your AlertButton component here
`,
        validationPatterns: ["function alertbutton","handleclick","onclick"],
        hint: null,
        sampleSolution: `function AlertButton() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return <button onClick={handleClick}>Click Me</button>;
}`,
        documentationLinks: null,
      },
      {
        id: "1-5-3",
        lessonId: "1-5",
        type: "code",
        prompt: `Create a GreetButton component that takes a name prop and shows an alert.

The component interface should have:
- A name property of type string

The component should:
- Accept props typed with GreetButtonProps
- Define handleClick that shows alert with 'Hello, {name}!'
- Return a button with onClick={handleClick}

Example:
\`\`\`typescript
interface GreetButtonProps {
  name: string;
}

function GreetButton({ name }: GreetButtonProps) {
  const handleClick = () => {
    alert('Hello, ' + name + '!');
  };

  return <button onClick={handleClick}>Greet</button>;
}
\`\`\``,
        order: 3,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your GreetButtonProps and GreetButton component here
`,
        validationPatterns: ["interface greetbuttonprops","name: string","function greetbutton",": greetbuttonprops","onclick"],
        hint: null,
        sampleSolution: `interface GreetButtonProps {
  name: string;
}

function GreetButton({ name }: GreetButtonProps) {
  const handleClick = () => {
    alert('Hello, ' + name + '!');
  };

  return <button onClick={handleClick}>Greet</button>;
}`,
        documentationLinks: null,
      },
      {
        id: "1-5-4",
        lessonId: "1-5",
        type: "multiple-choice",
        prompt: `How do you type a callback prop that takes a number and returns nothing?`,
        order: 4,
        xpReward: 10,
        options: ["onDelete: number => void","onDelete: (id: number) => void","onDelete: function(id: number)","onDelete: void(number)"],
        correctAnswer: 1,
        explanation: `Callback props are typed as arrow functions: (param: Type) => void. The parentheses around the parameter are required when specifying types!`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: null,
      },
      {
        id: "1-5-5",
        lessonId: "1-5",
        type: "code",
        prompt: `Create a DeleteButton component that calls a callback when clicked.

The DeleteButtonProps interface should have:
- A productId property of type number
- An onDelete property of type (id: number) => void

The component should:
- Accept props typed with DeleteButtonProps
- Return a button that calls onDelete(productId) when clicked
- Display 'Delete' as the button text

Example:
\`\`\`typescript
interface DeleteButtonProps {
  productId: number;
  onDelete: (id: number) => void;
}

function DeleteButton({ productId, onDelete }: DeleteButtonProps) {
  return (
    <button onClick={() => onDelete(productId)}>
      Delete
    </button>
  );
}
\`\`\``,
        order: 5,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your DeleteButtonProps and DeleteButton component here
`,
        validationPatterns: ["interface deletebuttonprops","productid: number","(id: number) => void","function deletebutton",": deletebuttonprops","ondelete(productid)"],
        hint: null,
        sampleSolution: `interface DeleteButtonProps {
  productId: number;
  onDelete: (id: number) => void;
}

function DeleteButton({ productId, onDelete }: DeleteButtonProps) {
  return (
    <button onClick={() => onDelete(productId)}>
      Delete
    </button>
  );
}`,
        documentationLinks: null,
      },
      {
        id: "1-5-6",
        lessonId: "1-5",
        type: "code",
        prompt: `Create a SearchInput component with state and onChange handler.

The component should:
- Import useState from 'react'
- Use useState with query initialized to empty string
- Return an input element with:
  - value={query}
  - onChange handler that updates query with e.target.value
  - placeholder="Search..."

Example:
\`\`\`typescript
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState("");

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
\`\`\``,
        order: 6,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `import { useState } from 'react';

// Create your SearchInput component here
`,
        validationPatterns: ["function searchinput","usestate(\"\")","setquery","onchange"],
        hint: null,
        sampleSolution: `import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState("");

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}`,
        documentationLinks: null,
      },
      {
        id: "1-1-1",
        lessonId: "1-1",
        type: "multiple-choice",
        prompt: `Which of the following is NOT a basic TypeScript primitive type?`,
        order: 1,
        xpReward: 10,
        options: ["string","number","boolean","array"],
        correctAnswer: 3,
        explanation: `While arrays are a fundamental data structure, they are not a primitive type in TypeScript. The three primitive types are string, number, and boolean. Arrays are typed using the Type[] syntax (e.g., string[], number[]).`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: null,
      },
      {
        id: "1-1-2",
        lessonId: "1-1",
        type: "code",
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
        order: 2,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `let username = "Alice";
let age = 25;
let isActive = true;`,
        validationPatterns: ["username: string","age: number","isactive: boolean"],
        hint: null,
        sampleSolution: `let username: string = "Alice";
let age: number = 25;
let isActive: boolean = true;`,
        documentationLinks: null,
      },
      {
        id: "1-1-3",
        lessonId: "1-1",
        type: "code",
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
        order: 3,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your User interface here
`,
        validationPatterns: ["interface user","id: number","name: string","email: string"],
        hint: null,
        sampleSolution: `interface User {
  id: number;
  name: string;
  email: string;
}`,
        documentationLinks: null,
      },
      {
        id: "1-1-4",
        lessonId: "1-1",
        type: "multiple-choice",
        prompt: `What does the \`?\` symbol mean when used in an interface property?`,
        order: 4,
        xpReward: 10,
        options: ["The property is required","The property is optional (can be included or omitted)","The property is deprecated","The property is a question type"],
        correctAnswer: 1,
        explanation: `The \`?\` symbol makes a property optional in TypeScript. This means when creating an object that implements the interface, you can choose to include that property or leave it out. For example, \`description?: string\` means description can be a string or undefined.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: null,
      },
      {
        id: "1-1-5",
        lessonId: "1-1",
        type: "code",
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
        order: 5,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your Product interface here
`,
        validationPatterns: ["interface product","id: number","name: string","description?: string || description? : string","price: number"],
        hint: null,
        sampleSolution: `interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
}`,
        documentationLinks: null,
      },
      {
        id: "1-1-6",
        lessonId: "1-1",
        type: "multiple-choice",
        prompt: `What does the following type annotation mean: \`let id: string | number;\`?`,
        order: 6,
        xpReward: 10,
        options: ["id must be both a string AND a number","id can be either a string OR a number","id is a string that contains numbers","id is an error - invalid syntax"],
        correctAnswer: 1,
        explanation: `The pipe symbol \`|\` in TypeScript creates a union type, meaning the variable can be one type OR another. In this case, \`id\` can hold either a string value (like 'abc123') or a number value (like 456), but not both at the same time.`,
        starterCode: null,
        validationPatterns: [],
        hint: null,
        sampleSolution: null,
        documentationLinks: null,
      },
      {
        id: "1-1-7",
        lessonId: "1-1",
        type: "code",
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
        order: 7,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your Status type and currentStatus variable here
`,
        validationPatterns: ["type status","'pending' || \"pending\"","'approved' || \"approved\"","'rejected' || \"rejected\"","currentstatus: status"],
        hint: null,
        sampleSolution: `type Status = 'pending' | 'approved' | 'rejected';
let currentStatus: Status = 'pending';`,
        documentationLinks: null,
      },
      {
        id: "1-1-8",
        lessonId: "1-1",
        type: "code",
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
        order: 8,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your ID type and variables here
`,
        validationPatterns: ["type id","string | number || number | string","userid: id","productid: id"],
        hint: null,
        sampleSolution: `type ID = string | number;
let userId: ID = "user_123";
let productId: ID = 456;`,
        documentationLinks: null,
      },
      {
        id: "1-1-9",
        lessonId: "1-1",
        type: "code",
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
        order: 9,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your typed arrays here
`,
        validationPatterns: ["names: string[]","scores: number[]","flags: boolean[]"],
        hint: null,
        sampleSolution: `let names: string[] = ["Alice", "Bob", "Charlie"];
let scores: number[] = [95, 87, 92];
let flags: boolean[] = [true, false, true];`,
        documentationLinks: null,
      },
      {
        id: "1-1-10",
        lessonId: "1-1",
        type: "code",
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
        order: 10,
        xpReward: 10,
        options: [],
        correctAnswer: null,
        explanation: null,
        starterCode: `// Create your Team interface here
`,
        validationPatterns: ["interface team","name: string","members: string[]","maxsize?: number || maxsize? : number"],
        hint: null,
        sampleSolution: `interface Team {
  name: string;
  members: string[];
  maxSize?: number;
}`,
        documentationLinks: null,
      },
    ]);
    console.log("✓ Inserted 106 challenges");

    console.log("\n✅ Production seed complete!");
    console.log("Summary:");
    console.log("  - 4 levels");
    console.log("  - 17 lessons");
    console.log("  - 106 challenges");

  } catch (error) {
    console.error("❌ Error seeding production:", error);
    throw error;
  }
}

seedProduction()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed:", error);
    process.exit(1);
  });
