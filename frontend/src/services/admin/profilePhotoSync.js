import { getAuthenticatedUser } from '../auth/adminAuthService';

const listeners = new Set();

export function subscribeProfilePhoto(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function resolveUserStorageKey(adminId) {
  if (adminId && adminId !== 'current-admin') {
    return adminId;
  }
  const user = getAuthenticatedUser();
  return user?.email || (user?.id ? `id_${user.id}` : 'guest');
}

export function getProfilePhotoFromStorage(adminId) {
  try {
    const userKey = resolveUserStorageKey(adminId);
    const key = `statejobz:admin:${userKey}:profile-photo:v1`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved)?.dataUrl || null : null;
  } catch (e) {
    console.error("Failed to read profile photo from localStorage", e);
    return null;
  }
}

export function saveProfilePhotoToStorage(dataUrl, adminId) {
  try {
    const userKey = resolveUserStorageKey(adminId);
    const key = `statejobz:admin:${userKey}:profile-photo:v1`;
    if (dataUrl) {
      localStorage.setItem(key, JSON.stringify({ dataUrl, updatedAt: Date.now() }));
    } else {
      localStorage.removeItem(key);
    }
    listeners.forEach(l => l(dataUrl));
    return true;
  } catch (e) {
    console.error("Failed to save profile photo to localStorage", e);
    if (e.name === 'QuotaExceededError') {
      alert("Unable to save this photo on this device. Try a smaller image.");
    }
    return false;
  }
}
