import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Play, HelpCircle } from "lucide-react";

interface CodeChallengeProps {
  title: string;
  prompt: string;
  starterCode: string;
  validationPatterns: string[];
  hint?: string;
  onComplete?: (correct: boolean) => void;
}

export default function CodeChallenge({
  title,
  prompt,
  starterCode,
  validationPatterns,
  hint,
  onComplete
}: CodeChallengeProps) {
  const [code, setCode] = useState(starterCode);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [hasProgressed, setHasProgressed] = useState(false);

  const validateCode = () => {
    const allPatternsMatch = validationPatterns.every(pattern => 
      code.toLowerCase().includes(pattern.toLowerCase())
    );
    
    return allPatternsMatch;
  };

  const handleRun = () => {
    if (hasProgressed) return;
    
    setIsSubmitted(true);
    const correct = validateCode();
    setIsCorrect(correct);
    
    if (correct) {
      setFeedback("Great job! Your code meets all the requirements. +30 XP");
      console.log('Code challenge completed successfully!');
    } else {
      setFeedback("Your code doesn't quite match the requirements. Make sure you're using the correct TypeScript syntax.");
      console.log('Code challenge needs revision');
    }
  };

  const handleContinue = () => {
    if (onComplete && isSubmitted && isCorrect && !hasProgressed) {
      setHasProgressed(true);
      onComplete(true);
    }
  };

  const handleReset = () => {
    setCode(starterCode);
    setIsSubmitted(false);
    setIsCorrect(false);
    setFeedback("");
    setShowHint(false);
    setHasProgressed(false);
  };

  return (
    <Card className={`${isSubmitted ? (isCorrect ? "border-chart-2" : "border-destructive") : ""}`}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{prompt}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm min-h-[200px] resize-none"
            placeholder="Write your TypeScript code here..."
            disabled={isSubmitted && isCorrect}
            data-testid="textarea-code"
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {code.split('\n').length} lines
          </div>
        </div>

        <div className="flex gap-2">
          {isSubmitted && isCorrect ? (
            <Button 
              variant="default" 
              className="w-full" 
              onClick={handleContinue}
              disabled={hasProgressed}
              data-testid="button-continue-code"
            >
              {hasProgressed ? "Continuing..." : "Continue"}
            </Button>
          ) : (
            <>
              <Button
                onClick={handleRun}
                className="flex-1 gap-2"
                variant={isSubmitted ? "secondary" : "default"}
                data-testid="button-run-code"
              >
                <Play className="w-4 h-4" />
                {isSubmitted ? "Try Again" : "Run Code"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowHint(!showHint)}
                data-testid="button-hint-code"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
              {isSubmitted && !hasProgressed && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  data-testid="button-reset"
                >
                  Reset
                </Button>
              )}
            </>
          )}
        </div>

        {showHint && !isSubmitted && hint && (
          <div className="p-4 bg-muted rounded-md text-sm">
            <p className="font-medium mb-1">Hint:</p>
            <p className="text-muted-foreground">{hint}</p>
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
      </CardContent>
    </Card>
  );
}
