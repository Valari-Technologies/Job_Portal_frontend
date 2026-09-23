import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SignOutConfirmationModal from '../components/shared/auth/SignOutConfirmationModal';
import { logoutAdmin } from '../services/auth/adminAuthService';

const SignOutContext = createContext(null);

export function SignOutProvider({ children }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState(null);
  const [portalType, setPortalType] = useState('recruiter');

  const requestSignOut = useCallback((portal = 'recruiter') => {
    setPortalType(portal);
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
      logoutAdmin();

      setIsSigningOut(false);
      setIsOpen(false);

      if (portalType === 'admin' || portalType === 'superAdmin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
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
