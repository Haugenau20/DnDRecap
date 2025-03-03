import React, { useState, useEffect } from 'react';
import Button from '../../core/Button';
import Typography from '../../core/Typography';
import { X, ExternalLink } from 'lucide-react';
import { INACTIVITY_TIMEOUT_TEXT, REMEMBER_ME_TEXT } from '../../../constants/time';
import { useNavigation } from '../../../hooks/useNavigation';

/**
 * Simple notification to inform users about session activity tracking
 * and other privacy-related information
 */
const PrivacyNotice: React.FC = () => {
  const [showNotice, setShowNotice] = useState(false);
  const { navigateToPage } = useNavigation();
  
  useEffect(() => {
    // Check if user has already seen the notice
    const hasSeenNotice = localStorage.getItem('privacyNoticeSeen');
    if (!hasSeenNotice) {
      setShowNotice(true);
    }
  }, []);
  
  const handleDismiss = () => {
    localStorage.setItem('privacyNoticeSeen', 'true');
    setShowNotice(false);
  };
  
  const handleViewPrivacyPolicy = () => {
    navigateToPage('/privacy');
    // Keep the notice visible until they explicitly dismiss it
  };
  
  if (!showNotice) return null;
  
  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white shadow-lg rounded-lg p-4 border border-blue-100 z-50">
      <div className="flex justify-between items-start mb-2">
        <Typography variant="h4">Privacy Notice</Typography>
        <button onClick={handleDismiss} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      
      <Typography variant="body-sm" color="secondary" className="mb-3">
        This application tracks session activity to maintain your login state and security. 
        Your session will expire after {INACTIVITY_TIMEOUT_TEXT} of inactivity, or 
        after {REMEMBER_ME_TEXT} if "Remember me" is enabled. We also store login 
        timestamps for security purposes.
      </Typography>
      
      <div className="flex justify-between">
        <Button 
          variant="link" 
          size="sm" 
          onClick={handleViewPrivacyPolicy}
          endIcon={<ExternalLink size={14} />}
        >
          Privacy Policy
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleDismiss}>
          Got it
        </Button>
      </div>
    </div>
  );
};

export default PrivacyNotice;