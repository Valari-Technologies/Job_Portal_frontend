import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getCandidateDashboardProfile, 
  updateCandidateProfilePhoto, 
  removeCandidateProfilePhoto,
  getCandidateNotificationSummary,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../services/candidate/candidateDashboardService';
import { getCandidateOnboardingStatus } from '../services/candidate/candidateOnboardingService';
import { getInitialProfileForCurrentUser } from '../services/candidate/candidateProfileService';
import { getAuthenticatedUser, setAuthenticatedUser } from '../services/auth/adminAuthService';

const CandidateUserContext = createContext(null);

export function CandidateUserProvider({ children }) {
  const [profile, setProfile] = useState(() => getInitialProfileForCurrentUser());

  const [onboardingStatus, setOnboardingStatus] = useState({
    isCompleted: true,
    industry: null,
    specialization: null
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // Load Profile & Onboarding state
  const loadProfileAndStatus = useCallback(async () => {
    setIsLoadingProfile(true);
    try {
      const [profData, onbData] = await Promise.all([
        getCandidateDashboardProfile(),
        getCandidateOnboardingStatus()
      ]);

      if (profData) {
        setProfile(prev => ({ ...prev, ...profData }));
      }
      if (onbData) {
        setOnboardingStatus(onbData);
      }
    } catch (err) {
      console.error("Failed to load candidate profile or onboarding status:", err);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  // Load Notifications
  const loadNotifications = useCallback(async () => {
    setIsLoadingNotifications(true);
    try {
      const notifData = await getCandidateNotificationSummary();
      if (notifData) {
        setNotifications(notifData.notifications || []);
        setUnreadCount(notifData.unreadCount ?? 0);
      }
    } catch (err) {
      console.error("Failed to load candidate notifications:", err);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initData() {
      try {
        const [profData, onbData, notifData] = await Promise.all([
          getCandidateDashboardProfile(),
          getCandidateOnboardingStatus(),
          getCandidateNotificationSummary()
        ]);

        if (!isMounted) return;

        if (profData) {
          setProfile(prev => ({ ...prev, ...profData }));
        }
        if (onbData) {
          setOnboardingStatus(onbData);
        }
        if (notifData) {
          setNotifications(notifData.notifications || []);
          setUnreadCount(notifData.unreadCount ?? 0);
        }
      } catch (err) {
        console.error("Failed to load candidate data:", err);
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
          setIsLoadingNotifications(false);
        }
      }
    }

    initData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Photo Upload handler with synchronized state across headers/sidebars
  const updatePhoto = async (photoFile) => {
    try {
      const res = await updateCandidateProfilePhoto(photoFile);
      if (res && res.avatarUrl) {
        setProfile(prev => ({ 
          ...prev, 
          ...(res.profile || {}), 
          avatarUrl: res.avatarUrl 
        }));
        try {
          const authUser = getAuthenticatedUser() || {};
          const userKey = authUser?.email || authUser?.id || 'anon';
          localStorage.setItem(`tnjobz_candidate_avatar_${userKey}`, res.avatarUrl);
          localStorage.removeItem('tnjobz_candidate_avatar');
          if (authUser && typeof authUser === 'object') {
            authUser.profile_picture = res.avatarUrl;
            authUser.avatarUrl = res.avatarUrl;
            setAuthenticatedUser(authUser, 'CANDIDATE');
          }
        } catch {}
      }
      return res;
    } catch (err) {
      console.error("Failed to upload candidate avatar:", err);
      throw err;
    }
  };

  const removePhoto = async () => {
    try {
      const res = await removeCandidateProfilePhoto();
      setProfile(prev => ({ 
        ...prev, 
        ...(res?.profile || {}), 
        avatarUrl: null 
      }));
      try {
        const authUser = getAuthenticatedUser() || {};
        const userKey = authUser?.email || authUser?.id || 'anon';
        localStorage.removeItem(`tnjobz_candidate_avatar_${userKey}`);
        localStorage.removeItem('tnjobz_candidate_avatar');
        if (authUser && typeof authUser === 'object') {
          authUser.profile_picture = null;
          authUser.avatarUrl = null;
          setAuthenticatedUser(authUser, 'CANDIDATE');
        }
      } catch {}
      return res;
    } catch (err) {
      console.error("Failed to remove candidate avatar:", err);
      throw err;
    }
  };

  const markNotificationReadHandler = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllReadHandler = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  };

  const value = {
    profile,
    setProfile,
    onboardingStatus,
    notifications,
    unreadCount,
    isLoadingProfile,
    isLoadingNotifications,
    updatePhoto,
    removePhoto,
    markNotificationAsRead: markNotificationReadHandler,
    markAllNotificationsAsRead: markAllReadHandler,
    refreshProfile: loadProfileAndStatus,
    refreshNotifications: loadNotifications
  };

  return (
    <CandidateUserContext.Provider value={value}>
      {children}
    </CandidateUserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCandidateUser() {
  const ctx = useContext(CandidateUserContext);
  if (!ctx) {
    throw new Error("useCandidateUser must be used within a CandidateUserProvider");
  }
  return ctx;
}
