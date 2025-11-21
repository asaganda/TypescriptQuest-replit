import LessonContent from '../LessonContent';

export default function LessonContentExample() {
  const content = `
    <p>TypeScript extends JavaScript by adding types to the language. Types provide a way to describe the shape of an object, providing better documentation and allowing TypeScript to validate your code.</p>
    
    <h3>Basic Types</h3>
    <p>TypeScript has several basic types you should know:</p>
    
    <pre><code class="language-typescript">let isDone: boolean = false;
let count: number = 42;
let name: string = "TypeScript";</code></pre>
    
    <p>These type annotations help catch errors at compile time rather than runtime.</p>
    
    <h3>Key Concepts</h3>
    <ul>
      <li><strong>Type Safety:</strong> Catch errors before runtime</li>
      <li><strong>Better IDE Support:</strong> Autocomplete and inline documentation</li>
      <li><strong>Code Documentation:</strong> Types serve as inline documentation</li>
    </ul>
  `;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <LessonContent
        title="Introduction to TypeScript Types"
        content={content}
        isCompleted={false}
      />
    </div>
  );
}
