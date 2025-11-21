import { useState } from "react";
import { useRoute } from "wouter";
import LessonContent from "@/components/LessonContent";
import LessonList from "@/components/LessonList";
import MultipleChoiceChallenge from "@/components/MultipleChoiceChallenge";
import CodeChallenge from "@/components/CodeChallenge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function LessonDetail() {
  const [, params] = useRoute("/level/:levelId/lesson/:lessonId");
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  const lessons = [
    {
      id: "1",
      title: "Introduction to Types",
      description: "Learn about basic TypeScript types",
      isCompleted: true,
      isLocked: false,
      challengeCount: 3
    },
    {
      id: "2",
      title: "Interfaces & Type Aliases",
      description: "Define custom types and interfaces",
      isCompleted: false,
      isLocked: false,
      challengeCount: 4
    },
    {
      id: "3",
      title: "Union & Intersection Types",
      description: "Combine types in powerful ways",
      isCompleted: false,
      isLocked: true,
      challengeCount: 2
    }
  ];

  const lessonContent = `
    <p>TypeScript extends JavaScript by adding types to the language. Types provide a way to describe the shape of an object, providing better documentation and allowing TypeScript to validate your code.</p>
    
    <h3>Basic Types</h3>
    <p>TypeScript has several basic types you should know:</p>
    
    <pre class="bg-muted p-4 rounded-md overflow-x-auto"><code class="language-typescript">let isDone: boolean = false;
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
  `;

  const challenges = [
    {
      type: "multiple-choice" as const,
      data: {
        question: "What is the primary benefit of using TypeScript over JavaScript?",
        options: [
          "Faster runtime performance",
          "Type safety and better tooling",
          "Smaller bundle sizes",
          "Native browser support"
        ],
        correctAnswer: 1,
        explanation: "TypeScript adds static type checking, which helps catch errors at compile time and provides better IDE support."
      }
    },
    {
      type: "code" as const,
      data: {
        title: "Type Your Variables",
        prompt: "Add type annotations to all three variables",
        starterCode: `let username = "Alex";\nlet age = 25;\nlet isPremium = true;`,
        validationPatterns: ["string", "number", "boolean"],
        hint: "Use the colon syntax: let name: type = value"
      }
    }
  ];

  const currentChallenge = challenges[currentChallengeIndex];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <Link href="/levels">
          <a>
            <Button variant="ghost" className="mb-6 gap-2" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              Back to Levels
            </Button>
          </a>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <LessonList
              lessons={lessons}
              onLessonClick={(id) => console.log('Lesson clicked:', id)}
              currentLessonId={params?.lessonId || "2"}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <LessonContent
              title="Interfaces & Type Aliases"
              content={lessonContent}
              isCompleted={false}
            />

            <div className="space-y-6">
              {currentChallenge.type === "multiple-choice" ? (
                <MultipleChoiceChallenge
                  {...currentChallenge.data}
                  onComplete={(correct) => {
                    console.log('Challenge completed:', correct);
                    if (currentChallengeIndex < challenges.length - 1) {
                      setTimeout(() => {
                        setCurrentChallengeIndex(currentChallengeIndex + 1);
                      }, 2000);
                    }
                  }}
                />
              ) : (
                <CodeChallenge
                  {...currentChallenge.data}
                  onComplete={(correct) => {
                    console.log('Code challenge completed:', correct);
                  }}
                />
              )}

              {currentChallengeIndex < challenges.length - 1 && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentChallengeIndex(currentChallengeIndex + 1)}
                    className="gap-2"
                    data-testid="button-next-challenge"
                  >
                    Next Challenge
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
