import React, { useState } from 'react';
import { useFirebase } from '../../../context/FirebaseContext';
import Typography from '../../core/Typography';
import Input from '../../core/Input';
import Button from '../../core/Button';
import Card from '../../core/Card';
import { LogIn, AlertCircle, UserPlus, Save } from 'lucide-react';
import RegistrationForm from './RegistrationForm';

interface SignInFormProps {
  onSuccess?: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const { signIn } = useFirebase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      // Pass the rememberMe option to signIn
      await signIn(email, password, rememberMe);
      // If we get here, sign in was successful
      onSuccess?.();
    } catch (err) {
      // Only set error if authentication actually failed
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  if (showRegistration) {
    return (
      <RegistrationForm 
        onSuccess={onSuccess}
        onCancel={() => setShowRegistration(false)}
        onSignInClick={() => setShowRegistration(false)}
      />
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <Card.Header title="Sign In" />
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Remember me for 30 days
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <Typography color="error">{error}</Typography>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              startIcon={<LogIn />}
              isLoading={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRegistration(true)}
              startIcon={<UserPlus />}
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default SignInForm;