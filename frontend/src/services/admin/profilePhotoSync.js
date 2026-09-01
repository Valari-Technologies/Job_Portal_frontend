const listeners = new Set();

export function subscribeProfilePhoto(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getProfilePhotoFromStorage(adminId = 'current-admin') {
  try {
    const key = `statejobz:admin:${adminId}:profile-photo:v1`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved)?.dataUrl || null : null;
  } catch (e) {
    console.error("Failed to read profile photo from localStorage", e);
    return null;
  }
}

export function saveProfilePhotoToStorage(dataUrl, adminId = 'current-admin') {
  try {
    const key = `statejobz:admin:${adminId}:profile-photo:v1`;
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
