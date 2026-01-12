import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Play, HelpCircle, Eye, ChevronLeft, ChevronRight, Terminal, ChevronDown } from "lucide-react";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import * as ts from "typescript";
import { useToast } from "@/hooks/use-toast";
import DocumentationButton from "./DocumentationButton";
import { parseDocumentationLinks, getUserAnswer, completeChallenge, type UserAnswer } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface CodeChallengeProps {
  challengeId: string;
  title: string;
  prompt: string;
  starterCode: string;
  validationPatterns: string[];
  hint?: string;
  sampleSolution?: string;
  onComplete?: (correct: boolean) => void;
  index: number;
  total: number;
  documentationLinks?: string[] | null;
  onNavigatePrevious?: () => void;
  canNavigatePrevious: boolean;
  onNavigateNext?: () => void;
  canNavigateNext: boolean;
}

export default function CodeChallenge({
  challengeId,
  title,
  prompt,
  starterCode,
  validationPatterns,
  hint,
  sampleSolution,
  onComplete,
  index,
  total,
  documentationLinks,
  onNavigatePrevious,
  canNavigatePrevious,
  onNavigateNext,
  canNavigateNext,
}: CodeChallengeProps) {
  const [code, setCode] = useState(starterCode);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [hasProgressed, setHasProgressed] = useState(false);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "vs">("vs");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [savedAnswer, setSavedAnswer] = useState<UserAnswer | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [showConsole, setShowConsole] = useState(false);
  const [monacoErrors, setMonacoErrors] = useState<editor.IMarker[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const parsedDocLinks = parseDocumentationLinks(documentationLinks);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    const updateTheme = () => {
      setEditorTheme(root.classList.contains("dark") ? "vs-dark" : "vs");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Load saved answer when challenge changes
  useEffect(() => {
    async function loadSavedAnswer() {
      try {
        const answer = await getUserAnswer(challengeId);
        if (answer && answer.answerData.code) {
          setSavedAnswer(answer);
          setCode(answer.answerData.code);
          setIsSubmitted(true);
          setIsCorrect(answer.isCorrect);
          if (answer.isCorrect) {
            setFeedback("Great job! Your code meets all the requirements. +30 XP");
          }
        } else {
          // No saved answer, use starter code
          setSavedAnswer(null);
          setCode(starterCode);
          setIsSubmitted(false);
          setIsCorrect(false);
          setFeedback("");
        }
      } catch (error) {
        console.error("Failed to load saved answer:", error);
        setSavedAnswer(null);
        setCode(starterCode);
        setIsSubmitted(false);
        setIsCorrect(false);
        setFeedback("");
      }
    }

    loadSavedAnswer();
    setShowHint(false);
    setHasProgressed(false);
    setFailedAttempts(0);
    setShowAnswer(false);
    setConsoleOutput([]);
    setExecutionError(null);
    setShowConsole(false);
  }, [challengeId, starterCode]);

  const validateTypescript = (): { hasErrors: boolean; errorMessage?: string } => {
    // Use errors captured by Monaco's onValidate callback
    if (monacoErrors.length > 0) {
      const firstError = monacoErrors[0];
      const errorMessage = `Line ${firstError.startLineNumber}: ${firstError.message}`;
      return { hasErrors: true, errorMessage };
    }
    return { hasErrors: false };
  };

  const executeCode = () => {
    setConsoleOutput([]);
    setExecutionError(null);

    try {
      // First, transpile TypeScript to JavaScript
      const result = ts.transpileModule(code, {
        compilerOptions: {
          target: ts.ScriptTarget.ESNext,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.React,
          strict: true,
        },
      });

      const jsCode = result.outputText;

      // Capture console.log output
      const logs: string[] = [];
      const originalLog = console.log;

      // Override console.log temporarily
      console.log = (...args: any[]) => {
        // Format the output similar to browser console
        const formatted = args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg, null, 2);
            } catch (e) {
              // Handle circular references
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');
        logs.push(formatted);
      };

      try {
        // Execute the transpiled JavaScript
        // Using Function instead of eval for slightly better isolation
        const executeFunc = new Function(jsCode);
        executeFunc();

        setConsoleOutput(logs);
        if (logs.length > 0) {
          setShowConsole(true);
        }
      } finally {
        // Always restore original console.log
        console.log = originalLog;
      }
    } catch (error: any) {
      setExecutionError(error.message || 'Execution error');
    }
  };

  const handleRun = () => {
    if (hasProgressed) return;

    // First, execute code to show console output
    executeCode();

    toast({
      title: "Checking your code...",
      description: "Running validation",
    });

    setIsSubmitted(true);

    // Check Monaco's type errors first (zero overhead - reusing Monaco's work)
    const validation = validateTypescript();

    if (validation.hasErrors) {
      setIsCorrect(false);
      setFeedback(`TypeScript error found. ${validation.errorMessage}`);
      console.log("Code challenge has TypeScript errors");

      // Save failed attempt
      completeChallenge(
        challengeId,
        showHint,
        { code },
        false
      ).catch(err => console.error("Failed to save answer:", err));

      return;
    }

    // If TypeScript is happy, enforce challenge-specific patterns
    const normalizedCode = code.toLowerCase();
    const matchesPattern = (pattern: string) => {
      const options = pattern
        .split("||")
        .map((option) => option.trim())
        .filter(Boolean);

      if (options.length === 0) {
        return true;
      }

      return options.some((option) => normalizedCode.includes(option.toLowerCase()));
    };

    const allPatternsMatch = validationPatterns.every((pattern) =>
      matchesPattern(pattern)
    );

    setIsCorrect(allPatternsMatch);

    if (allPatternsMatch) {
      setFeedback("Great job! Your code meets all the requirements. +30 XP");
      console.log("Code challenge completed successfully!");
      setFailedAttempts(0);
    } else {
      setFeedback(
        "Your code compiles, but it doesn't quite match the challenge requirements. Make sure you're following the prompt closely."
      );
      console.log("Code challenge needs revision");
      setFailedAttempts(prev => prev + 1);
    }

    // Save answer (whether correct or incorrect)
    completeChallenge(
      challengeId,
      showHint,
      { code },
      allPatternsMatch
    ).catch(err => console.error("Failed to save answer:", err));
  };

  const handleContinue = () => {
    if (onComplete && isSubmitted && isCorrect && !hasProgressed) {
      setHasProgressed(true);
      onComplete(true);

      // Safety timeout: reset if stuck for more than 10 seconds
      setTimeout(() => {
        setHasProgressed(false);
      }, 10000);
    }
  };

  const handleReset = () => {
    setCode(starterCode);
    setIsSubmitted(false);
    setIsCorrect(false);
    setFeedback("");
    setShowHint(false);
    setHasProgressed(false);
    setConsoleOutput([]);
    setExecutionError(null);
    setShowConsole(false);
  };

  const lineCount = code.split("\n").length;
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas",
    scrollBeyondLastLine: false,
    automaticLayout: true,
    readOnly: isSubmitted && isCorrect,
    wordWrap: "on" as const,
    padding: { top: 12, bottom: 12 },
  };

  return (
    <Card className={`${isSubmitted ? (isCorrect ? "border-chart-2" : "border-destructive") : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {title}{" "}
              <span className="text-sm text-muted-foreground">
                (Challenge {index + 1} of {total})
              </span>
            </CardTitle>
            <CardDescription>{prompt}</CardDescription>
            {savedAnswer && (
              <div className="text-xs text-muted-foreground mt-2">
                Previously submitted on {new Date(savedAnswer.submittedAt).toLocaleDateString()}
              </div>
            )}
          </div>
          <DocumentationButton links={parsedDocLinks} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showHint && hint && (
          <div className="p-4 bg-muted rounded-md text-sm">
            <p className="font-medium mb-1">Hint:</p>
            <p className="text-muted-foreground">{hint}</p>
          </div>
        )}

        {showAnswer && sampleSolution && (
          <div className="p-4 bg-blue-500/10 border-2 border-blue-500/50 rounded-md text-sm">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <p className="font-semibold text-blue-500">Sample Solution:</p>
            </div>
            <div className="bg-background/50 p-3 rounded border font-mono text-sm">
              <pre className="whitespace-pre-wrap">{sampleSolution}</pre>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              This is one correct way to solve this challenge. Try to understand why it works!
            </p>
          </div>
        )}

        <div
          className="relative border rounded-md"
          data-testid="textarea-code"
        >
          <Editor
            language="typescriptreact"
            theme={editorTheme}
            height="260px"
            value={code}
            onChange={(value) => setCode(value ?? "")}
            options={editorOptions}
            beforeMount={(monaco: Monaco) => {
              // Configure TypeScript compiler options for JSX support
              monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ESNext,
                module: monaco.languages.typescript.ModuleKind.ESNext,
                jsx: monaco.languages.typescript.JsxEmit.React,
                jsxFactory: 'React.createElement',
                reactNamespace: 'React',
                allowNonTsExtensions: true,
                allowJs: true,
                typeRoots: ["node_modules/@types"],
                strict: true,
                noImplicitAny: true,
                strictNullChecks: true,
                noUnusedLocals: false,
                noUnusedParameters: false,
              });

              monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: false,
                noSyntaxValidation: false,
              });

              // Add minimal React type definitions for JSX support
              const reactTypes = `
                declare namespace React {
                  interface ReactElement<P = any> {
                    type: any;
                    props: P;
                    key: string | null;
                  }
                  type ReactNode = ReactElement | string | number | boolean | null | undefined | ReactNode[];
                  function createElement(type: any, props?: any, ...children: any[]): ReactElement;
                  function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prev: T) => T)) => void];
                }
                declare namespace JSX {
                  interface Element extends React.ReactElement<any> {}
                  interface IntrinsicElements {
                    div: any;
                    span: any;
                    p: any;
                    h1: any;
                    h2: any;
                    h3: any;
                    h4: any;
                    h5: any;
                    h6: any;
                    button: any;
                    input: any;
                    form: any;
                    label: any;
                    ul: any;
                    ol: any;
                    li: any;
                    a: any;
                    img: any;
                    header: any;
                    footer: any;
                    main: any;
                    nav: any;
                    section: any;
                    article: any;
                    aside: any;
                    [elemName: string]: any;
                  }
                }
              `;
              monaco.languages.typescript.typescriptDefaults.addExtraLib(reactTypes, 'react.d.ts');
            }}
            onValidate={(markers) => {
              // Filter to errors only (severity 8 = MarkerSeverity.Error)
              const errors = markers.filter(m => m.severity === 8);
              setMonacoErrors(errors);
            }}
          />
          <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </div>
        </div>

        {/* Console Output Area */}
        <div className="border rounded-md bg-background/95">
          <button
            onClick={() => setShowConsole(!showConsole)}
            className="flex items-center justify-between w-full px-3 py-2 border-b bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            aria-label={showConsole ? "Hide console output" : "Show console output"}
            data-testid="button-toggle-console"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Console Output</span>
            </div>
            {showConsole ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {showConsole && (
            <div className="p-3 font-mono text-sm max-h-[120px] overflow-y-auto space-y-1">
              {consoleOutput.length > 0 ? (
                consoleOutput.map((log, idx) => (
                  <div key={idx} className="text-foreground whitespace-pre-wrap break-all">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-xs italic">
                  No output yet. Run your code to see console.log output here.
                </div>
              )}
            </div>
          )}
        </div>

        {executionError && (
          <div className="border rounded-md p-4 bg-destructive/10 border-destructive">
            <div className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-destructive">Execution Error</p>
                <pre className="text-xs font-mono mt-1 whitespace-pre-wrap">{executionError}</pre>
              </div>
            </div>
          </div>
        )}

        {isSubmitted && feedback && (
          <div className={`p-4 rounded-md ${isCorrect ? "bg-chart-2/10" : "bg-destructive/10"}`}>
            <div className="flex items-start gap-2">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-chart-2 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive mt-0.5" />
              )}
              <p className="text-sm flex-1">{feedback}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          {/* Previous Challenge Button */}
          {canNavigatePrevious && onNavigatePrevious && (
            <Button
              variant="outline"
              onClick={onNavigatePrevious}
              className="w-full sm:w-auto order-3 sm:order-1"
              data-testid="button-prev-challenge"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Prev Challenge
            </Button>
          )}

          {/* Submit/Run Code or Continue Button */}
          {isSubmitted && isCorrect ? (
            <Button
              variant="default"
              className="w-full order-1 sm:order-2"
              onClick={handleContinue}
              disabled={hasProgressed}
              data-testid="button-continue-code"
            >
              {hasProgressed ? "Continuing..." : "Continue"}
            </Button>
          ) : (
            <Button
              onClick={handleRun}
              className="w-full order-1 sm:order-2"
              variant={isSubmitted ? "secondary" : "default"}
              data-testid="button-run-code"
            >
              <Play className="w-4 h-4 mr-2" />
              {isSubmitted ? "Try Again" : "Run Code"}
            </Button>
          )}

          {/* Hint Button */}
          {hint && !showHint && (
            <Button
              variant="outline"
              onClick={() => setShowHint(true)}
              className="w-full sm:w-auto order-2 sm:order-3"
              data-testid="button-hint-code"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Show Hint
            </Button>
          )}

          {/* Next Challenge Button - Show for admin or when viewing a completed challenge */}
          {canNavigateNext && onNavigateNext && (user?.isAdmin || (savedAnswer && isSubmitted)) && (
            <Button
              variant="outline"
              onClick={onNavigateNext}
              className="w-full sm:w-auto order-4"
              data-testid="button-next-challenge"
            >
              Next Challenge
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Additional buttons on separate row */}
        {(failedAttempts >= 2 && sampleSolution && !isCorrect) || (isSubmitted && !hasProgressed) ? (
          <div className="flex gap-2">
            {failedAttempts >= 2 && sampleSolution && !isCorrect && (
              <Button
                variant="outline"
                onClick={() => setShowAnswer(!showAnswer)}
                aria-label="Show answer"
                data-testid="button-show-answer"
                className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
              >
                <Eye className="w-4 h-4" />
                <span className="ml-1 text-sm">{showAnswer ? "Hide" : "Show"} Answer</span>
              </Button>
            )}
            {isSubmitted && !hasProgressed && (
              <Button
                variant="outline"
                onClick={handleReset}
                data-testid="button-reset"
              >
                Reset
              </Button>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
