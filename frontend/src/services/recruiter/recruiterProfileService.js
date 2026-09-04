// Temporary frontend-only persistence.
// Replace this repository with the authenticated Django Recruiter profile API.
// The backend response must remain the single source of truth in production.

const STORAGE_KEY = 'statejobz_recruiter_profile';

const DEFAULT_PROFILE = {
  identity: {
    fullName: "Jane Doe",
    email: "jane.doe@company.com",
    mobileNumber: "+91 98765 43210",
    mobileVerified: true,
    role: "RECRUITER",
    accountStatus: "Active",
    lastLoginAt: "2026-09-03T09:30:00Z"
  },
  recruiterProfile: {
    profilePhotoUrl: null,
    designation: "Senior Talent Acquisition Manager",
    department: "Human Resources"
  },
  companySummary: {
    id: "comp_101",
    name: "State Jobz Technologies",
    verificationStatus: "Verified"
  }
};

function loadStoredProfile() {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        identity: { ...DEFAULT_PROFILE.identity, ...(parsed.identity || {}) },
        recruiterProfile: { ...DEFAULT_PROFILE.recruiterProfile, ...(parsed.recruiterProfile || {}) },
        companySummary: parsed.companySummary !== undefined ? parsed.companySummary : DEFAULT_PROFILE.companySummary
      };
    }
  } catch (err) {
    console.error("Error reading stored recruiter profile:", err);
  }
  saveStoredProfile(DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}

function saveStoredProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error("Error saving recruiter profile to localStorage:", err);
    throw err;
  }
}

// Convert image File/Blob to compressed JPEG Data URL (max 400x400)
function blobToCompressedDataUrl(blob, maxWidth = 400, maxHeight = 400, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!blob) {
      resolve(null);
      return;
    }
    if (typeof blob === 'string') {
      resolve(blob);
      return;
    }
    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = (err) => reject(err);
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(blob);
  });
}

export async function getCurrentRecruiterProfile() {
  return loadStoredProfile();
}

export async function updateCurrentRecruiterProfile(payload) {
  const current = loadStoredProfile();
  const updated = {
    ...current,
    identity: {
      ...current.identity,
      ...(payload.fullName !== undefined && { fullName: payload.fullName }),
      ...(payload.mobileNumber !== undefined && { mobileNumber: payload.mobileNumber })
    },
    recruiterProfile: {
      ...current.recruiterProfile,
      ...(payload.designation !== undefined && { designation: payload.designation }),
      ...(payload.department !== undefined && { department: payload.department })
    }
  };
  saveStoredProfile(updated);
  return {
    success: true,
    data: updated
  };
}

export async function uploadRecruiterProfilePhoto(fileOrBlob) {
  try {
    const dataUrl = await blobToCompressedDataUrl(fileOrBlob);
    const current = loadStoredProfile();
    const updated = {
      ...current,
      recruiterProfile: {
        ...current.recruiterProfile,
        profilePhotoUrl: dataUrl
      }
    };
    saveStoredProfile(updated);
    return {
      success: true,
      profilePhotoUrl: dataUrl
    };
  } catch (err) {
    console.error("Failed to upload/compress recruiter profile photo:", err);
    return {
      success: false,
      error: err.name === 'QuotaExceededError' ? 'Storage limit exceeded. Please choose a smaller image.' : 'Failed to save profile photo.'
    };
  }
}

export async function removeRecruiterProfilePhoto() {
  const current = loadStoredProfile();
  const updated = {
    ...current,
    recruiterProfile: {
      ...current.recruiterProfile,
      profilePhotoUrl: null
    }
  };
  saveStoredProfile(updated);
  return {
    success: true,
    profilePhotoUrl: null
  };
}
