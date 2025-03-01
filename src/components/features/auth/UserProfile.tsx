import React, { useState, useEffect } from 'react';
import { useFirebase } from '../../../context/FirebaseContext';
import Typography from '../../core/Typography';
import Input from '../../core/Input';
import Button from '../../core/Button';
import Card from '../../core/Card';
import { User, Save, Edit, Check, X, Loader2, AlertCircle } from 'lucide-react';

interface UserProfileProps {
  onSaved?: () => void;
  onCancel?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onSaved, onCancel }) => {
  const { user, userProfile, changeUsername, validateUsername } = useFirebase();
  const [newUsername, setNewUsername] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (userProfile) {
      setNewUsername(userProfile.username || '');
    }
  }, [userProfile]);

  // Username validation with debounce
  useEffect(() => {
    if (!isEditingUsername || !newUsername || newUsername === userProfile?.username) {
      setUsernameValid(true);
      setUsernameAvailable(true);
      setUsernameError(null);
      return;
    }

    if (newUsername.length < 3) {
      setUsernameValid(false);
      setUsernameAvailable(null);
      setUsernameError('Username must be at least 3 characters');
      return;
    }

    const checkUsername = async () => {
      setChecking(true);
      try {
        const result = await validateUsername(newUsername);
        setUsernameValid(result.isValid);
        setUsernameAvailable(result.isAvailable ?? null);
        setUsernameError(result.error || null);
      } catch (err) {
        setUsernameError('Error checking username');
        setUsernameValid(false);
        setUsernameAvailable(false);
      } finally {
        setChecking(false);
      }
    };

    // Debounce username validation
    const timer = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(timer);
  }, [newUsername, validateUsername, isEditingUsername, userProfile?.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;

    setError(null);
    setSaveLoading(true);

    try {
      // Only update username if it changed and is valid
      if (isEditingUsername && newUsername !== userProfile.username) {
        if (!usernameValid || !usernameAvailable) {
          setError("Please choose a valid and available username");
          setSaveLoading(false);
          return;
        }
        
        await changeUsername(user.uid, newUsername);
      }
      
      // TODO: Update other profile fields like displayName when needed
      
      onSaved?.();
      setIsEditingUsername(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  if (!user || !userProfile) {
    return (
      <Card>
        <Card.Content>
          <Typography>You must be signed in to view your profile.</Typography>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <Card.Header title="User Profile" />
      <Card.Content>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Typography variant="body-sm" color="secondary">Email</Typography>
            <Typography>{user.email}</Typography>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Typography variant="body-sm" color="secondary">Username</Typography>
              {!isEditingUsername ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingUsername(true)}
                  startIcon={<Edit size={16} />}
                >
                  Change
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditingUsername(false);
                    setNewUsername(userProfile.username);
                  }}
                  startIcon={<X size={16} />}
                >
                  Cancel
                </Button>
              )}
            </div>
            
            {isEditingUsername ? (
              <div className="relative">
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  disabled={saveLoading}
                  error={usernameError || undefined}
                  successMessage={usernameValid && usernameAvailable && newUsername !== userProfile.username ? "Username available" : undefined}
                  endIcon={
                    checking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : newUsername && usernameValid && usernameAvailable ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : newUsername && (usernameValid === false || usernameAvailable === false) ? (
                      <X className="w-4 h-4 text-red-500" />
                    ) : null
                  }
                />
              </div>
            ) : (
              <Typography>{userProfile.username}</Typography>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <Typography color="error">{error}</Typography>
            </div>
          )}

          <div className="flex justify-end gap-4">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={saveLoading}
              >
                Cancel
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={saveLoading || (isEditingUsername && (!usernameValid || !usernameAvailable))}
              startIcon={<Save />}
              isLoading={saveLoading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default UserProfile;