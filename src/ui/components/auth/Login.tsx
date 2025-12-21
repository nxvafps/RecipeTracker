import { useState, type FormEvent } from "react";
import * as S from "./styles";

interface LoginProps {
  onLoginSuccess: (user: { id: number; username: string }) => void;
  onSwitchToRegister: () => void;
}

export default function Login({
  onLoginSuccess,
  onSwitchToRegister,
}: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await window.electronAPI.auth.login(username, password);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.AuthContainer>
      <S.AuthCard>
        <S.AuthTitle>Welcome Back</S.AuthTitle>
        <S.AuthSubtitle>Sign in to your account</S.AuthSubtitle>

        <S.Form onSubmit={handleSubmit}>
          <S.FormGroup>
            <S.Label htmlFor="username">Username</S.Label>
            <S.InputWrapper>
              <S.Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoFocus
              />
            </S.InputWrapper>
          </S.FormGroup>

          <S.FormGroup>
            <S.Label htmlFor="password">Password</S.Label>
            <S.InputWrapper>
              <S.Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                $hasButton
              />
              <S.TogglePasswordButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </S.TogglePasswordButton>
            </S.InputWrapper>
          </S.FormGroup>

          {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

          <S.Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </S.Button>
        </S.Form>

        <S.SwitchModeText>
          Don't have an account?
          <S.SwitchModeLink type="button" onClick={onSwitchToRegister}>
            Create one
          </S.SwitchModeLink>
        </S.SwitchModeText>
      </S.AuthCard>
    </S.AuthContainer>
  );
}
