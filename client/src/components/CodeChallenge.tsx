import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Play, HelpCircle, Eye, ChevronLeft } from "lucide-react";
import Editor from "@monaco-editor/react";
import * as ts from "typescript";
import { useToast } from "@/hooks/use-toast";
import DocumentationButton from "./DocumentationButton";
import { parseDocumentationLinks } from "@/lib/api";

interface CodeChallengeProps {
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
}

export default function CodeChallenge({
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
}: CodeChallengeProps) {
  const [code, setCode] = useState(starterCode);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [hasProgressed, setHasProgressed] = useState(false);
  const [tsErrors, setTsErrors] = useState<ts.Diagnostic[]>([]);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "vs">("vs");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const { toast } = useToast();

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

  // Reset state when moving to a new challenge
  useEffect(() => {
    setCode(starterCode);
    setIsSubmitted(false);
    setIsCorrect(false);
    setFeedback("");
    setShowHint(false);
    setHasProgressed(false);
    setTsErrors([]);
    setFailedAttempts(0);
    setShowAnswer(false);
  }, [index, starterCode]);

  const validateTypescript = () => {
    const result = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        strict: true,
      },
      reportDiagnostics: true,
    });

    const diagnostics = result.diagnostics ?? [];
    setTsErrors(diagnostics);

    return diagnostics;
  };

  const handleRun = () => {
    if (hasProgressed) return;

    toast({
      title: "Checking your code...",
      description: "Running validation",
    });

    setIsSubmitted(true);
    // First, validate with TypeScript
    const diagnostics = validateTypescript();

    if (diagnostics.length > 0) {
      const first = diagnostics[0];
      const message = ts.flattenDiagnosticMessageText(first.messageText, "\n");
      const line =
        first.file && typeof first.start === "number"
          ? first.file.getLineAndCharacterOfPosition(first.start).line + 1
          : undefined;

      setIsCorrect(false);
      setFeedback(
        `TypeScript error${
          diagnostics.length > 1 ? "s" : ""
        } found. ${line !== undefined ? `Line ${line}: ` : ""}${message}`
      );
      console.log("Code challenge has TypeScript errors");
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
    setTsErrors([]);
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
            language="typescript"
            theme={editorTheme}
            height="260px"
            value={code}
            onChange={(value) => setCode(value ?? "")}
            options={editorOptions}
          />
          <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </div>
        </div>

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

        {tsErrors.length > 0 && (
          <div className="p-4 rounded-md bg-destructive/10">
            <p className="font-semibold mb-1">TypeScript errors:</p>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              {tsErrors.map((d, i) => {
                const message = ts.flattenDiagnosticMessageText(
                  d.messageText,
                  "\n"
                );
                const line =
                  d.file && typeof d.start === "number"
                    ? d.file.getLineAndCharacterOfPosition(d.start).line + 1
                    : undefined;
                return (
                  <li key={i}>
                    {line !== undefined ? `Line ${line}: ` : ""}
                    {message}
                  </li>
                );
              })}
            </ul>
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
