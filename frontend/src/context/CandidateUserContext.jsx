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

const CandidateUserContext = createContext(null);

export function CandidateUserProvider({ children }) {
  const [profile, setProfile] = useState({
    firstName: "Alex",
    lastName: "Morgan",
    fullName: "Alex Morgan",
    email: "alex.morgan@example.com",
    avatarUrl: null,
    completionPercentage: 80,
    headline: "Senior UX Designer / Frontend Specialist",
    location: "Bengaluru, India",
    industry: { id: "ind_it", title: "Information Technology" },
    specialization: { id: "spec_dev", title: "Software Development" }
  });

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
        setProfile(prev => ({ ...prev, avatarUrl: res.avatarUrl }));
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
      setProfile(prev => ({ ...prev, avatarUrl: null }));
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
