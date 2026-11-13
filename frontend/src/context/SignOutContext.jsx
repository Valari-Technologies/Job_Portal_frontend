import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SignOutConfirmationModal from '../components/shared/auth/SignOutConfirmationModal';
import { clearAllAuthTokens, clearRoleAuthTokens, removeAuthItem } from '../services/auth/adminAuthService';

const SignOutContext = createContext(null);

export function SignOutProvider({ children }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState(null);
  const [portalType, setPortalType] = useState('recruiter');

  const requestSignOut = useCallback((portal) => {
    let targetPortal = 'recruiter';
    if (typeof portal === 'string' && portal.trim()) {
      targetPortal = portal.trim();
    } else {
      // Auto-detect portal type from URL pathname if not explicitly passed
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      if (path.startsWith('/candidate')) {
        targetPortal = 'candidate';
      } else if (path.startsWith('/super-admin') || path.startsWith('/admin')) {
        targetPortal = 'admin';
      } else {
        targetPortal = 'recruiter';
      }
    }
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
        removeAuthItem('candidate_access_token');
        removeAuthItem('candidate_refresh_token');
        removeAuthItem('candidate_auth_user');
        removeAuthItem('candidate_auth_role');
        removeAuthItem('auth_user');
        navigate('/login', { replace: true, state: { role: 'candidate' } });
      } else if (portalType === 'recruiter' || portalType === 'employer') {
        clearRoleAuthTokens('HR');
        removeAuthItem('public_access_token');
        removeAuthItem('public_refresh_token');
        removeAuthItem('public_auth_user');
        removeAuthItem('public_auth_role');
        removeAuthItem('auth_user');
        navigate('/login', { replace: true, state: { role: 'hr' } });
      } else if (portalType === 'admin' || portalType === 'superAdmin') {
        clearRoleAuthTokens('SUPER_ADMIN');
        clearRoleAuthTokens('ADMIN');
        removeAuthItem('super_admin_access_token');
        removeAuthItem('super_admin_refresh_token');
        removeAuthItem('super_admin_auth_user');
        removeAuthItem('super_admin_auth_role');
        removeAuthItem('admin_access_token');
        removeAuthItem('admin_refresh_token');
        removeAuthItem('admin_auth_user');
        removeAuthItem('admin_auth_role');
        removeAuthItem('auth_user');
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
