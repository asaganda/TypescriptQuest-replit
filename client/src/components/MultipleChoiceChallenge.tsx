import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, HelpCircle, ChevronLeft } from "lucide-react";
import DocumentationButton from "./DocumentationButton";
import { parseDocumentationLinks } from "@/lib/api";

interface MultipleChoiceChallengeProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  onComplete?: (correct: boolean) => void;
  index: number;
  total: number;
  documentationLinks?: string[] | null;
  onNavigatePrevious?: () => void;
  canNavigatePrevious: boolean;
}

export default function MultipleChoiceChallenge({
  question,
  options,
  correctAnswer,
  explanation,
  onComplete,
  index,
  total,
  documentationLinks,
  onNavigatePrevious,
  canNavigatePrevious,
}: MultipleChoiceChallengeProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hasProgressed, setHasProgressed] = useState(false);

  const parsedDocLinks = parseDocumentationLinks(documentationLinks);

  // Reset state when moving to a new challenge
  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setShowHint(false);
    setHasProgressed(false);
  }, [index]);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setIsSubmitted(true);
    const isCorrect = selectedAnswer === correctAnswer;
    console.log('Answer submitted:', isCorrect ? 'Correct!' : 'Incorrect');
  };

  const handleContinue = () => {
    if (onComplete && isSubmitted && selectedAnswer !== null && !hasProgressed) {
      setHasProgressed(true);
      const isCorrect = selectedAnswer === correctAnswer;
      onComplete(isCorrect);

      // Safety timeout: reset if stuck for more than 10 seconds
      setTimeout(() => {
        setHasProgressed(false);
      }, 10000);
    }
  };

  const isCorrect = isSubmitted && selectedAnswer === correctAnswer;
  const isIncorrect = isSubmitted && selectedAnswer !== correctAnswer;

  return (
    <Card className={`${isSubmitted ? (isCorrect ? "border-chart-2" : "border-destructive") : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">
              Multiple Choice Challenge{" "}
              <span className="text-sm text-muted-foreground">
                (Challenge {index + 1} of {total})
              </span>
            </CardTitle>
            <CardDescription>{question}</CardDescription>
          </div>
          <DocumentationButton links={parsedDocLinks} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showHint && (
          <div className="p-4 bg-muted rounded-md text-sm">
            <p className="font-medium mb-1">Hint:</p>
            <p className="text-muted-foreground">
              Think about the core purpose of TypeScript&apos;s type system.
            </p>
          </div>
        )}

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

        {!isSubmitted ? (
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

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full order-1 sm:order-2"
              data-testid="button-submit-answer"
            >
              Submit Answer
            </Button>

            {/* Hint Button */}
            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              aria-label="Show hint"
              className="w-full sm:w-auto order-2 sm:order-3"
              data-testid="button-hint"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Show Hint
            </Button>
          </div>
        ) : (
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

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                className="w-full order-1 sm:order-2"
                disabled={hasProgressed}
                data-testid="button-continue"
              >
                {hasProgressed ? "Continuing..." : "Continue"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
