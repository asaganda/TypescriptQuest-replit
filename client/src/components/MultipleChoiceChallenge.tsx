import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

interface MultipleChoiceChallengeProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  onComplete?: (correct: boolean) => void;
}

export default function MultipleChoiceChallenge({
  question,
  options,
  correctAnswer,
  explanation,
  onComplete
}: MultipleChoiceChallengeProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setIsSubmitted(true);
    const isCorrect = selectedAnswer === correctAnswer;
    console.log('Answer submitted:', isCorrect ? 'Correct!' : 'Incorrect');
  };

  const handleContinue = () => {
    if (onComplete && isSubmitted && selectedAnswer !== null) {
      const isCorrect = selectedAnswer === correctAnswer;
      onComplete(isCorrect);
    }
  };

  const isCorrect = isSubmitted && selectedAnswer === correctAnswer;
  const isIncorrect = isSubmitted && selectedAnswer !== correctAnswer;

  return (
    <Card className={`${isSubmitted ? (isCorrect ? "border-chart-2" : "border-destructive") : ""}`}>
      <CardHeader>
        <CardTitle className="text-lg">Multiple Choice Challenge</CardTitle>
        <CardDescription>{question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => !isSubmitted && setSelectedAnswer(parseInt(value))}
          disabled={isSubmitted}
        >
          <div className="space-y-3">
            {options.map((option, index) => {
              const isThisCorrect = index === correctAnswer;
              const isThisSelected = index === selectedAnswer;
              
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-md border-2 transition-colors ${
                    isSubmitted && isThisCorrect
                      ? "border-chart-2 bg-chart-2/10"
                      : isSubmitted && isThisSelected && !isThisCorrect
                      ? "border-destructive bg-destructive/10"
                      : "border-border hover-elevate"
                  }`}
                  data-testid={`option-${index}`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    {option}
                  </Label>
                  {isSubmitted && isThisCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-chart-2" />
                  )}
                  {isSubmitted && isThisSelected && !isThisCorrect && (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
              );
            })}
          </div>
        </RadioGroup>

        {!isSubmitted && (
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="flex-1"
              data-testid="button-submit-answer"
            >
              Submit Answer
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              data-testid="button-hint"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        )}

        {showHint && !isSubmitted && (
          <div className="p-4 bg-muted rounded-md text-sm">
            <p className="font-medium mb-1">Hint:</p>
            <p className="text-muted-foreground">Think about the core purpose of TypeScript's type system.</p>
          </div>
        )}

        {isSubmitted && (
          <>
            <div className={`p-4 rounded-md ${isCorrect ? "bg-chart-2/10" : "bg-destructive/10"}`}>
              <div className="flex items-start gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-chart-2 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">
                    {isCorrect ? "Correct! +30 XP" : "Not quite right"}
                  </p>
                  {explanation && (
                    <p className="text-sm text-muted-foreground mt-1">{explanation}</p>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={handleContinue}
              className="w-full"
              data-testid="button-continue"
            >
              Continue
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
