import React, { useState, useEffect } from 'react';
import { useFirebase } from '../../../context/FirebaseContext';
import Typography from '../../core/Typography';
import Input from '../../core/Input';
import Button from '../../core/Button';
import Card from '../../core/Card';
import { LogIn, AlertCircle, UserPlus, Check, X, Loader2 } from 'lucide-react';

interface RegistrationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onSignInClick?: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onSuccess, 
  onCancel,
  onSignInClick 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isEmailAllowedToRegister, setIsEmailAllowedToRegister] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signUp, validateUsername, isEmailAllowed } = useFirebase();

  // Check if email is allowed to register with debounce
  useEffect(() => {
    if (!email || !email.includes('@')) {
      setIsEmailAllowedToRegister(null);
      return;
    }

    const checkEmailAllowed = async () => {
      setCheckingEmail(true);
      try {
        const allowed = await isEmailAllowed(email);
        setIsEmailAllowedToRegister(allowed);
      } catch (err) {
        console.error('Error checking email permission:', err);
        setIsEmailAllowedToRegister(false);
      } finally {
        setCheckingEmail(false);
      }
    };

    const timer = setTimeout(() => {
      checkEmailAllowed();
    }, 500);

    return () => clearTimeout(timer);
  }, [email, isEmailAllowed]);

  // Username validation with debounce
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameValid(false);
      setUsernameAvailable(null);
      setUsernameError(username ? 'Username must be at least 3 characters' : null);
      return;
    }

    const checkUsername = async () => {
      setCheckingUsername(true);
      try {
        const result = await validateUsername(username);
        setUsernameValid(result.isValid);
        setUsernameAvailable(result.isAvailable);
        setUsernameError(result.error || null);
      } catch (err) {
        setUsernameError('Error checking username');
        setUsernameValid(false);
        setUsernameAvailable(false);
      } finally {
        setCheckingUsername(false);
      }
    };

    // Debounce username validation
    const timer = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(timer);
  }, [username, validateUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email is allowed
    if (!isEmailAllowedToRegister) {
      setError("This email is not authorized to create an account. Please contact your administrator.");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Validate username is valid and available
    if (!usernameValid || !usernameAvailable) {
      setError("Please choose a valid and available username");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, username);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <Card.Header title="Create Account" />
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              label="Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              error={isEmailAllowedToRegister === false ? "This email is not authorized to register" : undefined}
              successMessage={isEmailAllowedToRegister === true ? "Email authorized" : undefined}
              endIcon={
                checkingEmail ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : email && isEmailAllowedToRegister === true ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : email && isEmailAllowedToRegister === false ? (
                  <X className="w-4 h-4 text-red-500" />
                ) : null
              }
            />
          </div>

          <div className="relative">
            <Input
              label="Username *"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              helperText="3-20 characters, letters, numbers, underscores, and hyphens only"
              error={usernameError || undefined}
              successMessage={usernameValid && usernameAvailable ? "Username available" : undefined}
              endIcon={
                checkingUsername ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : username && usernameValid && usernameAvailable ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : username && (usernameValid === false || usernameAvailable === false) ? (
                  <X className="w-4 h-4 text-red-500" />
                ) : null
              }
            />
          </div>

          <Input
            label="Password *"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            label="Confirm Password *"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            error={password !== confirmPassword && confirmPassword.length > 0 ? "Passwords don't match" : undefined}
          />

          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <Typography color="error">{error}</Typography>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={
                loading || 
                !isEmailAllowedToRegister || 
                !usernameValid || 
                !usernameAvailable || 
                password !== confirmPassword
              }
              className="w-full"
              startIcon={<UserPlus />}
              isLoading={loading}
            >
              Create Account
            </Button>
            
            <div className="flex justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              
              <Button
                type="button"
                variant="link"
                onClick={onSignInClick}
                disabled={loading}
                startIcon={<LogIn />}
              >
                Sign In Instead
              </Button>
            </div>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default RegistrationForm;