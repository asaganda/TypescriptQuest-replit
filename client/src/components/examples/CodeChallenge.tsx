import CodeChallenge from '../CodeChallenge';

export default function CodeChallengeExample() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <CodeChallenge
        title="Type a Variable"
        prompt="Add type annotations to the variables below"
        starterCode={`let name = "TypeScript";\nlet count = 42;\nlet isActive = true;`}
        validationPatterns={["string", "number", "boolean"]}
        hint="Use the colon syntax to add types: let name: string = ..."
        onComplete={(correct) => console.log('Code challenge completed:', correct)}
      />
    </div>
  );
}
