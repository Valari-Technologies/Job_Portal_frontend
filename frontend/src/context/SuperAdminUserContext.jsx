import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getSuperAdminProfile, 
  updateSuperAdminProfile, 
  updateSuperAdminProfilePicture, 
  removeSuperAdminProfilePicture, 
  updateSuperAdminSettings 
} from '../services/superAdmin/superAdminProfileService';
import { 
  getSuperAdminNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../services/superAdmin/superAdminNotificationsService';

const SuperAdminUserContext = createContext(null);

export function SuperAdminUserProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [error, setError] = useState(null);

  // Load Profile & Notifications asynchronously on mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      setIsLoadingProfile(true);
      setIsLoadingNotifications(true);
      setError(null);

      try {
        const [profData, notifData] = await Promise.all([
          getSuperAdminProfile(),
          getSuperAdminNotifications()
        ]);
        if (isMounted) {
          setProfile(profData);
          setNotifications(notifData.results || (Array.isArray(notifData) ? notifData : []));
        }
      } catch (err) {
        console.error('Failed to load Super Admin state:', err);
        if (isMounted) {
          setError('Unable to load account data.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
          setIsLoadingNotifications(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshData = async () => {
    setIsLoadingProfile(true);
    setIsLoadingNotifications(true);
    setError(null);
    try {
      const [profData, notifData] = await Promise.all([
        getSuperAdminProfile(),
        getSuperAdminNotifications()
      ]);
      setProfile(profData);
      setNotifications(notifData.results || (Array.isArray(notifData) ? notifData : []));
    } catch (err) {
      console.error('Failed to refresh Super Admin state:', err);
      setError('Unable to load account data.');
    } finally {
      setIsLoadingProfile(false);
      setIsLoadingNotifications(false);
    }
  };

  // Profile actions
  const handleUpdateProfile = async (formData) => {
    const updated = await updateSuperAdminProfile(formData);
    setProfile(updated);
    return updated;
  };

  const handleUpdatePhoto = async (blobOrUrl) => {
    const updated = await updateSuperAdminProfilePicture(blobOrUrl);
    setProfile(updated);
    return updated;
  };

  const handleRemovePhoto = async () => {
    const updated = await removeSuperAdminProfilePicture();
    setProfile(updated);
    return updated;
  };

  const handleUpdateSettings = async (settingsData) => {
    const updated = await updateSuperAdminSettings(settingsData);
    setProfile(updated);
    return updated;
  };

  // Notification actions
  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    setNotifications(prev => (Array.isArray(prev) ? prev : []).map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(prev => (Array.isArray(prev) ? prev : []).map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const value = {
    profile,
    setProfile,
    notifications,
    setNotifications,
    unreadCount,
    isLoadingProfile,
    isLoadingNotifications,
    error,
    refreshData,
    updateProfile: handleUpdateProfile,
    updatePhoto: handleUpdatePhoto,
    removePhoto: handleRemovePhoto,
    updateSettings: handleUpdateSettings,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead
  };

  return (
    <SuperAdminUserContext.Provider value={value}>
      {children}
    </SuperAdminUserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSuperAdminUser() {
  const ctx = useContext(SuperAdminUserContext);
  if (!ctx) {
    throw new Error('useSuperAdminUser must be used within a SuperAdminUserProvider');
  }
  return ctx;
}
