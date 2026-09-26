import { fetchEmployerProfileService, updateCompanyProfileService } from './recruiterCompanyService';

function getStoredUser() {
  try {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function buildProfileFromData(data) {
  const user = getStoredUser();
  const fullName = data?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '') || user?.full_name || user?.name || data?.email?.split('@')[0] || '';
  const email = data?.email || user?.email || '';
  const mobileNumber = data?.company_phone || data?.phone_number || user?.company_phone || user?.phone_number || '';
  const role = data?.role || user?.role || 'RECRUITER';
  const status = data?.status || user?.status || 'Active';
  const companyName = data?.company_name || user?.company_name || 'My Company';
  const logo = data?.company_logo || user?.company_logo || null;
  const designation = data?.designation || user?.designation || 'HR Manager';

  return {
    identity: {
      fullName,
      email,
      mobileNumber,
      mobileVerified: true,
      role: role === 'HR' ? 'RECRUITER' : role,
      accountStatus: status === 'ACTIVE' || status === 'Active' ? 'Active' : status,
      lastLoginAt: data?.updated_at || data?.created_at || null
    },
    recruiterProfile: {
      profilePhotoUrl: logo,
      designation: designation,
      department: 'Human Resources'
    },
    companySummary: {
      id: data?.id || data?.user_id || user?.id,
      name: companyName,
      verificationStatus: data?.verification_status || user?.verification_status || 'PENDING',
      logo: logo
    },
    raw: data
  };
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
  try {
    const data = await fetchEmployerProfileService();
    if (data && (data.email || data.company_name)) {
      return buildProfileFromData(data);
    }
  } catch (err) {
    console.error("Error fetching live recruiter profile:", err);
  }
  const user = getStoredUser();
  if (user) {
    return buildProfileFromData(user);
  }
  return null;
}

export async function updateCurrentRecruiterProfile(payload) {
  try {
    const patchPayload = {
      designation: payload.designation,
      company_phone: payload.mobileNumber,
      company_logo: payload.company_logo || payload.profilePhotoUrl
    };
    if (payload.fullName) {
      const names = payload.fullName.trim().split(' ', 2);
      patchPayload.first_name = names[0];
      patchPayload.last_name = names[1] || '';
    }
    const res = await updateCompanyProfileService(patchPayload);
    if (res.success) {
      return { success: true, data: buildProfileFromData(res.company) };
    }
    return res;
  } catch (err) {
    console.error("Error updating recruiter profile:", err);
    return { success: false, message: "Failed to update profile." };
  }
}

export async function uploadRecruiterProfilePhoto(fileOrBlob) {
  try {
    const dataUrl = await blobToCompressedDataUrl(fileOrBlob);
    const res = await updateCompanyProfileService({ company_logo: dataUrl });
    if (res.success) {
      return {
        success: true,
        profilePhotoUrl: dataUrl
      };
    }
    return { success: false, error: res.message || 'Failed to update logo.' };
  } catch (err) {
    console.error("Failed to upload recruiter profile photo:", err);
    return {
      success: false,
      error: 'Failed to save profile photo.'
    };
  }
}

export async function removeRecruiterProfilePhoto() {
  try {
    const res = await updateCompanyProfileService({ company_logo: '' });
    if (res.success) {
      return {
        success: true,
        profilePhotoUrl: null
      };
    }
    return { success: false, error: res.message || 'Failed to remove logo.' };
  } catch (err) {
    console.error("Failed to remove recruiter profile photo:", err);
    return { success: false, error: 'Failed to remove photo.' };
  }
}
