import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SignOutConfirmationModal from '../components/shared/auth/SignOutConfirmationModal';
import { clearAllAuthTokens, clearRoleAuthTokens } from '../services/auth/adminAuthService';

const SignOutContext = createContext(null);

export function SignOutProvider({ children }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState(null);
  const [portalType, setPortalType] = useState('recruiter');

  const requestSignOut = useCallback((portal = 'recruiter') => {
    const targetPortal = typeof portal === 'string' ? portal : 'recruiter';
    setPortalType(targetPortal);
    setError(null);
    setIsOpen(true);
  }, []);

  const cancelSignOut = useCallback(() => {
    if (!isSigningOut) {
      setIsOpen(false);
      setError(null);
    }
  }, [isSigningOut]);

  const confirmSignOut = useCallback(async () => {
    setIsSigningOut(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (portalType === 'candidate') {
        clearRoleAuthTokens('CANDIDATE');
        navigate('/login', { replace: true, state: { role: 'candidate' } });
      } else if (portalType === 'recruiter') {
        clearRoleAuthTokens('HR');
        navigate('/login', { replace: true, state: { role: 'hr' } });
      } else if (portalType === 'admin' || portalType === 'superAdmin') {
        clearRoleAuthTokens('SUPER_ADMIN');
        clearRoleAuthTokens('ADMIN');
        navigate('/admin', { replace: true });
      } else {
        clearAllAuthTokens();
        navigate('/login', { replace: true });
      }

      setIsSigningOut(false);
      setIsOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Unable to sign out. Please try again.");
      setIsSigningOut(false);
    }
  }, [navigate, portalType]);

  return (
    <SignOutContext.Provider value={{ requestSignOut, cancelSignOut, confirmSignOut, isOpen, isSigningOut }}>
      {children}
      <SignOutConfirmationModal
        isOpen={isOpen}
        onClose={cancelSignOut}
        onConfirm={confirmSignOut}
        isSigningOut={isSigningOut}
        error={error}
      />
    </SignOutContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSignOut() {
  const ctx = useContext(SignOutContext);
  if (!ctx) {
    throw new Error("useSignOut must be used within a SignOutProvider");
  }
  return ctx;
}
