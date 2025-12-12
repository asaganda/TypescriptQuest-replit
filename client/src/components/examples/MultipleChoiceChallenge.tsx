import MultipleChoiceChallenge from '../MultipleChoiceChallenge';

export default function MultipleChoiceChallengeExample() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <MultipleChoiceChallenge
        question="What is the primary benefit of using TypeScript over JavaScript?"
        options={[
          "Faster runtime performance",
          "Type safety and better tooling",
          "Smaller bundle sizes",
          "Native browser support"
        ]}
        correctAnswer={1}
        explanation="TypeScript adds static type checking, which helps catch errors at compile time and provides better IDE support with autocomplete and inline documentation."
        onComplete={(correct) => console.log('Challenge completed:', correct)}
        index={0}
        total={1}
      />
    </div>
  );
}
