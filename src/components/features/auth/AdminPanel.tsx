import React, { useState, useEffect } from 'react';
import { useFirebase } from '../../../context/FirebaseContext';
import Typography from '../../core/Typography';
import Input from '../../core/Input';
import Button from '../../core/Button';
import Card from '../../core/Card';
import { AllowedUser } from '../../../types/user';
import Dialog from '../../core/Dialog';
import { FirebaseError } from 'firebase/app';
import { 
  UserPlus, 
  X, 
  Users, 
  Check, 
  AlertCircle, 
  Clock, 
  User,
  Search,
  Trash,
  ShieldAlert
} from 'lucide-react';

interface AdminPanelProps {
  onClose?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { user, userProfile, getAllowedUsers, addAllowedUser, removeUserCompletely } = useFirebase();
  const [allowedUsers, setAllowedUsers] = useState<AllowedUser[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newUserNotes, setNewUserNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingUser, setAddingUser] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    userEmail: ''
  });

  // Check if current user is admin
  const isAdmin = userProfile?.isAdmin || false;

  // Load allowed users on mount
  useEffect(() => {
    if (!isAdmin) return;

    const loadAllowedUsers = async () => {
      setLoading(true);
      try {
        const users = await getAllowedUsers();
        setAllowedUsers(users);
      } catch (err) {
        if (err instanceof FirebaseError && err.code === 'permission-denied') {
          setError('You do not have permission to view this data');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load allowed users');
        }
      } finally {
        setLoading(false);
      }
    };

    loadAllowedUsers();
  }, [isAdmin, getAllowedUsers]);

  // Add a new allowed user
  const handleAddAllowedUser = async () => {
    if (!newEmail || !isAdmin || !user) return;

    setError(null);
    setAddingUser(true);
    try {
      await addAllowedUser(newEmail, newUserNotes);
      
      // Add to local state
      setAllowedUsers(prev => [
        ...prev,
        {
          email: newEmail.toLowerCase(),
          notes: newUserNotes,
          addedAt: new Date().toISOString(),
          addedBy: user.uid,
          hasRegistered: false
        }
      ]);
      
      // Reset form
      setNewEmail('');
      setNewUserNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add allowed user');
    } finally {
      setAddingUser(false);
    }
  };

  // Remove an allowed user
  const handleRemoveAllowedUser = (email: string) => {
    // Show confirmation dialog instead of immediately removing
    setConfirmationDialog({
      isOpen: true,
      userEmail: email
    });
  };

  const handleConfirmedRemoval = async () => {
    const email = confirmationDialog.userEmail;
    if (!isAdmin || !email) return;
  
    setError(null);
    try {
      await removeUserCompletely(email); 
      
      // Update local state
      setAllowedUsers(prev => prev.filter(user => user.email !== email));
      
      // Close dialog
      setConfirmationDialog({ isOpen: false, userEmail: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove user completely');
    }
  };

  // Filter allowed users by search query
  const filteredUsers = allowedUsers.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.notes && user.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <Card>
        <Card.Header title="Admin Panel" />
        <Card.Content className="text-center py-8">
          <ShieldAlert className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <Typography variant="h3" className="mb-2">
            Access Denied
          </Typography>
          <Typography color="secondary">
            You do not have administrative privileges.
          </Typography>
          {onClose && (
            <Button
              className="mt-4"
              onClick={onClose}
            >
              Back
            </Button>
          )}
        </Card.Content>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Header title="User Administration" />
        <Card.Content className="space-y-6">
          {/* Add new user form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Typography variant="h4" className="mb-4">
              Add New Allowed User
            </Typography>
            <div className="space-y-3">
              <Input
                label="Email *"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
              <Input
                label="Notes (optional)"
                value={newUserNotes}
                onChange={(e) => setNewUserNotes(e.target.value)}
                placeholder="Additional information about this user"
              />
              <Button
                onClick={handleAddAllowedUser}
                disabled={!newEmail || addingUser}
                startIcon={<UserPlus />}
                isLoading={addingUser}
              >
                Add User to Allowlist
              </Button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle size={16} />
              <Typography color="error">{error}</Typography>
            </div>
          )}

          {/* User list */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h4">
                Allowed Users ({filteredUsers.length})
              </Typography>
              <div className="w-64">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startIcon={<Search className="w-4 h-4 text-gray-400" />}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <Typography>Loading users...</Typography>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <Typography color="secondary">
                  {searchQuery ? 'No users match your search' : 'No allowed users found'}
                </Typography>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Added On
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((allowedUser) => (
                      <tr key={allowedUser.email}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-5 h-5 text-gray-400 mr-2" />
                            <Typography variant="body-sm">{allowedUser.email}</Typography>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {allowedUser.hasRegistered ? (
                            <div className="flex items-center text-green-600">
                              <Check className="w-4 h-4 mr-1" />
                              <Typography variant="body-sm">Registered</Typography>
                            </div>
                          ) : (
                            <div className="flex items-center text-yellow-600">
                              <Clock className="w-4 h-4 mr-1" />
                              <Typography variant="body-sm">Pending</Typography>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Typography variant="body-sm" color="secondary">
                            {new Date(allowedUser.addedAt).toLocaleDateString('en-uk', { year: 'numeric', day: '2-digit', month: '2-digit'})}
                          </Typography>
                        </td>
                        <td className="px-6 py-4">
                          <Typography variant="body-sm" color="secondary" className="truncate max-w-xs">
                            {allowedUser.notes || '-'}
                          </Typography>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAllowedUser(allowedUser.email)}
                            startIcon={<Trash className="w-4 h-4 text-red-500" />}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Close button */}
          {onClose && (
            <div className="flex justify-end mt-6">
              <Button onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </Card.Content>
      </Card>

      <Dialog
      open={confirmationDialog.isOpen}
      onClose={() => setConfirmationDialog({ isOpen: false, userEmail: '' })}
      title="Confirm User Removal"
      maxWidth="max-w-md"
      >
      <div className="space-y-4">
        <Typography>
          Are you sure you want to remove <strong>{confirmationDialog.userEmail}</strong>?
        </Typography>
        <Typography color="error">
          This will permanently delete their account and all associated data.
        </Typography>
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="ghost"
            onClick={() => setConfirmationDialog({ isOpen: false, userEmail: '' })}
            startIcon={<X size={16} />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmedRemoval}
            startIcon={<Trash size={16} />}
          >
            Delete User
          </Button>
        </div>
      </div>
      </Dialog>
    </>
  );
};

export default AdminPanel;