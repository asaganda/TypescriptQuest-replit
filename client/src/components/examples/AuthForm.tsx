import AuthForm from '../AuthForm';

export default function AuthFormExample() {
  return (
    <AuthForm
      onLogin={(email, password) => console.log('Login:', email, password)}
      onSignup={(email, password, displayName) => console.log('Signup:', email, password, displayName)}
    />
  );
}
