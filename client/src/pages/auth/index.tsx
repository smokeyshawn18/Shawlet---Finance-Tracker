import { SignInButton, SignUpButton } from "@clerk/clerk-react";

function Auth() {
  return (
    <div className="auth-container">
      <h2>Welcome to Shawlet</h2>
      <SignInButton mode="modal">Sign In</SignInButton>
      <SignUpButton mode="modal">Sign Up</SignUpButton>
    </div>
  );
}

export default Auth;
