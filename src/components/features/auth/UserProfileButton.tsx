import React, { useState } from 'react';
import { useFirebase } from '../../../context/FirebaseContext';
import Button from '../../core/Button';
import Dialog from '../../core/Dialog';
import { LogIn, LogOut, User, UserPlus, ShieldAlert } from 'lucide-react';
import SignInForm from './SignInForm';
import UserProfile from './UserProfile';
import RegistrationForm from './RegistrationForm';
import AdminPanel from './AdminPanel';

const UserProfileButton: React.FC = () => {
  const { user, userProfile, signOut } = useFirebase();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const isAdmin = userProfile?.isAdmin || false;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleSignInClick = () => {
    setShowSignIn(true);
  };

  const handleAdminClick = () => {
    setShowAdmin(true);
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleProfileClick}
            startIcon={<User className="w-5 h-5" />}
          >
            {userProfile?.username || 'Profile'}
          </Button>
          
          {isAdmin && (
            <Button
              variant="ghost"
              onClick={handleAdminClick}
              startIcon={<ShieldAlert className="w-5 h-5" />}
            >
              Admin
            </Button>
          )}
          
          <Button
            variant="ghost"
            onClick={handleSignOut}
            startIcon={<LogOut className="w-5 h-5" />}
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSignInClick}
            startIcon={<LogIn className="w-5 h-5" />}
          >
            Sign In
          </Button>
        </div>
      )}

      {/* Sign In Dialog */}
      <Dialog
        open={showSignIn}
        onClose={() => setShowSignIn(false)}
        title="Sign In"
        maxWidth="max-w-md"
      >
        <SignInForm 
          onSuccess={() => setShowSignIn(false)} 
        />
      </Dialog>

      {/* Profile Dialog */}
      <Dialog
        open={showProfile}
        onClose={() => setShowProfile(false)}
        title="Your Profile"
        maxWidth="max-w-md"
      >
        <UserProfile 
          onSaved={() => setShowProfile(false)}
          onCancel={() => setShowProfile(false)}
        />
      </Dialog>

      {/* Admin Panel Dialog */}
      <Dialog
        open={showAdmin}
        onClose={() => setShowAdmin(false)}
        title="Admin Panel"
        maxWidth="max-w-4xl"
      >
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
        />
      </Dialog>
    </>
  );
};

export default UserProfileButton;