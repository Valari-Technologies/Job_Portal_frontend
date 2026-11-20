import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentRecruiterProfile, updateCurrentRecruiterProfile, uploadRecruiterProfilePhoto, removeRecruiterProfilePhoto, buildProfileFromData } from '../services/recruiter/recruiterProfileService';
import { getRecruiterNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/recruiter/recruiterNotificationsService';
import { getAuthenticatedUser } from '../services/auth/adminAuthService';

const RecruiterUserContext = createContext(null);

const defaultFallbackContext = {
  profile: {
    identity: {
      fullName: "",
      email: "",
      mobileNumber: "",
      mobileVerified: false,
      role: "RECRUITER",
      accountStatus: null,
      lastLoginAt: null
    },
    recruiterProfile: {
      profilePhotoUrl: null,
      designation: "",
      department: ""
    },
    companySummary: null
  },
  notifications: [],
  unreadCount: 0,
  isLoadingNotifications: false,
  notificationError: null,
  updateProfile: async () => ({ success: false }),
  uploadPhoto: async () => ({ success: false }),
  removePhoto: async () => ({ success: false }),
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  refreshNotifications: async () => {},
  refreshProfile: async () => {}
};

export function RecruiterUserProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const user = getAuthenticatedUser();
      if (user) {
        return buildProfileFromData(user);
      }
    } catch {
      // fallback
    }
    return defaultFallbackContext.profile;
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState(null);

  // Load Initial Recruiter Profile
  const loadProfile = useCallback(async () => {
    try {
      const data = await getCurrentRecruiterProfile();
      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error("Failed to load recruiter profile:", err);
    }
  }, []);

  // Load Recruiter Notifications
  const loadNotifications = useCallback(async (params = {}) => {
    setIsLoadingNotifications(true);
    setNotificationError(null);
    try {
      const data = await getRecruiterNotifications(params);
      const items = data?.results || [];
      setNotifications(items);
      const unread = items.filter(n => !n.is_read).length;
      setUnreadCount(data?.unread_count ?? unread);
    } catch (err) {
      console.error("Failed to load recruiter notifications:", err);
      setNotificationError("Unable to load notifications. Please try again.");
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initialize = async () => {
      try {
        const profileData = await getCurrentRecruiterProfile();
        if (isMounted && profileData) {
          setProfile(profileData);
        }
        const notifData = await getRecruiterNotifications();
        if (isMounted && notifData) {
          const items = notifData.results || [];
          setNotifications(items);
          const unread = items.filter(n => !n.is_read).length;
          setUnreadCount(notifData.unread_count ?? unread);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };
    initialize();

    const handleNotifUpdate = () => {
      loadNotifications();
    };
    window.addEventListener('recruiter_notifications_updated', handleNotifUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('recruiter_notifications_updated', handleNotifUpdate);
    };
  }, []);

  // Update profile handler
  const handleUpdateProfile = async (changes) => {
    const res = await updateCurrentRecruiterProfile(changes);
    if (res.success && res.data) {
      setProfile(res.data);
    } else {
      setProfile((prev) => ({
        ...prev,
        identity: {
          ...prev.identity,
          ...(changes.fullName !== undefined && { fullName: changes.fullName }),
          ...(changes.mobileNumber !== undefined && { mobileNumber: changes.mobileNumber })
        },
        recruiterProfile: {
          ...prev.recruiterProfile,
          ...(changes.designation !== undefined && { designation: changes.designation }),
          ...(changes.department !== undefined && { department: changes.department })
        }
      }));
    }
    return res;
  };

  // Profile photo upload handler
  const handleUploadPhoto = async (fileOrBlob) => {
    const res = await uploadRecruiterProfilePhoto(fileOrBlob);
    if (res.success) {
      setProfile((prev) => ({
        ...prev,
        recruiterProfile: {
          ...prev.recruiterProfile,
          profilePhotoUrl: res.profilePhotoUrl
        },
        companySummary: {
          ...prev.companySummary,
          logo: res.profilePhotoUrl
        }
      }));
    }
    return res;
  };

  // Remove photo handler
  const handleRemovePhoto = async () => {
    const res = await removeRecruiterProfilePhoto();
    if (res.success) {
      setProfile((prev) => ({
        ...prev,
        recruiterProfile: {
          ...prev.recruiterProfile,
          profilePhotoUrl: null
        },
        companySummary: {
          ...prev.companySummary,
          logo: null
        }
      }));
    }
    return res;
  };

  // Mark single notification read
  const handleMarkAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsRead(id);
    } catch (err) {
      console.error("Failed to mark notification read:", err);
      loadNotifications();
    }
  };

  // Mark all notifications read
  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
      loadNotifications();
    }
  };

  return (
    <RecruiterUserContext.Provider
      value={{
        profile,
        notifications,
        unreadCount,
        isLoadingNotifications,
        notificationError,
        updateProfile: handleUpdateProfile,
        uploadPhoto: handleUploadPhoto,
        removePhoto: handleRemovePhoto,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        refreshNotifications: loadNotifications,
        refreshProfile: loadProfile
      }}
    >
      {children}
    </RecruiterUserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRecruiterUser() {
  const ctx = useContext(RecruiterUserContext);
  if (!ctx) {
    return defaultFallbackContext;
  }
  return ctx;
}
